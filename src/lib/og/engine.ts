/* Card engine: the brand fonts, text measuring, headline fitting and the
   satori -> resvg pipeline. Build-time only. The og endpoints and
   scripts/make-icons.mjs import it; the Layout and the pages never do, they
   only need the URLs from src/lib/og.ts.

   Relative imports carry their .ts extension so Node (23.6+) can run
   scripts/make-icons.mjs against this file directly, without Astro. */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import satori from "satori";
import { renderAsync } from "@resvg/resvg-js";

/* Tokens from src/styles/global.css. Satori cannot read CSS variables, so
   these are copies: change them together. */
export const C = {
  paper: "#f6f3ec",
  ink: "#16171b",
  inkSoft: "#4a4b53",
  inkFaint: "#6b6c75",
  hl: "#ffe14d",
} as const;

export type Family = "Playfair Display" | "Newsreader" | "Space Mono";
export type Weight = 400 | 700 | 900;

/* The site's own faces, from @fontsource as .woff: satori 0.19 reads TTF, OTF
   and WOFF but not WOFF2. Resolved from the project root, because after an
   Astro build import.meta.url points into the bundled chunk folder. Read once:
   satori caches the parsed fonts per array, so the same array is reused for
   every card. */
const FACES: [Family, Weight, "normal" | "italic", string][] = [
  ["Playfair Display", 700, "normal", "playfair-display/files/playfair-display-latin-700-normal.woff"],
  ["Playfair Display", 900, "normal", "playfair-display/files/playfair-display-latin-900-normal.woff"],
  ["Newsreader", 400, "italic", "newsreader/files/newsreader-latin-400-italic.woff"],
  ["Space Mono", 400, "normal", "space-mono/files/space-mono-latin-400-normal.woff"],
  ["Space Mono", 700, "normal", "space-mono/files/space-mono-latin-700-normal.woff"],
];
type LoadedFont = { name: string; data: Buffer; weight: Weight; style: "normal" | "italic" };
let loaded: LoadedFont[] | undefined;
function fonts(): LoadedFont[] {
  if (!loaded) {
    const req = createRequire(path.join(process.cwd(), "package.json"));
    loaded = FACES.map(([name, weight, style, file]) => ({
      name,
      weight,
      style,
      data: fs.readFileSync(req.resolve(`@fontsource/${file}`)),
    }));
  }
  return loaded;
}

/* Vertical metrics (hhea, in em) of those faces. Satori sets a line the way
   CSS does, baseline at the ascent plus half the leading, so the highlighter
   band and baseline alignment can be placed from these numbers alone. */
const METRICS: Record<Family, { asc: number; desc: number; cap: number }> = {
  "Playfair Display": { asc: 1.082, desc: 0.251, cap: 0.708 },
  Newsreader: { asc: 0.735, desc: 0.265, cap: 0.67 },
  "Space Mono": { asc: 1.12, desc: 0.361, cap: 0.7 },
};
/* Baseline position from the top of a line box, the room under it, and the
   empty space above capitals, all in em. */
export const baselineAt = (f: Family, lh: number) => (lh + METRICS[f].asc - METRICS[f].desc) / 2;
export const belowBaseline = (f: Family, lh: number) => lh - baselineAt(f, lh);
export const aboveCaps = (f: Family, lh: number) => baselineAt(f, lh) - METRICS[f].cap;

/* A plain element tree, the shape satori takes in place of JSX. Satori wants
   display:flex on any div with more than one child. */
type Style = Record<string, string | number>;
export interface El {
  type: string;
  key?: number;
  props: { style?: Style; children?: El | string | (El | string)[] };
}
export const h = (type: string, style: Style, ...children: (El | string)[]): El => ({
  type,
  props: { style, children: children.length === 0 ? undefined : children.length === 1 ? children[0] : children },
});

export interface Face {
  family: Family;
  weight: Weight;
  italic?: boolean;
  /* letter-spacing, em */
  tracking: number;
}
export const faceStyle = (f: Face): Style => ({
  fontFamily: f.family,
  fontWeight: f.weight,
  fontStyle: f.italic ? "italic" : "normal",
  letterSpacing: `${f.tracking}em`,
});

/* Text widths come from satori itself: one throwaway layout of the strings,
   read back through onNodeDetected. That is the same engine that draws the
   card, kerning and tracking included, so a fitted line never wraps on its
   own. Widths scale linearly with size, so one measurement per string serves
   every size; the cache spans all cards in a build. */
const REF = 200;
const widths = new Map<string, number>();
export async function measure(texts: string[], face: Face): Promise<number[]> {
  const id = (t: string) => `${face.family}/${face.weight}/${face.italic ? 1 : 0}/${face.tracking}/${t}`;
  const todo = [...new Set(texts)].filter((t) => !widths.has(id(t)));
  if (todo.length) {
    const got = new Map<number, number>();
    const spans: El[] = todo.map((t, i) => ({ type: "span", key: i, props: { style: { whiteSpace: "pre" }, children: t } }));
    await satori(
      h("div", { display: "flex", flexDirection: "column", alignItems: "flex-start", fontSize: REF, lineHeight: 1, ...faceStyle(face) }, ...spans) as never,
      {
        width: 40 * REF,
        height: Math.ceil(REF * 1.2 * todo.length) + REF,
        fonts: fonts(),
        onNodeDetected: (n) => {
          if (n.type === "span" && typeof n.key === "number") got.set(n.key, n.width);
        },
      }
    );
    todo.forEach((t, i) => widths.set(id(t), (got.get(i) ?? 0) / REF));
  }
  return texts.map((t) => widths.get(id(t)) ?? 0);
}

