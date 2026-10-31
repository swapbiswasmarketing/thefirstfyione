/* Content helpers shared by every template. One comparator, one word count and
   one link graph, so the front page, the archive, the department pages, the
   entries and the feed always agree with each other. */
import { getCollection, type CollectionEntry } from "astro:content";

export type Entry = CollectionEntry<"blog">;

/* Numeric part of the filecode: "FYI-121" -> 121. */
export const fileNo = (p: Entry) => Number(String(p.data.filecode ?? "").replace(/[^0-9]/g, "")) || 0;

/* Filed order. Newest pubDate first; inside one date the higher filecode was
   filed later; the slug settles anything left, so every platform agrees. Most
   entries share a pubDate with others, so a date-only sort lets the loader's
   order leak through and Vercel and Windows disagree. */
export const byFiled = (a: Entry, b: Entry) =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf() ||
  fileNo(b) - fileNo(a) ||
  (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

/* Scheduled publishing. An entry dated after the build is a draft waiting for
   its day: it is left out of every page, feed, card, sitemap and search index
   until a build runs on or after that date (.github/workflows/daily-publish.yml
   rebuilds production on each day an entry is due). pubDate is UTC midnight, so
   an entry dated today is published by any build today, and its pubDate is the
   true day it went live. */
/* Set once by astro.config.mjs for the whole build; the fallback covers tools
   that load this module without the config. */
const BUILD_TIME = Number(process.env.STRICTLY_BUILD_TIME) || Date.now();
export const isPublished = (p: Entry) => p.data.pubDate.valueOf() <= BUILD_TIME;

export async function getEntries(): Promise<Entry[]> {
  return (await getCollection("blog")).filter(isPublished).sort(byFiled);
}

export const entryHref = (p: Entry) => `/blog/${p.id}/`;

/* Markdown to plain text for teasers and pull-quotes. */
export const stripMd = (s: string) =>
  s
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/* Words a reader actually reads: link text but not link URLs, table cells but
   not table rules, no markdown punctuation. */
export function wordCount(body = ""): number {
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^\s*\|?\s*:?-{3,}.*$/gm, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/[|*_`#>]/g, " ");
  return (text.match(/[A-Za-z0-9][A-Za-z0-9'.,-]*/g) ?? []).length;
}

/* Computed, never typed: a hand-entered reading time drifts from the text. */
export const readingMinutes = (p: Entry) => Math.max(1, Math.round(wordCount(p.body ?? "") / 220));
export const readingLabel = (p: Entry) => `${readingMinutes(p)} min read`;

/* The entry's single pull-quote, as plain text. */
export function pullQuote(p: Entry): string | null {
  const m = (p.body ?? "").match(/^>\s?(.+)$/m);
  return m ? stripMd(m[1]) : null;
}

/* The opening paragraph of the body, skipping headings, quotes, lists and tables. */
export function openingParagraph(p: Entry): string {
  const block = (p.body ?? "")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .find((b) => b.length > 0 && !/^[#>|\-*]/.test(b));
  return block ? stripMd(block) : "";
}

export function deptCounts(entries: Entry[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of entries) counts[p.data.category] = (counts[p.data.category] ?? 0) + 1;
  return counts;
}

const ROMAN: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];
export function toRoman(n: number): string {
  let out = "";
  for (const [v, s] of ROMAN) while (n >= v) { out += s; n -= v; }
  return out || "I";
}

/* The volume and the latest filing date, derived from the archive itself, never
   typed: the volume counts calendar years since the first entry. Pass entries in
   filed order. (The edition number and per-edition counts are gone: printed on
   the front page, they advertised batch publishing.) */
export function edition(entries: Entry[]) {
  const days = [...new Set(entries.map((p) => p.data.pubDate.valueOf()))].sort((a, b) => a - b);
  const latestDay = days[days.length - 1] ?? 0;
  const latest = new Date(latestDay);
  const first = new Date(days[0] ?? 0);
  return {
    vol: toRoman(latest.getUTCFullYear() - first.getUTCFullYear() + 1),
    latest,
    onFile: entries.length,
  };
}

/* ---------------------------------------------------------------------------
   The link graph. Entries cite each other inline, and those citations are the
   best signal of what belongs together.
   --------------------------------------------------------------------------- */
const LINK_RE = /\]\(\/blog\/([a-z0-9-]+)\/?(?:#[^)\s]*)?\)/g;

export function outLinks(p: Entry): Set<string> {
  return new Set([...(p.body ?? "").matchAll(LINK_RE)].map((m) => m[1]).filter((id) => id !== p.id));
}

/* Function words plus the generic title words this corpus repeats everywhere. */
const STOP = new Set(
  (
    "about actually after all also alway always and answer are back because before began call called came carry " +
    "cant come could cut did didnt different does doesnt dont each even ever every famous first five four from " +
    "get gets got had hand has have here how into isnt its itself just kind later like made make makes many means more most " +
    "mostly much name never new not number off once one only other over own part pick picks real really reason " +
    "reasons recorded said same since some start started still story than that the their them then there these " +
    "they this those three time too top true two until very was way were what when where which while who why " +
    "will with word work would year years yes you your add"
  ).split(" ")
);
const norm = (w: string) =>
  w.toLowerCase().replace(/[^a-z0-9]/g, "").replace(/ies$/, "y").replace(/([^s])s$/, "$1");

export interface Related {
  entry: Entry;
  score: number;
  reason: "cites-this" | "linked" | "co-cited" | "dept" | "terms" | "filed";
}

/* Scores every pair once and returns up to n next reads for each entry.
   A candidate qualifies only on a topical signal: a link either way, a shared
   citation, a core slug word in common, or two title words in common. Same
   department alone never qualifies. Weights: same department +3; the candidate
   links to this entry +4; this entry links to the candidate +2; +1.5 per entry
   both of them cite; +1 per entry that cites both; +2 per shared slug word and
   +1 per shared title word; plus the summed rarity (idf) of shared title, dek
   and slug terms. Ties fall back to filed order. An entry with no qualifying
   candidate gets no See also block. If every pick shares the department and a
   cross-department candidate scores 4 or more, it takes the last slot.
   O(n^2): call it once per build, from getStaticPaths. */
export function buildRelated(entries: Entry[], n = 3): Map<string, Related[]> {
  const N = entries.length;
  const out = new Map(entries.map((p) => [p.id, outLinks(p)]));
  const inn = new Map<string, Set<string>>(entries.map((p) => [p.id, new Set<string>()]));
  for (const p of entries) for (const t of out.get(p.id)!) inn.get(t)?.add(p.id);

  const terms = new Map(
    entries.map((p) => {
      const words = `${p.data.title} ${p.data.description} ${p.id.replace(/-/g, " ")}`
        .split(/\s+/)
        .map(norm)
        /* Bare numbers are left out: two entries that both mention 1996 are not
           about the same thing. */
        .filter((w) => w.length >= 4 && !STOP.has(w) && !/^\d+$/.test(w));
      return [p.id, new Set(words)];
    })
  );
  const df = new Map<string, number>();
  for (const set of terms.values()) for (const t of set) df.set(t, (df.get(t) ?? 0) + 1);
  const dfCap = Math.max(6, Math.round(N * 0.05));
  /* Relatedness is decided on topic words; the full term score above only ranks
     the candidates that pass. The slug holds the question's core words ("cats",
     "reproduce", "brain"), so one shared slug word is a strong signal; title
     words are looser ("queen" can appear in two unrelated titles), so they need
     two in common. Descriptions add filler ("around", "often") and are left out.
     The question forms titles share ("When was X invented?", "Why is it called
     X?") name a genre, not a topic, and three-letter words count, since "cat",
     "bee" and "eel" are topics. */
  const FORM = new Set(["invented", "called", "mean", "come", "stand", "made", "work", "name", "really", "actually", "happen", "exactly", "first", "need", "happened"]);
  const topicWords = (s: string) =>
    new Set(s.split(/\s+/).map(norm).filter((w) => w.length >= 3 && !STOP.has(w) && !FORM.has(w) && !/^\d+$/.test(w)));
  const slugTerms = new Map(entries.map((p) => [p.id, topicWords(p.id.replace(/-/g, " "))]));
  const titleTerms = new Map(entries.map((p) => [p.id, topicWords(p.data.title)]));
  /* Counted over titles and slugs only, with a looser cap, so a real cluster
     such as the five cat entries still links up. */
  const topicDf = new Map<string, number>();
  for (const p of entries) {
    for (const t of new Set([...slugTerms.get(p.id)!, ...titleTerms.get(p.id)!])) topicDf.set(t, (topicDf.get(t) ?? 0) + 1);
  }
  const topicCap = Math.max(8, Math.round(N * 0.1));
  const sharedIn = (a: Set<string>, b: Set<string>) => {
    let n = 0;
    for (const t of a) {
      const d = topicDf.get(t) ?? 0;
      if (d >= 2 && d <= topicCap && b.has(t)) n++;
    }
    return n;
  };

  const order = new Map(entries.slice().sort(byFiled).map((p, i) => [p.id, i]));
  const result = new Map<string, Related[]>();

  for (const a of entries) {
    const aOut = out.get(a.id)!;
    const aIn = inn.get(a.id)!;
    const aTerms = terms.get(a.id)!;
    const scored: Related[] = [];
    for (const b of entries) {
      if (b.id === a.id) continue;
      const bOut = out.get(b.id)!;
      const bIn = inn.get(b.id)!;
      let s = 0;
      const parts: [Related["reason"], number][] = [];
      if (a.data.category === b.data.category) { s += 3; parts.push(["dept", 3]); }
      if (bOut.has(a.id)) { s += 4; parts.push(["cites-this", 4]); }
      if (aOut.has(b.id)) { s += 2; parts.push(["linked", 2]); }
      let cc = 0;
      for (const t of aOut) if (bOut.has(t)) cc++;
      let cb = 0;
      for (const t of aIn) if (bIn.has(t)) cb++;
      if (cc || cb) { s += 1.5 * cc + cb; parts.push(["co-cited", 1.5 * cc + cb]); }
      let ts = 0;
      for (const t of aTerms) {
        const d = df.get(t) ?? 0;
        if (d >= 2 && d <= dfCap && terms.get(b.id)!.has(t)) ts += Math.log(N / d);
      }
      if (ts) { s += ts; parts.push(["terms", ts]); }
      const sharedSlug = sharedIn(slugTerms.get(a.id)!, slugTerms.get(b.id)!);
      const sharedTitle = sharedIn(titleTerms.get(a.id)!, titleTerms.get(b.id)!);
      if (sharedSlug || sharedTitle) { s += 2 * sharedSlug + sharedTitle; parts.push(["terms", 2 * sharedSlug + sharedTitle + ts]); }
      /* Sharing a department is not enough on its own: a pick needs a real
         topical signal (a link between the two entries, a core slug word in
         common, or two title words in common) plus a minimum score. A page then
         shows fewer picks, or none, rather than filler that reads as random. */
      const topical = sharedSlug > 0 || sharedTitle >= 2 || cc > 0 || cb > 0 || bOut.has(a.id) || aOut.has(b.id);
      if (!topical || s < 3.5) continue;
      const reason = parts.length ? parts.sort((x, y) => y[1] - x[1])[0][0] : "filed";
      scored.push({ entry: b, score: s, reason });
    }
    scored.sort((x, y) => y.score - x.score || order.get(x.entry.id)! - order.get(y.entry.id)!);
    const pick = scored.slice(0, n);
    if (pick.length === n && pick.every((r) => r.entry.data.category === a.data.category)) {
      const cross = scored.find((r) => r.entry.data.category !== a.data.category && r.score >= 4);
      if (cross) pick[n - 1] = cross;
    }
    result.set(a.id, pick);
  }
  return result;
}

/* Neighbours inside one department, in filed order. */
export function deptNeighbours(p: Entry, entries: Entry[]) {
  const list = entries.filter((e) => e.data.category === p.data.category).sort(byFiled);
  const i = list.findIndex((e) => e.id === p.id);
  return { newer: i > 0 ? list[i - 1] : undefined, older: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined };
}
