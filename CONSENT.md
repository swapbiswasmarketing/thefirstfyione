# Consent

How strictly.fyi handles analytics consent, why there is no cookie banner, and what has to happen in Google Tag Manager for the setup to be true. The container cannot be seen from the repo, so this file is the record. It is an engineering reading of how the tags behave, not legal advice.

## What the code does

Two files carry it.

**`src/data/site.ts`**
- `gtmId = "GTM-WLHM6RXG"`: the only analytics snippet the site ships. GA4 (`G-BGFVBKTFPJ`) and Microsoft Clarity (project `y9i0a4eq2q`) live as tags inside that container, and `clarityEnabled` is true. State on 2026-10-17 (container version 3): the Google tag for G-BGFVBKTFPJ on Initialization - All Pages, and the Clarity tag on All Pages, which is given the GA4 client and session IDs as its user and session IDs. Neither has an additional consent requirement, so in-region the Google tag sends cookieless pings (advanced mode) and Clarity runs in its own no-consent mode (no cookies, one ID per page view, enforced by Microsoft for the EEA, UK and Switzerland since 31 October 2025). There is no GA4 event tag yet, so the site's custom events stop at the dataLayer. An empty `gtmId` renders no analytics at all.
- `consentDefaults = true`: turns on the region-scoped consent default below.
- `consentRegions`: the 39 places the default applies to: the 27 EU member states (`AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE`), the rest of the EEA (`IS LI NO`), `GB`, `CH`, and the EU regions that carry their own codes (`AX GF GP MQ RE YT MF`).
- `clarityEnabled = false`: whether a Clarity tag is published in the container. The privacy page describes Clarity only while this is true.

**`src/layouts/Layout.astro`**, the `preGtm` block, inside the `gtmId` guard and before the GTM loader on every page:
1. `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}` - the stub keeps the `arguments` shape on purpose. A rest-parameter or arrow rewrite pushes a real array, and GTM stops recognising the consent command.
2. `gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',region:[...consentRegions]})` - a dataLayer command, not gtag.js, so it stays inside the GTM-only rule.
3. The page metadata push (`content_group`, `entry_id`; see MEASUREMENT.md).
4. Then the GTM loader.

There is **no unscoped default**. A visitor outside the listed regions gets no consent state at all, which GTM's consent checks treat as granted, so analytics behave exactly as they did before this was added. An unscoped "granted" would assert a consent nobody gave; an unscoped "denied" would switch analytics off everywhere. There is also no `wait_for_update`: it only matters when a consent tool will send an update, and nothing here ever does.

`npm run check` (`scripts/check-dist.mjs`) enforces the code side on every built page: the consent default runs before the GTM loader, the container loads exactly once, and no gtag.js or Clarity snippet appears in the HTML.

## Why there is no banner, and what that means

The site carries no ads. A consent banner exists to collect consent that something on the page needs; here nothing does, because in the regions where consent is required the site simply does not use analytics storage. With no banner, nothing can ever upgrade the default, so for visitors in the listed regions `analytics_storage` stays denied for good.

What that means in practice:
- **GA4 sets and reads no cookies** for in-region visitors. Today (no gating in the container: advanced mode) the Google tag still sends cookieless pings without identifiers. Once the tag gating below is applied (GA4 "basic" consent mode), the GA4 tags do not fire for them at all, and those visits are absent from GA4.
- **Microsoft Clarity must not run in-region.** Microsoft's documentation says Clarity honours Consent Mode signals, but honouring means falling back to cookieless collection, not stopping session replay. Gating the tag is the only way to keep Clarity off for these visitors.
- **Search Console is unaffected**: it reports search impressions and clicks by country whatever the consent state, so in-region search traffic stays visible there.
- GA4's behavioural modeling could fill in some of the gap, but Google requires at least 1,000 events a day with `analytics_storage` denied for 7 days, and at least 1,000 daily users with it granted on 7 of the previous 28 days. This site will not reach that for a long time, so do not read cookieless pings as recovered data.

If in-region readers ever become a large share of the audience, the upgrade path is a self-hosted banner in the house style that sends `gtag('consent','update',...)` through the same stub, a re-open control in the colophon, and tags re-fired on a consent event. That is a design project, not a setting.

## The region rule

- Codes are ISO 3166-1 alpha-2, uppercase. Greece is `GR`, never `EL`. Never `EU`, `EEA` or `UK`: they are not country codes and match nothing.
- A place belongs in the list when EU, UK or Swiss data-protection law covers visitors there. With no banner, including a place costs only its analytics, while leaving one out would mean collecting without consent, so err toward including. `GI`, `GG`, `JE` and `IM` can be added; a sibling site left them out only because Google's own consent message is not served there, a reason that does not apply here.
- The list lives in one place, `consentRegions` in `src/data/site.ts`. Change it there, never in GTM.

