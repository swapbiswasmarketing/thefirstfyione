/* Structured data. The publication is defined once, as one Organization node
   with a stable @id, and every page emits a single @graph that points at it by
   reference instead of repeating it. Strictly FYI has no personal byline, so
   there is no Person anywhere, by design. */
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, cats } from "../data/site";
import type { Entry } from "./entries";

export const WEBSITE_ID = `${SITE_URL}/#website`;
export const ORG_ID = `${SITE_URL}/#organization`;
export const LOGO_ID = `${SITE_URL}/#logo`;

type Node = Record<string, unknown>;

export const organization: Node = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  alternateName: "strictly.fyi",
  url: `${SITE_URL}/`,
  description: SITE_DESCRIPTION,
  logo: {
    "@type": "ImageObject",
    "@id": LOGO_ID,
    url: `${SITE_URL}/logo.png`,
    contentUrl: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
    caption: SITE_NAME,
  },
  image: { "@id": LOGO_ID },
  foundingDate: "2026",
  publishingPrinciples: `${SITE_URL}/about/#house-rules`,
};

export const website: Node = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  alternateName: "strictly.fyi",
  description: SITE_DESCRIPTION,
  inLanguage: "en-US",
  publisher: { "@id": ORG_ID },
};

/* Inline name and url as well as the @id, for parsers that do not merge nodes. */
export const orgRef: Node = { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME, url: `${SITE_URL}/` };

export const abs = (path: string) => new URL(path, SITE_URL).href;

export function pageNode(type: string, url: string, name: string, description: string, extra: Node = {}): Node {
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en-US",
    ...extra,
  };
}

/* trail excludes Home, which is always first. */
export function crumbs(url: string, trail: { name: string; url: string }[]): Node {
  const items = [{ name: "Home", url: `${SITE_URL}/` }, ...trail];
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url })),
  };
}

/* An ordered list of entry URLs, for the archive and the department pages. */
export function itemList(url: string, entries: Entry[]): Node {
  return {
    "@type": "ItemList",
    "@id": `${url}#list`,
    numberOfItems: entries.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: entries.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: abs(`/blog/${p.id}/`),
      name: p.data.title,
    })),
  };
}

export const deptName = (key: string) => cats.find((c) => c.key === key)?.name ?? "Curiosity";

/* Serialized once per page. "<" is escaped so no string can close the script. */
export function jsonLd(nodes: Node[] = []): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": [website, organization, ...nodes] }).replace(
    /</g,
    "\\u003c"
  );
}
