# Growing a brand-new Instagram brand account from zero (state as of 1 November 2026)

_Compiled 2026-11-01 for the strictly.fyi Instagram playbook. The account does not exist yet. SOCIAL.md plans a professional account named "Strictly FYI" with the handle `@strictly.fyi`, one original carousel a day, a mainly US audience, run from India._

_Labels: **[primary]** means Meta or Instagram's own pages, system cards, developer docs, or Adam Mosseri quoted by name (often via press). **[measured]** means third-party data, with sample and period given. **[lore]** means unverified practitioner claims and anecdotes. Dates are publication or "updated" dates. "Read 2026-11-01" marks an undated page, which Meta may have edited at any time._

_How the sources were read:_
- _help.instagram.com gives WebFetch and curl only a JavaScript shell or an error page. The Wayback Machine's 2026-10-28 capture of the Terms page is the same shell. The Help Center articles quoted here were read word for word on 2026-11-01 through the r.jina.ai rendering reader._
- _The Help Center's search and home pages returned a CAPTCHA to that reader. Articles whose IDs I did not already have could not be opened: in-app scheduling, username rules, collabs, action blocks. Two Help Center claims come from the WebSearch tool's index extraction and are marked "(index text)"._
- _creators.instagram.com served Hindi pages to WebFetch, which suggests it geolocates the fetcher to India. The 2026-04-30 originality post was read in Hindi and translated by the fetch tool; Social Media Today's English report of it is cited alongside. The other creators.instagram.com pages were read in English through the reader._
- _www.meta.com/meta-verified rendered in an English (UK) locale with a Diwali offer and prices in "$", so the region and currency of those prices are unclear._
- _All 12 allowed WebSearch calls were used. No search-engine result pages were fetched and kane-cli was not used. Social Media Today's own site search was used to find dated press coverage._

---

## 1. How new and small accounts get recommended to non-followers; what limits apply to new accounts; whether Trial Reels are open to them

### Takeaway
Instagram documents no X-style "graduated access" gate for new accounts. Since April 2024 Instagram has said that every eligible reel is first shown to a small audience of non-followers, whatever the poster's follower count, and is widened only if it performs. Explore, Reels and Feed recommendations mostly show accounts the viewer does not follow, and sends (DM shares) per reach are the signal Mosseri ties most to unconnected reach.

The real gates are follower counts and recommendation eligibility:
- **Trial Reels:** a professional account needs 200 followers (a personal one needs 1,000), so a zero-follower account cannot use them.
- **Live:** needs 1,000 followers and a public account.
- **Recommendations:** the account must stay inside the Recommendations Guidelines and is ineligible otherwise. The guidelines cover originality (extended to photos and carousels on 2026-04-30), no engagement bait, no purchased likes, and themes around death or violence. Account Status shows eligibility.

### Cited Findings

