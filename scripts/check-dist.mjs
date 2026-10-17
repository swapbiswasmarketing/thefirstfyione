#!/usr/bin/env node
/*
 * check-dist.mjs - the post-build contract test for strictly.fyi.
 *
 * The markdown gates see the source. This sees what Google and readers receive:
 * the built HTML, the sitemap, the feed and the social cards. Every expectation
 * is derived from the build itself (and the entry files), never hard-coded, so
 * the test does not rot as batches land.
 *
 * Usage:
 *   node scripts/check-dist.mjs [dir]        dir defaults to dist/ at the repo root
 *   flags: --json (machine output)  --verbose (list every page, not 3 per finding)
 *
 * Exit codes: 0 = no FAIL (WARN allowed) | 1 = at least one FAIL | 2 = tooling error.
 * The last line is always "DIST CHECK: PASS" or "DIST CHECK: FAIL"; on exit 2 it
 * reads FAIL too, because a test that could not run is never a pass. With --json
 * the output is one JSON document instead, and its result field is the verdict.
 *
 * Zero dependencies. Regex over Astro's output, which is machine-written and
 * regular; selectors are tied to class names the templates own (prose, faq-item).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://www.strictly.fyi';
const t0 = Date.now();

/* ---------------------------------------------------------------- CLI */
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
for (const f of flags) if (!['--json', '--verbose'].includes(f)) tooling(`unknown flag ${f}`);
const dirArg = args.find((a) => !a.startsWith('--'));
const DIR = dirArg ? path.resolve(process.cwd(), dirArg) : path.join(ROOT, 'dist');

function tooling(msg) {
  console.error(`check-dist: ${msg}`);
  console.log('TOOLING ERROR (exit 2) - this is never a pass');
  console.log('DIST CHECK: FAIL');
  process.exit(2);
}

/* ---------------------------------------------------------------- findings */
/* One description per check id, printed once above its findings. */
const CHECKS = {
  'title-count': 'a page needs exactly one <title>',
  'title-duplicate': 'two pages share one <title>',
  'description': 'a page needs exactly one non-empty meta description',
  'h1-count': 'a page needs exactly one <h1>',
  'ld-parse': 'a JSON-LD block does not parse',
  'ld-blocks': 'more than one application/ld+json block; the Layout emits a single @graph',
  'ld-ref': 'an @id reference resolves to no node in the page graph',
  'ld-person': 'a Person node; the publication has no personal byline, ever',
  'canonical-missing': 'an indexable page has no canonical',
  'canonical-count': 'more than one canonical',
  'canonical-format': 'the canonical is not https://www.strictly.fyi/... ending in "/"',
  'canonical-self': 'the canonical is not this page\'s own URL',
  'sitemap': 'the sitemap could not be read',
  'sitemap-missing': 'an indexable canonical is not in the sitemap',
  'sitemap-extra': 'a sitemap URL is not the canonical of an indexable page',
  'sitemap-noindex': 'a noindex page is in the sitemap',
  'sitemap-lastmod': 'an entry URL has no lastmod, a malformed one, or one that disagrees with its dateModified',
  'href-broken': 'an internal URL resolves to no file in the build',
  'href-slash': 'an internal page URL is missing its trailing slash',
  'og-image': 'og:image is missing, does not resolve, or its size or format disagrees with the file',
  'html-comment': 'an HTML comment ships in the output',
  'banned-char': 'a banned character (dash, arrow, bullet, ellipsis, check mark) outside entry prose and FAQ answers',
  'own-host': 'an absolute own-site URL that is not https://www.strictly.fyi',
  'analytics': 'analytics outside the GTM contract (gtag.js, a Clarity snippet, a missing or doubled container, consent after GTM)',
  'entry-missing': 'an entry file has no built page',
  'rss': 'a feed item link does not resolve to a built entry',
  'robots': 'robots.txt is missing its sitemap or points at a missing file',
  /* WARN */
  'title-length': 'rendered title over 60 characters (search results truncate it)',
  'description-length': 'meta description outside 120-165 characters',
  'og-image-alt': 'og:image:alt is missing',
  'no-internal-links': 'a page with zero internal links',
  'fragment': 'a #fragment link with no matching id on its target page',
  'lastmod-other': 'a non-entry sitemap URL has no lastmod',
  'noindex-canonical': 'a noindex page also declares a canonical',
  'og-meta': 'og:url, twitter:image or the image type disagree with the rest of the head',
  'faq-visible': 'FAQPage question count differs from the visible FAQ items',
  'headline': 'BlogPosting headline differs from the visible <h1>',
  'description-duplicate': 'two pages share one meta description',
  'stale-page': 'a built entry page has no entry file',
  'ld-id': 'an @id that is not an absolute URL',
  'setup': 'a check could not run against this build',
};
const fails = [];
const warns = [];
const fail = (check, page, detail = '') => fails.push({ check, page, detail: String(detail) });
const warn = (check, page, detail = '') => warns.push({ check, page, detail: String(detail) });

