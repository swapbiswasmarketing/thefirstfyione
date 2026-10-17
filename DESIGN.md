# Strictly FYI design system - "The Broadsheet Ledger"

Single source of truth for how the site looks and behaves. Templates, the social-card renderer and every content pipeline follow it. If an older note disagrees, this file wins.

## 1. Concept

A broadsheet front page set as a ledger: warm newsprint, near-black ink, one highlighter-yellow accent, hairline rules doing the work borders and shadows usually do. Hierarchy comes from type size, rules and position, never from colour, cards or depth. Every number the page prints is computed from the archive, never typed.

Not this: shadows, rounded corners, gradients (the highlighter band is the one exception), pills, icons as decoration, images inside entries, auto-rotating content.

## 2. Tokens (src/styles/global.css)

| Token | Value | Role |
|---|---|---|
| `--paper` | `#f6f3ec` | page ground |
| `--paper-2` | `#fffdf7` | boxed items (almanac, filler, notice) |
| `--paper-deep` | `#ece8dd` | inline code, tinted cells |
| `--ink` | `#16171b` | text, rules, kick boxes (16.5:1 on paper) |
| `--ink-soft` | `#4a4b53` | deks, body secondary (7.8:1) |
| `--ink-faint` | `#6b6c75` | mono labels at 10-12px (4.8:1, the floor) |
| `--hl` / `--hl-deep` | `#ffe14d` / `#f2ce22` | the one accent: highlighter band, hover wash, focus wash |
| `--rule` / `--rule-mid` | ink at 14% / 26% | hairlines |

Motion: `--ease-out cubic-bezier(0.23, 1, 0.32, 1)`, `--t-hover 180ms`, `--t-press 130ms`. Layers: `--z-head 40`, `--z-float 60`, `--z-skip 90`, `--z-grain 100`.

## 3. Type

