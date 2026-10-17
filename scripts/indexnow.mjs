#!/usr/bin/env node
/**
 * IndexNow CLI for www.strictly.fyi
 *
 * The deploy step (scripts/indexnow-deploy.mjs, the last command of npm run build)
 * handles the normal case automatically. This is
 * for the cases it deliberately does not cover: checking the key is live, announcing a
 * URL by hand, re-announcing after a failed deploy, seeding the archive once, and
 * seeing what the next deploy would submit without submitting it.
 *
 * USAGE:
 *   node scripts/indexnow.mjs verify              Is the origin serving the key file?
 *   node scripts/indexnow.mjs status [--days N]   What WOULD be submitted
 *   node scripts/indexnow.mjs status --diff       What the next deploy would announce
 *   node scripts/indexnow.mjs submit [--days N]   Announce recently changed URLs
 *   node scripts/indexnow.mjs submit --url URL    Announce one URL (probed first)
 *   node scripts/indexnow.mjs submit --all        Announce every URL in the sitemap
 *   node scripts/indexnow.mjs key                 Print the key and its public location
 *
 * Flags:
 *   --days N     override the freshness window (default: FRESH_WINDOW_DAYS)
 *   --url URL    submit exactly this URL, repeatable
 *   --all        ignore lastmod, submit everything in the sitemap
 *   --dry-run    print the payload, make no request
 *   --sitemap P  read a LOCAL sitemap from P instead of the live site
 *   --force      skip the liveness probe on --url (announce it anyway)
 *   --diff       status only: run the deploy hook's selection on a local build
 *                (--sitemap P, default dist/sitemap-0.xml) against the live sitemap
 *
 * URLS COME FROM THE LIVE SITE BY DEFAULT, not from dist/. A local build reflects the
 * working tree, which is routinely ahead of production, and announcing a built-but-not-
 * deployed URL points the engine at a 404. --sitemap opts back into a local file.
 *
 * `submit` is the only command that announces anything. It refuses to run until the
 * key file is live (announcing against a key the origin is not serving earns a 403),
 * and it probes any URL named with --url, since those bypass the sitemap and so bypass
 * the guarantee that a URL is deployed.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  ENDPOINT,
  FRESH_WINDOW_DAYS,
  HOST,
  INDEXNOW_KEY,
  KEY_LOCATION,
  PUBLISHED_SITEMAP_URL,
  SITE_ORIGIN,
  SITEMAP_FILE,
} from '../src/config/indexnow.mjs';

import {
  buildPayload,
  fetchPublishedSitemap,
  parseSitemapEntries,
  probeUrl,
  selectFreshUrls,
  selectUrlsToAnnounce,
  submitUrls,
  verifyKeyFile,
} from '../src/lib/indexnow.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_SITEMAP = path.join(ROOT, 'dist', SITEMAP_FILE);

// ---------------------------------------------------------------- args

function parseArgs(argv) {
  const cmd = argv[2];
  const flags = {};
  const urls = [];
  for (let i = 3; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (key === 'url') {
      if (next && !next.startsWith('--')) { urls.push(next); i++; }
      continue;
    }
    if (next && !next.startsWith('--')) { flags[key] = next; i++; }
    else flags[key] = true;
  }
  return { cmd, flags, urls };
}

const { cmd, flags, urls: explicitUrls } = parseArgs(process.argv);
const WINDOW_DAYS = flags.days === undefined ? FRESH_WINDOW_DAYS : Number(flags.days);
const SITEMAP_PATH = flags.sitemap ? path.resolve(String(flags.sitemap)) : DEFAULT_SITEMAP;

// ---------------------------------------------------------------- output

/**
 * Abort the command with a message.
 *
 * Throws rather than calling process.exit(), and the top-level handler sets
 * process.exitCode instead. THIS IS NOT STYLE. Calling process.exit() while an undici
 * socket from fetch() is still open aborts the process on Windows:
 *   Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c
 * and the shell sees exit code 127, not 1. Every failure path in this CLI is reached
 * immediately after a fetch, so that assertion is the NORMAL outcome of `verify`
 * against a site that is not yet serving the key - which is exactly the state this
 * command exists to report. Setting exitCode lets the loop drain and exits 1 cleanly.
 */
