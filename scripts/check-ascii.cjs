#!/usr/bin/env node
/*
 * check-ascii.cjs - the plain-ASCII house rule, enforced on the source.
 *
 * The trope linter guards entry markdown, but agents copy patterns from the
 * templates, so the rule has to hold there too. Scans src/**\/*.{astro,ts,js,mjs,cjs,css}
 * and src/content/**\/*.md for the banned class: dashes U+2012-2015, curly quotes
 * U+2018/2019/201C/201D, arrows U+2190-21FF, the bullet U+2022, the ellipsis
 * U+2026 and check marks U+2713/2714 - as literal characters or as the named or
 * numeric HTML entities that render them. The house ornaments (middot, sect,
 * numero, copy) are fine as entities.
 *
 * Usage:
 *   node scripts/check-ascii.cjs                 the default source set
 *   node scripts/check-ascii.cjs <file|dir ...>  just these (dirs use the same extensions plus .md)
 *   flags: --strict (any other non-ASCII character fails too)  --json
 *
 * Exit codes: 0 = clean | 1 = banned characters found | 2 = tooling error.
 * Last line: "ASCII CHECK: PASS" or "ASCII CHECK: FAIL" (also FAIL on exit 2); with
 * --json the output is one JSON document whose result field is the verdict.
 * WARN lines (JS/CSS escapes of banned characters, other non-ASCII) do not fail
 * the check unless --strict; the post-build check-dist.mjs sees what renders.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const EXT = new Set(['.astro', '.ts', '.js', '.mjs', '.cjs', '.css']);

function tooling(msg) {
  console.error(`check-ascii: ${msg}`);
  console.log('TOOLING ERROR (exit 2) - this is never a pass');
  console.log('ASCII CHECK: FAIL');
  process.exit(2);
}

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
for (const f of flags) if (!['--strict', '--json'].includes(f)) tooling(`unknown flag ${f}`);
const targets = args.filter((a) => !a.startsWith('--'));

const NAMES = {
  0x2012: 'FIGURE DASH', 0x2013: 'EN DASH', 0x2014: 'EM DASH', 0x2015: 'HORIZONTAL BAR',
  0x2018: 'LEFT SINGLE QUOTE', 0x2019: 'RIGHT SINGLE QUOTE', 0x201c: 'LEFT DOUBLE QUOTE', 0x201d: 'RIGHT DOUBLE QUOTE',
  0x2022: 'BULLET', 0x2026: 'ELLIPSIS', 0x2713: 'CHECK MARK', 0x2714: 'HEAVY CHECK MARK',
};
const isBanned = (cp) => (cp >= 0x2012 && cp <= 0x2015) || cp === 0x2018 || cp === 0x2019 || cp === 0x201c || cp === 0x201d ||
  (cp >= 0x2190 && cp <= 0x21ff) || cp === 0x2022 || cp === 0x2026 || cp === 0x2713 || cp === 0x2714;
const nameOf = (cp) => `U+${cp.toString(16).toUpperCase().padStart(4, '0')} ${NAMES[cp] || (cp >= 0x2190 && cp <= 0x21ff ? 'ARROW' : '')}`.trim();
const HINT = { 0x2013: 'use " - "', 0x2014: 'use " - "', 0x2026: 'use "..."', 0x2022: 'use "-" or a real list', 0x2713: 'use a word ("Copied")' };
const hintOf = (cp) => HINT[cp] || ((cp >= 0x2018 && cp <= 0x201d) ? 'use straight quotes' : (cp >= 0x2190 && cp <= 0x21ff) ? 'drop the arrow or spell it out' : 'use the ASCII form');

/* Named entities that render as a banned character. */
const ENT = {
  ndash: 0x2013, mdash: 0x2014, horbar: 0x2015, lsquo: 0x2018, rsquo: 0x2019, ldquo: 0x201c, rdquo: 0x201d,
  bull: 0x2022, bullet: 0x2022, hellip: 0x2026, mldr: 0x2026, check: 0x2713, checkmark: 0x2713,
  larr: 0x2190, uarr: 0x2191, rarr: 0x2192, darr: 0x2193, harr: 0x2194, varr: 0x2195, crarr: 0x21b5,
  lArr: 0x21d0, uArr: 0x21d1, rArr: 0x21d2, dArr: 0x21d3, hArr: 0x21d4, rightarrow: 0x2192, leftarrow: 0x2190,
  RightArrow: 0x2192, LeftArrow: 0x2190, srarr: 0x2192, slarr: 0x2190,
};
/* Ornaments the house allows, as entities only. */
const ORNAMENTS = new Set([0x00b7, 0x00a7, 0x2116, 0x00a9]);

