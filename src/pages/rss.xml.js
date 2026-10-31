import rss from "@astrojs/rss";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "../data/site";
import { getEntries, entryHref } from "../lib/entries";
import { deptName } from "../lib/schema";

/* The feed, in filed order (getEntries sorts with byFiled, like every other list).
   Each item carries its real filing date, the same date as the entry's
   datePublished; the item order already settles entries filed on one day, so no
   invented clock times are added. The atom:link rel="self" tells readers and
   validators the feed's own address. No XSLT stylesheet: browsers are removing XSLT. */
export async function GET(context) {
  const entries = await getEntries();

  return rss({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: context.site ?? SITE_URL,
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    customData: `<language>en-us</language><atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>`,
    items: entries.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      link: entryHref(p),
      pubDate: p.data.pubDate,
      categories: [deptName(p.data.category)],
    })),
  });
}
