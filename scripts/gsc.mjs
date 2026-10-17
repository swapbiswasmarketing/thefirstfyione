#!/usr/bin/env node
/*
 * gsc.mjs - Google Search Console CLI for strictly.fyi (property sc-domain:strictly.fyi).
 *
 * First-party search data is the only reliable read on whether entries rank:
 * a sibling site's strategy rested on third-party estimates that turned out
 * to be wrong until its own Search Console export corrected them. Zero
 * dependencies: OAuth for a desktop app (loopback on 127.0.0.1 with PKCE), or
 * a service-account key signed with node:crypto, then plain REST calls.
 *
 * Usage:
 *   node scripts/gsc.mjs auth                     OAuth consent in the browser, caches a refresh token
 *   node scripts/gsc.mjs sites                    properties this account can read
 *   node scripts/gsc.mjs perf      [window]       totals, devices, countries, position bands, monthly trend, daily CSV
 *   node scripts/gsc.mjs queries   [window]       top queries -> CSV
 *   node scripts/gsc.mjs pages     [window]       top pages -> CSV
 *   node scripts/gsc.mjs striking  [window]       query x page rows at positions 5-25 (--min-pos, --max-pos, --min-impr)
 *   node scripts/gsc.mjs entries   [window]       page data joined to filecodes, titles and departments -> CSV
 *   node scripts/gsc.mjs cannibal  [window]       queries where two or more entries each earn impressions -> CSV
 *   node scripts/gsc.mjs coverage  [--limit 250]  URL Inspection over the live sitemap (2,000 calls a day)
 *   window: --days N (default 90; 486 is everything GSC keeps) or --start YYYY-MM-DD --end YYYY-MM-DD.
 *   Windows end 3 days back, because the newest days are still filling in.
 *   --page <slug|path|URL> narrows perf, queries, striking and cannibal to one page
 *   (an optimize pass reads the queries its own entry earns this way).
 *   other flags: --site <property>  --limit N  --out <file.csv>  --type web|image|video|news
 *
 * Credentials live in .gsc/ at the repo root (gitignored; the repo is public),
 * or in the folder named by GSC_DIR. Exports land in <GSC_DIR>/exports/.
 * Exit codes: 0 = done | 1 = Google refused the request | 2 = setup or usage error.
 * Last line: "GSC: OK" or "GSC: ERROR".
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GSC_DIR = process.env.GSC_DIR ? path.resolve(process.env.GSC_DIR) : path.join(ROOT, '.gsc');
const SECRET = path.join(GSC_DIR, 'client_secret.json');
const TOKEN = path.join(GSC_DIR, 'token.json');
const SA = path.join(GSC_DIR, 'service_account.json');
const EXPORTS = path.join(GSC_DIR, 'exports');
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const DEFAULT_SITE = 'sc-domain:strictly.fyi';
const ORIGIN = 'https://www.strictly.fyi';
const API = 'https://searchconsole.googleapis.com';

/* ---------------------------------------------------------------- CLI */
const argv = process.argv.slice(2);
const cmd = argv[0] && !argv[0].startsWith('--') ? argv[0] : 'help';
const flags = {};
for (let i = 1; i < argv.length; i++) {
  if (!argv[i].startsWith('--')) continue;
  const [k, inline] = argv[i].slice(2).split('=');
  if (inline !== undefined) flags[k] = inline;
  else if (argv[i + 1] && !argv[i + 1].startsWith('--')) flags[k] = argv[++i];
  else flags[k] = true;
}
const num = (k, d) => (flags[k] === undefined ? d : Number(flags[k]));

/* Never process.exit() once fetch has run: on Windows that can trip a libuv
   assertion and turn the exit code into 127. Unwind to main() and set
   process.exitCode instead. */
class Exit extends Error {
  constructor(code) { super(`exit ${code}`); this.code = code; }
}
const done = () => { console.log('GSC: OK'); throw new Exit(0); };
function setupError(msg) {
  console.error(`\n  ${msg}\n`);
  console.log('GSC: ERROR');
  throw new Exit(2);
}
function apiError(msg) {
  console.error(`\n  ${msg}\n`);
  console.log('GSC: ERROR');
  throw new Exit(1);
}

