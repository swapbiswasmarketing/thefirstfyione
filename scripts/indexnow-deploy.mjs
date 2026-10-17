#!/usr/bin/env node
/* IndexNow, the deploy step. The last command of `npm run build`, after Pagefind
   and scripts/check-dist.mjs, so a build that fails its contract test (and so
   never deploys) never announces anything either.

   It announces new and edited URLs to IndexNow (Bing, Yandex, Seznam, Naver).
   Google does not take part, so this changes nothing there; the sitemap is
   still the only signal Google gets.

   Only a production deploy on Vercel announces (VERCEL_ENV=production; see
   resolveDeployContext in src/lib/indexnow.mjs). It reads the sitemap this
   build wrote, diffs it against the sitemap the live site still serves (the
   previous deployment, which makes the live site a free record of what was
   published last time), adds anything inside the freshness window, checks the
   key file is live, and submits.

   It can fail the announcement but never the build: every module is imported
   inside the try, every path logs a reason, and the exit code is always 0. The
   pages are already built and the sitemap carries them, so the worst case of a
   failure here is that Bing finds the change on its own schedule.

   Two things it cannot avoid, both by design of a build-time step:
   - the build runs before Vercel promotes the new deployment, so a brand-new
     URL is announced a minute or so before it is live;
   - the deploy that first ships the key file skips, because the live site is
     still the previous deployment without it. Once that deploy is live, seed
     the archive once with `npm run indexnow:submit -- --all`.

   process.exit() is never called: on Windows with Node 25 it trips a libuv
   assertion after a fetch and reports exit 127. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const say = (msg) => console.log(`[indexnow] ${msg}`);
const ROOT = fileURLToPath(new URL('..', import.meta.url));

async function main() {
  const { FRESH_WINDOW_DAYS, SITEMAP_FILE } = await import(new URL('../src/config/indexnow.mjs', import.meta.url).href);
  const {
    fetchPublishedSitemap,
    parseSitemapEntries,
    resolveDeployContext,
    selectUrlsToAnnounce,
    submitUrls,
    verifyKeyFile,
  } = await import(new URL('../src/lib/indexnow.mjs', import.meta.url).href);

  /* The gate runs before any fetch, so a local build never touches the network. */
  const context = resolveDeployContext(process.env);
  if (!context.shouldSubmit) {
    say(`skipped - ${context.reason}`);
    return;
  }

  const sitemapPath = path.join(ROOT, 'dist', SITEMAP_FILE);
  if (!fs.existsSync(sitemapPath)) {
    say(`skipped - no ${SITEMAP_FILE} in dist/`);
    return;
  }
  const entries = parseSitemapEntries(fs.readFileSync(sitemapPath, 'utf8'));

  /* If the live sitemap cannot be read, pass null: that falls back to the
     window alone. Passing [] would mean "nothing was ever published" and
     announce every URL. */
  const published = await fetchPublishedSitemap({ fetchImpl: fetch });
  if (!published.ok) {
    say(`could not read the published sitemap (${published.message}); using the ${FRESH_WINDOW_DAYS}-day window alone`);
  }

  const selection = selectUrlsToAnnounce({
    currentEntries: entries,
    previousEntries: published.ok ? published.entries : null,
    now: new Date(),
    windowDays: FRESH_WINDOW_DAYS,
  });
  const urls = selection.urls;
  if (urls.length === 0) {
    say(`nothing to announce - no URL changed against the published sitemap or has a lastmod inside ${FRESH_WINDOW_DAYS} days`);
    return;
  }
  say(`${urls.length} URL(s) to announce (${selection.changed.length} changed vs published, ${selection.fresh.length} inside the ${FRESH_WINDOW_DAYS}-day window)`);

  /* The key has to be live at the origin before anything can be announced. */
  const keyCheck = await verifyKeyFile({ fetchImpl: fetch });
  if (!keyCheck.ok) {
    say(`skipped - ${keyCheck.message}`);
    return;
  }

  const result = await submitUrls({ urls, fetchImpl: fetch });
  say(result.ok ? result.message : `announcement failed - ${result.message}`);
}

main()
  .catch((error) => say(`skipped - unexpected error: ${error instanceof Error ? error.message : String(error)}`))
  .finally(() => {
    process.exitCode = 0;
  });
