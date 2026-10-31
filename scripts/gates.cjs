#!/usr/bin/env node
/*
 * gates.cjs - the per-entry gate runner for strictly.fyi.
 *
 * One command, one last line. It replaces the separate punctuation grep, the
 * awk length check and the manual link count, and it is the command the
 * orchestrator re-runs on every file, because writer agents report passes they
 * do not have.
 *
 * Usage (from anywhere; paths resolve against the repo):
 *   node scripts/gates.cjs <slug | path/to/entry.md>   one entry (default --mode=new)
 *   node scripts/gates.cjs --all                       the whole corpus (default --mode=corpus)
 *   flags:
 *     --mode=new|existing|corpus   new: a fresh entry; existing: an optimize pass (field
 *                                  lock against git HEAD); corpus: by-design accumulation
 *                                  such as reciprocal links reports as WARN, not FAIL
 *     --baseline=<gates.json>      only FAILs that are NEW against an earlier --json run
 *                                  block (the trope gate inherits the same baseline)
 *     --rank (with --all)          the optimize queue: entries ordered by debt
 *     --json  --quiet (with --all: summary only)  --no-tropes (skip the trope linter)
 *
 * Exit codes: 0 = no FAIL | 1 = at least one FAIL | 2 = tooling error.
 * Last line: "GATES: PASS" or "GATES: FAIL" (also FAIL on exit 2: a gate that
 * could not run is never a pass). With --json the output is one JSON document
 * whose gate field is the verdict. Run it in Bash, never PowerShell.
 *
 * Zero dependencies. This file is also the shared corpus reader for the other
 * scripts (link-audit.mjs, lint-claims.cjs, gsc.mjs): keep the exports stable.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BLOG = path.join(ROOT, 'src', 'content', 'blog');
const OWN = /^https?:\/\/(?:www\.)?strictly\.fyi(?=[/?#]|$)/i;
const DEPTS = ['science', 'history', 'tech', 'culture', 'everyday', 'curiosity'];
const KEYS = new Set(['title', 'description', 'pubDate', 'updatedDate', 'category', 'readingTime', 'filecode', 'featured', 'lead', 'almanac', 'faqs']);

/* ------------------------------------------------------------------------
 * Frontmatter: the YAML subset this corpus uses (key: "string", key: bare,
 * and a faqs list of q/a maps). Anything else is reported, never guessed.
 * ---------------------------------------------------------------------- */
