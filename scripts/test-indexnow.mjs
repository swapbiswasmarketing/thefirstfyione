#!/usr/bin/env node
/**
 * Offline test suite for the IndexNow integration.
 *
 * Runs with no network and no real clock: every test that touches fetch passes a stub,
 * and every test that depends on "now" passes a fixed Date. That is the whole reason
 * src/lib/indexnow.mjs takes `fetchImpl` and `now` as arguments instead of reaching for
 * globals - it means this suite can assert the 403 path, the timeout path and the
 * first-deploy 404 path without ever being able to announce a URL by accident.
 *
 * Ported from the swapbiswas.com suite with the fixtures moved to www.strictly.fyi,
 * plus cases for the www-primary host and the CLI's `status --diff` preview. Nothing
 * here writes into dist/: the one case that needs a file on disk uses a temp dir.
 *
 * USAGE:
 *   node scripts/test-indexnow.mjs   (or npm run test:indexnow once that script exists)
 *
 * Exits 1 on any failure so it can gate a commit or a CI step.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import {
  ENDPOINT,
  FRESH_WINDOW_DAYS,
  HOST,
  INDEXNOW_KEY,
  KEY_LOCATION,
  KEY_PATTERN,
  MAX_URLS_PER_REQUEST,
  PUBLISHED_SITEMAP_URL,
  REQUEST_TIMEOUT_MS,
  SITE_ORIGIN,
  SITEMAP_FILE,
} from '../src/config/indexnow.mjs';

import {
  buildPayload,
  chunkUrls,
  classifyResponse,
  daysBetween,
  diffSitemaps,
  fetchPublishedSitemap,
  filterUrlsForOrigin,
  isValidKey,
  keyFilePath,
  parseSitemapEntries,
  probeUrl,
  resolveDeployContext,
  selectFreshUrls,
  selectUrlsToAnnounce,
  submitBatch,
  submitUrls,
  validatePayload,
  verifyKeyFile,
} from '../src/lib/indexnow.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

let pass = 0;
let fail = 0;
const failures = [];

/**
 * Run one assertion. Never throws - a thrown assert is recorded and the suite
 * continues, so one broken expectation does not hide the other 60 results.
 */
function test(name, fn) {
  try {
    fn();
    pass++;
    console.log(`PASS - ${name}`);
  } catch (error) {
    fail++;
    failures.push({ name, message: error?.message || String(error) });
    console.log(`FAIL - ${name}\n       ${error?.message || error}`);
  }
}

async function testAsync(name, fn) {
  try {
    await fn();
    pass++;
    console.log(`PASS - ${name}`);
  } catch (error) {
    fail++;
    failures.push({ name, message: error?.message || String(error) });
    console.log(`FAIL - ${name}\n       ${error?.message || error}`);
  }
}

/** A fetch stub that records calls and replays a scripted response. */
function stubFetch(responses) {
  const calls = [];
  const queue = Array.isArray(responses) ? [...responses] : [responses];
  const impl = async (url, options) => {
    calls.push({ url, options });
    const next = queue.length > 1 ? queue.shift() : queue[0];
    if (next instanceof Error) throw next;
    if (typeof next === 'function') return next(url, options);
    return {
      ok: next.status >= 200 && next.status < 300,
      status: next.status,
      text: async () => next.body ?? '',
    };
  };
  impl.calls = calls;
  return impl;
}

/**
 * A fetch whose headers arrive cleanly and whose BODY then fails, which is what a
 * connection reset mid-response looks like from undici. Distinct from a failed request:
 * response.ok is true and the status is 200, so only reading the body reveals it.
 */
function bodyFailsFetch(message = 'terminated (cause: other side closed)') {
  return async () => ({
    ok: true,
    status: 200,
    text: async () => {
      throw new TypeError(message);
    },
  });
}

const NOW = new Date('2026-09-16T12:00:00Z');

// ============================================================ config

console.log('\n--- config ---');

test('INDEXNOW_KEY matches the spec charset and length', () => {
  assert.ok(KEY_PATTERN.test(INDEXNOW_KEY));
});

test('INDEXNOW_KEY is 32 characters', () => {
  assert.equal(INDEXNOW_KEY.length, 32);
});

test('HOST has no scheme and no trailing slash', () => {
  assert.equal(HOST, 'www.strictly.fyi');
  assert.ok(!HOST.includes('://'));
  assert.ok(!HOST.endsWith('/'));
});

test('SITE_ORIGIN is https and has no trailing slash', () => {
  assert.ok(SITE_ORIGIN.startsWith('https://'));
  assert.ok(!SITE_ORIGIN.endsWith('/'));
});

test('SITE_ORIGIN host equals HOST', () => {
  assert.equal(new URL(SITE_ORIGIN).host, HOST);
});

test('KEY_LOCATION is the key file at the origin root', () => {
  assert.equal(KEY_LOCATION, `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`);
});

test('KEY_LOCATION has exactly one path segment (root-scoped key)', () => {
  assert.equal(new URL(KEY_LOCATION).pathname.split('/').filter(Boolean).length, 1);
});

test('ENDPOINT is the shared IndexNow endpoint over https', () => {
  assert.equal(ENDPOINT, 'https://api.indexnow.org/indexnow');
});

test('MAX_URLS_PER_REQUEST is the protocol cap of 10000', () => {
  assert.equal(MAX_URLS_PER_REQUEST, 10000);
});

test('FRESH_WINDOW_DAYS is a positive integer', () => {
  assert.ok(Number.isInteger(FRESH_WINDOW_DAYS) && FRESH_WINDOW_DAYS > 0);
});

test('REQUEST_TIMEOUT_MS is set and under a minute', () => {
  assert.ok(REQUEST_TIMEOUT_MS > 0 && REQUEST_TIMEOUT_MS <= 60000);
});

test('SITEMAP_FILE is the file @astrojs/sitemap writes, lastmod included', () => {
  assert.equal(SITEMAP_FILE, 'sitemap-0.xml');
});

// ============================================================ key file on disk

console.log('\n--- key file ---');

const keyFileAbs = path.join(ROOT, 'public', `${INDEXNOW_KEY}.txt`);

test('key file exists in public/', () => {
  assert.ok(fs.existsSync(keyFileAbs), `missing ${keyFileAbs}`);
});

test('key file basename equals the configured key', () => {
  assert.equal(path.basename(keyFileAbs, '.txt'), INDEXNOW_KEY);
});

test('key file contains exactly the key, byte for byte', () => {
  assert.equal(fs.readFileSync(keyFileAbs, 'utf8'), INDEXNOW_KEY);
});

test('key file has no trailing newline', () => {
  const raw = fs.readFileSync(keyFileAbs, 'utf8');
  assert.ok(!raw.endsWith('\n') && !raw.endsWith('\r'));
});

test('key file byte length equals key length', () => {
  assert.equal(fs.statSync(keyFileAbs).size, INDEXNOW_KEY.length);
});

