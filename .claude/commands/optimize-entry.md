---
description: Improve one existing Strictly FYI entry by fixing one diagnosed gap, judged against a pre-edit baseline
argument-hint: [slug] (optional - omit to take the top of the Review ledger, the Search Console queue or the debt queue)
---

# Optimize One Existing Entry on strictly.fyi

An existing URL that already has an index history and inbound links is usually worth more than a new one. This command takes **one** entry, finds **one** gap with evidence, fixes only that gap in the entry's own voice, and proves with a pre-edit baseline that nothing else got worse. Optimize; never rewrite.

**Target:** $ARGUMENTS
_(Empty means pick one per Step 1.)_

Run autonomously. Seed a TodoWrite list with one item per step (0-8). Run every command in the Bash tool from the repo root and read the exit code and the last line; PowerShell prints nothing on a missing grep, which reads as a pass.

## Step 0 - Read the house first
- `src/content.config.ts` (the schema), `.claude/writing-tropes.md` (the voice rules and carve-outs), and Steps 6, 6b, 7 and 10 of `.claude/commands/new-entry.md` (the body rules, the almanac, the claim gate and the gates). The entry must still meet them after your edit.
- The keyword backlog at `~/.claude/projects/c--Website-strictly-fyi/memory/project_keyword_backlog.md`, in particular its `## Review ledger` table (`slug | filecode | status | review_due | last_checked | gap fixed | updatedDate bumped | position`). Create the heading if it is missing.

## Step 1 - Pick ONE entry
In this order:
1. **The slug argument**, if given.
2. **An overdue Review-ledger row** (`review_due` in the past, oldest first).
3. **Search Console data, when it exists** (first-party only; see MEASUREMENT.md for setup). `node scripts/gsc.mjs striking --days 90` lists query x page rows at positions 5-25, and `node scripts/gsc.mjs entries --days 90` joins pages to filecodes. Choose by distance to the top three (an entry at positions 4-15 with real impressions), not by raw impressions: on the sibling portfolio site, almost every click went to positions 1-3. Check whether this site shows the same with the position bands of `node scripts/gsc.mjs perf`. A manual export from the Search Console UI (Performance > Pages and Queries) dropped in `~/Downloads` works too; it caps each table at 1,000 rows. Third-party rank (Ahrefs, Semrush) is a weak hint, never the diagnosis.
4. **Otherwise, debt mode:** `node scripts/gates.cjs --all --rank` prints the queue (3 per failing gate, 3 for no external citation at all, 1 for inbound links at the floor, 1 for trope WARNs; ties go to the oldest filing). Take the top row. Expect debt mode for months: the site is young and Search Console data is thin.

State the pick and why in one line.

## Step 2 - Baseline before touching anything
Snapshot the entry exactly as it stands, in a scratch folder, keeping the **same file name** (the trope linter matches baselines on the basename):
```
mkdir -p <scratch>/base
git status --short src/content/blog/<slug>.md      # empty: the file matches HEAD
git show HEAD:src/content/blog/<slug>.md > <scratch>/base/<slug>.md       # when clean
cp src/content/blog/<slug>.md <scratch>/base/<slug>.md                    # when it has uncommitted edits
node scripts/gates.cjs <scratch>/base/<slug>.md --mode=existing --json > <scratch>/base/<slug>.gates.json
node scripts/lint-tropes.cjs <scratch>/base/<slug>.md --json > <scratch>/base/<slug>.tropes.json
node scripts/lint-claims.cjs <scratch>/base/<slug>.md --json > <scratch>/base/<slug>.claims.json
node scripts/link-audit.mjs --target=<slug>
```
Exit 1 from these is expected (the baseline records existing debt); exit 2 is a tooling error to fix first. The gates baseline also carries the trope results, so `--baseline` in Step 6 covers both.

## Step 3 - Evidence, then ONE gap
- **The entry's own search data**, when Search Console is set up: `node scripts/gsc.mjs queries --page <slug> --days 90` (the queries it earns, with position) and `node scripts/gsc.mjs cannibal --days 90` (is another entry splitting its query?).
- **The live SERP:** one WebSearch for the head question (the session cap is 200, so spend it deliberately) and WebFetch the top 2-3 results. Note the People Also Ask questions and the snippet shape. Never fetch a search-engine results page with WebFetch or a script.
- **The baseline output** from Step 2.

