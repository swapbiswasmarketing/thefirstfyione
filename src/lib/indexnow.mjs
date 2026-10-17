/**
 * IndexNow: pick the URLs a deploy changed, prove ownership, announce them.
 *
 * Ported from the swapbiswas.com implementation with the logic unchanged; only the
 * host and the comment examples differ.
 *
 * Every function here is pure or takes its effects as arguments (`fetchImpl`, `now`,
 * `env`), which is what lets scripts/test-indexnow.mjs cover the whole module with no
 * network and no clock. Nothing in this file reads process.env or calls fetch on its
 * own - the callers (the astro.config.mjs hook and scripts/indexnow.mjs) inject both.
 *
 * Order of operations for a production deploy:
 *   1. resolveDeployContext()  - is this a production deploy at all?
 *   2. parseSitemapEntries()   - read the sitemap-0.xml this build wrote
 *   3. fetchPublishedSitemap() - read the one the live site still serves
 *   4. selectUrlsToAnnounce()  - changed against the live one, plus the freshness window
 *   5. verifyKeyFile()         - is the origin already serving the key?
 *   6. submitUrls()            - chunk, POST, classify
 *
 * Step 5 is the one that looks redundant and is not. See verifyKeyFile().
 */

import {
  ENDPOINT,
  HOST,
  INDEXNOW_KEY,
  KEY_LOCATION,
  KEY_PATTERN,
  MAX_URLS_PER_REQUEST,
  PUBLISHED_SITEMAP_URL,
  REQUEST_TIMEOUT_MS,
  SITE_ORIGIN,
} from '../config/indexnow.mjs';

// ---------------------------------------------------------------- key

/**
 * @param {unknown} key
 * @returns {boolean} true if `key` is a syntactically valid IndexNow key.
 */
export function isValidKey(key) {
  return typeof key === 'string' && KEY_PATTERN.test(key);
}

/**
 * The public path the key file must be served at, derived from the key itself so the
 * two can never be edited apart.
 *
 * @param {string} key
 * @returns {string} e.g. "/abc123.txt"
 */
export function keyFilePath(key) {
  return `/${key}.txt`;
}

// ---------------------------------------------------------------- deploy gate

/**
 * Decide whether this build should announce anything.
 *
 * Returns a reason string in both directions so the build log always says WHY it did
 * or did not submit - a silent skip is indistinguishable from a broken integration.
 *
 * INDEXNOW_FORCE=1 exists for testing the real path from a local machine. It is
 * checked before the Vercel gate but after the kill switch, so DISABLE always wins.
 *
 * @param {Record<string, string | undefined>} env
 * @returns {{ shouldSubmit: boolean, reason: string }}
 */
export function resolveDeployContext(env) {
  const e = env || {};
  if (e.INDEXNOW_DISABLE === '1') {
    return { shouldSubmit: false, reason: 'kill switch set (INDEXNOW_DISABLE=1)' };
  }
  if (e.INDEXNOW_FORCE === '1') {
    return { shouldSubmit: true, reason: 'forced (INDEXNOW_FORCE=1)' };
  }
  const onVercel = e.VERCEL === '1' || typeof e.VERCEL_ENV === 'string';
  if (!onVercel) {
    return { shouldSubmit: false, reason: 'not a production deploy (local build)' };
  }
  if (e.VERCEL_ENV !== 'production') {
    return {
      shouldSubmit: false,
      reason: `not a production deploy (VERCEL_ENV=${e.VERCEL_ENV || 'unset'})`,
    };
  }
  return { shouldSubmit: true, reason: 'production deploy (VERCEL_ENV=production)' };
}

// ---------------------------------------------------------------- sitemap

