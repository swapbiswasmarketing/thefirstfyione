/* Shared brand constants. Single source of truth so the masthead,
   the department pages, the archive and the structured data never drift apart. */

/* Must equal SITE in astro.config.mjs. www is the primary host on Vercel. */
export const SITE_URL = "https://www.strictly.fyi";
export const SITE_NAME = "Strictly FYI";
export const SITE_DESCRIPTION =
  "A general-interest field guide to the fascinating - science, history, tech, culture, and everyday curiosities worth knowing. Strictly for your information.";

export const contactEmail = "hello@strictly.fyi";

export const catLabel: Record<string, string> = {
  science: "Science",
  history: "History",
  tech: "Tech",
  culture: "Culture",
  everyday: "Everyday",
  curiosity: "Curiosity",
};

export const cats = [
  { key: "science", n: "01", name: "Science", note: "How the universe actually works" },
  { key: "history", n: "02", name: "History", note: "The stories behind the story" },
  { key: "tech", n: "03", name: "Tech", note: "Why the things around you work" },
  { key: "culture", n: "04", name: "Culture", note: "Ideas, language, and why we do things" },
  { key: "everyday", n: "05", name: "Everyday", note: "The hidden logic of ordinary life" },
  { key: "curiosity", n: "06", name: "Curiosity", note: "The wonderfully, oddly true" },
];

/* Every department has a real, indexable page. The old /blog/?cat= filter
   still works for links already out in the wild, but nothing new points there. */
export const deptHref = (key: string) => `/topics/${key}/`;

/* The number of departments as a word, for copy that reads "in six departments".
   Computed so adding a department cannot leave a stale count in the prose. */
export const deptWord = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][cats.length] ?? String(cats.length);

/* Dates in frontmatter are plain YYYY-MM-DD, which z.coerce.date reads as UTC
   midnight. Format them in UTC too, or a build west of UTC prints the day before. */
export const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export const fmtLong = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export const fmtDay = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

/* Google Tag Manager container ID, e.g. "GTM-ABC1234". GA4 is configured as a
   tag inside this container, so this is the only analytics snippet the site
   ships. Leave it empty to render no analytics at all, which is what local dev
   and any pre-launch build should do. */
export const gtmId = "GTM-WLHM6RXG";

/* Consent Mode v2 default for the EEA, the UK and Switzerland. It is a
   dataLayer command, not a tag: it runs before the GTM container loads and
   tells every Google tag inside it that storage is denied for visitors in
   these regions. There is no banner, so nothing ever upgrades it; analytics
   in-region becomes cookieless or absent, and every other region is
   unchanged. See CONSENT.md before adding any tag to the container. */
export const consentDefaults = true;
export const consentRegions = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES",
  "SE", "IS", "LI", "NO", "GB", "CH", "AX", "GF", "GP", "MQ", "RE", "YT", "MF",
];

/* Microsoft Clarity runs only if its tag is published in the GTM container.
   The privacy page describes it only while this is true, so flip it in the
   same change that publishes the tag. */
export const clarityEnabled = false;

/* Newsletter. The numeric Kit form ID, digits only. The form posts straight to
   Kit's public form endpoint, so no API key ever lives in this public repo, and
   Kit runs the confirmation email. An empty value renders the honest fallback:
   no email field, no promised cadence, just the feed. */
export const kitFormId = "";
export const newsletterLive = /^[0-9]{5,12}$/.test(kitFormId);
export const kitFormAction = newsletterLive ? `https://app.kit.com/forms/${kitFormId}/subscriptions` : "";
