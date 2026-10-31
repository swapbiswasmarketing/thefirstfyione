/* Brand images for places outside the site: the social accounts and Google's
   consent message. Drawn by the same engine as the site's cards and icons
   (src/lib/og/), so they match the masthead exactly. Run it by hand after a
   brand change; nothing runs it at build time:

     node scripts/make-brand.mjs

   Needs Node 23.6 or later, which runs the .ts card modules directly. Writes
   into brand/, which the site never serves:
     social/avatar-1000.png       the square mark, inset so a round crop clips nothing
     social/banner-1500x500.png   X header
     social/banner-3000x1000.png  Bluesky banner
     wordmark-1000x200.png        the logo on Google's consent message (CONSENT.md)
   SOCIAL.md says where each social file goes. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
/* The card engine resolves its fonts from the working directory. */
process.chdir(root);
const load = (file) => import(pathToFileURL(path.join(root, file)).href);
const { renderMark, renderBanner, renderWordmark } = await load("src/lib/og/cards.ts");
const { fallbackSpec } = await load("src/lib/og/spec.ts");

const write = (name, data) => {
  const file = path.join(root, "brand", name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
  console.log(`brand/${name}  ${data.length} bytes`);
};

/* Every platform crops the avatar to a circle. At an inset of 0.16 the corners
   of STRICTLY sit about 0.42 of the side from the centre, well inside it. */
write("social/avatar-1000.png", Buffer.from(await renderMark(1000, 0.16)));
const spec = fallbackSpec();
write("social/banner-1500x500.png", Buffer.from(await renderBanner(spec, 1500)));
write("social/banner-3000x1000.png", Buffer.from(await renderBanner(spec, 3000)));
write("wordmark-1000x200.png", Buffer.from(await renderWordmark(1000)));
