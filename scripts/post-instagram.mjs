/* Posts the day's carousel from brand/social/instagram.json to Instagram
   through Instagram's official API (Instagram API with Instagram Login):
   posting through the API is allowed, automating instagram.com is not. Run
   by .github/workflows/social-instagram.yml; SOCIAL.md has the setup.

     DRY_RUN=1 DATE=2026-11-02 node scripts/post-instagram.mjs   (prints, posts nothing)

   Env: IG_ACCESS_TOKEN (the long-lived token generated in the app's
   dashboard, valid 60 days), DATE (YYYY-MM-DD, default today in UTC, which at
   17:00 UTC is also the date in India), DRY_RUN=1, SITE (default
   https://www.strictly.fyi). The slides are the JPEGs the site serves at
   /social/ig/<date>/NN.jpg (node scripts/make-social-cards.mjs writes them),
   and every slide carries its own text as alt text. A day whose caption
   already opens one of the account's latest posts is skipped, so a rerun
   never posts twice. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KIT = process.env.KIT || path.join(root, "brand", "social", "instagram.json");
const DATE = process.env.DATE || new Date().toISOString().slice(0, 10);
const DRY = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
const SITE = process.env.SITE || "https://www.strictly.fyi";
const TOKEN = process.env.IG_ACCESS_TOKEN;
const API = "https://graph.instagram.com/v26.0";

const die = (msg) => {
  console.error(`::error::${msg}`);
  process.exitCode = 1;
};
const pad = (n) => String(n).padStart(2, "0");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ig(method, endpoint, params = {}) {
  const url = new URL(`${API}${endpoint}`);
  const form = new URLSearchParams({ ...params, access_token: TOKEN });
  const opts = { method };
  if (method === "GET") url.search = form.toString();
  else opts.body = form;
  const res = await fetch(url, opts);
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${endpoint} -> HTTP ${res.status}: ${text.slice(0, 400)}`);
  return JSON.parse(text);
}

/* The entry's title, split as the cover draws it: "Question? Answer". */
function cover(slug, teaser) {
  const md = fs.readFileSync(path.join(root, "src", "content", "blog", `${slug}.md`), "utf8");
  const title = (md.match(/^title:\s*"(.*)"\s*$/m) || [])[1] || "";
  const [, question = title, answer = ""] = title.match(/^(.*?\?)\s*(.*)$/) || [];
  return `${question} ${answer || teaser || ""}`.trim();
}

async function main() {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(DATE)) return die(`DATE must be YYYY-MM-DD, got ${DATE}`);
  const kit = JSON.parse(fs.readFileSync(KIT, "utf8")).find((k) => k.date === DATE);
  if (!kit) {
    console.log(`Nothing scheduled for ${DATE}.`);
    return;
  }
  if (!TOKEN && !DRY) {
    console.log(`::warning::IG_ACCESS_TOKEN is not set, so the ${DATE} carousel was not posted. Post it by hand, or add the token (SOCIAL.md).`);
    return;
  }

  const caption = `${kit.caption}\n\n${kit.hashtags.map((h) => `#${h}`).join(" ")}`;
  if (caption.length > 2200) return die(`${DATE}: caption is ${caption.length} characters, over 2,200`);
  const alts = [
    cover(kit.slug, kit.cover?.teaser),
    ...kit.slides.map((s) => (s.head ? `${s.head}: ${s.body}` : s.body)),
    "Strictly FYI. Every source is linked in the full entry at strictly.fyi, through the link in bio.",
  ];
  const slides = alts.map((alt, i) => ({ url: `${SITE}/social/ig/${DATE}/${pad(i + 1)}.jpg`, alt }));

  /* Instagram fetches each image itself, so every one must already be live. */
  for (const s of slides) {
    const res = await fetch(s.url, { method: "HEAD" });
    const type = res.headers.get("content-type") || "";
    if (!res.ok || !type.startsWith("image/jpeg")) return die(`${s.url} -> HTTP ${res.status} ${type}: render with node scripts/make-social-cards.mjs, commit public/social/ig/ and let the site deploy`);
  }

  let uid = "";
  if (TOKEN) {
    const me = await ig("GET", "/me", { fields: "user_id,username" });
    uid = me.user_id || me.id;
    console.log(`Signed in as @${me.username}.`);
    const opener = kit.caption.split("\n")[0];
    const latest = (await ig("GET", `/${uid}/media`, { fields: "caption,timestamp", limit: "10" })).data || [];
    if (latest.some((m) => (m.caption || "").startsWith(opener))) {
      console.log(`${DATE}: already posted, skipping.`);
      return;
    }
  }

  if (DRY) {
    console.log(`DRY RUN ${DATE} ${kit.slug}: a ${slides.length}-slide carousel, all ${slides.length} images live.`);
    slides.forEach((s, i) => console.log(`slide ${i + 1}: ${s.url}\n  alt: ${s.alt}`));
    console.log(`--- caption (${caption.length} characters)\n${caption}`);
    return;
  }

  const children = [];
  for (const s of slides) children.push((await ig("POST", `/${uid}/media`, { image_url: s.url, is_carousel_item: "true", alt_text: s.alt })).id);
  const container = (await ig("POST", `/${uid}/media`, { media_type: "CAROUSEL", children: children.join(","), caption })).id;
  /* Containers are processed asynchronously; images usually finish within seconds. */
  for (let i = 0; ; i++) {
    const { status_code: status } = await ig("GET", `/${container}`, { fields: "status_code" });
    if (status === "FINISHED") break;
    if (status === "ERROR" || status === "EXPIRED" || i >= 30) return die(`${DATE}: container ${container} is ${status}`);
    await sleep(10_000);
  }
  const media = (await ig("POST", `/${uid}/media_publish`, { creation_id: container })).id;
  const { permalink } = await ig("GET", `/${media}`, { fields: "permalink" });
  console.log(`${DATE} ${kit.slug}: posted ${permalink || media}`);
}

main().catch((e) => die(e.message));