test('exactly one IndexNow key file exists in public/', () => {
  const candidates = fs
    .readdirSync(path.join(ROOT, 'public'))
    .filter((f) => /^[a-zA-Z0-9-]{8,128}\.txt$/.test(f) && f !== 'robots.txt' && f !== 'llms.txt');
  assert.equal(candidates.length, 1, `found: ${candidates.join(', ') || 'none'}`);
});

// ============================================================ isValidKey

console.log('\n--- isValidKey ---');

test('isValidKey accepts the configured key', () => {
  assert.equal(isValidKey(INDEXNOW_KEY), true);
});

test('isValidKey accepts the 8-char minimum', () => {
  assert.equal(isValidKey('a'.repeat(8)), true);
});

test('isValidKey accepts the 128-char maximum', () => {
  assert.equal(isValidKey('a'.repeat(128)), true);
});

test('isValidKey accepts hyphens', () => {
  assert.equal(isValidKey('abcd-efgh-1234'), true);
});

test('isValidKey rejects 7 chars', () => {
  assert.equal(isValidKey('a'.repeat(7)), false);
});

test('isValidKey rejects 129 chars', () => {
  assert.equal(isValidKey('a'.repeat(129)), false);
});

test('isValidKey rejects an underscore', () => {
  assert.equal(isValidKey('abcd_efgh'), false);
});

test('isValidKey rejects internal whitespace', () => {
  assert.equal(isValidKey('abcd efgh'), false);
});

test('isValidKey rejects a trailing newline', () => {
  assert.equal(isValidKey(`${INDEXNOW_KEY}\n`), false);
});

test('isValidKey rejects non-strings', () => {
  assert.equal(isValidKey(null), false);
  assert.equal(isValidKey(undefined), false);
  assert.equal(isValidKey(12345678), false);
  assert.equal(isValidKey({}), false);
});

test('keyFilePath builds a root-relative .txt path', () => {
  assert.equal(keyFilePath('abc12345'), '/abc12345.txt');
});

// ============================================================ resolveDeployContext

console.log('\n--- resolveDeployContext ---');

test('a bare local build does not submit', () => {
  const r = resolveDeployContext({});
  assert.equal(r.shouldSubmit, false);
  assert.match(r.reason, /local build/);
});

test('a Vercel production deploy submits', () => {
  const r = resolveDeployContext({ VERCEL: '1', VERCEL_ENV: 'production' });
  assert.equal(r.shouldSubmit, true);
  assert.match(r.reason, /production deploy/);
});

test('a Vercel preview deploy does not submit', () => {
  const r = resolveDeployContext({ VERCEL: '1', VERCEL_ENV: 'preview' });
  assert.equal(r.shouldSubmit, false);
  assert.match(r.reason, /VERCEL_ENV=preview/);
});

test('a Vercel development deploy does not submit', () => {
  assert.equal(resolveDeployContext({ VERCEL: '1', VERCEL_ENV: 'development' }).shouldSubmit, false);
});

test('VERCEL=1 with no VERCEL_ENV does not submit', () => {
  const r = resolveDeployContext({ VERCEL: '1' });
  assert.equal(r.shouldSubmit, false);
  assert.match(r.reason, /unset/);
});

test('INDEXNOW_FORCE=1 submits from a local build', () => {
  const r = resolveDeployContext({ INDEXNOW_FORCE: '1' });
  assert.equal(r.shouldSubmit, true);
  assert.match(r.reason, /forced/);
});

test('INDEXNOW_DISABLE=1 beats a production deploy', () => {
  const r = resolveDeployContext({ VERCEL: '1', VERCEL_ENV: 'production', INDEXNOW_DISABLE: '1' });
  assert.equal(r.shouldSubmit, false);
  assert.match(r.reason, /kill switch/);
});

test('INDEXNOW_DISABLE=1 beats INDEXNOW_FORCE=1', () => {
  assert.equal(resolveDeployContext({ INDEXNOW_FORCE: '1', INDEXNOW_DISABLE: '1' }).shouldSubmit, false);
});

test('a truthy-but-not-1 disable value does not arm the kill switch', () => {
  assert.equal(resolveDeployContext({ VERCEL: '1', VERCEL_ENV: 'production', INDEXNOW_DISABLE: 'true' }).shouldSubmit, true);
});

test('resolveDeployContext tolerates a null env', () => {
  assert.equal(resolveDeployContext(null).shouldSubmit, false);
});

test('every reason string is non-empty', () => {
  for (const env of [{}, { VERCEL: '1', VERCEL_ENV: 'production' }, { VERCEL: '1', VERCEL_ENV: 'preview' }]) {
    assert.ok(resolveDeployContext(env).reason.length > 0);
  }
});

// ============================================================ parseSitemapEntries

console.log('\n--- parseSitemapEntries ---');

