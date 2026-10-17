/* One 1200x630 social card per entry, drawn at build time. The .png in the
   route name is what makes the host serve image/png: a static build writes the
   body only and drops Response headers. Pages link the card through
   entryCard() in src/lib/og.ts, which adds the ?v= version. */
import type { APIRoute, GetStaticPaths } from "astro";
import { getEntries } from "../../lib/entries";
import { entrySpecFor } from "../../lib/og";
import { renderCard } from "../../lib/og/cards";

/* The card fonts are the latin subset. A title outside it would draw with
   gaps, so say so in the build log instead of shipping a broken card. */
const drawable = (c: number) => (c >= 0x20 && c <= 0x7e) || (c >= 0xa0 && c <= 0xff) || (c >= 0x2000 && c <= 0x206f);

export const getStaticPaths = (async () => {
  const entries = await getEntries();
  return entries.map((entry) => {
    if ([...entry.data.title].some((ch) => !drawable(ch.codePointAt(0) ?? 0))) {
      console.warn(`[og] ${entry.id}: the title has characters the card fonts lack`);
    }
    return { params: { slug: entry.id }, props: { spec: entrySpecFor(entry) } };
  });
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(await renderCard(props.spec), { headers: { "Content-Type": "image/png" } });
