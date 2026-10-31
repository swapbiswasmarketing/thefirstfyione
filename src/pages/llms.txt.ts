/* /llms.txt, in the llmstxt.org shape: the name, a one-line summary, a short note
   on what the publication is, then every entry under its department in filed
   order, newest first. It is generated from the collection on every build, so it
   cannot drift from the archive. There is deliberately no llms-full.txt: nothing
   measured reads one, and it would hand the whole archive to scrapers in a single
   request.

   A static build keeps only the body of an endpoint's response, so no headers are
   set here: Vercel serves .txt as text/plain, and the extension keeps the file
   clear of the trailing-slash 308. */
import type { APIRoute } from "astro";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, cats } from "../data/site";
import { getEntries, entryHref } from "../lib/entries";

const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();
/* A bracket in a title would end the link text early. */
const linkText = (s: string) => oneLine(s).replace(/[[\]]/g, "\\$&");
const series = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

export const GET: APIRoute = async () => {
  const entries = await getEntries();
  const departments = cats.map((c) => `${c.name} (${c.note.charAt(0).toLowerCase()}${c.note.slice(1)})`);
  /* Counted, not asserted: the earliest entries were filed before the house
     began citing sources inline, so "every entry" would be false. */
  const sourced = entries.filter((p) => /\]\(https?:\/\/(?!(?:www\.)?strictly\.fyi)/i.test(p.body ?? "")).length;

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `${SITE_NAME} publishes short, plain-English explainers, most of them the answer to a single question; ${sourced} of the ${entries.length} entries link their sources inline. Entries are drafted with AI assistance, checked against the sources they link, and published by ${SITE_NAME} as a publication; there is no personal byline. The process is described at ${SITE_URL}/how-we-work/. Each entry is filed in one department: ${series(departments)}.`,
    "",
    `Below, all ${entries.length} entries on file are listed under their departments, newest first.`,
    "",
  ];

  for (const c of cats) {
    const list = entries.filter((p) => p.data.category === c.key);
    if (!list.length) continue;
    lines.push(
      `## ${c.name}`,
      "",
      ...list.map((p) => `- [${linkText(p.data.title)}](${SITE_URL}${entryHref(p)}): ${oneLine(p.data.description)}`),
      ""
    );
  }

  lines.push(
    "## Optional",
    "",
    `- [About ${SITE_NAME}](${SITE_URL}/about/): what the publication is, and its house rules for picking and writing entries`,
    `- [How we work](${SITE_URL}/how-we-work/): how entries are chosen, drafted with AI assistance, checked against sources and corrected`,
    `- [Corrections](${SITE_URL}/corrections/): every correction of fact, newest first`,
    `- [Topics](${SITE_URL}/topics/): the departments, each with a page of its own`,
    `- [Archive](${SITE_URL}/blog/): every entry in filed order`,
    `- [RSS feed](${SITE_URL}/rss.xml): entries as they are filed`,
    ""
  );

  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
