#!/usr/bin/env node
/*
 * lint-claims.cjs - the claim gate for strictly.fyi.
 *
 * The trope gate checks how a sentence is written; this checks whether it is
 * true to the page it cites. strictly.fyi quotes primary sources verbatim and
 * puts figures in link text, so the claims that most need a mechanical check
 * are the quote and the anchored number:
 *
 *   quote          a double-quoted span of 4+ words must be on the cited page
 *                  (split at "...", [bracketed] insertions dropped)
 *   anchor number  a figure inside link text must be on that link's page
 *   number         other figures in a cited sentence: absent means REVIEW only,
 *                  because derived arithmetic is legitimate
 *   superlative    "the first", "oldest", "the only"... must be on the page,
 *                  near the noun it qualifies
 *   causal frame   "which is why", "the reason"... always REVIEW: a string match
 *                  cannot prove a relationship
 *
 * Verdicts: FAIL only when the cited page was read (1,500+ characters of text)
 * and the claim is not on it. Unreadable, bot-walled, thin or PDF pages are
 * REVIEW, never FAIL, and so is anything checked against a citation borrowed
 * from elsewhere in the paragraph. Search-engine and Google pages are never
 * fetched.
 *
 * Usage:
 *   node scripts/lint-claims.cjs <slug | entry.md>     one entry (prints every claim)
 *   node scripts/lint-claims.cjs --all                 the corpus (prints FAILs and a summary)
 *   flags: --offline (cache only; a miss is REVIEW)  --refresh (ignore the cache)
 *          --json  --verbose (print ok lines with --all)
 *   cache: $CLAIMS_CACHE, else <os tmpdir>/strictly-fyi-claims-cache. Readable
 *          pages are kept 30 days, failures 1 day; every entry records its fetch date.
 *   ledger: REVIEW items already verified by hand are listed in VERIFICATION_LEDGER.md
 *          at the repo root (see the file for the line format) and report as LEDGERED.
 *
 * Exit codes: 0 = no FAIL (PASS or REVIEW: read the last line) | 1 = FAIL | 2 = tooling error.
 * Last line: "CLAIM GATE: PASS", "CLAIM GATE: REVIEW" or "CLAIM GATE: FAIL" (FAIL also on exit 2).
 * With --json the output is one JSON document whose gate field is the verdict.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

function tooling(msg) {
  console.error(`lint-claims: ${msg}`);
  console.log('TOOLING ERROR (exit 2) - this is never a pass');
  console.log('CLAIM GATE: FAIL');
  process.exit(2);
}
let lib;
try { lib = require('./gates.cjs'); } catch (e) { tooling(`cannot load scripts/gates.cjs: ${e.message}`); }
const { ROOT, BLOG, OWN, loadCorpus, readEntry, sentenceSpans } = lib;

/* ---------------------------------------------------------------- CLI */
const args = process.argv.slice(2);
const KNOWN = ['--all', '--offline', '--refresh', '--json', '--verbose'];
for (const a of args) if (a.startsWith('--') && !KNOWN.includes(a)) tooling(`unknown flag ${a}`);
const ALL = args.includes('--all');
const OFFLINE = args.includes('--offline');
const REFRESH = args.includes('--refresh');
const JSON_OUT = args.includes('--json');
const VERBOSE = args.includes('--verbose') || !ALL;
const targetsArg = args.filter((a) => !a.startsWith('--'));
if (!ALL && targetsArg.length !== 1) tooling('usage: node scripts/lint-claims.cjs <slug|entry.md> [--offline] | --all');
const CACHE = process.env.CLAIMS_CACHE || path.join(os.tmpdir(), 'strictly-fyi-claims-cache');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const MIN_TEXT = 1500;
const DAY = 86400000;

/* ---------------------------------------------------------------- word lists */
const SUPERLATIVES = [
  'widest', 'largest', 'biggest', 'broadest', 'deepest', 'fastest', 'cheapest', 'most comprehensive', 'most complete',
  'most accurate', 'most popular', 'most used', 'most advanced', 'the best', 'the only', 'the first', 'the leading',
  'number one', 'highest', 'lowest', 'never been', 'oldest', 'earliest', 'longest', 'shortest', 'smallest', 'tallest',
  'heaviest', 'hottest', 'coldest', 'rarest', 'most famous', 'the last', 'no one has ever', 'nobody has ever',
];
const CAUSAL = ['which proves', 'proving that', 'which is why', 'this shows that', 'demonstrates that', 'the reason',
  'because of this', 'as a result of', 'in response to', 'forced them to', 'the norm is', 'always takes', 'never takes'];
const MULTI = ['both sources', 'all three', 'all four', 'each of them', 'they all', 'both agree', 'every source'];
/* Filler skipped when finding the word a superlative qualifies. */
const STOPW = new Set('a an the of to in on at by for with from and or but is was are were be been its it this that these those as into than then known recorded ever time times one two three about around nearly almost over under more less least some such so very much many still really truly'.split(' '));

/* ---------------------------------------------------------------- text normalization */
const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ensp: ' ', emsp: ' ', thinsp: ' ', shy: '', mdash: '-', ndash: '-',
  hellip: '...', lsquo: "'", rsquo: "'", sbquo: "'", ldquo: '"', rdquo: '"', bdquo: '"', laquo: '"', raquo: '"', middot: ' ', bull: ' ',
  copy: ' ', reg: ' ', deg: ' degrees ', frac12: ' 1/2 ', frac14: ' 1/4 ', frac34: ' 3/4 ', times: 'x', minus: '-', prime: "'", Prime: '"',
  aelig: 'ae', AElig: 'AE', oelig: 'oe', OElig: 'OE', szlig: 'ss', eth: 'd', thorn: 'th', THORN: 'Th', oslash: 'o', Oslash: 'O' };