const SETUP = `No Search Console credentials in ${GSC_DIR}

  Route A, a service account (no consent screen, no expiring tokens):
    1. Signed in to a personal Google account (an organisation-owned project can
       forbid key creation), open https://console.cloud.google.com/ and create a
       project with Organization = "No organization".
    2. APIs & Services > Library > enable "Google Search Console API".
    3. IAM & Admin > Service accounts > Create, then Keys > Add key > JSON.
       Save the file as ${SA}
    4. Search Console > sc-domain:strictly.fyi > Settings > Users and permissions >
       Add user: the key's client_email, permission Full.

  Route B, OAuth for a desktop app:
    1. Same kind of project. Google Auth Platform > Audience: add the Google
       account that owns the property as a Test user (check the project selector;
       a test user saved in another project gives 403 access_denied).
    2. Clients > Create client > Desktop app. Download the JSON to
       ${SECRET}
    3. node scripts/gsc.mjs auth
       While the consent screen is in Testing, refresh tokens expire after 7 days:
       re-run auth weekly, or publish the app and accept the unverified-app warning.

  Then run  node scripts/gsc.mjs sites  - it must list sc-domain:strictly.fyi.
  If it does not, the signed-in account is not an owner or user of the property:
  try the other Google accounts, or add a user in Search Console.
  .gsc/ is gitignored. To keep keys out of the working tree entirely, set GSC_DIR.`;

/* ---------------------------------------------------------------- utils */
const b64url = (buf) => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const iso = (d) => d.toISOString().slice(0, 10);
const pct = (n) => `${(n * 100).toFixed(2)}%`;
const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
function windowRange() {
  if (flags.start || flags.end) {
    const ok = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s));
    if (!ok(flags.start) || !ok(flags.end)) setupError('--start and --end both take YYYY-MM-DD');
    return { startDate: flags.start, endDate: flags.end, label: `${flags.start} to ${flags.end}` };
  }
  const days = num('days', 90);
  if (!Number.isInteger(days) || days < 1 || days > 500) setupError('--days takes a whole number from 1 to 500');
  const end = new Date(Date.now() - 3 * 86400000);
  const start = new Date(end.getTime() - (days - 1) * 86400000);
  return { startDate: iso(start), endDate: iso(end), label: `${iso(start)} to ${iso(end)} (${days} days)` };
}
const csvCell = (v) => { const s = v === null || v === undefined ? '' : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
function writeCsv(name, header, rows) {
  fs.mkdirSync(EXPORTS, { recursive: true });
  const out = flags.out ? path.resolve(process.cwd(), String(flags.out)) : path.join(EXPORTS, name);
  fs.writeFileSync(out, [header.join(','), ...rows.map((r) => r.map(csvCell).join(','))].join('\n') + '\n', 'utf8');
  return path.relative(process.cwd(), out) || out;
}
function openBrowser(url) {
  const c = process.platform === 'win32' ? `start "" "${url}"` : process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
  exec(c, () => {});
}
/* Search Console keys rows by the exact URL it saw; the canonical moved from the
   apex to www on 2026-07-06, so early rows can carry the apex host. */
const normPage = (u) => {
  try {
    const x = new URL(u);
    let p = x.pathname;
    if (!p.endsWith('/') && !/\.[a-z0-9]+$/i.test(p)) p += '/';
    return p;
  } catch { return u; }
};

/* ---------------------------------------------------------------- auth */
async function tokenRequest(params) {
  const res = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(params) });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = new Error(`${j.error || res.status}${j.error_description ? `: ${j.error_description}` : ''}`);
    e.oauth = j.error;
    throw e;
  }
  return j;
}
function clientSecret() {
  if (!fs.existsSync(SECRET)) return null;
  let raw;
  try { raw = readJson(SECRET); } catch (e) { setupError(`${SECRET} is not valid JSON: ${e.message}`); }
  const conf = raw.installed || raw.web;
  if (!conf || !conf.client_id) setupError(`${SECRET} has no "installed" block: download it again as a Desktop app client`);
  return conf;
}

