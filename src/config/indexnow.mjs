/**
 * Central IndexNow configuration - the one place the key and endpoint live.
 *
 * THE KEY BELOW IS PUBLIC BY DESIGN. DO NOT MOVE IT TO AN ENVIRONMENT VARIABLE.
 * IndexNow has no shared secret and no account. Ownership is proven by serving the
 * key back from the site's own origin: a submission carries `key` and `keyLocation`,
 * and the search engine fetches that URL and checks the file contains the same string.
 * Anyone can read https://www.strictly.fyi/<key>.txt, and that is the mechanism
 * working, not a leak. The only thing the key authorises is "ask Bing to recrawl a
 * www.strictly.fyi URL", which is also all a stranger could do with it. Hiding it in
 * an env var would break the protocol, because public/ is how the file gets served
 * in the first place.
 *
 * The matching file is public/abdc7bdaa7eb4f02afb5ad4993e7c1a5.txt. Astro copies
 * public/ to the build output verbatim, so the file ships at the origin root.
 * Changing the key means renaming that file and editing INDEXNOW_KEY in the same
 * commit - they are a pair, and verifyKeyFile() in src/lib/indexnow.mjs fails loudly
 * if they drift.
 *
 * The file has NO trailing newline and no BOM. The spec says the file contains the
 * key; Bing tolerates a trailing newline in practice, but an exact-bytes file removes
 * the question entirely, and the test suite asserts the exact length. Write it with
 * Node, never with PowerShell redirection or Set-Content, which add a BOM or newline.
 */

/**
 * The key. 32 hex characters, well inside the spec's 8-128 range.
 * Must equal the basename of the .txt file in public/.
 */
export const INDEXNOW_KEY = 'abdc7bdaa7eb4f02afb5ad4993e7c1a5';

/**
 * Bare hostname, no scheme. This is the `host` field of the payload. www is the
 * primary host: the apex 308s to it, so every sitemap URL is on www and an apex
 * HOST would make filterUrlsForOrigin() drop all of them.
 */
export const HOST = 'www.strictly.fyi';

/** Origin used to build the key location and to sanity-check every submitted URL. */
export const SITE_ORIGIN = 'https://www.strictly.fyi';

/**
 * Where the engine will look for the key file.
 *
 * Deliberately at the origin root rather than a subdirectory: a key served from a
 * subdirectory is only trusted for URLs under that subdirectory, which would silently
 * scope submissions to part of the site. It keeps its .txt extension, which also
 * exempts it from the trailing-slash 308 in vercel.json.
 */
export const KEY_LOCATION = `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;

/**
 * The shared endpoint, which forwards to every participating engine (Bing, Yandex,
 * Seznam, Naver and the rest). Submitting to https://www.bing.com/indexnow instead
 * would reach Bing only. Google does not participate in IndexNow at all - this
 * integration does nothing for Google, and the sitemap remains the only signal there.
 */
export const ENDPOINT = 'https://api.indexnow.org/indexnow';

/** Protocol cap on a single JSON submission. Larger sets are chunked. */
export const MAX_URLS_PER_REQUEST = 10000;

/**
 * How far back a lastmod can be and still count as "new or edited".
 *
 * This window is half of the change detection, and it is deliberate. The obvious
 * alternative - keep a state file of what was already submitted - does not survive
 * the place this actually runs: Vercel builds in a fresh container from a clean git
 * checkout, so a state file written during build #1 does not exist during build #2.
 * Committing it back would need a bot push on every deploy. Reading git history is
 * no better, because Vercel's clone is shallow. The other half is the diff against
 * the live sitemap (see PUBLISHED_SITEMAP_URL).
 *
 * lastmod is already the right signal: the sitemap serialize() hook in
 * astro.config.mjs derives it from each entry's updatedDate, falling back to pubDate,
 * so filing an entry or bumping updatedDate is exactly what moves a URL into this
 * window.
 *
 * Size it to the push cadence. The IndexNow FAQ asks publishers not to resubmit
 * unchanged URLs: repeats count against crawl quota and can draw a 422. strictly.fyi
 * pushes once per publish day, 6-21 days apart, so 7 days rarely announces anything
 * twice. If publish days turn into several pushes, drop this to 1-2.
 */
export const FRESH_WINDOW_DAYS = 7;

/** Spec-allowed key charset and length. Used to reject a typo before any network call. */
export const KEY_PATTERN = /^[a-zA-Z0-9-]{8,128}$/;

/**
 * Per-request timeout. The build must not hang on a slow endpoint: this is a
 * best-effort notification, so a timeout is logged and the build still succeeds.
 */
export const REQUEST_TIMEOUT_MS = 15000;

/**
 * Sitemap file the URL list is read from, relative to the build output directory.
 * @astrojs/sitemap writes it, lastmod included, in its own astro:build:done hook,
 * which runs before the indexnow-submit hook because it sits earlier in the
 * integrations array.
 */
export const SITEMAP_FILE = 'sitemap-0.xml';

/**
 * The same sitemap as served by the live site.
 *
 * DURING A BUILD THIS IS THE PREVIOUS DEPLOYMENT'S SITEMAP, and that is the point.
 * Vercel promotes a deployment only after the build finishes, so while the hook runs
 * the production domain still serves the last one. Fetching it gives the build a
 * record of what was published last time without storing any state - the live site
 * IS the state. Diffing it against the sitemap just built yields exactly the URLs
 * this deploy changed. (It is the same fact that makes the first deploy skip: the key
 * file is not live yet either.)
 */
export const PUBLISHED_SITEMAP_URL = `${SITE_ORIGIN}/${SITEMAP_FILE}`;
