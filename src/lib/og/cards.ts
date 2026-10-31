/* The card designs, in Broadsheet Ledger: paper ground, the STRICTLY FYI
   nameplate with FYI on the highlighter, a thick-thin rule, a mono kicker and
   a Playfair headline. No dek: at a 400px thumbnail it shrinks to unreadable
   grey, and every platform prints og:description under the image anyway.
   Everything printed comes from a spec (./spec.ts); bump CARD_DESIGN there on
   any visual change here, so cached previews refresh. */
import { C, BAND_HEAD, BAND_PLATE, aboveCaps, belowBaseline, faceStyle, fitText, h, marked, measure, toPng, toSvg } from "./engine.ts";
import type { El, Face, Fit } from "./engine.ts";
import type { CardSpec, FrameSpec, FrontSpec } from "./spec.ts";

export const CARD_W = 1200;
export const CARD_H = 630;
const PAD = { top: 52, x: 64, bottom: 44 };
const INNER = CARD_W - 2 * PAD.x;

const PLATE: Face = { family: "Playfair Display", weight: 900, tracking: -0.03 };
const HEAD: Face = { family: "Playfair Display", weight: 700, tracking: -0.02 };
const KICK: Face = { family: "Space Mono", weight: 400, tracking: 0.12 };
const LABEL: Face = { family: "Space Mono", weight: 400, tracking: 0.14 };
const DOMAIN: Face = { family: "Space Mono", weight: 700, tracking: 0.02 };
const NOTE: Face = { family: "Newsreader", weight: 400, italic: true, tracking: 0 };

const text = (face: Face, size: number, color: string, s: string, style: Record<string, string | number> = {}) =>
  h("div", { display: "flex", whiteSpace: "pre", fontSize: size, lineHeight: 1, color, ...faceStyle(face), ...style }, s);

/* .rule-thickthin: 3px ink, 4px of paper, 1px ink, scaled by k where the mark
   is shown small. */
const thickThin = (style: Record<string, string | number> = {}, k = 1) =>
  h(
    "div",
    { display: "flex", flexDirection: "column", ...style },
    h("div", { height: 3 * k, backgroundColor: C.ink }),
    h("div", { height: 4 * k }),
    h("div", { height: 1 * k, backgroundColor: C.ink })
  );

/* STRICTLY FYI, always the full lockup. The gap is a measured word space plus
   the band's padding, as the running head's .rh-fyi span sets it. */
async function nameplate(size: number): Promise<El> {
  const [x, xx] = await measure(["x", "x x"], PLATE);
  return h(
    "div",
    { display: "flex", fontSize: size, lineHeight: 1, color: C.ink, ...faceStyle(PLATE) },
    h("div", { display: "flex", whiteSpace: "pre" }, "STRICTLY"),
    marked("FYI", size, PLATE.family, 1, BAND_PLATE, { marginLeft: (xx - 2 * x + BAND_PLATE.pad) * size })
  );
}

/* Width of the lockup in em, band overhang included. */
async function nameplateEm(): Promise<number> {
  const [s, f, x, xx] = await measure(["STRICTLY", "FYI", "x", "x x"], PLATE);
  return s + (xx - 2 * x) + f + 2 * BAND_PLATE.pad;
}

/* Last word on the highlighter, as the site's headings carry it; trailing
   punctuation stays off the band, as in "Everything worth knowing." A bare
   "It" or "So" says nothing on its own, so the band takes the word before it
   too. A phrase that opens its line is nudged in by the band's padding, the
   way the CSS padding does it, so the band sits on the column edge instead of
   in the margin. */
