/* /ads.txt: authorizes Google, through this publisher account, to sell ads on
   this domain. Built from adsenseClient in src/data/site.ts so the two cannot
   disagree; with no client set it is served empty. f08c47fec0942fa0 is Google's
   own certification authority ID, the same for every AdSense publisher. */
import type { APIRoute } from "astro";
import { adsenseClient, adsenseLive } from "../data/site";

export const GET: APIRoute = () => {
  const body = adsenseLive ? `google.com, ${adsenseClient.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n` : "";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