function unquoteDouble(s, lineNo) {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '"') throw new Error(`line ${lineNo}: unescaped " inside a double-quoted value`);
    if (c !== '\\') { out += c; continue; }
    const n = s[++i];
    const map = { '"': '"', '\\': '\\', '/': '/', n: '\n', t: '\t', r: '\r', '0': '\0', ' ': ' ', _: '\xa0' };
    if (n in map) out += map[n];
    else if (n === 'x') { out += String.fromCharCode(parseInt(s.slice(i + 1, i + 3), 16)); i += 2; }
    else if (n === 'u') { out += String.fromCharCode(parseInt(s.slice(i + 1, i + 5), 16)); i += 4; }
    else if (n === 'U') { out += String.fromCodePoint(parseInt(s.slice(i + 1, i + 9), 16)); i += 8; }
    else throw new Error(`line ${lineNo}: unknown escape \\${n}`);
  }
  return out;
}
function scalar(v, lineNo) {
  const t = v.trim();
  if (t.startsWith('"')) {
    if (!/"$/.test(t) || t.length < 2) throw new Error(`line ${lineNo}: unterminated double-quoted value`);
    return unquoteDouble(t.slice(1, -1), lineNo);
  }
  if (t.startsWith("'")) {
    if (!/'$/.test(t) || t.length < 2) throw new Error(`line ${lineNo}: unterminated single-quoted value`);
    const inner = t.slice(1, -1);
    if (/(^|[^'])'([^']|$)/.test(inner.replace(/''/g, ''))) throw new Error(`line ${lineNo}: unescaped ' inside a single-quoted value`);
    return inner.replace(/''/g, "'");
  }
  const bare = t.replace(/\s+#.*$/, '');
  if (bare === 'true') return true;
  if (bare === 'false') return false;
  if (bare === 'null' || bare === '~' || bare === '') return null;
  if (/^-?\d+(\.\d+)?$/.test(bare)) return Number(bare);
  if (/^[>|][+-]?$/.test(bare)) throw new Error(`line ${lineNo}: block scalars are not used in this corpus; write the value on one line in double quotes`);
  if (/^[[{]/.test(bare)) throw new Error(`line ${lineNo}: flow collections are not used in this corpus`);
  if (/: /.test(bare)) throw new Error(`line ${lineNo}: a bare value containing ": " - quote it`);
  return bare;
}
function parseFrontmatter(raw) {
  const text = raw.replace(/^\u{feff}/u, '').replace(/\r\n?/g, '\n');
  const lines = text.split('\n');
  if (lines[0].trim() !== '---') return { ok: false, error: 'the file must start with a --- line', fm: {}, body: text, bodyLine: 1, fmLines: [] };
  let end = -1;
  for (let i = 1; i < lines.length; i++) if (lines[i].trim() === '---') { end = i; break; }
  if (end < 0) return { ok: false, error: 'no closing --- line for the frontmatter', fm: {}, body: '', bodyLine: 1, fmLines: [] };
  const fmLines = lines.slice(1, end);
  const fm = {};
  const lineOf = {};
  let list = null;
  let item = null;
  try {
    fmLines.forEach((l, i) => {
      const ln = i + 2;
      if (!l.trim() || /^\s*#/.test(l)) return;
      if (/\t/.test(l.match(/^\s*/)[0])) throw new Error(`line ${ln}: tab indentation`);
      let m;
      if ((m = l.match(/^([A-Za-z_][\w-]*):(?:\s+(.*)|\s*)$/))) {
        const key = m[1];
        if (key in fm) throw new Error(`line ${ln}: duplicate key "${key}"`);
        lineOf[key] = ln;
        list = null;
        item = null;
        if (m[2] === undefined || m[2].trim() === '' || /^#/.test(m[2].trim())) { fm[key] = []; list = fm[key]; return; }
        fm[key] = scalar(m[2], ln);
        return;
      }
      if ((m = l.match(/^(\s+)-\s+([A-Za-z_][\w-]*):\s+(.*)$/)) && list) {
        item = { [m[2]]: scalar(m[3], ln) };
        list.push(item);
        return;
      }
      if ((m = l.match(/^(\s+)-\s+(.*)$/)) && list) { item = null; list.push(scalar(m[2], ln)); return; }
      if ((m = l.match(/^(\s+)([A-Za-z_][\w-]*):\s+(.*)$/)) && item) {
        if (m[2] in item) throw new Error(`line ${ln}: duplicate key "${m[2]}" in a list item`);
        item[m[2]] = scalar(m[3], ln);
        return;
      }
      throw new Error(`line ${ln}: unsupported YAML shape: ${l.trim().slice(0, 60)}`);
    });
  } catch (e) {
    return { ok: false, error: e.message, fm, body: lines.slice(end + 1).join('\n'), bodyLine: end + 2, fmLines, lineOf };
  }
  for (const [k, v] of Object.entries(fm)) if (Array.isArray(v) && v.length === 0 && k !== 'faqs') fm[k] = null;
  return { ok: true, fm, body: lines.slice(end + 1).join('\n'), bodyLine: end + 2, fmLines, lineOf };
}

/* ------------------------------------------------------------------------
 * Text measures. wordCount mirrors src/lib/entries.ts wordCount exactly: it
 * is the count behind the reading time readers see. Change both together.
 * ---------------------------------------------------------------------- */
function wordCount(body = '') {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^\s*\|?\s*:?-{3,}.*$/gm, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/[|*_`#>]/g, ' ');
  return (text.match(/[A-Za-z0-9][A-Za-z0-9'.,-]*/g) || []).length;
}
const readingMinutes = (body) => Math.max(1, Math.round(wordCount(body) / 220));

/* Sentence splitter that does not break on initials ("M.G.L. Mills"),
   honorifics, case names ("Chisholm v. Georgia") or "U.S." - the trope
   linter's known blind spot. Titles always abbreviate; "No.", "c.", "p." and
   month names only before a number, so an answer that opens "No. Barn owls..."
   still splits in two. A repeated exclamation ("Tora! Tora! Tora!") is one title. */
const ABBR = /\b(?:Mr|Mrs|Ms|Dr|Prof|St|Sr|Jr|Mt|Ft|vs|v|cf|al|approx|Gen|Col|Capt|Lt|Sgt|Gov|Sen|Rev|Hon)\.(?=\s)/g;
const ABBR_NUM = /\b(?:No|Nos|Vol|Vols|ca|c|ch|ed|fig|pp|p|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.(?=\s+\d)/g;
/* Returns [start, end) character spans, so callers can map links and quotes
   onto sentences. Every protection swaps "." for a same-length marker. */
function sentenceSpans(text) {
  const s = String(text);
  const SAFE = '\u0001';
  const prot = s
    .replace(/\b(?:[A-Za-z]\.){2,}/g, (m) => m.replace(/\./g, SAFE))
    .replace(/\b([A-Z])\.(?=\s+[A-Z])/g, `$1${SAFE}`)
    .replace(ABBR, (m) => m.replace('.', SAFE))
    .replace(ABBR_NUM, (m) => m.replace('.', SAFE));
  const raw = [];
  const re = /(?<=[.!?]["')\]*_]*)\s+(?=["'(\[*_]*[A-Z0-9])/g;
  let start = 0;
  let m;
  while ((m = re.exec(prot))) { raw.push([start, m.index]); start = m.index + m[0].length; }
  raw.push([start, s.length]);
  const word = (w) => (w || '').replace(/[^A-Za-z0-9]/g, '').toLowerCase();
  const out = [];
  for (let [a, b] of raw) {
    while (a < b && /\s/.test(s[a])) a++;
    while (b > a && /\s/.test(s[b - 1])) b--;
    if (a >= b) continue;
    const prev = out[out.length - 1];
    const prevText = prev ? s.slice(prev[0], prev[1]) : '';
    const first = s.slice(a, b).split(/\s+/)[0];
    if (prev && /!["')\]*_]*$/.test(prevText) && word(first) && word(first) === word(prevText.split(/\s+/).pop())) prev[1] = b;
    else out.push([a, b]);
  }
  return out;
}
function sentences(text) {
  const t = String(text).replace(/\s+/g, ' ').trim();
  return sentenceSpans(t).map(([a, b]) => t.slice(a, b));
}

/* The almanac line must be a deletions-only trim of ONE sentence of the entry:
   a body sentence, a heading, a list item, a table cell, the pull-quote, or one
   sentence of a FAQ answer. Its words have to occur in that sentence in the
   same order, numbers included, so an added or changed word or number, or two
   merged sentences, finds no source. Returns the source sentence, or null. */
const almWords = (s) => String(s).toLowerCase().match(/[a-z0-9]+(?:[.,'\-/][a-z0-9]+)*/g) || [];
const plainMd = (s) =>
  String(s)
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
const ALM_PRONOUNS = new Set(['it', 'this', 'that', 'they', 'these', 'he', 'she', 'its', 'their']);

function almanacSource(alm, body, answers) {
  const want = almWords(alm);
  if (!want.length) return null;
  const units = [];
  let para = [];
  const flush = () => {
    if (para.length) units.push(...sentences(plainMd(para.join(' '))));
    para = [];
  };
  for (const raw of String(body).replace(/\r\n?/g, '\n').split('\n')) {
    const t = raw.trim();
    if (!t) { flush(); continue; }
    if (/^#{1,6}\s/.test(t)) { flush(); units.push(plainMd(t.replace(/^#{1,6}\s+/, ''))); continue; }
    if (t.startsWith('|')) {
      flush();
      if (!/^\|?\s*:?-{3,}/.test(t)) units.push(...t.split('|').map(plainMd).filter(Boolean));
      continue;
    }
    if (/^>/.test(t)) { flush(); units.push(...sentences(plainMd(t.replace(/^>\s?/, '')))); continue; }
    if (/^([-*+]|\d+\.)\s/.test(t)) { flush(); units.push(...sentences(plainMd(t.replace(/^([-*+]|\d+\.)\s+/, '')))); continue; }
    para.push(t);
  }
  flush();
  for (const a of answers) units.push(...sentences(plainMd(a)));
  for (const u of units) {
    const have = almWords(u);
    let j = 0;
    for (const w of have) if (w === want[j] && ++j === want.length) return u;
  }
  return null;
}

const STOP = new Set('a an the and or but nor for of in on at to by with from into as is are was were be been it its this that these those than then so if not no do does did how why what when where who which there their they them you your we our us he she his her i my me can could would should will may might must also just only very more most less some any all each every one two three'.split(' '));
const tokens = (s) => String(s).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
/* For comparing questions, numbers carry the meaning ("10-4" vs "10-7"). */
const qTokens = (s) => String(s).toLowerCase().split(/[^a-z0-9]+/).filter((w) => /^\d+$/.test(w) || (w.length > 2 && !STOP.has(w)));
const tokCache = new WeakMap();
function tokenCache(e) {
  if (!tokCache.has(e)) {
    const faqs = (Array.isArray(e.fm && e.fm.faqs) ? e.fm.faqs : []).filter((g) => g && typeof g.q === 'string').map((g) => [g.q, qTokens(g.q)]);
    tokCache.set(e, { title: qTokens((e.fm && e.fm.title) || ''), faqs });
  }
  return tokCache.get(e);
}
/* Two or more tokens a side, or one shared word would read as a duplicate. */
const jaccard = (a, b) => {
  const A = new Set(a);
  const B = new Set(b);
  if (A.size < 2 || B.size < 2) return 0;
  let n = 0;
  for (const x of A) if (B.has(x)) n++;
  return n / (A.size + B.size - n);
};

/* ------------------------------------------------------------------------
 * Links in a body. Fragment-safe and slash-optional, so ](/blog/x/#y) and a
 * slashless ](/blog/x) are both seen (the second one to be reported).
 * ---------------------------------------------------------------------- */
function bodyLinks(body) {
  const out = [];
  /* URLs may hold balanced parentheses: wiki/Tone_(linguistics). */
  const re = /(!?)\[((?:[^\][]|\[[^\]]*\])*)\]\(\s*<?((?:[^()\s<>]|\([^()\s]*\))+)>?(?:\s+"[^"]*")?\s*\)/g;
  let m;
  while ((m = re.exec(body))) {
    if (m[1]) continue;
    const href = m[3];
    const anchor = m[2];
    const line = body.slice(0, m.index).split('\n').length;
    let local = null;
    if (href.startsWith('/')) local = href;
    else if (OWN.test(href)) local = href.replace(OWN, '') || '/';
    if (local !== null) {
      const pathOnly = local.split(/[?#]/)[0];
      const bm = pathOnly.match(/^\/blog\/([a-z0-9-]+)(\/?)$/);
      out.push({ kind: 'internal', href, anchor, line, path: pathOnly, slug: bm ? bm[1] : null, slash: pathOnly.endsWith('/') || /\.[a-z0-9]+$/i.test(pathOnly), absolute: !href.startsWith('/') });
    } else if (/^https?:\/\//i.test(href)) out.push({ kind: 'external', href, anchor, line });
    else out.push({ kind: 'other', href, anchor, line });
  }
  return out;
}

/* ------------------------------------------------------------------------
 * The corpus: every entry file, parsed once.
 * ---------------------------------------------------------------------- */
function readEntry(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const slug = path.basename(file).replace(/\.md$/i, '');
  const parsed = parseFrontmatter(raw);
  const links = bodyLinks(parsed.body);
  return { file, slug, raw: raw.replace(/\r\n?/g, '\n'), ...parsed, links };
}
function loadCorpus(dir = BLOG) {
  const files = fs.readdirSync(dir).filter((f) => /\.md$/i.test(f)).sort().map((f) => path.join(dir, f));
  const entries = files.map(readEntry);
  const bySlug = new Map(entries.map((e) => [e.slug, e]));
  const inbound = new Map(entries.map((e) => [e.slug, new Set()]));
  for (const e of entries) {
    for (const l of e.links) if (l.kind === 'internal' && l.slug && l.slug !== e.slug && inbound.has(l.slug)) inbound.get(l.slug).add(e.slug);
  }
  return { entries, bySlug, inbound };
}
const fileNo = (fc) => Number(String(fc || '').replace(/[^0-9]/g, '')) || 0;

/* The day each entry file first entered git, read once per run, as
   { local, utc }: the author date's calendar day in the committer's own time
   zone and in UTC (the site's build clock). They differ only for a commit made
   just after local midnight east of Greenwich. A pubDate earlier than both is
   a backdated filing. A file that is not committed yet, or arrived by a rename,
   is simply absent. */
let addedCache = null;
function firstAdded() {
  if (addedCache) return addedCache;
  addedCache = new Map();
  try {
    const rel = path.relative(ROOT, BLOG).split(path.sep).join('/');
    const out = execFileSync('git', ['log', '--diff-filter=A', '--format=@%aI', '--name-only', '--', rel], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 16 * 1024 * 1024 });
    let day = null;
    for (const line of out.split('\n')) {
      if (line.startsWith('@')) {
        const iso = line.slice(1).trim();
        day = { local: iso.slice(0, 10), utc: new Date(iso).toISOString().slice(0, 10) };
      } else if (day && /\.md$/i.test(line.trim())) {
        const slug = path.basename(line.trim()).replace(/\.md$/i, '');
        /* git log runs newest first, so the last date seen is the earliest add. */
        addedCache.set(slug, day);
      }
    }
  } catch { /* no git: nothing to compare against */ }
  return addedCache;
}

/* ------------------------------------------------------------------------
 * The gates for one entry.
 * ---------------------------------------------------------------------- */
const BANNED = /[\u{2012}-\u{2015}\u{2018}\u{2019}\u{201c}\u{201d}\u{2190}-\u{21ff}\u{2022}\u{2026}\u{2713}\u{2714}]/u;
const today = () => {
  const d = new Date();
  return [d.toISOString().slice(0, 10), new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)];
};
const validDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s)) && !Number.isNaN(new Date(`${s}T00:00:00Z`).valueOf()) && new Date(`${s}T00:00:00Z`).toISOString().slice(0, 10) === s;
const plural = (n, w, pl = `${w}s`) => `${n} ${n === 1 ? w : pl}`;

function gateEntry(e, corpus, mode, opts = {}) {
  const res = [];
  const add = (id, status, detail = '', items) => res.push({ id, status, detail, ...(items && items.length ? { items } : {}) });
  const isNew = mode === 'new';
  const soft = isNew ? 'FAIL' : 'WARN';
  const fm = e.fm || {};
  const others = corpus.entries.filter((x) => x.slug !== e.slug);

  /* Frontmatter shape. */
  if (!e.ok) add('frontmatter', 'FAIL', e.error);
  else {
    const unknown = Object.keys(fm).filter((k) => !KEYS.has(k));
    if (unknown.length) add('frontmatter', isNew ? 'FAIL' : 'WARN', `unknown key(s) ${unknown.join(', ')}: Astro's schema drops them silently`, unknown);
    else add('frontmatter', 'PASS', `${Object.keys(fm).length} keys`);
  }

  const t = typeof fm.title === 'string' ? fm.title : '';
  if (!t.trim()) add('title', 'FAIL', 'missing or not a string');
  else if (t.length > 60) add('title', 'FAIL', `${t.length} chars (ceiling 60)`);
  else add('title', 'PASS', `${t.length} chars`);

  const d = typeof fm.description === 'string' ? fm.description : '';
  if (d.length >= 140 && d.length <= 165) add('description', 'PASS', `${d.length} chars`);
  else add('description', 'FAIL', d ? `${d.length} chars (band 140-165)` : 'missing');

  if (DEPTS.includes(fm.category)) add('category', 'PASS', fm.category);
  else add('category', 'FAIL', `"${fm.category}" is not one of ${DEPTS.join(', ')}`);

  /* Filecode: format, uniqueness, and sequence for a new entry. */
  const fc = fm.filecode;
  if (!/^FYI-\d{3,}$/.test(String(fc || ''))) add('filecode', 'FAIL', `"${fc ?? ''}" (format FYI-NNN)`);
  else {
    const dup = others.filter((x) => x.fm && x.fm.filecode === fc).map((x) => x.slug);
    const maxOther = Math.max(0, ...others.map((x) => fileNo(x.fm && x.fm.filecode)));
    if (dup.length) add('filecode', 'FAIL', `${fc} is also used by ${dup.join(', ')}`, dup);
    else if (isNew && fileNo(fc) !== maxOther + 1) add('filecode', 'WARN', `${fc}; the next free number after the corpus is FYI-${String(maxOther + 1).padStart(3, '0')} (fine inside a planned batch)`);
    else add('filecode', 'PASS', String(fc));
  }

  /* Flags that are the operator's call. */
  if (fm.featured === true) add('featured', isNew ? 'FAIL' : 'PASS', isNew ? 'a new entry is never featured; featuring is the operator\'s call' : 'true (operator\'s pick)');
  else if (fm.featured === false || fm.featured === undefined || fm.featured === null) add('featured', 'PASS', 'false');
  else add('featured', 'FAIL', `"${fm.featured}" is not a boolean`);
  if (fm.lead !== undefined && fm.lead !== null && typeof fm.lead !== 'boolean') add('lead', 'FAIL', `"${fm.lead}" is not a boolean`);
  else if (fm.lead === true) {
    const live = (x) => x.fm && validDate(x.fm.pubDate) && x.fm.pubDate <= today()[0];
    const newest = Math.max(...corpus.entries.map((x) => (live(x) ? Date.parse(x.fm.pubDate) : 0)));
    if (isNew) add('lead', 'WARN', 'lead: true pins the front page; only on the operator\'s say-so');
    else if (validDate(fm.pubDate) && Date.parse(fm.pubDate) < newest) add('lead', 'WARN', 'lead: true is inert: it pins only while the entry belongs to the newest filing date');
    else add('lead', 'PASS', 'pinned as the front-page lead');
  }

  /* Dates. pubDate is immutable; updatedDate only on a genuine refresh. */
  const [utcToday, localToday] = today();
  const pd = fm.pubDate;
  const added = firstAdded().get(e.slug);
  /* No day of grace: an entry committed after midnight went live that day, so
     its pubDate is that day (or, in the hours when the local and UTC calendars
     differ, the UTC day). Schedule a late-evening entry for the day it ships. */
  const addedDay = added ? (added.utc === added.local ? added.local : `${added.local} local, ${added.utc} UTC`) : '';
  if (!validDate(pd)) add('pubDate', 'FAIL', `"${pd ?? ''}" (YYYY-MM-DD)`);
  else if (pd > utcToday) add('pubDate', 'WARN', `scheduled: hidden from the site until a build on or after ${pd} (UTC); the daily-publish workflow rebuilds production on that day once VERCEL_DEPLOY_HOOK_URL is set`);
  else if (added && pd < added.utc) add('pubDate', 'FAIL', `${pd} is earlier than the day the file first entered git (${addedDay}): a backdated filing; use the real first-publication date`);
  else if (isNew && pd !== utcToday && pd !== localToday) add('pubDate', 'WARN', `${pd}; a new entry is filed today (${localToday}) and never backdated`);
  else add('pubDate', 'PASS', String(pd));
  /* Cadence, for a new entry: one entry a day and about three a week, so the
     archive never again shows a same-day drop (scheduled pubDates spread them). */
  if (isNew && validDate(pd)) {
    const weekOf = (d) => { const t = new Date(`${d}T00:00:00Z`); const day = (t.getUTCDay() + 6) % 7; t.setUTCDate(t.getUTCDate() - day); return t.toISOString().slice(0, 10); };
    const dated = corpus.entries.filter((x) => x.slug !== e.slug && x.fm && validDate(x.fm.pubDate));
    const sameDay = dated.filter((x) => x.fm.pubDate === pd).map((x) => x.slug);
    const sameWeek = dated.filter((x) => weekOf(x.fm.pubDate) === weekOf(pd)).length;
    if (sameDay.length) add('cadence', 'WARN', `${sameDay.length} other entr${sameDay.length === 1 ? 'y is' : 'ies are'} dated ${pd} (${sameDay.slice(0, 3).join(', ')}): schedule this one for another day`);
    else if (sameWeek >= 3) add('cadence', 'WARN', `${sameWeek} other entries fall in the week of ${weekOf(pd)}: the house cadence is about three a week`);
    else add('cadence', 'PASS', `alone on ${pd}, ${sameWeek + 1} in its week`);
  }
  if (fm.updatedDate !== undefined && fm.updatedDate !== null) {
    if (isNew) add('updatedDate', 'FAIL', 'a new entry carries no updatedDate');
    else if (!validDate(fm.updatedDate)) add('updatedDate', 'FAIL', `"${fm.updatedDate}" (YYYY-MM-DD)`);
    else if (validDate(pd) && fm.updatedDate < pd) add('updatedDate', 'FAIL', `${fm.updatedDate} is before pubDate ${pd}`);
    else if (fm.updatedDate > localToday && fm.updatedDate > utcToday) add('updatedDate', 'FAIL', `${fm.updatedDate} is in the future`);
    else add('updatedDate', 'PASS', `${fm.updatedDate} (renders a visible "Updated" line: only for new sourced content)`);
  }
  if (fm.readingTime !== undefined && isNew) add('readingTime', 'WARN', 'not rendered any more: reading time is computed from the body; delete the field');

  /* FAQs are optional: 0-5 complete pairs that stand alone (house style for a
     new entry is 0-3). Each one answers a distinct question a reader would ask;
     a query variant ("in 2004?", "in 2010?") is keyword padding, never an FAQ. */
  const faqs = Array.isArray(fm.faqs) ? fm.faqs : [];
  const complete = faqs.filter((f) => f && typeof f === 'object' && typeof f.q === 'string' && f.q.trim() && typeof f.a === 'string' && f.a.trim());
  if (faqs.length > 5 || complete.length !== faqs.length) add('faqs', 'FAIL', `${faqs.length} item(s), ${complete.length} complete (0-5 complete q/a pairs)`);
  else if (isNew && faqs.length > 3) add('faqs', 'WARN', `${faqs.length} q/a pairs (a new entry carries 0-3, each a distinct reader question)`);
  else add('faqs', 'PASS', `${faqs.length} q/a pairs`);
  const noQ = complete.filter((f) => !/\?\s*$/.test(f.q)).map((f) => f.q);
  if (noQ.length) add('faq-questions', soft, `${noQ.length} question(s) without a closing "?"`, noQ);
  const seenQ = new Set();
  const dupQ = complete.filter((f) => { const k = f.q.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); const dupe = seenQ.has(k); seenQ.add(k); return dupe; }).map((f) => f.q);
  if (dupQ.length) add('faq-questions', 'FAIL', `duplicate question(s): ${dupQ.join(' | ')}`, dupQ);
  /* Two questions that differ only by a number or year are one question asked
     twice for search engines. */
  const numStem = (q) => q.toLowerCase().replace(/\d[\d,.]*(?:s\b)?/g, '#').replace(/[^a-z#]+/g, ' ').trim();
  const stems = new Map();
  for (const f of complete) { const k = numStem(f.q); if (/#/.test(k)) stems.set(k, [...(stems.get(k) || []), f.q]); }
  const variants = [...stems.values()].filter((v) => v.length > 1);
  if (variants.length) add('faq-variants', 'FAIL', `questions that differ only by a number: ${variants.map((v) => v.join(' / ')).join('; ')}; keep one`, variants.flat());
  /* Near-duplicates: at least three shared content words and Jaccard 0.6, so two
     distinct questions that happen to share a pair of words are not flagged, and
     a pair already reported as number variants is not reported twice. */
  const nearQ = [];
  const variantSet = new Set(variants.flat());
  for (let i = 0; i < complete.length; i++) for (let j = i + 1; j < complete.length; j++) {
    const a = qTokens(complete[i].q);
    const b = qTokens(complete[j].q);
    const shared = new Set(a.filter((w) => b.includes(w))).size;
    if (variantSet.has(complete[i].q) && variantSet.has(complete[j].q)) continue;
    if (shared >= 3 && jaccard(a, b) >= 0.6) nearQ.push(`"${complete[i].q}" ~ "${complete[j].q}"`);
  }
  if (nearQ.length) add('faq-variants', 'WARN', `near-duplicate questions in this entry: ${nearQ.join('; ')}`, nearQ);
  const longA = complete.map((f, i) => ({ i: i + 1, n: sentences(f.a).length })).filter((x) => x.n > 3);
  if (longA.length) add('faq-answers', soft, longA.map((x) => `FAQ ${x.i}: ${x.n} sentences`).join(', ') + ' (1-3 sentences that stand alone)', longA.map((x) => `faq${x.i}`));
  else if (complete.length) add('faq-answers', 'PASS', '1-3 sentences each');
  const linkedA = complete.filter((f) => /\]\(|https?:\/\//.test(f.a)).map((f) => f.q);
  if (linkedA.length) add('faq-answers', 'WARN', `${linkedA.length} answer(s) carry markdown or a URL; answers render as plain text`, linkedA);

  /* Almanac: the front page's one-line fact, lifted from this entry. */
  const alm = fm.almanac;
  if (alm === undefined || alm === null || alm === '') add('almanac', 'WARN', 'missing (one standalone line, at most 150 characters, lifted from the entry)');
  else if (typeof alm !== 'string') add('almanac', 'FAIL', 'not a string');
  else {
    const probs = [];
    if (alm.length > 160) add('almanac', 'FAIL', `${alm.length} chars (schema ceiling 160)`);
    else if (/[^\x20-\x7e]/.test(alm)) add('almanac', 'FAIL', 'non-ASCII characters');
    else {
      const lead = (alm.match(/^["'(]*([A-Za-z']+)/) || [])[1] || '';
      if (ALM_PRONOUNS.has(lead.toLowerCase())) {
        add('almanac', 'FAIL', `opens with "${lead}", which points back at text the front page does not show; name the subject`);
      } else if (!almanacSource(alm, e.body, complete.map((f) => f.a))) {
        add('almanac', 'FAIL', 'not a deletions-only trim of one sentence of the entry (body, heading, list item, table cell, pull-quote or FAQ answer): a word or number was added or changed, or two sentences were merged');
      } else {
        if (isNew && alm.length > 150) probs.push(`${alm.length} chars (aim for 150 or fewer)`);
        if (/\*\*|\]\(|`|^\s*>/.test(alm)) probs.push('markdown characters render literally');
        if (/\s--\s|\w--\w/.test(alm)) probs.push('a double hyphen');
        const twin = others.find((x) => x.fm && x.fm.almanac === alm);
        if (twin) probs.push(`identical to ${twin.slug}`);
        if (probs.length) add('almanac', 'WARN', probs.join('; '));
        else add('almanac', 'PASS', `${alm.length} chars`);
      }
    }
  }

  /* Plain ASCII, no comments, no images. */
  const lines = e.raw.split('\n');
  const punct = lines.map((l, i) => ({ l, i: i + 1 })).filter((x) => BANNED.test(x.l));
  if (punct.length) add('punctuation', 'FAIL', `unicode dash, quote, arrow, bullet, ellipsis or check mark on line(s) ${punct.map((x) => x.i).join(', ')}`, punct.map((x) => x.l.trim().slice(0, 80)));
  else add('punctuation', 'PASS');
  const nonAscii = lines.map((l, i) => ({ l, i: i + 1 })).filter((x) => /[^\x00-\x7F]/.test(x.l) && !BANNED.test(x.l));
  if (nonAscii.length) add('ascii', 'FAIL', `non-ASCII character on line(s) ${nonAscii.map((x) => x.i).join(', ')} (write Reaumur, cafe, Perigord)`, nonAscii.map((x) => x.l.trim().slice(0, 80)));
  else add('ascii', 'PASS');
  if (/<!--/.test(e.raw)) add('html-comment', 'FAIL', 'remove <!-- -->: comments ship into production HTML');
  else add('html-comment', 'PASS');
  if (/!\[[^\]]*\]\(|<img\b/i.test(e.body)) add('images', 'FAIL', 'entries are typographic: no images');
  else add('images', 'PASS');

  /* Structure. */
  const bodyLines = e.body.split('\n');
  const h2 = bodyLines.filter((l) => /^##\s/.test(l));
  const headQ = h2.find((h) => /\?\s*$/.test(h));
  /* Advisory: a question H2 helps an answer box, but repeating the title's question
     word for word on every entry is a template tell. Where the opening already
     answers the question, a descriptive H2 is the better heading. */
  if (headQ) add('head-question-h2', 'PASS', headQ.replace(/^##\s+/, ''));
  else add('head-question-h2', 'WARN', 'no H2 phrased as a question: fine when the opening already gives the direct answer');
  if (bodyLines.some((l) => /^#\s/.test(l))) add('body-h1', 'FAIL', 'no H1 in the body; the layout renders the title');
  let quotes = 0;
  bodyLines.forEach((l, i) => { if (/^\s*>/.test(l) && !(i > 0 && /^\s*>/.test(bodyLines[i - 1]))) quotes++; });
  if (quotes === 1) add('blockquote', 'PASS', '1 pull-quote');
  else if (quotes === 0) add('blockquote', 'FAIL', 'need exactly one > pull-quote');
  else add('blockquote', 'WARN', `${quotes} blockquotes (house style is one pull-quote)`);
  if (/Strictly FYI\.\s*$/.test(e.body.trim())) add('sign-off', 'PASS', 'ends with "Strictly FYI."');
  else add('sign-off', 'FAIL', 'the last sentence must end with "Strictly FYI."');
  /* Length: the 700-1,200 band was set on the trope linter's prose count
     (paragraphs only), so it is measured there; the readers' count behind the
     displayed reading time also counts lists, tables, headings and the quote. */
  const t2 = opts.trope;
  const shown = `${wordCount(e.body)} words read, ${readingMinutes(e.body)} min read`;
  if (!t2) add('word-count', 'WARN', `not measured without the trope linter (${shown})`);
  else if (t2.words >= 700 && t2.words <= 1200) add('word-count', 'PASS', `${t2.words} prose words (${shown})`);
  else add('word-count', soft === 'FAIL' || t2.words < 700 ? 'FAIL' : 'WARN', `${t2.words} prose words (band 700-1,200; ${shown})`);

  /* Internal links: every /blog/ link resolves, in the house form, both ways. */
  const internal = e.links.filter((l) => l.kind === 'internal');
  const blogLinks = internal.filter((l) => l.slug);
  const broken = [...new Set(blogLinks.filter((l) => !corpus.bySlug.has(l.slug)).map((l) => l.href))];
  const badForm = [...new Set(internal.filter((l) => !l.slash || l.absolute).map((l) => l.href))];
  const self = blogLinks.filter((l) => l.slug === e.slug);
  /* A link to a scheduled entry would 404 on the live site until that entry's
     day, unless this entry itself goes live on or after that day. */
  const utcNow = today()[0];
  const liveFrom = validDate(fm.pubDate) && fm.pubDate > utcNow ? fm.pubDate : utcNow;
  const scheduled = [...new Set(blogLinks.filter((l) => {
    const t = corpus.bySlug.get(l.slug);
    return t && t.fm && validDate(t.fm.pubDate) && t.fm.pubDate > liveFrom;
  }).map((l) => `${l.slug} (${corpus.bySlug.get(l.slug).fm.pubDate})`))];
  if (broken.length) add('links-resolve', 'FAIL', `target(s) do not exist: ${broken.join(', ')}`, broken);
  else if (scheduled.length) add('links-resolve', 'FAIL', `target(s) not published yet: ${scheduled.join(', ')}; the link would 404 until then`, scheduled);
  else add('links-resolve', 'PASS', `${blogLinks.length} /blog/ link(s) resolve`);
  if (badForm.length) add('link-format', 'FAIL', `internal links are relative and end in "/": ${badForm.join(' ')}`, badForm);
  if (self.length) add('self-link', 'FAIL', 'the entry links to itself');
  const KNOWN = /^\/(?:blog\/|topics\/(?:[a-z]+\/)?|about\/|search\/|privacy\/|how-we-work\/|contact\/|terms\/|corrections\/|rss\.xml)?$/;
  const odd = [...new Set(internal.filter((l) => !l.slug && !KNOWN.test(l.path)).map((l) => l.href))];
  if (odd.length) add('link-targets', 'WARN', `internal link(s) to a path the site may not have: ${odd.join(' ')}`, odd);
  /* Links to other entries are optional and capped: a link earns its place only
     where the paragraph already discusses the linked subject. The See also
     block, the department pages and the archive link every entry anyway, so a
     low count is never a reason to add a sentence. */
  const outTargets = [...new Set(blogLinks.filter((l) => l.slug !== e.slug).map((l) => l.slug))];
  const outHi = isNew ? 4 : 6;
  if (outTargets.length > outHi) add('outbound-links', soft, `${plural(outTargets.length, 'entry', 'entries')} linked (at most ${outHi}): ${outTargets.join(', ')}`);
  else add('outbound-links', 'PASS', `${outTargets.length}${outTargets.length ? `: ${outTargets.join(', ')}` : ''}`);
  const inbound = [...(corpus.inbound.get(e.slug) || [])].filter((s) => s !== e.slug);
  if (inbound.length >= 2) add('inbound-links', 'PASS', `${inbound.length} entries link here`);
  else add('inbound-links', 'WARN', `${plural(inbound.length, 'entry', 'entries')} link here in body text: ${inbound.join(', ') || 'none'}. Never add a sentence to another entry just to carry a link; link only where a host paragraph already discusses this subject`);

  /* Sources: the brand is "actually true". */
  const extLinks = e.links.filter((l) => l.kind === 'external');
  const ext = [...new Set(extLinks.map((l) => l.href))];
  if (isNew && ext.length < 3) add('citations', 'FAIL', `${ext.length} external source link(s); cite at least 3 primary or authoritative sources inline`);
  else if (!ext.length) add('citations', 'WARN', 'no external citation at all (verification debt)');
  else add('citations', 'PASS', `${ext.length} distinct source URL(s)`);
  /* One page linked on clause after clause reads as a paraphrase of that page.
     Link a source at its first use, and again only on a sentence whose figure,
     date or quotation needs it (the claim gate checks those). */
  const perUrl = new Map();
  for (const l of extLinks) { const k = l.href.split('#')[0]; perUrl.set(k, (perUrl.get(k) || 0) + 1); }
  const heavy = [...perUrl].filter(([, n]) => n > 4).sort((a, b) => b[1] - a[1]);
  if (heavy.length) add('citation-repeats', isNew && heavy[0][1] > 8 ? 'FAIL' : 'WARN', `${heavy.map(([u, n]) => `${u} x${n}`).join(', ')} (more than 4 links to one page)`, heavy.map(([u]) => u));
  /* The standard is a source for each claim, linked in the sentence that makes
     it. The claim gate checks an unlinked sentence against the other links in
     its paragraph, but it skips a paragraph that links no outside page at all,
     so a year, a measured figure or a 20+ character quotation there is never
     checked. Headings, lists and the pull-quote are left out; a table counts as
     sourced when its cells, the paragraph that introduces it or the caption
     under it link a page. Spelled-out numbers and decades are not counted. */
  const factRe = /\b(?:1[0-9]{3}|20[0-9]{2})\b|\b\d[\d,.]*\s*(?:percent|%|miles?|km|kilomet(?:er|re)s?|met(?:er|re)s?|feet|foot|inch(?:es)?|years?|days?|hours?|minutes?|seconds?|million|billion|letters?|words?|degrees?|pounds?|kilograms?|kg|grams?|tons?|tonnes?)\b|"[^"]{20,}"/i;
  const unlinkedFacts = [];
  const linksOut = (q) => /\]\(https?:\/\//.test(q || '');
  const paras = e.body.split(/\n\s*\n/);
  // A summary table that only repeats figures given in sourced paragraphs is fine; one with a figure found nowhere else is not.
  const sourcedText = paras.filter(linksOut).join('\n');
  const tableFigures = (t) => [...new Set((t.replace(/^\|[-| :]+\|$/gm, '').match(/\b\d[\d,.]*\b/g) || []).map((x) => x.replace(/[.,]+$/, '')).filter((x) => x.length > 1))];
  paras.forEach((para, i) => {
    const p = para.trim();
    if (/^\|/.test(p)) {
      if (!linksOut(p) && !linksOut(paras[i - 1]) && !linksOut(paras[i + 1]) && factRe.test(p)) {
        const unsourced = tableFigures(p).filter((x) => !sourcedText.includes(x));
        if (unsourced.length) unlinkedFacts.push(`table: ${p.split('\n')[0]} (${unsourced.join(', ')})`);
      }
      return;
    }
    if (!p || /^(?:#|>|[-*+] |\d+\. )/.test(p) || linksOut(p)) return;
    for (const s of sentences(p)) if (factRe.test(s)) unlinkedFacts.push(s);
  });
  /* A closing paragraph that restates one figure is common and harmless; three or
     more in a new entry means a whole paragraph went out unsourced. */
  if (unlinkedFacts.length) add('unlinked-figures', isNew && unlinkedFacts.length >= 3 ? 'FAIL' : 'WARN', `${plural(unlinkedFacts.length, 'sentence', 'sentences')} with a year, figure or quotation in a paragraph that links no source, so the claim gate never checks them; link each to the page that supports it: ${unlinkedFacts.slice(0, 3).map((s) => `"${plainMd(s).slice(0, 80)}"`).join(' | ')}`);
  else add('unlinked-figures', 'PASS', 'no year, figure or quotation sits in a paragraph without a source link');

  /* Near-duplicates elsewhere in the corpus: cannibalisation early warning. */
  if (opts.dupes !== false) {
    const near = [];
    const tt = qTokens(t);
    const mine = complete.map((f) => [f.q, qTokens(f.q)]);
    for (const x of others) {
      if (!x.fm) continue;
      const tk = tokenCache(x);
      if (x.fm.title && jaccard(tt, tk.title) >= 0.6) near.push(`title ~ ${x.slug}`);
      for (const [q, qt] of mine) for (const [g, gt] of tk.faqs) if (jaccard(qt, gt) >= 0.6) near.push(`"${q}" ~ ${x.slug}: "${g}"`);
    }
    if (near.length) add('near-duplicate', 'WARN', near.slice(0, 4).join('; ') + (near.length > 4 ? ` (+${near.length - 4} more)` : ''), near);
  }

  /* Field lock for an optimize pass: identity never moves. */
  if (mode === 'existing' || isNew) {
    let head = null;
    try {
      const relPath = path.relative(ROOT, path.join(BLOG, `${e.slug}.md`)).split(path.sep).join('/');
      head = execFileSync('git', ['show', `HEAD:${relPath}`], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    } catch { head = null; }
    if (head !== null) {
      const h = parseFrontmatter(head).fm;
      if (isNew) add('field-lock', 'WARN', 'this entry is already committed; an edit to it is an optimize pass: use --mode=existing');
      else {
        /* The one allowed move: a backdated pubDate corrected to the day the
           file first entered git, which is a correction of fact. */
        /* Same window as the backdate check: the first-commit day, local or UTC. */
        const corrected = String(h.pubDate ?? '') !== String(fm.pubDate ?? '') && Boolean(added) &&
          String(fm.pubDate) <= added.local && String(fm.pubDate) >= added.utc && String(h.pubDate) < String(fm.pubDate);
        const moved = ['pubDate', 'filecode', 'category'].filter((k) => String(h[k] ?? '') !== String(fm[k] ?? '') && !(k === 'pubDate' && corrected));
        if (corrected) add('field-lock', 'WARN', `pubDate ${h.pubDate} -> ${fm.pubDate}: a backdated filing corrected to its first-publication date (log it on the corrections page)`);
        if (moved.length) add('field-lock', 'FAIL', `locked field(s) changed since HEAD: ${moved.map((k) => `${k} ${h[k]} -> ${fm[k]}`).join(', ')}`, moved);
        else add('field-lock', 'PASS', corrected ? 'slug, filecode and category match HEAD' : 'slug, pubDate, filecode and category match HEAD');
        if (String(h.featured ?? false) !== String(fm.featured ?? false)) add('field-lock', 'WARN', `featured changed (${h.featured} -> ${fm.featured}): the operator's call`);
        if (String(h.updatedDate ?? '') !== String(fm.updatedDate ?? '')) add('freshness', 'WARN', `updatedDate ${h.updatedDate || '(none)'} -> ${fm.updatedDate || '(none)'}: only when new sourced content ships, never for links, schema, title or de-slop edits`);
      }
    } else if (mode === 'existing') add('field-lock', 'WARN', 'not in git HEAD, so there is nothing to lock against');
  }
  return res;
}

/* ------------------------------------------------------------------------
 * The trope gate, run through the real linter so there is one rulebook.
 * ---------------------------------------------------------------------- */
function runTropes(files, baselineFile) {
  const linter = path.join(ROOT, 'scripts', 'lint-tropes.cjs');
  if (!fs.existsSync(linter)) return { error: `missing ${linter}` };
  const argv = [linter, '--json'];
  if (baselineFile) argv.push(`--baseline=${baselineFile}`);
  argv.push(...files);
  const r = spawnSync(process.execPath, argv, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.status === 2 || r.error) return { error: (r.stderr || String(r.error || '')).trim().split('\n')[0] || 'exit 2' };
  try {
    const j = JSON.parse(r.stdout);
    return { byBase: new Map((j.results || []).map((x) => [path.basename(x.file), x])), gate: j.gate };
  } catch (e) { return { error: `unreadable linter output: ${e.message}` }; }
}

/* ------------------------------------------------------------------------
 * CLI
 * ---------------------------------------------------------------------- */
function main() {
  const tooling = (msg) => {
    console.error(`gates: ${msg}`);
    console.log('TOOLING ERROR (exit 2) - this is never a pass');
    console.log('GATES: FAIL');
    process.exit(2);
  };
  const args = process.argv.slice(2);
  const flag = (n) => args.includes(n);
  const val = (n) => { const a = args.find((x) => x.startsWith(`${n}=`)); return a ? a.slice(n.length + 1) : null; };
  for (const a of args) if (a.startsWith('--') && !['--all', '--json', '--quiet', '--no-tropes', '--rank'].includes(a) && !/^--(mode|baseline)=/.test(a)) tooling(`unknown flag ${a}`);
  if (flag('--rank') && !flag('--all')) tooling('--rank works with --all');
  const all = flag('--all');
  const mode = val('--mode') || (all ? 'corpus' : 'new');
  if (!['new', 'existing', 'corpus'].includes(mode)) tooling(`--mode must be new, existing or corpus, not "${mode}"`);
  const targetsArg = args.filter((a) => !a.startsWith('--'));
  if (!all && targetsArg.length !== 1) tooling('usage: node scripts/gates.cjs <slug|entry.md> [--mode=new|existing|corpus] | --all');

  let corpus;
  try { corpus = loadCorpus(); } catch (e) { tooling(`cannot read the corpus at ${BLOG}: ${e.message}`); }
  let targets;
  if (all) targets = corpus.entries;
  else {
    const t = targetsArg[0];
    const candidates = [path.resolve(process.cwd(), t), path.join(BLOG, t.endsWith('.md') ? t : `${t}.md`), path.join(ROOT, t)];
    const file = candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
    if (!file) tooling(`no entry file for "${t}"`);
    const inCorpus = path.resolve(path.dirname(file)) === path.resolve(BLOG);
    targets = [inCorpus ? corpus.bySlug.get(path.basename(file).replace(/\.md$/i, '')) : readEntry(file)];
  }

  let baseline = null;
  let tropeBaseline = null;
  const baselineArg = val('--baseline');
  if (baselineArg) {
    try { baseline = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), baselineArg), 'utf8')); } catch (e) { tooling(`cannot read baseline ${baselineArg}: ${e.message}`); }
    const tropeResults = (baseline.results || []).map((r) => r.tropes).filter(Boolean);
    if (tropeResults.length) {
      tropeBaseline = path.join(os.tmpdir(), `gates-trope-baseline-${process.pid}.json`);
      fs.writeFileSync(tropeBaseline, JSON.stringify({ results: tropeResults }));
    }
  }

  let tropes = null;
  if (!flag('--no-tropes')) {
    tropes = runTropes(all ? ['--all'] : [targets[0].file], tropeBaseline);
    if (tropeBaseline) try { fs.unlinkSync(tropeBaseline); } catch { /* temp file */ }
  }

  const results = [];
  for (const e of targets) {
    const tropeResult = tropes && !tropes.error ? tropes.byBase.get(path.basename(e.file)) || null : null;
    const gates = gateEntry(e, corpus, mode, { dupes: true, trope: tropeResult });
    if (tropes) {
      if (tropes.error) gates.push({ id: 'trope-gate', status: 'FAIL', detail: `tooling error: ${tropes.error}` });
      else {
        if (!tropeResult) gates.push({ id: 'trope-gate', status: 'FAIL', detail: 'the linter returned no result for this file' });
        else {
          const nf = tropeResult.newFails !== undefined ? tropeResult.newFails : tropeResult.fails.length;
          const nw = tropeResult.newWarns !== undefined ? tropeResult.newWarns : tropeResult.warns.length;
          const ids = [...new Set(tropeResult.fails.filter((h) => !h.preexisting).map((h) => h.id))];
          if (nf) gates.push({ id: 'trope-gate', status: 'FAIL', detail: `${nf} FAIL (${ids.join(', ')}); run node scripts/lint-tropes.cjs ${path.relative(process.cwd(), e.file).split(path.sep).join('/')}`, items: tropeResult.fails.filter((h) => !h.preexisting).map((h) => `${h.id}|${h.snippet}`) });
          else gates.push({ id: 'trope-gate', status: 'PASS', detail: `0 FAIL${tropeResult.newFails !== undefined ? ' new' : ''}, ${tropeResult.words} prose words` });
          if (nw) gates.push({ id: 'trope-warns', status: 'WARN', detail: `${nw} WARN line(s): fix or defend each one in the report` });
        }
      }
    }
    /* Baseline: a FAIL already present before the edit does not block, unless it gained new items. */
    if (baseline) {
      const prev = (baseline.results || []).find((r) => r.slug === e.slug);
      for (const g of gates) {
        if (g.status !== 'FAIL' || g.id === 'trope-gate') continue;
        const was = prev && prev.gates.find((x) => x.id === g.id && x.status === 'FAIL');
        if (!was) continue;
        const fresh = (g.items || []).filter((it) => !(was.items || []).includes(it));
        if (!fresh.length) { g.status = 'FAIL-OLD'; g.detail += ' (pre-existing)'; }
      }
    }
    const fails = gates.filter((g) => g.status === 'FAIL');
    const warns = gates.filter((g) => g.status === 'WARN');
    results.push({ file: path.relative(ROOT, e.file).split(path.sep).join('/'), slug: e.slug, filecode: e.fm && e.fm.filecode, mode, gates, fails: fails.length, warns: warns.length, tropes: tropeResult });
  }

  const failing = results.filter((r) => r.fails);
  if (flag('--json')) {
    /* Pure JSON, so a saved run can be read back as a --baseline; the verdict is the gate field. */
    console.log(JSON.stringify({ mode, gate: failing.length ? 'FAIL' : 'PASS', results }, null, 2));
    process.exit(failing.length ? 1 : 0);
  } else if (!all) {
    const r = results[0];
    console.log(`gates: ${r.file} (mode ${mode}${baseline ? ', against a baseline' : ''})`);
    for (const g of r.gates) console.log(`${g.status.padEnd(8)} ${g.id}${g.detail ? `: ${g.detail}` : ''}`);
    console.log(`\n${r.fails} FAIL, ${r.warns} WARN`);
  } else if (flag('--rank')) {
    /* The optimize queue when there is no Search Console data: real debt first.
       3 per FAIL gate, 3 for no external citation, 1 for inbound links at the
       floor, 1 for any trope WARN; ties go to the oldest filing. */
    const score = (r) => {
      const g = (id) => r.gates.find((x) => x.id === id);
      return r.gates.filter((x) => x.status === 'FAIL').length * 3
        + (g('citations') && g('citations').status !== 'PASS' ? 3 : 0)
        + ((corpus.inbound.get(r.slug) || new Set()).size <= 2 ? 1 : 0)
        + (g('trope-warns') ? 1 : 0);
    };
    const pub = (r) => String((corpus.bySlug.get(r.slug) || { fm: {} }).fm.pubDate || '');
    const ranked = results.map((r) => ({ r, s: score(r) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s || pub(a.r).localeCompare(pub(b.r)));
    console.log('Optimize queue by debt (score: 3 per FAIL gate, 3 no citation, 1 inbound at the floor, 1 trope WARNs):');
    for (const { r, s } of ranked.slice(0, 20)) {
      const why = r.gates.filter((g) => g.status === 'FAIL' || (g.id === 'citations' && g.status !== 'PASS')).map((g) => g.id).join(', ');
      console.log(`  ${String(s).padStart(2)}  ${String(r.filecode || '-').padEnd(8)} ${r.slug.padEnd(44)} ${pub(r)}  ${why}`);
    }
    console.log(`\n${ranked.length} of ${results.length} entries carry debt.`);
  } else {
    if (!flag('--quiet')) {
      for (const r of results.slice().sort((a, b) => b.fails - a.fails || fileNo(b.filecode) - fileNo(a.filecode))) {
        const failIds = r.gates.filter((g) => g.status === 'FAIL').map((g) => g.id);
        const label = `${String(r.filecode || '-').padEnd(8)} ${r.slug}`;
        console.log(`${label.padEnd(56)} ${r.fails ? 'FAIL' : 'PASS'}${r.fails ? `  ${failIds.join(', ')}` : ''}${r.warns ? `  (${plural(r.warns, 'WARN')})` : ''}`);
      }
      console.log('');
    }
    const tally = (status) => {
      const t = {};
      for (const r of results) for (const g of r.gates) if (g.status === status) t[g.id] = (t[g.id] || 0) + 1;
      return Object.entries(t).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', ') || 'none';
    };
    console.log(`${results.length} entries (mode ${mode}): ${results.length - failing.length} PASS, ${failing.length} FAIL`);
    console.log(`FAIL by gate: ${tally('FAIL')}`);
    console.log(`WARN by gate: ${tally('WARN')}`);
  }
  console.log(`GATES: ${failing.length ? 'FAIL' : 'PASS'}`);
  process.exit(failing.length ? 1 : 0);
}

module.exports = { ROOT, BLOG, DEPTS, OWN, parseFrontmatter, readEntry, loadCorpus, bodyLinks, wordCount, readingMinutes, sentences, sentenceSpans, tokens, fileNo };
if (require.main === module) main();