| Role | Family | Shipped |
|---|---|---|
| `--display` | Playfair Display | roman and italic variable files, 400-900 (Google's latin files byte for byte: the family has a Reserved Font Name, so it is never subset or renamed) |
| `--serif` | Newsreader | roman wght 400-600, italic 400, both clipped to opsz 14-24 (subset by `scripts/fonts/subset-fonts.py`) |
| `--mono` | Space Mono | 400 only |
| `--sans` | system stack | loads nothing; Inter is gone |

- Files live in `src/assets/fonts/` and are referenced with relative `url()`, so Vite fingerprints them into `/_astro/` (immutable caching, automatic cache-busting). No preload: it measured worse on slow 4G.
- Each family has a metric-matched fallback face (`FYI Display Fallback`, `FYI Serif Fallback`, `FYI Mono Fallback`) built on Georgia and Courier New with size-adjust and ascent/descent overrides, so the swap does not reflow text. Re-tune them if a family or its weights change.
- Newsreader is set between 14 and 24px. To use it outside that range, widen the opsz clip in the subset script first.
- Use `rem` for measures and columns, never `ch`: `ch` changes size when the web font swaps in and shifts the layout.
- Space Mono has no bold. Mono labels that inherit a heading weight must set `font-weight: 400`.

## 4. Characters

- Source text and templates are plain ASCII: no em or en dashes, smart quotes, unicode arrows, bullets, ellipsis characters or check marks. The house dash is a spaced hyphen. `scripts/check-ascii.cjs` enforces this on `src/`, and `scripts/check-dist.mjs` on the built chrome.
- Allowed typographic ornaments, written as HTML entities: `&middot;` `&sect;` `&#8470;` `&copy;`. Hide decorative ones from assistive tech (`aria-hidden="true"`) when they would run into a name ("&sect;01Science").
- Astro's SmartyPants is on, so entry prose renders curly quotes from straight-quoted source. That is accepted typography in rendered prose only.
- CTAs carry no arrow glyphs. An action reads as a bracketed coupon: `[ Pull a random file ]`.

## 5. Components

- **Section frame (`.shead`)**: 3px ink rule over a grid of kick box (ink fill, paper text, mono 0.6rem), the real `h2` (Playfair 700) and a right-aligned mono folio, closed by a 1px ink rule.
- **Label head (`.label-head`)**: a mono uppercase `h2` over a 1px ink rule, for rails and lists. Reset the global heading styles on it.
- **Ledger row**: filecode column (mono), then department kicker (mono), title (Playfair 600, an `h3`), and optional dek and reading time. The title's link stretches over the row with `::before { position: absolute; inset: 0 }`; focus is drawn on that pseudo-element. `src/components/LedgerRow.astro` is the shared version for the archive, topics, search and 404.
- **Coupon button**: mono text in square brackets, highlighter wash on hover, `scale(0.985)` on press.
- **Highlighter**: `.hl` static band (52%-90% of the line), `.hl-live` swipes once on load. Ink text only: the half-height band cannot carry light text.
- **Boxed item**: 1px ink border on `--paper-2` with a mono header strip (the almanac, the 404 filler, the entry notice).
- **Tables**: `src/lib/rehype-tables.mjs` wraps every markdown table in `div.table-wrap[role=region][tabindex=0][aria-label]` and marks all-figure columns with `.num`. The entry template styles them as ruled ledgers; the wrapper scrolls sideways on phones. The class names are a contract with `scripts/check-dist.mjs`.
- **SubscribeForm**: renders the honest feed fallback while `kitFormId` is empty. Copy around it must not promise a newsletter or a cadence unless `newsletterLive` is true.

## 6. Front page (src/pages/index.astro)

- **Masthead** goes in the Layout's `masthead` slot, so it is the banner landmark and the skip link lands past it. The `h1` is the nameplate and is not a link on `/`.
- **Nameplate**: one line, `white-space: nowrap`, sized from the viewport and solved for the widest fallback (7.16em of plain Georgia Bold; Playfair is 6.57em): `min(8.25rem, calc(12.6vw - 30px))` beside the meta column, `12.6vw` when stacked.
- **Dateline and counts** come from `edition()`: volume from calendar years since the first entry, number from distinct filing dates, "Last filed" from the newest pubDate. Never `new Date()` for anything a reader sees as a date.
- **Lead**: the newest filing. `lead: true` pins an entry only while it belongs to the newest filing date, so an old pin can never freeze the page.
- **One pool**: every module takes entries through the shared `take()` with a `shown` set, in this order: lead, secondary (4), edition rail (8), question desk (3 per interrogative), start here (featured, then most-cited), departments (3 each). No entry appears twice.
- **Almanac**: one line per entry from the `almanac` frontmatter. An inline script picks the line for the reader's day (`Date.now() / 864e5 % n`) before paint; "Another fact" advances on click. Nothing rotates by itself (WCAG 2.2.2).
- **Follow**: feed first while there is no newsletter; the `#subscribe` and `#index` anchors stay for links already in the wild.

## 7. Motion

Content is visible without script; script only arms motion. Animate `transform` and `opacity` only, with the house easing. The highlighter swipe and the list stagger run once. Under `prefers-reduced-motion` movement goes and opacity changes stay. No timers that change content.

## 8. Layout stability

- `.cv-auto` (content-visibility) with a measured `--cv-size` is for full-width blocks below the fold: the colophon, the related block, archive rows. Never on `.prose`, `.toc`, `.faq`, anything above a `#fragment` target, grid or flex items sized by content, or blocks holding form fields.
- Swapped content stays the same height (the 404 filler stacks every line in one grid cell) or changes only on a click.
- The `[hidden]` rule is `display: none !important`, so a component's own `display` never resurrects a hidden element.

## 9. Accessibility

Landmarks: banner (masthead or running head), main, contentinfo. One `h1` per page; modules are `section`s with an `h2`, items are `h3`. Visible focus everywhere (`:focus-visible` 2px ink). Hover styles live inside `@media (hover: hover) and (pointer: fine)`. Live regions: the almanac figure and the search status line.

## 10. Metadata and measurement conventions

- One JSON-LD `@graph` per page through the Layout's `schema` prop (`src/lib/schema.ts`). The publication is the Organization; there is never a Person.
- One social card per page through `src/lib/og.ts`; bump `CARD_DESIGN` in `src/lib/og/spec.ts` after any card redesign so cached previews refresh.
- Entry titles carry no brand suffix. Every internal URL ends with a slash. `noindex` pages leave the sitemap automatically.
- Clicks are tracked with `data-track="event"` plus `data-track-*` attributes; scripts call `track()` from `src/lib/track.ts`. The event list lives in MEASUREMENT.md; consent behaviour in CONSENT.md.

## 11. Code house rules

- No HTML comments in `.astro` templates (they ship); use `{/* */}` or comments inside frontmatter, style and script.
- Elements created with `document.createElement` miss Astro's scoped styles: render markup (or a `<template>`) and toggle classes.
- Comments explain why, in short blocks, in plain ASCII.
