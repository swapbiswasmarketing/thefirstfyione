# Social

How Strictly FYI appears on social platforms: which accounts, what the profiles say, which images they use, how posts are made, and what the site changes once the accounts exist. The accounts speak only as the publication, the same as the site: no personal name, photo or bio anywhere.

## Accounts

| Platform | Handle | Profile URL |
|---|---|---|
| X | `@strictlyfyi` | https://x.com/strictlyfyi |
| Bluesky | `@strictly.fyi` (sign up as `strictlyfyi.bsky.social`, then switch, see below) | https://bsky.app/profile/strictly.fyi |

Both accounts were created on 2026-10-31 with the site's contact address, and both profiles were set up the same day with the copy and images below. The Bluesky account's DID is `did:plc:3cun4nqezggfgy52i5o3ncqi`; the DID stays the same if the handle ever changes. Display name on both: `Strictly FYI`. A sign-up through "Continue with Google" copies the Google account's personal name into the profile, so check the name before the first post. Turn on two-factor authentication on both.

## Profile copy

X bio (157 of 160 characters), website field `https://www.strictly.fyi`, no location:

> One question per entry, answered from the sources and linked to them. Science, history, tech, culture and everyday curiosities. Mistakes corrected in public.

Bluesky description (195 of 256), with `https://www.strictly.fyi` in the profile's Links field, titled `strictly.fyi`:

> A field guide to the fascinating. Each entry answers one question in science, history, tech, culture or everyday life, and links the sources behind what it says. Mistakes are corrected in public.

Pinned post on both (its sentences are the ones /how-we-work/ uses):

> Strictly FYI answers one question per entry and links the sources behind what it says. When a popular story is wrong, the entry says who repeats it and what the evidence shows instead.
>
> Start here: https://www.strictly.fyi/

## Images

Drawn by the site's own card engine, so they match the masthead. Regenerate with `node scripts/make-brand.mjs` after any brand change.

- `brand/social/avatar-1000.png`: profile picture on both. Platforms crop it to a circle; the mark is inset so nothing is clipped.
- `brand/social/banner-1500x500.png`: X header.
- `brand/social/banner-3000x1000.png`: Bluesky banner.

Both platforms lay the round avatar over the banner's lower left, so the banner keeps its tagline and domain on the right.

## The Bluesky domain handle

`@strictly.fyi` proves the account belongs to the site, so it needs no other verification. Bluesky checks it at `https://strictly.fyi/.well-known/atproto-did`: the apex redirects to www, which the AT Protocol handle spec allows, and Vercel does not add a trailing slash to that path (checked 2026-10-31). After deploying the file, confirm that `curl -L https://strictly.fyi/.well-known/atproto-did` prints the DID before switching.

1. Get the account's DID: `https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=strictlyfyi.bsky.social` returns `{"did":"did:plc:..."}`.
2. Put the DID, alone, in `public/.well-known/atproto-did` and deploy.
3. In Bluesky: Settings > Account > Handle > I have my own domain > `strictly.fyi` > No DNS panel > Verify text file, then switch.

The DNS route works too (a TXT record `_atproto` with the value `did=did:plc:...` at name.com), but the file keeps it in the repo.

## Scheduling

- **The queue:** `brand/social/schedule.json`, one item a day: `date`, `slug`, `text` (at most 240 characters, plain ASCII, no URL), `url`, and `x`, the X version of `text`. Every text is checked claim by claim against its entry before it is scheduled, and its dates are the only outside facts it may carry (Veterans Day, Thanksgiving and the like).
- **Bluesky:** `.github/workflows/social-bluesky.yml` runs `scripts/post-bluesky.mjs` every day at 14:30 UTC (9:30 a.m. in New York in winter, 8 p.m. in India) and posts the day's item with a link card built from the entry's own og tags. It needs the repository secret `BLUESKY_APP_PASSWORD`: an app password from Bluesky's Settings > Privacy and security > App passwords, never the account password. A rerun never posts the same text twice. Test it from the Actions tab: a manual run is a dry run unless told otherwise, and it still signs in, so it proves the secret works.
- **X:** the aim on X is traction (replies, reposts, follows), not traffic, so X posts carry no link; the profile's website field and the pinned post do that job. `x` is `text` split into short paragraphs, plus at most one closing question that states no fact: take out the breaks and the question and `text` comes back exactly. Each post carries the day's title card from `brand/social/cards/x/` (`node scripts/make-social-cards.mjs`). Scheduled by hand in X's own composer (Schedule post), never by browser automation (see "What works on X"), for 20:00 India time, which is 14:30 UTC; X lists them under Unsent posts > Scheduled. To change one, edit it there and change `schedule.json` to match.
- **Replies:** `brand/social/replies.json` holds, for each day, two X searches that find popular posts on the topic and two link-free replies, checked like the posts. They go out by hand: X's automation rules forbid automated replies, and X shows a new account widely only once it sees a person using it. Answer the replies the account's own posts get.

