// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://www.strictly.fyi';

/* Entries cite their sources inline, so the body copy carries outbound links to
   journals, museums and reference works. Mark every one of them nofollow so the
   citations do not pass ranking signal off the site, and open them in a new tab
   so a reader checking a source does not lose the entry. Own-domain links are
   left alone. Only markdown bodies pass through here - the share buttons and
   nav live in .astro templates and are untouched. */
function rehypeExternalLinks() {
  const host = new URL(SITE).host.replace(/^www\./, '');
  return (tree) => {
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
            node.properties.rel = 'nofollow noopener noreferrer';
            node.properties.target = '_blank';
          }
        }
      }
      if (node.children) for (const child of node.children) walk(child);
    };
    walk(tree);
  };
}

// https://astro.build
export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [rehypeExternalLinks],
  },
});