const SAMPLE_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://www.strictly.fyi/</loc></url>
<url><loc>https://www.strictly.fyi/blog/alpha/</loc><lastmod>2026-09-15</lastmod></url>
<url><loc>https://www.strictly.fyi/blog/beta/</loc><lastmod>2026-01-02</lastmod></url>
<url><loc>https://www.strictly.fyi/about/</loc></url>
</urlset>`;

test('parses every <url> block', () => {
  assert.equal(parseSitemapEntries(SAMPLE_SITEMAP).length, 4);
});

test('reads loc and lastmod together', () => {
  const e = parseSitemapEntries(SAMPLE_SITEMAP)[1];
  assert.equal(e.loc, 'https://www.strictly.fyi/blog/alpha/');
  assert.equal(e.lastmod, '2026-09-15');
});

test('a url with no lastmod yields null, not a dropped entry', () => {
  const e = parseSitemapEntries(SAMPLE_SITEMAP)[0];
  assert.equal(e.loc, 'https://www.strictly.fyi/');
  assert.equal(e.lastmod, null);
});

test('preserves sitemap order', () => {
  const locs = parseSitemapEntries(SAMPLE_SITEMAP).map((e) => e.loc);
  assert.deepEqual(locs, [
    'https://www.strictly.fyi/',
    'https://www.strictly.fyi/blog/alpha/',
    'https://www.strictly.fyi/blog/beta/',
    'https://www.strictly.fyi/about/',
  ]);
});

test('tolerates whitespace inside tags', () => {
  const xml = '<urlset><url>\n  <loc> https://www.strictly.fyi/x/ </loc>\n  <lastmod> 2026-09-15 </lastmod>\n</url></urlset>';
  const e = parseSitemapEntries(xml)[0];
  assert.equal(e.loc, 'https://www.strictly.fyi/x/');
  assert.equal(e.lastmod, '2026-09-15');
});

test('returns [] for an empty string', () => {
  assert.deepEqual(parseSitemapEntries(''), []);
});

test('returns [] for a non-string', () => {
  assert.deepEqual(parseSitemapEntries(null), []);
  assert.deepEqual(parseSitemapEntries(undefined), []);
});

test('returns [] for XML with no <url> blocks', () => {
  assert.deepEqual(parseSitemapEntries('<urlset></urlset>'), []);
});

test('skips a <url> block with no <loc>', () => {
  assert.deepEqual(parseSitemapEntries('<urlset><url><lastmod>2026-09-15</lastmod></url></urlset>'), []);
});

// ============================================================ daysBetween / selectFreshUrls

console.log('\n--- selectFreshUrls ---');

test('daysBetween counts whole days', () => {
  assert.equal(daysBetween(new Date('2026-09-14T00:00:00Z'), new Date('2026-09-16T00:00:00Z')), 2);
});

test('daysBetween is negative for a future date', () => {
  assert.equal(daysBetween(new Date('2026-09-18T00:00:00Z'), new Date('2026-09-16T00:00:00Z')), -2);
});

const FRESH_ENTRIES = [
  { loc: 'https://www.strictly.fyi/blog/today/', lastmod: '2026-09-16' },
  { loc: 'https://www.strictly.fyi/blog/edge/', lastmod: '2026-09-09' },
  { loc: 'https://www.strictly.fyi/blog/stale/', lastmod: '2026-01-01' },
  { loc: 'https://www.strictly.fyi/about/', lastmod: null },
];

test('keeps a URL modified today', () => {
  assert.ok(selectFreshUrls(FRESH_ENTRIES, NOW, 7).includes('https://www.strictly.fyi/blog/today/'));
});

test('drops a URL older than the window', () => {
  assert.ok(!selectFreshUrls(FRESH_ENTRIES, NOW, 7).includes('https://www.strictly.fyi/blog/stale/'));
});

test('drops entries with no lastmod', () => {
  assert.ok(!selectFreshUrls(FRESH_ENTRIES, NOW, 7).includes('https://www.strictly.fyi/about/'));
});

test('a lastmod exactly at the window edge is kept', () => {
  const entries = [{ loc: 'https://www.strictly.fyi/blog/edge/', lastmod: '2026-09-09' }];
  assert.equal(selectFreshUrls(entries, NOW, 7).length, 1);
});

test('a lastmod one day past the window is dropped', () => {
  const entries = [{ loc: 'https://www.strictly.fyi/blog/past/', lastmod: '2026-09-08' }];
  assert.equal(selectFreshUrls(entries, NOW, 7).length, 0);
});

test('a future lastmod is kept (scheduled posts)', () => {
  const entries = [{ loc: 'https://www.strictly.fyi/blog/future/', lastmod: '2026-09-20' }];
  assert.equal(selectFreshUrls(entries, NOW, 7).length, 1);
});

test('an unparseable lastmod is dropped, not thrown on', () => {
  const entries = [{ loc: 'https://www.strictly.fyi/blog/bad/', lastmod: 'not-a-date' }];
  assert.deepEqual(selectFreshUrls(entries, NOW, 7), []);
});

test('duplicate locs are deduped', () => {
  const entries = [
    { loc: 'https://www.strictly.fyi/blog/dup/', lastmod: '2026-09-16' },
    { loc: 'https://www.strictly.fyi/blog/dup/', lastmod: '2026-09-15' },
  ];
  assert.equal(selectFreshUrls(entries, NOW, 7).length, 1);
});

test('result keeps sitemap order', () => {
  assert.deepEqual(selectFreshUrls(FRESH_ENTRIES, NOW, 7), [
    'https://www.strictly.fyi/blog/today/',
    'https://www.strictly.fyi/blog/edge/',
  ]);
});

test('tolerates a null entry list', () => {
  assert.deepEqual(selectFreshUrls(null, NOW, 7), []);
});

test('a window of 0 keeps only today and later', () => {
  assert.deepEqual(selectFreshUrls(FRESH_ENTRIES, NOW, 0), ['https://www.strictly.fyi/blog/today/']);
});

test('a NaN window throws instead of selecting everything', () => {
  // `age > NaN` is always false, so the unguarded version would return every dated URL.
  assert.throws(() => selectFreshUrls(FRESH_ENTRIES, NOW, NaN), TypeError);
});

test('a negative window throws', () => {
  assert.throws(() => selectFreshUrls(FRESH_ENTRIES, NOW, -1), TypeError);
});

test('an Infinity window throws', () => {
  assert.throws(() => selectFreshUrls(FRESH_ENTRIES, NOW, Infinity), TypeError);
});

test('a full ISO lastmod, the format sitemap 9 writes via serialize(), reads like a date', () => {
  // @astrojs/sitemap passes lastmod through the sitemap package, which normalises
  // "2026-09-15" to "2026-09-15T00:00:00.000Z". Selection must treat both the same.
  const entries = [
    { loc: 'https://www.strictly.fyi/blog/iso-fresh/', lastmod: '2026-09-15T00:00:00.000Z' },
    { loc: 'https://www.strictly.fyi/blog/iso-stale/', lastmod: '2026-09-08T00:00:00.000Z' },
  ];
  assert.deepEqual(selectFreshUrls(entries, NOW, 7), ['https://www.strictly.fyi/blog/iso-fresh/']);
});

test('parse + select composes end to end', () => {
  const urls = selectFreshUrls(parseSitemapEntries(SAMPLE_SITEMAP), NOW, 7);
  assert.deepEqual(urls, ['https://www.strictly.fyi/blog/alpha/']);
});

// ============================================================ diffSitemaps

console.log('\n--- diffSitemaps ---');

const PREV = [
  { loc: 'https://www.strictly.fyi/blog/a/', lastmod: '2026-01-01' },
  { loc: 'https://www.strictly.fyi/blog/b/', lastmod: '2026-01-01' },
  { loc: 'https://www.strictly.fyi/about/', lastmod: null },
];

test('a brand new URL counts as changed', () => {
  const cur = [...PREV, { loc: 'https://www.strictly.fyi/blog/new/', lastmod: '2026-09-16' }];
  assert.deepEqual(diffSitemaps(PREV, cur), ['https://www.strictly.fyi/blog/new/']);
});

test('a new URL with NO lastmod still counts (the window cannot see these)', () => {
  // A new static page such as /privacy/ has no frontmatter date, so it never enters the window.
  const cur = [...PREV, { loc: 'https://www.strictly.fyi/privacy/', lastmod: null }];
  assert.deepEqual(diffSitemaps(PREV, cur), ['https://www.strictly.fyi/privacy/']);
});

test('a changed lastmod counts as changed', () => {
  const cur = PREV.map((e) => (e.loc.endsWith('/a/') ? { ...e, lastmod: '2026-09-16' } : e));
  assert.deepEqual(diffSitemaps(PREV, cur), ['https://www.strictly.fyi/blog/a/']);
});

test('an identical sitemap yields no changes', () => {
  assert.deepEqual(diffSitemaps(PREV, PREV), []);
});

test('two entries both lacking lastmod are unchanged, not changed', () => {
  // Otherwise every static page re-announces on every single deploy.
  assert.deepEqual(diffSitemaps([{ loc: 'https://www.strictly.fyi/about/', lastmod: null }], [{ loc: 'https://www.strictly.fyi/about/', lastmod: null }]), []);
});

test('a lastmod appearing where there was none counts as changed', () => {
  const prev = [{ loc: 'https://www.strictly.fyi/x/', lastmod: null }];
  const cur = [{ loc: 'https://www.strictly.fyi/x/', lastmod: '2026-09-16' }];
  assert.deepEqual(diffSitemaps(prev, cur), ['https://www.strictly.fyi/x/']);
});

test('a removed URL is not reported (nothing to announce for a deletion)', () => {
  assert.deepEqual(diffSitemaps(PREV, [PREV[0]]), []);
});

test('an empty previous sitemap makes every current URL new', () => {
  assert.equal(diffSitemaps([], PREV).length, 3);
});

test('diffSitemaps tolerates null inputs', () => {
  assert.deepEqual(diffSitemaps(null, null), []);
  assert.deepEqual(diffSitemaps(null, PREV).length, 3);
});

test('result keeps current-sitemap order', () => {
  const cur = [
    { loc: 'https://www.strictly.fyi/blog/z/', lastmod: '2026-09-16' },
    { loc: 'https://www.strictly.fyi/blog/a/', lastmod: '2026-09-16' },
  ];
  assert.deepEqual(diffSitemaps(PREV, cur), ['https://www.strictly.fyi/blog/z/', 'https://www.strictly.fyi/blog/a/']);
});

// ============================================================ selectUrlsToAnnounce

console.log('\n--- selectUrlsToAnnounce (the union) ---');

test('the diff catches an edit whose lastmod aged out of the window', () => {
  // THE LIMITATION THE UNION EXISTS TO REMOVE. Edited 30 days ago, never deployed
  // since. The window alone would miss it forever.
  const previous = [{ loc: 'https://www.strictly.fyi/blog/a/', lastmod: '2026-01-01' }];
  const current = [{ loc: 'https://www.strictly.fyi/blog/a/', lastmod: '2026-08-17' }];
  assert.deepEqual(selectFreshUrls(current, NOW, 7), [], 'window alone should miss it');
  const r = selectUrlsToAnnounce({ currentEntries: current, previousEntries: previous, now: NOW, windowDays: 7 });
  assert.deepEqual(r.urls, ['https://www.strictly.fyi/blog/a/']);
});

test('the window catches a second same-day edit the diff cannot see', () => {
  // lastmod is date-only, so both edits produce the same string and the diff is blind.
  const previous = [{ loc: 'https://www.strictly.fyi/blog/a/', lastmod: '2026-09-16' }];
  const current = [{ loc: 'https://www.strictly.fyi/blog/a/', lastmod: '2026-09-16' }];
  assert.deepEqual(diffSitemaps(previous, current), [], 'diff alone should miss it');
  const r = selectUrlsToAnnounce({ currentEntries: current, previousEntries: previous, now: NOW, windowDays: 7 });
  assert.deepEqual(r.urls, ['https://www.strictly.fyi/blog/a/']);
});

test('the union deduplicates a URL both signals select', () => {
  const previous = [{ loc: 'https://www.strictly.fyi/blog/a/', lastmod: '2026-01-01' }];
  const current = [{ loc: 'https://www.strictly.fyi/blog/a/', lastmod: '2026-09-16' }];
  const r = selectUrlsToAnnounce({ currentEntries: current, previousEntries: previous, now: NOW, windowDays: 7 });
  assert.equal(r.urls.length, 1);
  assert.equal(r.fresh.length, 1);
  assert.equal(r.changed.length, 1);
});

test('an unchanged, stale sitemap announces nothing', () => {
  const same = [{ loc: 'https://www.strictly.fyi/blog/a/', lastmod: '2026-01-01' }];
  assert.deepEqual(selectUrlsToAnnounce({ currentEntries: same, previousEntries: same, now: NOW, windowDays: 7 }).urls, []);
});

test('previousEntries null falls back to the window alone', () => {
  // Must NOT be read as "nothing published yet" - that would announce the whole site.
  const current = [
    { loc: 'https://www.strictly.fyi/blog/fresh/', lastmod: '2026-09-16' },
    { loc: 'https://www.strictly.fyi/blog/stale/', lastmod: '2026-01-01' },
  ];
  const r = selectUrlsToAnnounce({ currentEntries: current, previousEntries: null, now: NOW, windowDays: 7 });
  assert.deepEqual(r.urls, ['https://www.strictly.fyi/blog/fresh/']);
  assert.deepEqual(r.changed, []);
});

test('previousEntries [] DOES mean everything is new', () => {
  const current = [{ loc: 'https://www.strictly.fyi/blog/stale/', lastmod: '2026-01-01' }];
  const r = selectUrlsToAnnounce({ currentEntries: current, previousEntries: [], now: NOW, windowDays: 7 });
  assert.deepEqual(r.urls, ['https://www.strictly.fyi/blog/stale/']);
});

test('the union preserves current-sitemap order', () => {
  const previous = [];
  const current = [
    { loc: 'https://www.strictly.fyi/b/', lastmod: '2026-01-01' },
    { loc: 'https://www.strictly.fyi/a/', lastmod: '2026-09-16' },
  ];
  const r = selectUrlsToAnnounce({ currentEntries: current, previousEntries: previous, now: NOW, windowDays: 7 });
  assert.deepEqual(r.urls, ['https://www.strictly.fyi/b/', 'https://www.strictly.fyi/a/']);
});

test('the first deploy with lastmod flags every newly dated URL, undated pages stay quiet', () => {
  // The live sitemap had no lastmod at all before this site started writing it, so the
  // deploy that adds lastmod sees every dated URL as changed. That deploy also adds the
  // key file, so verifyKeyFile() skips it ("not serving the key yet") and the one-off
  // flood is never sent. Asserted so the expectation is written down, not folklore.
  const previous = [
    { loc: 'https://www.strictly.fyi/', lastmod: null },
    { loc: 'https://www.strictly.fyi/about/', lastmod: null },
    { loc: 'https://www.strictly.fyi/blog/old-entry/', lastmod: null },
  ];
  const current = [
    { loc: 'https://www.strictly.fyi/', lastmod: '2026-09-16T00:00:00.000Z' },
    { loc: 'https://www.strictly.fyi/about/', lastmod: null },
    { loc: 'https://www.strictly.fyi/blog/old-entry/', lastmod: '2026-07-01T00:00:00.000Z' },
  ];
  const r = selectUrlsToAnnounce({ currentEntries: current, previousEntries: previous, now: NOW, windowDays: 7 });
  assert.deepEqual(r.urls, ['https://www.strictly.fyi/', 'https://www.strictly.fyi/blog/old-entry/']);
});

test('the union reports both signals separately for logging', () => {
  const previous = [{ loc: 'https://www.strictly.fyi/old/', lastmod: '2026-01-01' }];
  const current = [
    { loc: 'https://www.strictly.fyi/old/', lastmod: '2026-01-01' },
    { loc: 'https://www.strictly.fyi/new/', lastmod: '2026-09-16' },
  ];
  const r = selectUrlsToAnnounce({ currentEntries: current, previousEntries: previous, now: NOW, windowDays: 7 });
  assert.deepEqual(r.fresh, ['https://www.strictly.fyi/new/']);
  assert.deepEqual(r.changed, ['https://www.strictly.fyi/new/']);
});

// ============================================================ fetchPublishedSitemap

console.log('\n--- fetchPublishedSitemap ---');

await testAsync('parses a served sitemap', async () => {
  const f = stubFetch({ status: 200, body: SAMPLE_SITEMAP });
  const r = await fetchPublishedSitemap({ fetchImpl: f });
  assert.equal(r.ok, true);
  assert.equal(r.entries.length, 4);
});

await testAsync('appends a cache buster so a stale edge copy is not compared against', async () => {
  const f = stubFetch({ status: 200, body: SAMPLE_SITEMAP });
  await fetchPublishedSitemap({ fetchImpl: f, cacheBuster: 'abc123' });
  assert.match(f.calls[0].url, /indexnow-diff=abc123/);
});

await testAsync('targets the published sitemap URL', async () => {
  const f = stubFetch({ status: 200, body: SAMPLE_SITEMAP });
  await fetchPublishedSitemap({ fetchImpl: f });
  assert.ok(f.calls[0].url.startsWith(PUBLISHED_SITEMAP_URL));
});

await testAsync('a 404 returns entries null, NOT an empty array', async () => {
  // [] would mean "nothing was ever published" and announce the whole site.
  const r = await fetchPublishedSitemap({ fetchImpl: stubFetch({ status: 404, body: '' }) });
  assert.equal(r.ok, false);
  assert.equal(r.entries, null);
});

await testAsync('a network error returns entries null and does not throw', async () => {
  const r = await fetchPublishedSitemap({ fetchImpl: stubFetch(new Error('ENOTFOUND')) });
  assert.equal(r.ok, false);
  assert.equal(r.entries, null);
  assert.match(r.message, /could not fetch/);
});

await testAsync('a connection dropped MID-BODY returns entries null, it does not throw', async () => {
  // If this throws, the hook's outer catch swallows it and the deploy announces NOTHING,
  // skipping the window fallback that exists precisely for this case.
  const r = await fetchPublishedSitemap({ fetchImpl: bodyFailsFetch() });
  assert.equal(r.ok, false);
  assert.equal(r.entries, null);
  assert.match(r.message, /could not read/);
});

await testAsync('a mid-body failure still lets the union fall back to the window', async () => {
  // The end-to-end consequence, asserted rather than assumed.
  const published = await fetchPublishedSitemap({ fetchImpl: bodyFailsFetch() });
  const current = [
    { loc: 'https://www.strictly.fyi/blog/fresh/', lastmod: '2026-09-16' },
    { loc: 'https://www.strictly.fyi/blog/stale/', lastmod: '2026-01-01' },
  ];
  const sel = selectUrlsToAnnounce({
    currentEntries: current,
    previousEntries: published.ok ? published.entries : null,
    now: NOW,
    windowDays: 7,
  });
  assert.deepEqual(sel.urls, ['https://www.strictly.fyi/blog/fresh/']);
});

await testAsync('an empty but served sitemap gives [], which is different from null', async () => {
  const r = await fetchPublishedSitemap({ fetchImpl: stubFetch({ status: 200, body: '<urlset></urlset>' }) });
  assert.equal(r.ok, true);
  assert.deepEqual(r.entries, []);
});

// ============================================================ probeUrl

console.log('\n--- probeUrl ---');

await testAsync('a 200 passes', async () => {
  const r = await probeUrl({ url: 'https://www.strictly.fyi/blog/a/', fetchImpl: stubFetch({ status: 200, body: '' }) });
  assert.equal(r.ok, true);
});

await testAsync('a 404 fails and says so', async () => {
  const r = await probeUrl({ url: 'https://www.strictly.fyi/blog/ghost/', fetchImpl: stubFetch({ status: 404, body: '' }) });
  assert.equal(r.ok, false);
  assert.match(r.message, /not served/);
});

await testAsync('an unreachable host fails without throwing', async () => {
  const r = await probeUrl({ url: 'https://www.strictly.fyi/x/', fetchImpl: stubFetch(new Error('timeout')) });
  assert.equal(r.ok, false);
  assert.equal(r.status, null);
});

// ============================================================ chunkUrls

console.log('\n--- chunkUrls ---');

test('splits evenly', () => {
  assert.deepEqual(chunkUrls(['a', 'b', 'c', 'd'], 2), [['a', 'b'], ['c', 'd']]);
});

test('last chunk holds the remainder', () => {
  assert.deepEqual(chunkUrls(['a', 'b', 'c'], 2), [['a', 'b'], ['c']]);
});

test('a list under the size is one chunk', () => {
  assert.deepEqual(chunkUrls(['a'], 10), [['a']]);
});

test('an empty list yields no chunks, not one empty chunk', () => {
  assert.deepEqual(chunkUrls([], 10), []);
});

test('tolerates a null list', () => {
  assert.deepEqual(chunkUrls(null, 10), []);
});

test('a size of 0 falls back to 1 rather than looping forever', () => {
  assert.deepEqual(chunkUrls(['a', 'b'], 0), [['a'], ['b']]);
});

test('10001 URLs split into two batches at the protocol cap', () => {
  const urls = Array.from({ length: 10001 }, (_, i) => `https://www.strictly.fyi/p${i}/`);
  const chunks = chunkUrls(urls, MAX_URLS_PER_REQUEST);
  assert.equal(chunks.length, 2);
  assert.equal(chunks[0].length, 10000);
  assert.equal(chunks[1].length, 1);
});