/**
 * Pull <loc>/<lastmod> pairs out of a sitemap.
 *
 * A regex rather than an XML parser on purpose: the input is not arbitrary XML, it is
 * a file this repo generated earlier in the same build (or the same generator's output
 * from the previous deploy), and adding a parser dependency for it would be the only
 * dependency this feature needs. Entries with no <lastmod> are returned with lastmod
 * null rather than dropped, so callers can tell "no date" apart from "old date".
 *
 * @param {string} xml
 * @returns {Array<{ loc: string, lastmod: string | null }>}
 */
export function parseSitemapEntries(xml) {
  if (typeof xml !== 'string' || xml.length === 0) return [];
  const entries = [];
  const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
  for (const block of urlBlocks) {
    const loc = block.match(/<loc>([\s\S]*?)<\/loc>/)?.[1]?.trim();
    if (!loc) continue;
    const lastmod = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1]?.trim() || null;
    entries.push({ loc, lastmod });
  }
  return entries;
}

/**
 * Whole days between two instants, floored. Both arguments are Dates so the caller
 * owns the clock and the tests can pin it.
 *
 * @param {Date} then
 * @param {Date} now
 * @returns {number} negative if `then` is in the future
 */
export function daysBetween(then, now) {
  return Math.floor((now.getTime() - then.getTime()) / 86400000);
}

/**
 * The URLs a deploy should announce: those whose lastmod falls inside the window.
 *
 * A lastmod in the FUTURE counts as fresh. Entries are occasionally dated a day ahead
 * to schedule them, and treating that as stale would mean the one entry most likely to
 * need announcing is the one silently skipped.
 *
 * Entries with no lastmod are skipped. Those are the static pages (/about/, /privacy/)
 * that the sitemap serialize() hook leaves undated because nothing gives them a
 * trustworthy date - they change rarely, and without a date there is no way to tell a
 * changed one from the rest, so announcing all of them on every deploy would be noise.
 *
 * @param {Array<{ loc: string, lastmod: string | null }>} entries
 * @param {Date} now
 * @param {number} windowDays
 * @returns {string[]} URLs, in sitemap order, deduped
 */
export function selectFreshUrls(entries, now, windowDays) {
  // A non-finite window is rejected rather than tolerated. `age > NaN` is ALWAYS false,
  // so a NaN window silently selects every dated URL instead of none - which turns a
  // typo like `--days abc` into "announce the whole site". Failing loudly is the only
  // safe reading, because the quiet one is the destructive one.
  if (!Number.isFinite(windowDays) || windowDays < 0) {
    throw new TypeError(`windowDays must be a non-negative finite number, got ${windowDays}`);
  }
  const seen = new Set();
  const fresh = [];
  for (const entry of entries || []) {
    if (!entry || !entry.lastmod) continue;
    const parsed = new Date(entry.lastmod);
    if (Number.isNaN(parsed.getTime())) continue;
    const age = daysBetween(parsed, now);
    if (age > windowDays) continue;
    if (seen.has(entry.loc)) continue;
    seen.add(entry.loc);
    fresh.push(entry.loc);
  }
  return fresh;
}

/**
 * URLs this build changed, measured against a previously published sitemap.
 *
 * Two things count as changed:
 *   - a URL absent from the previous sitemap (genuinely new)
 *   - a URL whose lastmod differs from the previous one (edited)
 *
 * A new URL counts even with NO lastmod, which the freshness window alone cannot do.
 * That is not an edge case here: only entries and the pages that list them get a
 * lastmod, so a new static page such as /privacy/ has none and the window would never
 * announce it. The diff does.
 *
 * Two entries that both lack a lastmod are treated as unchanged - there is nothing to
 * compare, and assuming "changed" would re-announce every static page on every deploy.
 *
 * @param {Array<{ loc: string, lastmod: string | null }>} previousEntries
 * @param {Array<{ loc: string, lastmod: string | null }>} currentEntries
 * @returns {string[]} changed URLs, in current-sitemap order
 */