Diagnose exactly **one** gap from this menu, and state the evidence:
- **Claims without sources:** numbers or quotes with no linked primary source (the claim gate's REVIEW lines, or `citations: no external citation at all`). Fix: link a primary source for each, or label the claim folklore.
- **Claim gate findings:** a quote not on its page, a figure in link text the page does not carry, a citation borrowed from another sentence. Fix: quote the page exactly, correct the figure, move the link into the sentence.
- **Thin against the SERP:** under 700 prose words, or a question the top results answer that this entry skips.
- **Answer shape:** no head-question H2, or an answer box in the wrong shape for the snippet the SERP shows.
- **Title or description:** outside its band (60 / 140-165 characters), or a weak click-through at a good position in the entry's own Search Console data.
- **FAQs that do not mirror the live PAA.**
- **A myth repeated without a label, or a record that has since changed.**
- **Under-linked:** inbound at the floor (2). Fix with Step 5.
- **Reads machine-written:** trope FAILs such as "Here is the part".

## Step 4 - Apply only that change
- Edit in the entry's voice; keep its structure, its opening device and its sign-off.
- **Locked, never changed:** slug (the file name), filecode, category, pubDate, featured, lead. The gate's field lock fails on the first four.
- Pre-existing FAILs outside the text you touch are reported, not rewritten. They show as `FAIL-OLD` in Step 6 and are candidates for a later pass.
- Every new fact goes through the Step 7 fact-check table of new-entry.md: WebFetch the page and confirm the exact figure or quote is on it.
- If the almanac line quotes text you changed, re-lift it from the new text (Step 6b of new-entry.md).

## Step 5 - Freshness and links
- **updatedDate** moves to today only when new sourced facts or a new section ship. Never for link-only, title or description, FAQ reorder, schema, typo or de-slop edits: the template prints a visible "Updated" line and a dateModified, so a cosmetic bump is a false freshness claim. Exception: correcting a factual error always moves updatedDate to the day of the fix, however small the edit, because /about/#corrections promises readers a visible Updated date. **Never touch pubDate.**
- **Reciprocal links**, when the gap is under-linking: `node scripts/link-audit.mjs --target=<slug>` ranks hosts that do not link yet. Add one natural sentence to 1-2 related hosts (never their frontmatter or dates), and only where the link helps a reader of that host.

## Step 6 - Gates (verify by output)
1. `node scripts/gates.cjs src/content/blog/<slug>.md --mode=existing --baseline=<scratch>/base/<slug>.gates.json` must end `GATES: PASS`. Pre-existing failures print as `FAIL-OLD` and do not block; any `FAIL` is new and must be fixed.
2. `node scripts/lint-tropes.cjs src/content/blog/<slug>.md --baseline=<scratch>/base/<slug>.tropes.json` must end `TROPE GATE: PASS` with **0 NEW FAIL**; defend or fix each NEW WARN in one line.
3. `node scripts/lint-claims.cjs src/content/blog/<slug>.md` must not end `CLAIM GATE: FAIL`. Compare its REVIEW lines with `<slug>.claims.json`: every new REVIEW is resolved in the fact-check table, and claims no script can reach go to `VERIFICATION_LEDGER.md`.
4. Each host you edited: `node scripts/gates.cjs src/content/blog/<host>.md --mode=existing` shows no new FAIL against its state before your sentence (baseline it the same way if it already carries debt).
5. `node scripts/link-audit.mjs --quiet` ends `LINK AUDIT: PASS`.
6. `npm run build`, then `npm run check`: the last line must read `DIST CHECK: PASS`.
Exit 2 from any of them is a tooling error, never a pass. Max 3 fix passes, then halt and escalate.

## Step 7 - Ledger + report
Update the entry's Review-ledger row: status `optimized`, `last_checked` today, the gap fixed, updatedDate bumped y/n, `review_due` today + 28 days, and the position if Search Console gave one.
**Report:** `slug | gap | evidence (Search Console, SERP, PAA) | updatedDate moved? why | GATES / TROPE GATE / CLAIM GATE / LINK AUDIT / DIST CHECK last lines | pre-existing FAILs left for later`. **Do not commit unless asked.**

## Step 8 - Guardrails
- One gap per pass. A second gap is a second pass, with its own baseline.
- Optimize, never rewrite: a full rewrite throws away what the URL has earned.
- No new entry when an existing one owns the intent; no rewrite toward a head term without that page's own Search Console data.
- Diagnose from first-party data or the live SERP, never from a third-party traffic estimate alone.
- FAQ rich results ended in May 2026: FAQs earn their place as the answers readers and answer engines lift, not as a snippet play.
- Nothing self-attests: a gate passes when its command prints PASS, not when it should.
