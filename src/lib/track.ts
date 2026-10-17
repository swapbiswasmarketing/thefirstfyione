/* Analytics events for bundled page scripts. Everything goes to the dataLayer,
   and GTM decides what (if anything) to send on. Never pass an email address
   or free text a reader typed, except a site-search term. For click events,
   prefer the data-track attributes handled in Layout.astro over calling this. */

/* GTM's data model keeps every pushed key for the life of the page, so one GA4
   event tag that maps every parameter would stamp read_percent from an earlier
   blog_read_progress onto a later faq_open. Each push therefore clears the
   other events' keys. entry_id and content_group are page-level and persist.
   Add any new event parameter here as well as in MEASUREMENT.md. */
const EVENT_KEYS = [
  "cta_type", "cta_location", "share_platform", "signup_location", "read_percent", "entry_category",
  "related_position", "related_reason", "faq_index", "filter_category", "search_term", "results_count",
  "search_location", "random_location", "module", "position", "page_path",
];

export function track(event: string, params: Record<string, string | number | boolean | undefined> = {}) {
  const clean: Record<string, string | number | boolean | undefined> = {};
  for (const k of EVENT_KEYS) clean[k] = undefined;
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === "") continue;
    clean[k] = typeof v === "string" ? v.slice(0, 100) : v;
  }
  const w = window as unknown as { dataLayer?: unknown[] };
  (w.dataLayer = w.dataLayer || []).push({ event, ...clean });
}
