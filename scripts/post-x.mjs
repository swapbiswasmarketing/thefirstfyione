/* Posts the day's X item from brand/social/x-plan.json through X's official
   API: scheduled posting through the API is allowed, scripting the X website
   is not. Run by .github/workflows/social-x.yml; SOCIAL.md has the setup.

     DRY_RUN=1 DATE=2026-11-03 SLOT=main node scripts/post-x.mjs   (prints, sends nothing)

   Env: X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET (the
   app's OAuth 1.0a keys for @strictlyfyi, app permission "Read and write"),
   DATE (YYYY-MM-DD, default today in UTC, which at 15:30 and 18:00 UTC is
   also the date in India), SLOT (main or second), DRY_RUN=1, PLAN (path).
   The main slot posts the day's text, title card, thread, images or poll as
   x-plan.json sets it; the second slot posts the weekday second post. A post
   whose text is already among the account's latest posts is skipped, so a
   rerun, a doubled cron or a post the owner scheduled by hand goes out once. */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PLAN = process.env.PLAN || path.join(root, "brand", "social", "x-plan.json");
const DATE = process.env.DATE || new Date().toISOString().slice(0, 10);
const SLOT = process.env.SLOT || "main";
const DRY = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
const API = "https://api.x.com/2";
/* x.com/i/communities/<id>. Posting into one needs the account to have joined it. */
const COMMUNITIES = { "History on X": "1691711931751534664" };
const { X_API_KEY: KEY, X_API_SECRET: SECRET, X_ACCESS_TOKEN: TOKEN, X_ACCESS_TOKEN_SECRET: TOKEN_SECRET } = process.env;

const die = (msg) => {
  console.error(`::error::${msg}`);
  process.exitCode = 1;
};
const enc = (s) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

/* OAuth 1.0a user context: query parameters are signed, JSON and multipart bodies are not. */
function authorization(method, url, query) {
  const o = {
    oauth_consumer_key: KEY,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_token: TOKEN,
    oauth_version: "1.0",
  };
  const pairs = Object.entries({ ...query, ...o }).map(([k, v]) => [enc(k), enc(v)]);
  pairs.sort(([a, x], [b, y]) => (a === b ? (x < y ? -1 : 1) : a < b ? -1 : 1));
  const base = `${method}&${enc(url)}&${enc(pairs.map(([k, v]) => `${k}=${v}`).join("&"))}`;
  o.oauth_signature = crypto.createHmac("sha1", `${enc(SECRET)}&${enc(TOKEN_SECRET)}`).update(base).digest("base64");
  return `OAuth ${Object.keys(o).sort().map((k) => `${enc(k)}="${enc(o[k])}"`).join(", ")}`;
}

async function x(method, endpoint, { query = {}, json, form } = {}) {
  const url = `${API}${endpoint}`;
  const qs = Object.keys(query).length ? `?${Object.entries(query).map(([k, v]) => `${enc(k)}=${enc(v)}`).join("&")}` : "";
  const headers = { authorization: authorization(method, url, query) };
  if (json) headers["content-type"] = "application/json";
  const res = await fetch(url + qs, { method, headers, body: json ? JSON.stringify(json) : form });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${endpoint} -> HTTP ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : {};
}

async function upload(file) {
  const form = new FormData();
  form.append("media", new Blob([fs.readFileSync(path.join(root, file))], { type: "image/png" }), path.basename(file));
  form.append("media_category", "tweet_image");
  const out = await x("POST", "/media/upload", { form });
  const id = out.data?.id;
  if (!id) throw new Error(`media upload returned no id: ${JSON.stringify(out).slice(0, 200)}`);
  return id;
}

const tweet = async (body) => (await x("POST", "/tweets", { json: body })).data.id;
const norm = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();

async function main() {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(DATE)) return die(`DATE must be YYYY-MM-DD, got ${DATE}`);
  if (SLOT !== "main" && SLOT !== "second") return die(`SLOT must be main or second, got ${SLOT}`);
  const day = JSON.parse(fs.readFileSync(PLAN, "utf8")).find((d) => d.date === DATE);
  const scheduled = day?.how === "scheduled" && SLOT === "main";
  if (!day || (SLOT === "second" && !day.second) || scheduled) {
    console.log(`Nothing for the ${SLOT} slot on ${DATE}${scheduled ? ": it is already scheduled in X" : ""}.`);
    return;
  }
  const keys = KEY && SECRET && TOKEN && TOKEN_SECRET;
  if (!keys && !DRY) {
    console.log(`::warning::The X API keys are not set, so ${DATE} ${SLOT} was not posted. Post it by hand from the copy sheet, or add the keys (SOCIAL.md).`);
    return;
  }

  const main = SLOT === "main";
  const texts = !main ? [day.second.text] : day.format === "thread" ? day.thread : [day.text];
  const images = !main ? [] : day.format === "card" ? [day.image] : day.format === "images" ? day.images : [];
  for (const f of images) if (!fs.existsSync(path.join(root, f))) return die(`missing image ${f}: run node scripts/make-social-cards.mjs and commit brand/social/cards/x/`);
  const first = { text: texts[0] };
  if (main && day.format === "poll") first.poll = { options: day.poll.options, duration_minutes: 1440 };
  const community = main && day.community ? COMMUNITIES[day.community] : undefined;

  if (keys) {
    /* An OAuth 1.0a access token starts with the account's user id. */
    let uid = TOKEN.split("-")[0];
    if (DRY || !/^\d+$/.test(uid)) {
      const me = (await x("GET", "/users/me")).data;
      console.log(`Signed in as @${me.username}.`);
      uid = me.id;
    }
    const latest = (await x("GET", `/users/${uid}/tweets`, { query: { max_results: "10", "tweet.fields": "text" } })).data || [];
    if (latest.some((t) => norm(t.text) === norm(texts[0]))) {
      console.log(`${DATE} ${SLOT}: already posted, skipping.`);
      return;
    }
  }

  if (DRY) {
    console.log(`DRY RUN ${DATE} ${SLOT} (${main ? day.format : "second post"})${community ? `, into the ${day.community} Community` : ""}:`);
    texts.forEach((t, i) => console.log(`--- post ${i + 1}${i ? " (reply to the one before)" : ""}${i === 0 && first.poll ? `, poll: ${first.poll.options.join(" / ")}` : ""}\n${t}`));
    images.forEach((f) => console.log(`image: ${f} (${fs.statSync(path.join(root, f)).size} bytes)`));
    return;
  }

  const body = { ...first };
  if (images.length) body.media = { media_ids: [] };
  for (const f of images) body.media.media_ids.push(await upload(f));
  let id;
  if (community) {
    try {
      id = await tweet({ ...body, community_id: community });
    } catch (e) {
      console.log(`::warning::Posting into the ${day.community} Community failed (${e.message}); posting to the timeline instead. Has the account joined it?`);
    }
  }
  if (!id) id = await tweet(body);
  console.log(`${DATE} ${SLOT}: posted https://x.com/strictlyfyi/status/${id}`);
  for (const t of texts.slice(1)) {
    id = await tweet({ text: t, reply: { in_reply_to_tweet_id: id } });
    console.log(`  thread: https://x.com/strictlyfyi/status/${id}`);
  }
}

main().catch((e) => die(e.message));
