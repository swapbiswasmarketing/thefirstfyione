# Measurement

How strictly.fyi is measured, and the record of what it measured. Two sources only:

- **Google Search Console**, for search: impressions, clicks, positions, indexing. It is first-party and free, and it is the only source this site diagnoses itself from. A sibling site built a strategy on third-party traffic estimates that its own Search Console export later proved wrong.
- **Google Analytics 4 through Google Tag Manager**, for what readers do on the page. Every tag lives in container `GTM-WLHM6RXG`; the Astro source never carries gtag.js or a Clarity snippet (`npm run check` fails if one appears).

House rules for this file: plain ASCII, append a dated section per quarter and never overwrite an old one, and never write a number that did not come out of one of those two tools.

## 1. The event taxonomy

All events go to `window.dataLayer` and nowhere else; GTM decides what reaches GA4. Click events are declared in markup (`data-track="event_name"` plus `data-track-*` attributes, read by one delegated listener in `src/layouts/Layout.astro`, so `data-track-cta-location="runhead"` arrives as `cta_location: "runhead"`). Events that depend on an outcome are pushed from scripts with `track()` from `src/lib/track.ts`, only once the outcome happened. No custom parameter carries an email address: the site-search term passes through a redaction that replaces anything shaped like an address with `[email]`, the search page never writes an address into ?q=, and values are cut to 100 characters (GA4's limit). GA4's own page_location and view_search_results can still read a raw ?q= when a reader submits the front-page search form with an address in it, so turn on the stream's email redaction (Admin > Data collection and modification > Data streams > the web stream > Redact data > Email).

| Event | Parameters | Fires when | Where |
|---|---|---|---|
| `cta_click` | `cta_type`: `rss` / `rss_copy` / `subscribe` / `random` / `search`; `cta_location` | A reader uses a feed, subscribe or search call to action. `rss_copy` fires only after the clipboard accepted the feed address. `random` is reserved: the random-file buttons send `random_entry` instead. | Running head RSS and Subscribe links (`Layout.astro`, location `runhead`; Subscribe only while the newsletter is live); the feed link and copy button of the subscribe block (`SubscribeForm.astro`, location from its `location` prop: homepage, entry, about, archive); the masthead search button (`index.astro`, `masthead`); the 404 search link (`404.astro`, `notfound`) |
| `share_click` | `share_platform`: `x` / `facebook` / `linkedin` / `copy_link` / `native`; `entry_id` | X, Facebook and LinkedIn on click; `copy_link` once the clipboard has the URL; `native` once the share sheet resolves | Share row of every entry (`src/pages/blog/[...slug].astro`) |
| `newsletter_signup` | `signup_location`, `entry_id` | Only after Kit answers with success; a failed or rejected submit pushes nothing. Inert while `kitFormId` is empty. | `SubscribeForm.astro` |
| `blog_read_progress` | `read_percent`: 25 / 50 / 75 / 100; `entry_id`; `entry_category` | Once per milestone per page view, measured against the entry text | Entry template script |
| `related_click` | `related_position`, `related_reason`, `entry_id` | A reader follows a "related" pick; the reason is the strongest signal behind it (`cites-this`, `linked`, `co-cited`, `dept`, `terms`, `filed`) | Related list on every entry |
| `faq_open` | `faq_index`, `entry_id` | The first time each FAQ item opens | FAQ list on every entry |
| `archive_filter` | `filter_category` | A department filter in the archive is used | `src/pages/blog/index.astro` |
| `search` | `search_term` (redacted), `results_count`, `search_location`: `page` / `notfound` | A search runs on /search/, or the 404 page searches for the missing path | `src/components/SearchResults.astro` |
| `random_entry` | `random_location` | "Pull a random file" is used | Front page (`home`) and 404 page (`notfound`) |
| `home_module_click` | `module`, `position` | A front-page module link is used. Modules: `lead`, `lead_continue`, `secondary`, `edition`, `desk_<word>`, `almanac`, `almanac_next`, `start`, `dept_<key>` | `src/pages/index.astro` |
| `page_not_found` | `page_path` | Once per load of the 404 page, so broken inbound links show up as their own event | `src/pages/404.astro` |

Page metadata, pushed before the container loads (the `preGtm` block in `Layout.astro`): `content_group` (the department name on entries; `Front page`, `Archive`, `Topics`, `About` or `Other` elsewhere) and `entry_id` (the filecode on entries, empty elsewhere). The filecode is used instead of the title because titles change and filecodes do not.

When an event is added or renamed, change this table, the GTM trigger regex and the GA4 custom dimensions in the same change.

## 2. GTM setup (container GTM-WLHM6RXG)

These steps happen in the GTM and GA4 interfaces; nothing in the repo can do them.

1. **Variables.** Variables > User-Defined > New > Data Layer Variable, version 2, one per parameter, named `DLV - <parameter>`: `cta_type`, `cta_location`, `share_platform`, `entry_id`, `signup_location`, `read_percent`, `entry_category`, `related_position`, `related_reason`, `faq_index`, `filter_category`, `search_term`, `results_count`, `search_location`, `random_location`, `module`, `position`, `page_path`, `content_group`.
2. **Google tag.** The existing Google tag for `G-BGFVBKTFPJ` gets one configuration parameter: `content_group` = `{{DLV - content_group}}`. The value is in the dataLayer before the container loads, so the first page view already carries it.
3. **One GA4 event tag for every event.** Tags > New > Google Analytics: GA4 Event. Measurement ID `G-BGFVBKTFPJ`. Event Name `{{Event}}`. Event parameters: each parameter name from the table above, mapped to its `DLV - <parameter>` variable (an undefined variable is not sent).
   GTM keeps every key pushed to the dataLayer for the life of the page, so one tag that maps every parameter is only clean if each push clears the keys of the other events; otherwise a `faq_open` after a `blog_read_progress` would also carry `read_percent`. `track()` in `src/lib/track.ts` is meant to do that clearing (every event-specific key not in the call is pushed as undefined; `entry_id` and `content_group` are page-level and stay). Check it in Preview: on an event's Data Layer tab, keys belonging to an earlier event must read `undefined`. If they do not, use one GA4 event tag per event instead, each with only its own row's parameters and a Custom Event trigger on the exact event name.
4. **One trigger.** Triggers > New > Custom Event. Event name, with "Use regex matching" ticked:
   ```
   ^(cta_click|share_click|newsletter_signup|blog_read_progress|related_click|faq_open|archive_filter|search|random_entry|home_module_click|page_not_found)$
   ```
   Fire on all custom events matching it. Attach it to the event tag from step 3.
5. **The consent requirement on every tag.** On the Google tag and on the event tag: Advanced Settings > Consent Settings > "Require additional consent for tag to fire" > `analytics_storage`. Every tag added later gets the same setting. CONSENT.md explains why and what it changes.
6. **Preview, then publish.** Tag Assistant Preview: perform each action once and confirm exactly one event with the right parameters (section 4 below), then Submit with a version note naming what changed.

## 3. GA4 setup (property G-BGFVBKTFPJ)

1. **Custom dimensions.** Admin > Data display > Custom definitions > Create custom dimension, scope Event, one per parameter: `cta_type`, `cta_location`, `share_platform`, `entry_id`, `entry_category`, `signup_location`, `read_percent`, `related_position`, `related_reason`, `faq_index`, `filter_category`, `search_location`, `random_location`, `module`, `position`, `page_path`. `search_term` is a GA4 built-in for the `search` event. `results_count` is better registered as a custom metric (Admin > Custom definitions > Custom metrics, scope Event, unit Standard). `content_group` needs no definition: GA4 reports it as "Content group".
2. **Key event.** Admin > Data display > Events: mark `newsletter_signup` as a key event (it can only fire once the newsletter is live).
3. **History-change page views off.** Admin > Data collection > Data streams > the web stream > Enhanced measurement > gear icon > Page views > Show advanced settings: untick "Page changes based on browser history events". The site has no client-side routing, so a script that rewrites the URL (a filter, a search box) would otherwise be counted as a page view. Record the date of this change in the baseline table, because page-view counts change from that day.
4. **Leave on:** scrolls (GA4's own 90% event), outbound clicks (citation clicks) and site search (`view_search_results` on loads of `/search/?q=`; the custom `search` event adds the result count and the 404 searches).
5. **Data retention: 14 months.** Admin > Data collection and modification > Data retention > Event data retention: 14 months. It affects explorations and funnel reports only; standard reports are not shortened. The privacy page states the retention ceiling; if this is ever set lower, update `src/pages/privacy.astro` in the same change.

## 4. Verifying the events

- GTM Tag Assistant Preview on the live site: each action in the table produces exactly one event, the GA4 event tag shows as fired (outside the EEA, UK and Switzerland), and the parameters are populated.
- GA4 Admin > DebugView shows the same events with their parameters.
- Spot checks that matter: a search containing an email address arrives as `[email]`; a failed newsletter submit produces no `newsletter_signup`; `blog_read_progress` 100 fires only at the end of the entry text, not at the colophon; a copy-link click with the clipboard blocked produces no `share_click`.
- From a DE or GB connection (VPN), no event tag fires (CONSENT.md, test 2).

## 5. The Search Console baseline

The domain property `sc-domain:strictly.fyi` covers the apex, www and every subdomain (DNS-verified at name.com). The canonical host moved from the apex to www on 2026-07-06, so early rows can carry apex URLs; `scripts/gsc.mjs` normalises them before joining pages to entries.

**Route A, the API** (after the one-time setup that `node scripts/gsc.mjs` prints when it has no credentials; `.gsc/` is gitignored):
```
node scripts/gsc.mjs sites                      # must list sc-domain:strictly.fyi
node scripts/gsc.mjs perf      --days 486       # totals, devices, countries, position bands, months
node scripts/gsc.mjs pages     --days 486
node scripts/gsc.mjs queries   --days 486
node scripts/gsc.mjs entries   --days 90        # department split, zero-impression entries
node scripts/gsc.mjs cannibal  --days 90
node scripts/gsc.mjs striking  --days 90
node scripts/gsc.mjs coverage                   # URL Inspection over the live sitemap, 2,000 a day
```
For a quarter, pass the exact window: `--start 2026-10-01 --end 2026-12-31`. CSVs land in `.gsc/exports/`. Windows end 3 days back because the newest days are still filling in.

**Route B, the UI export**, when API access is not set up: Search Console > Performance > Search results > Date: last 16 months (or the quarter) > Export > CSV. It holds Queries, Pages, Countries, Devices and Dates, each capped at 1,000 rows (the API pages 25,000 at a time). Indexing > Pages gives indexed against not-indexed counts and their reasons. Keep the files in `.gsc/exports/` with the export date in the name.

**What each baseline records:**
1. The window (first impression date, or quarter start, to the end date) and search type.
2. Impressions, clicks, CTR, and average position for desktop and mobile.
3. Pages indexed against submitted (Indexing > Pages, or `coverage`), and the not-indexed reasons with counts.
4. Pages and queries earning at least one click.
5. Monthly trend.
6. Position bands 1-3, 4-10, 11-20, 21-50, 51+ with impressions, clicks and CTR per band. Do the site's own bands show the cliff after position 3 that the sibling site measured?
7. Department split from `gsc-entries.csv`.
8. Batch cohorts by filecode range and pubDate: days to first impression, impressions per entry at 30, 60 and 90 days.
9. The SERP-proof audit: for entries whose /new-entry report recorded a small-site proof URL, the position they reached.
10. Country split (US, UK, IN at least) with CTR per country.
11. Cannibal pairs, entries with zero impressions, and anything Google canonicalised differently.

Caveats to carry into every reading: Google omits anonymised queries, so query rows never sum to the totals; average position is impression-weighted and easy to over-read; low-volume rows are noise, and a site this young will be thin for its first quarters, so do not refit strategy to one quarter.

## 6. Quarterly baseline

Append one row per quarter; never edit a past row. Empty cells mean not measured yet, not zero.

| Quarter | Window | Source (API / UI export) | Impressions | Clicks | CTR | Avg position desktop / mobile | Indexed / submitted | Pages with a click | Queries with a click | Impr. at 1-3 / 4-10 / 11-20 / 21-50 / 51+ | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-Q4 (first baseline) | | | | | | | | | | | |

Reader behaviour, once the GA4 events above are flowing (from the date the event tag was published):

| Quarter | Entry page views | blog_read_progress 100 per 1,000 entry views | share_click | related_click per 1,000 entry views | search (zero-result share) | newsletter_signup (only once live) | Notes |
|---|---|---|---|---|---|---|---|
| 2026-Q4 | | | | | | | |

## 7. Re-measure checklist

- [ ] Search Console access works (`node scripts/gsc.mjs sites` lists the property), or a UI export is in `.gsc/exports/`.
- [ ] Run the Route A commands (or the Route B export) for the quarter's exact window.
- [ ] Fill one new row in each table above; write the notes (what shipped that quarter, settings that changed, such as the history-change page-view switch).
- [ ] Append the quarter's findings as a dated section below; do not edit earlier sections.
- [ ] Feed the results into the work queue: striking-distance entries and overdue Review-ledger rows go to `/optimize-entry`; cannibal pairs and zero-impression entries get a look before any new entry on the same intent.
- [ ] Next due: the first baseline as soon as Search Console access works, then the first Monday of each quarter (next: 2027-01-04).

## Findings by quarter

(Append dated sections here.)
