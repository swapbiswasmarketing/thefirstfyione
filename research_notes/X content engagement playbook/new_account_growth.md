# Growing a brand-new X brand account from zero (state as of 1 November 2026)

_Compiled 2026-11-01 for the strictly.fyi X playbook. The account is @strictlyfyi: created 2026-10-31, free tier, India-based, science/history/trivia niche._

_How the sources were read:_
- _help.x.com blocks automated reads. WebFetch got HTTP 403, a reader proxy got the Cloudflare "Just a moment..." page, and four headless kane-cli browser runs were all stopped by Cloudflare's security check (about 45 TestMu credits spent). The fetch tool also cannot reach web.archive.org or archive.ph._
- _Every Help Center statement below therefore comes from the WebSearch tool's extraction of the indexed page, not from a word-for-word read. Approximate index dates are given where the tool reported them. A person should spot-check the load-bearing ones in a normal browser; they are marked "(index text)"._
- _Dates of X posts were decoded from their status IDs (snowflake timestamps)._
- _All 20 of the 20 allowed WebSearch calls were used._

## 1. Graduated access ("Unlock more on X"): what it is, when it was introduced, how an account graduates, how long it takes

### Takeaway
Graduated access is X's undocumented trust gate for new accounts. It was first reported in development on 2022-12-11, users have seen it since at least 2024, and this project's account still showed it on 2026-10-31. X has never published its criteria or a timeline. X's own pages and its open-sourced ranking code show the same pattern: new and low-follower accounts are filtered out of trends, can be kept out of search, and are held back from non-followers, while followers still see their posts. Forum anecdotes put graduation at a few days to a few weeks of normal use by a real person.