class CliError extends Error {}

function die(msg) {
  throw new CliError(msg);
}

function ok(msg) {
  console.log(`\n  OK  ${msg}\n`);
}

/**
 * Read a local sitemap, or return null if it is not there.
 *
 * Whether a missing file is fatal is the CALLER's decision, not this function's:
 * `submit` cannot proceed without a URL list, but `status` reporting "you have not
 * built yet" is an answer rather than an error.
 */
function readLocalSitemap(file) {
  if (!fs.existsSync(file)) return null;
  return parseSitemapEntries(fs.readFileSync(file, 'utf8'));
}

/**
 * Where the URL list comes from.
 *
 * THE DEFAULT IS THE LIVE SITE, NOT dist/. A command run by hand must not read the
 * local build: dist/ reflects the working tree, which is routinely AHEAD of
 * production, and announcing a URL that is built but not deployed points the engine
 * at a 404, which is the one outcome this tool must never produce. (On the site this
 * was ported from, a local dist/ built while posts were still being added would have
 * announced 21 URLs, 12 of them undeployed.)
 *
 * The live sitemap contains, by construction, only URLs that are actually served, so
 * this is structural rather than a check that can be forgotten. --sitemap opts back
 * into a local file for the cases that genuinely want one (a dry run against a build
 * before deploying it), and says so in the source line.
 *
 * The deploy hook does NOT use this. It reads its own build output, which is correct
 * there: that build IS the deployment being shipped.
 */
async function loadEntries() {
  if (flags.sitemap) {
    const entries = readLocalSitemap(SITEMAP_PATH);
    return { entries, source: `local ${path.basename(SITEMAP_PATH)} (may contain undeployed URLs)` };
  }
  const published = await fetchPublishedSitemap({ fetchImpl: fetch });
  if (!published.ok) die(`could not read ${PUBLISHED_SITEMAP_URL}: ${published.message}`);
  return { entries: published.entries, source: `live sitemap at ${PUBLISHED_SITEMAP_URL}` };
}

/**
 * The URL list a command should act on: explicit --url flags win, then --all, then
 * the freshness window.
 *
 * `status` and `submit` MUST both resolve through this one function. They used to
 * differ: status gated the call on having read a non-empty sitemap, but the --url
 * branch below returns before the sitemap is ever read, so `status --url X` answered
 * "0 URLs would be submitted" while `submit --url X` announced it. A preview command
 * that disagrees with the command it previews is worse than no preview, and it
 * disagreed in the dangerous direction - it under-reported.
 */
async function resolveUrls({ requireSitemap = true } = {}) {
  if (explicitUrls.length) {
    return { urls: explicitUrls, source: `${explicitUrls.length} --url flag(s)`, entries: null };
  }
  const { entries, source } = await loadEntries();
  if (entries === null) {
    if (requireSitemap) {
      die(`no sitemap at ${SITEMAP_PATH}\n         Run \`npm run build\` first, or drop --sitemap to use the live site.`);
    }
    return { urls: [], source: 'no sitemap built yet', entries: null };
  }
  if (flags.all) {
    return { urls: entries.map((e) => e.loc), source: `every URL in the ${source}`, entries };
  }
  const fresh = selectFreshUrls(entries, new Date(), WINDOW_DAYS);
  return { urls: fresh, source: `lastmod within ${WINDOW_DAYS} day(s), from the ${source}`, entries };
}

