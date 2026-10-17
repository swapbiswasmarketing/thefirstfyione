#!/usr/bin/env node
/*
 * link-audit.mjs - the corpus-wide internal-link audit for strictly.fyi.
 *
 * Body links are the only topical links between entries (template lists are
 * filed order or computed), and reciprocal linking keeps adding links into old
 * hosts, so nobody sees the whole graph without this. It prints per-entry
 * inbound and outbound counts, orphans, entries below the inbound floor, the
 * reciprocity rate, anchor reuse, and the verification-debt list: entries with
 * no external citation at all, which no claim gate can check.
 *
 * Usage:
 *   node scripts/link-audit.mjs                      the table plus totals
 *   node scripts/link-audit.mjs --target=<slug>      one entry in detail, with ranked host suggestions
 *   flags: --floor=N (inbound floor, default 2)  --suggest (host suggestions for every entry at the floor)
 *          --quiet (totals only)  --json
 *
 * Exit codes: 0 = no orphan, broken link or self-link | 1 = at least one | 2 = tooling error.
 * Last line: "LINK AUDIT: PASS" or "LINK AUDIT: FAIL" (also FAIL on exit 2).
 * With --json the output is one JSON document whose result field is the verdict.
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function tooling(msg) {
  console.error(`link-audit: ${msg}`);
  console.log('TOOLING ERROR (exit 2) - this is never a pass');
  console.log('LINK AUDIT: FAIL');
  process.exit(2);
}

let lib;
try { lib = require('./gates.cjs'); } catch (e) { tooling(`cannot load scripts/gates.cjs: ${e.message}`); }
const { loadCorpus, tokens, fileNo } = lib;

const args = process.argv.slice(2);
const val = (n) => { const a = args.find((x) => x.startsWith(`${n}=`)); return a ? a.slice(n.length + 1) : null; };
for (const a of args) if (!['--all', '--json', '--quiet', '--suggest'].includes(a) && !/^--(target|floor)=/.test(a)) tooling(`unknown argument ${a}`);
const FLOOR = Number(val('--floor') ?? 2);
if (!Number.isInteger(FLOOR) || FLOOR < 0) tooling('--floor must be a whole number');
const TARGET = val('--target');
const JSON_OUT = args.includes('--json');
const QUIET = args.includes('--quiet');
const OUT_MAX = 6;

let corpus;
try { corpus = loadCorpus(); } catch (e) { tooling(`cannot read the corpus: ${e.message}`); }
const { entries, bySlug } = corpus;
if (TARGET && !bySlug.has(TARGET.replace(/\.md$/, ''))) tooling(`no entry "${TARGET}"`);

/* ---------------------------------------------------------------- graph */
const info = new Map();
for (const e of entries) {
  const internal = e.links.filter((l) => l.kind === 'internal' && l.slug);
  const counts = new Map();
  for (const l of internal) counts.set(l.slug, (counts.get(l.slug) || 0) + 1);
  info.set(e.slug, {
    e,
    slug: e.slug,
    filecode: (e.fm && e.fm.filecode) || '',
    dept: (e.fm && e.fm.category) || '?',
    pubDate: (e.fm && e.fm.pubDate) || '',
    out: new Set(internal.filter((l) => l.slug !== e.slug && bySlug.has(l.slug)).map((l) => l.slug)),
    in: new Set(),
    broken: [...new Set(internal.filter((l) => !bySlug.has(l.slug)).map((l) => l.href))],
    self: internal.some((l) => l.slug === e.slug),
    dupHref: [...counts].filter(([, n]) => n > 1).map(([s]) => s),
    noSlash: [...new Set(e.links.filter((l) => l.kind === 'internal' && !l.slash).map((l) => l.href))],
    absolute: [...new Set(e.links.filter((l) => l.kind === 'internal' && l.absolute).map((l) => l.href))],
    ext: new Set(e.links.filter((l) => l.kind === 'external').map((l) => l.href)).size,
    anchors: internal.filter((l) => l.slug !== e.slug).map((l) => ({ target: l.slug, text: l.anchor.replace(/[*_`]/g, '').trim() })),
  });
}
for (const x of info.values()) for (const t of x.out) info.get(t).in.add(x.slug);
let edges = 0;
let recipEdges = 0;
let sameDept = 0;
for (const x of info.values()) {
  x.recip = [...x.out].filter((t) => info.get(t).out.has(x.slug)).length;
  for (const t of x.out) {
    edges++;
    if (info.get(t).out.has(x.slug)) recipEdges++;
    if (info.get(t).dept === x.dept) sameDept++;
  }
}
const rows = [...info.values()];
const orphans = rows.filter((x) => x.in.size === 0);
const below = rows.filter((x) => x.in.size < FLOOR);
const atFloor = rows.filter((x) => x.in.size === FLOOR);
const heavy = rows.filter((x) => x.out.size > OUT_MAX);
const broken = rows.filter((x) => x.broken.length);
const selfs = rows.filter((x) => x.self);
const debt = rows.filter((x) => x.ext === 0).sort((a, b) => fileNo(a.filecode) - fileNo(b.filecode));
const hist = {};
for (const x of rows) hist[x.in.size] = (hist[x.in.size] || 0) + 1;

/* The same anchor text sent to one target from two or more hosts reads as a
   template, not a citation; and a target no anchor names by its own words
   never gets the exact-match signal for its question. */
const anchorUse = new Map();
for (const x of rows) for (const a of x.anchors) {
  const key = `${a.target}|${a.text.toLowerCase()}`;
  if (!anchorUse.has(key)) anchorUse.set(key, { target: a.target, text: a.text, hosts: new Set() });
  anchorUse.get(key).hosts.add(x.slug);
}
const reused = [...anchorUse.values()].filter((a) => a.hosts.size > 1).sort((a, b) => b.hosts.size - a.hosts.size);
const unnamed = rows.filter((x) => {
  if (!x.in.size) return false;
  const words = tokens(x.slug.replace(/-/g, ' '));
  const inAnchors = rows.flatMap((h) => h.anchors.filter((a) => a.target === x.slug).map((a) => a.text.toLowerCase()));
  return !inAnchors.some((t) => words.some((w) => t.includes(w)));
});

/* ---------------------------------------------------------------- host suggestions */
/* TF-IDF over body words, so the linker gets ranked candidates instead of
   guesses. Topical similarity is a hint, never a licence to force a link. */
const docTokens = new Map(entries.map((e) => [e.slug, tokens(e.body.replace(/\]\([^)]*\)/g, ']'))]));
const df = new Map();
for (const toks of docTokens.values()) for (const t of new Set(toks)) df.set(t, (df.get(t) || 0) + 1);
const N = entries.length;
const vec = new Map();
for (const [slug, toks] of docTokens) {
  const tf = new Map();
  for (const t of toks) tf.set(t, (tf.get(t) || 0) + 1);
  const v = new Map();
  let norm = 0;
  for (const [t, n] of tf) {
    const w = (n / toks.length) * Math.log(N / (df.get(t) || 1));
    v.set(t, w);
    norm += w * w;
  }
  vec.set(slug, { v, norm: Math.sqrt(norm) || 1 });
}
const cosine = (a, b) => {
  const A = vec.get(a);
  const B = vec.get(b);
  let dot = 0;
  for (const [t, w] of A.v) { const u = B.v.get(t); if (u) dot += w * u; }
  return dot / (A.norm * B.norm);
};
function suggest(slug, n = 5) {
  const target = info.get(slug);
  const words = tokens(slug.replace(/-/g, ' '));
  return rows
    .filter((h) => h.slug !== slug && !h.out.has(slug) && h.out.size < OUT_MAX)
    .map((h) => ({ host: h.slug, dept: h.dept, score: cosine(slug, h.slug), out: h.out.size }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((s) => {
      const paras = info.get(s.host).e.body.split(/\n\s*\n/).filter((p) => p.trim() && !/^\s*(#|>|\||-)/.test(p));
      let best = null;
      let bestHits = 0;
      for (const p of paras) {
        const hits = words.filter((w) => p.toLowerCase().includes(w)).length;
        if (hits > bestHits) { best = p; bestHits = hits; }
      }
      return { ...s, sameDept: s.dept === target.dept, paragraph: best ? best.replace(/\s+/g, ' ').slice(0, 110) : null };
    });
}

/* ---------------------------------------------------------------- output */
const fail = orphans.length || broken.length || selfs.length;
const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(1)}%` : '0%');
const flagsOf = (x) => [
  x.in.size === 0 ? 'ORPHAN' : x.in.size < FLOOR ? 'BELOW-FLOOR' : '',
  x.broken.length ? `BROKEN(${x.broken.length})` : '',
  x.self ? 'SELF' : '',
  x.out.size > OUT_MAX ? `OUT>${OUT_MAX}` : '',
  x.dupHref.length ? `DUP-HREF(${x.dupHref.length})` : '',
  x.noSlash.length ? 'NO-SLASH' : '',
  x.absolute.length ? 'ABSOLUTE' : '',
  x.ext === 0 ? 'NO-CITATION' : '',
].filter(Boolean).join(' ');

if (JSON_OUT) {
  const pick = TARGET ? [info.get(TARGET.replace(/\.md$/, ''))] : rows;
  console.log(JSON.stringify({
    floor: FLOOR,
    totals: { entries: rows.length, edges, reciprocalEdges: recipEdges, sameDeptEdges: sameDept, orphans: orphans.length, belowFloor: below.length, atFloor: atFloor.length, broken: broken.length, selfLinks: selfs.length, noCitation: debt.length, histogram: hist },
    entries: pick.map((x) => ({ slug: x.slug, filecode: x.filecode, dept: x.dept, inbound: [...x.in], outbound: [...x.out], reciprocal: x.recip, externalCitations: x.ext, broken: x.broken, selfLink: x.self, duplicateHrefs: x.dupHref, missingSlash: x.noSlash, absolute: x.absolute, suggestions: TARGET || (args.includes('--suggest') && x.in.size <= FLOOR) ? suggest(x.slug) : undefined })),
    anchorReuse: reused.map((a) => ({ target: a.target, text: a.text, hosts: [...a.hosts] })),
    noNamingAnchor: unnamed.map((x) => x.slug),
    verificationDebt: debt.map((x) => ({ slug: x.slug, filecode: x.filecode, pubDate: x.pubDate })),
    result: fail ? 'FAIL' : 'PASS',
  }, null, 2));
  process.exit(fail ? 1 : 0);
}

if (TARGET) {
  const x = info.get(TARGET.replace(/\.md$/, ''));
  console.log(`${x.filecode} ${x.slug} (${x.dept})`);
  console.log(`  inbound ${x.in.size} (floor ${FLOOR}): ${[...x.in].join(', ') || 'none'}`);
  console.log(`  outbound ${x.out.size}: ${[...x.out].join(', ') || 'none'}`);
  console.log(`  reciprocal ${x.recip} of ${x.out.size}; external citations ${x.ext}`);
  const anchorsIn = rows.flatMap((h) => h.anchors.filter((a) => a.target === x.slug).map((a) => `${h.slug}: "${a.text}"`));
  if (anchorsIn.length) console.log(`  anchors pointing here:\n    ${anchorsIn.join('\n    ')}`);
  const f = flagsOf(x);
  if (f) console.log(`  flags: ${f}`);
  for (const k of ['broken', 'noSlash', 'absolute', 'dupHref']) if (x[k].length) console.log(`  ${k}: ${x[k].join(' ')}`);
  console.log('  host suggestions (TF-IDF over body words; hosts that do not link here yet and send under 6 links):');
  for (const s of suggest(x.slug)) console.log(`    ${s.score.toFixed(3)}  ${s.host}${s.sameDept ? '' : ` [${s.dept}]`}  out ${s.out}${s.paragraph ? `\n           "${s.paragraph}..."` : ''}`);
} else {
  if (!QUIET) {
    console.log(`${'FILE'.padEnd(8)} ${'SLUG'.padEnd(44)} ${'DEPT'.padEnd(9)} ${'IN'.padStart(3)} ${'OUT'.padStart(3)} ${'RECIP'.padStart(5)} ${'EXT'.padStart(4)}  FLAGS`);
    const sorted = rows.slice().sort((a, b) => a.in.size - b.in.size || fileNo(b.filecode) - fileNo(a.filecode));
    for (const x of sorted) {
      console.log(`${x.filecode.padEnd(8)} ${x.slug.slice(0, 44).padEnd(44)} ${x.dept.padEnd(9)} ${String(x.in.size).padStart(3)} ${String(x.out.size).padStart(3)} ${`${x.recip}/${x.out.size}`.padStart(5)} ${String(x.ext).padStart(4)}  ${flagsOf(x)}`);
    }
    console.log('');
  }
  console.log(`${rows.length} entries, ${edges} entry-to-entry links: ${recipEdges} reciprocal (${pct(recipEdges, edges)}), ${sameDept} within one department (${pct(sameDept, edges)})`);
  console.log(`inbound histogram: ${Object.keys(hist).map(Number).sort((a, b) => a - b).map((k) => `${k}:${hist[k]}`).join(' ')}`);
  console.log(`orphans: ${orphans.length}${orphans.length ? ` (${orphans.map((x) => x.slug).join(', ')})` : ''} | below floor ${FLOOR}: ${below.length}${below.length ? ` (${below.map((x) => x.slug).join(', ')})` : ''} | at the floor: ${atFloor.length}`);
  console.log(`broken links: ${broken.reduce((n, x) => n + x.broken.length, 0)} | self-links: ${selfs.length} | missing trailing slash: ${rows.filter((x) => x.noSlash.length).length} | absolute own-site links: ${rows.filter((x) => x.absolute.length).length} | entries linking one target twice: ${rows.filter((x) => x.dupHref.length).length}`);
  console.log(`outbound over ${OUT_MAX}: ${heavy.length}${heavy.length ? ` (${heavy.map((x) => `${x.slug} ${x.out.size}`).join(', ')})` : ''}`);
  console.log(`anchor text reused for one target by 2+ hosts: ${reused.length}${reused.length ? ` (${reused.slice(0, 5).map((a) => `"${a.text}" -> ${a.target} x${a.hosts.size}`).join('; ')}${reused.length > 5 ? '; ...' : ''})` : ''}`);
  console.log(`targets no inbound anchor names by a slug word: ${unnamed.length}${unnamed.length ? ` (${unnamed.slice(0, 6).map((x) => x.slug).join(', ')}${unnamed.length > 6 ? ', ...' : ''})` : ''}`);
  console.log(`verification debt, no external citation at all: ${debt.length}${debt.length ? `\n  ${debt.map((x) => `${x.filecode} ${x.slug} (${x.pubDate})`).join('\n  ')}` : ''}`);
  if (args.includes('--suggest')) {
    for (const x of atFloor.concat(below)) {
      console.log(`\nsuggested hosts for ${x.slug} (inbound ${x.in.size}):`);
      for (const s of suggest(x.slug, 3)) console.log(`  ${s.score.toFixed(3)}  ${s.host}${s.sameDept ? '' : ` [${s.dept}]`}`);
    }
  }
}
console.log(`LINK AUDIT: ${fail ? 'FAIL' : 'PASS'}`);
process.exit(fail ? 1 : 0);
