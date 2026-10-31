/* Posts the day's item from brand/social/schedule.json to Bluesky, with a link
   card for the entry (its og:title, og:description and og:image). Run daily by
   .github/workflows/social-bluesky.yml; SOCIAL.md has the setup.

     BLUESKY_APP_PASSWORD=... node scripts/post-bluesky.mjs
     DRY_RUN=1 DATE=2026-11-01 node scripts/post-bluesky.mjs   (prints, sends nothing)

   Env: BLUESKY_HANDLE (default strictly.fyi), BLUESKY_APP_PASSWORD (an app
   password, never the account password), DATE (YYYY-MM-DD, default today in
   UTC), DRY_RUN=1, SCHEDULE (path, default brand/social/schedule.json).
   Posting twice is guarded: an item whose exact text is already among the
   account's recent posts is skipped, so a rerun or a doubled cron is harmless. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCHEDULE = process.env.SCHEDULE || path.join(root, "brand", "social", "schedule.json");
const HANDLE = process.env.BLUESKY_HANDLE || "strictly.fyi";
const DRY = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
const DATE = process.env.DATE || new Date().toISOString().slice(0, 10);
const ENTRYWAY = "https://bsky.social/xrpc";
const APPVIEW = "https://public.api.bsky.app/xrpc";
const UA = "strictly.fyi-scheduler (+https://www.strictly.fyi/)";

const die = (msg) => {
  console.error(`::error::${msg}`);
  process.exitCode = 1;
};

async function xrpc(base, method, { token, body, query, raw, type } = {}) {
  const url = new URL(`${base}/${method}`);
  for (const [k, v] of Object.entries(query || {})) url.searchParams.set(k, v);
  const headers = {};
  if (token) headers.authorization = `Bearer ${token}`;
  if (raw) headers["content-type"] = type;
  else if (body) headers["content-type"] = "application/json";
  const res = await fetch(url, { method: body || raw ? "POST" : "GET", headers, body: raw || (body ? JSON.stringify(body) : undefined) });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} -> HTTP ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}

/* The card: what the entry page itself says about itself. */
async function card(url) {
  const res = await fetch(url, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  const html = await res.text();
  const meta = (p) => {
    const m = html.match(new RegExp(`<meta[^>]+property="${p}"[^>]+content="([^"]*)"`, "i")) || html.match(new RegExp(`<meta[^>]+content="([^"]*)"[^>]+property="${p}"`, "i"));
    return m ? m[1].replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">") : "";
  };
  const title = meta("og:title");
  if (!title) throw new Error(`${url} has no og:title`);
  const image = meta("og:image") ? new URL(meta("og:image"), url).href : "";
  return { uri: url, title, description: meta("og:description"), image };
}

async function main() {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(DATE)) return die(`DATE must be YYYY-MM-DD, got ${DATE}`);
  const items = JSON.parse(fs.readFileSync(SCHEDULE, "utf8")).filter((i) => i.date === DATE);
  if (!items.length) {
    console.log(`Nothing scheduled for ${DATE}.`);
    return;
  }
  const password = process.env.BLUESKY_APP_PASSWORD;
  if (!DRY && !password) return die("BLUESKY_APP_PASSWORD is not set. SOCIAL.md says how to create the app password and add it as a repository secret.");

  let session = null;
  let pds = "";
  let recent = new Set();
  /* A dry run with the password still signs in and reads the feed, so a manual
     run proves the secret works; it only skips the upload and the post. */
  if (password) {
    session = await xrpc(ENTRYWAY, "com.atproto.server.createSession", { body: { identifier: HANDLE, password } });
    console.log(`Signed in as @${session.handle}.`);
    /* Writes go to the account's own PDS, named in its DID document. */
    pds = `${session.didDoc?.service?.find((s) => s.id === "#atproto_pds")?.serviceEndpoint || "https://bsky.social"}/xrpc`;
    const feed = await xrpc(APPVIEW, "app.bsky.feed.getAuthorFeed", { query: { actor: session.did, limit: "30", filter: "posts_no_replies" } });
    recent = new Set((feed.feed || []).map((f) => f.post?.record?.text));
  } else console.log("No BLUESKY_APP_PASSWORD, so this dry run does not sign in.");

  for (const item of items) {
    if (!item.text || !item.url) return die(`${DATE} ${item.slug}: text and url are both required`);
    if ([...new Intl.Segmenter().segment(item.text)].length > 300) return die(`${DATE} ${item.slug}: text is over 300 graphemes`);
    if (recent.has(item.text)) {
      console.log(`${DATE} ${item.slug}: already posted, skipping.`);
      continue;
    }
    const record = { $type: "app.bsky.feed.post", text: item.text, langs: ["en"], createdAt: new Date().toISOString() };
    try {
      const c = await card(item.url);
      const external = { uri: c.uri, title: c.title, description: c.description };
      if (c.image) {
        const img = await fetch(c.image, { headers: { "user-agent": UA } });
        const bytes = img.ok ? Buffer.from(await img.arrayBuffer()) : null;
        if (bytes && bytes.length <= 1_000_000) {
          if (DRY) external.thumb = `(would upload ${bytes.length} bytes from ${c.image})`;
          else external.thumb = (await xrpc(pds, "com.atproto.repo.uploadBlob", { token: session.accessJwt, raw: bytes, type: img.headers.get("content-type") || "image/png" })).blob;
        } else console.log(`card image skipped (${bytes ? `${bytes.length} bytes` : `HTTP ${img.status}`})`);
      }
      record.embed = { $type: "app.bsky.embed.external", external };
    } catch (e) {
      /* No card: put the link in the text instead, as a clickable facet. */
      console.log(`card failed (${e.message}); linking in the text instead`);
      const prefix = `${item.text}\n\n`;
      record.text = `${prefix}${item.url}`;
      const start = Buffer.byteLength(prefix, "utf8");
      record.facets = [{ index: { byteStart: start, byteEnd: start + Buffer.byteLength(item.url, "utf8") }, features: [{ $type: "app.bsky.richtext.facet#link", uri: item.url }] }];
    }
    if (DRY) {
      console.log(`DRY RUN ${DATE} ${item.slug}:\n${JSON.stringify(record, null, 2)}`);
      continue;
    }
    const out = await xrpc(pds, "com.atproto.repo.createRecord", { token: session.accessJwt, body: { repo: session.did, collection: "app.bsky.feed.post", record } });
    console.log(`${DATE} ${item.slug}: posted ${out.uri}`);
  }
}

main().catch((e) => die(e.message));