export function diffSitemaps(previousEntries, currentEntries) {
  const previous = new Map();
  for (const entry of previousEntries || []) {
    if (entry && entry.loc) previous.set(entry.loc, entry.lastmod ?? null);
  }
  const changed = [];
  for (const entry of currentEntries || []) {
    if (!entry || !entry.loc) continue;
    if (!previous.has(entry.loc)) {
      changed.push(entry.loc);
      continue;
    }
    if (previous.get(entry.loc) !== (entry.lastmod ?? null)) changed.push(entry.loc);
  }
  return changed;
}

/**
 * The set a deploy should announce: the UNION of the freshness window and the diff
 * against what is already published.
 *
 * Neither signal is sufficient alone, and they fail in opposite directions:
 *
 *   - The WINDOW misses an edit that sits undeployed for longer than the window. Its
 *     lastmod is old by the time a build finally runs, so the change is never
 *     announced at all.
 *   - The DIFF misses a second edit made on the same day as the first. lastmod carries
 *     only a date (frontmatter dates are days, written as midnight UTC), so the string
 *     is identical across both edits even though the content changed.
 *
 * The union catches both. Being generous here costs little - the window is sized to
 * the push cadence so a repeat is rare - while missing a real change is the entire
 * failure this feature exists to prevent.
 *
 * `previousEntries` of null means the previous sitemap could not be read, and the
 * window is used on its own rather than treating every URL as new - which is what an
 * empty array would mean and would announce the whole site.
 *
 * @param {{
 *   currentEntries: Array<{ loc: string, lastmod: string | null }>,
 *   previousEntries: Array<{ loc: string, lastmod: string | null }> | null,
 *   now: Date,
 *   windowDays: number,
 * }} input
 * @returns {{ urls: string[], fresh: string[], changed: string[] }}
 */
export function selectUrlsToAnnounce({ currentEntries, previousEntries, now, windowDays }) {
  const fresh = selectFreshUrls(currentEntries, now, windowDays);
  const changed = previousEntries === null ? [] : diffSitemaps(previousEntries, currentEntries);
  const wanted = new Set([...fresh, ...changed]);
  // Emitted in current-sitemap order so the payload reads the way the sitemap does.
  const urls = (currentEntries || []).map((e) => e?.loc).filter((loc) => loc && wanted.has(loc));
  return { urls: [...new Set(urls)], fresh, changed };
}

// ---------------------------------------------------------------- payload

/**
 * Split a URL list into submission-sized batches.
 *
 * @param {string[]} urls
 * @param {number} size
 * @returns {string[][]} [] for an empty input, never [[]]
 */
export function chunkUrls(urls, size) {
  const limit = Math.max(1, Math.floor(size) || 1);
  const out = [];
  for (let i = 0; i < (urls || []).length; i += limit) {
    out.push(urls.slice(i, i + limit));
  }
  return out;
}

/**
 * Keep only URLs that actually belong to this origin.
 *
 * The endpoint answers 422 for a payload mixing hosts and rejects the WHOLE batch, so
 * one stray absolute URL would lose every real one alongside it. Filtering here turns
 * that into a logged drop.
 *
 * @param {string[]} urls
 * @param {string} origin
 * @returns {{ kept: string[], dropped: string[] }}
 */
export function filterUrlsForOrigin(urls, origin) {
  const kept = [];
  const dropped = [];
  for (const url of urls || []) {
    let ok = false;
    try {
      ok = new URL(url).origin === new URL(origin).origin;
    } catch {
      ok = false;
    }
    (ok ? kept : dropped).push(url);
  }
  return { kept, dropped };
}

/**
 * Build one IndexNow submission body.
 *
 * @param {{ host: string, key: string, keyLocation: string, urls: string[] }} input
 * @returns {{ host: string, key: string, keyLocation: string, urlList: string[] }}
 */
export function buildPayload({ host, key, keyLocation, urls }) {
  return { host, key, keyLocation, urlList: [...(urls || [])] };
}

