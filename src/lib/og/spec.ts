/* Card specs: every word a social card prints, as plain data. src/lib/og.ts
   hashes a spec into the card URL's ?v= version and the og endpoints draw the
   same spec, so the URL changes exactly when the drawn card does. Pure on
   purpose (no satori, no astro:content), so scripts/make-icons.mjs can use it. */
import { cats } from "../../data/site.ts";

/* Bump on any visual change to src/lib/og/cards.ts or engine.ts. It is part
   of every card's version hash: platforms cache previews by image URL and only
   fetch a new design from a new URL. */
export const CARD_DESIGN = 1;

/* Built from char codes so the source stays ASCII; the fonts have both glyphs. */
export const DOT = String.fromCharCode(0xb7); /* middle dot */
export const SECT = String.fromCharCode(0xa7); /* section sign */

/* A framed card: nameplate, thick-thin rule, kicker, headline, footer. */
export interface FrameSpec {
  kind: "frame";
  kicker: string;
  title: string;
  /* Largest headline size in px; the fitter balances the lines and shrinks from here. */
  maxSize: number;
  note?: string;
  /* Beside the nameplate. Defaults to the tagline. */
  ear?: string;
  /* Right side of the footer, beside the domain. May be empty. */
  foot: string;
}

/* The front page: dateline, the nameplate at full width, the tagline. */
export interface FrontSpec {
  kind: "front";
  /* Spread across the top rule, first part flush left, last flush right. */
  dateline: string[];
  tagline: string;
}

export type CardSpec = FrameSpec | FrontSpec;

/* The archive as the cards print it. Built once per build in src/lib/og.ts. */
export interface Summary {
  vol: string;
  latest: string;
  onFile: number;
  counts: Record<string, number>;
}

const entries = (n: number) => `${n} ${n === 1 ? "entry" : "entries"}`;

export function entrySpec(e: { title: string; filecode?: string; dept: string; reading: string }): FrameSpec {
  return {
    kind: "frame",
    kicker: `${e.filecode || "FYI"} ${DOT} ${e.dept}`.toUpperCase(),
    title: e.title,
    maxSize: 88,
    foot: e.reading.toUpperCase(),
  };
}

export const PAGE_KEYS: string[] = [
  "home",
  "archive",
  "about",
  "topics",
  "search",
  "privacy",
  "notfound",
  "standards",
  "contact",
  "terms",
  "corrections",
  ...cats.map((c) => `topic-${c.key}`),
];

const TAGLINE = "A field guide to the fascinating.";

export function pageSpec(key: string, s: Summary): CardSpec {
  const onFile = `${entries(s.onFile)} on file`.toUpperCase();
  const frame = (kicker: string, title: string, foot: string, maxSize = 112, note?: string): FrameSpec => ({
    kind: "frame",
    kicker: kicker.toUpperCase(),
    title,
    maxSize,
    ...(note ? { note } : {}),
    foot: foot.toUpperCase(),
  });

  if (key.startsWith("topic-")) {
    const c = cats.find((d) => `topic-${d.key}` === key);
    if (c) return frame(`${SECT}${c.n} ${DOT} Department`, c.name, `${entries(s.counts[c.key] ?? 0)} on file`, 156, c.note);
  }
  switch (key) {
    case "archive":
      return frame("The archive", "Everything worth knowing.", onFile);
    case "about":
      /* The headline is the tagline here, so the ear and footer carry the rest. */
      return {
        ...frame("About the publication", TAGLINE, cats.map((c) => c.name).join(` ${DOT} `)),
        ear: "EST. MMXXVI",
      };
    case "topics": {
      const names = cats.map((c) => c.name);
      const list = `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}.`;
      return frame("The departments", list, `${cats.length} departments ${DOT} ${entries(s.onFile)}`, 88);
    }
    case "search":
      return frame("Search", "Find it in the archive.", onFile);
    case "privacy":
      return frame("Privacy notice", "What is collected, and why.", "", 104);
    case "notfound":
      return frame(`Error 404 ${DOT} Not on file`, "This one is not in the archive.", "", 96);
    case "standards":
      return frame("Editorial standards", "How every entry is checked.", "Sources, fact-checks, AI and corrections", 96);
    case "contact":
      return frame("Contact", "Write to Strictly FYI.", "Corrections, questions and privacy requests", 104);
    case "terms":
      return frame("The fine print", "Terms of use.", "", 112);
    case "corrections":
      return frame("Corrections", "What we got wrong, and fixed.", "", 96);
    default:
      return {
        kind: "front",
        dateline: [`Vol. ${s.vol}`, `Last filed ${s.latest}`, onFile].map((p) => p.toUpperCase()),
        tagline: TAGLINE,
      };
  }
}

/* public/og.png, the generic card older shares still point at. It is a static
   file, regenerated only by hand, so it prints nothing that goes stale: no
   counts, no edition, just the departments. */
export function fallbackSpec(): FrontSpec {
  return { kind: "front", dateline: cats.map((c) => c.name.toUpperCase()), tagline: TAGLINE };
}