/* Words a line should not end on in a headline. */
const WEAK = new Set(
  "a an the of for to in on at by and or but nor with from as into onto than its their his her your our my".split(" ")
);

export interface Fit {
  size: number;
  lines: string[];
  /* One word space plus tracking, em: the gap before a separately drawn word. */
  space: number;
}

/* Sets a headline the way a sub-editor would: the largest size that fits, the
   lines balanced, and a break after a question mark or a dash preferred, since
   most titles here are "Question? Answer". Every split is scored by the size it
   allows times its quality, and sizes under minSize are marked down. One or two
   lines is the rule; a third line is tried only when two would set the
   headline under minSize + 8px, and taken only if it scores better, which in
   practice means a long question set over two lines with its answer on the
   third. tail reserves room (em) after the last word for the highlighter. */
export async function fitText(
  text: string,
  face: Face,
  o: { width: number; height: number; lineHeight: number; maxSize: number; minSize: number; maxLines: number; tail?: number }
): Promise<Fit> {
  const words = text.trim().split(/\s+/);
  const n = words.length;
  const [x, xx, ...ws] = await measure(["x", "x x", ...words], face);
  const space = xx - 2 * x;
  const pre = [0];
  for (const w of ws) pre.push(pre[pre.length - 1] + w);
  const lineW = (i: number, j: number) => pre[j] - pre[i] + (j - i - 1) * space;

  let best: { score: number; size: number; ends: number[] } | undefined;
  const consider = (ends: number[]) => {
    const L = ends.length;
    let start = 0;
    let maxW = 0;
    let minW = Infinity;
    let q = 1;
    for (let li = 0; li < L; li++) {
      const end = ends[li];
      const w = lineW(start, end) + (li === L - 1 ? o.tail ?? 0 : 0);
      maxW = Math.max(maxW, w);
      minW = Math.min(minW, w);
      if (end < n) {
        const last = words[end - 1];
        if (words[end] === "-") q = 0;
        if (/[?:;!]$/.test(last) || last === "-") q *= 1.2;
        else if (/,$/.test(last)) q *= 1.05;
        if (WEAK.has(last.toLowerCase())) q *= 0.8;
        /* A question cut in two, leaving its tail ("Mean?") to open the next line. */
        const next = words.slice(end, ends[li + 1]);
        const ask = next.findIndex((t) => /\?$/.test(t));
        if (ask >= 0 && ask < next.length - 1) q *= 0.92;
      }
      start = end;
    }
    if (L > 1 && n >= 4 && ends[L - 1] - ends[L - 2] === 1) q *= 0.85;
    if (L > 2) q *= 0.92;
    q *= 0.9 + 0.1 * (minW / maxW);
    let size = Math.min(o.maxSize, o.width / maxW, o.height / (L * o.lineHeight));
    size = Math.max(36, Math.floor(size / 2) * 2);
    if (size < o.minSize) q *= 0.7;
    /* Past about 72px (24px in a 400px-wide preview) more size buys little
       legibility, so it counts for less than a clean break does. */
    const score = (size <= 72 ? size : 72 + (size - 72) * 0.3) * q;
    if (!best || score > best.score + 1e-9) best = { score, size, ends };
  };
  const walk = (from: number, left: number, acc: number[]) => {
    if (left === 0) return consider([...acc, n]);
    for (let b = from; b <= n - left; b++) walk(b + 1, left - 1, [...acc, b]);
  };
  for (let L = 1; L <= Math.min(o.maxLines, n, 2); L++) walk(1, L - 1, []);
  if (best!.size < o.minSize + 8) for (let L = 3; L <= Math.min(o.maxLines, n); L++) walk(1, L - 1, []);

  const { size, ends } = best!;
  const lines: string[] = [];
  let start = 0;
  for (const end of ends) {
    lines.push(words.slice(start, end).join(" "));
    start = end;
  }
  return { size, lines, space };
}

/* The highlighter, as the site draws it: a band behind the lower part of the
   letters. global.css paints it with a gradient over the inline box (52-90%
   on headings, 54-92% on the nameplate); satori has no inline boxes, so the
   band is a positioned block at the same distance from the baseline. up and
   down are em above and below the baseline, pad the overhang at each side. */
export const BAND_HEAD = { up: 0.389, down: 0.118, pad: 0.04 };
export const BAND_PLATE = { up: 0.362, down: 0.144, pad: 0.05 };
export function marked(text: string, size: number, family: Family, lh: number, band: typeof BAND_HEAD, style: Style = {}): El {
  const base = baselineAt(family, lh) * size;
  return h(
    "div",
    { display: "flex", position: "relative", ...style },
    h("div", {
      position: "absolute",
      left: -band.pad * size,
      right: -band.pad * size,
      top: base - band.up * size,
      height: (band.up + band.down) * size,
      backgroundColor: C.hl,
    }),
    h("div", { display: "flex", whiteSpace: "pre" }, text)
  );
}

export const toSvg = (node: El, width: number, height: number) => satori(node as never, { width, height, fonts: fonts() });

/* Text is already outlined by satori, so resvg gets no fonts at all:
   loadSystemFonts:false cut a card from about 130 ms to 17 ms on Windows. The
   async render runs off the main thread and yields between cards, which keeps
   the native pixmaps from piling up in a long build. */
export async function toPng(node: El, width: number, height: number): Promise<Uint8Array<ArrayBuffer>> {
  const svg = await toSvg(node, width, height);
  const img = await renderAsync(svg, { font: { loadSystemFonts: false } });
  return new Uint8Array(img.asPng());
}