/**
 * Reject a payload the endpoint would reject, before spending a request on it.
 *
 * @param {{ host?: string, key?: string, keyLocation?: string, urlList?: string[] }} payload
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validatePayload(payload) {
  const errors = [];
  const p = payload || {};
  if (!p.host) errors.push('host is empty');
  if (!isValidKey(p.key)) errors.push('key is not 8-128 chars of [a-zA-Z0-9-]');
  if (!p.keyLocation) errors.push('keyLocation is empty');
  else if (p.key && !p.keyLocation.endsWith(keyFilePath(p.key))) {
    errors.push('keyLocation does not point at the key file for this key');
  }
  const urls = Array.isArray(p.urlList) ? p.urlList : null;
  if (!urls) errors.push('urlList is not an array');
  else if (urls.length === 0) errors.push('urlList is empty');
  else if (urls.length > MAX_URLS_PER_REQUEST) {
    errors.push(`urlList has ${urls.length} URLs, over the ${MAX_URLS_PER_REQUEST} cap`);
  }
  return { ok: errors.length === 0, errors };
}

// ---------------------------------------------------------------- responses

/**
 * Turn an HTTP status into a decision.
 *
 * 202 is a SUCCESS, not a pending failure: it means the URLs were accepted and the key
 * is still being validated. Treating it as an error would make every first submission
 * after a key change look broken.
 *
 * @param {number} status
 * @returns {{ ok: boolean, retryable: boolean, message: string }}
 */
export function classifyResponse(status) {
  switch (status) {
    case 200:
      return { ok: true, retryable: false, message: 'accepted' };
    case 202:
      return { ok: true, retryable: false, message: 'accepted, key validation pending' };
    case 400:
      return { ok: false, retryable: false, message: 'bad request - malformed payload' };
    case 403:
      return { ok: false, retryable: false, message: 'forbidden - key file not valid for this host' };
    case 422:
      return { ok: false, retryable: false, message: 'unprocessable - URLs do not match the host, or key mismatch' };
    case 429:
      return { ok: false, retryable: true, message: 'rate limited - too many requests' };
    default:
      if (status >= 500) return { ok: false, retryable: true, message: `server error (${status})` };
      return { ok: false, retryable: false, message: `unexpected status ${status}` };
  }
}

// ---------------------------------------------------------------- network

/**
 * fetch with a timeout, so a hung endpoint cannot hang a deploy.
 *
 * @param {Function} fetchImpl
 * @param {string} url
 * @param {object} options
 * @param {number} timeoutMs
 * @returns {Promise<any>}
 */
async function fetchWithTimeout(fetchImpl, url, options, timeoutMs) {
  const controller = new AbortController();
  /* The deadline covers the body as well as the headers: the timer stays armed
     after the response arrives, so a server that sends headers and then stalls
     has its body read aborted (real fetch ties the body stream to the signal)
     instead of hanging the deploy. unref() keeps the timer from holding the
     process open once everything is read. */
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  timer.unref?.();
  try {
    return await fetchImpl(url, { ...options, signal: controller.signal });
  } catch (error) {
    clearTimeout(timer);
    throw error;
  }
}

/**
 * Confirm the origin is already serving the key file, and that it contains this key.
 *
 * THIS IS WHY THE FIRST PRODUCTION DEPLOY SKIPS, AND THAT IS CORRECT.
 * The build hook runs DURING the build, before Vercel promotes the new deployment to
 * the production domain. On the deploy that first adds the key file, the file exists in
 * the build output but www.strictly.fyi is still serving the PREVIOUS deployment, which
 * has no key file - so this returns 404 and the hook skips with "not serving the key
 * yet". Submitting anyway would hand the engine a keyLocation that 404s, and the whole
 * batch would come back 403. The next deploy finds the key live and submits normally.
 *
 * @param {{ origin?: string, key?: string, fetchImpl: Function, timeoutMs?: number }} input
 * @returns {Promise<{ ok: boolean, status: number | null, message: string }>}
 */