### Cited Findings
- **2022-12-11.** Jane Manchun Wong reported that Twitter "is working on 'Graduated Access', a set of perks that Twitter only unlocks when they're confident the user is a human." The perks: "Your content will [be] more discoverable. And you'll appear in search results and trends"; "Send DMs to people who don't follow you w/o being auto fi[ltered]". According to the search-index summary, the prompt asked users to engage with their timeline and connect with others so X can be sure a human runs the account. — [Wong on X](https://x.com/wongmjane/status/1601871343099805696) (date decoded from the post ID)
- **2024-08-25.** A post titled "How to unlock more on X?" shows the notice's wording was in circulation by then. The post body needs a login and was not read. — [dailyxdigest on X](https://x.com/dailyxdigest/status/1827561529798951147) (date decoded from the post ID)
- **Undated, anecdotal (BlackHatWorld).** Newly bought accounts showed a "graduated access" popup, failed when posting and did not appear in search results. A phone or email verification step was needed. — [BHW thread](https://www.blackhatworld.com/seo/where-to-get-non-graduated-access-account.1492348/)
- **Undated, anecdotal (BlackHatWorld; the page returns 403, so this comes from the search-index summary).** Three claims from posters:
  - "This is normal and you've gotten it because your accounts are new. You just need to keep doing manual work until a couple of days pass and you get unrestricted."
  - Another poster suggested using the account normally "for a few weeks".
  - One claims the flag is tied to an internal trust score and browser fingerprinting. That is speculation.
  — [BHW "How to fix Twitter Authentic flag?"](https://www.blackhatworld.com/seo/how-to-fix-twitter-authentic-flag.1817536/)
- **2026-10-31 (first-party).** The new @strictlyfyi account showed a "graduated access" notice: limited reach for a new account until X sees human use. — [project memory, project_social_profiles.md](C:/Users/swapnilb/.claude/projects/c--Website-strictly-fyi/memory/project_social_profiles.md)
- **help.x.com, Trends Recommendations (index text, read 2026-11-01):** "Trends will be filtered to help protect you, e.g. filtered for uncredible accounts, such as an author account with a low number of followers, bots, and newly created accounts." — [Trends Recommendations](https://help.x.com/en/resources/recommender-systems/trends-recommendations)
- **help.x.com, search help (index text):** account search shows "results with preference to those who have a complete name, username, and bio on their profile". The page also advises posting, reposting and mentioning regularly. — [Help with X search](https://help.x.com/en/using-x/x-search-not-working)
- **help.x.com, limited accounts (index text):** suspicious activity can put an account in a temporary limited state. Its posts may then be kept out of search and notifications while it is under review. — [Help with locked or limited account](https://help.x.com/en/managing-your-account/locked-and-limited-accounts)
- **help.x.com, liveness checks (index text):** X may ask for a liveness check when an account's activity looks automated. Passing any one check confirms a real person. Until it is passed, the account cannot post, follow or take other write actions. — [About liveness checks on X](https://help.x.com/en/using-x/liveness-checks)
- **help.x.com (index text):** X says it wants to be sure there is a human behind each account and may limit an account's reach while it evaluates authenticity. Its enforcement options for restricting reach include excluding posts from search results and trends. The search tool attributed this to these two pages without saying which one carries it. — [Authenticity](https://help.x.com/en/rules-and-policies/authenticity); [How we enforce our rules](https://help.x.com/en/rules-and-policies/enforcement-options)
- **Open-sourced For You code.** The repository was created 2026-01-19 and pushed 2026-10-31 ([GitHub API](https://api.github.com/repos/xai-org/x-algorithm)); its README is updated through 2026-10-26.
  - It lists `NewUserMinEngagementFilter`: "For new accounts, out-of-network posts below an engagement threshold". The README does not say whether "new" means the viewer or the author.
  - Visibility filtering can drop a post only when it is a recommendation to someone who does not follow the author ("spam caught at high recall"). The README adds: "The same post is allowed to a follower."
  - New-author boost: "posts from authors whose impressions are below a threshold are lifted toward a target position."
  — [xai-org/x-algorithm README](https://github.com/xai-org/x-algorithm)
- **Same repository, default parameters (fetched 2026-11-01).** These are feature-switch defaults, not necessarily live values. — [param.rs](https://raw.githubusercontent.com/xai-org/x-algorithm/main/home-mixer/params/param.rs)
  - `ColdStartImpressionThreshold` = 200
  - `ColdStartFollowerCap` = 50000
  - `ColdStartMaxPostAgeSecs` = 7200 (2 hours)
  - `ColdStartSlotMin` = 15, `ColdStartSlotMax` = 16
  - `LowImpressionsMaxPositionRatio` = 0.97
  - `ColdStartBetaAlpha0` = 0.75, `ColdStartBetaBeta0` = 49.25
- **2023-10-18, precedent.** X's "Not A Bot" test made new, unverified accounts in New Zealand and the Philippines pay $1 a year to post or interact. Without paying they could "only be able to read posts, watch videos and follow accounts". Existing users were not affected. The stated aim was to "tackle the ongoing bot/spam posts problem". — [GSMArena](https://m.gsmarena.com/x_formerly_twitter_launches_1_notabot_subscription_for_new_users-news-60266.php)
- **2024-04-17.** BusinessLine ran the headline "New X users have to pay for tweets, likes". The search-index summary, which mixes this item with the 2023 test, says new unverified users saw a prompt to pay a small fee to unlock posting and engagement. The article body was not read. — [BusinessLine via PressReader](https://www.pressreader.com/india/businessline-mumbai-9WVZ/20240417/282196540996905). This project's free India account could post in Oct 2026, so no pay-to-post gate applies to it now ([project memory](C:/Users/swapnilb/.claude/projects/c--Website-strictly-fyi/memory/project_social_profiles.md)).
- **2025-11-21.** X began rolling out "About this account". It shows where an account is based, its join date, how many times the username changed and when, and how it connects to X (for example US App Store or Google Play). Users can show their country or only their region. The stated aim is to reduce inauthentic engagement. — [TechCrunch](https://www.techcrunch.com/2025/11/21/x-begins-rolling-out-the-about-this-account-feature-to-users-profiles/)
- **2026-02-14.** Nikita Bier, then X's head of product: "We are rolling out more detection for automation & spam (and a lot more to come). If a human is not tapping on the screen, the account and all associated accounts will likely be suspended—even if you're just experimenting." — [Bier on X](https://x.com/nikitabier/status/2022496540275937525?lang=en)

### Inferences
- Graduated access behaves like a trust score. Signs of a real person raise it: confirmed phone and email, a complete profile, steady use by hand (scrolling, liking, replying, following a few relevant accounts), and engagement from established accounts. Patterns that look automated lower it. This is inferred from the help pages and the Bier statement; X documents none of it.
- While the account is gated, posts still reach followers: the visibility rules that drop posts for non-followers allow "the same post" to followers. So early effort should go into getting the first followers, through conversations, Communities and cross-promotion from the site and Bluesky, rather than into chasing For You reach.
- The cold-start parameters suggest small authors get a trial placement near For You slots 15-16 for fresh posts: under 200 impressions, under 2 hours old, author under 50,000 followers. If so, the first two hours after posting matter, and posting when the target audience is awake matters. This is a reading of parameter names, not documented behaviour.
- The biggest self-inflicted risk in this phase is an agent driving the x.com web app (see section 5). That is "non-API automation", and it is exactly the non-human pattern the trust gate looks for.
- "About this account" will show the account as based in India, or a South Asia region if chosen. It also shows username changes, so the handle and display name should stay fixed from now on.

### Gaps
- No official X page, announcement or press article about graduated access was found. Its launch date, criteria and duration are undocumented. Searches returned only the 2022 leak and forum threads.
- Duration: only anecdotes ("a couple of days" to "a few weeks"), undated and from a forum that trades in bought accounts.
- Whether buying a paid tier, or passing ID verification or a liveness check, ends graduated access is unverified.
- Whether `NewUserMinEngagementFilter` targets new viewers or new authors is not stated, and no threshold values are published.
- The exact wording of the 2026 notice on @strictlyfyi was not captured word for word, only paraphrased in project memory.

## 2. Reply strategy: how small accounts' replies are ranked, the effect of Premium, evidence that replying grows followers, good vs spammy replies

### Takeaway
X ranks replies in the conversation view with its own system, which puts them in three bands, each sorted by a predicted-engagement score:
- replies from accounts the viewer follows, and replies the original author has answered;
- verified or paying-subscriber accounts;
- everyone else.

A free account's replies start in the bottom band. Any paid tier lifts them: Basic a little, Premium more, Premium+ the most. The free lever is getting the original author to reply. Replies from accounts the viewer doesn't follow are filtered out of For You, so a reply grows an account mainly through people reading the thread and tapping the profile. Evidence that reply-heavy activity grows new accounts is anecdotal but consistent. X's 2026 enforcement targets solicited engagement, automated or AI replies, duplicated content, and off-topic or low-quality replies.

### Cited Findings
- **help.x.com, Conversations Recommendations (index text, read 2026-11-01):**
  - A cache called Haplo "stores up to 3,200 of the most recent replies for all the conversations. For conversations larger than 3,200 replies, we get top 800 replies ranked by the search model as candidates."
  - The model predicts "fav, reply, repost and negative engagements (such as mutes and reports)" and combines them as a weighted average.
  - Ordering bands: "Replies from accounts viewer follows and root author has replied to; Verified accounts; Everyone else". The ML score orders replies within each band.
  - Abusive replies go to a separate "health" section at the bottom.
  - Choosing "Latest" or "Likes" shows replies in an order that is not personalised.
  — [Conversations Recommendations](https://help.x.com/en/resources/recommender-systems/conversations-recommendations)
- **Same page, newer version (index text):** "When ranking a reply higher, we consider factors such as if the original post author has replied, if a reply is from someone you follow, or if the person is an X Premium subscriber or a subscriber to a Plus, Premium, Super, or Ultra plan on The X Subscription." — [Conversations Recommendations](https://help.x.com/en/resources/recommender-systems/conversations-recommendations); see also [About conversations on X](https://help.x.com/en/using-x/x-conversations)
- **help.x.com, X Premium (index text, ~Oct 2026):** Basic includes "reply prioritization"; Premium adds "a larger reply prioritization than Basic"; Premium+ has "the largest reply prioritization". — [About X Premium](https://help.x.com/en/using-x/x-premium)
- **help.x.com, X Premium FAQ (index text, ~2026-10-23):** replies "may be marked as spam when unrelated to original posts, of low quality, or if we see behavior that violates the platform manipulation and spam policy." — [X Premium FAQ](https://help.x.com/en/using-x/x-premium-faq)
- **For You ranking weights (defaults, fetched 2026-11-01).** The README says these weights scale predicted probabilities, not raw engagement counts. — [param.rs](https://raw.githubusercontent.com/xai-org/x-algorithm/main/home-mixer/params/param.rs); [README](https://github.com/xai-org/x-algorithm)
  - Positive: `ReplyWeight` 5.0, `FavoriteWeight` 0.66, `RetweetWeight` 1.0, `OpenLinkWeight` 0.2
  - Negative: `NotInterestedWeight` -52.272, `MuteAuthorWeight` -58.8, `BlockAuthorWeight` -31.2, `ReportWeight` -234.0, `NotDwelledWeight` -0.02
  - No parameter mentions verified, Premium or subscriber status.
- **README, reply handling (updated through 2026-10-26):**
  - `OONRetweetReplyFilter` removes replies from accounts the viewer doesn't follow (out-of-network) from For You, and `EnablePhoenixOonReplies` defaults to false.
  - Posts from accounts the viewer doesn't follow are "multiplied by a factor below 1".
  - Each post after an author's first in a session is down-weighted by a decaying factor, to a floor (author diversity).
  — [README](https://github.com/xai-org/x-algorithm)
- **2025-05-18, anecdotal.** Tom Butler went "from zero to 470+ followers in 10 weeks", growing about 50% a week: 20 to 66 in week 1, 135 by week 2. His daily impressions rose about tenfold. His tactic: "Give the small accounts a follow, and a few likes and replies on their posts. Because they are small, they are much more likely to see your replies and follow you back." He cites a May 2025 post by Sherry Jiang saying replies are the main growth lever under 10K followers. — [Tom Butler on X](https://x.com/tomlbutler/status/1923972320973967595) (date decoded from the post ID; read from the search snippet)
- **2026, anecdotal; page returned 403, read from the search snippet.** A brand-new account reached 560,000 impressions in 10 days, with an engagement rate 22x average, by replying to larger accounts within the first 30-60 minutes of their posts. The post says a 2025 algorithm update deprioritised one-liners and engagement bait. — [Indie Hackers](https://www.indiehackers.com/post/zero-followers-high-reach-how-to-get-impressions-on-x-in-2026-1dd99f725d)
- **2023-11-30, anecdotal, before the 2024-2026 window.** A dormant account with about 200 followers reached 20,000 in 59 days (10 Sep to 6 Nov 2023). Tactics:
  - "I commented on look-alike posts (posts from accounts similar to mine) that had large audiences (50k+ followers)", which "got me noticed and led to followers";
  - engaging with 200-2,000-follower accounts;
  - 10-15 posts a day and "at least 3-4 hours a day on X";
  - several viral posts with 1M+ impressions.
  — [pozoe Substack](https://pozoe.substack.com/p/how-i-grew-a-twitterx-account-to)
- **2026, vendor guide, nothing sourced (treat as opinion).** It claims:
  - a hard cap of "approximately 500" replies a day for established accounts, "fewer for new accounts";
  - advice to stay under 50 a day, with 15-20 quality replies as the optimum;
  - reply within 5-15 minutes and skip posts older than 30 minutes;
  - deboost triggers: more than 20 replies an hour, identical replies, more than 3-4 replies to one account a day, external links.
  — [teract.ai](https://www.teract.ai/resources/twitter-reply-guy-strategy-2026)
- **2026-09-02, opinion, no evidence cited.** Premium replies rank higher in conversations, but Premium "does not push posts to non-followers" and has "no mechanism" for adding followers. — [owlead](https://owlead.com/x-premium-growth/)
- **2026-07-16.** Bier on the creator revenue-share programme: "Soliciting engagements ('I'll follow everyone who replies') 3 or more times will result[] in removal from the program and your account will be forwarded to the policy team for suspension. Grok now catches all of these." Nearly 4,000 accounts were removed that day. A new model detects duplicated content at 3x the previous rate, and 1.5 million stolen posts were detected that cycle. — [Bier on X](https://x.com/nikitabier/status/2077774853650944028) (date decoded from the post ID); a secondary write-up says X classes "I will follow everyone who replies" as engagement spam ([note.com](https://note.com/munou_ac/n/ne63e1459f6d8?hl=en), undated)
- **2026-03-02.** A community account quoting Bier said Grok would automatically detect spam growth tactics and enforce platform rules in real time. — [Muskonomy on X](https://x.com/muskonomy/status/2028467036154958136)
- **help.x.com, automation rules (index text, ~2026-09-30):**
  - Automated replies are allowed only after the user opts in (for example by replying to you or messaging you), with an easy opt-out and one reply per interaction.
  - "Sending automated replies based on keyword searches alone is not permitted."
  - "The deployment or operation of any AI reply bot requires prior written and explicit approval from X."
  — [Automation rules](https://help.x.com/en/rules-and-policies/x-automation)
- **X developer guidelines (undated; index ~2026-05):** "Deploying AI-generated replies without approval is a violation, even if the content itself is helpful." — [Developer Guidelines](https://docs.x.com/developer-guidelines)

### Inferences
- Under a mega-account's post, a free reply ranks below every subscriber's reply. When a thread has thousands of replies, only the newest 3,200 are cached, or the top 800 in bigger threads, so a free reply is unlikely to be seen. The better bet is mid-size science, history and trivia accounts, replying while the post is fresh. There are fewer subscriber replies to compete with, and the author is likelier to answer, which lifts the reply into the top band.
- A predicted reply carries about 7.6 times the weight of a predicted like (5.0 vs 0.66). Block, "not interested", mute and report carry negative weights roughly 47 to 355 times a like's in size. The weights multiply predicted probabilities, so this is not a count equivalence. So the posts and replies that do best invite a response: a precise sourced fact, a gentle correction, a question. They also never irritate: no link drops, no self-promotion, no templates. This fits Strictly FYI's "verified fact" positioning.
- A paid tier is the only documented way to move a reply up the default sort without the author's help. For a reply-led plan, that is the main argument for paying (see section 4).
- Since the 2026 enforcement wave, 2023-2024 "growth hacks" carry suspension risk: follow-for-follow threads, "reply and I'll follow you", engagement groups, recycled text.

### Gaps
- No official size of the reply boost per tier, and no controlled study of Premium's effect on replies, was found.
- The top band's wording is ambiguous: it may need both "viewer follows" and "author replied", or either one.
- No information on how reply ranking treats accounts under graduated access.
- One blog in the search results claimed replies from accounts under 1,000 followers get an extra spam screen. The claim could not be traced to code or to an identified source, so it is unverified.
- An uncorroborated search-summary claim of a mid-2026 reply "thumbs-down" for Premium users was not verified.

## 3. X Communities: whether posts reach non-followers, which communities fit science/history/trivia, and their rules

### Takeaway
According to X's Help Center (index ~Sept-Nov 2026), Community posts are not walled off. They are shared with members, the poster's followers and other X users, and appear on the Community page, in global search, on the profile and in other timelines. Non-members can reply unless moderators limit it. That makes Communities one of the few ways a zero-follower account can put a post in front of an audience that has opted into the topic. The only niche Community verified is "History on X" (about 65.4K members, created 2023-08-16). Science and trivia Communities could not be identified from outside the app.

### Cited Findings
- **help.x.com, Communities (index text, ~2026-09-30):**
  - "Community posts are shared with Community members, your followers, and other X users. They will appear on the Community page, in global search results, on your profile, and in other timelines."
  - Non-members can reply, but moderators can limit or hide those replies. Non-members can also report posts to X.
  — [Join a Community on X](https://help.x.com/en/using-x/communities)
- **help.x.com (index text):**
  - Moderators report member posts that break the X Rules and hide posts that break the Community's rules. Admins own the Community and manage its rules, name and description.
  - Community rules must not duplicate, violate or conflict with the X Rules, and a Community can have 1 to 10 rules.
  - Members are notified when rules change, and posts hidden under a changed or removed rule stay hidden.
  - Moderators must not hide posts or remove members "in an abusive or disruptive manner".
  — [Join a Community on X](https://help.x.com/en/using-x/communities); [Communities Moderator Playbook](https://help.x.com/en/using-x/communities-moderator-playbook)
- **help.x.com:** a separate page explains how Communities are recommended. It was not readable here. — [Communities Recommendations](https://help.x.com/en/resources/recommender-systems/communities-recommendations)
- **History on X, read 2026-11-01 via the search index:** 65.4K members; "for people who enjoy history discussion"; invites members to bring up to 5 knowledgeable friends. Created 2023-08-16 (decoded from the Community ID). — [History on X](https://x.com/i/communities/1691711931751534664)
- **Open-sourced code (README updated through 2026-10-26):** recommendations from outside the viewer's follows come partly from SimClusters, described as cluster similarity. — [README](https://github.com/xai-org/x-algorithm)

### Inferences
- Communities suit a fact-led brand. Post native, on-topic material there (a sourced history fact, a science explainer, a trivia question) rather than links. Read each Community's rules first: moderators can hide posts and remove members, and self-promotion rules vary.
- Community posts also appear in followers' timelines and in search, so posting to a Community costs no ordinary distribution.
- Sticking to one consistent topic probably helps the account get matched to interest clusters (SimClusters) that drive recommendations to people who don't follow it. This is inferred from the README, not documented for Communities.

### Gaps
- No data on how far Community posts reach compared with ordinary posts, or whether they get For You distribution to non-members beyond "other timelines".
- Science, trivia and fun-facts Communities could not be listed. x.com needs a login, and the web index covers Communities poorly (only "History on X" surfaced).
- The rules of History on X were not read.
- 2025-2026 product changes to Communities were not checked (search budget used up).

## 4. X Premium tiers in 2026: prices in India and the US, what each tier changes, whether it is worth it for a new brand account, documented reach effects

### Takeaway
As of 2026-11-01, X sells two overlapping offers. Legacy X Premium is still listed on help.x.com at US web prices of Basic $3/mo or $32/yr, Premium $8/mo or $84/yr, and Premium+ $40/mo or $395/yr. The X Subscription, launched by xAI on 2026-10-12, has Free $0, Plus $8, Premium $30, Super $100 and Ultra $200 a month, bundling X Premium features with Grok and Cursor. After the July 2025 cut, legacy prices in India were:
- web: Basic ₹170/mo, Premium ₹427/mo, Premium+ ₹2,570/mo;
- mobile: Premium ₹470/mo, Premium+ ₹3,000/mo on Android and ₹5,000/mo on iOS.

The one documented reach effect of paying is reply prioritisation in conversations. The open-sourced 2026 For You parameters contain no Premium or verified boost.

### Cited Findings
- **US legacy prices, help.x.com FAQ (index text, ~2026-10-23):** Basic "starts at $3/month or $32/year on web", Premium "$8/month or $84/year", Premium+ "$40/month or $395/year". Local prices vary by location. — [X Premium FAQ](https://help.x.com/en/using-x/x-premium-faq); a separate page covers the Premium+ price change ([X Premium+ Price Adjustment](https://help.x.com/en/premium-plus-price-update))
- **Tier features, help.x.com (index text, ~Oct 2026):** — [About X Premium](https://help.x.com/en/using-x/x-premium); [X Premium FAQ](https://help.x.com/en/using-x/x-premium-faq)
  - **Basic:** "editing posts, longer posts and longer video uploads, reply prioritization, text formatting, bookmark folders, and custom app icons". No reduced-ads experience.
  - **Premium:** adds the checkmark, "approximately 50% fewer ads in the For You and Following Timelines", ID verification, Media Studio, higher Grok limits and larger reply prioritisation.
  - **Premium+:** the largest reply prioritisation, SuperGrok, Grok Bot, Radar Search and Articles. The pages conflict on ads: one says it is ad-free in most areas, the FAQ says ads occasionally appear in replies, Explore and some other areas.
- **Long posts, help.x.com (index text):** "Longer posts allow up to 25,000 characters" and "Longer posts cannot yet be scheduled." — [X Premium how to](https://help.x.com/en/using-x/x-premium-how-to)
- **2026-10-12, xAI announcement:** — [xAI: The X Subscription](https://x.ai/news/x-subscription)
  - "Today we're introducing The X Subscription, which brings together Grok, Grok Bot, Cursor, and X Premium in one plan."
  - Tiers: Free $0, Plus $8/month, Premium $30/month, Super $100/month, Ultra $200/month.
  - "X adds a checkmark, creator tools, and fewer ads, with higher tiers removing ads from the timeline entirely."
  - Premium bundles "The benefits of SuperGrok, Cursor Pro, and X Premium+, previously $90/month combined".
  - "The X Subscription is available to new customers starting today", with global availability "over the next few days".
  - No annual or regional prices are given.
- **help.x.com (index text):** "X Premium is now part of The X Subscription". Switching is optional, and existing subscribers keep their plan, price and features unless they change or cancel. — [What is The X Subscription?](https://help.x.com/en/using-x/x-subscription)
- **2026-10-13:** Premium carries 4x Plus's usage, Super 15x and Ultra 50x. Annual prices from pre-launch posts could not be verified against the official announcement. — [explainx.ai](https://explainx.ai/blog/the-x-subscription-grok-cursor-x-premium-one-plan-tiers-pricing-2026). A leaked price card dated 2026-10-02 had the $8 and $30 names swapped; the launch reversed them. — [cellcog.ai](https://cellcog.ai/blog/xpass-pricing/); [Muskonomy on X, 2026-10-13](https://x.com/muskonomy/status/2109856077781283297)
- **Reply ranking counts the new tiers.** help.x.com lists subscribers to "a Plus, Premium, Super, or Ultra plan on The X Subscription" as a ranking factor. — [Conversations Recommendations](https://help.x.com/en/resources/recommender-systems/conversations-recommendations)
- **Premium Business, the organisation tier (index text):** Basic $200/month or $2,000/year; Full Access $1,000/month or $10,000/year, plus tax. For a limited period monthly subscribers get $200 (Basic) or $1,000 (Full Access) in ads credit every 30 days. Each additional US affiliate costs $50/month on the Full Access monthly tier. — [Premium Business](https://help.x.com/en/using-x/premium-business); [Premium Organizations](https://help.x.com/en/using-x/premium-organizations)
- **2025-07-12, India legacy prices (NavBharat Live):** — [NavBharat Live](https://navbharatlive.com/technology/good-news-for-x-users-in-india-you-will-get-premium-subscription-just-this-much-rupees-1282377.html)

  | Tier | Web, monthly | Web, yearly | Previous web price | Mobile app, monthly |
  |---|---|---|---|---|
  | Basic | ₹170 | ₹1,700 | ₹244 / ₹2,591 | ₹170 |
  | Premium | ₹427 | ₹4,272 | ₹650 / ₹6,800 | ₹470 (was ₹900) |
  | Premium+ | ₹2,570 | ₹26,400 | ₹3,470 / ₹34,340 | ₹3,000 on Android; ₹5,000 on iOS |

  The same cut ("up to 48%") was reported on 2025-07-11. — [Business Standard](https://www.business-standard.com/companies/news/x-slashes-premium-and-basic-subscription-prices-by-up-to-48-in-india-125071101375_1.html); [NewsBytes](https://www.newsbytesapp.com/news/science/x-slashes-subscription-prices-in-india-to-boost-adoption/story)
  
  Note: the WebSearch summary wrongly dated the NavBharat article to August 2026. The page itself is dated 2025-07-12.
- **2025-11-30.** A first-month-only ₹89 Premium offer for first-time subscribers ran in India and has expired. — [India TV](https://www.indiatvnews.com/technology/news/x-premium-subscription-available-for-just-rs-89-this-special-offer-ends-in-2-days-2025-11-30-1019628)
- **2024 (exact date not checked):** X said accounts with more than 2,500 verified-subscriber followers would get Premium free, and more than 5,000 would get Premium+ free. Whether this still applies in 2026 is unknown. — [AOL](https://www.aol.com/elon-musk-announces-significant-changes-143514239.html)
- **Analytics, 2026-10-23:** "the full Twitter analytics dashboard is only available to X Premium" ("or X verified accounts on desktop"). "X moved its complete dashboard behind the Premium paywall, leaving free accounts with post-level data only." — [Hootsuite](https://blog.hootsuite.com/twitter-analytics-guide/). On 2026-03-10 Sprout Social wrote: "You must have a subscription to view analytics for multiple posts." — [Sprout Social](https://sproutsocial.com/insights/twitter-analytics/)
- **Documented reach effects, primary code.** As fetched on 2026-11-01, the 2026 `param.rs` has no parameter for verified, blue, Premium or subscriber status, and the README does not mention Premium or verified status. — [param.rs](https://raw.githubusercontent.com/xai-org/x-algorithm/main/home-mixer/params/param.rs); [README](https://github.com/xai-org/x-algorithm)
- **Conflicting secondary claim, 2026-06-24.** smmnut says a "15 May 2026" code release confirms a Premium feature in the "heavy ranker". It names no file or parameter, and admits "Magnitude is not publicly stated as a single number". — [smmnut](https://smmnut.com/blog/does-x-premium-give-real-algorithm-advantages-2026/). This conflicts with the published parameters, and the repository was created on 2026-01-19, not in May ([GitHub API](https://api.github.com/repos/xai-org/x-algorithm)). Other 2026 guides claim 2x-4x reach boosts; the two checked cite no evidence ([owlead](https://owlead.com/x-premium-growth/), [smmnut](https://smmnut.com/blog/does-x-premium-give-real-algorithm-advantages-2026/)).

### Inferences
- For this account, the documented benefits of paying are:
  - replies placed above free accounts' replies, plus the checkmark from Premium or Plus upwards;
  - the full analytics dashboard;
  - editing;
  - long posts, which cannot be scheduled.
- There is no primary evidence that paying lifts the For You reach of original posts in the 2026 code.
- If legacy Basic is still sold in India (₹170/mo), it is the cheapest test of reply prioritisation, though it has no checkmark. Otherwise Plus ($8 in the US; India price unknown) is the entry point. Premium Business (gold check, $200/mo) is not justified at zero followers.
- Paying earns its keep only once someone replies by hand every day. While the account only posts a scheduled queue, a subscription buys little reach.
- Paying might also help with graduated access, since payment plus ID verification are strong signs of a real person. This is plausible but unverified (see section 1).

### Gaps
- No India prices were found for The X Subscription tiers.
- It is unclear whether new customers can still buy legacy Basic, Premium or Premium+ after 2026-10-12. help.x.com still lists them; xAI says the new plan is for new customers. Checking the in-app purchase screen would settle it.
- The X features in each new tier are not itemised: whether Plus gets the same reply prioritisation as legacy Premium, or the analytics dashboard, editing and long posts.
- The rules for getting the checkmark (account age, phone confirmation) were not extracted. Check [About X Blue Checkmark](https://help.x.com/en/managing-your-account/about-x-bluecheck) before buying for a 1-day-old account.
- Whether an organisation's brand account may use individual Premium rather than Premium Business was not verified.
- No independent 2026 measurement of Premium's reach effect was found.

## 5. Automation and platform-manipulation rules, daily limits, and what triggers visibility filtering, spam labels or suspension

### Takeaway
X allows:
- scheduled, informational posting through its own tools or the official API;
- automated replies only to users who opted in.

X bans:
- automated likes and automated follow/unfollow;
- replies triggered by keyword searches, and AI reply bots without written approval;
- coordinated or paid engagement inflation (which covers engagement pods);
- follow churn and duplicated content;
- non-API automation (scripting the website, browser automation), which can mean permanent suspension.

The published limits sit far above any sensible plan: 2,400 posts a day overall, reportedly 50 original posts and 200 replies a day for unverified accounts, and 400 follows a day, with a 5,000-following cap before a ratio applies. In 2026 X added Grok-based detection of spam growth tactics and threatened to suspend accounts it judged not run by a human.

### Cited Findings
- **help.x.com, automation rules (index text, ~2026-09-30):** — [Automation rules](https://help.x.com/en/rules-and-policies/x-automation)
  - "You may not like posts or hide replies in an automated manner."
  - Automated replies need opt-in, an easy opt-out and one reply per interaction. "A user following your account is not on its own a sufficient indication of user intent to receive an automated response." Replies based on keyword searches alone are not permitted.
  - AI reply bots need "prior written and explicit approval".
  - Automated following and automated unfollowing are not allowed.
  - Prohibited: "non-API-based forms of automation, such as scripting the X website. The use of these techniques may result in the permanent suspension of your account."
- **X developer guidelines (undated; index ~2026-05):** — [Developer Guidelines](https://docs.x.com/developer-guidelines)
  - "Non-API automation (scraping, browser automation) results in permanent suspension." Also: "Always use the official X API."
  - Replies: "Only if user engaged first. Max 1 reply per interaction." Also: "No unsolicited @mentions. No identical cross-posting."
  - Likes: "Automated, bulk, or indiscriminate liking — including auto-liking by keyword, hashtag, user, or schedule — is prohibited."
  - Follows: "No bulk, aggressive, or automated following."
  - Reposts: "OK for informational/entertainment. No bulk spam."
  - Allowed: "Automated account posts scheduled content (news, weather, quotes)".
  - Penalties: "Violations can result in app suspension, API access revocation, or permanent account bans." The page also says "There are no exceptions."
  - Related policy pages: [X Developer Policy](https://docs.x.com/developer-terms/policy); [Restricted uses](https://docs.x.com/developer-terms/restricted-use-cases).
- **help.x.com, Authenticity policy (index text, April 2025 version):** — [Authenticity](https://help.x.com/en/rules-and-policies/authenticity); [Authenticity / platform manipulation](https://help.x.com/en/rules-and-policies/platform-manipulation)
  - "Coordinating with and/or compensating others to conduct account metric inflation in any X feature, including Likes, Polls, Replies, Reposts, Lists, Views, or Follows, is not allowed."
  - It names follow churn: following then unfollowing large numbers of accounts to inflate a follower count.
  - An older version (index ~2025-04) also bans operating multiple accounts to interact with the same content, "exchanging engagement with others", using third-party services for these purposes, and "Bulk, duplicative, irrelevant, or unsolicited content sharing".
- **Follow limits, help.x.com (index text):** "every account can follow up to 400 accounts per day". At 5,000 accounts followed, "you may need to wait until your account has more followers before you can follow additional accounts". — [About following on X](https://help.x.com/en/using-x/x-follow-limit)
- **Post limits, help.x.com (index text; conflicting figures):** — [About X limits](https://help.x.com/en/rules-and-policies/x-limits); [Repost FAQs](https://help.x.com/en/using-x/repost-faqs?lang=nl)
  - "the post limit of 2,400 updates per day is further broken down into semi-hourly intervals".
  - A version indexed ~2026-05, and a newer one, list 50 original posts and 200 replies per day for unverified accounts.
  - A Repost FAQ says reposts count toward "your 1,000 posts per day limit".
- **Enforcement, help.x.com (index text):** — [Help with locked or limited account](https://help.x.com/en/managing-your-account/locked-and-limited-accounts); [How we enforce our rules](https://help.x.com/en/rules-and-policies/enforcement-options); [About liveness checks](https://help.x.com/en/using-x/liveness-checks); [Notices on X](https://help.x.com/en/rules-and-policies/notices-on-x)
  - "If your account appears to have exhibited automated behavior that violates the X Rules, we may lock it and request that you pass a captcha challenge."
  - "For severe violations, accounts will be permanently suspended at first detection." Lighter first offences can mean post deletion or a temporary lock.
  - A limited state can keep posts out of search and notifications.
  - Liveness checks block posting and following until passed.
- **2026 enforcement statements (dates decoded from post IDs):**
  - **2026-02-14,** Bier: "If a human is not tapping on the screen, the account and all associated accounts will likely be suspended—even if you're just experimenting." — [Bier](https://x.com/nikitabier/status/2022496540275937525?lang=en)
  - **2026-03-02,** a community account quoting Bier: Grok-based detection of spam growth tactics. — [Muskonomy](https://x.com/muskonomy/status/2028467036154958136)
  - **2026-03-18,** Bier: "The financial incentive to spam on X will decline enormously over the next 30 days and soon be negative." — [Bier](https://x.com/nikitabier/status/2034143577425776805)
  - **2026-07-16,** Bier: soliciting engagement three or more times means removal from revenue share and referral for suspension; about 4,000 accounts were removed that day. — [Bier](https://x.com/nikitabier/status/2077774853650944028)
- **Who set these policies.** Bier was hired as head of product (Bloomberg, 2025-06-30) and announced in August 2026 that he was stepping down (TechCrunch, 2026-08-05). His tenure ended on 2026-10-02, per his own post of 2026-10-03; Wikipedia notes its timeline is internally inconsistent. — [Wikipedia: Nikita Bier](https://en.wikipedia.org/wiki/Nikita_Bier)
- **2026-09-18, README:** "Under the Hood reports now show whether visibility was limited due to legal compliance, including the country." This implies X now gives a per-post explanation of visibility. — [README](https://github.com/xai-org/x-algorithm)

### Inferences
- **This project's current X method is a direct risk.** Project memory (2026-11-01) records two things. A Sonnet agent has already edited the scheduled Nov 1 post through the x.com composer in Chrome. And the plan is for an agent to schedule Nov 2-30 the same way, using an injected script (x-inject.js), once the owner approves. That counts as "browser automation" under the developer guidelines and as "scripting the X website" under the automation rules. It is also running on a 1-day-old account under graduated access. Two compliant alternatives exist:
  - the owner schedules each post by hand in the native composer;
  - an official-API route: Buffer, or a small app of the project's own (see section 6).
  — [project memory](C:/Users/swapnilb/.claude/projects/c--Website-strictly-fyi/memory/project_social_profiles.md)
- **A heuristic operating envelope for a new brand account.** This is my inference, not an X number:
  - 1-5 original posts a day;
  - 10-30 hand-written, non-repetitive replies a day, spread across sessions;
  - no more than about 20-50 follows a day, all of relevant accounts;
  - no mass unfollows, no identical text, no "follow back" asks, no engagement groups;
  - links in only a minority of posts.
  
  All of these sit well inside the published limits and avoid the named spam patterns.
- Quiet suppression is the likeliest failure mode, not suspension. Posts get dropped for non-followers, replies land in the spam or health section, the account disappears from search. The ranking code applies spam filters "at high recall" only to recommendations, so a follower count that stays flat while followers still engage is the warning sign.

### Gaps
- The X limits page could not be read word for word because of the Cloudflare block. The 50/200 figures come from the search-index summary and conflict with the 1,000/day repost figure.
- Daily DM limits were not retrieved.
- X publishes no thresholds for what triggers spam labels or visibility filtering. How users open the "Under the Hood" report was not checked.
- Whether enforcement changed after Bier left (2026-10-02) is unknown.

## 6. Execution tools: X's native scheduler, X Pro, third-party schedulers, X API prices in 2026, and analytics without Premium

### Takeaway
- **Native scheduler:** a free account can schedule a single post in x.com's composer (first-party, 2026-10-31). Long posts cannot be scheduled. Whether threads, polls or image posts can be scheduled natively could not be confirmed from sources here.
- **X Pro:** adds a Scheduled column and scheduling across several accounts.
- **Third-party:** Buffer still publishes to free X profiles (free plan: 3 channels, 10 queued posts each, 1 thread). Hypefury has dropped X. Typefully's current terms could not be read.
- **X API:** pay-per-use since 2026-02-06, with no free tier for new developers. A post costs $0.015, a post containing a URL $0.20 (since April 2026), and reading the account's own data $0.001 per item.
- **Analytics:** the full dashboard is Premium-only; free accounts keep per-post analytics.

### Cited Findings
- **2026-10-31, first-party:** the native "Schedule post" in the x.com composer works on this free account, using a 24-hour clock in IST. The Nov 1 post (text) was scheduled. Scheduling the Nov 2-30 posts with title-card images is planned but not yet recorded as done, so image scheduling is not confirmed first-hand. — [project memory](C:/Users/swapnilb/.claude/projects/c--Website-strictly-fyi/memory/project_social_profiles.md)
- **help.x.com, X Pro (index text):** you schedule from the post button by picking a date and time; "Adding a Scheduled column lets you view and edit scheduled posts"; someone managing several accounts in X Pro can schedule for each of them. — [How to use X Pro](https://help.x.com/en/using-x/how-to-use-x-pro); [About advanced X Pro features](https://help.x.com/en/using-x/advanced-xpro-features)
- **help.x.com, long posts:** "Longer posts cannot yet be scheduled." — [X Premium how to](https://help.x.com/en/using-x/x-premium-how-to)
- **help.x.com, polls (index text):** up to four options, lasting from 5 minutes to 7 days. The search result said nothing about scheduling polls. — [About X Polls](https://help.x.com/en/using-x/x-polls)
- **Buffer pricing page (pricing last updated November 2025):** — [Buffer pricing](https://buffer.com/pricing)
  - Free: $0, up to 3 channels, 10 scheduled posts per channel, 1 threaded post.
  - Essentials: $5/month or $60/year per channel. Team: $10/month or $120/year per channel. Both have unlimited threads, under a fair-use cap of 5,000 posts per channel.
  - "Free and Premium X profiles both support automatic publishing". Basic analytics is listed for Premium X profiles but not for free ones.
  - The page says nothing about X polls or an X API surcharge.
- **Hypefury pricing page (© 2025):** "Nope! Hypefury no longer supports 𝕏 : (". Its supported channels are Bluesky, Threads, LinkedIn, Instagram and TikTok. Plans: Flexible $6/month per channel, Full $19/month. — [Hypefury pricing](https://hypefury.com/pricing)
- **Typefully:** the pricing page renders with JavaScript and the fetch returned no plan details. — [Typefully pricing](https://typefully.com/pricing)
- **X API pricing, docs.x.com (read 2026-11-01; "subject to change"):** — [X API pricing](https://docs.x.com/x-api/getting-started/pricing)
  - "pay-per-usage pricing with no subscriptions", using credits bought in advance in the Developer Console.
  - Writes:
    - Post create $0.015
    - Post create with URL $0.200
    - Post create (summoned) $0.010
    - DM interaction create $0.015
  - Reads:
    - $0.005 per post
    - $0.010 per user or followers/following item
    - Owned reads $0.001 per item of the user's own data
  - Pay-per-use plans are capped at "3 million Post reads per monthly billing cycle".
  - New paying users get $20 in promotional credits.
- **Pay-per-use history:**
  - **2026-02-09, Gigazine:** in closed beta "since around October 2025" and now officially released. Legacy free users got a one-time $10 voucher. — [Gigazine](https://www.gigazine.net/gsc_news/en/20260209-x-api-pay-per-use/)
  - **OpenTweet ("Updated July 2026"; a scheduling vendor):** became the default on 2026-02-06; the free tier ended for new sign-ups; the $0.20 link surcharge was added in April 2026; remaining Basic subscribers were auto-migrated from 2026-06-01. — [OpenTweet](https://opentweet.io/how-to/x-api-pay-per-use-explained)
  - **2026-04-28, Open Terms Archive:** X replaced its $200 entry-level plan with self-serve pay-per-use. — [Open Terms Archive](https://opentermsarchive.org/en/memos/x-replaces-its-dollar200-entry-level-api-plan-with-a-pay-per-use-model/)
  - **2026:** free access now goes only to "for-good public utility apps". — [Postproxy](https://www.postproxy.dev/blog/x-api-pricing-2026/)
- **Analytics:**
  - **2026-10-23, Hootsuite:** the full dashboard is Premium-only. Free accounts get per-post data in the mobile app (three dots, then "View analytics"): impressions, engagements, detail expands, new followers and profile visits. — [Hootsuite](https://blog.hootsuite.com/twitter-analytics-guide/)
  - **2026-03-10, Sprout Social:** "You must have a subscription to view analytics for multiple posts." — [Sprout Social](https://sproutsocial.com/insights/twitter-analytics/)

### Inferences
- **Compliant ways to replace the Chrome-agent scheduling, cheapest first:**
  - the owner schedules by hand in the native composer, about 2-3 minutes a post;
  - Buffer's free plan, which keeps a rolling 10-post queue and publishes through the official API;
  - a small API app of the project's own, which falls under the "scheduled content" allowance. At $0.015 a post, 30 link-free posts cost about $0.45 a month, or about $6 if every post carries a link.
- **Threads:** use Buffer (one thread on the free plan) or post by hand. **Polls:** post by hand; no tool examined here confirms X poll support.
- **Analytics without Premium:** read per-post "View analytics" in the mobile app, or pull the account's own posts through the API at $0.001 per item, and log weekly totals by hand.

### Gaps
- Not confirmed: whether the native web scheduler accepts threads, polls or videos.
- Not verified here: whether X Pro needs a paid tier. It is widely reported as Premium-only since 2023.
- Typefully's 2026 plans and X support are unknown.
- Whether Buffer passes on X's per-post or $0.20 link costs is unknown; its November 2025 pricing page is silent.
- When and why Hypefury dropped X is unknown.

## 7. Documented case studies of accounts grown from zero on X, 2024-2026

### Takeaway
Documented "zero to traction" stories from 2024-2026 are scarce and self-reported, and almost all describe personal founder or creator accounts, not brands. The common pattern:
- heavy daily replying to accounts in the same niche, often within the first hour of their posts;
- one narrow topic;
- several posts a day;
- 1-4 hours a day of hands-on work.

Results range from about 470 followers in 10 weeks (2025) to a 2023 claim of 20,000 followers in 60 days that rode viral posts.

### Cited Findings
- **2025-05-18, Tom Butler:** 0 to 470+ followers in 10 weeks, about 50% growth a week. Week 1 went from 20 to 66 and week 2 reached 135, with daily impressions up about tenfold. The method was the "reply guy" approach of following, liking and replying to small accounts, which are likelier to notice and follow back. — [Tom Butler on X](https://x.com/tomlbutler/status/1923972320973967595)
- **May 2025, Sherry Jiang (cited in Butler's thread):** under 10K followers, replies are the main growth lever. — [Tom Butler on X](https://x.com/tomlbutler/status/1923972320973967595)
- **2026, Indie Hackers (snippet only):** a brand-new account reached 560,000 impressions in 10 days, with an engagement rate 22x average and no ad spend, by replying to larger accounts within 30-60 minutes of their posts. No follower count was given. — [Indie Hackers](https://www.indiehackers.com/post/zero-followers-high-reach-how-to-get-impressions-on-x-in-2026-1dd99f725d)
- **2023-11-30, pozoe (outside the window, for scale):** about 200 to 4,700 followers and 5.4M impressions in 26 days, then 10,000 by day 41, 15,000 by day 52 and 20,000 by day 59. Tactics:
  - replies on "look-alike posts" from 50K+ accounts;
  - 10-15+ posts a day;
  - trend and meme posts that each passed 1M impressions;
  - 3-4 hours a day.
  
  The headline's "41M impressions" is not supported by the figures in the body. — [pozoe Substack](https://pozoe.substack.com/p/how-i-grew-a-twitterx-account-to)
- **2026, teract.ai:** its anonymous case studies (0 to 5,000, 500 to 15,000, 1,000 to 25,000 followers) are unsourced. The page also shows sample tweets that appear to be product mock-ups. They are excluded as evidence. — [teract.ai](https://www.teract.ai/resources/twitter-reply-guy-strategy-2026)

### Inferences
- Realistic early pace for a free account doing this by hand: tens of followers a week in the first month, compounding only if replies and posts land with a niche audience. The 50%-a-week growth reported starts from a base of a few dozen followers.
- A faceless brand has no personal story to trade on, so its replies must carry the value: a sourced fact, a date, a correction, a "here's the original document". That fits the strictly.fyi fact-check positioning, and it is the kind of reply the ranking rewards (replies predicted to draw replies, no mutes).
- Every documented success was hands-on, live replying. None relied on scheduled posts alone, which suggests the scheduled 30-day queue will do little for follower growth without daily manual replying.

### Gaps
- No case study of a brand or publisher account (as opposed to a person) growing from zero on X in 2024-2026 with verifiable numbers was found.
- No case study describes growing under the 2026 graduated-access and Grok-enforcement regime.
- The Indie Hackers post could not be opened (403), so only its snippet is used.
- All figures are self-reported, and several sources sell growth tools or courses.
