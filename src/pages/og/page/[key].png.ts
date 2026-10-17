/* Cards for the pages that are not entries: the front page, the archive,
   about, topics, search, privacy, the 404 and one per department. Kept under
   /og/page/ so no entry slug can ever collide with them. Pages link them
   through pageCard() in src/lib/og.ts, which adds the ?v= version. */
import type { APIRoute, GetStaticPaths } from "astro";
import { pageKeys, pageSpecFor } from "../../../lib/og";
import { renderCard } from "../../../lib/og/cards";

export const getStaticPaths = (() =>
  pageKeys.map((key) => ({ params: { key }, props: { spec: pageSpecFor(key) } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(await renderCard(props.spec), { headers: { "Content-Type": "image/png" } });