## What works on X

From the research of 2026-11-01: `reports/X content engagement playbook.md`, with its notes in `research_notes/X content engagement playbook/`. Read those before researching X again. The ranking weights change often (five times between August and October 2026), so re-check them in X's published code (github.com/xai-org/x-algorithm) each month; the rest ages more slowly. The report's 30-day plan (posting time, a card test, a second weekday post, trial formats, Premium on day 15) is a proposal until the owner adopts it.

- **Hard rules.** No browser automation of x.com, ever: X's automation rules allow permanent suspension for "scripting the X website". Post, schedule, reply, like and follow by hand, or schedule through the official API (Buffer, or an app of our own). Never ask for likes, reposts, follows or "reply with" anything: X's 2026 code has an engagement-baiting spam class.
- **What the ranker rewards** (X's code, defaults of 30 Oct 2026). Against a like: a copy-link share or a reply between mutual follows counts about 30, a reply, quote or DM share about 7.6, a follow about 6, a repost 1.5. A "not interested" tap or a mute costs about 80 to 90. Each fresh original post from a small account gets a two-hour trial decided by its early likes per view, so the first line must reward a stranger. Replies and reposts are not shown to people who do not follow the account.
- **Format.** Text first; an image only when it carries the fact; no links, no hashtags, no reposted video. Posts stand alone.
- **Growth.** A new account grows through hand-written replies under fresh posts from mid-sized accounts, and through Communities (History on X takes the history entries), more than through its own posts. Answer every reply; follow back real accounts, because replies between mutual follows count four times.
- **Accuracy.** Sourcing protects the account rather than growing it: a Community Note cuts a post's reposts by 46% once attached. Take every claim from the checked entry and correct in public.
- **Measure** every Sunday: median impressions per post, engagement rate, new followers, how the account's own replies do, and its health (the graduated-access notice, a logged-out search for the handle).

## Instagram

Not created yet. Suggested: handle `@strictly.fyi` (Instagram allows the dot; `@strictlyfyi` if it is taken), display name `Strictly FYI`, a professional account, the avatar above, `https://www.strictly.fyi` as the link, and this bio (135 of 150 characters):

> One question per entry, answered from the sources and linked to them. Science, history, tech and culture. Mistakes corrected in public.

- **The queue:** `brand/social/instagram.json`, one carousel a day for the same entries as X and Bluesky: the words of 3 to 5 body slides, the caption and 3 to 5 hashtags, checked against the entry like the posts. `node scripts/make-social-cards.mjs` draws each carousel into `brand/social/cards/instagram/<date>-<slug>/`: a cover with the entry's title and its answer on the highlighter, the body slides, and an end slide that points to the link in bio.
- **Captions:** the hook within the first 125 characters, which is all Instagram shows before "more", then context, then the line "The full entry, with every source linked: strictly.fyi (link in bio)". At most one genuine question after it.

## Posting

- **A new entry:** on the day it goes live, post its `almanac` line on both accounts: on Bluesky with its link, whose card shows the entry's title and card image; on X with its title card and no link.
- **The back catalogue:** `brand/social/posts.csv` holds one post per entry, "Start here" entries first, then the six departments in turn. On days with no new entry, post the next one. Regenerate it with `node scripts/social-posts.mjs` whenever entries are added or corrected; the script fails if a post would run past either platform's limit.
- **Post only what the entry says.** The almanac line went through the same checks as the entry, so quote it as it is. No new claims, no paraphrase from memory, no engagement bait: a post may end with one genuine question about its topic, but never asks for likes, reposts, follows, saves or tags.
- **Corrections:** when an entry is corrected and the error is in a post, reply to that post with the correction and a link to https://www.strictly.fyi/corrections/.

## On the site

The accounts live in one place, `socialProfiles` and `xHandle` in `src/data/site.ts`. From there they become the Organization's `sameAs` in `src/lib/schema.ts`, so search engines tie the accounts to the publication; the `twitter:site` tag in `src/layouts/Layout.astro`; and `rel="me"` links in the colophon. A new account is one line there, plus its row in the table above.