// ============================================================ filterUrlsForOrigin

console.log('\n--- filterUrlsForOrigin ---');

test('keeps same-origin URLs', () => {
  const r = filterUrlsForOrigin(['https://www.strictly.fyi/blog/a/'], SITE_ORIGIN);
  assert.deepEqual(r.kept, ['https://www.strictly.fyi/blog/a/']);
  assert.deepEqual(r.dropped, []);
});

test('drops a different host', () => {
  const r = filterUrlsForOrigin(['https://example.com/a/'], SITE_ORIGIN);
  assert.deepEqual(r.kept, []);
  assert.deepEqual(r.dropped, ['https://example.com/a/']);
});

test('drops a subdomain of the same registrable domain', () => {
  const r = filterUrlsForOrigin(['https://blog.strictly.fyi/a/'], SITE_ORIGIN);
  assert.equal(r.kept.length, 0);
});

test('drops the apex host, because www is the primary origin', () => {
  // The apex 308s to www, so an apex URL in a payload would draw a 422 for the batch.
  const r = filterUrlsForOrigin(['https://strictly.fyi/blog/a/'], SITE_ORIGIN);
  assert.equal(r.kept.length, 0);
  assert.deepEqual(r.dropped, ['https://strictly.fyi/blog/a/']);
});

test('keeps every URL of a www sitemap (an apex origin would drop them all)', () => {
  const locs = parseSitemapEntries(SAMPLE_SITEMAP).map((e) => e.loc);
  assert.equal(filterUrlsForOrigin(locs, SITE_ORIGIN).kept.length, locs.length);
  assert.equal(filterUrlsForOrigin(locs, 'https://strictly.fyi').kept.length, 0);
});

