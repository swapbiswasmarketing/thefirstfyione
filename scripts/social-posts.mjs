/* The social post queue: one post per entry, its almanac line and its link.
   The almanac line is already on the site and passed the same checks as the
   entry, so a post adds no claim the entry does not make. Run after entries
   are added or corrected:

     node scripts/social-posts.mjs

   Writes brand/social/posts.csv (n, slug, department, url, post), "Start here"
   entries first, then the departments in turn, newest first within each.
   Fails if a post would run past X's 280 (a link counts as 23) or Bluesky's
   300 graphemes (the link counted in full). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "src", "content", "blog");
const field = (t, k) => t.match(new RegExp(`^${k}:\\s*(.*?)\\s*$`, "m"))?.[1] ?? "";
const unquote = (s) => (s.startsWith('"') ? JSON.parse(s) : s);

const today = new Date().toISOString().slice(0, 10);
const entries = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => {
    const t = fs.readFileSync(path.join(dir, f), "utf8");
    const slug = f.slice(0, -3);
    return {
      slug,
      cat: unquote(field(t, "category")),
      pub: unquote(field(t, "pubDate")),
      featured: field(t, "featured") === "true",
      almanac: unquote(field(t, "almanac")),
      url: `https://www.strictly.fyi/blog/${slug}/`,
    };
  })
  /* A future-dated entry is not on the site yet. */
  .filter((e) => e.almanac && e.pub <= today);

const byNewest = (a, b) => (a.pub === b.pub ? a.slug.localeCompare(b.slug) : b.pub.localeCompare(a.pub));
const queue = entries.filter((e) => e.featured).sort(byNewest);
const lanes = ["science", "history", "tech", "culture", "everyday", "curiosity"].map((c) =>
  entries.filter((e) => !e.featured && e.cat === c).sort(byNewest)
);
while (lanes.some((l) => l.length)) for (const l of lanes) if (l.length) queue.push(l.shift());
if (queue.length !== entries.length) throw new Error(`an entry has a department outside the six: ${entries.length - queue.length} left out`);

const graphemes = (s) => [...new Intl.Segmenter().segment(s)].length;
const csv = (s) => `"${String(s).replace(/"/g, '""')}"`;
const rows = queue.map((e, i) => {
  const post = `${e.almanac}\n\n${e.url}`;
  const x = e.almanac.length + 2 + 23;
  if (x > 280 || graphemes(post) > 300) throw new Error(`${e.slug}: post too long (X ${x}, Bluesky ${graphemes(post)})`);
  return [i + 1, e.slug, e.cat, e.url, post].map(csv).join(",");
});
const out = path.join(root, "brand", "social", "posts.csv");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, ["n,slug,department,url,post", ...rows].join("\n") + "\n");
console.log(`brand/social/posts.csv  ${rows.length} posts`);