## What the owner sets in GTM

1. **Admin > Container Settings > Additional Settings:** tick "Enable consent overview".
2. **Do not add a consent-default tag or template in GTM.** The default is already in the code; two defaults with different values make the outcome depend on load order.
3. **The Google tag (`G-BGFVBKTFPJ`) and every GA4 event tag:** Advanced Settings > Consent Settings > "Require additional consent for tag to fire" > `analytics_storage`. This is GA4 basic mode, the recommended setting: in-region, the tags do not fire at all. The alternative, advanced mode, leaves the tags ungated so that Google's tags send cookieless pings in-region; it gains nothing reportable at this site's scale. Choose one, and record the choice and the date in this file.
4. **Clarity:** before publishing a Clarity tag (project `y9i0a4eq2q`), give it the same "Require additional consent for tag to fire > `analytics_storage`" setting. Then, in the same change, set `clarityEnabled = true` in `src/data/site.ts` and deploy, so the privacy page describes it. Leave Clarity's own project setting for cookies on: switching it off makes every region cookieless, including the regions that never needed it.
5. **Every tag added later gets the same consent requirement, plus a privacy-page update in the same change.** GTM changes need no commit or deploy, so the container can drift from `src/pages/privacy.astro` without anyone noticing; this rule is the only guard. The privacy page's sections are switched by the constants in `src/data/site.ts` (`consentDefaults`, `clarityEnabled`, `newsletterLive`), and its `lastUpdated` date is bumped by hand whenever a section changes meaning.

## The Tag Assistant Preview test

Run it before publishing any container version that touches tags or consent.

1. **Outside the regions** (a normal connection outside the EEA, UK and Switzerland): open Tag Assistant Preview on https://www.strictly.fyi/. The Consent tab shows the four types as not set. The Google tag and the GA4 event tags fire. In DevTools, Network shows requests to `/g/collect`, and Application > Cookies shows `_ga` and `_ga_<id>`.
2. **Inside the regions** (a VPN exit in Germany or the UK): the Consent tab shows the default as denied for all four types. The GA4 tags, and Clarity if present, are listed under Tags Not Fired with a consent reason. Network shows no `/g/collect` request and nothing from `clarity.ms`. Cookies show no `_ga`, `_ga_<id>`, `_clck` or `_clsk`.
3. Publish with a version note naming the tags and consent settings that changed.

If test 1 shows the tags blocked, check that no consent-default tag was added in GTM (step 2 above) and that the region list in `src/data/site.ts` holds only the intended codes.

## Advertising (Google AdSense)

What the code does, all switched by `src/data/site.ts`:
- `adsenseClient` set: every page carries the `google-adsense-account` verification meta tag and `/ads.txt` is generated from the same ID (`src/pages/ads.txt.ts`). That is all AdSense needs to review the site.
- `adsServing = true` (off as of 2026-10-17): the Auto ads loader runs on pages with publisher content, and the privacy page gains its Advertising section. Turn it on only once AdSense has approved strictly.fyi and the hosting plan allows ads. The 404, search and privacy pages pass `ads={false}` to the Layout, so they never load it. The running head, the front-page masthead, the entry head and the colophon carry `data-no-auto-ads`, which Google's Auto ads code reads, so no ad lands inside the page chrome (the portfolio measured a 0.15 layout shift from a header ad before it did the same).
- Empty `adsenseClient`: no ads code at all.

Before ads serve:
1. **Hosting.** Vercel's Hobby plan forbids ads: its Fair Use Guidelines count "the inclusion of advertisements, including but not limited to online advertising platforms like Google AdSense" as commercial use, which needs Pro. Upgrade the project first, or set `adsenseClient = ""` until it is.
2. **The consent message.** Google's EU User Consent Policy requires a Google-certified consent management platform for ads in the EEA and the UK; without one, only limited ads serve there. Google's own is free: AdSense > Privacy & messaging > European regulations. Publish it for the EEA, the UK and Switzerland, and turn on its consent mode setting so the message updates the same four signals the preGtm default sets.
3. **Then set `consentMessage = true`** and deploy. The consent default gains `wait_for_update: 500`, so tags wait up to half a second for the message's answer; the colophon shows "Privacy and cookie settings", which reopens the message (only where GDPR applies, once Google's API is ready); and the privacy page describes the message.
4. **After that, the posture in "Why there is no banner" changes:** in-region readers can now grant storage, and the Google tag's consent checks follow their answer. Clarity does not read Google's consent: without a bridge it stays in its no-consent mode in-region even after a reader accepts. The portfolio's BaseLayout has a bridge that passes the message's answer to `clarity('consentv2', ...)` if that is ever wanted.
