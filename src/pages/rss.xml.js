import rss from "@astrojs/rss";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "../data/site";
import { getEntries, entryHref, fileNo } from "../lib/entries";
import { deptName } from "../lib/schema";

/* The feed, in filed order (getEntries sorts with byFiled, like every other list).
   Entries in one filing batch share a pubDate, and a reader that sorts by date
   would shuffle them, so each item's time is its pubDate plus its file number in
   minutes: FYI-121 lands at 02:01 UTC, one minute after FYI-120, and the batch
   reads in the order it was filed. That holds while file numbers stay under 1,440,
   a day of minutes. The atom:link rel="self" tells readers and validators the
   feed's own address. No XSLT stylesheet: browsers are removing XSLT. */
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
      pubDate: new Date(p.data.pubDate.valueOf() + fileNo(p) * 60_000),
      categories: [deptName(p.data.category)],
    })),
  });
}