test('drops http when the origin is https', () => {
  const r = filterUrlsForOrigin(['http://www.strictly.fyi/a/'], SITE_ORIGIN);
  assert.equal(r.kept.length, 0);
});

test('drops a relative URL', () => {
  const r = filterUrlsForOrigin(['/blog/a/'], SITE_ORIGIN);
  assert.deepEqual(r.dropped, ['/blog/a/']);
});

test('drops garbage without throwing', () => {
  const r = filterUrlsForOrigin(['not a url', '', null], SITE_ORIGIN);
  assert.equal(r.kept.length, 0);
  assert.equal(r.dropped.length, 3);
});

test('tolerates a null list', () => {
  assert.deepEqual(filterUrlsForOrigin(null, SITE_ORIGIN).kept, []);
});

// ============================================================ buildPayload / validatePayload

console.log('\n--- payload ---');

const GOOD_PAYLOAD = buildPayload({
  host: HOST,
  key: INDEXNOW_KEY,
  keyLocation: KEY_LOCATION,
  urls: ['https://www.strictly.fyi/blog/a/'],
});

test('payload carries the four protocol fields', () => {
  assert.deepEqual(Object.keys(GOOD_PAYLOAD).sort(), ['host', 'key', 'keyLocation', 'urlList']);
});

test('payload urlList is a copy, not the caller array', () => {
  const urls = ['https://www.strictly.fyi/blog/a/'];
  const p = buildPayload({ host: HOST, key: INDEXNOW_KEY, keyLocation: KEY_LOCATION, urls });
  urls.push('https://www.strictly.fyi/blog/b/');
  assert.equal(p.urlList.length, 1);
});

