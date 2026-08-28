# Writing tropes - the AI-tell rulebook for strictly.fyi

Source catalog: https://tropes.fyi (49 tropes). Enforced two ways:
mechanically by `scripts/lint-tropes.cjs` (run it, read the last line - `TROPE GATE: PASS` or `FAIL`),
and by judgment during the /new-entry Step 8 audit for the tropes a regex cannot see.
Adapted from the swapbiswas.com rulebook; the carve-outs below are this site's, not that one's.

## Hard rules (script FAILs)

- **Plain ASCII only.** No em/en-dashes, smart quotes, unicode arrows, bullets, or ellipsis characters. The house dash is a spaced hyphen (" - "), used sparingly. A double hyphen is an em-dash in disguise.
- **No signposted conclusions**: "In conclusion", "To sum up", "The bottom line", "All in all", "At the end of the day", sentence-initial "Ultimately,".
- **No stock AI phrases**: "Let's dive in", "Here's the kicker", "Think of it as", "It's worth noting", "It's no secret", "Imagine a world", "In today's [anything] landscape".
- **No model vocabulary**: delve, utilize, leverage (verb), robust, streamline, harness, tapestry, paradigm, synergy, ever-evolving, fast-paced, myriad, "a testament to", "cannot be overstated", load-bearing. No brochure words: seamless, effortless, all-in-one, best-in-class, "unlock the power".
- **No vague authority**: "studies show", "research suggests", "experts agree", "scientists say" with no named, linked source. Either name the source (and put it through the fact-check table) or attribute the claim honestly ("Aristotle concluded...", "the popular story says...").
- **Negative parallelism** ("It's not X. It's Y." / "X was never A; it was B.") - at most **two per entry**; a third fails. "Not X. Not Y. Just Z." is banned outright.
- **Magic adverbs capped at 3 per 1,000 words**: quietly, silently, subtly, deeply, fundamentally, genuinely, truly, certainly, remarkably, arguably, materially, wildly, "unusually [anything]". Replace with the number or detail that made the thing feel significant.
- **Manufactured rhythm**: at most 2 standalone fragment paragraphs; at most 1 run of three clipped sentences; no three consecutive sentences opening with the same words; no stacked self-posed drama questions ("The result? Devastating.") beyond one.
- **No invented Capitalized concept-labels** ("the X Paradox", "the Y Trap") dressed as established terms.
- **No HTML comments in shipped markdown** - they pass into production HTML.

## Judgment tropes (the script cannot see these - audit for them in Step 8)

Premise stacking, belaboring the obvious, self-echo (restating the thesis paragraph after paragraph), synonym cycling, one-point dilution, never-ending conclusion, comma-clipped tails ("..., openly.", "..., on purpose."), rule-of-three stacking, plain-text quotable one-liners, forced figurative language, whole-piece promotional register. Re-read the draft once specifically for these; "none across the board" on a first draft means the read was skipped.

## strictly.fyi carve-outs (deliberate house style, not tells)

- **"Strictly FYI."** - every entry ends with this two-word sign-off. The linter is patched to ignore it as a fragment. Do not spend one of the two allowed fragments on anything that competes with it in the same closing paragraph.
- **Assertive sentence-case H2s** ("The plague story, which nobody can source") are the house heading voice. The one head-question H2 ("How long is a moment?") with a direct answer beneath is the AEO surface and is always allowed. Editorial Wh-headings beyond those still warn at 3+ - vary them.
- **Voice is third-person curious narrator**, with "you" welcome and "we" meaning "people in general". No first-person operator persona - this site has no byline author speaking from experience, so no "In my experience" framing, ever. Authority comes from named sources, not from a narrator's résumé.
- **The debunk register**: naming a myth and labeling it folklore is the brand. Do it plainly and without sneering; never repeat the myth as fact in a heading or FAQ answer.
- One `>` blockquote pull-quote per entry is house furniture, not a "plain-text quotable one-liner" - but it must carry the entry's best verified insight, not a manufactured aphorism.

## How to run the gate

```
node scripts/lint-tropes.cjs src/content/blog/<slug>.md          # one entry
node scripts/lint-tropes.cjs --all                               # whole corpus, ranked
```

Exit 0 + `TROPE GATE: PASS` = pass (WARNs allowed but each must be read and either fixed or defended in one line in the run report). Exit 1 = fix every FAIL and re-run. Exit 2 = tooling error, never a pass.