const SHORT_END = /^(it|so|do|is|to|up|on|in|of|as|us|me|be|by|at|or|no|he|we)$/i;
function headline(fit: Fit, lh: number): El {
  const lastLine = fit.lines.length - 1;
  return h(
    "div",
    { display: "flex", flexDirection: "column", fontSize: fit.size, lineHeight: lh, color: C.ink, ...faceStyle(HEAD) },
    ...fit.lines.map((line, i) => {
      if (i < lastLine) return h("div", { display: "flex", whiteSpace: "pre" }, line);
      const words = line.split(" ");
      const end = (words[words.length - 1] ?? "").replace(/[.,:;?!]+$/, "");
      const last = words.splice(words.length - (words.length > 1 && SHORT_END.test(end) ? 2 : 1)).join(" ");
      const [, core, punct] = last.match(/^(.*?[^.,:;?!])([.,:;?!]*)$/) ?? [last, last, ""];
      const kids: El[] = [];
      if (words.length) kids.push(h("div", { display: "flex", whiteSpace: "pre" }, words.join(" ")));
      const lead = words.length ? fit.space * fit.size : BAND_HEAD.pad * fit.size;
      kids.push(marked(core, fit.size, HEAD.family, lh, BAND_HEAD, { marginLeft: lead }));
      if (punct) kids.push(h("div", { display: "flex", whiteSpace: "pre" }, punct));
      return h("div", { display: "flex" }, ...kids);
    })
  );
}

const PLATE_SIZE = 58;
const EAR_SIZE = 17;