test('payload serialises to JSON', () => {
  assert.equal(JSON.parse(JSON.stringify(GOOD_PAYLOAD)).host, HOST);
});

test('the real config produces a valid payload', () => {
  assert.equal(validatePayload(GOOD_PAYLOAD).ok, true);
});

test('rejects an empty host', () => {
  const r = validatePayload({ ...GOOD_PAYLOAD, host: '' });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes('host')));
});

test('rejects a malformed key', () => {
  const r = validatePayload({ ...GOOD_PAYLOAD, key: 'short' });
  assert.equal(r.ok, false);
});

test('rejects a keyLocation that does not match the key', () => {
  const r = validatePayload({ ...GOOD_PAYLOAD, keyLocation: 'https://www.strictly.fyi/other.txt' });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes('keyLocation')));
});

test('rejects an empty urlList', () => {
  const r = validatePayload({ ...GOOD_PAYLOAD, urlList: [] });
  assert.equal(r.ok, false);
});

test('rejects a non-array urlList', () => {
  assert.equal(validatePayload({ ...GOOD_PAYLOAD, urlList: 'nope' }).ok, false);
});

test('rejects a urlList over the protocol cap', () => {
  const urlList = Array.from({ length: MAX_URLS_PER_REQUEST + 1 }, (_, i) => `https://www.strictly.fyi/p${i}/`);
  const r = validatePayload({ ...GOOD_PAYLOAD, urlList });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes('cap')));
});

test('accepts a urlList exactly at the cap', () => {
  const urlList = Array.from({ length: MAX_URLS_PER_REQUEST }, (_, i) => `https://www.strictly.fyi/p${i}/`);
  assert.equal(validatePayload({ ...GOOD_PAYLOAD, urlList }).ok, true);
});

test('reports every problem at once, not just the first', () => {
  const r = validatePayload({ host: '', key: 'x', keyLocation: '', urlList: [] });
  assert.ok(r.errors.length >= 3);
});

test('tolerates a null payload', () => {
  assert.equal(validatePayload(null).ok, false);
});

// ============================================================ classifyResponse

console.log('\n--- classifyResponse ---');

test('200 is success', () => {
  assert.equal(classifyResponse(200).ok, true);
});

test('202 is success, not a pending failure', () => {
  const r = classifyResponse(202);
  assert.equal(r.ok, true);
  assert.match(r.message, /pending/);
});

test('400 fails and is not retryable', () => {
  assert.deepEqual(
    [classifyResponse(400).ok, classifyResponse(400).retryable],
    [false, false]
  );
});

test('403 fails and names the key file', () => {
  const r = classifyResponse(403);
  assert.equal(r.ok, false);
  assert.match(r.message, /key file/);
});

test('422 fails and names the host mismatch', () => {
  assert.match(classifyResponse(422).message, /host/);
});

test('429 fails but is retryable', () => {
  const r = classifyResponse(429);
  assert.equal(r.ok, false);
  assert.equal(r.retryable, true);
});

test('500 is retryable', () => {
  assert.equal(classifyResponse(500).retryable, true);
});

test('503 is retryable', () => {
  assert.equal(classifyResponse(503).retryable, true);
});

test('an unmapped 4xx fails without being retryable', () => {
  const r = classifyResponse(418);
  assert.equal(r.ok, false);
  assert.equal(r.retryable, false);
});

test('every classification carries a message', () => {
  for (const status of [200, 202, 400, 403, 422, 429, 500, 418]) {
    assert.ok(classifyResponse(status).message.length > 0, `status ${status}`);
  }
});

// ============================================================ verifyKeyFile

console.log('\n--- verifyKeyFile ---');

await testAsync('passes when the origin serves the matching key', async () => {
  const f = stubFetch({ status: 200, body: INDEXNOW_KEY });
  const r = await verifyKeyFile({ fetchImpl: f });
  assert.equal(r.ok, true);
  assert.match(r.message, /matches/);
});

await testAsync('requests the key file at the origin root', async () => {
  const f = stubFetch({ status: 200, body: INDEXNOW_KEY });
  await verifyKeyFile({ fetchImpl: f });
  assert.equal(f.calls[0].url, KEY_LOCATION);
});

await testAsync('tolerates a trailing newline served by the host', async () => {
  const f = stubFetch({ status: 200, body: `${INDEXNOW_KEY}\n` });
  assert.equal((await verifyKeyFile({ fetchImpl: f })).ok, true);
});

await testAsync('a 404 reports "not serving the key yet" (the first-deploy path)', async () => {
  const f = stubFetch({ status: 404, body: 'Not Found' });
  const r = await verifyKeyFile({ fetchImpl: f });
  assert.equal(r.ok, false);
  assert.match(r.message, /not serving the key yet/);
});