export async function verifyKeyFile({
  origin = SITE_ORIGIN,
  key = INDEXNOW_KEY,
  fetchImpl,
  timeoutMs = REQUEST_TIMEOUT_MS,
}) {
  const url = `${origin}${keyFilePath(key)}`;
  let response;
  try {
    response = await fetchWithTimeout(fetchImpl, url, { method: 'GET' }, timeoutMs);
  } catch (error) {
    return { ok: false, status: null, message: `could not reach ${url}: ${error?.message || error}` };
  }
  if (!response.ok) {
    const detail = response.status === 404 ? 'not serving the key yet' : `HTTP ${response.status}`;
    return { ok: false, status: response.status, message: `${detail} at ${url}` };
  }
  // Reading the body is a SECOND failure point, not a continuation of the first. The
  // headers can arrive fine and the connection still drop mid-body, which rejects with
  // undici's "terminated". Left unguarded that rejection escapes a function documented
  // to always resolve, and every caller's fallback path is skipped.
  let body;
  try {
    body = (await response.text()).trim();
  } catch (error) {
    return { ok: false, status: response.status, message: `could not read ${url}: ${error?.message || error}` };
  }
  if (body !== key) {
    return {
      ok: false,
      status: response.status,
      message: `key file at ${url} contains "${body.slice(0, 32)}", expected "${key}"`,
    };
  }
  return { ok: true, status: response.status, message: 'key file is live and matches' };
}

/**
 * Fetch the sitemap the site is currently serving.
 *
 * Returns entries: null (never []) when the sitemap could not be read, so callers can
 * tell "no previous sitemap" apart from "previous sitemap was empty". The difference
 * matters: [] means every current URL is new and would announce the whole site, while
 * null means fall back to the window alone.
 *
 * A cache-busting query string is appended because the CDN edge will happily serve a
 * stale sitemap, and a stale one here means comparing this build against a deployment
 * two releases back - harmless but noisy. Query strings do not affect static file
 * resolution, so the file is still found.
 *
 * @param {{ url?: string, fetchImpl: Function, timeoutMs?: number, cacheBuster?: string }} input
 * @returns {Promise<{ ok: boolean, entries: Array<object> | null, status: number | null, message: string }>}
 */
export async function fetchPublishedSitemap({
  url = PUBLISHED_SITEMAP_URL,
  fetchImpl,
  timeoutMs = REQUEST_TIMEOUT_MS,
  cacheBuster,
}) {
  const bust = cacheBuster ?? String(Date.now());
  const target = `${url}${url.includes('?') ? '&' : '?'}indexnow-diff=${encodeURIComponent(bust)}`;
  let response;
  try {
    response = await fetchWithTimeout(fetchImpl, target, { method: 'GET' }, timeoutMs);
  } catch (error) {
    return { ok: false, entries: null, status: null, message: `could not fetch ${url}: ${error?.message || error}` };
  }
  if (!response.ok) {
    return { ok: false, entries: null, status: response.status, message: `HTTP ${response.status} fetching ${url}` };
  }
  // Guarded separately from the request: a 200 can still drop mid-body, and an escaping
  // rejection here would skip the caller's window fallback and announce NOTHING - the
  // opposite of what falling back is for. entries stays null so the caller can tell
  // "could not read" from "read, and it was empty".
  let xml;
  try {
    xml = await response.text();
  } catch (error) {
    return { ok: false, entries: null, status: response.status, message: `could not read ${url}: ${error?.message || error}` };
  }
  const entries = parseSitemapEntries(xml);
  return { ok: true, entries, status: response.status, message: `read ${entries.length} published URL(s)` };
}

