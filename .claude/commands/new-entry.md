---
description: Research a winnable question keyword and write a fully fact-checked, publish-ready Strictly FYI entry
argument-hint: [question or keyword] (optional - omit to pull the next item from the keyword backlog)
---

# File a New Entry for strictly.fyi

You are writing a new, publish-ready entry for **Strictly FYI** (Astro 5 static site at https://www.strictly.fyi). The site is a general-interest field guide to the fascinating: short, true, well-sourced answers to curiosity questions. The mission is to be the place that has the answer, so every entry targets a real question people type into Google and answers it completely.

**Topic:** $ARGUMENTS
_(If the line above is empty, this is a backlog run: pull the next uncovered item per Step 2 and honor the Step 4 checkpoint.)_
_Optional modes: lead with **"research only"** to run Steps 0-3 and stop at the Step 4 report (write nothing), or **"discovery"** to run only keyword discovery + the Step 12 backlog refill._

Run autonomously. Seed a TodoWrite list with one item per step (0-12) and mark each done as you finish. Only stop at the one checkpoint marked below.

## Step 0 - Read the house first
- Read `src/content.config.ts` (the frontmatter schema is the law), `src/data/site.ts` (the six departments and their notes), and the **2 newest posts** in `src/content/blog/` in full - they are the voice reference. Note each one's opening device and structure for the Step 5 anti-sameness check.
- Read the keyword backlog at `~/.claude/projects/c--Website-strictly-fyi/memory/project_keyword_backlog.md` (Claude persistent-memory dir, NOT the repo). It holds screened candidates and the footprint log.
- House identity, from the About page, enforced as gates below: **short and complete · actually true · plain English · the "huh" test**.

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
For every match, read that file's H2s and FAQ questions (`grep -nE "^#|q:" src/content/blog/<match>.md`) - a synonym answered as a section or FAQ inside another entry is cannibalization even when no slug matches. ~60%+ overlap on the same intent -> STOP and recommend optimizing that entry instead. Adjacent but distinct question -> proceed and plan the interlink both ways.

**Keyword sourcing, in priority order:**
1. **Ahrefs CSV exports** in `~/Downloads` (UTF-16 tab-separated; convert with `iconv -f UTF-16LE -t UTF-8`). Columns of interest: Keyword, Difficulty, Volume, Traffic potential, SERP Features, Intents, Category.
2. **Ahrefs MCP** (`keywords-explorer-overview`, `keywords-explorer-matching-terms`) when units allow.
3. **WebSearch live SERP reading** when neither is available - who ranks is the best free predictor.

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
- `title` - **hard ceiling 60 characters**, keyword front-loaded, count before moving on. Curiosity allowed after the keyword ("How Long Is a Moment? It Used to Be Exactly 90 Seconds").
- `description` - **140-165 characters**, a real sentence with the keyword used naturally, earns the click, no fragment.
- `pubDate` - today. Never backdate. No `updatedDate` on a new entry.
- `category` - one of the six, exactly as in the schema enum. Check the category spread (`grep -h "^category:" src/content/blog/*.md | sort | uniq -c`) and prefer an underfilled department when the topic honestly fits two.
- `readingTime` - words / 220, rounded, as `"N min read"`.
- `filecode` - next in the `FYI-NNN` sequence (`grep -h filecode src/content/blog/*.md | sort` to find the highest).
- `featured: false` - featuring is the operator's call, never the pipeline's.
- `faqs` - **3-5 real questions mirroring the SERP's People Also Ask**, each answered in 1-3 complete sentences that stand alone (they feed FAQPage schema and are the AEO payload). Fold secondary cluster keywords in here.

**Body rules (the voice is the moat):**
- 700-1,200 words. Every entry earns its length; explain the whole idea, then stop.
- **Plain ASCII only. No em-dashes, no en-dashes, no smart quotes, no unicode arrows.** The house substitute is a spaced hyphen (" - ") used sparingly, or a comma, or a period.
- Open with the Step 5 device. **If the answer-box play is on** (definitional archetypes, or the SERP shows a snippet): the first section delivers the direct answer in a snippet-liftable shape matching the Step 3 shape - 40-60 words of prose for a paragraph snippet, a compact list or table otherwise.
- H2s are sentence-case and assert something ("The plague story, which nobody can source"), except one H2 phrased as the head question with the concise answer as its first sentence.
- Short paragraphs (2-3 sentences). **Bold the key facts and numbers.** One `>` blockquote pull-quote carrying the single best insight. A small table where a comparison genuinely helps. No images - the entries are typographic.
- Where a myth circulates, give it its own section and label it honestly (folklore, unverified, backwards-assembled). Never repeat a myth as fact; never debunk with a sneer.
- **No AI tells.** The full rulebook is `.claude/writing-tropes.md` (49 tropes from tropes.fyi with this site's carve-outs) - read it before drafting and write to it from the first sentence rather than patching at the gate. The heaviest hitters: no "Let's dive in" / "Here's the kicker" / "It's worth noting" / "In conclusion"; no delve/leverage/robust/tapestry/seamless; no "studies show" without a named linked source; negative parallelism at most twice; magic adverbs (quietly, genuinely, truly, remarkably...) capped at 3 per 1,000 words; no reasoning-leak phrases ("which is to say", "to be clear", "it is worth being precise"); at most 2 fragment paragraphs (the "Strictly FYI." sign-off is exempt).
- **Internal links:** 2-3 contextual links to related entries (`/blog/<slug>/`), verified to exist. Anchor text natural, never exact-match keyword stuffing.
- Close with a short kicker paragraph that lands the "huh", ending with the sign-off sentence ending in **"Strictly FYI."** (house convention - see every existing entry).

## Step 7 - Fact-check table (mandatory)
| Claim | Source URL | On the exact page? | Action |
|---|---|---|---|

WebFetch each URL and confirm the exact figure/claim appears (search snippets are NOT verification). Trace to the primary source. Re-open the 2-3 load-bearing sources in a fresh pass. Anything that fails is **removed, not softened**. Grep the headline stat across `src/content/blog/*.md` - no single number may lead two entries.

## Step 8 - People-first audit (in writing, in the report)
1. Does it pass the "huh" test - which sentence is the huh?
2. Is the answer complete - will the reader need to search again?
3. Is every factual claim sourced or explicitly labeled folklore?
4. Read the first 3 sentences next to the previous 2 entries' openings - same move? Rewrite before shipping.

## Step 9 - Reciprocal links (de-orphaning)
Edit **2-3 existing related entries** to add one natural contextual sentence linking to the new entry. Do not touch their frontmatter dates. Verify mechanically:
```
grep -rl "/blog/<slug>/" src/content/blog/ | grep -v "<slug>.md" | wc -l
```
Must print **2 or greater** before Step 10.

## Step 10 - Gates + build (verify by output, never by intent)
Run in the Bash tool from the repo root; interpret by exit code, never by "looks empty":
- **Punctuation gate:** `LC_ALL=C.UTF-8 grep -nP "[\x{2012}-\x{2015}\x{2018}\x{2019}\x{201C}\x{201D}\x{2190}-\x{2194}]" src/content/blog/<slug>.md` - exit 1 = pass; lines printed = fix and re-run.
- **HTML-comment gate:** `grep -n "<!--" src/content/blog/<slug>.md` - exit 1 = pass. No comment ever ships in markdown.
- **Title/description gate:**
```
awk '/^---$/{n++; if(n==2) exit}
     /^title: /{t=$0; sub(/^title: /,"",t); gsub(/^"|"$/,"",t); print (length(t)<=60?"PASS":"FAIL")" title "length(t)}
     /^description: /{d=$0; sub(/^description: /,"",d); gsub(/^"|"$/,"",d); print (length(d)>=140&&length(d)<=165?"PASS":"FAIL")" description "length(d)}' src/content/blog/<slug>.md
```
Exactly two lines, both `PASS`.
- **Trope gate:** `node scripts/lint-tropes.cjs src/content/blog/<slug>.md` - read the LAST line: `TROPE GATE: PASS` (exit 0) = pass; `TROPE GATE: FAIL` (exit 1) = fix every FAIL line and re-run; exit 2 or "command not found" = tooling error, NOT a pass. WARN lines do not block, but each must be read and either fixed or defended in one line in the Step 11 report. The judgment tropes the script cannot see are the Step 8 audit's job.
- **Link floor:** re-run the Step 9 count, >= 2.
- `npm run build` completes clean; confirm `dist/blog/<slug>/index.html` exists.
Max 3 fix passes; still failing -> halt and escalate. Never self-attest.

## Step 11 - Backlog + report
Update `~/.claude/projects/c--Website-strictly-fyi/memory/project_keyword_backlog.md`: mark the keyword written, file new candidates surfaced during research into the right tier, and append the footprint row (`slug | archetype | opening device | answer-box y/n | filecode`). Keep the `MEMORY.md` pointer current.
**Report:** `<slug> | <verdict> | KD / vol / source` · angle · SERP proof URL · gates as measured (`title N chars | description N chars | inbound N | build PASS`) · the full fact-check table · the four audit answers. **Do not commit unless asked.**

## Step 12 - Backlog refill (discovery mode, or when the backlog runs dry)
Mine the freshest Ahrefs export in `~/Downloads` for question-shaped, evergreen, KD <= 5 candidates that pass Step 1, screen the top 10 through a quick SERP look, and file them into the backlog tiers with volume + KD + a one-line fit note.

## Guardrails
- Nothing self-attests: every gate is passed by running its command and reading real output.
- `pubDate` is immutable once published; `updatedDate` only on a genuine later refresh.
- Word counts are completeness floors, not padding goals.
- The site explains; it never advises. When in doubt about YMYL, drop the keyword.
- Never invent a fact, a source, or a historical detail. An entry with three verified facts beats one with ten impressive maybes.
