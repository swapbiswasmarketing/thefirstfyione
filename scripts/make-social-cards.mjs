/* Images for the daily social queue, drawn by the site's card engine
   (src/lib/og/cards.ts) so they match the masthead. Run by hand:

     node scripts/make-social-cards.mjs [YYYY-MM-DD]

   Needs Node 23.6 or later. Reads brand/social/schedule.json and, when it
   exists, brand/social/instagram.json (the checked carousel words). Writes
   into brand/social/cards/:
     x/<date>-<slug>.png             the image on that day's X post; kept in
                                     git, because the X Action attaches it
     instagram/<date>-<slug>/NN.png  the carousel: cover, slides, end; git
                                     ignores these, since a rerun rebuilds them
   SOCIAL.md says how each is used. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
/* The card engine resolves its fonts from the working directory. */
process.chdir(root);
const load = (file) => import(pathToFileURL(path.join(root, file)).href);
const { renderCover, renderSlide, renderEnd } = await load("src/lib/og/cards.ts");
const { DOT } = await load("src/lib/og/spec.ts");
const { catLabel } = await load("src/data/site.ts");

const social = path.join(root, "brand", "social");
const only = process.argv[2];
const items = JSON.parse(fs.readFileSync(path.join(social, "schedule.json"), "utf8"));
const igFile = path.join(social, "instagram.json");
const ig = fs.existsSync(igFile) ? Object.fromEntries(JSON.parse(fs.readFileSync(igFile, "utf8")).map((p) => [p.date, p])) : {};
/* x-plan.json names the days whose X post carries several slides instead of the title card. */
const planFile = path.join(social, "x-plan.json");
const xplan = fs.existsSync(planFile) ? Object.fromEntries(JSON.parse(fs.readFileSync(planFile, "utf8")).map((d) => [d.date, d])) : {};

const front = (slug) => {
  const md = fs.readFileSync(path.join(root, "src", "content", "blog", `${slug}.md`), "utf8");
  const get = (k) => (md.match(new RegExp(`^${k}:\\s*"(.*)"\\s*$`, "m")) || [])[1] || "";
  return { title: get("title"), filecode: get("filecode"), category: get("category") };
};
const write = (rel, data) => {
  const file = path.join(social, "cards", rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
  return data.length;
};
const pad = (n) => String(n).padStart(2, "0");

for (const it of items) {
  if (only && it.date !== only) continue;
  const e = front(it.slug);
  /* "Question? Answer": the answer goes on the highlighter. */
  const [, question = e.title, answer = ""] = e.title.match(/^(.*?\?)\s*(.*)$/) || [];
  const kicker = `${e.filecode || "FYI"} ${DOT} ${catLabel[e.category] || e.category}`.toUpperCase();
  const name = `${it.date}-${it.slug}`;
  const post = ig[it.date];
  /* A title with no answer after its question borrows the carousel's checked teaser. */
  const cover = { kicker, question, answer: answer || post?.cover?.teaser || undefined };
  let bytes = write(`x/${name}.png`, Buffer.from(await renderCover({ ...cover, foot: "" })));
  const multi = xplan[it.date]?.format === "images" ? xplan[it.date].slides : [];
  for (const [i, s] of multi.entries())
    bytes += write(`x/${name}/${i + 1}.png`, Buffer.from(await renderSlide({ head: s.head, body: s.body, page: `${i + 1} / ${multi.length}`, kicker })));
  const total = post ? post.slides.length + 2 : 0;
  if (post) {
    bytes += write(`instagram/${name}/01.png`, Buffer.from(await renderCover({ ...cover, foot: "SWIPE" })));
    for (const [i, s] of post.slides.entries())
      bytes += write(`instagram/${name}/${pad(i + 2)}.png`, Buffer.from(await renderSlide({ head: s.head, body: s.body, page: `${i + 2} / ${total}`, kicker })));
    bytes += write(`instagram/${name}/${pad(total)}.png`, Buffer.from(await renderEnd({ kicker, page: `${total} / ${total}` })));
  }
  console.log(`${name}  ${post ? `x + ${total} slides` : "x"}  ${bytes} bytes`);
}