/**
 * Is this URL actually served?
 *
 * Used only for URLs an operator names explicitly on the command line, which bypass
 * the sitemap and so bypass the guarantee that a URL is deployed. Announcing a URL
 * that 404s is the one thing this tool must not do - it spends trust with the engine
 * and gets the page treated as dead.
 *
 * @param {{ url: string, fetchImpl: Function, timeoutMs?: number }} input
 * @returns {Promise<{ ok: boolean, status: number | null, message: string }>}
 */
export async function probeUrl({ url, fetchImpl, timeoutMs = REQUEST_TIMEOUT_MS }) {
  let response;
  try {
    response = await fetchWithTimeout(fetchImpl, url, { method: 'GET' }, timeoutMs);
  } catch (error) {
    return { ok: false, status: null, message: `unreachable: ${error?.message || error}` };
  }
  return {
    ok: response.ok,
    status: response.status,
    message: response.ok ? `HTTP ${response.status}` : `HTTP ${response.status} - not served`,
  };
}

/**
 * POST one batch.
 *
 * @param {{ payload: object, endpoint?: string, fetchImpl: Function, timeoutMs?: number }} input
 * @returns {Promise<{ ok: boolean, status: number | null, retryable: boolean, message: string }>}
 */
export async function submitBatch({ payload, endpoint = ENDPOINT, fetchImpl, timeoutMs = REQUEST_TIMEOUT_MS }) {
  let response;
  try {
    response = await fetchWithTimeout(
      fetchImpl,
      endpoint,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      },
      timeoutMs
    );
  } catch (error) {
    return { ok: false, status: null, retryable: true, message: `request failed: ${error?.message || error}` };
  }
  const verdict = classifyResponse(response.status);
  return { ...verdict, status: response.status };
}

/**
 * The whole submission path: validate, chunk, POST each batch, summarise.
 *
 * Never throws. A failed announcement must not fail a deploy - the pages are already
 * built and the sitemap still carries them, so the worst case of a failure here is
 * that Bing finds the change on its own schedule instead of immediately.
 *
 * @param {{
 *   urls: string[],
 *   fetchImpl: Function,
 *   key?: string,
 *   host?: string,
 *   keyLocation?: string,
 *   origin?: string,
 *   endpoint?: string,
 *   maxPerRequest?: number,
 *   timeoutMs?: number,
 * }} input
 * @returns {Promise<{ ok: boolean, submitted: number, dropped: string[], batches: Array<object>, message: string }>}
 */
export async function submitUrls({
  urls,
  fetchImpl,
  key = INDEXNOW_KEY,
  host = HOST,
  keyLocation = KEY_LOCATION,
  origin = SITE_ORIGIN,
  endpoint = ENDPOINT,
  maxPerRequest = MAX_URLS_PER_REQUEST,
  timeoutMs = REQUEST_TIMEOUT_MS,
}) {
  const { kept, dropped } = filterUrlsForOrigin(urls, origin);
  if (kept.length === 0) {
    return { ok: true, submitted: 0, dropped, batches: [], message: 'nothing to submit' };
  }

  const batches = [];
  let submitted = 0;
  let allOk = true;

  for (const group of chunkUrls(kept, maxPerRequest)) {
    const payload = buildPayload({ host, key, keyLocation, urls: group });
    const check = validatePayload(payload);
    if (!check.ok) {
      allOk = false;
      batches.push({ count: group.length, ok: false, status: null, message: check.errors.join('; ') });
      continue;
    }
    const result = await submitBatch({ payload, endpoint, fetchImpl, timeoutMs });
    batches.push({ count: group.length, ...result });
    if (result.ok) submitted += group.length;
    else allOk = false;
  }

  const message = allOk
    ? `submitted ${submitted} URL${submitted === 1 ? '' : 's'} in ${batches.length} batch${batches.length === 1 ? '' : 'es'}`
    : `submitted ${submitted} of ${kept.length} URLs; ${batches.filter((b) => !b.ok).length} batch(es) failed`;

  return { ok: allOk, submitted, dropped, batches, message };
}