await testAsync('a wrong key in the file fails', async () => {
  const f = stubFetch({ status: 200, body: 'deadbeefdeadbeefdeadbeefdeadbeef' });
  const r = await verifyKeyFile({ fetchImpl: f });
  assert.equal(r.ok, false);
  assert.match(r.message, /expected/);
});

await testAsync('a 500 from the origin fails without claiming a missing key', async () => {
  const r = await verifyKeyFile({ fetchImpl: stubFetch({ status: 500, body: '' }) });
  assert.equal(r.ok, false);
  assert.match(r.message, /HTTP 500/);
});

await testAsync('a network error is caught and reported', async () => {
  const r = await verifyKeyFile({ fetchImpl: stubFetch(new Error('ENOTFOUND')) });
  assert.equal(r.ok, false);
  assert.equal(r.status, null);
  assert.match(r.message, /could not reach/);
});

await testAsync('verifyKeyFile never throws', async () => {
  await verifyKeyFile({ fetchImpl: stubFetch(new Error('boom')) });
});

await testAsync('a connection dropped MID-BODY returns, it does not throw', async () => {
  // The headers arrive (200) and the socket then drops, which rejects response.text()
  // with undici's "terminated". This used to escape the function, and because callers
  // branch on the returned shape it skipped their fallback entirely.
  const r = await verifyKeyFile({ fetchImpl: bodyFailsFetch() });
  assert.equal(r.ok, false);
  assert.match(r.message, /could not read/);
});

// ============================================================ submitBatch

console.log('\n--- submitBatch ---');

await testAsync('POSTs JSON to the endpoint', async () => {
  const f = stubFetch({ status: 200, body: '' });
  await submitBatch({ payload: GOOD_PAYLOAD, fetchImpl: f });
  assert.equal(f.calls[0].url, ENDPOINT);
  assert.equal(f.calls[0].options.method, 'POST');
});

await testAsync('sends the documented content type', async () => {
  const f = stubFetch({ status: 200, body: '' });
  await submitBatch({ payload: GOOD_PAYLOAD, fetchImpl: f });
  assert.equal(f.calls[0].options.headers['Content-Type'], 'application/json; charset=utf-8');
});

await testAsync('body round-trips to the payload', async () => {
  const f = stubFetch({ status: 200, body: '' });
  await submitBatch({ payload: GOOD_PAYLOAD, fetchImpl: f });
  assert.deepEqual(JSON.parse(f.calls[0].options.body), GOOD_PAYLOAD);
});

await testAsync('carries an abort signal so a hung endpoint cannot hang the build', async () => {
  const f = stubFetch({ status: 200, body: '' });
  await submitBatch({ payload: GOOD_PAYLOAD, fetchImpl: f });
  assert.ok(f.calls[0].options.signal);
});

await testAsync('a 403 is reported as a failure', async () => {
  const r = await submitBatch({ payload: GOOD_PAYLOAD, fetchImpl: stubFetch({ status: 403, body: '' }) });
  assert.equal(r.ok, false);
  assert.equal(r.status, 403);
});

await testAsync('a thrown fetch is caught and marked retryable', async () => {
  const r = await submitBatch({ payload: GOOD_PAYLOAD, fetchImpl: stubFetch(new Error('socket hang up')) });
  assert.equal(r.ok, false);
  assert.equal(r.retryable, true);
  assert.match(r.message, /request failed/);
});

// ============================================================ submitUrls

console.log('\n--- submitUrls ---');

await testAsync('submits a single fresh URL', async () => {
  const f = stubFetch({ status: 200, body: '' });
  const r = await submitUrls({ urls: ['https://www.strictly.fyi/blog/a/'], fetchImpl: f });
  assert.equal(r.ok, true);
  assert.equal(r.submitted, 1);
  assert.equal(f.calls.length, 1);
});

await testAsync('an empty list makes no request at all', async () => {
  const f = stubFetch({ status: 200, body: '' });
  const r = await submitUrls({ urls: [], fetchImpl: f });
  assert.equal(r.submitted, 0);
  assert.equal(f.calls.length, 0);
  assert.match(r.message, /nothing to submit/);
});

await testAsync('a list of only foreign URLs makes no request', async () => {
  const f = stubFetch({ status: 200, body: '' });
  const r = await submitUrls({ urls: ['https://example.com/a/'], fetchImpl: f });
  assert.equal(f.calls.length, 0);
  assert.deepEqual(r.dropped, ['https://example.com/a/']);
});

await testAsync('foreign URLs are dropped but same-origin ones still go', async () => {
  const f = stubFetch({ status: 200, body: '' });
  const r = await submitUrls({
    urls: ['https://example.com/a/', 'https://www.strictly.fyi/blog/a/'],
    fetchImpl: f,
  });
  assert.equal(r.submitted, 1);
  assert.equal(JSON.parse(f.calls[0].options.body).urlList.length, 1);
});

await testAsync('over-cap lists are split across requests', async () => {
  const f = stubFetch({ status: 200, body: '' });
  const urls = Array.from({ length: 5 }, (_, i) => `https://www.strictly.fyi/p${i}/`);
  const r = await submitUrls({ urls, fetchImpl: f, maxPerRequest: 2 });
  assert.equal(f.calls.length, 3);
  assert.equal(r.submitted, 5);
});

await testAsync('a failed batch marks the run failed but does not throw', async () => {
  const f = stubFetch({ status: 403, body: '' });
  const r = await submitUrls({ urls: ['https://www.strictly.fyi/blog/a/'], fetchImpl: f });
  assert.equal(r.ok, false);
  assert.equal(r.submitted, 0);
});

await testAsync('a partial failure reports the partial count', async () => {
  const f = stubFetch([{ status: 200, body: '' }, { status: 429, body: '' }]);
  const urls = Array.from({ length: 4 }, (_, i) => `https://www.strictly.fyi/p${i}/`);
  const r = await submitUrls({ urls, fetchImpl: f, maxPerRequest: 2 });
  assert.equal(r.ok, false);
  assert.equal(r.submitted, 2);
  assert.match(r.message, /submitted 2 of 4/);
});

await testAsync('submitUrls never throws on a network error', async () => {
  const r = await submitUrls({ urls: ['https://www.strictly.fyi/blog/a/'], fetchImpl: stubFetch(new Error('down')) });
  assert.equal(r.ok, false);
});

await testAsync('an invalid key fails before any request is made', async () => {
  const f = stubFetch({ status: 200, body: '' });
  const r = await submitUrls({ urls: ['https://www.strictly.fyi/blog/a/'], fetchImpl: f, key: 'bad' });
  assert.equal(r.ok, false);
  assert.equal(f.calls.length, 0);
});

await testAsync('the summary message counts one URL in the singular', async () => {
  const r = await submitUrls({ urls: ['https://www.strictly.fyi/blog/a/'], fetchImpl: stubFetch({ status: 200, body: '' }) });
  assert.match(r.message, /submitted 1 URL in 1 batch/);
});