async function runAuth() {
  const conf = clientSecret();
  if (!conf) setupError(SETUP);
  fs.mkdirSync(GSC_DIR, { recursive: true });
  const verifier = b64url(crypto.randomBytes(32));
  const challenge = b64url(crypto.createHash('sha256').update(verifier).digest());
  const state = b64url(crypto.randomBytes(16));
  const server = http.createServer();
  const port = await new Promise((r) => server.listen(0, '127.0.0.1', () => r(server.address().port)));
  /* The literal loopback IP: Google answers "localhost" with a bare 400 for
     newer desktop clients. */
  const redirect = `http://127.0.0.1:${port}`;
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: conf.client_id, redirect_uri: redirect, response_type: 'code', scope: SCOPE,
    access_type: 'offline', prompt: 'consent', code_challenge: challenge, code_challenge_method: 'S256', state,
  })}`;
  console.log('\n  Opening the browser for Search Console consent (read-only scope).');
  console.log('  Sign in with the Google account that owns sc-domain:strictly.fyi.');
  console.log(`  If no browser opens, paste this URL:\n\n  ${url}\n`);
  openBrowser(url);
  const code = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { server.close(); reject(new Error('timed out after 5 minutes waiting for consent')); }, 300000);
    server.on('request', (req, res) => {
      const q = new URL(req.url, redirect).searchParams;
      if (!q.get('code') && !q.get('error')) { res.writeHead(404); res.end(); return; }
      const good = q.get('code') && q.get('state') === state;
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!doctype html><html><body style="font-family:Georgia,serif;padding:3rem;background:#f6f3ec;color:#16171b"><h2>${good ? 'Authorised.' : 'Authorisation failed.'}</h2><p>${good ? 'You can close this tab and return to the terminal.' : 'No valid code came back; see the terminal.'}</p></body></html>`);
      clearTimeout(timer);
      server.close();
      if (good) resolve(q.get('code'));
      else reject(new Error(q.get('error') || 'state mismatch'));
    });
  });
  const t = await tokenRequest({ code, client_id: conf.client_id, client_secret: conf.client_secret || '', redirect_uri: redirect, grant_type: 'authorization_code', code_verifier: verifier });
  const saved = { ...t, expiry_date: Date.now() + (t.expires_in || 3600) * 1000 };
  fs.writeFileSync(TOKEN, JSON.stringify(saved, null, 2), 'utf8');
  console.log(`  Token cached at ${TOKEN}`);
  if (!t.refresh_token) console.log('  No refresh token came back: revoke the app at https://myaccount.google.com/permissions and run auth again.');
}

