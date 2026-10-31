# Social

How Strictly FYI appears on social platforms: which accounts, what the profiles say, which images they use, how posts are made, and what the site changes once the accounts exist. The accounts speak only as the publication, the same as the site: no personal name, photo or bio anywhere.

## Accounts

| Platform | Handle | Profile URL |
|---|---|---|
| X | `@strictlyfyi` | https://x.com/strictlyfyi |
| Bluesky | `@strictly.fyi` (sign up as `strictlyfyi.bsky.social`, then switch, see below) | https://bsky.app/profile/strictly.fyi |

Both handles were free on 2026-10-31. Sign up with the site's contact address. Display name on both: `Strictly FYI`. A sign-up through "Continue with Google" copies the Google account's personal name into the profile, so change the name to `Strictly FYI` before the first post. Turn on two-factor authentication on both.

## Profile copy

X bio (157 of 160 characters), website field `https://www.strictly.fyi`, no location:

> One question per entry, answered from the sources and linked to them. Science, history, tech, culture and everyday curiosities. Mistakes corrected in public.

Bluesky description (209 of 256; Bluesky has no website field, so the domain ends the description):

> A field guide to the fascinating. Each entry answers one question in science, history, tech, culture or everyday life, and links the sources behind what it says. Mistakes are corrected in public.
>
> strictly.fyi

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

## Posting

- **A new entry:** on the day it goes live, post its `almanac` line and its link on both accounts. The link card shows the entry's title and card image, so the post needs nothing else.
- **The back catalogue:** `brand/social/posts.csv` holds one post per entry, "Start here" entries first, then the six departments in turn. On days with no new entry, post the next one. Regenerate it with `node scripts/social-posts.mjs` whenever entries are added or corrected; the script fails if a post would run past either platform's limit.
- **Post only what the entry says.** The almanac line went through the same checks as the entry, so quote it as it is. No new claims, no paraphrase from memory, no engagement bait.
- **Corrections:** when an entry is corrected and the error is in a post, reply to that post with the correction and a link to https://www.strictly.fyi/corrections/.

## On the site, once the accounts exist

In one change, with the profile URLs from the table above:

1. `src/lib/schema.ts`: add both URLs as `sameAs` on the Organization node, so search engines tie the accounts to the publication.
2. `src/layouts/Layout.astro`: add `<meta name="twitter:site" content="@strictlyfyi" />` beside the other `twitter:` tags.
3. The colophon: links to both profiles.