**Where non-follower reach comes from**
- **2023-05-31 [primary].** Mosseri's "Instagram Ranking Explained" says of Explore: "Most of the content you'll see in Explore is from people you don't follow". Of Reels: "Much like Explore, the majority of what you see is from accounts you don't follow." In the Reels section it says Instagram considers "popularity signals such as number of followers or level of engagement … to help find compelling content from a wide array of people and give everyone a chance to find their audience." — [Instagram Ranking Explained](https://about.instagram.com/blog/announcements/instagram-ranking-explained/)
- **2024-04-30 [primary].** In "Helping Creators Find New Audiences", Instagram says: "Historically because of how we've ranked content, creators with large followings and aggregators that share copies of original content have gotten more reach in recommendations than smaller, original content creators."
  - It announced "A new input to ranking that will give smaller creators more distribution."
  - It also said "every piece of eligible content (e.g., content that is original, does not violate our community guidelines, has no visible watermarks and satisfies our recommendation guidelines) is shown to a small audience that we think will enjoy it, regardless of whether they follow the account that posted it or not. As this audience engages with the content, the top performing set of reels are shown to a slightly wider audience, then the best of these are shown to an even wider group, and so on."
  - Before this change, "reels were ranked primarily based on how an account's followers engaged with them."
  - The rollout was "over the coming months", so the current mechanics may differ.
  — [creators.instagram.com, Helping Creators Find New Audiences](https://creators.instagram.com/blog/recommendations-and-originality)
- **Undated, read 2026-11-01 [primary].** Instagram's growth page restates the mechanism: "When you post a reel on Instagram, it's shown to both followers and non-followers. Among non-followers, your reel is initially shown to a small audience of people we think will enjoy it… This process is designed to level the playing field by distributing content based on its engagement, not just the creator's follower count." The same page says "Reels makes up over 50% of all time spent on Instagram". — [creators.instagram.com/how-to-grow](https://creators.instagram.com/how-to-grow)
- **Undated, read 2026-11-01 [primary].** "Both Facebook and Instagram may recommend content, accounts, and entities that people do not already follow. Some examples of our recommendation experiences include Explore, Reels, Accounts You May Like, and Feed." — [Recommendations on Instagram (Help Center)](https://help.instagram.com/313829416281232)
- **System card updated 2025-09-18 [primary].** The Stories tray draws on "all potential stories—excluding advertisements—shared by accounts you follow". The card does not mention recommended accounts, so Stories offer no route to non-followers. — [Meta Transparency Center, Instagram Stories](https://transparency.meta.com/features/explaining-ranking/ig-stories/)
- **System card updated 2026-06-29 [primary].** Feed recommendations gather "a portion of the public content available on Instagram" that follows "quality and integrity rules". Its listed predictions include comments, time spent, scrolling past and "Informativeness". The card says "This signal is purely generated by LLM to assess the post's content quality." — [Meta Transparency Center, Instagram Feed Recommendations](https://transparency.meta.com/features/explaining-ranking/ig-feed-recommendations/)
- **System card updated 2026-06-22 [primary].** Explore retrieves "up to 1500 media" from "author-based sources (media from authors that you've engaged with) and media-based sources (media similar to media you've engaged with)". Its predictions include "How likely you are to follow the author of a post" and "How likely you are to save a post". — [Meta Transparency Center, Instagram Explore](https://transparency.meta.com/features/explaining-ranking/ig-explore/)
- **System card updated 2025-11-11 [primary].** Reels chaining collects "reels that are similar to those you've recently engaged with", then narrows them to about 100. Its predictions include "How likely you are to watch less than three seconds of a reel", "How likely you are to follow the author of a reel" and "How likely you are to watch more of a reel than 95% of users who watched reels of the same length". — [Meta Transparency Center, Instagram Reels Chaining](https://transparency.meta.com/features/explaining-ranking/ig-reels-chaining/)
- **2025-08-06 [primary, via press].** Since Instagram added Reposts, a repost by someone else "may be recommended to that person's followers, even if those people don't follow you". Instagram calls this "a new opportunity to reach more people whenever you create something worth sharing." — [Social Media Today, Instagram Launches Re-Posts](https://www.socialmediatoday.com/news/instagram-adds-reposts-friends-feed-reels-friend-map/756996/)
  - The Help Center (read 2026-11-01) adds that "you can only repost reels or posts if the original creator allows reposts of their content", through the "Reposts on posts and reels" toggle. — [Repost a reel or a post (Help Center)](https://help.instagram.com/1743992069496286)

**Signals**
- **2025-01-22 [primary, via press].** Mosseri: "The top three signals that matter most for ranking are watch time, likes and sends." He advised to "pay close attention to average watch time, likes per reach, and sends per reach", and said "Likes are slightly more important for connected content, and sends are slightly more important for unconnected content." — [Social Media Today, 2025-01-22](https://www.socialmediatoday.com/news/instagram-shares-algorithm-insights-2025/738034/)
- **2024-05-19 [primary, via press].** Mosseri: "More important than watch time or like and comment counts is send rates". He added "generally, I think the rate is more important than the count" and "sends per reach correlate more, in my experience, with overall reach than anything else". He framed this as his experience, not platform data. — [Social Media Today, 2024-05-19](https://www.socialmediatoday.com/news/instagram-chief-post-share-rates-key-driver-reach/716540/)
- **Undated, read 2026-11-01 [primary].** Instagram's reach tips include "Like or reply to comments on your reels within the first couple days to generate more engagement" and a minimum of "720p" and "30 frames per second". It also says "We consider the popularity of trends on Reels, including music and sounds, to determine how to rank and recommend content to new audiences." — [creators.instagram.com/how-to-grow](https://creators.instagram.com/how-to-grow)

**What blocks or reduces recommendation**
- **Undated, read 2026-11-01 [primary].** The Recommendations Guidelines list content that is allowed but may not be recommended:
  - "Content that discusses self-harm, suicide, or eating disorders, as well as content that depicts or trivialises themes around death or depression."
  - "Content that may depict violence, such as people fighting."
  - "Unoriginal content that is largely repurposed from another source with only minor, immaterial edits, without adding material value."
  - "Long captions unrelated to the underlying content and coordinated comment networks intended to artificially drive engagement and distribution."
  - Content rated by third-party fact-checkers, in countries where Meta supports fact-checking.
  - Under-18 viewers get additional "age-appropriate content guidelines".

  — [Recommendations on Instagram](https://help.instagram.com/313829416281232)
- **Same page [primary].** Instagram tries not to recommend accounts that:
  - "Recently violated Instagram's Community Guidelines"
  - "Repeatedly engaged in misleading practices to build followings, such as purchasing 'likes'"
  - "Have been banned from running ads on our platforms"
  - "Repeatedly and recently shared content that prominently features a photorealistic AI-generated person, unless the account has disclosed this by adding the AI-generated profile label"

  — [Recommendations on Instagram](https://help.instagram.com/313829416281232)
- **2024-04-30 [primary].** The same originality post lists more categories that are not recommended: political content, "Content that users broadly tell us they dislike, such as clickbait or engagement bait", and exaggerated health claims. On copies it says:
  - "when we find two or more identical pieces of content on Instagram, we will only recommend the original one."
  - "accounts that repeatedly post content from other Instagram users that they didn't create or enhance in a material way will not be shown in surfaces where we recommend content"
  - The aggregator rule exempts "a set of publishers we've identified who have licensing agreements and/or explicit permissions from content creators".

  — [Helping Creators Find New Audiences](https://creators.instagram.com/blog/recommendations-and-originality)
- **2026-04-30 [primary; read in Hindi and translated by the fetch tool].** The 2024 Reels originality protections now also apply to photos and carousels. Accounts that post unoriginal photo or carousel content are not shown where Instagram recommends content. To regain eligibility, an account's most recent photos, carousels and Reels must be judged original over a 30-day period. Adding only a border, watermark, subtitles or credits does not count as original. — [creators.instagram.com, Rewarding original creators](https://creators.instagram.com/blog/rewarding-original-creators-on-instagram/)
  - Social Media Today's English report adds two points. Instagram accepts "photo series, how-to guides and visual stories as original content". The update "will not change how it displays content to followers of an account." — [Social Media Today, 2026-04-30](https://www.socialmediatoday.com/news/instagram-updates-algorithm-to-benefit-original-creators/819016/)
- **Undated, read 2026-11-01 [primary].** Instagram's original content guidelines:
  - Original work includes "Content you designed — whether it's a photo series, a how-to guide, or a visual story".
  - Low-effort additions such as "borders, watermarks, speed changes, just crediting the original creator" do not make content original.
  - Enforcement: "If your account primarily posts unoriginal reels, photos, or carousels you didn't create or edit in a material way, your account may not be seen in recommendations to new audiences… you can become eligible again when a significant percentage of your recently posted reels, photos, and carousels are considered original in a 30-day period."

  — [Original content guidelines](https://creators.instagram.com/original-content-guidelines)
- **2023-05-31 [primary].** "We aim to make certain reels less visible for other reasons, such as low-resolution or watermarked reels, reels that are muted or contain borders, reels that are majority text, or reels that have already been posted on Instagram." The 2023 date means this may have changed. — [Instagram Ranking Explained](https://about.instagram.com/blog/announcements/instagram-ranking-explained/)
- **Undated, read 2026-11-01 [primary].** Instagram's growth pages list these reach-killers:
  - "Reels over 3 minutes won't be recommended to new audiences." The Help Center says the same: [Record a reel](https://help.instagram.com/2720958398006062).
  - "Having third-party watermarks on your reels may prevent them from being recommended to new audiences".
  - "Don't publish copies of reels or posts."
  - "engagement bait".

  — [creators.instagram.com/how-to-grow](https://creators.instagram.com/how-to-grow)
- **Undated, read 2026-11-01 [primary].** On eligibility, the Help Center says:
  - "If you're eligible, it means Instagram may recommend your account or content on Reels, Feed, Explore, Search or Suggested Accounts to people who don't follow you."
  - "your eligibility for recommendations doesn't guarantee that your content will be recommended."
  - "If your account is not eligible to be recommended, none of your content will be recommended"
  - "these guidelines only apply to public accounts and recommendations to people who don't follow you. Even if you're not eligible to be recommended, your content can still show up for your followers."
  - Account Status shows this for professional accounts.

  — [Recommendation eligibility on Instagram](https://help.instagram.com/653964212890722)
- **2023-05-31 [primary].** If an account repeatedly posts content against the guidelines, "none of their posts will be eligible for recommendation for a period of time." — [Instagram Ranking Explained](https://about.instagram.com/blog/announcements/instagram-ranking-explained/)
- **2026-08-31 [primary].** Instagram will "limit the reach of profiles that feature an AI-generated person and do not add this label". Creators who only use AI tools in their process do not need the profile label. — [creators.instagram.com, AI-generated profile label](https://creators.instagram.com/blog/ai-generated-profile-label)

**Search and Suggested Accounts (how a new account gets found by name)**
- **System card updated 2026-06-23 [primary].** For account results, the signals include "Similarity between your search words and the account's 'username or profile name'". Other signals are the searcher's past profile visits and social-graph overlap. — [Meta Transparency Center, Instagram Search](https://transparency.meta.com/features/explaining-ranking/ig-search/)
- **System card updated 2025-03-07 [primary].** Suggested Accounts gathers candidates from "followers of accounts the user already follows", "popular accounts in the user's geographical region" and "accounts related to topics and products the user has recently engaged with". Its signals include "How many mutual friends do you and the suggested accounts have on Instagram" and "How many people follow the suggested account". — [Meta Transparency Center, Instagram Suggested Accounts](https://transparency.meta.com/features/explaining-ranking/ig-suggested-accounts/)
- **Undated, read 2026-11-01 [primary].** For public professional accounts whose holder is over 18, Instagram lets Google and Bing index "photos and videos from public reels and posts that were uploaded or posted from January 1, 2020 onwards". This can be turned off. — [Why search engines might index public Instagram photos and videos](https://help.instagram.com/147542625391305)

**Follower-count and other gates**
- **Undated, read 2026-11-01 [primary].** Trial Reels eligibility, verbatim:
  - "If you have a **professional (business or creator) account**, you must have at least 200 followers."
  - "If you have a **personal account**, you must have at least 1,000 followers."
  - The account must be public. "If your public account is ineligible to appear in recommendations, you will also lose access to trial reels."
  - Distribution: "After you share your trial reel, your followers won't see it in feed or Reels."
  - "Your trial reel may get limited reach if Instagram detects that you've previously shared the same content."
  - "Trial reels are evaluated independently in Instagram's ranking and don't impact the performance or ranking of your standard reels content."
  - The "Share to everyone automatically" option shares a reel "if it's performing well soon after you publish it".

  — [About trial reels on Instagram](https://help.instagram.com/1013292530224018)
- **Conflicting thresholds [lore/secondary].**
  - On 2026-03-01 Social Media Today reported that creator tools were opened "to all public accounts". In the fetch tool's summary of the same article (not a verbatim quote), Trial Reels become an option at 1,000 followers. That matches the Help Center's personal-account figure. — [Social Media Today, 2026-03-01](https://www.socialmediatoday.com/news/instagram-opens-up-content-scheduling-to-all-users/813448/)
  - On 2026-10-29 a third-party guide said the December 2024 launch post deferred to the Help Center for the minimum. It also said some scheduling tools still state 1,000 followers for every account. — [Flowgent, Instagram Trial Reels (2026)](https://flowgent.ai/blog/instagram-trial-reels)
- **2025-12-03 [primary].** The Content Publishing API accepts optional `trial_params`, so approved apps can publish Trial Reels. — [Instagram Platform changelog](https://developers.facebook.com/docs/instagram-platform/changelog/)
- **2026-04-02 [primary, via press].** Mosseri on scheduling Trial Reels in the app: "Back in November, someone asked why can't you schedule a Trial Reel. And so we built it, and now you can." — [Social Media Today, 2026-04-02](https://www.socialmediatoday.com/news/instagram-allows-creators-to-schedule-trial-reels/816549/)
- **2025-08-02 [primary, via press].** The in-app notice reads: "Only public accounts with 1,000 followers or more will be able to create live videos." Meta confirmed the change to Engadget. — [Engadget, 2025-08-02](https://www.engadget.com/apps/instagram-public-accounts-with-less-than-1000-followers-can-no-longer-go-live-133049758.html)
- **2025-12-18 [primary, via press].** "Instagram will gradually update the number of hashtags that you can include in a caption for a reel or post to five." In February 2025 Mosseri said hashtags "don't work" to increase reach. — [Social Media Today, 2025-12-18](https://www.socialmediatoday.com/news/instagram-implements-new-limits-on-hashtag-use/808309/)
  - Contradicted in part: one blogger reported that the five-tag cap appeared for some accounts and then reverted. That is anecdotal and undated. — [Lilach Bullock](https://www.lilachbullock.com/why-instagram-only-lets-you-use-5-hashtags-some-posts/)
- **Undated, read 2026-11-01 [primary].** Instagram's reach page warns: "Irrelevant hashtags can cause your content's reach to suffer in the long run." — [creators.instagram.com/reach-your-target-audience](https://creators.instagram.com/reach-your-target-audience)

### Inferences
- With zero followers, every view must come from recommendations: Explore, Reels, Feed recommendations, Search and Suggested Accounts, plus Reposts by others. Stories and broadcast channels reach no one until there are followers.
- Instagram's own description is that eligible content gets a first small non-follower test whatever the follower count. A new account's handicap is therefore weak early signals, not a documented trust filter. Social-graph features such as Suggested Accounts (mutuals, follower count) will favour it slowly.
- The "small audience first" process is described explicitly for reels. For carousels the documented routes are Explore and Feed recommendations, plus the originality rules extended to carousels on 2026-04-30. strictly.fyi's carousels are designed, original "visual stories" and should qualify. Post-level originality matters most if a carousel uses archival photos that others have posted; the slide text then needs to add real context.
- The first milestone is 200 followers, which unlocks Trial Reels on a professional account. Live waits until 1,000.
- For strictly.fyi specifically:
  - **Death and violence.** History entries about death, executions, catacombs or war may fall under "depicts or trivialises themes around death" or "may depict violence". Use non-graphic imagery and check Account Status after such posts.
  - **Engagement bait.** "Comment YES" style prompts are non-recommendable; SOCIAL.md's "at most one genuine question" is consistent with that.
  - **Sends.** Sends per reach is the unconnected signal, so slides should be worth forwarding to a friend.
  - **Name field.** Search matches the username or profile name, so the name field can carry a keyword, for example "Strictly FYI · Science & History". The 30-character name limit is lore and is not verified here.
- Reels made of mostly text are de-ranked (2023 statement). If strictly.fyi later turns carousels into reels, it should add voiceover or visuals, not just slide text.
- Instagram advises posting "on Instagram at the same time as other platforms to protect against others resharing your content". The same cards go out on X and Bluesky, so Instagram should get each card no later than X does.

### Gaps
- Meta says nothing about whether brand-new accounts get any extra early dampening or a warm-up period. I found no Instagram equivalent of X's "graduated access" notice. This is not proof that none exists.
- Two help-page facts are undated: the 200-follower Trial Reels threshold and when it replaced the earlier figure.
- I found nothing on whether the first small test audience is drawn from the poster's own country. That matters for an India-based account aiming at the US.
- A 2025-02-26 creators.instagram.com post, "make-instagram-recommendations-work-for-you", on helping creators "small to large" grow, appears in the blog listing. Its URL returns "Sorry, this page isn't available", so it was not read.

---

## 2. Which tactics have evidence behind them; realistic follower growth in the first month

### Takeaway
- **Collabs:** the strongest primary evidence favours collabs where the larger account is the original poster, because ranking leans toward the original collaborator.
- **Volume and originality:** consistent, frequent, original posting has measured support. Buffer's within-account data ties more posts per week to faster follower growth, and Instagram says its fastest-growing creators post 10 or more reels a month.
- **Low value from zero:** Stories, broadcast channels and reposting your own posts to Stories reach only followers, so they do little for a new account. Mosseri said in April 2026 that the Stories repost "hack" does not meaningfully change reach.
- **Commenting on big accounts:** Meta offers no evidence that it grows followers.
- **Threads and Facebook:** cross-posting to Threads is a free extra channel. Facebook cross-posting needs a Page if the brand is to stay off the owner's personal profile.
- **First month:** there is no rigorous data for a from-zero brand account. Anecdotes run from about a dozen to 15,000 followers in 30 days.

### Cited Findings

**Collab posts**
- **2024-08-26 [primary, via press].** Mosseri: "the ranking system biases more towards the original collaborator than the person who accepts". If "the original collaborator is the larger account, that will help on the margins." — [Social Media Today, 2024-08-26](https://www.socialmediatoday.com/news/instagram-chief-shares-tips-improve-content-performance/725294/)
- **2026-09-16 [measured].** Emplifi reviewed 3,791 brand profiles on Instagram, covering posts from January 1 to June 30 (2026 per the article's context). The article's post count, "520,00", is garbled. Findings:
  - More than 73% of brands use collabs.
  - Accepted collabs, where a creator publishes and invites the brand, deliver the strongest results: "more than 5x the amplification of non-collab posts" in ecommerce and retail.
  - "Amplification" is not defined, and no follower-growth figures are given.

  — [Social Media Today on Emplifi](https://www.socialmediatoday.com/news/report-highlights-the-value-of-creator-led-collabs-on-instagram/830619/)
- **2026-04-30 [primary].** Instagram points creators to "collaboration, remix, and paid partnership label" features so that original creators get credit. This was read in Hindi and translated. — [creators.instagram.com, Rewarding original creators](https://creators.instagram.com/blog/rewarding-original-creators-on-instagram/)
- **Read 2026-11-01 [primary, third-party product doc].** Through the API, Buffer supports "Up to 3" collaborators on posts, reels or carousels, and only when Instagram is connected through a linked Facebook Page. — [Buffer support, Scheduling Instagram posts](https://support.buffer.com/articles/scheduling-instagram-posts-reels-stories-and-notifications-3XA98S9Q5p)
- **2025-12-03 [primary].** Accept and decline endpoints for collaboration invites were added for the Facebook Login API. — [Instagram Platform changelog](https://developers.facebook.com/docs/instagram-platform/changelog/)

**Commenting on larger accounts' posts**
- **System card updated 2026-04-03 [primary].** "Comments are then ordered by their scores." The scores reflect "the relevance of the comment to the post and how popular the comment is among all viewers". "Comments less likely to be reported are ranked higher." The viewer's own, friends' and pinned comments can sit at the top. — [Meta Transparency Center, Instagram Comments](https://transparency.meta.com/features/explaining-ranking/ig-comments/)
- **Undated, read 2026-11-01 [primary].** "coordinated comment networks intended to artificially drive engagement and distribution" make content non-recommendable. — [Recommendations on Instagram](https://help.instagram.com/313829416281232)
- **Undated [lore].** "Comment on big accounts to grow" is a common practitioner tactic. I found no Meta statement or measured study supporting it for Instagram.

**Stories and resharing to Stories**
- **System card updated 2025-09-18 [primary].** The Stories tray shows stories from "accounts you follow". — [Meta Transparency Center, Instagram Stories](https://transparency.meta.com/features/explaining-ranking/ig-stories/)
- **2024-08-26 [primary, via press].** Mosseri: "Posting a Reel to your Stories will help a bit with reach", "as long as it's not something that annoys your followers." — [Social Media Today, 2024-08-26](https://www.socialmediatoday.com/news/instagram-chief-shares-tips-improve-content-performance/725294/)
  - Contradicted later. On 2026-04-06 Mosseri said reposting feed posts to Stories "it's not going to meaningfully change your reach overall" and "It's more important to focus on who is your audience". He added that most reach hacks usually don't work and that Instagram shuts them down when it finds them. — [Social Media Today, 2026-04-06](https://www.socialmediatoday.com/news/instagram-chief-debunks-popular-engagement-hack/816781/)
- **2025-08-13 [measured].** Buffer's frequency study excluded Stories because they are rarely shown to non-followers. — [Buffer, How often to post on Instagram](https://buffer.com/resources/how-often-to-post-on-instagram/)

**Broadcast channels**
- **Undated, read 2026-11-01 [primary].** Instagram describes channels as a way "to connect directly with your followers". "Your followers will receive a one-time notification to join the channel. Only followers who join will receive subsequent notifications". Members "can react to content and vote in polls, but cannot send messages", and they can share a link with friends. — [creators.instagram.com, Broadcast channels](https://creators.instagram.com/create/broadcast-channels)
- **2023-06-15 [primary, via press].** Instagram expanded channel creation to "all users that have an active Creator account". The article does not mention business accounts or follower minimums. — [Social Media Today, 2023-06-15](https://www.socialmediatoday.com/news/instagram-expands-broadcast-channels-all-creators-tests-channel/653164/)

**Cross-posting to Threads and Facebook**
- **2024-08-22 [secondary, reporting Meta's rollout].** Cross-posting from Instagram to Threads is "available to all users" as an opt-in per-post toggle, and Instagram users can turn on automatic sharing of all posts. The same report says:
  - Reels can't be cross-posted from Instagram.
  - Hashtags become plain text.

  — [Social Media Today, 2024-08-22](https://www.socialmediatoday.com/news/meta-activates-threads-crossposting-facebook-instagram/725058/)
- **2025-09-30 [secondary].** Threads hides most hashtags in posts cross-posted from Instagram behind a "Show hashtags" button. Threads favours one topic tag per post. — [Social Media Today, 2025-09-30](https://www.socialmediatoday.com/news/threads-hides-hashtags-on-cross-posts-instagram/761552/)
- **2026-02-22 and 2026-10-04 [secondary, titles only, not opened].** "Threads now offers simplified sharing to Instagram" and "Instagram adds Threads sharing sticker for Stories" — [SMT 2026-02-22](https://www.socialmediatoday.com/news/threads-now-offers-simplified-sharing-to-instagram/812790/); [SMT 2026-10-04](https://www.socialmediatoday.com/news/instagram-adds-threads-sharing-sticker-for-stories/832085/)
- **Undated, read 2026-11-01 [primary].** Facebook sharing:
  - A reel can be shared to your Facebook account when you create it. There is an option to "Share all future reels to Facebook automatically", and "This feature isn't available to everyone." — [Share Instagram reels to Facebook](https://help.instagram.com/459497729122868)
  - "If you've linked a Facebook page to your professional account on Instagram, you'll only be able to share your Instagram posts to Facebook through that page. You won't be able to share to another Facebook page or to a Facebook profile." — [About professional accounts](https://help.instagram.com/138925576505882)
- **Undated, read 2026-11-01 [primary].** "Be sure to post your content on Instagram at the same time as other platforms to protect against others resharing your content on IG and getting that distribution instead of you." — [creators.instagram.com/reach-your-target-audience](https://creators.instagram.com/reach-your-target-audience)

**Consistent posting and frequency**
- **Undated, read 2026-11-01 [primary].** "when we look at creators with the greatest net follower growth rates we see, on average, they post 10 or more reels per month." — [creators.instagram.com/reach-your-target-audience](https://creators.instagram.com/reach-your-target-audience)
- **2025-08-13 [measured].** Buffer studied 2.1 million feed posts (photos, Reels, carousels) from 102,000 accounts. The data period is not stated. A fixed-effects model compared each account with its own baseline. Weekly follower growth by posts per week:

  | Posts per week | Weekly follower growth | Median reach per post |
  |---|---|---|
  | 1–2 | +0.12% | baseline |
  | 3–5 | +0.26% | about +12% |
  | 6–9 | +0.44% | about +18% |
  | 10+ | +0.66% | about +24% |

  - Weeks with no posts carried a "no-post penalty".
  - Caveats: the data is correlational and comes from Buffer users. There is no breakdown by account size. Quality is called the biggest factor, and the 10+ tier is "treat with caution".

  — [Buffer, 2025-08-13](https://buffer.com/resources/how-often-to-post-on-instagram/)
- **Page updated 2026-10-25 [measured].** Buffer's benchmarks draw on "over 27 million posts from 273,000 active Instagram accounts"; its FAQ says 30 million posts from 250,000 accounts instead. These figures cover all account sizes. The per-tier filters (0–1K and so on) load dynamically and were not readable.
  - Median reach per post in September 2026 was 277.
  - By format in September 2026, from the page's embedded data:

    | Format | Median reach | Median engagement rate |
    |---|---|---|
    | Carousels | 483 | 5.8% |
    | Videos/Reels | 555 | 3.9% |
    | Images | 129 | 3.8% |
    | Stories | 155 | not given |

  - The "average monthly follower growth rate" is a mean that swings widely: 6.8% (July 2026), 8.2% (August), 36.2% (September) and 13.8% (October). Buffer's average posting frequency is 18 posts a month.

  — [Buffer Instagram benchmarks](https://buffer.com/insights/instagram-benchmarks)

**Realistic first-month growth (no rigorous data found)**
- **Updated 2026-09-16 [lore, self-reported and promotional].** A new faceless account with "No legacy followers. No boosted posts" claims "over 15,000 followers" in 30 days. Details:
  - It had about 2,000 followers after week one.
  - It reached 15K on 20 posts, mostly narrated Reels breaking down viral videos with borrowed clips.
  - Five Trial Reels averaged about 2,000 views.
  - It averaged one post every other day.
  - One Reel (614,966 views, 11,634 follows) is called an outlier.
  - The account is run by the publisher's own team, and the author says most people won't reach 15K.

  — [Stan blog](https://stan.store/blog/creator-strategies-case-study/)
- **Results dated 2026-01-31 [lore, single anecdote].** A creator posted daily for 30 days (5 reels and 3 carousels a week, Stories daily, 15 minutes of engagement a day) in a personal-finance niche and ended with "12 followers" on Instagram. One video got "13 views on Instagram" against 600-plus on YouTube. The account's starting state is unclear. — [Niki Tisza](https://www.nikitisza.com/writing/i-spent-30-days-posting-on-instagram-daily-heres-what-actually-happened)
- **Undated [lore, projection].** A course-style 30-day roadmap projects 300–500 followers as a conservative case, 600–800 as average and 1,000–1,500 as best case. These are projections, not results, and came from the WebSearch summary; the page was not opened. — [CreatorFlow roadmap](https://creatorflow.so/blog/30-day-creator-launch-roadmap/)

### Inferences
- **Collabs:** the useful kind for a zero-follower brand is one where a bigger account in a related niche posts and invites strictly.fyi, not the reverse. That fits Mosseri's statement and Emplifi's accepted-collab finding.
- **Cadence:** one original carousel a day is about 30 posts a month. That is above Buffer's 6–9 a week band and above Instagram's 10-reels-a-month observation, so volume is not the constraint. Instagram's growth guidance and Trial Reels are reel-centric. Buffer's all-size data shows carousels' median reach close to video's (483 against 555), and higher engagement (5.8% against 3.9%). Carousels are a reasonable core, and reels can be added later.
- **Follower-only tools:** Stories, channels and Facebook sharing are retention tools. They become worth effort once there are followers.
- **Facebook and the brand rule:** an Instagram account linked to the owner's personal Facebook profile could cross-post to that profile, which would breach the "brand, not owner name" rule. Cross-post to Facebook only through a brand Page, or not at all.
- **Threads:** cross-posting carousels to Threads is a near-free extra surface. Reels can't follow (2024 rule), and multi-hashtag captions get hidden.
- **First month:** the evidence is anecdotes and projections. An honest band for a new faceless account is "tens to a few hundred followers, with rare viral outliers". That is an inference, not a measurement.

### Gaps
- No measured study isolates collab posts' follower gains for small accounts. Emplifi measured brand profiles and undefined "amplification".
- I found no data at all on commenting as a growth tactic.
- Buffer's per-tier benchmarks for 0–1K accounts exist on the page but were not machine-readable, so the median growth for small accounts is unknown.
- The in-app collaborator limit (how many co-authors per post) could not be read, because the Help Center article was not reachable.

---

## 3. Rules and risks: automated access, permitted posting tools and API limits, action blocks, inauthentic growth, Account Status

### Takeaway
- **Scheduling is allowed.** Instagram, unlike the X plan, sanctions scheduling: in-app scheduling, Meta's own tools, and the official Content Publishing API through approved apps such as Buffer and Later. The API allows 100 API-published posts per rolling 24 hours, with a conflicting 50 in one section of the docs.
- **What is forbidden:** unauthorized automation, meaning bots that log in, scrape, or mass-like, follow or comment ("in an automated way without our express permission"), and any buying or selling of engagement, accounts or usernames.
- **Penalties:** pods ("coordinated comment networks") and bought likes make content and accounts non-recommendable.
- **No published limits:** I found no Meta-published numeric caps on follows, likes or comments.
- **Updated Terms:** new Terms take effect 2027-01-20 and add an "Automated Data Collection" clause.

### Cited Findings

**Terms of Use on automation**
- **Current Terms, read 2026-11-01 [primary].** Three clauses apply:
  - "**You can't attempt to create accounts or access or collect information in unauthorized ways.** This includes creating accounts or accessing or collecting information in an automated way without our express permission, regardless of whether such automated access or collection is undertaken while logged-in to an Instagram account."
  - The Terms also forbid "attempts to buy, sell, or transfer any aspect of your account (including your username)".
  - "**You can't do anything to interfere with or impair the intended operation of the Service.**"

  — [Instagram Terms of Use](https://help.instagram.com/581066165581870)
- **Terms effective 2027-01-20, preview read 2026-11-01 [primary].** The same clause now covers creating "profiles" or collecting information "in an automated way (including by engaging in Automated Data Collection as defined in the Automated Data Collection Terms) without our express permission". It adds: "We may restrict or revoke our permission at any time." — [Terms of Use, Preview](https://help.instagram.com/2159268501666222)

**Community Standards and spam**
- **Read 2026-11-01 [primary].** Instagram's old Community Guidelines address now resolves to Meta's Community Standards. That page says: "The Community Standards outline what is and isn't allowed on Facebook, Instagram, Messenger and Threads." The older Instagram-only wording about "artificially collecting likes, followers, or shares" no longer appears at that address. — [Community Standards](https://transparency.meta.com/policies/community-standards/) (reached from [help.instagram.com/477434105621119](https://help.instagram.com/477434105621119))
- **Spam policy, latest dated change-log entry 2024-06-26 [primary].** It prohibits:
  - "Attempting to or successfully selling, buying, or exchanging for engagement, such as likes, shares"
  - "Attempting to or successfully selling, buying, or exchanging platform assets, such as accounts"
  - Activity carried out "either manually or automatically, at very high frequencies"
  - It also cites "posting repetitive content" as a signal that can lead to restrictions.
  - It has no explicit follow-for-follow or pod wording.

  — [Meta Spam policy](https://transparency.meta.com/policies/community-standards/spam/)
- **2018-11-19 [primary; old, may have changed].** "third-party apps that generate inauthentic likes, follows and comments violate our Community Guidelines" and the Terms of Use. Instagram began "removing inauthentic likes, follows and comments from accounts that use third-party apps to boost their popularity", and "accounts that continue to use third-party apps to grow their audience may see their Instagram experience impacted." — [Instagram, Reducing Inauthentic Activity](https://about.instagram.com/blog/announcements/reducing-inauthentic-activity-on-instagram)
- **Undated, read 2026-11-01 [primary].** Two recommendation penalties apply:
  - Accounts that "Repeatedly engaged in misleading practices to build followings, such as purchasing 'likes'" are not recommended.
  - Content tied to "coordinated comment networks intended to artificially drive engagement and distribution" is not recommended either.

  — [Recommendations on Instagram](https://help.instagram.com/313829416281232)
- **System card updated 2025-03-07 [primary].** Suggested Accounts uses "How many follows have you made in the last 28 days" as a signal in its follow-back prediction. This describes ranking. It is not a stated penalty. — [Meta Transparency Center, Suggested Accounts](https://transparency.meta.com/features/explaining-ranking/ig-suggested-accounts/)

**Account Status**
- **Undated, read 2026-11-01 [primary].** Account Status shows "Removed content" and "Features you can't use", and offers "Request a review". "If you repeatedly post content that is removed for going against our Community Standards, you may lose access to your account. **Note**: In most cases, you'll get a warning before losing access to your account." — [Check your Account Status](https://help.instagram.com/338481628002750)
- Professional accounts can also see recommendation eligibility there, including whether "something in your profile (like your profile photo or bio) goes against our Recommendations Guidelines". — [Recommendation eligibility](https://help.instagram.com/653964212890722)

**Posting through the official API**
- **Read 2026-11-01 [primary].** Content Publishing docs:
  - "Instagram accounts are limited to 100 API-published posts within a 24-hour moving period." "Carousels count as a single post."
  - The carousel section separately says "Accounts are limited to 50 published posts within a 24-hour period", which conflicts with the 100.
  - The current usage can be read from `GET /<IG_ID>/content_publishing_limit`.
  - "Carousels are limited to 20 images, videos, or a mix of the two." "JPEG is the only image format supported." "Shopping tags are not supported." "Filters are not supported."
  - Stories and Reels can be published.
  - Instagram Login apps need the `instagram_business_basic` and `instagram_business_content_publish` permissions.

  — [Instagram Platform, Content publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/)
- **Read 2026-11-01 [primary].** "To use the APIs, your app users must have an Instagram professional account". "Instagram API with Instagram Login" "serves Instagram professional accounts without requiring a linked Facebook Page". The Facebook Login version requires a Page and adds hashtag search, product tagging and partnership ads. — [Instagram Platform overview](https://developers.facebook.com/docs/instagram-platform/overview/)
- **2024-07-23 [primary].** The Instagram Login API launched: "A Facebook Page will no longer be required". — [Instagram Platform changelog](https://developers.facebook.com/docs/instagram-platform/changelog/)
- **2026-04-22 and 2026-04-23 [primary and press].** Meta added a "Like Media and Comments API" that requires `instagram_manage_engagement`. Approved apps can now like and unlike posts, Reels and comments on behalf of users. A "Paid partnership" label can be set at publish time. — [Instagram Platform changelog](https://developers.facebook.com/docs/instagram-platform/changelog/); [Social Media Today, 2026-04-23](https://www.socialmediatoday.com/news/meta-expands-instagram-management-apis/818385/)
- **2026-06-22 [primary].** The API added an `is_ai_generated` parameter, to be set "to `true` when creating a media container", for the AI info label. — [Instagram Platform changelog](https://developers.facebook.com/docs/instagram-platform/changelog/)

**Third-party schedulers**
- **Read 2026-11-01 [primary for Buffer's own product].** Buffer offers two professional-account connections:
  - **"Connect to Instagram" (Instagram login):** supports automatic publishing, analytics and comment management on all plans. It lacks locations, collaborators and music on auto-published Reels, and is "Recommended for: Free plan users".
  - **Connection through a linked Facebook Page:** adds those features and needs "Full control" of the Page.
  - Personal accounts get notification publishing only.

  — [Buffer, Connecting your Instagram account](https://support.buffer.com/en-us/articles/connecting-your-instagram-account-to-buffer-n9Ad6veXsu)
  - Contradicted by Buffer's marketing page (read 2026-11-01), which says "Instagram requires a professional account (Business or Creator) linked to a Facebook Page" for auto-publishing. The support article is the more specific and recent source: it refers to an April 2026 Meta login change. — [buffer.com/instagram](https://buffer.com/instagram)
  - The same marketing page caps carousels at "up to 10 images", while Buffer's support article says "up to 20 images and videos combined". — [Buffer support](https://support.buffer.com/articles/scheduling-instagram-posts-reels-stories-and-notifications-3XA98S9Q5p)
  - Per that support article, Stories with music, story text or links, and Reels with topics or product tags, publish only as notifications. The article also says "Trial reels and collaborators can't be combined."
- **Read 2026-11-01 [primary for Later's own product].** Later's auto-publish works for "Instagram business profiles or creator accounts". Its scheduler page says "Use auto publish for single image posts, carousels, Stories, and Reels!" Neither page says whether a Facebook Page is needed. — [Later pricing](https://later.com/pricing/); [Later Instagram scheduler](https://later.com/instagram-scheduler/)

**Action blocks and limits**
- **[Gap, not lore.]** I found no Meta-published numeric caps on follows, likes, comments or DMs. The only official language found is the spam policy's "very high frequencies" and Account Status's "Features you can't use". Numbers circulating online were not collected and should be treated as lore.

### Inferences
- The X "hand-only" rule does not need copying for Instagram's posting step. Scheduling through the in-app scheduler, Meta's tools, or an approved API app (Buffer, Later) is sanctioned. The risk on Instagram is behaviour, not scheduling:
  - mass follow and unfollow
  - auto-likes
  - repetitive or templated comments
  - engagement pods or "engagement groups"
  - bought followers or likes
  - unofficial bots that log in with the password
- Approved apps can now like media through the official API, from April 2026. Using that to automate engagement would still meet the spam policy's "manually or automatically, at very high frequencies" test. The safe course is to keep likes and comments manual and modest.
- A weekly Account Status check fits the existing Sunday sitting. It is the only official view of eligibility and restrictions.
- The 2027 Terms tighten the language on automated data collection. Nothing in strictly.fyi's plan scrapes Instagram, but any future analytics script should use the official Insights API, not scraping.

### Gaps
- The Help Center article on action blocks ("temporarily blocked") could not be opened.
- I found no official statement on follow-for-follow beyond the general spam rules.
- Whether Meta Business Suite works for an Instagram professional account with no Facebook Page could not be verified. Buffer's article lists "Meta Business Suite users" among those advised to connect through a Page, which suggests Meta Business Suite is Page-centred, but that is indirect.

---

## 4. Tools and costs: schedulers and prices, whether a Facebook Page is needed, Meta Verified prices in India and the US and its effect on reach

### Takeaway
- **Scheduling:** a brand-new account can schedule for free in the Instagram app, which was opened to all public accounts on 2026-03-01. Buffer's free plan (3 channels, 10 queued posts per channel) also works with no Facebook Page, through Instagram login. Later starts at $18.75 a month billed yearly and has no free plan.
- **Reach:** Meta Verified does not buy reach. Meta removed "increased reach" from it on 2023-03-17, and India never had it. The current creator tiers ($14.99, $49.99, $149.99, $499.99 a month per profile) sell a badge, support, "search optimization" and, from Plus up, a "featured profile".
- **Meta One:** the new Meta One creator plans (2026-09-15) bundle long-range scheduling into the $49.99 Advanced tier.
- **Brand fit:** Meta Verified for creators verifies a person's ID and is not offered on business profiles, which makes it a poor fit for a brand-only account.

### Cited Findings

**Free and first-party scheduling**
- **2026-03-01 [primary, via press].** Instagram made its creator tools "available to all public accounts". Content scheduling is among them; it previously required switching to Professional Mode. The article gives no scheduling window. — [Social Media Today, 2026-03-01](https://www.socialmediatoday.com/news/instagram-opens-up-content-scheduling-to-all-users/813448/)
- **2026-04-06 [primary, via press].** Instagram was "actively debating whether to let users schedule Stories", which it had avoided to keep Stories spontaneous. — [Social Media Today, 2026-04-06](https://www.socialmediatoday.com/news/instagram-chief-debunks-popular-engagement-hack/816781/)
- **2026-05-18 [primary, via press].** Meta added "a new Content Planner element within its Creator Studio tool on the web" and improved bulk upload for Reels. Access details were not given. — [Social Media Today, 2026-05-18](https://www.socialmediatoday.com/news/meta-adds-new-creator-publishing-tools/820542/)
- **2026-10-07 [primary, title only, translated from the Hindi blog listing].** Instagram's Edits app added a carousel editor. Its price and terms were not checked. — [creators.instagram.com/blog](https://creators.instagram.com/blog)

**Meta One creator plans**
- **2026-09-15 [primary].** The plans, in "$" per profile, with no country given and no India price:

  | Plan | Price per month |
  |---|---|
  | Essential | $14.99 |
  | Advanced | $49.99 |
  | Expert | $149 |
  | Max | $499 |

  - Advanced adds:
    - Scheduling: Stories up to a month ahead, posts and reels up to a year ahead, suggested posting times, and bulk upload on instagram.com
    - Native links in posts and reels
    - Competitive insights and insights history beyond 90 days
    - Shared access for 4 people
    - "Optimized search"
  - The page makes no claim of increased general reach.
  - Verification is needed only for the badge and impersonation protection.
  - Meta is bringing "the best of Meta Verified into Meta One"; existing Meta Verified subscribers see no change yet.

  — [creators.instagram.com, Meta One creator plans](https://creators.instagram.com/blog/meta-one-creator-plans)
- **Conflicting dates [secondary].** Third-party explainers disagree on when Meta One launched: one gives 2026-05-27 for the first consumer rollout, another gives 2026-09-15. The WebSearch summary did not say which source gives which date. Only the creator-plan date is primary. — [Reeldrop](https://www.reeldrop.io/learn/meta-one-subscription-explained); [Digital Gossips](https://digitalgossips.net/celebrity-news/what-meta-one-actually-adds-for-creators-who-already-pay-for-meta-verified/) (both via the WebSearch summary; neither was opened)
- **Undated, read 2026-11-01 [primary].** Instagram Plus is "a new subscription designed to give you more of what you love about Instagram". The page lists no creator, reach, scheduling or analytics features and shows no price. — [Introducing Instagram Plus](https://about.instagram.com/blog/announcements/introducing-instagram-plus)

**Third-party schedulers (prices read 2026-11-01)**
- **Buffer [primary for Buffer].** The Free plan allows up to 3 channels and 10 scheduled posts per channel. Essentials costs $5 a month per channel and Team $10 a month per channel. The page says yearly billing saves "2 months", but its yearly figures of $60 and $120 per channel equal twelve monthly payments, so the discount does not reconcile. First-comment scheduling is on paid plans only. — [Buffer pricing](https://buffer.com/pricing)
  - Facebook Page: not needed for auto-publishing through "Connect to Instagram". It is needed for collaborators, locations and Reels music. — [Buffer support](https://support.buffer.com/en-us/articles/connecting-your-instagram-account-to-buffer-n9Ad6veXsu)
- **Later [primary for Later].** Plans are billed yearly under a "3 months free | 25% off" offer:

  | Plan | Price per month | Social sets (profiles) | Posts per profile per month |
  |---|---|---|---|
  | Starter | $18.75 | 1 (8 profiles) | 30 |
  | Growth | $37.50 | 2 (16 profiles) | 180 |
  | Scale | $82.50 | 6 (48 profiles) | unlimited |

  There is a 14-day free trial and no free plan. — [Later pricing](https://later.com/pricing/)
- **Meta's API itself [primary].** It is free to approved apps. Instagram Login needs no Facebook Page; Facebook Login requires one. — [Instagram Platform overview](https://developers.facebook.com/docs/instagram-platform/overview/)

**Meta Verified: prices, eligibility, reach**
- **Read 2026-11-01 [primary].** Meta Verified for creators tiers, each "per profile per month":

  | Tier | Price | Benefits added at this tier |
  |---|---|---|
  | Standard | $14.99 | Badge, impersonation protection, enhanced support, "Search optimization", images on links, exclusive stickers |
  | Plus | $49.99 | "Featured profile", "Links in Reels (2 per month)" |
  | Premium | $149.99 | Links in Reels (4 per month), custom chat themes |
  | Max | $499.99 | Links in Reels (6 per month), personalized content strategy advice |

  - Only Standard can be bought on the web, at an unpublished discount; Plus, Premium and Max are mobile-only.
  - The page carried a Diwali offer ending 8 November, and the currency was shown only as "$".

  — [meta.com/meta-verified](https://www.meta.com/meta-verified/); [About Meta Verified for creators](https://help.instagram.com/738055111270671)
- **Read 2026-11-01 [primary].** Eligible profiles are an "Instagram professional creator profile" or an "Instagram personal profile"; business information is sent to a separate Meta Verified for businesses help center. Verification works as follows:
  - Subscribers upload "a government-issued photo ID".
  - Alternatively, "If eligible, you may be verified using your activity across Meta products, such as name tenure and profile completeness".
  - When bundling two profiles, "Both profiles may need to have similar names and pictures".
  - "Advanced Protection" must be on and can't be disabled while subscribed.

  — [About Meta Verified for creators](https://help.instagram.com/738055111270671)
- **2023-02-19, updated 2023-03-17 [primary].** Launch prices were "(USD) $11.99 on the web and (USD) $14.99 on iOS and Android". The launch post promised "Increased visibility and reach" with "prominence in some areas of the platform– like search, comments and recommendations". On 2023-03-17 Meta wrote: "We're removing increased reach as a subscription feature for now." Eligibility included "minimum activity requirements, such as prior posting history", an age of at least 18, and an ID that "matches the profile name and photo". — [Meta newsroom, Testing Meta Verified](https://about.fb.com/news/2023/02/testing-meta-verified-to-help-creators/)
- **2023-06-07 [primary, via press].** India launch: "₹699 on iOS and Android", with a ₹599 web option to come. Meta's no-reach-boost approach "continues to be the approach for India." — [TechCrunch, 2023-06-07](https://techcrunch.com/2023/06/07/meta-verified-arrives-in-india-now-honors-legacy-verified-badges)
- **2023-09-19 [primary, via press].** A business test cost "$21.99/month per Facebook page or Instagram account", or "$34.99/per month for both". It included placement "at or near the top of search results" and a feed carousel called "Recommended Meta Verified Businesses". — [TechCrunch, 2023-09-19](https://techcrunch.com/?p=2603127)
- **2024-05-08 [secondary, via the WebSearch summary].** Business tiers were reported as a "$44.99/month 'plus' plan, the $119.99 'premium' plan and $349.99/month 'max' plan". — [Tech Times, 2024-05-08](https://www.techtimes.com/articles/304434/20240508/meta-unveils-3-new-tiers-expand-paid-verification-service-businesses.htm)
- **2024-07-18 [primary, via press].** India business plans "start at Rs 639 per app per month and go up to Rs 21,000 for bundled services with an introductory discount". — [Indian Startup News, 2024-07-18](https://indianstartupnews.com/news/meta-launches-meta-verified-for-businesses-in-india-know-the-key-details-6239166)
- **2025-11-25 [secondary].** Meta Verified "now comes in four tiers". The top tier, which adds "Personalized Content Strategy Advice", was priced at $349 a month, or $499 for both Facebook and Instagram.
  - This conflicts with the current creator page's $499.99 per profile; it may describe business pricing or a since-changed price.

  — [Social Media Today, 2025-11-25](https://www.socialmediatoday.com/news/meta-adds-content-strategy-advice-to-paid-verification-package/806458/)

### Inferences
- **Cheapest workable setup:**
  - Instagram's free in-app scheduler for the daily carousel.
  - Buffer Free through Instagram login as an alternative or a backup.
  - No Facebook Page, and no paid tier at the zero-follower stage.
  - Meta One Advanced ($49.99) only matters if year-ahead scheduling, Story scheduling or bulk desktop upload become worth paying for.
- **Meta Verified:** the documented benefits are a badge, support, protection and search or "featured profile" placement, not feed or recommendation reach. At zero followers the only plausible value is impersonation protection.
- **Brand fit:** the creator product verifies a person by government ID or name tenure and may need matching names. A brand profile named "Strictly FYI" would likely need the business product. Business profiles are not listed as eligible for the creator product, and the business route has India pricing from ₹639 per app per month (2024). This conflicts with the "brand, not owner name" rule unless the business route is used.

### Gaps
- No current India price for Meta Verified for creators or Meta One was found. The newest India figures are ₹699/₹599 (2023, creators) and ₹639 to ₹21,000 (2024, businesses).
- The free in-app scheduling window and format coverage (carousels, Reels, Stories) could not be confirmed from a Meta page. The "75 days" figure in circulation remains lore, and the WebSearch tool's own summary flagged it as unverified.
- Whether Later requires a Facebook Page, and whether Meta Business Suite requires one, were not confirmed.

---

## 5. Account setup: handles with a dot, professional account type and category, bio length, links in bio

### Takeaway
- **Handle:** periods are allowed in Instagram usernames, so `@strictly.fyi` is a valid pattern.
- **Bio and links:** the bio holds 150 characters, and a profile can carry up to 5 links.
- **Account type:** a professional account is either Business (for "brands, organizations") or Creator (for "content producers"). It shows a category label that can be hidden, cannot be private, and makes posts indexable by Google and Bing.
- **Name field:** Search matches on username or profile name, so it is the place for a keyword.

### Cited Findings
- **Index text, read 2026-11-01 [primary].** A help article says "you can add periods, numbers, underscores or abbreviations to help you come up with a username that's not already in use." The search tool cited Help Center results including "Creating an Account & Username" and "Edit Your Profile" without saying which page carries the sentence. — [Creating an Account & Username](https://help.instagram.com/229252147229436); [Edit Your Profile](https://help.instagram.com/936495066470190)
- **Undated, read 2026-11-01 [primary].** "You can write a bio of up to 150 characters on your Instagram profile." — [Add a bio to your Instagram profile](https://help.instagram.com/728994388226960)
- **Undated, read 2026-11-01 [primary].** "You can add up to 5 websites to your Instagram profile." They are added under **Edit profile → Links → Add external link** and can be reordered. — [Add a website to your Instagram profile](https://help.instagram.com/362497417173378/?cms_platform=iphone-app)
- **Undated, read 2026-11-01 [primary].** On professional accounts:
  - "**Business** accounts are best for retailers, local businesses, brands, organizations and service providers. **Creator accounts** are best for public figures, content producers, artists and influencers."
  - "Professional accounts can't be set to private."
  - "Professional accounts show a category directly below the profile image. This category is the same as the category of your linked Facebook page. You can choose to display or hide your category label".
  - "It's recommended to connect your business Facebook Page with Instagram to get the most out of Instagram's business tools."
  - "Your posts and reels may appear in search engine results".
  - Other features include insights, a "Contact" button and spam-follower management.

  — [About professional accounts on Instagram](https://help.instagram.com/138925576505882)
- **Undated, read 2026-11-01 [primary].** For public accounts, "Anyone on Instagram can reuse all or part of your reels, feed videos, and photos" in remix, sequence, templates and stickers, unless reuse is turned off. — [Reuse of media on Instagram](https://help.instagram.com/652943337035777)
- **Undated, read 2026-11-01 [primary].** Account Status can flag "something in your profile (like your profile photo or bio)" that goes against the Recommendations Guidelines. Accounts that "Repeatedly and/or recently shared content we try not to recommend in the account name, username, profile photo, bio or profile" are not recommended. — [Recommendation eligibility](https://help.instagram.com/653964212890722); [Recommendations on Instagram](https://help.instagram.com/313829416281232)
- **System card updated 2026-06-23 [primary].** Account search uses "Similarity between your search words and the account's 'username or profile name'". — [Meta Transparency Center, Instagram Search](https://transparency.meta.com/features/explaining-ranking/ig-search/)
- **Read 2026-11-01 [primary].** Meta Verified for creators is open to "Instagram professional creator profile" and "Instagram personal profile" holders. Business profiles go to Meta Verified for businesses. — [About Meta Verified for creators](https://help.instagram.com/738055111270671)
- **2023-06-15 [primary, via press].** Broadcast channels were opened to "all users that have an active Creator account". — [Social Media Today, 2023-06-15](https://www.socialmediatoday.com/news/instagram-expands-broadcast-channels-all-creators-tests-channel/653164/)
- **Read 2026-11-01, project file [first-party].** SOCIAL.md suggests the handle `@strictly.fyi` (`@strictlyfyi` if taken), the display name `Strictly FYI`, a professional account, `https://www.strictly.fyi` as the link, and a 135-character bio. — `C:/Website/strictly.fyi/SOCIAL.md`

### Inferences
- `@strictly.fyi` should be accepted, since periods are allowed. It also matches the Bluesky handle. The planned 135-character bio fits the 150 limit.
- **Business or Creator:** Meta's own wording puts a publisher brand closer to Business ("brands, organizations"). The Creator type is the one that unlocks Meta Verified for creators and, per 2023 coverage, broadcast channels. Neither type is documented as getting more recommendation reach.
- **Category:** pick a category that reads well for a fact publisher. The label can be hidden if no option fits.
- **Search indexing:** keep it on. Public carousels from a professional account can surface in Google and Bing, which suits strictly.fyi's search-driven model.
- **Links:** up to 5 links means the bio can carry the site plus a few hub pages, so no third-party link-in-bio service is needed. Meta One Essential adds a 20-link page, which is not needed.

### Gaps
- The exact username rules could not be read because the article was unreachable: maximum length, consecutive periods, a period at the start or end, and how often the name and username can be changed. Common claims such as a 30-character maximum, no ending period and no consecutive periods are lore here and should be checked in the app when the account is created.
- The list of professional account categories (for example, whether "Publisher", "Media/news company" or "Education" exist) is in-app only and was not documented in any page read.
- Differences between Business and Creator accounts in Reels music access were not verified in this session.