async function frame(spec: FrameSpec): Promise<El> {
  const lh = 1.04;
  const noteH = spec.note ? 74 : 0;
  const fit = await fitText(spec.title, HEAD, {
    width: INNER,
    height: 300 - noteH,
    lineHeight: lh,
    maxSize: spec.maxSize,
    minSize: 60,
    maxLines: 3,
    tail: 2 * BAND_HEAD.pad,
  });
  /* Line the ear's baseline up with the nameplate's. */
  const earLift = belowBaseline(PLATE.family, 1) * PLATE_SIZE - belowBaseline(LABEL.family, 1) * EAR_SIZE;

  return h(
    "div",
    {
      width: CARD_W,
      height: CARD_H,
      display: "flex",
      flexDirection: "column",
      backgroundColor: C.paper,
      padding: `${PAD.top}px ${PAD.x}px ${PAD.bottom}px`,
      color: C.ink,
    },
    h(
      "div",
      { display: "flex", justifyContent: "space-between", alignItems: "flex-end" },
      await nameplate(PLATE_SIZE),
      text(LABEL, EAR_SIZE, C.inkSoft, spec.ear ?? "A FIELD GUIDE TO THE FASCINATING", { paddingBottom: earLift })
    ),
    thickThin({ marginTop: 16 }),
    h(
      "div",
      { display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" },
      text(KICK, 22, C.inkSoft, spec.kicker, { marginBottom: 26 }),
      headline(fit, lh),
      ...(spec.note ? [text(NOTE, 40, C.inkSoft, spec.note, { marginTop: 22, lineHeight: 1.2 })] : [])
    ),
    h(
      "div",
      { display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: `1px solid ${C.ink}`, paddingTop: 14 },
      text(DOMAIN, 21, C.ink, "strictly.fyi"),
      text(LABEL, EAR_SIZE, C.inkFaint, spec.foot)
    )
  );
}

async function front(spec: FrontSpec): Promise<El> {
  const size = Math.floor(INNER / (await nameplateEm()));
  return h(
    "div",
    {
      width: CARD_W,
      height: CARD_H,
      display: "flex",
      flexDirection: "column",
      backgroundColor: C.paper,
      padding: `46px ${PAD.x}px 42px`,
      color: C.ink,
    },
    h(
      "div",
      { display: "flex", justifyContent: "space-between", paddingBottom: 12, borderBottom: `1px solid ${C.ink}` },
      ...spec.dateline.map((p) => text(LABEL, EAR_SIZE, C.inkFaint, p))
    ),
    h("div", { display: "flex", flexGrow: 1, alignItems: "center", justifyContent: "center", paddingTop: 8 }, await nameplate(size)),
    thickThin(),
    h(
      "div",
      { display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 22 },
      text(NOTE, 46, C.inkSoft, spec.tagline),
      text(DOMAIN, 24, C.ink, "strictly.fyi", { paddingBottom: 6 })
    )
  );
}

/* The profile banner for the brand's social accounts, 3:1 (X shows 1500x500,
   Bluesky 3000x1000): the front card's dateline, nameplate and tagline at
   banner proportions. Both platforms lay the round avatar over the lower left,
   so the tagline and domain sit right, and the nameplate is held in from the
   edges because X crops a little off the sides on narrow screens. Drawn at
   1500 units and scaled by k. */
async function banner(spec: FrontSpec, width: number): Promise<El> {
  const k = width / 1500;
  const padX = 64 * k;
  const size = Math.floor(((width - 2 * padX) * 0.8) / (await nameplateEm()));
  return h(
    "div",
    {
      width,
      height: Math.round(width / 3),
      display: "flex",
      flexDirection: "column",
      backgroundColor: C.paper,
      padding: `${38 * k}px ${padX}px ${36 * k}px`,
      color: C.ink,
    },
    h(
      "div",
      { display: "flex", justifyContent: "space-between", paddingBottom: 11 * k, borderBottom: `${Math.round(k)}px solid ${C.ink}` },
      ...spec.dateline.map((p) => text(LABEL, EAR_SIZE * k, C.inkFaint, p))
    ),
    h("div", { display: "flex", flexGrow: 1, alignItems: "center", justifyContent: "center", paddingTop: 6 * k }, await nameplate(size)),
    thickThin({}, k),
    h(
      "div",
      { display: "flex", justifyContent: "flex-end", alignItems: "flex-end", paddingTop: 18 * k },
      text(NOTE, 36 * k, C.inkSoft, spec.tagline),
      text(DOMAIN, 19 * k, C.ink, "strictly.fyi", { marginLeft: 30 * k, paddingBottom: 5 * k })
    )
  );
}

export async function renderBanner(spec: FrontSpec, width: number): Promise<Uint8Array<ArrayBuffer>> {
  return toPng(await banner(spec, width), width, Math.round(width / 3));
}

/* The nameplate alone at 5:1 on a transparent ground: the logo above the text
   of Google's consent message, which asks for about 5:1 and under 150 KB. */
async function wordmark(width: number): Promise<El> {
  const size = Math.floor((width * 0.92) / (await nameplateEm()));
  return h(
    "div",
    {
      width,
      height: Math.round(width / 5),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: opticalLift(size, size),
    },
    await nameplate(size)
  );
}

export async function renderWordmark(width: number): Promise<Uint8Array<ArrayBuffer>> {
  return toPng(await wordmark(width), width, Math.round(width / 5));
}

export async function cardNode(spec: CardSpec): Promise<El> {
  return spec.kind === "front" ? front(spec) : frame(spec);
}

export async function renderCard(spec: CardSpec): Promise<Uint8Array<ArrayBuffer>> {
  return toPng(await cardNode(spec), CARD_W, CARD_H);
}

/* Line boxes carry empty space above the capitals, and the band hangs below
   the FYI box. Padding the bottom by both centres the ink, not the boxes. */
const opticalLift = (capsSize: number, bandSize: number) =>
  aboveCaps(PLATE.family, 1) * capsSize + (BAND_PLATE.down - belowBaseline(PLATE.family, 1)) * bandSize;

/* The square mark: STRICTLY over the thick-thin rule over FYI, on paper, for
   Organization.logo and the home-screen icon. It is opaque, so it reads the
   same on Google's white and under iOS's mask. inset is the share of the side
   kept clear on each edge; the touch icon needs more, as iOS rounds corners. */
async function mark(side: number, inset: number): Promise<El> {
  const [s, f] = await measure(["STRICTLY", "FYI"], PLATE);
  const inner = side * (1 - 2 * inset);
  const top = inner / s;
  const big = Math.min(inner / (f + 2 * BAND_PLATE.pad), top * 2.1);
  const gap = side * 0.045;
  return h(
    "div",
    {
      width: side,
      height: side,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: opticalLift(top, big),
      backgroundColor: C.paper,
      color: C.ink,
      ...faceStyle(PLATE),
    },
    h("div", { display: "flex", whiteSpace: "pre", fontSize: top, lineHeight: 1 }, "STRICTLY"),
    /* Heavier on the 512 logo, which Google may show at 112px. */
    thickThin(
      {
        width: inner,
        marginTop: gap - belowBaseline(PLATE.family, 1) * top,
        marginBottom: gap - aboveCaps(PLATE.family, 1) * big,
      },
      Math.max(1, side / 340)
    ),
    h("div", { display: "flex", fontSize: big, lineHeight: 1 }, marked("FYI", big, PLATE.family, 1, BAND_PLATE))
  );
}

export async function renderMark(side: number, inset = 0.11): Promise<Uint8Array<ArrayBuffer>> {
  return toPng(await mark(side, inset), side, side);
}

/* The favicon: FYI on the highlighter, without STRICTLY, which would be a
   smear at 16px. Square corners, like everything else on the site. */
function glyph(side: number): El {
  const size = side * 0.56;
  return h(
    "div",
    {
      width: side,
      height: side,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: opticalLift(size, size),
      backgroundColor: C.paper,
      color: C.ink,
      fontSize: size,
      lineHeight: 1,
      ...faceStyle({ ...PLATE, tracking: -0.01 }),
    },
    marked("FYI", size, PLATE.family, 1, BAND_PLATE)
  );
}

export const renderGlyph = (side: number) => toPng(glyph(side), side, side);
export const glyphSvg = (side: number) => toSvg(glyph(side), side, side);

/* Social slides at 4:5 (1080x1350), which Instagram's feed shows whole and X
   shows tall: a cover with the entry's question and its answer on the
   highlighter, body slides of one idea each, and an end slide that sends
   readers to the entry. scripts/make-social-cards.mjs draws them; the site
   never does. */
export const SLIDE_W = 1080;
export const SLIDE_H = 1350;
const SPAD = { top: 76, x: 76, bottom: 64 };
const SINNER = SLIDE_W - 2 * SPAD.x;

export interface CoverSpec {
  kicker: string;
  question: string;
  /* The part of the title after the question, set on the highlighter. */
  answer?: string;
  /* Right side of the footer, beside the domain. May be empty. */
  foot: string;
}
export interface SlideSpec {
  head?: string;
  body: string;
  /* "2 / 6", beside the nameplate. */
  page: string;
  kicker: string;
}
export interface EndSpec {
  kicker: string;
  page: string;
}

/* Body text set greedily at the largest size whose lines fit the box. Slide
   bodies run to 40 words, past what fitText's exhaustive search is for. */
async function wrapFit(s: string, face: Face, o: { width: number; height: number; lineHeight: number; maxSize: number; minSize: number }) {
  const words = s.trim().split(/\s+/);
  const [x, xx, ...ws] = await measure(["x", "x x", ...words], face);
  const space = xx - 2 * x;
  let best = { size: o.minSize, lines: [] as string[] };
  for (let size = o.maxSize; size >= o.minSize; size -= 2) {
    const lines: string[] = [];
    let line: string[] = [];
    let w = 0;
    words.forEach((word, i) => {
      const add = (line.length ? space : 0) + ws[i];
      if (line.length && (w + add) * size > o.width) {
        lines.push(line.join(" "));
        line = [word];
        w = ws[i];
      } else {
        line.push(word);
        w += add;
      }
    });
    if (line.length) lines.push(line.join(" "));
    best = { size, lines };
    if (lines.length * o.lineHeight * size <= o.height) break;
  }
  return best;
}

const slidePage = (...kids: El[]) =>
  h(
    "div",
    {
      width: SLIDE_W,
      height: SLIDE_H,
      display: "flex",
      flexDirection: "column",
      backgroundColor: C.paper,
      padding: `${SPAD.top}px ${SPAD.x}px ${SPAD.bottom}px`,
      color: C.ink,
    },
    ...kids
  );

async function slideHead(ear: string): Promise<El> {
  const plate = 46;
  const earLift = belowBaseline(PLATE.family, 1) * plate - belowBaseline(LABEL.family, 1) * 20;
  return h(
    "div",
    { display: "flex", flexDirection: "column" },
    h("div", { display: "flex", justifyContent: "space-between", alignItems: "flex-end" }, await nameplate(plate), text(LABEL, 20, C.inkFaint, ear, { paddingBottom: earLift })),
    thickThin({ marginTop: 14 }, 1.2)
  );
}

const slideFoot = (right: string) =>
  h(
    "div",
    { display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: `1px solid ${C.ink}`, paddingTop: 16 },
    text(DOMAIN, 24, C.ink, "strictly.fyi"),
    text(LABEL, 20, C.inkFaint, right)
  );

const setLines = (ls: string[], size: number, lh: number) =>
  h("div", { display: "flex", flexDirection: "column", fontSize: size, lineHeight: lh, color: C.ink, ...faceStyle(HEAD) }, ...ls.map((l) => h("div", { display: "flex", whiteSpace: "pre" }, l)));

async function cover(spec: CoverSpec): Promise<El> {
  const lh = 1.04;
  const alh = 1.12;
  const q = await fitText(spec.question, HEAD, { width: SINNER, height: spec.answer ? 600 : 760, lineHeight: lh, maxSize: 124, minSize: 72, maxLines: 5 });
  const a = spec.answer
    ? await fitText(spec.answer, HEAD, { width: SINNER, height: 260, lineHeight: alh, maxSize: Math.min(q.size, 104), minSize: 56, maxLines: 2, tail: 2 * BAND_HEAD.pad })
    : undefined;
  return slidePage(
    await slideHead("A FIELD GUIDE TO THE FASCINATING"),
    h(
      "div",
      { display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" },
      text(KICK, 26, C.inkSoft, spec.kicker, { marginBottom: 40 }),
      setLines(q.lines, q.size, lh),
      ...(a
        ? [
            h(
              "div",
              { display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: 0.45 * a.size, fontSize: a.size, lineHeight: alh, color: C.ink, ...faceStyle(HEAD) },
              ...a.lines.map((l) => marked(l, a.size, HEAD.family, alh, BAND_HEAD, { marginLeft: BAND_HEAD.pad * a.size }))
            ),
          ]
        : [])
    ),
    slideFoot(spec.foot)
  );
}

async function bodySlide(spec: SlideSpec): Promise<El> {
  const lh = 1.2;
  const body = await wrapFit(spec.body, HEAD, { width: SINNER, height: spec.head ? 780 : 860, lineHeight: lh, maxSize: 76, minSize: 44 });
  return slidePage(
    await slideHead(spec.page),
    h(
      "div",
      { display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" },
      ...(spec.head ? [text(KICK, 26, C.inkSoft, spec.head.toUpperCase(), { marginBottom: 40 })] : []),
      setLines(body.lines, body.size, lh)
    ),
    slideFoot(spec.kicker)
  );
}

async function endSlide(spec: EndSpec): Promise<El> {
  const size = 104;
  const plateW = size * (await nameplateEm());
  return slidePage(
    h("div", { display: "flex", justifyContent: "flex-end" }, text(LABEL, 20, C.inkFaint, spec.page)),
    h(
      "div",
      { display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center", alignItems: "center" },
      await nameplate(size),
      thickThin({ marginTop: 22, width: plateW }, 1.6),
      text(NOTE, 48, C.inkSoft, "Every source is linked in the full entry.", { marginTop: 56, lineHeight: 1.2 }),
      text(DOMAIN, 50, C.ink, "strictly.fyi", { marginTop: 40 }),
      text(LABEL, 24, C.inkFaint, "LINK IN BIO", { marginTop: 18 })
    ),
    slideFoot(spec.kicker)
  );
}

export const renderCover = async (spec: CoverSpec) => toPng(await cover(spec), SLIDE_W, SLIDE_H);
export const renderSlide = async (spec: SlideSpec) => toPng(await bodySlide(spec), SLIDE_W, SLIDE_H);
export const renderEnd = async (spec: EndSpec) => toPng(await endSlide(spec), SLIDE_W, SLIDE_H);