let cached = null;
async function accessToken() {
  if (cached && cached.exp > Date.now() + 60000) return cached.token;
  if (fs.existsSync(SA)) {
    /* A service-account key wins when present: no consent screen, no expiry. */
    let sa;
    try { sa = readJson(SA); } catch (e) { setupError(`${SA} is not valid JSON: ${e.message}`); }
    if (!sa.client_email || !sa.private_key) setupError(`${SA} has no client_email or private_key: download the JSON key again`);
    const now = Math.floor(Date.now() / 1000);
    const unsigned = `${b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64url(JSON.stringify({ iss: sa.client_email, scope: SCOPE, aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }))}`;
    const sig = crypto.createSign('RSA-SHA256').update(unsigned).sign(sa.private_key);
    const t = await tokenRequest({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${b64url(sig)}` });
    cached = { token: t.access_token, exp: Date.now() + (t.expires_in || 3600) * 1000 };
    return cached.token;
  }
  if (!fs.existsSync(TOKEN)) setupError(SETUP);
  const conf = clientSecret();
  if (!conf) setupError(`${TOKEN} exists but ${SECRET} does not; both are needed for OAuth.\n\n  ${SETUP}`);
  const tok = readJson(TOKEN);
  if (tok.access_token && tok.expiry_date > Date.now() + 60000) {
    cached = { token: tok.access_token, exp: tok.expiry_date };
    return cached.token;
  }
  if (!tok.refresh_token) setupError('The cached token has expired and holds no refresh token. Run: node scripts/gsc.mjs auth');
  try {
    const t = await tokenRequest({ client_id: conf.client_id, client_secret: conf.client_secret || '', refresh_token: tok.refresh_token, grant_type: 'refresh_token' });
    const saved = { ...tok, ...t, expiry_date: Date.now() + (t.expires_in || 3600) * 1000 };
    fs.writeFileSync(TOKEN, JSON.stringify(saved, null, 2), 'utf8');
    cached = { token: saved.access_token, exp: saved.expiry_date };
    return cached.token;
  } catch (e) {
    if (e.oauth === 'invalid_grant') setupError('The refresh token is no longer valid (it expires after 7 days while the consent screen is in Testing). Run: node scripts/gsc.mjs auth');
    throw e;
  }
}

async function api(method, url, body) {
  const res = await fetch(url, { method, headers: { Authorization: `Bearer ${await accessToken()}`, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let j = null;
  try { j = JSON.parse(text); } catch { /* error pages are not JSON */ }
  if (!res.ok) {
    const e = new Error(`${res.status} ${(j && j.error && j.error.message) || text.slice(0, 200)}`);
    e.status = res.status;
    throw e;
  }
  return j;
}
const site = () => String(flags.site || DEFAULT_SITE);
const searchType = () => String(flags.type || 'web');
/* --page narrows any report to one URL: a slug, a path or a full URL. It
   matches on the path, so apex and www rows for one entry both count. */
function pageFilter() {
  if (!flags.page || flags.page === true) return undefined;
  const v = String(flags.page);
  let expr = v;
  if (/^https?:\/\//.test(v)) expr = new URL(v).pathname;
  else if (!v.startsWith('/')) expr = `/blog/${v.replace(/\.md$/, '')}/`;
  return [{ filters: [{ dimension: 'page', operator: 'contains', expression: expr }] }];
}
/* searchanalytics.query caps each response at 25,000 rows; page through. */
async function query(dimensions, cap = 25000) {
  const r = windowRange();
  const rows = [];
  const size = Math.min(cap, 25000);
  for (let startRow = 0; rows.length < cap; startRow += size) {
    const j = await api('POST', `${API}/webmasters/v3/sites/${encodeURIComponent(site())}/searchAnalytics/query`, { startDate: r.startDate, endDate: r.endDate, dimensions, type: searchType(), rowLimit: size, startRow, dataState: 'final', dimensionFilterGroups: pageFilter() });
    const batch = (j && j.rows) || [];
    rows.push(...batch);
    if (batch.length < size) break;
  }
  return rows.slice(0, cap);
}
const fmtRow = (r) => [r.clicks, r.impressions, (r.ctr || 0).toFixed(4), (r.position || 0).toFixed(2)];
const sumRows = (rows) => {
  const clicks = rows.reduce((n, r) => n + r.clicks, 0);
  const impr = rows.reduce((n, r) => n + r.impressions, 0);
  const pos = impr ? rows.reduce((n, r) => n + r.position * r.impressions, 0) / impr : 0;
  return { clicks, impr, ctr: impr ? clicks / impr : 0, pos };
};
let corpusCache = null;
function corpus() {
  if (!corpusCache) {
    const require = createRequire(import.meta.url);
    corpusCache = require('./gates.cjs').loadCorpus();
  }
  return corpusCache;
}

/* ---------------------------------------------------------------- commands */
async function cmdSites() {
  const j = await api('GET', `${API}/webmasters/v3/sites`);
  const list = (j && j.siteEntry) || [];
  console.log('\n  Search Console properties on this account:\n');
  if (!list.length) console.log('    (none)');
  for (const s of list) console.log(`    ${s.siteUrl.padEnd(44)} ${s.permissionLevel}`);
  if (!list.some((s) => s.siteUrl === DEFAULT_SITE)) console.log(`\n  ${DEFAULT_SITE} is not among them: this account is not an owner or user of the property.`);
  console.log('');
}

async function cmdPerf() {
  const r = windowRange();
  const [total] = await query([], 1);
  console.log(`\n  ${site()}  ${r.label}  (search type ${searchType()})\n`);
  if (!total) { console.log('  No data in this window. A new property, the wrong property, or no impressions yet.\n'); return; }
  console.log(`    Clicks ............. ${total.clicks}`);
  console.log(`    Impressions ........ ${total.impressions}`);
  console.log(`    CTR ................ ${pct(total.ctr)}`);
  console.log(`    Average position ... ${total.position.toFixed(1)}  (impression-weighted; easy to over-read)\n`);
  const dev = await query(['device'], 10);
  console.log('    By device:');
  for (const d of dev) console.log(`      ${d.keys[0].padEnd(8)} ${String(d.clicks).padStart(6)} clicks ${String(d.impressions).padStart(8)} impr  CTR ${pct(d.ctr).padStart(7)}  pos ${d.position.toFixed(1)}`);
  const ctry = await query(['country'], 250);
  console.log('\n    Top countries by impressions:');
  for (const c of ctry.sort((a, b) => b.impressions - a.impressions).slice(0, 8)) console.log(`      ${c.keys[0].toUpperCase().padEnd(4)} ${String(c.clicks).padStart(6)} clicks ${String(c.impressions).padStart(8)} impr  CTR ${pct(c.ctr).padStart(7)}`);
  /* Position bands from query rows. Anonymised queries are omitted by Google,
     so the bands do not sum to the totals above. */
  const q = await query(['query']);
  const bands = [[1, 3], [4, 10], [11, 20], [21, 50], [51, Infinity]];
  console.log('\n    Position bands (query rows; anonymised queries excluded):');
  for (const [lo, hi] of bands) {
    const s = sumRows(q.filter((x) => x.position >= lo - 0.5 && x.position < hi + 0.5));
    console.log(`      ${`${lo}-${hi === Infinity ? '' : hi}`.padEnd(6)} ${String(s.impr).padStart(8)} impr ${String(s.clicks).padStart(6)} clicks  CTR ${pct(s.ctr).padStart(7)}`);
  }
  const daily = await query(['date']);
  const months = new Map();
  for (const d of daily) {
    const m = d.keys[0].slice(0, 7);
    if (!months.has(m)) months.set(m, []);
    months.get(m).push(d);
  }
  console.log('\n    By month:');
  for (const [m, rows] of [...months].sort()) { const s = sumRows(rows); console.log(`      ${m}  ${String(s.impr).padStart(8)} impr ${String(s.clicks).padStart(6)} clicks  pos ${s.pos.toFixed(1)}`); }
  const f = writeCsv('gsc-daily.csv', ['date', 'clicks', 'impressions', 'ctr', 'position'], daily.map((d) => [d.keys[0], ...fmtRow(d)]));
  console.log(`\n  Daily trend -> ${f} (${daily.length} days)\n`);
}

async function cmdList(dim, name) {
  const r = windowRange();
  const rows = await query([dim], num('limit', 25000));
  if (!rows.length) { console.log(`\n  No ${dim} data in ${r.label}.\n`); return; }
  const f = writeCsv(name, [dim, 'clicks', 'impressions', 'ctr', 'position'], rows.map((x) => [x.keys[0], ...fmtRow(x)]));
  console.log(`\n  ${rows.length} ${dim === 'page' ? 'pages' : 'queries'}, ${r.label} -> ${f}\n`);
  console.log(`    ${dim.padEnd(56)} ${'clk'.padStart(5)} ${'impr'.padStart(7)} ${'pos'.padStart(6)}`);
  for (const x of rows.slice().sort((a, b) => b.impressions - a.impressions).slice(0, 25)) {
    const k = dim === 'page' ? x.keys[0].replace(/^https?:\/\/[^/]+/, '') : x.keys[0];
    console.log(`    ${(k.length > 55 ? `${k.slice(0, 52)}...` : k).padEnd(56)} ${String(x.clicks).padStart(5)} ${String(x.impressions).padStart(7)} ${x.position.toFixed(1).padStart(6)}`);
  }
  console.log('');
}

async function cmdStriking() {
  const lo = num('min-pos', 5);
  const hi = num('max-pos', 25);
  const minImpr = num('min-impr', 3);
  const rows = (await query(['query', 'page'])).filter((x) => x.position >= lo && x.position <= hi && x.impressions >= minImpr).sort((a, b) => b.impressions - a.impressions);
  if (!rows.length) { console.log(`\n  Nothing at positions ${lo}-${hi} with ${minImpr}+ impressions: the gap is visibility, not ranking refinement.\n`); return; }
  const f = writeCsv('gsc-striking.csv', ['query', 'page', 'clicks', 'impressions', 'ctr', 'position'], rows.map((x) => [x.keys[0], x.keys[1], ...fmtRow(x)]));
  console.log(`\n  ${rows.length} query x page rows at positions ${lo}-${hi} -> ${f}\n`);
  for (const x of rows.slice(0, 30)) console.log(`    ${(x.keys[0].length > 44 ? `${x.keys[0].slice(0, 41)}...` : x.keys[0]).padEnd(45)} pos ${x.position.toFixed(1).padStart(5)} ${String(x.impressions).padStart(6)} impr  ${normPage(x.keys[1])}`);
  console.log('');
}

async function cmdEntries() {
  const r = windowRange();
  const rows = await query(['page']);
  const { entries } = corpus();
  const bySlug = new Map(entries.map((e) => [e.slug, { e, clicks: 0, impressions: 0, posW: 0 }]));
  const other = new Map();
  for (const x of rows) {
    const p = normPage(x.keys[0]);
    const m = p.match(/^\/blog\/([a-z0-9-]+)\/$/);
    const t = m && bySlug.get(m[1]);
    const acc = t || (other.get(p) || other.set(p, { clicks: 0, impressions: 0, posW: 0 }).get(p));
    acc.clicks += x.clicks;
    acc.impressions += x.impressions;
    acc.posW += x.position * x.impressions;
  }
  const today = Date.now();
  const list = [...bySlug.values()].map((v) => {
    const fm = v.e.fm || {};
    const days = fm.pubDate ? Math.floor((today - Date.parse(`${fm.pubDate}T00:00:00Z`)) / 86400000) : '';
    return { ...v, filecode: fm.filecode || '', dept: fm.category || '', pubDate: fm.pubDate || '', days, title: fm.title || '', pos: v.impressions ? v.posW / v.impressions : 0 };
  }).sort((a, b) => b.impressions - a.impressions);
  const f = writeCsv('gsc-entries.csv', ['filecode', 'slug', 'category', 'pubDate', 'days_live', 'impressions', 'clicks', 'ctr', 'position', 'title'],
    list.map((x) => [x.filecode, x.e.slug, x.dept, x.pubDate, x.days, x.impressions, x.clicks, x.impressions ? (x.clicks / x.impressions).toFixed(4) : '0', x.pos ? x.pos.toFixed(2) : '', x.title]));
  console.log(`\n  ${list.length} entries joined to ${rows.length} page rows, ${r.label} -> ${f}\n`);
  console.log('    By department:');
  const depts = new Map();
  for (const x of list) { if (!depts.has(x.dept)) depts.set(x.dept, []); depts.get(x.dept).push(x); }
  for (const [d, xs] of [...depts].sort((a, b) => b[1].reduce((n, x) => n + x.impressions, 0) - a[1].reduce((n, x) => n + x.impressions, 0))) {
    const impr = xs.reduce((n, x) => n + x.impressions, 0);
    const clicks = xs.reduce((n, x) => n + x.clicks, 0);
    console.log(`      ${d.padEnd(10)} ${String(xs.length).padStart(3)} entries ${String(impr).padStart(8)} impr ${String(clicks).padStart(6)} clicks  ${xs.filter((x) => !x.impressions).length} with none`);
  }
  console.log('\n    Top entries by impressions:');
  for (const x of list.slice(0, 15)) console.log(`      ${x.filecode.padEnd(8)} ${x.e.slug.slice(0, 44).padEnd(45)} ${String(x.impressions).padStart(7)} impr ${String(x.clicks).padStart(5)} clk  pos ${x.pos.toFixed(1)}`);
  const zero = list.filter((x) => !x.impressions);
  console.log(`\n    ${zero.length} entr${zero.length === 1 ? 'y' : 'ies'} with no impressions in the window (coverage candidates for the coverage command):`);
  for (const x of zero.slice(0, 40)) console.log(`      ${x.filecode.padEnd(8)} ${x.e.slug}  (${x.days} days live)`);
  if (zero.length > 40) console.log(`      ... ${zero.length - 40} more in the CSV`);
  if (other.size) {
    console.log('\n    Other pages:');
    for (const [p, v] of [...other].sort((a, b) => b[1].impressions - a[1].impressions).slice(0, 10)) console.log(`      ${p.padEnd(40)} ${String(v.impressions).padStart(7)} impr ${String(v.clicks).padStart(5)} clk`);
  }
  console.log('');
}

async function cmdCannibal() {
  const minImpr = num('min-impr', 3);
  const rows = await query(['query', 'page']);
  const byQuery = new Map();
  for (const x of rows) {
    const p = normPage(x.keys[1]);
    if (!/^\/blog\/[a-z0-9-]+\/$/.test(p) || x.impressions < minImpr) continue;
    if (!byQuery.has(x.keys[0])) byQuery.set(x.keys[0], new Map());
    const m = byQuery.get(x.keys[0]);
    const prev = m.get(p) || { impressions: 0, clicks: 0, posW: 0 };
    m.set(p, { impressions: prev.impressions + x.impressions, clicks: prev.clicks + x.clicks, posW: prev.posW + x.position * x.impressions });
  }
  const hits = [...byQuery].filter(([, m]) => m.size >= 2).sort((a, b) => [...b[1].values()].reduce((n, v) => n + v.impressions, 0) - [...a[1].values()].reduce((n, v) => n + v.impressions, 0));
  if (!hits.length) { console.log(`\n  No query sends ${minImpr}+ impressions to two or more entries. No cannibalisation visible yet.\n`); return; }
  const out = [];
  for (const [q, m] of hits) for (const [p, v] of m) out.push([q, p, v.impressions, v.clicks, (v.posW / v.impressions).toFixed(2)]);
  const f = writeCsv('gsc-cannibal.csv', ['query', 'page', 'impressions', 'clicks', 'position'], out);
  console.log(`\n  ${hits.length} quer${hits.length === 1 ? 'y' : 'ies'} split across two or more entries -> ${f}\n`);
  for (const [q, m] of hits.slice(0, 20)) {
    console.log(`    "${q}"`);
    for (const [p, v] of [...m].sort((a, b) => b[1].impressions - a[1].impressions)) console.log(`        ${p.padEnd(52)} ${String(v.impressions).padStart(6)} impr  pos ${(v.posW / v.impressions).toFixed(1)}`);
  }
  console.log('');
}

/* URL Inspection: 2,000 calls a day and 600 a minute, so run serially. */
async function cmdCoverage() {
  const limit = num('limit', 250);
  const indexUrl = String(flags.sitemap || `${ORIGIN}/sitemap-index.xml`);
  const get = async (u) => { const r = await fetch(u); if (!r.ok) apiError(`could not fetch ${u} (HTTP ${r.status})`); return r.text(); };
  const idx = await get(indexUrl);
  const children = [...idx.matchAll(/<sitemap>[\s\S]*?<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  const urls = [];
  for (const c of children.length ? children : [indexUrl]) {
    const xml = children.length ? await get(c) : idx;
    for (const m of xml.matchAll(/<url>[\s\S]*?<loc>\s*([^<\s]+)\s*<\/loc>/g)) urls.push(m[1]);
  }
  const pick = urls.slice(0, limit);
  console.log(`\n  ${urls.length} sitemap URLs; inspecting ${pick.length} (about one a second).\n`);
  const results = [];
  const tally = {};
  for (let i = 0; i < pick.length; i++) {
    try {
      const j = await api('POST', `${API}/v1/urlInspection/index:inspect`, { inspectionUrl: pick[i], siteUrl: site() });
      const s = (j && j.inspectionResult && j.inspectionResult.indexStatusResult) || {};
      results.push([pick[i], s.verdict || '', s.coverageState || '', s.robotsTxtState || '', s.indexingState || '', s.googleCanonical || '', s.lastCrawlTime || '']);
      tally[s.coverageState || 'unknown'] = (tally[s.coverageState || 'unknown'] || 0) + 1;
      process.stdout.write(`\r  ${i + 1}/${pick.length}  ${(s.coverageState || '').slice(0, 50).padEnd(50)}`);
    } catch (e) {
      results.push([pick[i], 'ERROR', e.message, '', '', '', '']);
      tally.ERROR = (tally.ERROR || 0) + 1;
      if (e.status === 429 || /quota|rate/i.test(e.message)) { console.log(`\n\n  Quota reached after ${i} URLs; partial results kept.`); break; }
    }
    await new Promise((r) => setTimeout(r, 350));
  }
  const f = writeCsv('gsc-coverage.csv', ['url', 'verdict', 'coverageState', 'robotsTxtState', 'indexingState', 'googleCanonical', 'lastCrawlTime'], results);
  console.log(`\n\n  Index coverage across ${results.length} URLs:\n`);
  for (const [k, n] of Object.entries(tally).sort((a, b) => b[1] - a[1])) console.log(`    ${String(n).padStart(4)}  ${pct(n / results.length).padStart(7)}  ${k}`);
  const wrongCanon = results.filter((x) => x[5] && x[5] !== x[0]);
  if (wrongCanon.length) console.log(`\n  ${wrongCanon.length} URL(s) where Google chose a different canonical (see the CSV).`);
  console.log(`\n  -> ${f}\n`);
}

const USAGE = `
  Search Console CLI for strictly.fyi (${DEFAULT_SITE})

    node scripts/gsc.mjs auth                    authorise (OAuth route; not needed with a service account)
    node scripts/gsc.mjs sites                   readable properties
    node scripts/gsc.mjs perf      [window]      totals, devices, countries, bands, months, daily CSV
    node scripts/gsc.mjs queries   [window]      top queries -> CSV
    node scripts/gsc.mjs pages     [window]      top pages -> CSV
    node scripts/gsc.mjs striking  [window]      positions 5-25 (--min-pos --max-pos --min-impr)
    node scripts/gsc.mjs entries   [window]      pages joined to filecodes and departments -> CSV
    node scripts/gsc.mjs cannibal  [window]      queries split across entries -> CSV
    node scripts/gsc.mjs coverage  [--limit N]   URL Inspection over the live sitemap

  window: --days N (default 90, 486 = all GSC keeps) | --start YYYY-MM-DD --end YYYY-MM-DD
  flags:  --page <slug|path|URL>  --site <property>  --limit N  --out <file.csv>  --type web|image|video|news
  credentials: ${GSC_DIR} (set GSC_DIR to move them out of the repo)
`;

async function main() {
  if (cmd === 'help' || flags.help) { console.log(USAGE); done(); }
  const commands = { auth: runAuth, sites: cmdSites, perf: cmdPerf, queries: () => cmdList('query', 'gsc-queries.csv'), pages: () => cmdList('page', 'gsc-pages.csv'), striking: cmdStriking, entries: cmdEntries, cannibal: cmdCannibal, coverage: cmdCoverage };
  if (!commands[cmd]) { console.log(USAGE); setupError(`unknown command "${cmd}"`); }
  if (cmd !== 'auth' && !fs.existsSync(SA) && !fs.existsSync(TOKEN)) setupError(SETUP);
  if (cmd === 'auth' && !fs.existsSync(SECRET)) setupError(SETUP);
  windowRange();
  await commands[cmd]();
  done();
}
main().catch((e) => {
  if (e instanceof Exit) { process.exitCode = e.code; return; }
  const m = e && e.message ? e.message : String(e);
  const hint = e && e.status === 403 ? `\n  The account or service account is not a user of ${site()}. Run: node scripts/gsc.mjs sites`
    : e && e.status === 401 ? '\n  Run: node scripts/gsc.mjs auth'
      : e && e.status === 429 ? '\n  Quota exceeded: wait and retry.' : '';
  console.error(`\n  ${m}${hint}\n`);
  console.log('GSC: ERROR');
  process.exitCode = 1;
});