function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[A-Za-z][A-Za-z0-9]*);/g, (m, b) => {
    if (b[0] === '#') {
      const n = b[1] === 'x' || b[1] === 'X' ? parseInt(b.slice(2), 16) : parseInt(b.slice(1), 10);
      return n > 0 && n < 0x110000 ? String.fromCodePoint(n) : ' ';
    }
    if (b in NAMED) return NAMED[b];
    const accented = b.match(/^([A-Za-z])(acute|grave|circ|uml|tilde|ring|cedil|caron|macr)$/);
    return accented ? accented[1] : m;
  });
}
/* Both sides go through this: entities decoded, diacritics and ligatures
   folded (the entries are ASCII: Reaumur, cafe), quotes straightened, dashes
   and the long s mapped, thousands separators dropped, then only words left. */
function norm(s, { joinHyphens = false } = {}) {
  let t = decodeEntities(String(s))
    .normalize('NFKD').replace(/[\u{300}-\u{36f}]/gu, '')
    .replace(/\u{17f}/gu, 's').replace(/\xe6/g, 'ae').replace(/\u{153}/gu, 'oe').replace(/\xdf/g, 'ss')
    .replace(/[\u{2018}\u{2019}\u{201a}\u{201b}\u{2032}`\xb4]/gu, "'")
    .replace(/[\u{201c}\u{201d}\u{201e}\u{201f}\u{2033}\xab\xbb]/gu, '"')
    .replace(/[\u{2010}-\u{2015}\u{2212}]/gu, '-')
    .replace(/\u{2026}/gu, '...')
    .replace(/[\xad\u{200b}\u{200c}\u{200d}\u{feff}]/gu, '');
  if (joinHyphens) t = t.replace(/([A-Za-z])-[ \t]*\r?\n\s*([a-z])/g, '$1$2');
  return ` ${t.replace(/&/g, ' and ').replace(/(\d)[,\xa0\u{2009}\u{202f}](?=\d{3}(?!\d))/gu, '$1').toLowerCase().replace(/'s\b/g, 's').replace(/[^a-z0-9]+/g, ' ').trim()} `;
}

/* ---------------------------------------------------------------- markdown units */
const MD_LINK = /\[((?:[^\][]|\[[^\]]*\])*)\]\(\s*<?((?:[^()\s<>]|\([^()\s]*\))+)>?(?:\s+"[^"]*")?\s*\)/g;
const isExternal = (u) => /^https?:\/\//i.test(u) && !OWN.test(u);
/* Markdown to plain text with link ranges kept, emphasis and code marks dropped. */
function flatten(md) {
  let text = '';
  const links = [];
  const plain = (s) => s.replace(/`/g, '').replace(/\*+/g, '').replace(/(^|[\s(["'])_+|_+(?=[\s)\]"'.,;:!?]|$)/g, '$1');
  let last = 0;
  let m;
  MD_LINK.lastIndex = 0;
  while ((m = MD_LINK.exec(md))) {
    text += plain(md.slice(last, m.index));
    const start = text.length;
    text += plain(m[1]);
    links.push({ start, end: text.length, url: m[2], text: plain(m[1]) });
    last = MD_LINK.lastIndex;
  }
  text += plain(md.slice(last));
  return { text, links };
}
/* Split a body into blocks: paragraphs, list items, table rows, blockquotes. */
function units(body, bodyLine) {
  const lines = body.split('\n');
  const blocks = [];
  let cur = null;
  const flush = () => { if (cur) blocks.push(cur); cur = null; };
  lines.forEach((l, i) => {
    const ln = bodyLine + i;
    if (!l.trim()) { flush(); return; }
    const type = /^\s*#{1,6}\s/.test(l) ? 'heading' : /^\s*\|/.test(l) ? 'table' : /^\s*>/.test(l) ? 'quote' : /^\s*([-*+]|\d+[.)])\s+/.test(l) ? 'list' : 'para';
    if (type === 'heading') { flush(); blocks.push({ type, rows: [{ md: l, ln }] }); return; }
    if (cur && (cur.type === type || (cur.type === 'list' && type === 'para'))) {
      if (type === 'list' || type === 'table') cur.rows.push({ md: l, ln });
      else cur.rows[cur.rows.length - 1].md += `\n${l}`;
      return;
    }
    flush();
    cur = { type, rows: [{ md: l, ln }] };
  });
  flush();
  const out = [];
  blocks.forEach((b, i) => {
    if (b.type === 'heading') return;
    const rows = b.rows
      .filter((r) => !(b.type === 'table' && /^\s*\|?\s*:?-{3,}/.test(r.md)))
      .map((r) => ({ ln: r.ln, md: b.type === 'quote' ? r.md.replace(/^\s*>\s?/gm, '') : b.type === 'list' ? r.md.replace(/^\s*([-*+]|\d+[.)])\s+/, '') : r.md }));
    const blockLinks = rows.flatMap((r) => [...r.md.matchAll(MD_LINK)].map((m) => m[2])).filter(isExternal);
    /* A blockquote's source is cited in the paragraph before it (or after). */
    const near = b.type === 'quote'
      ? [blocks[i - 1], blocks[i + 1]].filter((x) => x && x.type !== 'heading').flatMap((x) => x.rows.flatMap((r) => [...r.md.matchAll(MD_LINK)].map((m) => m[2]))).filter(isExternal)
      : [];
    for (const r of rows) out.push({ type: b.type, ln: r.ln, md: r.md, context: [...new Set([...blockLinks, ...near])] });
  });
  return out;
}

/* Pair double quotes by position: an opener follows the start, a space or an
   opening bracket; a closer precedes a space or punctuation. One greedy regex
   would capture the text between two separate quotations. */
function quoteSpans(text) {
  const spans = [];
  let open = -1;
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== '"') continue;
    const before = i === 0 ? ' ' : text[i - 1];
    const after = i + 1 >= text.length ? ' ' : text[i + 1];
    const canOpen = /[\s([{\/-]/.test(before) && !/\s/.test(after);
    const canClose = !/\s/.test(before) && /[\s.,;:!?)\]}'\/-]/.test(after);
    if (open < 0) { if (canOpen) open = i; }
    else if (canClose) { spans.push([open + 1, i]); open = -1; }
    else if (canOpen) open = i;
  }
  return spans;
}
const NUM = /(?<![\w.,$])\$?(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?)(s?)(\s?(?:%|percent\b|per cent\b))?(?![\w])/g;
function numbersIn(s) {
  const out = [];
  let m;
  NUM.lastIndex = 0;
  while ((m = NUM.exec(s))) {
    const digits = m[1].replace(/,/g, '');
    if (m[2] && !/^\d{3}0$/.test(digits)) continue; /* "1960s" yes, "3s" no */
    if (digits.replace(/\D/g, '').length < 2 && !m[3]) continue; /* single digits carry no signal */
    out.push({ raw: m[0].trim(), value: digits, percent: Boolean(m[3]), index: m.index });
  }
  return out;
}

/* ---------------------------------------------------------------- claims */
function extractClaims(entry) {
  const claims = [];
  const seen = new Set();
  const push = (c) => {
    const key = `${c.kind}|${c.text}|${c.links.join(' ')}`;
    if (seen.has(key)) return;
    seen.add(key);
    claims.push(c);
  };
  for (const u of units(entry.body, entry.bodyLine)) {
    const { text, links } = flatten(u.md);
    const ext = links.filter((l) => isExternal(l.url));
    const unitLinks = [...new Set([...ext.map((l) => l.url), ...u.context])];
    if (!unitLinks.length) continue;
    const spans = sentenceSpans(text);
    const lineAt = (i) => u.ln + (text.slice(0, i).match(/\n/g) || []).length;
    const sentenceOf = (i) => spans.findIndex(([a, b]) => i >= a && i < b);
    const ownIn = (a, b) => [...new Set(ext.filter((l) => l.start < b && l.end > a).map((l) => l.url))];
    const quotes = quoteSpans(text);
    const inQuote = (i) => quotes.some(([a, b]) => i >= a && i < b);
    const inAnchor = (i) => ext.some((l) => i >= l.start && i < l.end);

    /* Quotes, against the links of every sentence the quote spans. */
    for (const [qa, qb] of quotes) {
      const q = text.slice(qa, qb).trim();
      if (q.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length < 4) continue;
      const s1 = spans[Math.max(0, sentenceOf(qa))] || [qa, qb];
      const s2 = spans[Math.max(0, sentenceOf(Math.max(qa, qb - 1)))] || s1;
      const own = ownIn(Math.min(s1[0], s2[0]), Math.max(s1[1], s2[1]));
      const frags = q.split(/\.{3}|\u{2026}|\[[^\]]*\]/u).map((f) => norm(f)).filter((f) => f.trim().split(' ').length >= 3);
      if (!frags.length) continue;
      push({ kind: 'quote', line: lineAt(qa), text: q, frags, links: own.length ? own : unitLinks, widened: !own.length, blockquote: u.type === 'quote' });
    }
    /* Figures inside link text belong to that link. */
    for (const l of ext) {
      for (const n of numbersIn(l.text)) {
        if (inQuote(l.start + n.index)) continue;
        push({ kind: 'anchor-number', line: lineAt(l.start), text: n.raw, value: n.value, percent: n.percent, anchor: l.text, links: [l.url], widened: false });
      }
    }
    for (const [sa, sb] of spans) {
      const sentence = text.slice(sa, sb);
      const own = ownIn(sa, sb);
      const links2 = own.length ? own : unitLinks;
      const widened = !own.length;
      for (const n of numbersIn(sentence)) {
        const at = sa + n.index;
        if (inQuote(at) || inAnchor(at)) continue;
        push({ kind: 'number', line: lineAt(at), text: n.raw, value: n.value, percent: n.percent, sentence: sentence.trim(), links: links2, widened });
      }
      const lower = sentence.toLowerCase();
      for (const sup of SUPERLATIVES) {
        const re = new RegExp(`\\b${sup.replace(/[.*+?^${}()|[\]\\#]/g, '\\$&')}\\b`, 'g');
        let m;
        while ((m = re.exec(lower))) {
          if (inQuote(sa + m.index)) continue;
          const rest = lower.slice(m.index + sup.length).split(/[^a-z0-9-]+/).filter((w) => w && !STOPW.has(w));
          push({ kind: 'superlative', line: lineAt(sa + m.index), text: sup, noun: rest[0] || '', sentence: sentence.trim(), links: links2, widened });
          break;
        }
      }
      for (const c of CAUSAL) if (lower.includes(c)) { push({ kind: 'causal', line: lineAt(sa), text: c, sentence: sentence.trim(), links: links2, widened }); break; }
      for (const c of MULTI) if (lower.includes(c)) { push({ kind: 'multi-source', line: lineAt(sa), text: c, sentence: sentence.trim(), links: links2, widened }); break; }
    }
  }
  return claims;
}

/* ---------------------------------------------------------------- fetching */
const SEARCH_HOSTS = /(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|search\.yahoo\.com|yandex\.[a-z.]+|baidu\.com|search\.brave\.com|startpage\.com|mojeek\.com|ecosia\.org|ask\.com)$/i;
const WALLS = /(^|\.)(etymonline\.com|onlinelibrary\.wiley\.com|link\.springer\.com|jstor\.org)$/i;
const OCR_HOSTS = /(^|\.)(archive\.org|chroniclingamerica\.loc\.gov|gutenberg\.org)$/i;
const hostOf = (u) => { try { return new URL(u).host.toLowerCase(); } catch { return ''; } };
const shortUrl = (u) => u.replace(/^https?:\/\//, '').replace(/\/$/, '').slice(0, 90);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const registrable = (h) => {
  const p = h.replace(/^www\./, '').split('.');
  return p.length > 2 && /^(co|ac|gov|org|com|edu|net)$/.test(p[p.length - 2]) && p[p.length - 1].length === 2 ? p.slice(-3).join('.') : p.slice(-2).join('.');
};

/* Where to read a citation as text. archive.org BookReader pages hold no book
   text, so ask its metadata API for the real OCR file; Wayback captures are
   read raw (id_); Gutenberg as plain text; PMC with a Europe PMC fallback. */
function plan(url) {
  const h = hostOf(url);
  let m;
  if (!h) return { skip: 'not a URL' };
  if (SEARCH_HOSTS.test(h) || /^books\.google\./.test(h)) return { skip: 'a search engine or Google page; never fetched (check it by hand)' };
  // The American Heritage Dictionary has no other item URL: each entry lives at /word/search.html?q=<headword>.
  if (/\/search\/?\?|[?&](q|query)=/.test(url) && !/archive\.org\/details|ahdictionary\.com\/word\/search\.html\?q=/.test(url)) return { skip: 'a search-results URL; cite the item, not the search' };
  if (WALLS.test(h)) return { skip: 'bot wall: this host answers scripts with HTTP 403 (read it in a browser or with kane-cli)', wall: true };
  if (/\.pdf($|[?#])/i.test(url) && !/archive\.org\/download\//.test(url)) return { skip: 'a PDF; not parsed (check it by hand)' };
  if ((m = url.match(/^https?:\/\/(?:www\.)?archive\.org\/(?:details|stream|download)\/([^/?#]+)/i))) return { archive: m[1], ocr: true };
  if ((m = url.match(/^https?:\/\/web\.archive\.org\/web\/(\d+)[a-z_]*\/(.+)$/i))) return { fetch: `https://web.archive.org/web/${m[1]}id_/${m[2]}` };
  if ((m = url.match(/gutenberg\.org\/ebooks\/(\d+)(?:[/?#.]|$)/i))) return { fetch: `https://www.gutenberg.org/cache/epub/${m[1]}/pg${m[1]}.txt`, ocr: true };
  if ((m = url.match(/(?:pmc\.ncbi\.nlm\.nih\.gov\/articles|ncbi\.nlm\.nih\.gov\/pmc\/articles)\/(PMC\d+)/i))) return { fetch: url.split('#')[0], fallback: `https://www.ebi.ac.uk/europepmc/webservices/rest/${m[1]}/fullTextXML` };
  return { fetch: url.split('#')[0], ocr: OCR_HOSTS.test(h) };
}

const hostNext = new Map();
async function politeFetch(url, accept) {
  const h = hostOf(url);
  for (;;) {
    const wait = (hostNext.get(h) || 0) - Date.now();
    if (wait <= 0) break;
    await sleep(wait);
  }
  hostNext.set(h, Date.now() + (/archive\.org$/.test(h) ? 2000 : 1000));
  let last;
  for (let attempt = 0; attempt < 2; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 25000);
    try {
      const res = await fetch(url, { redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': UA, Accept: accept || 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5', 'Accept-Language': 'en-US,en;q=0.9' } });
      const buf = Buffer.from(await res.arrayBuffer());
      const type = res.headers.get('content-type') || '';
      if ((res.status === 429 || res.status >= 500) && attempt === 0) {
        const ra = Math.min(10, Number(res.headers.get('retry-after')) || 3);
        await sleep(ra * 1000);
        continue;
      }
      let charset = (type.match(/charset=([\w-]+)/i) || [])[1] || (buf.slice(0, 2048).toString('latin1').match(/<meta[^>]+charset=["']?([\w-]+)/i) || [])[1] || 'utf-8';
      let body;
      try { body = new TextDecoder(charset.toLowerCase()).decode(buf); } catch { body = buf.toString('utf8'); charset = 'utf-8'; }
      return { status: res.status, ok: res.ok, finalUrl: res.url || url, type, body, bytes: buf.length };
    } catch (e) {
      last = e.name === 'AbortError' ? 'timeout after 25 s' : e.message;
      if (attempt === 0) await sleep(2000);
    } finally { clearTimeout(timer); }
  }
  return { status: 0, ok: false, error: last || 'network error' };
}
function htmlToText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|noscript|svg|template|head)\b[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<(br|p|div|li|tr|td|th|h[1-6]|section|article|blockquote|dd|dt|pre)\b[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[(?:\d{1,3}|[a-z]|note \d+|citation needed|nb \d+)\]/gi, ' ');
}
/* Challenge pages are short; a long page that merely mentions reCAPTCHA in its
   footer is a real page. */
const INTERSTITIAL = /just a moment\.\.\.|enable javascript and cookies to continue|attention required|verify you are human|are you a robot|security check to access|access denied|request unsuccessful/i;

const cacheFile = (key) => path.join(CACHE, `${crypto.createHash('sha1').update(key).digest('hex')}.json`);
function cacheGet(key) {
  try {
    const c = JSON.parse(fs.readFileSync(cacheFile(key), 'utf8'));
    const age = Date.now() - Date.parse(c.fetchedAt);
    if (!OFFLINE && (REFRESH || age > (c.ok ? 30 : 1) * DAY)) return null;
    return c;
  } catch { return null; }
}
function cachePut(key, page) {
  try { fs.mkdirSync(CACHE, { recursive: true }); fs.writeFileSync(cacheFile(key), JSON.stringify(page)); } catch { /* the cache is an optimization */ }
}

async function readPage(url) {
  const p = plan(url);
  if (p.skip) return { url, ok: false, reason: p.skip, wall: Boolean(p.wall), never: true };
  const cached = cacheGet(url);
  if (cached) return { ...cached, cached: true };
  if (OFFLINE) return { url, ok: false, reason: 'offline and not in the cache' };
  let page;
  if (p.archive) {
    const meta = await politeFetch(`https://archive.org/metadata/${encodeURIComponent(p.archive)}`, 'application/json');
    let j = null;
    try { j = meta.ok ? JSON.parse(meta.body) : null; } catch { j = null; }
    if (!j || !j.files) page = { url, ok: false, reason: `archive.org metadata unavailable (${meta.status || meta.error})` };
    else if (j.is_dark || (j.metadata && String(j.metadata['access-restricted-item']) === 'true')) page = { url, ok: false, reason: 'archive.org lending-only item: the OCR text is not public (verify in the reader and ledger it)', lending: true };
    else {
      const txt = j.files.filter((f) => f.format === 'DjVuTXT' || /_djvu\.txt$/.test(f.name));
      if (!txt.length) page = { url, ok: false, reason: 'archive.org item has no OCR text file' };
      else {
        let text = '';
        for (const f of txt.slice(0, 6)) {
          const r = await politeFetch(`https://archive.org/download/${encodeURIComponent(p.archive)}/${f.name.split('/').map(encodeURIComponent).join('/')}`, 'text/plain');
          if (r.ok) text += `\n${r.body}`;
          if (text.length > 20e6) break;
        }
        page = text ? { url, ok: true, text, kind: 'ocr', finalUrl: url } : { url, ok: false, reason: 'archive.org OCR text could not be downloaded' };
      }
    }
  } else {
    let r = await politeFetch(p.fetch);
    let text = r.ok && !/pdf/i.test(r.type) ? (/html|xml/i.test(r.type) || /^\s*</.test(r.body) ? htmlToText(r.body) : r.body) : '';
    if (p.fallback && (!r.ok || norm(text).length < MIN_TEXT)) {
      const f = await politeFetch(p.fallback, 'application/xml');
      if (f.ok) { r = f; text = htmlToText(f.body); }
    }
    if (!r.ok) page = { url, ok: false, reason: r.status ? `HTTP ${r.status}` : r.error, status: r.status };
    else if (/pdf/i.test(r.type)) page = { url, ok: false, reason: 'a PDF; not parsed (check it by hand)' };
    else {
      const len = norm(text).length;
      const finalHost = hostOf(r.finalUrl);
      const moved = registrable(finalHost) !== registrable(hostOf(url)) && !/(^|\.)doi\.org$/.test(hostOf(url)) && !/archive\.org$/.test(finalHost);
      if (len < MIN_TEXT) page = { url, ok: false, reason: `only ${len} characters of text (JavaScript-rendered, a bot interstitial or a stub)`, thin: true };
      else if (len < 6000 && INTERSTITIAL.test(text)) page = { url, ok: false, reason: `a bot challenge page ("${text.match(INTERSTITIAL)[0]}")`, thin: true };
      else page = { url, ok: true, text, kind: p.ocr ? 'ocr' : 'html', finalUrl: r.finalUrl, moved: moved ? finalHost : undefined };
    }
  }
  page.fetchedAt = new Date().toISOString();
  cachePut(url, page);
  return page;
}

/* ---------------------------------------------------------------- matching */
/* Old print OCRs the long s as "f" ("fhall", "fculls"), so OCR text is also
   compared with f and s folded together on both sides. */
const foldS = (s) => s.replace(/f/g, 's');
const prepared = new Map();
function prep(page) {
  if (prepared.has(page.url)) return prepared.get(page.url);
  const ocr = page.kind === 'ocr';
  const base = norm(page.text);
  const variants = [[base, (f) => f]];
  if (ocr) {
    const joined = norm(page.text, { joinHyphens: true });
    variants.push([joined, (f) => f], [foldS(base), foldS], [foldS(joined), foldS]);
  }
  const words = (ocr ? foldS(base) : base).trim().split(' ');
  const index = new Map();
  words.forEach((w, i) => { if (!index.has(w)) index.set(w, []); index.get(w).push(i); });
  const p = { ocr, variants, words, index, raw: decodeEntities(page.text).normalize('NFKD').replace(/[\u{300}-\u{36f}]/gu, '').toLowerCase() };
  prepared.set(page.url, p);
  return p;
}
const hasPhrase = (p, frag) => p.variants.some(([v, fold]) => v.includes(` ${fold(frag.trim())} `));
/* Bounded edit distance: true when a and b differ by at most max edits. */
function within(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return false;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let low = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      low = Math.min(low, cur[j]);
    }
    if (low > max) return false;
    prev = cur;
  }
  return prev[b.length] <= max;
}
/* Best share of a fragment's words found inside any window of the page. On
   OCR text a word also counts when it is one or two misread letters away. */
function fuzzy(p, frag) {
  const ft = (p.ocr ? foldS(frag) : frag).trim().split(' ');
  const need = new Map();
  for (const t of ft) need.set(t, (need.get(t) || 0) + 1);
  /* Windows open on the rarest fragment words that the page actually has. */
  const anchors = [...need.keys()].filter((t) => p.index.has(t)).sort((a, b) => p.index.get(a).length - p.index.get(b).length).slice(0, 3);
  let best = 0;
  for (const a of anchors) {
    for (const pos of p.index.get(a).slice(0, 300)) {
      const win = p.words.slice(Math.max(0, pos - ft.length), Math.min(p.words.length, pos + ft.length));
      const have = new Map();
      for (const w of win) if (need.has(w)) have.set(w, (have.get(w) || 0) + 1);
      let hit = 0;
      for (const [t, c] of need) {
        const exact = Math.min(c, have.get(t) || 0);
        hit += exact;
        if (exact < c && p.ocr && t.length >= 4) {
          const max = t.length >= 8 ? 2 : 1;
          const close = win.filter((w) => w !== t && within(t, w, max)).length;
          hit += Math.min(c - exact, close);
        }
      }
      best = Math.max(best, hit / ft.length);
      if (best === 1) return 1;
    }
  }
  return best;
}
/* Old title pages print the year in Roman numerals (MDCLI, M.DC.LXXVI.). */
function romanYear(n) {
  const R = [[1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'], [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'], [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']];
  let s = '';
  for (const [v, r] of R) while (n >= v) { s += r; n -= v; }
  return new RegExp(`\\b${s.split('').join('[.\\s]?')}\\b\\.?`);
}
function hasNumber(p, value, percent) {
  const [int, dec] = value.split('.');
  const grouped = int.length > 3 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, '[,.\\s\\u00a0\\u2009\\u202f]?') : int;
  const core = `${grouped}${dec ? `[.,]${dec}` : ''}`;
  const re = new RegExp(`(?<![\\d.,])${core}(?![\\d]|[.,]\\d)`);
  /* Papers often give a share as a proportion: "54 percent" is "0.54". */
  const proportion = () => {
    const f = Number(value) / 100;
    if (!(f > 0 && f <= 1)) return false;
    const digits = f.toFixed(4).replace(/0+$/, '').replace(/^0/, '').replace('.', '\\.');
    return new RegExp(`(?<![\\d.])0?${digits}(?!\\d)`).test(p.raw);
  };
  if (!re.test(p.raw)) {
    if (percent) return proportion();
    return !dec && Number(int) >= 1000 && Number(int) < 1900 && romanYear(Number(int)).test(p.raw);
  }
  if (!percent) return true;
  return new RegExp(`(?<![\\d.,])${core}\\s*(%|percent|per cent|per-cent)`).test(p.raw) || proportion();
}
function superlativeNear(p, sup, noun) {
  const re = new RegExp(`\\b${sup.replace(/[.*+?^${}()|[\]\\#]/g, '\\$&')}\\b`, 'g');
  let m;
  let any = false;
  const stem = noun.replace(/[^a-z0-9]/g, '').slice(0, 5);
  while ((m = re.exec(p.raw))) {
    any = true;
    if (!stem || p.raw.slice(m.index, m.index + sup.length + 80).includes(stem)) return 'near';
  }
  return any ? 'far' : 'absent';
}

/* ---------------------------------------------------------------- verdicts */
function verdict(c, pages) {
  const got = c.links.map((u) => ({ u, page: pages.get(u) })).filter((x) => x.page);
  const readable = got.filter((x) => x.page.ok);
  const unread = got.filter((x) => !x.page.ok);
  const where = (xs) => xs.map((x) => shortUrl(x.u)).join(', ');
  const why = () => unread.map((x) => `${shortUrl(x.u)}: ${x.page.reason}`).join('; ');
  const moved = readable.filter((x) => x.page.moved);
  const movedNote = moved.length ? ` (note: ${where(moved)} now redirects to ${moved.map((x) => x.page.moved).join(', ')})` : '';
  const ocrOnly = readable.length && readable.every((x) => x.page.kind === 'ocr');

  if (c.kind === 'causal') return { v: 'REVIEW', note: `causal frame "${c.text}": does the cited page state this relationship, or is it inference?` };
  if (c.kind === 'multi-source') return { v: 'REVIEW', note: `"${c.text}": confirm each named source on its own page` };

  let found = null;
  if (c.kind === 'quote') found = readable.find((x) => c.frags.every((f) => hasPhrase(prep(x.page), f)));
  else if (c.kind === 'anchor-number' || c.kind === 'number') found = readable.find((x) => hasNumber(prep(x.page), c.value, c.percent));
  else if (c.kind === 'superlative') found = readable.find((x) => superlativeNear(prep(x.page), c.text, c.noun) === 'near');
  if (found) return { v: 'ok', note: `on ${shortUrl(found.u)}${movedNote}` };

  if (!readable.length) return { v: 'REVIEW', note: `no cited page could be read: ${why()}` };
  const partial = unread.length ? `; also unread: ${why()}` : '';
  const overlap = () => Math.max(...readable.map((x) => Math.min(...c.frags.map((f) => fuzzy(prep(x.page), f)))));
  if (c.widened) {
    /* A high overlap reads as a misquote of this page; a low one as a quote
       from a source the paragraph does not link. */
    const hint = c.kind === 'quote' ? ` (best ${Math.round(overlap() * 100)}% word overlap)` : '';
    return { v: 'REVIEW', note: `not on ${where(readable)}${hint}, a source cited elsewhere in the paragraph${c.blockquote ? ' (blockquote)' : ''}; confirm the real source and link it in the sentence${partial}` };
  }

  if (c.kind === 'quote') {
    const best = overlap();
    const pctBest = `${Math.round(best * 100)}%`;
    if (unread.length) return { v: 'REVIEW', note: `not on ${where(readable)} (best ${pctBest} word overlap)${partial}` };
    if (ocrOnly && best >= 0.85) return { v: 'REVIEW', note: `fuzzy ${pctBest} match on OCR text of ${where(readable)}: check the wording in the scan` };
    return { v: 'FAIL', note: `not on ${where(readable)} (best ${pctBest} word overlap): quote the page exactly, or cite the page that says it${movedNote}` };
  }
  if (c.kind === 'number') return { v: 'REVIEW', note: `${c.text} is not on ${where(readable)}: derived, or from another source?${partial}` };
  if (c.kind === 'anchor-number') {
    if (unread.length || ocrOnly) return { v: 'REVIEW', note: `${c.text} not found on ${where(readable)}${ocrOnly ? ' (OCR text: digits are often misread)' : ''}${partial}` };
    const bare = c.percent && readable.some((x) => hasNumber(prep(x.page), c.value, false));
    if (bare) return { v: 'REVIEW', note: `${c.value} is on ${where(readable)} but not as a percentage` };
    return { v: 'FAIL', note: `the link text says ${c.text}, but ${where(readable)} does not contain it${movedNote}` };
  }
  if (c.kind === 'superlative') {
    const far = readable.some((x) => superlativeNear(prep(x.page), c.text, c.noun) === 'far');
    if (far) return { v: 'REVIEW', note: `"${c.text}" is on ${where(readable)}, but not near "${c.noun}"` };
    if (unread.length || ocrOnly) return { v: 'REVIEW', note: `"${c.text}" not found on ${where(readable)}${partial}` };
    return { v: 'FAIL', note: `"${c.text}" appears nowhere on ${where(readable)}: reword to what the source says${movedNote}` };
  }
  return { v: 'REVIEW', note: 'unclassified claim' };
}

/* VERIFICATION_LEDGER.md: claims verified by hand where no script can reach.
   Line format, under a "## <slug>" heading:
   - "<claim text>" | <cited URL> | <BOT_WALL|LENDING_ONLY|PDF|PAYWALL|OCR_FUZZY|JS_RENDERED|DERIVED|PAGINATED> | <how verified> | <YYYY-MM-DD> */
function loadLedger() {
  const f = path.join(ROOT, 'VERIFICATION_LEDGER.md');
  const map = new Map();
  if (!fs.existsSync(f)) return map;
  let slug = null;
  for (const line of fs.readFileSync(f, 'utf8').replace(/\r\n?/g, '\n').split('\n')) {
    const h = line.match(/^##\s+([a-z0-9-]+)\s*$/);
    if (h) { slug = h[1]; continue; }
    const m = line.match(/^\s*-\s*"(.+?)"\s*\|\s*(\S+)\s*\|\s*([A-Z_]+)\s*\|\s*([^|]+?)\s*\|\s*(\d{4}-\d{2}-\d{2})\s*$/);
    if (slug && m) {
      if (!map.has(slug)) map.set(slug, []);
      map.get(slug).push({ text: norm(m[1]), url: m[2], code: m[3], how: m[4], date: m[5] });
    }
  }
  return map;
}

/* ---------------------------------------------------------------- run */
async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k]); }
  }));
  return out;
}

(async () => {
  let targets;
  try {
    if (ALL) targets = loadCorpus().entries;
    else {
      const t = targetsArg[0];
      const file = [path.resolve(process.cwd(), t), path.join(BLOG, t.endsWith('.md') ? t : `${t}.md`)].find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
      if (!file) tooling(`no entry file for "${t}"`);
      targets = [readEntry(file)];
    }
  } catch (e) { tooling(`cannot read entries: ${e.message}`); }

  const ledger = loadLedger();
  const perEntry = targets.map((e) => ({ e, claims: e.ok ? extractClaims(e) : [] }));
  const urls = [...new Set(perEntry.flatMap((x) => x.claims.filter((c) => c.kind !== 'causal' && c.kind !== 'multi-source').flatMap((c) => c.links)))];
  const pages = new Map();
  const fetched = await pool(urls, 4, (u) => readPage(u).catch((err) => ({ url: u, ok: false, reason: `fetch error: ${err.message}` })));
  urls.forEach((u, i) => pages.set(u, fetched[i]));

  let totalFail = 0;
  let totalReview = 0;
  const report = [];
  for (const { e, claims } of perEntry) {
    const rel = path.relative(process.cwd(), e.file).split(path.sep).join('/');
    const led = ledger.get(e.slug) || [];
    const rows = claims.map((c) => {
      const r = verdict(c, pages);
      if (r.v === 'REVIEW') {
        const hit = led.find((l) => c.links.includes(l.url) && (norm(c.text).includes(l.text.trim()) || l.text.includes(norm(c.text).trim())));
        if (hit) return { ...c, v: 'LEDGERED', note: `${hit.code}, ${hit.how}, ${hit.date}` };
      }
      return { ...c, ...r };
    });
    const nf = rows.filter((r) => r.v === 'FAIL').length;
    const nr = rows.filter((r) => r.v === 'REVIEW').length;
    totalFail += nf;
    totalReview += nr;
    report.push({ file: rel, slug: e.slug, error: e.ok ? undefined : e.error, claims: rows, fails: nf, reviews: nr, ok: rows.filter((r) => r.v === 'ok').length, ledgered: rows.filter((r) => r.v === 'LEDGERED').length });
  }
  const gate = totalFail ? 'FAIL' : totalReview ? 'REVIEW' : 'PASS';
  const pageList = [...pages.values()];

  if (JSON_OUT) {
    console.log(JSON.stringify({ gate, offline: OFFLINE, cache: CACHE, pages: pageList.map((p) => ({ url: p.url, ok: p.ok, kind: p.kind, reason: p.reason, cached: Boolean(p.cached), fetchedAt: p.fetchedAt })), results: report.map((r) => ({ ...r, claims: r.claims.map(({ frags, ...c }) => c) })) }, null, 2));
    process.exitCode = totalFail ? 1 : 0;
    return;
  }
  const label = (c) => {
    const t = c.kind === 'quote' ? `"${c.text.length > 90 ? `${c.text.slice(0, 87)}...` : c.text}"`
      : c.kind === 'anchor-number' ? `${c.text} in link text "${c.anchor.slice(0, 60)}"`
        : c.kind === 'number' || c.kind === 'superlative' || c.kind === 'causal' || c.kind === 'multi-source' ? `${c.kind === 'number' ? c.text : `"${c.text}"`} in "${c.sentence.length > 80 ? `${c.sentence.slice(0, 77)}...` : c.sentence}"` : c.text;
    return `${c.kind.padEnd(13)} ${t}`;
  };
  for (const r of report) {
    if (r.error) console.log(`${r.file}: cannot parse the frontmatter (${r.error})`);
    const show = r.claims.filter((c) => VERBOSE || c.v === 'FAIL');
    if (ALL && !show.length) continue;
    console.log(`${r.file}: ${r.claims.length} claim(s): ${r.fails} FAIL, ${r.reviews} REVIEW, ${r.ok} ok${r.ledgered ? `, ${r.ledgered} LEDGERED` : ''}`);
    for (const c of show) {
      console.log(`  L${String(c.line).padEnd(4)} ${label(c)}`);
      console.log(`        ${c.v.padEnd(8)} ${c.note}`);
    }
    if (show.length) console.log('');
  }
  const cachedN = pageList.filter((p) => p.cached).length;
  const unreadable = pageList.filter((p) => !p.ok);
  console.log(`${report.length} entr${report.length === 1 ? 'y' : 'ies'}, ${report.reduce((n, r) => n + r.claims.length, 0)} claims, ${pageList.length} cited page(s): ${pageList.length - unreadable.length} read (${cachedN} from cache), ${unreadable.length} unreadable${OFFLINE ? ' (offline)' : ''}`);
  if (unreadable.length && !ALL) for (const p of unreadable) console.log(`  unreadable: ${shortUrl(p.url)}: ${p.reason}`);
  if (ALL) {
    const worst = report.filter((r) => r.fails || r.reviews).sort((a, b) => b.fails - a.fails || b.reviews - a.reviews).slice(0, 12);
    for (const r of worst) console.log(`  ${r.slug.padEnd(44)} ${r.fails} FAIL, ${r.reviews} REVIEW`);
  }
  console.log(`${totalFail} FAIL, ${totalReview} REVIEW`);
  if (totalFail) console.log('A FAIL means the cited page was read and the claim is not on it: reword to what the page says, or cite the page that says it.');
  if (totalReview) console.log('Resolve each REVIEW in the fact-check table; ledger the ones no script can reach in VERIFICATION_LEDGER.md.');
  console.log(`CLAIM GATE: ${gate}`);
  /* exitCode, not process.exit(): after fetch, exiting hard can trip a libuv
     assertion on Windows and report 127 instead of the real code. */
  process.exitCode = totalFail ? 1 : 0;
})().catch((e) => {
  console.error(`lint-claims: ${e.stack || e.message}`);
  console.log('TOOLING ERROR (exit 2) - this is never a pass');
  console.log('CLAIM GATE: FAIL');
  process.exitCode = 2;
});