await testAsync('batch records carry a per-batch count', async () => {
  const f = stubFetch({ status: 200, body: '' });
  const urls = Array.from({ length: 3 }, (_, i) => `https://www.strictly.fyi/p${i}/`);
  const r = await submitUrls({ urls, fetchImpl: f, maxPerRequest: 2 });
  assert.deepEqual(r.batches.map((b) => b.count), [2, 1]);
});

// ============================================================ end-to-end

console.log('\n--- end to end (offline) ---');

await testAsync('sitemap XML to submitted payload, with no network', async () => {
  const f = stubFetch({ status: 200, body: '' });
  const urls = selectFreshUrls(parseSitemapEntries(SAMPLE_SITEMAP), NOW, FRESH_WINDOW_DAYS);
  const r = await submitUrls({ urls, fetchImpl: f });
  assert.equal(r.ok, true);
  assert.equal(r.submitted, 1);
  const body = JSON.parse(f.calls[0].options.body);
  assert.equal(body.host, HOST);
  assert.equal(body.key, INDEXNOW_KEY);
  assert.equal(body.keyLocation, KEY_LOCATION);
  assert.deepEqual(body.urlList, ['https://www.strictly.fyi/blog/alpha/']);
});

await testAsync('a stale-only sitemap announces nothing', async () => {
  const f = stubFetch({ status: 200, body: '' });
  const xml = '<urlset><url><loc>https://www.strictly.fyi/blog/old/</loc><lastmod>2020-01-01</lastmod></url></urlset>';
  const urls = selectFreshUrls(parseSitemapEntries(xml), NOW, FRESH_WINDOW_DAYS);
  const r = await submitUrls({ urls, fetchImpl: f });
  assert.equal(f.calls.length, 0);
  assert.equal(r.submitted, 0);
});

// ============================================================ CLI exit codes

console.log('\n--- CLI exit codes (offline) ---');

const CLI = path.join(ROOT, 'scripts', 'indexnow.mjs');

/** Run the CLI as a real subprocess. Every case below dies before any network call. */
function runCli(args) {
  return spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8' });
}

test('a bare invocation prints usage and exits 0', () => {
  const r = runCli([]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /IndexNow CLI/);
});

test('an unknown command exits 1', () => {
  assert.equal(runCli(['bogus']).status, 1);
});

test('`key` exits 0', () => {
  const r = runCli(['key']);
  assert.equal(r.status, 0);
  assert.match(r.stdout, new RegExp(INDEXNOW_KEY));
});

test('`status` tolerates a missing sitemap and exits 0', () => {
  // status is a read-only report: "you have not built yet" is an answer, not an error.
  const r = runCli(['status', '--sitemap', path.join(ROOT, 'does-not-exist.xml')]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /not built/);
});

test('`status --url` agrees with `submit --url` when no sitemap exists', () => {
  // These two disagreed: status gated on having read a sitemap, but --url is resolved
  // before the sitemap is read, so the preview said "0 URLs" while submit announced one.
  const missing = path.join(ROOT, 'does-not-exist.xml');
  const url = 'https://www.strictly.fyi/blog/x/';
  const status = runCli(['status', '--sitemap', missing, '--url', url]);
  const submit = runCli(['submit', '--dry-run', '--sitemap', missing, '--url', url]);
  assert.equal(status.status, 0);
  assert.equal(submit.status, 0);
  assert.match(status.stdout, /1 URL\(s\) would be submitted/);
  assert.match(status.stdout, new RegExp(url.replace(/\//g, '\\/')));
  assert.match(submit.stdout, /1 URL\(s\) selected/);
});

test('`status` reports an existing-but-empty sitemap as 0 URLs, not "not built"', () => {
  // A temp dir, not dist/: the suite must never write into a build output it does not own.
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'indexnow-test-'));
  const emptyPath = path.join(tmp, 'empty-sitemap.xml');
  fs.writeFileSync(emptyPath, '<urlset></urlset>');
  try {
    const r = runCli(['status', '--sitemap', emptyPath]);
    assert.equal(r.status, 0);
    assert.match(r.stdout, /\(0 URLs\)/);
    assert.doesNotMatch(r.stdout, /not built/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('`submit` with a missing sitemap exits 1 with a readable error', () => {
  // submit resolves the URL list before it touches the network, so this dies offline.
  const r = runCli(['submit', '--sitemap', path.join(ROOT, 'does-not-exist.xml')]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /no sitemap at/);
});

test('`--days abc` is refused instead of announcing every URL', () => {
  const r = runCli(['status', '--sitemap', path.join(ROOT, 'does-not-exist', SITEMAP_FILE), '--days', 'abc']);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /--days must be a non-negative number/);
});

test('`--days -1` is refused', () => {
  // Asserts the MESSAGE, not just the exit code: status tolerates a missing sitemap and
  // exits 0, so a bare status===1 check could pass for an unrelated reason.
  const r = runCli(['status', '--sitemap', path.join(ROOT, 'does-not-exist', SITEMAP_FILE), '--days', '-1']);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /--days must be a non-negative number/);
});

test('`submit --diff` is refused before anything is read', () => {
  // --diff previews the deploy hook from a LOCAL build; announcing from it would point
  // the engines at URLs that are not deployed yet.
  const r = runCli(['submit', '--diff', '--sitemap', path.join(ROOT, 'does-not-exist.xml')]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /status preview of the deploy hook/);
});

test('`status --diff` with no local build exits 1 before any network call', () => {
  // Unlike plain status, the preview has nothing to compare without a build, so a
  // missing sitemap is an error here - and it is raised before the live fetch.
  const r = runCli(['status', '--diff', '--sitemap', path.join(ROOT, 'does-not-exist.xml')]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /no sitemap at/);
});

test('`status --diff` does not combine with --url or --all', () => {
  const missing = path.join(ROOT, 'does-not-exist.xml');
  const withUrl = runCli(['status', '--diff', '--sitemap', missing, '--url', 'https://www.strictly.fyi/blog/x/']);
  const withAll = runCli(['status', '--diff', '--sitemap', missing, '--all']);
  assert.equal(withUrl.status, 1);
  assert.equal(withAll.status, 1);
  assert.match(withUrl.stderr, /does not combine/);
  assert.match(withAll.stderr, /does not combine/);
});

test('a failure exits 1, not 127 (no libuv assertion on exit)', () => {
  // Regression guard. process.exit() while an undici socket from fetch() is open
  // aborts the process on Windows and the shell sees 127. Every failure path in the
  // CLI is reached straight after a fetch, so this must stay a clean 1.
  const r = runCli(['submit', '--sitemap', path.join(ROOT, 'does-not-exist.xml')]);
  assert.equal(r.status, 1);
  assert.doesNotMatch(r.stderr, /Assertion failed/);
  assert.doesNotMatch(r.stdout, /Assertion failed/);
});

// ============================================================ summary

console.log('');
if (failures.length) {
  console.log('Failures:');
  for (const f of failures) console.log(`  - ${f.name}: ${f.message}`);
  console.log('');
}
console.log(`${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
