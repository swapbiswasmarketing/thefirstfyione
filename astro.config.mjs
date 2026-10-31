// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import rehypeTables from './src/lib/rehype-tables.mjs';

const SITE = 'https://www.strictly.fyi';

/* Entries cite their sources inline, so the body copy carries outbound links to
   journals, museums and reference works. Each one opens in a new tab, so a reader
   checking a source does not lose the entry, with rel="noopener noreferrer" so the
   opened page gets no handle on this one. They are deliberately not nofollow:
   a nofollowed link still uses up its share of the page's ranking signal, so
   nofollow keeps nothing on the site, and it marks the very sources an entry rests
   on as ones the site will not vouch for. Own-domain links are left alone. Only
   markdown bodies pass through here - the share buttons and nav live in .astro
   templates and are untouched. */
function rehypeExternalLinks() {
  const host = new URL(SITE).host.replace(/^www\./, '');
  /** @param {any} tree */
  return (tree) => {
    /** @param {any} node */
    const walk = (node) => {
      if (node.tagName === 'a' && node.properties) {
        const href = node.properties.href;
        if (typeof href === 'string' && /^https?:\/\//i.test(href)) {
          let external = true;
          try {
            external = new URL(href).host.replace(/^www\./, '') !== host;
          } catch {
            /* malformed href: treat as external and mark it */
          }
          if (external) {
            node.properties.rel = 'noopener noreferrer';
            node.properties.target = '_blank';
          }
        }
      }
      if (node.children) for (const child of node.children) walk(child);
    };
    walk(tree);
  };
}

/* Astro caches rendered markdown under a digest of this config, and plugin
   functions drop out of that digest, so editing a plugin's code would ship stale
   HTML from a build that exits 0. A hash of each plugin's source, passed as an
   option the plugin ignores, puts the code into the digest: any edit re-renders
   every entry once. */
const rev = (/** @type {string} */ source) => createHash('sha1').update(source).digest('hex').slice(0, 12);
const TABLES_REV = rev(readFileSync(new URL('./src/lib/rehype-tables.mjs', import.meta.url), 'utf8'));
const LINKS_REV = rev(rehypeExternalLinks.toString());

/* Sitemap dates. An entry's lastmod is its updatedDate when that is later than its
   pubDate, else its pubDate - the same fallback the entry template uses for dateModified, so the
   sitemap, the JSON-LD and the byline agree. updatedDate is set only for a genuine
   refresh, never for a link edit, which is what keeps these dates worth trusting.
   They come from the raw frontmatter because astro:content is not available here;
   a value that is not a YYYY-MM-DD date is skipped, never thrown on, because a
   serialize() that throws leaves the build with no sitemap at all.

   The pages that list entries take the newest date among what they list: the
   front page, the archive and the topics index the newest overall, each
   department page the newest in its department. Pages with no date of their own
   (about, privacy) stay undated rather than wear the build time. The IndexNow
   deploy step (scripts/indexnow-deploy.mjs) diffs these same dates against the live sitemap, so a wrong one
   misleads both readers at once. */
const BLOG_DIR = new URL('./src/content/blog/', import.meta.url);
/* One clock for the whole build: the config fixes the build time once, and
   src/lib/entries.ts reads the same value, so a build that runs across midnight
   UTC cannot publish an entry the sitemap does not date. */
process.env.STRICTLY_BUILD_TIME ||= String(Date.now());
const BUILD_DAY = new Date(Number(process.env.STRICTLY_BUILD_TIME)).toISOString().slice(0, 10);
const LASTMOD = new Map();
const NEWEST = new Map();
for (const file of readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))) {
  const fm = readFileSync(new URL(file, BLOG_DIR), 'utf8').replace(/\r\n/g, '\n').split('\n---')[0];
  const field = (/** @type {string} */ key) =>
    fm.match(new RegExp(`^${key}:[ \\t]*["']?([^"'\\n]*?)["']?[ \\t]*$`, 'm'))?.[1];
  const day = (/** @type {string | undefined} */ value) => {
    const d = value?.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
    return d && !Number.isNaN(Date.parse(d)) ? d : undefined;
  };
  const pub = day(field('pubDate'));
  const upd = day(field('updatedDate'));
  /* A scheduled entry (pubDate after today, UTC) is not built yet, so it
     neither gets a sitemap date nor moves the hubs' newest date. */
  if (pub && pub > BUILD_DAY) continue;
  const date = upd && (!pub || upd > pub) ? upd : pub;
  if (!date) continue;
  const slug = field('slug') || file.slice(0, -3).toLowerCase();
  LASTMOD.set(`${SITE}/blog/${slug}/`, date);
  for (const scope of ['*', field('category') || 'curiosity']) {
    const newest = NEWEST.get(scope);
    if (!newest || newest < date) NEWEST.set(scope, date);
  }
}
const HUBS = new Set(['/', '/blog/', '/topics/']);