/* ---------------------------------------------------------------- files */
if (!fs.existsSync(DIR) || !fs.statSync(DIR).isDirectory()) tooling(`no build directory at ${DIR} (run the build first)`);
const files = [];
(function walk(d, rel) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) walk(path.join(d, e.name), r);
    else files.push(r);
  }
})(DIR, '');
const fileSet = new Set(files);
const htmlFiles = files.filter((f) => f.endsWith('.html')).sort();
if (!htmlFiles.length) tooling(`no .html files under ${DIR}`);
if (!fileSet.has('index.html')) tooling(`${DIR} has no index.html; is this a build of the site?`);

const read = (rel) => fs.readFileSync(path.join(DIR, rel), 'utf8');
const urlOfFile = (rel) => (rel === 'index.html' ? '/' : rel.endsWith('/index.html') ? `/${rel.slice(0, -10)}` : `/${rel}`);
const isEntryUrl = (u) => /^\/blog\/[^/]+\/$/.test(u);

/* ---------------------------------------------------------------- text helpers */
const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\xa0', middot: '\xb7', sect: '\xa7', copy: '\xa9',
  reg: '\xae', trade: '\u{2122}', deg: '\xb0', times: '\xd7', laquo: '\xab', raquo: '\xbb', shy: '\xad',
  mdash: '\u{2014}', ndash: '\u{2013}', hellip: '\u{2026}', bull: '\u{2022}', lsquo: '\u{2018}', rsquo: '\u{2019}', ldquo: '\u{201c}',
  rdquo: '\u{201d}', sbquo: '\u{201a}', bdquo: '\u{201e}', larr: '\u{2190}', uarr: '\u{2191}', rarr: '\u{2192}', darr: '\u{2193}',
  harr: '\u{2194}', crarr: '\u{21b5}', lArr: '\u{21d0}', uArr: '\u{21d1}', rArr: '\u{21d2}', dArr: '\u{21d3}', hArr: '\u{21d4}',
  check: '\u{2713}', checkmark: '\u{2713}', cross: '\u{2717}',
};
const ENTITY = /&(#x[0-9a-fA-F]+|#[0-9]+|[A-Za-z][A-Za-z0-9]*);/g;
function decodeEntity(body) {
  if (body[0] === '#') {
    const n = body[1] === 'x' || body[1] === 'X' ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
    return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : null;
  }
  return Object.prototype.hasOwnProperty.call(NAMED, body) ? NAMED[body] : null;
}
const decode = (s) => s.replace(ENTITY, (m, b) => decodeEntity(b) ?? m);
const clean = (s) => decode(s.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
/* Inline tags join their neighbours without a space: the headline typesetter
   wraps "Push-Ups" in a span and the "?" follows it directly. Block tags still
   separate words. */
const cleanInline = (s) => clean(s.replace(/<\/?(?:span|a|em|strong|b|i|mark|abbr|code|small|sup|sub)\b[^>]*>/gi, ''));
const len = (s) => [...s].length;

/* The banned class for rendered output. Curly quotes are not in it: Astro's
   SmartyPants makes them from straight quotes in prose, and the source gates
   already keep them out of everything a template writes. */
const BANNED = /[\u{2012}-\u{2015}\u{2022}\u{2023}\u{2026}\u{2043}\u{2190}-\u{21ff}\u{2713}\u{2714}]/u;
const BANNED_G = new RegExp(BANNED.source, 'gu');
const charName = (c) => {
  const cp = c.codePointAt(0);
  const hex = `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
  const names = { 0x2012: 'FIGURE DASH', 0x2013: 'EN DASH', 0x2014: 'EM DASH', 0x2015: 'HORIZONTAL BAR', 0x2022: 'BULLET',
    0x2023: 'TRIANGULAR BULLET', 0x2026: 'ELLIPSIS', 0x2043: 'HYPHEN BULLET', 0x2713: 'CHECK MARK', 0x2714: 'HEAVY CHECK MARK' };
  return `${hex} ${names[cp] || (cp >= 0x2190 && cp <= 0x21ff ? 'ARROW' : 'CHARACTER')}`;
};

/* A tag regex that respects quoted attribute values, so a ">" inside a
   description cannot end the tag early. */
const TAG = /<([a-zA-Z][\w:-]*)((?:\s+[^\s"'>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*\/?>/g;
const ATTR = /([^\s"'>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
function attrsOf(s) {
  const o = {};
  ATTR.lastIndex = 0;
  let m;
  while ((m = ATTR.exec(s))) {
    const k = m[1].toLowerCase();
    if (!(k in o)) o[k] = decode(m[2] ?? m[3] ?? m[4] ?? '');
  }
  return o;
}
const hasClass = (a, c) => (a.class || '').split(/\s+/).includes(c);

/* Ranges [start, end) of every <tag ...class="cls"...> element, matched by
   depth so nested elements of the same tag do not end it early. */
function elementRanges(markup, tag, cls) {
  const out = [];
  const re = new RegExp(`<(/?)${tag}\\b((?:\\s+[^\\s"'>\\/=]+(?:\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s"'=<>\`]+))?)*)\\s*>`, 'gi');
  let m;
  while ((m = re.exec(markup))) {
    if (m[1] || !hasClass(attrsOf(m[2]), cls)) continue;
    const start = m.index;
    const openEnd = re.lastIndex;
    let depth = 1;
    let end = markup.length;
    const scan = new RegExp(re.source, 'gi');
    scan.lastIndex = openEnd;
    let n;
    while ((n = scan.exec(markup))) {
      depth += n[1] ? -1 : 1;
      if (depth === 0) { end = scan.lastIndex; break; }
    }
    out.push({ start, openEnd, end });
    re.lastIndex = end;
  }
  return out;
}

/* ---------------------------------------------------------------- URL helpers */
const OWN_HOSTS = new Set(['www.strictly.fyi', 'strictly.fyi']);
/* Returns { internal, path, hash } for a URL found on page pageUrl, or null for
   schemes and links that are not resolvable files (mailto:, tel:, data:, #). */
function classify(raw, pageUrl) {
  const v = (raw || '').trim();
  if (!v || /^(mailto|tel|javascript|data|blob|sms):/i.test(v)) return null;
  let u;
  try { u = new URL(v, ORIGIN + pageUrl); } catch { return { internal: true, bad: true, path: v, hash: '' }; }
  if (!/^https?:$/.test(u.protocol)) return null;
  if (!OWN_HOSTS.has(u.host)) return { internal: false };
  let p = u.pathname;
  try { p = decodeURIComponent(p); } catch { /* keep the raw form */ }
  return { internal: true, path: p, hash: u.hash.slice(1), sameDoc: v.startsWith('#'), raw: v };
}
/* path -> built file, honouring /x/ -> x/index.html and extension files. */
function resolveFile(p) {
  if (p === '/' || p === '') return 'index.html';
  const rel = p.replace(/^\/+/, '');
  if (rel.endsWith('/')) return fileSet.has(`${rel}index.html`) ? `${rel}index.html` : null;
  if (fileSet.has(rel)) return rel;
  return null;
}
const pageExistsWithoutSlash = (p) => !p.endsWith('/') && fileSet.has(`${p.replace(/^\/+/, '')}/index.html`);

/* ---------------------------------------------------------------- images */
const imageCache = new Map();
function imageInfo(rel) {
  if (imageCache.has(rel)) return imageCache.get(rel);
  let info;
  try {
    const buf = fs.readFileSync(path.join(DIR, rel));
    if (buf.length >= 24 && buf.readUInt32BE(0) === 0x89504e47 && buf.toString('latin1', 12, 16) === 'IHDR') {
      info = { type: 'image/png', width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    } else if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
      info = { type: 'image/jpeg' };
      for (let i = 2; i + 9 < buf.length; ) {
        if (buf[i] !== 0xff) { i++; continue; }
        const marker = buf[i + 1];
        const segLen = buf.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          info.height = buf.readUInt16BE(i + 5);
          info.width = buf.readUInt16BE(i + 7);
          break;
        }
        i += 2 + segLen;
      }
    } else info = { type: 'unknown' };
  } catch (e) { info = { error: e.message }; }
  imageCache.set(rel, info);
  return info;
}

/* ---------------------------------------------------------------- site constants */
/* Read the analytics contract straight from src/data/site.ts so the test and
   the Layout can never disagree about which container should load. */
let gtmId = null;
let consentDefaults = null;
try {
  const site = fs.readFileSync(path.join(ROOT, 'src', 'data', 'site.ts'), 'utf8');
  const g = site.match(/export\s+const\s+gtmId\s*=\s*["'`]([^"'`]*)["'`]/);
  const c = site.match(/export\s+const\s+consentDefaults\s*=\s*(true|false)/);
  gtmId = g ? g[1] : null;
  consentDefaults = c ? c[1] === 'true' : null;
} catch { /* the analytics checks report the gap below */ }
if (gtmId === null) warn('setup', '(site)', 'could not read gtmId from src/data/site.ts; the GTM checks did not run');

/* ---------------------------------------------------------------- per-page pass */
const pages = [];
let ldTotal = 0;
const ownHostRe = /\bhttps?:\/\/(?:www\.)?strictly\.fyi\b/gi;

for (const rel of htmlFiles) {
  const url = urlOfFile(rel);
  const html = read(rel);
  const pg = { rel, url, ids: new Set(), links: [], internalLinks: 0 };
  pages.push(pg);

  /* Blank script and style bodies (same length, so offsets stay aligned) before
     reading tags, so markup inside a JS string is never mistaken for a tag. */
  const scripts = [];
  const styles = [];
  let markup = html.replace(/<(script|style)\b([^>]*)>([\s\S]*?)<\/\1\s*>/gi, (m, tag, a, body, off) => {
    const openEnd = tag.length + a.length + 2;
    (tag.toLowerCase() === 'script' ? scripts : styles).push({ attrs: attrsOf(a), body, start: off + openEnd });
    return m.slice(0, openEnd) + ' '.repeat(body.length) + m.slice(openEnd + body.length);
  });
  /* Data URIs go first: an inline SVG inside one carries its own url(#id) refs. */
  pg.cssUrls = [...new Set(styles.flatMap((s) => [...s.body.replace(/url\(\s*(["'])data:[\s\S]*?\1\s*\)/g, ' ').matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)].map((u) => u[2])))];

  /* HTML comments: none may ship. Inside prose they are a markdown leak; in
     chrome they publish template notes in view-source. */
  const comments = [...markup.matchAll(/<!--([\s\S]*?)-->/g)];
  if (comments.length) fail('html-comment', url, `${comments.length} comment(s), first: <!--${comments[0][1].trim().slice(0, 50)}-->`);
  markup = markup.replace(/<!--[\s\S]*?-->/g, (m) => ' '.repeat(m.length));

  /* Tags. */
  const metas = [];
  const linkTags = [];
  let titles = 0;
  let h1 = 0;
  let h1Text = '';
  let robots = '';
  TAG.lastIndex = 0;
  let m;
  while ((m = TAG.exec(markup))) {
    const name = m[1].toLowerCase();
    const a = attrsOf(m[2]);
    if (a.id) pg.ids.add(a.id);
    if (a.name && (name === 'a')) pg.ids.add(a.name);
    if (name === 'title') titles++;
    else if (name === 'h1') {
      h1++;
      const close = markup.indexOf('</h1>', TAG.lastIndex);
      if (h1 === 1 && close > 0) h1Text = cleanInline(markup.slice(TAG.lastIndex, close));
    } else if (name === 'meta') {
      metas.push(a);
      if ((a.name || '').toLowerCase() === 'robots') robots += ` ${a.content || ''}`;
    } else if (name === 'link') linkTags.push(a);
    /* Every URL-bearing attribute; canonical is checked on its own below. */
    const refs = [];
    if (a.href !== undefined && !(name === 'link' && /\bcanonical\b/i.test(a.rel || ''))) refs.push(['href', a.href]);
    if (a.src !== undefined) refs.push(['src', a.src]);
    if (a.action !== undefined && name === 'form') refs.push(['action', a.action]);
    for (const k of ['srcset', 'imagesrcset']) if (a[k]) for (const part of a[k].split(',')) refs.push([k, part.trim().split(/\s+/)[0]]);
    for (const [attr, value] of refs) pg.links.push({ tag: name, attr, value, rel: a.rel || '' });
  }

  /* Head basics. */
  const titleM = markup.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleM ? clean(titleM[1]) : '';
  pg.title = title;
  if (titles !== 1) fail('title-count', url, `${titles} <title> elements`);
  else if (!title) fail('title-count', url, 'empty <title>');
  else if (len(title) > 60) warn('title-length', url, `${len(title)} chars: "${title}"`);
  const descs = metas.filter((x) => (x.name || '').toLowerCase() === 'description');
  pg.description = descs[0]?.content?.trim() || '';
  if (descs.length !== 1 || !pg.description) fail('description', url, descs.length !== 1 ? `${descs.length} meta descriptions` : 'empty meta description');
  else if (len(pg.description) < 120 || len(pg.description) > 165) warn('description-length', url, `${len(pg.description)} chars`);
  if (h1 !== 1) fail('h1-count', url, `${h1} <h1> elements`);
  pg.h1 = h1Text;

  /* Robots and canonical. */
  pg.noindex = /\bnoindex\b/i.test(robots) || /\bnone\b/i.test(robots);
  const canon = linkTags.filter((x) => /\bcanonical\b/i.test(x.rel || ''));
  pg.canonical = canon[0]?.href || '';
  if (canon.length > 1) fail('canonical-count', url, `${canon.length} canonicals`);
  if (pg.noindex) {
    if (canon.length) warn('noindex-canonical', url, pg.canonical);
  } else if (!canon.length) fail('canonical-missing', url, 'indexable (no robots noindex) but no <link rel="canonical">');
  else if (!/^https:\/\/www\.strictly\.fyi\/(?:[^?#\s]*\/)?$/.test(pg.canonical)) fail('canonical-format', url, pg.canonical);
  else if (pg.canonical !== ORIGIN + url) {
    const other = resolveFile(pg.canonical.slice(ORIGIN.length));
    fail('canonical-self', url, `${pg.canonical} (expected ${ORIGIN + url}; ${other ? 'that is another page' : 'that URL is not a page in this build'})`);
  }

  /* Open Graph. */
  const prop = (k) => metas.find((x) => (x.property || x.name || '').toLowerCase() === k)?.content;
  const ogImage = prop('og:image');
  if (!ogImage) fail('og-image', url, 'no og:image');
  else {
    const c = classify(ogImage, url);
    if (!/^https:\/\//.test(ogImage)) fail('og-image', url, `og:image is not absolute: ${ogImage}`);
    if (c && c.internal) {
      const file = resolveFile(c.path);
      if (!file) fail('og-image', url, `og:image does not resolve to a file: ${ogImage}`);
      else {
        const info = imageInfo(file);
        const w = Number(prop('og:image:width'));
        const h = Number(prop('og:image:height'));
        if (info.error) fail('og-image', url, `cannot read ${file}: ${info.error}`);
        else if (info.type !== 'image/png' && info.type !== 'image/jpeg') fail('og-image', url, `${file} is not a PNG (cards are PNG)`);
        else if (!w || !h) fail('og-image', url, 'og:image:width or og:image:height missing');
        else if (info.width !== w || info.height !== h) fail('og-image', url, `${file} is ${info.width}x${info.height}, the head declares ${w}x${h}`);
        const declaredType = prop('og:image:type');
        if (declaredType && info.type && info.type !== 'unknown' && declaredType !== info.type) warn('og-meta', url, `og:image:type ${declaredType} but ${file} is ${info.type}`);
      }
    }
    if (!prop('og:image:alt')) warn('og-image-alt', url);
    const tw = prop('twitter:image');
    if (tw && tw !== ogImage) warn('og-meta', url, `twitter:image differs from og:image (${tw})`);
    const twAlt = prop('twitter:image:alt');
    if (twAlt && prop('og:image:alt') && twAlt !== prop('og:image:alt')) warn('og-meta', url, 'twitter:image:alt differs from og:image:alt');
  }
  const ogUrl = prop('og:url');
  if (!pg.noindex && ogUrl && pg.canonical && ogUrl !== pg.canonical) warn('og-meta', url, `og:url ${ogUrl} differs from the canonical`);

  /* JSON-LD: one block, parseable, every reference resolvable, no Person. */
  const ld = scripts.filter((s) => (s.attrs.type || '').toLowerCase() === 'application/ld+json');
  ldTotal += ld.length;
  if (ld.length > 1) fail('ld-blocks', url, `${ld.length} blocks`);
  const defs = new Set();
  const refs = [];
  const nodes = [];
  const walkLd = (n) => {
    if (Array.isArray(n)) return n.forEach(walkLd);
    if (!n || typeof n !== 'object') return;
    const keys = Object.keys(n);
    if (typeof n['@id'] === 'string') {
      if (keys.length === 1) refs.push(n['@id']);
      else defs.add(n['@id']);
    }
    if (n['@type']) nodes.push(n);
    for (const k of keys) if (k !== '@id') walkLd(n[k]);
  };
  for (const s of ld) {
    try { walkLd(JSON.parse(s.body)); }
    catch (e) { fail('ld-parse', url, e.message.slice(0, 120)); }
  }
  for (const r of new Set(refs)) if (!defs.has(r)) fail('ld-ref', url, r);
  for (const id of new Set([...defs, ...refs])) if (!/^https?:\/\//.test(id)) warn('ld-id', url, id);
  const typeOf = (n) => [].concat(n['@type']);
  if (nodes.some((n) => typeOf(n).includes('Person'))) fail('ld-person', url, 'Person node in JSON-LD');
  pg.blogPosting = nodes.find((n) => typeOf(n).includes('BlogPosting') || typeOf(n).includes('Article'));
  const faqPage = nodes.find((n) => typeOf(n).includes('FAQPage'));
  if (pg.blogPosting && pg.blogPosting.headline && h1Text && decode(String(pg.blogPosting.headline)) !== h1Text) {
    warn('headline', url, `"${pg.blogPosting.headline}" vs h1 "${h1Text}"`);
  }
  const faqItems = (markup.match(/<details\b[^>]*class="[^"]*\bfaq[\w-]*\b[^"]*"/gi) || []).length;
  if (faqPage) {
    const q = [].concat(faqPage.mainEntity || []).length;
    if (q !== faqItems) warn('faq-visible', url, `FAQPage has ${q} questions, the page shows ${faqItems}`);
  }
  pg.modified = pg.blogPosting?.dateModified || prop('article:modified_time') || '';

  /* Analytics contract: one GTM container, consent default first, nothing else. */
  if (/googletagmanager\.com\/gtag\/js/i.test(html)) fail('analytics', url, 'gtag.js loaded directly; GA4 lives in GTM');
  if (/clarity\.ms\/tag|www\.clarity\.ms\//i.test(html)) fail('analytics', url, 'Clarity snippet in the HTML; Clarity lives in GTM');
  if (gtmId) {
    const loaders = (html.match(/googletagmanager\.com\/gtm\.js/g) || []).length;
    if (loaders !== 1) fail('analytics', url, `${loaders} GTM loaders (expected 1)`);
    if (!html.includes(gtmId)) fail('analytics', url, `container ${gtmId} not on the page`);
    if (consentDefaults) {
      const c = html.search(/gtag\(\s*['"]consent['"]\s*,\s*['"]default['"]/);
      const g = html.indexOf('googletagmanager.com/gtm.js');
      if (c < 0) fail('analytics', url, 'no consent default before GTM (consentDefaults is true)');
      else if (g >= 0 && c > g) fail('analytics', url, 'the consent default runs after the GTM loader');
    }
  } else if (gtmId === '' && /googletagmanager\.com\/gtm\.js/.test(html)) fail('analytics', url, 'GTM loads although gtmId is empty');

  /* Banned characters, outside entry prose and FAQ answers. Prose and answers
     are excluded because SmartyPants rewrites the ASCII source there; the
     markdown gates already police that source. Script and style bodies are
     scanned, because a "Copied" label set from JS is still on screen. */
  const skip = [];
  if (isEntryUrl(url)) {
    for (const r of elementRanges(markup, 'div', 'prose')) skip.push([r.openEnd, r.end]);
    for (const r of elementRanges(markup, 'details', 'faq-item')) {
      const sumEnd = markup.indexOf('</summary>', r.openEnd);
      skip.push([sumEnd > 0 && sumEnd < r.end ? sumEnd : r.openEnd, r.end]);
    }
    for (const cls of ['faq-a', 'faq-answer']) for (const r of elementRanges(markup, 'div', cls)) skip.push([r.openEnd, r.end]);
  }
  const skipped = (i) => skip.some(([s, e]) => i >= s && i < e);
  const hits = [];
  /* Context is the text node around the hit, so one template line repeated on
     many pages groups into one finding. A character alone in its element is
     located by that element's open tag instead. */
  const ctx = (i, width) => {
    const lt = html.lastIndexOf('>', i);
    const gt = html.indexOf('<', i + width);
    let text = html.slice(lt + 1, gt < 0 ? html.length : gt).replace(/\s+/g, ' ');
    const at = text.indexOf(html.slice(i, i + width));
    if (text.trim().length <= width + 2) return `${html.slice(html.lastIndexOf('<', lt), lt + 1).slice(0, 70)}${text.trim()}`;
    if (text.length > 56) text = (at > 34 ? '...' : '') + text.slice(Math.max(0, at - 34), at + width + 18) + (at + width + 18 < text.length ? '...' : '');
    return text.trim();
  };
  BANNED_G.lastIndex = 0;
  while ((m = BANNED_G.exec(html))) if (!skipped(m.index)) hits.push(`${charName(m[0])}: "${ctx(m.index, 1)}"`);
  /* Own regex instance: decode() inside the loop resets the shared one. */
  const entities = new RegExp(ENTITY.source, 'g');
  while ((m = entities.exec(html))) {
    const d = decodeEntity(m[1]);
    if (d && BANNED.test(d) && !skipped(m.index)) hits.push(`${charName(d)} written as ${m[0]}: "${ctx(m.index, m[0].length)}"`);
  }
  for (const h of new Set(hits)) fail('banned-char', url, h);

  /* Own-host URLs must be https://www. Apex or http forms split the signals. */
  for (const mm of new Set(html.match(ownHostRe) || [])) if (mm.toLowerCase() !== 'https://www.strictly.fyi') fail('own-host', url, mm);
}

/* ---------------------------------------------------------------- links and fragments */
const byUrl = new Map(pages.map((p) => [p.url, p]));
const pageForFile = new Map(pages.map((p) => [p.rel, p]));
let urlsChecked = 0;
for (const pg of pages) {
  for (const l of pg.links) {
    const c = classify(l.value, pg.url);
    if (!c || !c.internal) continue;
    urlsChecked++;
    const isAnchor = l.tag === 'a' || l.tag === 'area';
    if (c.bad) { fail('href-broken', pg.url, `${l.tag} ${l.attr}="${l.value}" (malformed)`); continue; }
    if (c.sameDoc) {
      if (isAnchor) pg.internalLinks++;
      if (c.hash && c.hash !== 'top' && !pg.ids.has(c.hash)) warn('fragment', pg.url, `#${c.hash}`);
      continue;
    }
    const file = resolveFile(c.path);
    if (isAnchor) pg.internalLinks++;
    if (!file) {
      if (pageExistsWithoutSlash(c.path)) fail('href-slash', pg.url, `${l.tag} ${l.attr}="${l.value}" (use ${c.path}/)`);
      else fail('href-broken', pg.url, `${l.tag} ${l.attr}="${l.value}"`);
      continue;
    }
    if (c.hash && file.endsWith('.html')) {
      const target = pageForFile.get(file);
      if (target && !target.ids.has(c.hash) && c.hash !== 'top') warn('fragment', pg.url, `${l.value} (no id="${c.hash}" on ${target.url})`);
    }
  }
  if (pg.internalLinks === 0) warn('no-internal-links', pg.url);
}

/* CSS url() references, in the stylesheets the pages load and in inline
   <style> blocks (the build inlines its CSS). A broken self-hosted font URL
   fails silently in the browser, so check it here, once per distinct URL. */
const CSS_URL = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;
const cssSeen = new Set();
const cssUrlSeen = new Set();
for (const pg of pages) {
  for (const raw of pg.cssUrls) {
    const v = raw.trim();
    if (/^(data:|#|%23)/i.test(v)) continue;
    const cu = classify(v, pg.url);
    if (!cu || !cu.internal || cssUrlSeen.has(cu.path)) continue;
    cssUrlSeen.add(cu.path);
    if (!resolveFile(cu.path)) fail('href-broken', pg.url, `url(${v}) in an inline style`);
  }
}
for (const pg of pages) {
  for (const l of pg.links) {
    if (l.tag !== 'link' || !/\bstylesheet\b/i.test(l.rel)) continue;
    const c = classify(l.value, pg.url);
    if (!c || !c.internal) continue;
    const file = resolveFile(c.path);
    if (!file || cssSeen.has(file)) continue;
    cssSeen.add(file);
    const css = read(file).replace(/url\(\s*(["'])data:[\s\S]*?\1\s*\)/g, ' ');
    for (const u of css.matchAll(CSS_URL)) {
      const v = u[2].trim();
      if (/^(data:|#|%23)/i.test(v)) continue;
      const cu = classify(v, `/${file}`);
      if (cu && cu.internal) cssUrlSeen.add(cu.path);
      if (cu && cu.internal && !resolveFile(cu.path)) fail('href-broken', `/${file}`, `url(${v})`);
    }
  }
}

/* ---------------------------------------------------------------- duplicates */
function groupBy(arr, key) {
  const mp = new Map();
  for (const x of arr) {
    const k = key(x);
    if (!mp.has(k)) mp.set(k, []);
    mp.get(k).push(x);
  }
  return mp;
}
for (const [t, ps] of groupBy(pages.filter((p) => p.title), (p) => p.title)) {
  if (ps.length > 1) for (const p of ps) fail('title-duplicate', p.url, `"${t}" (${ps.length} pages)`);
}
for (const [d, ps] of groupBy(pages.filter((p) => p.description), (p) => p.description)) {
  if (ps.length > 1) for (const p of ps) warn('description-duplicate', p.url, `"${d.slice(0, 60)}..." (${ps.length} pages)`);
}

/* ---------------------------------------------------------------- sitemap */
const sitemapUrls = [];
const smFiles = [];
if (fileSet.has('sitemap-index.xml')) {
  const idx = read('sitemap-index.xml');
  for (const mm of idx.matchAll(/<sitemap>[\s\S]*?<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
    const loc = decode(mm[1]);
    if (!loc.startsWith(`${ORIGIN}/`)) fail('own-host', '/sitemap-index.xml', loc);
    const f = resolveFile(loc.replace(/^https?:\/\/[^/]+/, ''));
    if (!f) fail('sitemap', '/sitemap-index.xml', `child sitemap ${loc} is not in the build`);
    else smFiles.push(f);
  }
} else if (fileSet.has('sitemap-0.xml')) smFiles.push('sitemap-0.xml');
else if (fileSet.has('sitemap.xml')) smFiles.push('sitemap.xml');
if (!smFiles.length) fail('sitemap', '(site)', 'no sitemap-index.xml, sitemap-0.xml or sitemap.xml in the build');
for (const f of smFiles) {
  for (const mm of read(f).matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = decode((mm[1].match(/<loc>\s*([^<]+?)\s*<\/loc>/) || [])[1] || '');
    const lastmod = ((mm[1].match(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/) || [])[1] || '').trim();
    sitemapUrls.push({ loc, lastmod, file: f });
  }
}
const indexableCanon = new Map();
for (const p of pages) if (!p.noindex && p.canonical) indexableCanon.set(p.canonical, p);
const smLocs = new Map();
for (const s of sitemapUrls) {
  if (smLocs.has(s.loc)) fail('sitemap-extra', `/${s.file}`, `${s.loc} listed twice`);
  smLocs.set(s.loc, s);
}
if (smFiles.length) {
  for (const [c, p] of indexableCanon) if (!smLocs.has(c)) fail('sitemap-missing', p.url, c);
  for (const [loc, s] of smLocs) {
    if (indexableCanon.has(loc)) continue;
    const local = loc.replace(/^https?:\/\/[^/]+/, '') || '/';
    const p = byUrl.get(local);
    if (p && p.noindex) fail('sitemap-noindex', p.url, loc);
    else if (!/^https:\/\/www\.strictly\.fyi\//.test(loc)) fail('own-host', `/${s.file}`, loc);
    else if (!resolveFile(local)) fail('sitemap-extra', `/${s.file}`, `${loc} resolves to no built page`);
    else fail('sitemap-extra', `/${s.file}`, `${loc} is not the canonical of an indexable page`);
  }
  /* lastmod: required on entries and equal to the entry's own dateModified,
     because a lastmod that moves without the content is a false freshness claim. */
  const W3C = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2}))?$/;
  const day = (s) => { const d = new Date(s); return Number.isNaN(d.valueOf()) ? '' : d.toISOString().slice(0, 10); };
  for (const s of sitemapUrls) {
    const local = s.loc.replace(/^https?:\/\/[^/]+/, '') || '/';
    if (s.lastmod && !W3C.test(s.lastmod)) { fail('sitemap-lastmod', local, `malformed lastmod "${s.lastmod}"`); continue; }
    if (!isEntryUrl(local)) { if (!s.lastmod) warn('lastmod-other', local); continue; }
    const p = byUrl.get(local);
    if (!s.lastmod) { fail('sitemap-lastmod', local, 'no <lastmod>'); continue; }
    if (p && p.modified && day(p.modified) !== day(s.lastmod)) fail('sitemap-lastmod', local, `lastmod ${s.lastmod}, dateModified ${p.modified}`);
  }
}

/* ---------------------------------------------------------------- entries, feed, robots */
const blogDir = path.join(ROOT, 'src', 'content', 'blog');
if (fs.existsSync(blogDir)) {
  const slugs = fs.readdirSync(blogDir).filter((f) => /\.md$/i.test(f)).map((f) => f.replace(/\.md$/i, ''));
  for (const s of slugs) if (!fileSet.has(`blog/${s}/index.html`)) fail('entry-missing', `/blog/${s}/`, `src/content/blog/${s}.md has no built page`);
  const known = new Set(slugs);
  for (const p of pages) if (isEntryUrl(p.url) && !known.has(p.url.split('/')[2])) warn('stale-page', p.url, 'built entry page with no src/content/blog file');
} else warn('setup', '(site)', 'src/content/blog not found; the entry coverage check did not run');

if (fileSet.has('rss.xml')) {
  const rss = read('rss.xml');
  for (const mm of rss.match(ownHostRe) || []) if (mm.toLowerCase() !== 'https://www.strictly.fyi') fail('own-host', '/rss.xml', mm);
  for (const mm of rss.matchAll(/<item>[\s\S]*?<link>\s*([^<]+?)\s*<\/link>/g)) {
    const link = decode(mm[1]);
    const local = link.replace(/^https?:\/\/[^/]+/, '');
    if (!link.startsWith(`${ORIGIN}/`) || !local.endsWith('/') || !resolveFile(local)) fail('rss', '/rss.xml', link);
  }
} else warn('setup', '(site)', 'no rss.xml in the build');

if (fileSet.has('robots.txt')) {
  const robotsTxt = read('robots.txt');
  const maps = [...robotsTxt.matchAll(/^\s*sitemap:\s*(\S+)/gim)].map((x) => x[1]);
  if (!maps.length) fail('robots', '/robots.txt', 'no Sitemap: line');
  for (const s of maps) {
    if (!s.startsWith(`${ORIGIN}/`)) fail('own-host', '/robots.txt', s);
    else if (!resolveFile(s.slice(ORIGIN.length))) fail('robots', '/robots.txt', `${s} is not in the build`);
  }
} else fail('robots', '(site)', 'no robots.txt in the build');

/* ---------------------------------------------------------------- report */
const indexable = pages.filter((p) => !p.noindex).length;
const ms = Date.now() - t0;
const order = Object.keys(CHECKS);
const report = (list, label) => {
  const byCheck = groupBy(list, (x) => x.check);
  const ids = [...byCheck.keys()].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  for (const id of ids) {
    const items = byCheck.get(id);
    const pagesHit = new Set(items.map((x) => x.page)).size;
    console.log(`${label} ${id} (${pagesHit} page${pagesHit === 1 ? '' : 's'}): ${CHECKS[id] || ''}`);
    const byDetail = groupBy(items, (x) => x.detail);
    let shown = 0;
    for (const [detail, xs] of byDetail) {
      if (!flags.has('--verbose') && shown >= 8) { console.log(`     ... ${byDetail.size - shown} more distinct finding(s); --verbose lists them`); break; }
      const ps = [...new Set(xs.map((x) => x.page))];
      const list2 = flags.has('--verbose') ? ps.join(' ') : ps.slice(0, 3).join(' ') + (ps.length > 3 ? ` (+${ps.length - 3} more)` : '');
      console.log(`     ${detail ? `${detail}  ` : ''}[${ps.length === 1 ? list2 : `${ps.length} pages: ${list2}`}]`);
      shown++;
    }
  }
};

if (flags.has('--json')) {
  /* Pure JSON for machines; the verdict is the result field. */
  console.log(JSON.stringify({ dir: DIR, pages: pages.length, indexable, sitemapUrls: sitemapUrls.length, ms, fails, warns, result: fails.length ? 'FAIL' : 'PASS' }, null, 2));
  process.exit(fails.length ? 1 : 0);
} else {
  console.log(`check-dist: ${DIR}`);
  console.log(`  ${pages.length} pages (${indexable} indexable, ${pages.length - indexable} noindex), ${sitemapUrls.length} sitemap URLs, ${files.length} files, ${ms} ms`);
  /* What a PASS covered, so a pass on an empty or half-built dir is visible. */
  console.log(`  checked: ${ldTotal} JSON-LD block(s), ${urlsChecked} internal URL(s), ${cssUrlSeen.size} distinct CSS url(s), ${imageCache.size} social card file(s)\n`);
  report(fails, 'FAIL');
  if (fails.length && warns.length) console.log('');
  report(warns, 'WARN');
  const failChecks = new Set(fails.map((f) => f.check));
  const warnChecks = new Set(warns.map((f) => f.check));
  console.log(`\n${fails.length} FAIL finding(s) in ${failChecks.size} check(s), ${warns.length} WARN finding(s) in ${warnChecks.size} check(s)`);
}
console.log(`DIST CHECK: ${fails.length ? 'FAIL' : 'PASS'}`);
process.exit(fails.length ? 1 : 0);
