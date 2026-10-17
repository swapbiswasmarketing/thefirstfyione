/* Brand icons and the generic social card, drawn by the same engine as the
   per-page cards (src/lib/og/), so the nameplate, the highlighter and the
   tokens match the site exactly. Run it by hand after a brand change; nothing
   runs it at build time:

     node scripts/make-icons.mjs

   Needs Node 23.6 or later, which runs the .ts card modules directly. Writes
   into public/:
     logo.png              512x512, the Organization logo in src/lib/schema.ts
     apple-touch-icon.png  180x180, opaque, inset for the iOS corner mask
     favicon.ico           16, 32 and 48px PNGs in one ICO (Safari, Google, Windows)
     favicon.svg           the FYI mark as outlined paths: an SVG favicon cannot
                           load web fonts, so live text would fall back to a
                           system face
     og.png                the generic 1200x630 card older shares still point at */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
/* The card engine resolves its fonts from the working directory. */
process.chdir(root);
const load = (file) => import(pathToFileURL(path.join(root, file)).href);
const { renderCard, renderMark, renderGlyph, glyphSvg } = await load("src/lib/og/cards.ts");
const { fallbackSpec } = await load("src/lib/og/spec.ts");

const write = (name, data) => {
  fs.writeFileSync(path.join(root, "public", name), data);
  console.log(`public/${name}  ${data.length} bytes`);
};

/* An ICO is a 6-byte header, a 16-byte entry per image, then the images.
   PNG payloads have been valid since Windows Vista and in every current browser. */
function ico(images) {
  const head = Buffer.alloc(6 + 16 * images.length);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(images.length, 4);
  let offset = head.length;
  images.forEach(([side, png], i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(side >= 256 ? 0 : side, e);
    head.writeUInt8(side >= 256 ? 0 : side, e + 1);
    head.writeUInt8(0, e + 2);
    head.writeUInt8(0, e + 3);
    head.writeUInt16LE(1, e + 4);
    head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(png.length, e + 8);
    head.writeUInt32LE(offset, e + 12);
    offset += png.length;
  });
  return Buffer.concat([head, ...images.map(([, png]) => Buffer.from(png))]);
}

/* Satori wraps elements in overflow masks that nothing refers to. A favicon
   is fetched on every first visit, so drop the unused ones. */
const tidy = (svg) =>
  svg
    .replace(/<mask id="([^"]*)">.*?<\/mask>/g, (m, id) => (svg.includes(`url(#${id})`) ? m : ""))
    .replace(/<g\s+>/g, "<g>");

write("logo.png", Buffer.from(await renderMark(512)));
write("apple-touch-icon.png", Buffer.from(await renderMark(180, 0.14)));
const sizes = [16, 32, 48];
write("favicon.ico", ico(await Promise.all(sizes.map(async (s) => [s, await renderGlyph(s)]))));
/* Drawn on a 128-unit square: satori rounds coordinates to a tenth of a unit,
   which stays invisible when the browser scales it down to 16 or 32px. */
write("favicon.svg", Buffer.from(tidy(await glyphSvg(128))));
write("og.png", Buffer.from(await renderCard(fallbackSpec())));
