/* Social cards. Every shareable page gets a 1200x630 PNG drawn at build time
   by the endpoints in src/pages/og/, in the Broadsheet Ledger style. This
   module only names and describes the files, with no satori in it, so the
   Layout and the pages stay light; the drawing lives in src/lib/og/.

   The ?v= query is a hash of everything the card prints plus CARD_DESIGN.
   Platforms cache link previews by image URL, so a retitled entry or a new
   design needs a new URL before it shows up. A static host ignores the query
   when it serves the file, so there is still one file per card. */
import { createHash } from "node:crypto";
import { catLabel, fmtDate } from "../data/site";
import { getEntries, edition, deptCounts, readingLabel, type Entry } from "./entries";
import { CARD_DESIGN, PAGE_KEYS, entrySpec, pageSpec, type CardSpec, type Summary } from "./og/spec";

export interface Card {
  url: string; /* site-relative path, e.g. /og/why-honey-never-spoils.png?v=abc123 */
  alt: string;
  width: number;
  height: number;
  type: string; /* MIME type, e.g. image/png */
}

export type PageCardKey = "home" | "archive" | "about" | "topics" | "search" | "privacy" | "notfound" | `topic-${string}`;

const FILE = { width: 1200, height: 630, type: "image/png" };

/* The archive as the page cards print it: edition, totals, department counts.
   Read once, at module level, because pageCard() is synchronous (the Layout
   calls it for its default card). */
const all = await getEntries();
const ed = edition(all);
const summary: Summary = {
  vol: ed.vol,
  no: ed.no,
  latest: fmtDate(ed.latest),
  onFile: ed.onFile,
  counts: deptCounts(all),
};

const version = (spec: CardSpec) =>
  createHash("sha1").update(JSON.stringify([CARD_DESIGN, spec])).digest("hex").slice(0, 8);

/* Keys that have a card file. Anything else gets the front-page card rather
   than a URL that would 404. */
export const pageKeys: string[] = PAGE_KEYS;
const known = (key: string) => (PAGE_KEYS.includes(key) ? key : "home");

/* What the card for an entry prints. The og endpoint draws exactly this. */
export const entrySpecFor = (entry: Entry) =>
  entrySpec({
    title: entry.data.title,
    filecode: entry.data.filecode,
    dept: catLabel[entry.data.category] ?? "Curiosity",
    reading: readingLabel(entry),
  });

export const pageSpecFor = (key: string) => pageSpec(known(key), summary);

export function entryCard(entry: Entry): Card {
  return {
    url: `/og/${entry.id}.png?v=${version(entrySpecFor(entry))}`,
    alt: `Strictly FYI card: ${entry.data.title}`,
    ...FILE,
  };
}

export function pageCard(key: PageCardKey): Card {
  const k = known(key);
  const spec = pageSpec(k, summary);
  const alt =
    spec.kind === "front"
      ? "Strictly FYI card: the STRICTLY FYI nameplate above the line A field guide to the fascinating"
      : `Strictly FYI card: ${spec.title}${spec.note ? ` - ${spec.note}` : ""}`;
  return { url: `/og/page/${k}.png?v=${version(spec)}`, alt, ...FILE };
}
