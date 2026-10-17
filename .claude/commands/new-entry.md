---
description: Research a winnable question keyword and write a fully fact-checked, publish-ready Strictly FYI entry
argument-hint: [question or keyword] (optional - omit to pull the next item from the keyword backlog)
---

# File a New Entry for strictly.fyi

You are writing a new, publish-ready entry for **Strictly FYI** (Astro 5 static site at https://www.strictly.fyi). The site is a general-interest field guide to the fascinating: short, true, well-sourced answers to curiosity questions. The mission is to be the place that has the answer, so every entry targets a real question people type into Google and answers it completely.

**Topic:** $ARGUMENTS
_(If the line above is empty, this is a backlog run: pull the next uncovered item per Step 2 and honor the Step 4 checkpoint.)_
_Optional modes: lead with **"research only"** to run Steps 0-3 and stop at the Step 4 report (write nothing), or **"discovery"** to run only keyword discovery + the Step 12 backlog refill._
_More than one entry in this run? Read **Batch mode** at the end before Step 0._

Run autonomously. Seed a TodoWrite list with one item per step (0-12) and mark each done as you finish. Only stop at the one checkpoint marked below.

## Step 0 - Read the house first
- Read `src/content.config.ts` (the frontmatter schema is the law), `src/data/site.ts` (the six departments and their notes), and the **2 newest posts** in `src/content/blog/` in full - they are the voice reference. Note each one's opening device and structure for the Step 5 anti-sameness check.
- Read the keyword backlog at `~/.claude/projects/c--Website-strictly-fyi/memory/project_keyword_backlog.md` (Claude persistent-memory dir, NOT the repo). It holds screened candidates, the footprint log and the Review ledger.
- House identity, from the About page, enforced as gates below: **short and complete; actually true; plain English; the "huh" test**.

## Step 1 - Fit gate (the "huh" test)
Answer in one sentence: **"Does the answer to this question make a curious person think 'huh, I didn't know that'?"**
- Must fit one of the six departments: science, history, tech, culture, everyday, curiosity.
- Must be **evergreen** - no news, no celebrities, no year-stamped events, no product/brand questions, no local queries.
- **No advice YMYL.** The site explains, it does not advise. "Why do we get brain freeze" is in (explanation); "can you take tylenol with X", "can dogs eat Y", symptom checkers, drug, legal, and money questions are out - those SERPs demand medical/legal authority the site does not claim, and they are off-brand.
- If the topic fails, say why and propose a better-fit reframe before spending research.

## Step 2 - Dedup gate, then pick the keyword
**Dedup (mechanical, before anything else).** For each head term of the candidate (2-3 core words):
```
grep -ril "<head term>" src/content/blog/
```
For every match, read that file's H2s and FAQ questions (`grep -nE "^#|q:" src/content/blog/<match>.md`) - a synonym answered as a section or FAQ inside another entry is cannibalization even when no slug matches. ~60%+ overlap on the same intent -> STOP and run `/optimize-entry <that slug>` instead. Adjacent but distinct question -> proceed and plan the interlink both ways.

**First-party data, when it exists.** If `.gsc/exports/gsc-queries.csv` or `gsc-cannibal.csv` is present (from `node scripts/gsc.mjs queries` / `cannibal`, see MEASUREMENT.md), check the candidate against them: an existing entry already earning impressions for this query is an optimize job, not a new URL.

**Keyword sourcing, in priority order:**
1. **Ahrefs CSV exports** in `~/Downloads` (UTF-16 tab-separated; convert with `iconv -f UTF-16LE -t UTF-8`). Columns of interest: Keyword, Difficulty, Volume, Traffic potential, SERP Features, Intents, Category.
2. **Ahrefs MCP** (`keywords-explorer-overview`, `keywords-explorer-matching-terms`) when units allow.
3. **WebSearch live SERP reading** when neither is available - who ranks is the best free predictor. Never scrape a search-engine results page with WebFetch or a script: the engines flag the home IP.

**Screen:** KD <= 5 (ideal 0-2), exact US volume >= 500 or a question cluster totaling >= 1,500, Informational + Non-branded intent, and a SERP that shows **People Also Ask and/or a featured snippet** (the AEO surface a new site can actually win).

**The KD trap (do not skip).** A low KD only means the ranking URLs have few backlinks. A KD 0 on a SERP that is wall-to-wall Wikipedia, Healthline, and Britannica, or that Google answers itself with a knowledge card, calculator, or unit converter, is closed to this site no matter what the number says. Unit-conversion, date, and "what time does X open" queries are the standing example: huge volume, KD 0, zero chance. KD screens candidates in for a look; only Step 3 screens them in for writing.

## Step 3 - SERP verdict ("Our angle")
WebSearch the exact keyword and WebFetch the top 2-3 ranking pages. Build:

| What ALL of them cover | What NONE cover well | Our angle |
|---|---|---|

**Winnability (hard gate).** A `winnable` verdict requires **at least one page-1 result from a small or independent site** (a personal blog, a niche site, a forum answer ranking on its own) - that page is the existence proof that Google will seat a small domain on this SERP. No such page -> `reframe` (narrower long-tail / pure AEO snippet play) or `drop`. Record the proof URL.
**Format:** note the snippet shape if one shows (paragraph / list / table) - Step 6 matches it. Record one verdict: **winnable / reframe / drop**.

## Step 4 - Checkpoint (only if no explicit topic was given)
If invoked with a topic, proceed. If this was a backlog/auto pick and the top candidates are close, present keyword + volume + KD + verdict + angle in 5 lines and get a confirm. Pre-authorized runs ("write the next one", "run the backlog") skip the pause.

## Step 5 - Archetype + footprint
Site archetypes: **"Why does/do X"** (the workhorse) / **"What is X / How long is X"** definitional (strongest AEO) / **"How does X work"** mechanism / **"Do we need X"** contrarian.
Check the openings of the 3 newest posts (Step 0 notes). Pick an **opening device that differs from the last 2**: cold-open scene, myth-first ("the story everyone tells"), single startling fact, reader-POV question, historical artifact. Never open two consecutive entries the same way, and never open with a definition dump.

## Step 6 - Research + verify, then write
**Research:** collect the real explanation from **primary or authoritative sources** (original studies, museums, .gov/.edu, the actual historical text). WebFetch every source and confirm the claim is on the page. The site's brand is *actually true*: where a popular myth exists, the entry names it and labels it a myth - that IS the differentiation (see the barns, bless-you, and QWERTY entries).

**File:** `src/content/blog/<keyword-hyphenated>.md` - the slug should read as the question.

**Frontmatter** (schema in `src/content.config.ts`):
- `title` - **hard ceiling 60 characters**, keyword front-loaded, count before moving on. Entries render the title verbatim, so this count is exactly what a search result truncates. Curiosity allowed after the keyword ("How Long Is a Moment? It Used to Be Exactly 90 Seconds").
- `description` - **140-165 characters**, a real sentence with the keyword used naturally, earns the click, no fragment.
- `pubDate` - today. Never backdate. No `updatedDate` on a new entry.
- `category` - one of the six, exactly as in the schema enum. Check the category spread (`grep -h "^category:" src/content/blog/*.md | sort | uniq -c`) and prefer an underfilled department when the topic honestly fits two.
- `filecode` - next in the `FYI-NNN` sequence (`grep -h filecode src/content/blog/*.md | sort` to find the highest; in a batch, the orchestrator assigns them).
- `featured: false` - featuring is the operator's call, never the pipeline's.
- No `readingTime`. Reading time is computed from the body at build time (`src/lib/entries.ts`), so a typed value can no longer drift from the text; the gate warns if you add one.
- No `lead`. `lead: true` pins an entry as the front-page lead, and only while it belongs to the newest filing date (a pin on an older date is ignored). It is the operator's call, set on purpose and by hand, never by this pipeline.
- `faqs` - **3-5 real questions mirroring the SERP's People Also Ask**, each answered in 1-3 complete sentences that stand alone (they feed FAQPage schema and are the AEO payload). Fold secondary cluster keywords in here. Answers are plain text: no links, no markdown.
- `almanac` - written in Step 6b, after the body.

**Body rules (the voice is the moat):**
- 700-1,200 prose words (the trope linter's count). Every entry earns its length; explain the whole idea, then stop.
- **Plain ASCII only. No em-dashes, no en-dashes, no smart quotes, no unicode arrows, no ellipsis character, no check marks.** The house substitute is a spaced hyphen (" - ") used sparingly, or a comma, or a period. Write accented names flat: Reaumur, cafe, Perigord.
- Open with the Step 5 device. **If the answer-box play is on** (definitional archetypes, or the SERP shows a snippet): the first section delivers the direct answer in a snippet-liftable shape matching the Step 3 shape - 40-60 words of prose for a paragraph snippet, a compact list or table otherwise.
- H2s are sentence-case and assert something ("The plague story, which nobody can source"), except one H2 phrased as the head question with the concise answer as its first sentence.
- Short paragraphs (2-3 sentences). **Bold the key facts and numbers.** One `>` blockquote pull-quote carrying the single best insight. A small table where a comparison genuinely helps. No images - the entries are typographic. No HTML comments - they ship to production.
- **Cite inline, in the sentence that makes the claim.** A quote or a figure goes in the same sentence as the link to the page that says it, and figures in link text must be on that page: the claim gate (Step 7) checks exactly this, and a citation borrowed from the next sentence can only ever come back REVIEW.
- Where a myth circulates, give it its own section and label it honestly (folklore, unverified, backwards-assembled). Never repeat a myth as fact; never debunk with a sneer.
- **No AI tells.** The full rulebook is `.claude/writing-tropes.md` (49 tropes from tropes.fyi with this site's carve-outs) - read it before drafting and write to it from the first sentence rather than patching at the gate. The heaviest hitters: no "Let's dive in" / "Here's the kicker" / "It's worth noting" / "In conclusion"; no delve/leverage/robust/tapestry/seamless; no "studies show" without a named linked source; negative parallelism at most twice; magic adverbs (quietly, genuinely, truly, remarkably...) capped at 3 per 1,000 words; no reasoning-leak phrases ("which is to say", "to be clear", "it is worth being precise"); at most 2 fragment paragraphs (the "Strictly FYI." sign-off is exempt).
- **Internal links:** 2-3 contextual links to related entries (`/blog/<slug>/`, relative, trailing slash), verified to exist. Anchor text natural, never exact-match keyword stuffing.
- Close with a short kicker paragraph that lands the "huh", ending with the sign-off sentence ending in **"Strictly FYI."** (house convention - see every existing entry).

## Step 6b - The almanac line
The front page runs a one-line almanac drawn from the entries. Write it last, from the finished body:
- **Lifted verbatim from the entry's own verified text, or a faithful trim of one of its sentences.** Never a new claim, never a fact the body does not carry, never a stock "did you know".
- **At most 150 characters**, plain ASCII, no markdown, no link.
- **Readable with no context**: it names its subject ("Tawny owls..." not "They..."), and it carries the "huh".
- Written as `almanac: "..."` in the frontmatter, double-quoted.

The gate warns when fewer than 80% of its words appear in the entry; treat that as a rewrite, not a defend.

## Step 7 - Fact-check table + claim gate (mandatory)
| Claim | Source URL | On the exact page? | Action |
|---|---|---|---|

WebFetch each URL and confirm the exact figure/claim appears (search snippets are NOT verification). Trace to the primary source. Re-open the 2-3 load-bearing sources in a fresh pass. Anything that fails is **removed, not softened**. Grep the headline stat across `src/content/blog/*.md` - no single number may lead two entries.

Then run the claim gate, which fetches every cited page and checks each quote, each figure in link text and each superlative against it:
```
node scripts/lint-claims.cjs src/content/blog/<slug>.md
```
Read the LAST line:
- `CLAIM GATE: PASS` (exit 0) - every checkable claim is on its page.
- `CLAIM GATE: REVIEW` (exit 0) - nothing failed, but some claims could not be checked mechanically (a bot-walled host such as etymonline, a lending-only archive.org book, a PDF, a citation borrowed from another sentence, a causal frame). Resolve every REVIEW line in the fact-check table by reading the page yourself. A REVIEW that comes from a borrowed citation is fixed by moving the link into the sentence. Record a claim that no script can ever reach (BOT_WALL, LENDING_ONLY, PDF, PAYWALL, OCR_FUZZY, JS_RENDERED, DERIVED) as a line in `VERIFICATION_LEDGER.md`, with how you verified it and the date.
- `CLAIM GATE: FAIL` (exit 1) - a cited page was read and the claim is not on it. Quote the page exactly, put the figure the page gives, or cite the page that says it. Re-run.
- Exit 2 = tooling error, never a pass.
When a JavaScript-rendered or blocked page keeps a unit flaky, restructure the sentence (a blockquote plus a separate attribution) rather than delete the fact.

## Step 8 - People-first audit (in writing, in the report)
1. Does it pass the "huh" test - which sentence is the huh?
2. Is the answer complete - will the reader need to search again?
3. Is every factual claim sourced or explicitly labeled folklore?
4. Read the first 3 sentences next to the previous 2 entries' openings - same move? Rewrite before shipping.

## Step 9 - Reciprocal links (de-orphaning)
Edit **2-3 existing related entries** to add one natural contextual sentence linking to the new entry. Do not touch their frontmatter, and never their dates. For ranked host candidates:
```
node scripts/link-audit.mjs --target=<slug>
```
It lists who links in, the anchors used, and five hosts ranked by topical similarity that do not link yet. A suggestion is a hint: never manufacture a link from an irrelevant entry. After the edits, re-run it: inbound must read **2 or greater**. Then `node scripts/link-audit.mjs --quiet` must end `LINK AUDIT: PASS` (no orphan, broken link or self-link anywhere).

## Step 10 - Gates + build (verify by output, never by intent)
Run in the Bash tool from the repo root (PowerShell prints nothing on a missing grep, which reads as a pass); interpret by exit code and last line, never by "looks empty":
1. **Entry gates:** `node scripts/gates.cjs src/content/blog/<slug>.md` - one runner for the frontmatter shape, title and description bands, filecode format and uniqueness, FAQs (3-5, complete, 1-3 sentences each), the almanac, plain-ASCII punctuation, HTML comments, images, the head-question H2, the pull-quote, the sign-off, 700-1,200 prose words, every `/blog/` link resolving in the house form, outbound 2-4, inbound 2 or more, at least 3 external sources, and the trope gate (it runs `scripts/lint-tropes.cjs` itself). Read the LAST line: `GATES: PASS` (exit 0) = pass; `GATES: FAIL` (exit 1) = fix every FAIL line and re-run; exit 2 = tooling error, NOT a pass. WARN lines do not block, but each must be read and either fixed or defended in one line in the Step 11 report (`node scripts/lint-tropes.cjs <file>` shows the trope WARN lines in full). The judgment tropes no script can see are the Step 8 audit's job.
2. **Claim gate:** re-run Step 7's command on the final text; it must not end `FAIL`.
3. **Source rule, if you touched anything outside the entry:** `node scripts/check-ascii.cjs` must end `ASCII CHECK: PASS`.
4. **Build:** `npm run build` completes clean; confirm `dist/blog/<slug>/index.html` exists. Open `dist/og/<slug>.png` and look at it: the headline sets in 2-3 lines with nothing clipped. The build log prints `[og] <id>: the title has characters the card fonts lack` if a title needs glyphs outside the card fonts.
5. **Built-output contract:** `npm run check` - its last line must read `DIST CHECK: PASS`. It reads what readers and Google receive: one title, description and h1 per page, one parseable JSON-LD graph, canonicals, the sitemap against the indexable pages (with lastmod on every entry), internal links, social cards, no HTML comments and no banned characters outside entry prose.
Max 3 fix passes; still failing -> halt and escalate. Never self-attest.

## Step 11 - Backlog + report
Update `~/.claude/projects/c--Website-strictly-fyi/memory/project_keyword_backlog.md`: mark the keyword written, file new candidates surfaced during research into the right tier, append the footprint row (`slug | archetype | opening device | answer-box y/n | filecode`), and append a Review-ledger row (`slug | filecode | status new | review_due = pubDate + 28 days | last_checked | gap fixed | updatedDate bumped | position`) for `/optimize-entry` to pick up. Keep the `MEMORY.md` pointer current.
**Report:** `<slug> | <verdict> | KD / vol / source`, angle, SERP proof URL, the last line of every gate as printed (`GATES`, `CLAIM GATE`, `LINK AUDIT`, `DIST CHECK`) with the WARN defenses, the full fact-check table with every REVIEW resolved, the almanac line, and the four audit answers. **Do not commit unless asked.**

## Step 12 - Backlog refill (discovery mode, or when the backlog runs dry)
Mine the freshest Ahrefs export in `~/Downloads` for question-shaped, evergreen, KD <= 5 candidates that pass Step 1, screen the top 10 through a quick SERP look, and file them into the backlog tiers with volume + KD + a one-line fit note.

## Batch mode (more than one entry in a run)
Big runs go in sequential batches of about six entries, each fully finished (written, verified, linked, built) before the next starts. The orchestrator owns everything shared; writers own one file each.
1. **Batch table before dispatch:** `slug | filecode | department | archetype | opening device letter | answer-box y/n`. Every device is distinct inside the batch and differs from the last two footprint-log rows. Pass the whole table to every writer.
2. **Writer scope:** a writer creates or edits only `src/content/blog/<slug>.md`. It never edits another entry, `src/pages`, `src/data`, scripts or memory files, and never runs a build. Anything else goes in its handoff as a recommendation.
3. **Handoff contract:** the last line of `node scripts/gates.cjs <file>`, every WARN marked fixed or defended, the last line of `node scripts/lint-claims.cjs <file>`, the fact-check table with each REVIEW resolved, and the ledger lines for claims no script can reach.
4. **The orchestrator re-runs every gate itself, on every file.** Writer agents report gate passes they do not have (one reported `CLAIM GATE: PASS` on a file that exited 1). Run `node scripts/gates.cjs <file>` and `node scripts/lint-claims.cjs <file>` for each entry, read the exit code and the last line, and send any mismatch back to a fixer. A self-reported PASS is never evidence.
5. **Fixer prompts lock** slug, filecode, department, pubDate and featured.
6. Re-run any reviewer that returns null or empty before its entry ships. When two reviewers disagree, fetch the source yourself and adjudicate; never just apply the later verdict.
7. **One linker agent**, serialized, with host files partitioned so two agents never edit one entry; then `node scripts/link-audit.mjs` must end `LINK AUDIT: PASS`.
8. The orchestrator appends ledger lines to `VERIFICATION_LEDGER.md` and rows to the backlog memory (shared files are never a writer's).
9. **Exactly one build per batch**, never while another build runs, then `npm run check` must end `DIST CHECK: PASS`. Measure corpus statistics only after the link pass.

## Guardrails
- Nothing self-attests: every gate is passed by running its command and reading real output.
- `pubDate` is immutable once published; `updatedDate` only on a genuine later refresh (new sourced content), because it renders a visible "Updated" line. Exception: correcting a factual error always moves `updatedDate` to the day of the fix, because /about/#corrections promises readers a visible Updated date. It also drives the sitemap lastmod, the BlogPosting dateModified and the IndexNow announcement, so never set it for a link or typo edit, and never derive it from build time or file mtime.
- A published slug never changes. If one must, the same change adds a `vercel.json` redirect `{"source": "/blog/<old>/", "destination": "/blog/<new>/", "permanent": true}` (slashed destination) and updates every inbound link. Never use Astro's `redirects` option: on a static build it writes 200 meta-refresh pages, not redirects.
- Local builds never submit to IndexNow; production deploys announce new and changed URLs automatically, as the last step of `npm run build` (`scripts/indexnow-deploy.mjs`, after check-dist passes). The first production deploy that ships the key file logs "skipped - not serving the key yet": once it is live, run `npm run indexnow:verify`, then `npm run indexnow:submit -- --all` once to seed the whole archive. After that, a skipped or failed batch is recovered with `npm run indexnow:submit`.
- Word counts are completeness floors, not padding goals.
- The site explains; it never advises. When in doubt about YMYL, drop the keyword.
- Never invent a fact, a source, or a historical detail. An entry with three verified facts beats one with ten impressive maybes.
