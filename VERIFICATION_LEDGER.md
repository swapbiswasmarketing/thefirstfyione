# Verification ledger

Claims verified by hand because no script can reach their source. `scripts/lint-claims.cjs` reads this file and reports a matching REVIEW as LEDGERED. Every line needs a reason code, how it was verified and the date; re-check lines older than six months.

Reason codes: BOT_WALL, LENDING_ONLY, PDF, PAYWALL, OCR_FUZZY, JS_RENDERED, DERIVED.

Format, one section per entry and one line per claim (the template below is indented, so the parser ignores it):

    ## <slug>
    - "<claim text as in the entry>" | <cited URL as linked> | <CODE> | <how verified> | <YYYY-MM-DD>

Real sections start with `## the-slug` at the start of a line, followed by one `- ` line per claim.
