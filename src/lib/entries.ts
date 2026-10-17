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

export async function getEntries(): Promise<Entry[]> {
  return (await getCollection("blog")).sort(byFiled);
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

/* Almost every title is a question. The interrogative is its natural index. */
export const ASK_WORDS = ["why", "what", "how", "where", "when"] as const;
export type AskWord = (typeof ASK_WORDS)[number] | "other";
export function askWord(title: string): AskWord {
  const w = title.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  return (ASK_WORDS as readonly string[]).includes(w) ? (w as AskWord) : "other";
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

/* The edition is derived from the archive itself, never typed: each distinct
   filing date is one number, and the volume counts calendar years since the
   first entry. Pass entries in filed order. */
export function edition(entries: Entry[]) {
  const days = [...new Set(entries.map((p) => p.data.pubDate.valueOf()))].sort((a, b) => a - b);
  const latestDay = days[days.length - 1] ?? 0;
  const latest = new Date(latestDay);
  const first = new Date(days[0] ?? 0);
  return {
    no: days.length,
    vol: toRoman(latest.getUTCFullYear() - first.getUTCFullYear() + 1),
    latest,
    inEdition: entries.filter((p) => p.data.pubDate.valueOf() === latestDay).length,
    onFile: entries.length,
    questions: entries.reduce((n, p) => n + (p.data.faqs?.length ?? 0), 0),
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

export function inboundCounts(entries: Entry[]): Map<string, number> {
  const ids = new Set(entries.map((p) => p.id));
  const counts = new Map<string, number>(entries.map((p) => [p.id, 0]));
  for (const p of entries) for (const t of outLinks(p)) if (ids.has(t)) counts.set(t, (counts.get(t) ?? 0) + 1);
  return counts;
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

/* Scores every pair once and returns the n best next reads for each entry.
   Weights: same department +3; the candidate links to this entry +4; this
   entry links to the candidate +2; +1.5 per entry both of them cite; +1 per
   entry that cites both; plus the summed rarity (idf) of shared title, dek
   and slug terms. Ties fall back to filed order. If every pick shares the
   department and a linked cross-department candidate exists, it takes the
   last slot. O(n^2): call it once per build, from getStaticPaths. */
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
        .filter((w) => w.length >= 4 && !STOP.has(w));
      return [p.id, new Set(words)];
    })
  );
  const df = new Map<string, number>();
  for (const set of terms.values()) for (const t of set) df.set(t, (df.get(t) ?? 0) + 1);
  const dfCap = Math.max(6, Math.round(N * 0.05));

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