/**
 * `status --diff`: the deploy hook's own selection, run by hand.
 *
 * Plain `status` previews `submit`, which uses the window alone. The deploy hook
 * announces more than that - the union of the window and the diff against the live
 * sitemap - so plain `status` under-reports what a push will announce. This reads a
 * LOCAL build (it has to: the next deploy does not exist yet) and diffs it against
 * the live sitemap exactly as the hook does, falling back to the window alone when
 * the live sitemap cannot be read. It is a preview only; nothing here announces.
 */
async function resolveDeployPreview() {
  if (explicitUrls.length || flags.all) die('--diff previews the deploy hook and does not combine with --url or --all');
  const local = readLocalSitemap(SITEMAP_PATH);
  if (local === null) {
    die(`no sitemap at ${SITEMAP_PATH}\n         Run \`npm run build\` first, or pass --sitemap PATH to a built sitemap-0.xml.`);
  }
  const published = await fetchPublishedSitemap({ fetchImpl: fetch });
  const selection = selectUrlsToAnnounce({
    currentEntries: local,
    previousEntries: published.ok ? published.entries : null,
    now: new Date(),
    windowDays: WINDOW_DAYS,
  });
  const how = published.ok
    ? `${selection.changed.length} changed vs the live sitemap, ${selection.fresh.length} inside the ${WINDOW_DAYS}-day window`
    : `live sitemap unreadable (${published.message}), so the ${WINDOW_DAYS}-day window alone`;
  return { urls: selection.urls, source: `deploy-hook preview of local ${path.basename(SITEMAP_PATH)}: ${how}`, entries: local };
}

// ---------------------------------------------------------------- commands

async function cmdVerify() {
  console.log(`\n  Checking ${KEY_LOCATION}`);
  const result = await verifyKeyFile({ fetchImpl: fetch });
  if (!result.ok) {
    die(
      `${result.message}\n` +
      `         If this is the first deploy that added the key file, this is expected:\n` +
      `         the file is in the build but the production domain still serves the\n` +
      `         previous deployment. Re-run once the new deployment is live.`
    );
  }
  ok(result.message);
}

async function cmdStatus() {
  // The source line describes WHERE the URLs come from; the selection lines describe
  // what would be submitted. Keeping them separate is why an existing-but-empty local
  // sitemap reports "(0 URLs)" rather than "(not built)" - it was read, it was empty.
  const { urls, source, entries } = flags.diff ? await resolveDeployPreview() : await resolveUrls({ requireSitemap: false });
  const origin = flags.sitemap || flags.diff ? SITEMAP_PATH : PUBLISHED_SITEMAP_URL;
  console.log('');
  console.log(`  key           ${INDEXNOW_KEY}`);
  console.log(`  keyLocation   ${KEY_LOCATION}`);
  console.log(`  host          ${HOST}`);
  console.log(`  endpoint      ${ENDPOINT}`);
  console.log(`  sitemap       ${origin}${entries ? ` (${entries.length} URLs)` : ' (not built)'}`);
  console.log(`  window        ${WINDOW_DAYS} day(s)`);
  console.log(`  selection     ${source}`);
  console.log('');
  console.log(`  ${urls.length} URL(s) would be submitted:`);
  for (const url of urls.slice(0, 50)) console.log(`    ${url}`);
  if (urls.length > 50) console.log(`    ... and ${urls.length - 50} more`);
  console.log('');
}

