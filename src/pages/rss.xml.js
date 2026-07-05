import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("blog");
  const sorted = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: "Strictly FYI",
    description:
      "The no-fluff go-to-market brief. Signal, not noise — positioning, launches, and messaging for product marketers.",
    site: context.site,
    items: sorted.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      categories: [post.data.category],
    })),
    customData: `<language>en-us</language><copyright>Signal, not noise.</copyright>`,
    stylesheet: false,
  });
}