/** @param {string} url */
function lastmodFor(url) {
  const { pathname } = new URL(url);
  if (LASTMOD.has(url)) return LASTMOD.get(url);
  if (HUBS.has(pathname)) return NEWEST.get('*');
  const dept = pathname.match(/^\/topics\/([a-z0-9-]+)\/$/)?.[1];
  if (dept) return NEWEST.get(dept);
  if (pathname.startsWith('/blog/')) console.warn(`[sitemap] no lastmod for ${url}: its frontmatter date did not parse`);
  return undefined;
}

/* Pages that ask not to be indexed stay out of the sitemap, and the robots meta in
   the built page is the list: any page that passes noindex to the Layout is
   dropped here, so there is no second, hand-kept list to drift out of step with
   the prop. /404/ and /search/ are also named outright, in case their HTML cannot
   be read. Matching is by pathname prefix, never substring. A read that fails
   keeps the page, because a filter that throws takes the whole sitemap down. */
const NOINDEX_PATHS = ['/404/', '/search/'];
/** @type {URL | undefined} */
let outDir;
/** @param {string} url */
function isNoindex(url) {
  try {
    const { pathname } = new URL(url);
    if (NOINDEX_PATHS.some((p) => pathname.startsWith(p))) return true;
    if (!outDir) return false;
    const html = readFileSync(new URL(`.${pathname}index.html`, outDir), 'utf8');
    const end = html.indexOf('</head>');
    const head = end === -1 ? html : html.slice(0, end);
    return (head.match(/<meta\b[^>]*>/gi) ?? []).some(
      (tag) => /\bname=["']?robots\b/i.test(tag) && /\bcontent=["'][^"']*\bnoindex\b/i.test(tag)
    );
  } catch {
    return false;
  }
}

// https://astro.build
export default defineConfig({
  site: SITE,
  /* Every route already builds to <path>/index.html and every sitemap <loc>
     already ends in a slash, so this locks in the current output. It pairs with
     trailingSlash: true in vercel.json, which answers /path with a 308 to /path/;
     without it both forms return 200. Files with an extension (rss.xml, llms.txt,
     the IndexNow key) are exempt from both. */
  trailingSlash: 'always',
  build: {
    /* Every page linked one shared stylesheet (8.7 KB) and most linked a page
       sheet as well, each a render-blocking request. Inlining ships the CSS inside
       the document. Measured with brotli, the front page went from 7,409 B over
       three requests to 6,969 B in one, an entry from 9,485 B to 9,022 B and the
       archive from 18,316 B to 17,943 B, because one compressed stream over HTML
       and CSS beats several. Astro keeps the cascade order when it inlines. The
       cost is CSS that is no longer cached between page views, a fair trade for a
       site most readers enter from search. First paint now lands before the
       end-of-body scripts run, so anything a script settles on load (the
       archive's ?cat= filter) has to be settled before paint instead. */
    inlineStylesheets: 'always',
  },
  /* No prefetch option, on purpose. Next-page prefetch is a speculation-rules
     block in the Layout head: Chromium fetches a same-origin page's HTML when the
     reader hovers or presses a link to it, with no script and no listener per
     link. Astro's prefetch module would add a script that binds every anchor (over
     120 on the archive), and running both would fetch each page twice. Prefetch,
     never prerender: a prerendered page runs GTM for a page nobody opened. */
  integrations: [
    {
      /* The sitemap filter below reads built pages, so it needs the output
         directory, which a --outDir build moves. */
      name: 'sitemap-out-dir',
      hooks: {
        'astro:config:done': ({ config }) => {
          outDir = new URL(config.outDir.href.endsWith('/') ? config.outDir.href : `${config.outDir.href}/`);
        },
      },
    },
    sitemap({
      filter: (page) => !isNoindex(page),
      serialize(item) {
        try {
          const lastmod = lastmodFor(item.url);
          if (lastmod) item.lastmod = lastmod;
        } catch {
          /* an undated URL is better than no sitemap */
        }
        return item;
      },
      /* No news, image, video or hreflang entries, so no namespaces for them. */
      namespaces: { news: false, xhtml: false, image: false, video: false },
    }),
  ],
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { rev: LINKS_REV }],
      /* Wraps every markdown table in a keyboard-scrollable region and marks its
         figure columns (src/lib/rehype-tables.mjs). */
      [rehypeTables, { rev: TABLES_REV }],
    ],
  },
});