async function cmdSubmit() {
  // Checked before anything is read: a deploy preview built from a local sitemap must
  // never turn into an announcement of URLs that are not deployed yet.
  if (flags.diff) die('--diff is a status preview of the deploy hook; submit never announces from a local build diff');

  const { urls, source } = await resolveUrls();
  if (!urls.length) {
    ok(`nothing to submit (${source})`);
    return;
  }

  console.log(`\n  ${urls.length} URL(s) selected by: ${source}`);

  if (flags['dry-run']) {
    const payload = buildPayload({ host: HOST, key: INDEXNOW_KEY, keyLocation: KEY_LOCATION, urls });
    console.log(`\n  POST ${ENDPOINT}`);
    console.log(JSON.stringify(payload, null, 2));
    ok('dry run, nothing submitted');
    return;
  }

  // Refuse to announce against a key the origin is not serving: the endpoint would
  // answer 403 for the whole batch, and the failure would look like a code bug.
  const check = await verifyKeyFile({ fetchImpl: fetch });
  if (!check.ok) die(`${check.message}\n         Run \`npm run indexnow:verify\` for detail.`);
  console.log(`  key file verified: ${check.message}`);

  // URLs named with --url skipped the sitemap, so nothing has established they are
  // deployed. Probe them. A URL taken from a sitemap is deployed by construction and
  // needs no probe, which is what keeps this from costing a request per URL on the
  // normal path. --force is for announcing a page that is live but not yet in the
  // sitemap, which is legitimate but should be a deliberate act.
  let toSubmit = urls;
  if (explicitUrls.length && !flags.force) {
    const live = [];
    for (const url of urls) {
      const probe = await probeUrl({ url, fetchImpl: fetch });
      console.log(`  probe ${url} -> ${probe.message}`);
      if (probe.ok) live.push(url);
    }
    const refused = urls.length - live.length;
    if (refused) {
      console.log(`  refusing ${refused} URL(s) that are not served (pass --force to override)`);
    }
    if (!live.length) die('none of the named URLs are served; nothing submitted');
    toSubmit = live;
  }

  const result = await submitUrls({ urls: toSubmit, fetchImpl: fetch });
  for (const batch of result.batches) {
    console.log(`  batch of ${batch.count}: HTTP ${batch.status ?? 'n/a'} - ${batch.message}`);
  }
  if (result.dropped.length) {
    console.log(`  dropped ${result.dropped.length} URL(s) not on ${SITE_ORIGIN}`);
  }
  if (!result.ok) die(result.message);
  ok(result.message);
}

function cmdKey() {
  console.log('');
  console.log(`  key           ${INDEXNOW_KEY}`);
  console.log(`  file          public/${INDEXNOW_KEY}.txt`);
  console.log(`  keyLocation   ${KEY_LOCATION}`);
  console.log('');
  console.log('  This key is public by design. The protocol proves ownership by serving');
  console.log('  it back from this origin, so it belongs in the repo, not an env var.');
  console.log('');
}

function usage() {
  console.log(`
  IndexNow CLI - www.strictly.fyi

    verify              Is the origin serving the key file?
    status [--days N]   What WOULD be submitted
    status --diff       What the next deploy would announce (local build vs live)
    submit [--days N]   Announce recently changed URLs
    submit --url URL    Announce one URL, repeatable (probed first)
    submit --all        Announce every URL in the sitemap
    key                 Print the key and its public location

  Flags: --days N  --url URL  --all  --dry-run  --sitemap PATH  --force  --diff

  URLs come from the live site by default, not dist/, so a built-but-undeployed
  page can never be announced. --sitemap PATH opts into a local file.
`);
}

// ---------------------------------------------------------------- main

const commands = {
  verify: cmdVerify,
  status: cmdStatus,
  submit: cmdSubmit,
  key: cmdKey,
};

const handler = commands[cmd];
if (!handler) {
  usage();
  // An unknown command is an error; a bare invocation asking for help is not.
  process.exitCode = cmd ? 1 : 0;
} else {
  try {
    // Checked here rather than at parse time so the failure goes through the CLI's own
    // error path. `--days abc` is Number() -> NaN, and a NaN window would select every
    // dated URL in the sitemap instead of none, so a typo must stop the command dead.
    if (!Number.isFinite(WINDOW_DAYS) || WINDOW_DAYS < 0) {
      die(`--days must be a non-negative number, got "${flags.days}"`);
    }
    await handler();
  } catch (error) {
    const detail = error instanceof CliError ? error.message : error?.stack || error?.message || String(error);
    console.error(`\n  ERROR  ${detail}\n`);
    process.exitCode = 1;
  }
}