/* ---------------------------------------------------------------- file set */
const files = [];
function walk(dir, exts) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { tooling(`cannot read ${dir}: ${e.message}`); }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, exts);
    else if (exts.has(path.extname(e.name).toLowerCase())) files.push(p);
  }
}
if (targets.length) {
  const withMd = new Set([...EXT, '.md']);
  for (const t of targets) {
    const p = path.resolve(process.cwd(), t);
    if (!fs.existsSync(p)) tooling(`no such file or directory: ${t}`);
    if (fs.statSync(p).isDirectory()) walk(p, withMd);
    else files.push(p);
  }
} else {
  const src = path.join(ROOT, 'src');
  if (!fs.existsSync(src)) tooling(`no src directory at ${src}`);
  walk(src, EXT);
  const content = path.join(src, 'content');
  if (fs.existsSync(content)) walk(content, new Set(['.md']));
}
if (!files.length) tooling('no files to scan');

/* ---------------------------------------------------------------- scan */
const fails = [];
const warns = [];
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const snippet = (line, col) => {
  const s = line.slice(Math.max(0, col - 30), col + 30).replace(/\t/g, ' ').trim();
  return (col > 30 ? '...' : '') + s + (col + 30 < line.length ? '...' : '');
};
const ESC = /\\u\{([0-9a-fA-F]{1,6})\}|\\u([0-9a-fA-F]{4})|\\([0-9a-fA-F]{4,6})(?![0-9a-fA-F])/g;
const ENTITY = /&(#x[0-9a-fA-F]+|#[0-9]+|[A-Za-z][A-Za-z0-9]*);/g;

for (const file of [...new Set(files)].sort()) {
  let text;
  try { text = fs.readFileSync(file, 'utf8'); } catch (e) { tooling(`cannot read ${file}: ${e.message}`); }
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const isCss = /\.(css|astro)$/i.test(file);
  lines.forEach((line, i) => {
    const at = `${rel(file)}:${i + 1}`;
    let col = 0;
    for (const ch of line) {
      const cp = ch.codePointAt(0);
      if (cp > 0x7f && cp !== 0xfeff) {
        if (isBanned(cp)) fails.push({ at: `${at}:${col + 1}`, what: nameOf(cp), hint: hintOf(cp), text: snippet(line, col) });
        else warns.push({ at: `${at}:${col + 1}`, what: `U+${cp.toString(16).toUpperCase().padStart(4, '0')} non-ASCII`, hint: ORNAMENTS.has(cp) ? 'write the ornament as an entity (&middot; &sect; &#8470; &copy;)' : 'plain ASCII only', text: snippet(line, col) });
      }
      col += ch.length;
    }
    let m;
    ENTITY.lastIndex = 0;
    while ((m = ENTITY.exec(line))) {
      const b = m[1];
      const cp = b[0] === '#' ? (b[1] === 'x' || b[1] === 'X' ? parseInt(b.slice(2), 16) : parseInt(b.slice(1), 10)) : ENT[b];
      if (cp && isBanned(cp)) fails.push({ at: `${at}:${m.index + 1}`, what: `${nameOf(cp)} as ${m[0]}`, hint: hintOf(cp), text: snippet(line, m.index) });
    }
    ESC.lastIndex = 0;
    while ((m = ESC.exec(line))) {
      const isCssEscape = m[3] !== undefined;
      if (isCssEscape && !isCss) continue;
      const cp = parseInt(m[1] || m[2] || m[3], 16);
      if (isBanned(cp)) warns.push({ at: `${at}:${m.index + 1}`, what: `${nameOf(cp)} as escape ${m[0]}`, hint: `renders as the character if it reaches the page; ${hintOf(cp)}`, text: snippet(line, m.index) });
    }
  });
}

const strict = flags.has('--strict');
const failing = strict ? [...fails, ...warns] : fails;
if (flags.has('--json')) {
  /* Pure JSON for machines; the verdict is the result field. */
  console.log(JSON.stringify({ files: files.length, fails, warns, result: failing.length ? 'FAIL' : 'PASS' }, null, 2));
  process.exit(failing.length ? 1 : 0);
} else {
  for (const f of fails) console.log(`FAIL ${f.at}  ${f.what}  "${f.text}"  -> ${f.hint}`);
  for (const w of warns) console.log(`${strict ? 'FAIL' : 'WARN'} ${w.at}  ${w.what}  "${w.text}"  -> ${w.hint}`);
  const nf = new Set(fails.map((f) => f.at.replace(/:\d+:\d+$/, ''))).size;
  console.log(`\n${files.length} files scanned: ${fails.length} banned character(s) in ${nf} file(s), ${warns.length} warning(s)`);
}
console.log(`ASCII CHECK: ${failing.length ? 'FAIL' : 'PASS'}`);
process.exit(failing.length ? 1 : 0);
