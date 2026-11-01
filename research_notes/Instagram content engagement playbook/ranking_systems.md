# How Instagram's ranking and recommendation systems work, and which signals they reward or penalize (state as of 2026-11-01)

Every claim carries one of these labels:
- **[PRIMARY]**: a Meta or Instagram page read directly this session (system card, Instagram blog, Creators blog, Help Center, Meta newsroom).
- **[PRIMARY, relayed by X]**: a statement by Mosseri or Instagram that I read through press coverage. instagram.com and threads.com need a login.
- **[MEASURED]**: third-party data, with its sample size and period.
- **[LORE]**: unverified. This covers vendor and blog claims, creator advice, and second-hand reports of Meta statements that I could not trace to Meta itself or to Social Media Today, The Verge, TechCrunch or Engadget.

Reading conditions that affect the quotes:
1. creators.instagram.com and the Help Center mirror at facebook.com/help/instagram served this machine Hindi-language pages, and the fetch tool translated them. Wording marked "(translated)" is a translation, not Instagram's English text.
2. help.instagram.com rendered empty (it needs JavaScript), and web.archive.org could not be reached.
3. The fetch tool summarises pages. Quoted strings are the tool's quotes. Card prediction lists without quote marks are close paraphrases.
4. Meta says its ranking models and signals "change frequently" (Explore card). The system-card dates below range from Mar 2025 to Jun 2026, so any card may have changed since its stated update.

## Q1. What do Meta's own sources say about the signals for reach to followers vs non-followers (watch time, likes per reach, sends per reach, saves, comments, follows, skips)?

### Takeaway
Instagram has no single algorithm. Each surface has its own system, and Meta publishes a "system card" for each one listing what it predicts.

Followers are reached through Feed and Stories. These predict:
- time spent on the post
- whether you'll swipe through a whole carousel
- whether you'll share it by DM
- skips
- how close you are to the author

Non-followers are reached through Feed Recommendations, Explore and Reels. These predict:
- whether the viewer leaves within 3 seconds
- whether they watch more than 95% of viewers of reels the same length
- "Interested" or "Not interested"
- reshares and shares off Instagram
- follows and comments
- likes and saves, which appear only in Explore
- for suggested Feed posts, "How informative a post is", scored by an LLM

Mosseri's own summary (Jan 22, 2025) is watch time, likes per reach and sends per reach. He said sends are "slightly more important" for non-follower reach. In his Sept 2026 video series he added originality, recency and "breaking content" as values beyond engagement; "breaking content" means testing small creators' posts on non-followers first. No weights are published.

### Cited Findings
**Which system serves whom**
- [PRIMARY, card index; index page dated Dec 31, 2023; list read Nov 1, 2026] Meta publishes 10 Instagram system cards: Feed, Stories, Explore, Reels Chaining, Search, Feed Recommendations, Suggested Accounts, Notifications, Comments and Threads Feed. There is no separate "Reels tab" card. Reels Chaining appears to cover the Reels feed, but the card itself does not name the surfaces it serves. — [Meta: Our approach to explaining ranking](https://transparency.meta.com/features/explaining-ranking/)
- [PRIMARY, Feed card, updated Jun 29, 2026] Feed ranks only content from accounts you follow: "First, the system gathers all potential posts from accounts you follow, such as posts from friends." Suggested posts are a separate system (Feed Recommendations). A lightweight model selects "approximately 700 of the most relevant posts", and the system then scores "about 500 posts". — [Instagram Feed system card](https://transparency.meta.com/features/explaining-ranking/ig-feed/)
- [PRIMARY, Ranking Explained, Adam Mosseri, May 31, 2023] "Most Explore content comes from accounts you don't follow." Instagram says it uses "thousands" of signals and that each surface ranks differently. — [Instagram Ranking Explained](https://about.instagram.com/blog/announcements/instagram-ranking-explained)

**Followers: Feed (card updated Jun 29, 2026)**
- [PRIMARY] Predictions:
  - how likely you are to swipe through the whole carousel
  - enjoy this post
  - skip this post
  - time you'll spend on the author's profile after seeing it
  - share the post with someone in a direct message
  - time you'll spend on the post
  - skip the first post in Feed
  - spend more than 10 seconds on the first post
  - turn the sound on
  - whether the first post keeps you in Feed for the session

  The card lists no follow or save prediction. — [Instagram Feed system card](https://transparency.meta.com/features/explaining-ranking/ig-feed/)
- [PRIMARY] Input signals:
  - positive actions, "such as liking, commenting or resharing"
  - time spent on the post
  - post type (photo, video, carousel)
  - whether the post is recommended
  - whether you visit the author's profile afterwards
  - for shares, whether the post is informative and whether it was created "within 90 days"
  - how many times you tapped the reshare button in the last 28 days

  Source: [Instagram Feed system card](https://transparency.meta.com/features/explaining-ranking/ig-feed/)
- [PRIMARY, May 31, 2023] The five Feed predictions "watched most closely":
  - spend a few seconds on the post
  - comment
  - like
  - share
  - tap the profile photo

  Feed also avoids showing too many posts from one person in a row, or too many suggested posts back to back. — [Instagram Ranking Explained](https://about.instagram.com/blog/announcements/instagram-ranking-explained)

**Followers: Stories (card updated Sep 18, 2025)**
- [PRIMARY] Candidates come only from accounts you follow, excluding ads. Predictions:
  - tap a story at the top of Home
  - reply after viewing
  - send a like
  - tap into the author's profile
  - answer a question, poll or slider
  - save a Reels effect
  - swipe to the next story
  - tap to exit
  - whether you are family or good friends with the author

  Inputs include how often you view the account, past replies, likes and comments, message exchanges and relationship strength (where privacy law allows), mutual friends, and times you dismissed stories. — [Instagram Stories system card](https://transparency.meta.com/features/explaining-ranking/ig-stories/)
- [PRIMARY, relayed by Social Media Today, Apr 6, 2026] In a weekly Stories Q&A, Mosseri said "Feed generally gets more reach than Stories anyway". He said that resharing your own feed post to Stories is "not going to meaningfully change your reach overall". The article reports that Stories are shown only to followers, while feed posts can reach more people through recommendations in Explore. — [SMT: Instagram Chief Debunks Popular Engagement Hack](https://www.socialmediatoday.com/news/instagram-chief-debunks-popular-engagement-hack/816781/)
- [PRIMARY, Instagram Plus page, no date on the page; Jun 4, 2026 per a third-party tracker] Instagram Plus is a paid subscription. It includes "Story Spotlight", described as "Give your story priority for your friends", and "Story Extend" ("Set your story to last 48 hours"). The page does not say how Story Spotlight interacts with Stories ranking. — [Introducing Instagram Plus](https://about.instagram.com/blog/announcements/introducing-instagram-plus); date from [Keywords Everywhere tracker](https://keywordseverywhere.com/news/instagram-algorithm-updates/)

**Non-followers: Feed Recommendations (card updated Jun 29, 2026)**
- [PRIMARY] The system "gathers a portion of the public content available on Instagram", which "may include photos and videos" that meet quality and integrity rules. Predictions:
  - "How informative a post is". Its input is a signal generated by an LLM to assess the post's content quality.
  - "How likely you are to click 'Interested' if the Interested/ Not interested options are presented to you below the Reel"
  - "How long will the user spend in reels after clicking into a reels post in home feed"
  - "How likely will the user scroll through the feed for a certain time, after viewing the top position post"
  - "How likely you are to scroll to the next post"
  - "How likely you are to click on the profile of a post's author"
  - "How likely you are to click to comment on a post"
  - "How likely you are to skip over the first post in feed"
  - "How likely you are to click a reel to view it in full screen"
  - "How likely you are to turn on the audio of a video post"

  The card lists no like, share, follow or watch-completion prediction. — [Instagram Feed Recommendations system card](https://transparency.meta.com/features/explaining-ranking/ig-feed-recommendations/)
- [PRIMARY] Inputs named on the same card:
  - "engagement-to-view ratio"
  - how often others scrolled past the post
  - follower and overall profile clicks by others
  - other people's audio-on actions on the post

  After "Not Interested", the system "will no longer show you posts from that author and will attempt to demote similar content in the future." — [Instagram Feed Recommendations system card](https://transparency.meta.com/features/explaining-ranking/ig-feed-recommendations/)

**Non-followers: Explore (card updated Jun 22, 2026)**
- [PRIMARY] The pipeline:
  1. Retrieval uses "item collaborative filtering, personalized PageRank, and two tower sparse network sourcing", both author-based and media-based, and "up to 1500 media are fetched".
  2. A two-tower early ranker passes "the top 100 media" on.
  3. A late-stage "multi-task multi-label neural network" ranks by "likelihood of user engagement such as like and save."

  Source: [Instagram Explore system card](https://transparency.meta.com/features/explaining-ranking/ig-explore/)
- [PRIMARY] Explore predictions:
  - following the author
  - viewing a post for more than five seconds
  - watching more than 95% of a video
  - clicking "Not Interested"
  - commenting, liking, resharing and saving
  - clicking and engaging with a post
  - clicking a short, squared post to view it full screen

  Inputs include how many people have seen the post, watched past 95% or clicked it. — [Instagram Explore system card](https://transparency.meta.com/features/explaining-ranking/ig-explore/)
- [PRIMARY, May 31, 2023] Explore's most important predictions are likes, saves and shares. Post popularity, including "how quickly people like, comment, share, and save", matters much more in Explore than in Feed or Stories. — [Instagram Ranking Explained](https://about.instagram.com/blog/announcements/instagram-ranking-explained)

**Followers and non-followers: Reels Chaining (card updated Nov 11, 2025)**
- [PRIMARY] Candidates are reels "from people or accounts you follow, or reels that are similar to those you've recently engaged with". A lightweight model selects about 100 of them. Predictions:
  - "How likely you are to use the audio from a reel you're viewing in one you create"
  - "How likely you are to watch less than three seconds of a reel"
  - "How likely you are to click 'Interested' if the Interested/ Not interested options are presented to you below the Reel"
  - "How likely you are to comment on a reel"
  - "How likely you are to watch more of a reel than 95% of users who watched reels of the same length"
  - "How likely you are to click one of the tall, rectangular reels in Explore to view it in full screen in the Reels tab"
  - "How likely you are to reshare a reel"
  - "How likely you are to share a reel off of Instagram"
  - "How likely you are to follow the author of a reel"

  There is no separate like or save prediction. Saves, likes and reshares appear only as inputs to the "Interested" prediction. — [Instagram Reels Chaining system card](https://transparency.meta.com/features/explaining-ranking/ig-reels-chaining/)
- [PRIMARY] Inputs named on the card:
  - for the under-3-second prediction: "skips within two seconds of opening" and sound-on views
  - for the comparative-watch prediction: reel length and viewing time
  - for the follow prediction: followers the author gained through the reel

  Source: [Instagram Reels Chaining system card](https://transparency.meta.com/features/explaining-ranking/ig-reels-chaining/)
- [PRIMARY, May 31, 2023] Reels predictions at that time:
  - reshare
  - watch all the way through
  - like
  - "go to the audio page", a proxy for making your own reel

  Instagram also surveys people on whether a reel is "worth their time or fun". — [Instagram Ranking Explained](https://about.instagram.com/blog/announcements/instagram-ranking-explained)
- [PRIMARY, Creators blog, Feb 26, 2025 (translated)] Instagram first suggests a reel to a small audience of non-followers it expects to enjoy it. Reels that perform well go to a larger audience, and the best of those to a larger one still. Distribution is based on engagement, not follower count. The signals named are watch time, retention, shares, likes and comments. The audience is found by matching people whose interests are similar to the creator's existing viewers. The page says the April 2024 changes are now fully launched. — [Helping creators of all sizes break through](https://creators.instagram.com/blog/helping-creators-of-all-sizes-break-through)
- [PRIMARY, relayed by Engadget, Apr 30, 2024] Eligible Reels are shown first to a small audience "regardless of whether they follow the account that posted it or not", and top performers reach wider audiences. — [Engadget](https://www.engadget.com/instagrams-algorithm-overhaul-will-reward-original-content-and-penalize-aggregators-130018977.html)

**Mosseri's summaries**
- [PRIMARY, relayed by Social Media Today, Jan 22, 2025] "The top three signals that matter most for ranking are watch time, likes and sends." "Likes are slightly more important for connected content, and sends are slightly more important for unconnected content." He told creators to check average watch time, likes per reach and sends per reach in Insights. He did not mention comments, saves or follows. — [SMT: Instagram Shares Algorithm Insights](https://www.socialmediatoday.com/news/instagram-shares-algorithm-insights-2025/738034/)
- [PRIMARY, relayed by Parasocial Magazine (Oct 15, 2026), which is not a press outlet of record] Mosseri posted a four-part ranking video series on Instagram, dated Sep 3 to Sep 24, 2026.
  - Part 2 (Sep 9) caption: "Beyond engagement, we also try to value originality, recency, breaking content" and "we now have larger AI models to do better at ranking overall."
  - Metrics advice: "So of all the people who saw the post, how many of them actually engaged with that post?"
  - Paraphrased in the article: recency carries heavy weight; "breaking content" tests a small public creator's posts on non-followers first.

  Source: [Parasocial Magazine](https://www.parasocialmagazine.com/news/mosseri-names-four-instagram-ranking-principles-for-creators/)
- [LORE: paraphrase without quotes, NetInfluencer, Oct 28, 2026] On the Colin and Samir Show, Mosseri reportedly said:
  - engagement alone does not decide ranking; originality, breakout potential and recency count too
  - sends per reach is the key metric for reaching non-followers, and Instagram is adding it to Insights
  - a brand-new account can now get millions of views on its first post

  Source: [NetInfluencer](https://www.netinfluencer.com/instagram-head-says-video-creator-payments-lose-money-as-platform-tests-long-form-video/)
- [LORE: third-party tracker, not checked against the transcript] On Meta's Q3 2026 earnings call, CFO Susan Li reportedly said Reels ranks sequences of reels and that "nearly 45%" of recommended Reels are under a day old. — [Keywords Everywhere tracker](https://keywordseverywhere.com/news/instagram-algorithm-updates/)

**Viewer-side topic controls**
- [PRIMARY, about.instagram.com; Dec 10, 2025, updated Apr 15, 2026 and Jun 10, 2026] "Your Algorithm" shows "an AI-generated summary of the topics influencing the posts and recommendations you see". Users can say what they want "more or less of, or add new topics entirely". Recommended posts carry a topic label such as "From Running". It launched on Reels in Dec 2025, reached Explore on Apr 15, 2026, and has been "live across all of Instagram, including Feed, Reels, and Explore" since Jun 10, 2026. It is available globally in English. — [Instagram: Your Algorithm](https://about.instagram.com/blog/announcements/reels-algorithm-control)

**Third-party measurement relevant to a new account**
- [MEASURED: Metricool, 24,364,803 posts from 375,118 accounts; Jan to Feb 2025 vs Jan to Feb 2026; press release Jun 16, 2026] Findings:
  - Average Reel watch time more than doubled, to 8.5 seconds.
  - Only 21% of accounts under 10,000 followers grew in 2026.
  - Posts that asked a question got 36.70% more comments, and posts with a comment-focused call to action got 202.78% more.
  - Most views arrive in the first three days after posting (no figure given).

  The release does not describe its methodology. — [Metricool 2026 Instagram study](https://metricool.com/press-release-instagram-study-2026/)
- [MEASURED: Socialinsider, 67,541,436 organic posts from accounts with 1K to 1M followers; 2024 vs 2025; page dated Feb 20, 2026] Audience growth rate fell year on year in every size band. For example, 1K to 5K-follower accounts went from 38.00% to 22.00%, and 100K to 1M accounts from 27.00% to 11.25%. — [Socialinsider Instagram benchmarks](https://www.socialinsider.io/social-media-benchmarks/instagram)

### Inferences
- A new account has almost no followers, so its reach comes from the systems that serve non-followers: Feed Recommendations, Explore and Reels Chaining. The levers those cards name are:
  - not being abandoned in the first 3 seconds
  - out-watching other reels of the same length
  - DM and off-Instagram shares
  - follows earned by the post
  - "Interested" taps
  - likes and saves in Explore
  - informativeness, for suggested Feed posts
- "Informative" appears twice in Meta's 2026 cards: as an LLM-scored prediction in Feed Recommendations, and in the Feed card's share signal ("whether the post is informative"). A fact-led publisher can lean on this more than most niches can. Meta does not say how much weight it carries.
- Mosseri's metrics are rates ("per reach"), not raw counts. A post that 3% of viewers send to a friend is a stronger signal than one with more total sends from a much larger reach.
- Likes do not appear among the Reels Chaining or Feed Recommendations predictions as extracted, but they are among Mosseri's top three and in Explore. Treat likes as a weaker non-follower lever than watch time and sends.
- Stories rank only followed accounts, and Mosseri says Feed out-reaches Stories. Stories are for keeping followers, not for discovery.
- Recency weight (Mosseri, Sep 2026) and the Feed card's "within 90 days" share input both suggest that timely hooks such as anniversaries and news pegs help.

### Gaps
- Meta publishes no weights. The card lists are described as examples, and Meta says they change frequently.
- I could not read Mosseri's own posts. The Sep 2026 series comes only through Parasocial Magazine, and the Oct 2026 interview only as paraphrase.
- A claim that sends count "three to five times" a like appeared only in secondary search summaries, and I could not trace it to a source.
- I did not read the Notifications and Comments system cards.
- I did not verify the Q3 2026 earnings-call figure against Meta's transcript.
- No Meta page says how "Your Algorithm" topics are assigned to a creator's posts.

## Q2. Originality: the 2024-2026 changes favouring original content over reposts and aggregators, watermark penalties, how accounts that repost others' material are treated, the Recommendations Guidelines, and Account Status

### Takeaway
Instagram has demoted reposts in recommendations in two steps. From Apr 30, 2024, for Reels, it shows the original instead of an identical repost, and aggregators lose recommendations. From Apr 30, 2026, the same rules cover photos and carousels: accounts that mainly post others' work are not eligible to be recommended to non-followers in any format, though followers still see them.

Adding a border, a watermark, subtitles or a caption credit does not make a repost original. Adding meaningful value does: new information, context or perspective. Other things also stop an account being recommended:
- repeated breaches of the Recommendations Guidelines
- fake-growth tactics
- repeatedly posting content rated false by fact-checkers
- since Aug 31, 2026, unlabelled profiles built around AI-generated people

Account Status shows whether an account is eligible, and lets you delete content or appeal.

### Cited Findings
**Watermarks and format penalties**
- [PRIMARY, Mosseri, Jun 8, 2021] Reels are not recommended if they are low-resolution, watermarked, muted, bordered, mostly text, or focused on political issues. — [Shedding More Light on How Instagram Works](https://about.instagram.com/blog/announcements/shedding-more-light-on-how-instagram-works)
- [PRIMARY, May 31, 2023] Reels with reduced distribution:
  - low-resolution or watermarked
  - muted or with borders
  - mostly text
  - already posted on Instagram (reposts)

  Instagram said it was testing notifications for reels whose reach may be limited by a watermark. — [Instagram Ranking Explained](https://about.instagram.com/blog/announcements/instagram-ranking-explained)
- [PRIMARY, Creators blog, Aug 30, 2022, updated Apr 25, 2023 (translated; current Hindi version)] Tips to stay recommendable:
  - post your own content that has not been shared on Instagram before
  - avoid watermarked, blurry or low-quality reels and content that looks recycled
  - use high-resolution, borderless 9:16 video with little on-screen text
  - keep videos to 3 minutes or less
  - hook viewers in the first 3 seconds
  - credit other creators with Collabs or enhanced tags

  Source: [What Creators Need To Know About Instagram Recommendations](https://creators.instagram.com/blog/instagram-recommendations-eligibility-tips-creators)

**The 2024 Reels originality change**
- [PRIMARY, relayed by Engadget (Karissa Bell), Apr 30, 2024] The changes, which covered Reels only at the time:
  - When two identical reels are detected, the original is recommended in place of the repost.
  - Reposted reels get a label crediting the original creator.
  - Aggregator accounts that post unoriginal content "10 or more times in the previous 30 days" no longer have their Reels recommended.
  - "Significant" changes such as voice-overs, reaction clips or content "materially edited to become a meme" do not count as reposts.

  Instagram's stated reason: "creators with large followings and aggregators of reposted content have gotten more reach… We think it's important to correct this to give all creators a more equal chance of breaking through to new audiences." — [Engadget](https://www.engadget.com/instagrams-algorithm-overhaul-will-reward-original-content-and-penalize-aggregators-130018977.html)
- [PRIMARY, Creators blog, Feb 26, 2025 (translated)] The April 2024 changes are "now fully launched". — [Helping creators of all sizes break through](https://creators.instagram.com/blog/helping-creators-of-all-sizes-break-through)

**The 2026 extension to photos and carousels**
- [PRIMARY, Creators blog, Apr 30, 2026 (translated)] The safeguards applied to Reels in 2024 now also apply to photo and carousel posts.
  - "Content aggregators" that mainly re-upload others' work in photos and carousels are no longer eligible for suggestions. Accounts that post unoriginal photos or carousels "will no longer be shown in the places where we suggest content".
  - The change does not affect how content from followed accounts is shown, and it is separate from the intellectual-property policy.
  - In the US, 75% of recommendations come from original posts.
  - There is no numeric repost threshold. To become eligible again, most of an account's recent photos, carousels and reels in a 30-day window must be classed as original, and this is tracked continuously.

  Source: [Rewarding original creators on Instagram](https://creators.instagram.com/blog/rewarding-original-creators-on-instagram/)
- [PRIMARY, same page (translated)] What counts as original:
  - your own photos or video, and series, guides or visual stories you made
  - third-party material such as meme templates or popular clips, if it is heavily edited and adds meaningful value: unique text that gives context beyond describing the event, creative graphics that add new information, or Remix

  The test it gives is whether your changes add value beyond repeating or referencing the original, such as new information, context or perspective. It says re-uploading someone's content with only borders, watermarks, subtitles or a caption credit does not qualify. The recommended routes for others' material are Collab, Remix, paid-partnership labels, sharing to Stories, or the in-app Repost feature. — [Rewarding original creators on Instagram](https://creators.instagram.com/blog/rewarding-original-creators-on-instagram/)
- [PRIMARY, Meta newsroom, Aug 6, 2025] Instagram launched in-app Reposts of public reels and feed posts. "Reposts are credited to the original poster." A repost "may be recommended to that person's followers, even if those people don't follow you". — [New Instagram features help you connect](https://about.fb.com/news/2025/08/new-instagram-features-help-you-connect/)
- [PRIMARY, relayed by Parasocial Magazine, Sep 9, 2026] Mosseri listed originality among the values "beyond engagement". The article paraphrases him as saying the system favours the creator who made a piece over accounts that repost it. — [Parasocial Magazine](https://www.parasocialmagazine.com/news/mosseri-names-four-instagram-ranking-principles-for-creators/)

**The Recommendations Guidelines**
- [PRIMARY, Help Center "Recommendations on Instagram" (Hindi rendering, no date on the page; it includes the Aug 2026 AI-profile rule, so it is current)] Content Instagram avoids recommending:
  - **Safety-sensitive content**: self-harm, suicide and eating disorders, including some depictions of death or depression; violence such as people fighting; sexually suggestive content; regulated products (tobacco, alcohol, weapons, drugs, weight-loss products); cosmetic surgery. Some of it is also hidden from teens.
  - **Low-quality or objectionable content**: "unoriginal content taken from other sources with little or no meaningful added value"; long captions unrelated to the content; comment networks that coordinate to inflate likes or shares.
  - **False or misleading content**: content rated false by independent third-party fact-checkers, in countries where that programme runs.

  As extracted, the page does not mention clickbait, contests or giveaways. — [Recommendations on Instagram (Help Center mirror)](https://www.facebook.com/help/instagram/313829416281232)
- [PRIMARY, same page] Accounts Instagram avoids recommending:
  - recent Community Guidelines violations
  - repeatedly or recently sharing non-recommendable content
  - repeatedly using misleading growth tactics such as buying likes
  - being banned from running ads
  - repeatedly and recently posting content rated false or altered by fact-checkers
  - repeatedly and recently featuring realistic AI-generated people without the AI-generated profile label
  - for teens, accounts that regularly post age-inappropriate content

  Source: [Recommendations on Instagram (Help Center mirror)](https://www.facebook.com/help/instagram/313829416281232)
- [PRIMARY, May 31, 2023] The Recommendations Guidelines apply to Explore, Reels, Search, Suggested Posts and Suggested Accounts. Posts that break them stay on Instagram but are not recommended. Accounts that repeatedly break them "may have no posts eligible for recommendation for a period of time". — [Instagram Ranking Explained](https://about.instagram.com/blog/announcements/instagram-ranking-explained)

**AI-generated profiles**
- [PRIMARY, Creators blog, Aug 31, 2026 (translated)] The "AI creator" label is renamed "AI-generated profile". It is for profiles that feature an AI-generated person instead of a real one; creators who only use AI tools in their process do not need it. Unlabelled profiles found ineligible for suggestions may have their reach limited. The creator is notified and can check Account Status, then add the label or appeal. Adding the label does not change reach. — [AI-generated profile label](https://creators.instagram.com/blog/ai-generated-profile-label/)

**Account Status**
- [PRIMARY, Aug 30, 2022 / Apr 25, 2023 (translated)] Professional accounts can see in Account Status (Settings > Account > Account Status) whether their content meets the criteria for recommendation to non-followers. It shows examples of content and profile items that break the guidelines, and lets you edit or delete those posts or request a review. Non-recommendable content "can be distributed to your followers". A whole account can become ineligible "for some time" through repeated breaches, or through a profile photo or bio that breaks the guidelines. — [What Creators Need To Know About Instagram Recommendations](https://creators.instagram.com/blog/instagram-recommendations-eligibility-tips-creators)
- [PRIMARY, May 31, 2023] Account Status is "the best way" to check recommendation eligibility, including eligibility to appear in Search and as a suggested account, and to appeal. On shadowbanning, Instagram says it does not suppress content to sell ads, and that it is not its intention to limit content without a clear explanation. — [Instagram Ranking Explained](https://about.instagram.com/blog/announcements/instagram-ranking-explained)

### Inferences
- A history and facts publisher must be able to show that each post is its own work. A public-domain archival photo with only a caption credit risks being classed as "unoriginal content taken from other sources". The same image with original explanatory text, a timeline or annotations on the slides fits the April 2026 test of "new information, context or perspective". Every carousel slide and reel should carry the publisher's own writing or graphics.
- Under the 30-day rule, the share of posts that are original decides eligibility. One borrowed post is unlikely to cost eligibility, but a run of them could. This reading rests on the translated text.
- Never upload video carrying another app's watermark, never add borders, and avoid muted or mostly-text reels. Each has been on Instagram's reduced-distribution list since 2021 or 2023.
- Check Account Status after the first posts and then weekly. It is the only first-party view of recommendation eligibility.
- Since Aug 2026, a brand that uses an AI-generated presenter or "person" must label the profile. A text-and-card brand like strictly.fyi needs no label.

### Gaps
- I read the Apr 30, 2026 Creators post and the Recommendations Guidelines only in Hindi, translated by the fetch tool. The English wording, including the exact "unoriginal" definition, was not readable from this machine.
- The 2026 rule gives no numeric threshold. The "10 in 30 days" figure was the 2024 Reels rule.
- No Meta page explains how its originality classifiers treat public-domain or archival images, or whether the US "75%" figure is current or a target.
- I did not read TechCrunch's Apr 30, 2026 coverage, which a tracker cites.
- I did not re-verify the Feb 2024 change that stopped proactively recommending political content from accounts people don't follow.

## Q3. Carousels in 2025-2026: re-serving unseen carousels with a later slide, recommendation in the Reels feed or to non-followers, the 20-slide limit, and the January 2025 3:4 profile grid

### Takeaway
Carousels have a ranking model of their own. The Feed card (Jun 2026) predicts whether you will "swipe through the whole carousel". In Oct 2024 Mosseri said that if someone sees a carousel but doesn't swipe, Instagram will often give it a "second chance" by showing the next slide. Photos and carousels are recommended to non-followers through Feed Recommendations and Explore, and the April 2026 originality rule now covers them in recommendations. In 2024 Mosseri said adding music makes a post eligible for "video experiences like the Reels tab". The limit has been 20 slides since Aug 2024, and profile grids have been tall rectangles since the weekend of Jan 17, 2025.

Third-party data agrees that carousels win on engagement and saves. It disagrees on whether they or Reels win on reach, depending on the metric used.

### Cited Findings
**What the systems model**
- [PRIMARY, Feed card, Jun 29, 2026] One Feed prediction is how likely you are to swipe through the whole carousel. Post type (photo, video, carousel) is an input signal. — [Instagram Feed system card](https://transparency.meta.com/features/explaining-ranking/ig-feed/)
- [PRIMARY, relayed by CCStartup (Oct 21, 2024), from a Mosseri Reel at instagram.com/p/DBOeUmTSmIC] Mosseri said: "If someone sees your carousel post but they don't swipe, we'll often give that carousel a second chance..."
  - The second chance shows the next piece of media.
  - Carousels "often get more reach than photos", and more interactions mean "more reach on average".
  - Adding music makes a post eligible for video experiences like the Reels tab.
  - If you can't decide, choosing a carousel over a single photo "will often help you get more reach".

  CCStartup is a small blog, but it quotes and links the Reel. — [CCStartup](https://ccstartup.com/blog/2024/10/21/why-instagram-carousels-sometimes-start-on-the-second-slide/)

**Carousels in recommendations and the Reels tab**
- [PRIMARY, relayed by Social Media Today, Feb 13, 2024, updated Mar 13, 2024] Instagram tested carousel-style posts in the Reels stream. The update says the test was broader: Instagram was recommending several formats, carousels included, within the Reels tab. It was a test, with no rollout date given. — [SMT: Instagram testing carousel posts within the Reels stream](https://www.socialmediatoday.com/news/instagrams-testing-carousel-posts-within-the-reels-stream/707473/)
- [PRIMARY, Feed Recommendations card, Jun 29, 2026; Explore card, Jun 22, 2026] Suggested Feed content "may include photos and videos". Explore predicts clicks on "a short, squared post" to view it full screen. — [Feed Recommendations card](https://transparency.meta.com/features/explaining-ranking/ig-feed-recommendations/); [Explore card](https://transparency.meta.com/features/explaining-ranking/ig-explore/)
- [PRIMARY, Creators blog, Apr 30, 2026 (translated)] The originality rules for suggested content were extended to photos and carousels, which shows that both are recommended to non-followers. — [Rewarding original creators on Instagram](https://creators.instagram.com/blog/rewarding-original-creators-on-instagram/)

**Slide limit and profile grid**
- [PRIMARY, relayed by MacTrast (Aug 2024), citing The Verge (URL dated 2024/8/8)] Instagram raised the carousel limit from 10 to 20 photos and videos, rolling out worldwide. — [MacTrast](https://www.mactrast.com/2024/08/instagram-expands-the-number-of-photos-and-videos-allowed-for-carousel-posts/amp/)
- [PRIMARY, relayed by The Verge (Jay Peters), Jan 17, 2025, read via the Pipedot mirror] In an Instagram Story, Mosseri said profile grids would switch from squares to rectangles over the weekend. His reasons: "most of what's uploaded, both photos and videos, are vertical in their orientation" and "It's a bummer to overly crop them." He called the disruption "transitional" and said more photos and videos would be "visible as intended in the profile". The article does not state the ratio. — [The Verge via Pipedot](https://pipedot.org/6TN8M)
- [LORE: vendor; Planoly, Aug 9, 2024, updated Feb 7, 2025] "As of January 2025, Instagram has confirmed the switch to a vertical 3:4 grid format." About 10% of users had been in the earlier test. — [Planoly](https://www.planoly.com/blog/the-ups-and-downs-of-instagrams-new-rectangle-grid.md)
- [PRIMARY, relayed by Engadget headline, Aug 2024; not read in full] The rectangular grid began as a limited test in August 2024. — [Engadget](https://www.engadget.com/social-media/instagrams-experimental-profile-grid-has-rectangular-images-instead-of-squares-160007086.html)

**Third-party measurement**
- [MEASURED: Buffer, more than 4 million posts sent through Buffer; Jan 2022 to Oct 2024; published Oct 23, 2024; reach is median unique viewers] Reels got 1.36x (36% more) the reach of carousels and 2.25x that of single images. Carousels got 1.12x the engagement of Reels and 2.14x that of single images. Carousels out-reached Reels until mid-2022. — [Buffer](https://buffer.com/resources/instagram-reach-engagement-analysis/)
- [MEASURED: Socialinsider, 67,541,436 organic posts from accounts with 1K to 1M followers; 2024 to 2025, plus Q3 2026; engagement rate = (likes + comments) ÷ followers]
  - Engagement rate in 2025: carousels 0.55%, Reels 0.52%, images 0.37%. In Q3 2026: carousels 0.50%, Reels 0.48%, images 0.35%.
  - Median views per post were higher for carousels than for Reels in every size band; for 1K to 5K-follower accounts, 993 vs 580.
  - Saves per post for 50K to 100K-follower accounts: carousels 35, Reels 22.

  The page has internal inconsistencies: its post counts don't sum, and its period runs into the future. — [Socialinsider](https://www.socialinsider.io/social-media-benchmarks/instagram)
- [MEASURED: Metricool, 24,364,803 posts from 375,118 accounts; Jan to Feb 2025 vs Jan to Feb 2026] Carousels drew 9x the saves of single images. Single images lost 21.96% reach, 25.41% interactions and 45.98% engagement year on year. Reels drew more than 4x the interactions of single images. — [Metricool](https://metricool.com/press-release-instagram-study-2026/)

### Inferences
- Make slide 2 work as a standalone opening. Mosseri says unswiped carousels are often re-shown starting from the next slide, so for some viewers slide 2 is the first thing they see.
- Write the sequence so people swipe to the last slide. Whole-carousel swipe-through is an explicit Feed prediction, and each swipe adds time spent, which several cards use.
- Adding licensed music makes a carousel eligible for the Reels tab, according to Mosseri in 2024. This is a cheap way to reach the surface built for non-followers. The rule may have changed since, and no 2026 Meta page restates it.
- Design covers for a tall rectangular crop. The exact ratio rests on a vendor source, not Instagram.
- The Buffer and Socialinsider results conflict, probably because they measure different things. Buffer counts unique accounts reached. Socialinsider counts "views", which can include repeat displays of the same carousel, such as the second-chance re-serve. Neither source confirms this explanation.

### Gaps
- No Meta page I could read restates, for 2026, when carousels qualify for the Reels tab: whether music is needed, and whether photo-only carousels qualify.
- Thresholds and timing for the second-slide re-serve are unpublished. Search summaries mentioned a re-serve starting at slide 2 or 3 and a "5 to 8 slides" sweet spot, but I could not trace either claim to a source.
- I found no primary Instagram statement of the 3:4 grid ratio, and none on whether old posts are re-cropped.
- I read the Aug 2024 20-slide change only through MacTrast; the Verge original was not fetched.

## Q4. Trial Reels: how they work, who is eligible, and the evidence on their value for new accounts

### Takeaway
Trial Reels launched on Dec 10, 2024. They are shown first only to non-followers and stay hidden from followers and the profile grid until shared. Engagement metrics appear after about 24 hours, and the reel can be shared to followers automatically if it performs well on views in the first 72 hours.

As of Jul 13, 2025, Mosseri gave the eligibility as public accounts with at least 1,000 followers, so a brand-new account cannot use them until it reaches 1,000. There is no first-party or measured evidence on how much they help.

### Cited Findings
- [PRIMARY, Creators blog, Dec 10, 2024 (translated)] How Trial Reels work:
  - They roll out from launch day to eligible creators worldwide over the following weeks.
  - You turn on a "Trial" toggle before sharing. The reel is shown first to non-followers.
  - Followers do not see it in Feed or the Reels tab, and it stays off your profile unless you share it with everyone.
  - After about 24 hours, key metrics (views, likes, comments, shares) appear, with a comparison to your earlier trials.
  - You can share it with followers in one tap, or set it to share automatically if it performs well "based on views within the first 72 hours".
  - Followers may still come across it through a DM, or on pages that group reels by audio, location or filter.

  The page gives no eligibility criteria and no performance data, only a qualitative claim that creators' new ideas are performing well with new audiences and existing followers. — [Trial reels (Creators blog)](https://creators.instagram.com/blog/instagram-trial-reels)
- [PRIMARY, relayed by Social Media Today, Jul 13, 2025] Mosseri confirmed availability to "all creators with at least 1,000 followers and an account set to 'Public.'" The trial option is a toggle in the Reels composer. Instagram shared no usage or reach figures. — [SMT: Instagram expands access to Trial Reels](https://www.socialmediatoday.com/news/instagram-expands-access-trial-reels/752895/)
- [LORE: one guide, not read in full] A professional account needs 200 followers and a personal account 1,000. This conflicts with Mosseri's 1,000-follower statement. — [superprofile.bio guide](https://superprofile.bio/guides/instagram-trial-reels)
- [PRIMARY, Creators blog, Feb 26, 2025 (translated)] Every reel already goes to a small non-follower test audience first and expands if it performs. — [Helping creators of all sizes break through](https://creators.instagram.com/blog/helping-creators-of-all-sizes-break-through)

### Inferences
- Ordinary reels already get a staged non-follower test (Feb 2025). The main gain from a Trial Reel is protection: a weak experiment never reaches followers or the grid, so it cannot drag down follower-facing rates such as likes per reach. It is not a separate route to non-followers.
- For strictly.fyi, Trial Reels become usable only after about 1,000 followers, unless Instagram has lowered the threshold since July 2025. Until then, the staged distribution of ordinary reels is the test.

### Gaps
- I could not read Instagram's Help Center eligibility page; help.instagram.com rendered empty. The threshold may have changed after Jul 13, 2025. A search summary mentioned an "early 2026" expansion that I could not verify.
- I found no first-party or measured data on Trial Reels outcomes, whether reach, follower conversion or later performance, for any account size.

## Q5. Hashtags, captions and keywords for Instagram Search, Google indexing of public posts (from July 2025), and alt text

### Takeaway
From Dec 18, 2025, Instagram is gradually capping hashtags at five per post or reel caption. Mosseri has said hashtags "don't work" to increase reach but help describe a post. Instagram Search matches what you type against usernames, profile names, suggested keywords and hashtags. Instagram's own creator advice is to put keywords and hashtags in the caption, not in the comments, and keywords in your name and bio.

Since Jul 10, 2025, public posts from professional accounts run by adults can appear in Google results by default. In 2025-2026 Google added Search Console reporting for social-platform content. Instagram documents alt text only as an accessibility feature, and nothing ties it to ranking.

### Cited Findings
**Hashtags**
- [PRIMARY, relayed by Social Media Today (from Instagram's @creators), Dec 18, 2025] Instagram "will gradually update the number of hashtags that you can include in a caption for a reel or post to five." Its advice: "using fewer (up to 5) more targeted hashtags, rather than many generic ones". The article says the cap followed about a year of tests in which many users were limited to three. — [SMT: Instagram implements new limits on hashtag use](https://www.socialmediatoday.com/news/instagram-implements-new-limits-on-hashtag-use/808309/)
- [PRIMARY, relayed by Social Media Today, Dec 18, 2025] In Feb 2025, Mosseri said hashtags "don't work" to increase reach. In May 2025 he said they don't improve visibility but are "a great way to let people know what a post is about and connect posts." — [SMT](https://www.socialmediatoday.com/news/instagram-implements-new-limits-on-hashtag-use/808309/)
- [MEASURED: Metricool, 24,364,803 posts from 375,118 accounts; Jan to Feb 2025 vs Jan to Feb 2026] Posts with at least one hashtag had 31.70% fewer views and 33.89% fewer interactions than the platform average. This is a correlation; the study has no controls. — [Metricool](https://metricool.com/press-release-instagram-study-2026/)

**Instagram Search**
- [PRIMARY, Search card, Jun 23, 2026] What Search returns and how it ranks:
  - Results can be "hashtags, places, reels, posts, profiles, audio" related to the query, scored on content type, match to "your query intent", and what you tend to interact with. Then "integrity and deduplication processes are applied to all results".
  - Named signals: word similarity between the query and an account's username or profile name, a suggested keyword, or a hashtag; click-and-act counts for the same query in your country; your profile visits; your social graph and age.
  - Hashtag results are scored on clicks vs views, raw clicks and word similarity.

  The card does not mention captions, bios, alt text or text inside images and video. — [Instagram Search system card](https://transparency.meta.com/features/explaining-ranking/ig-search/)
- [PRIMARY, Creators blog, Aug 30, 2022 / Apr 25, 2023 (translated)] For search: use relevant keywords and hashtags in captions rather than in comments, use a relevant username or profile name, and put keywords in your bio. Keep the account public, because only public accounts are recommended; creator and business accounts are public automatically. — [What Creators Need To Know About Instagram Recommendations](https://creators.instagram.com/blog/instagram-recommendations-eligibility-tips-creators)
- [PRIMARY, Help Center Recommendations Guidelines (Hindi rendering, current)] Long captions unrelated to the content are listed as low-quality content that is not recommended. — [Recommendations on Instagram](https://www.facebook.com/help/instagram/313829416281232)
- [LORE: third-party tracker; Mosseri's original post not found] On Apr 8, 2025, Mosseri reportedly said Instagram's content search is "not very good" and that investment was coming. — [Keywords Everywhere tracker](https://keywordseverywhere.com/news/instagram-algorithm-updates/)

**Google indexing**
- [PRIMARY claim relayed by trade press, PPC Land, Jul 9, 2025; the article cites no Instagram page] From Jul 10, 2025:
  - Search engines can show public photos, videos, carousels and Reels from professional (business and creator) accounts of users over 18. Personal and private accounts are excluded.
  - The setting is "Allow public photos and videos to appear in search engine results" under Settings → Privacy, on by default for eligible accounts. The article's summary also calls it "opt-in", which contradicts this.

  Other coverage says Stories are not indexed, Bing is included, and deleted posts may stay in Google's cache for a while. — [PPC Land](https://ppc.land/instagram-content-becomes-searchable-on-google-starting-july-10/)
- [PRIMARY, Google Search Central blog, titles only; article bodies not readable through the fetch tool] Google's blog archive lists "Introducing social channels in Search Console" (Dec 2025), and two July 2026 posts: "See how content from social and video platforms performs on Google Search" and "Platform properties roll out globally, plus a new social and video performance guide". — [Google Search Central blog](https://developers.google.com/search/blog/2026/07/search-console-social-video-platforms)
- [LORE: third-party tracker] Search Console "platform properties" launched in stages from Jul 7, 2026, and Instagram reporting opened to all accounts on Jul 29, 2026. — [Keywords Everywhere tracker](https://keywordseverywhere.com/news/instagram-algorithm-updates/)
- [LORE: PPC Land's own advice, not Instagram's] The visible caption opening before "See more" "functions as the primary headline for search engines". Alt text and keyword-rich bios add searchable content. — [PPC Land](https://ppc.land/instagram-content-becomes-searchable-on-google-starting-july-10/)

**Alt text**
- [PRIMARY, Help Center "Edit alt text on Instagram posts" (translated)] Alt text describes a photo for people with visual impairments and is read by screen readers. Instagram generates automatic alt text with "recognition technology". You can write custom alt text before posting (Accessibility) or edit it afterwards (Edit → Accessibility). The page says nothing about search, discovery, ranking or search engines. — [Edit alt text (Help Center mirror)](https://www.facebook.com/help/instagram/503708446705527)

### Inferences
- Use three to five specific hashtags as topic labels, not for reach. Expect no reach gain from them; Mosseri says so, and Metricool's correlation points the other way.
- Instagram Search runs mainly on names and handles. The account name and profile name should contain the phrases people actually search, such as "history facts" or "fact check". Put the topic keyword in the first caption line, both for Instagram's caption advice and for Google, which shows the caption as page text. The Google part rests on PPC Land, not Instagram.
- For Google indexing, the account must be a public professional account with the search-engine setting left on. A Google result could then send people to the post, or through the bio link to strictly.fyi. Since Jul 2026, Search Console may be able to report it.
- Write custom alt text for accessibility. Any search benefit is unproven: the Search card does not mention it, and the SEO claim is PPC Land's.

### Gaps
- No Instagram page I could read says whether Search uses captions, bios or alt text. The Search card names only usernames, profile names, keywords and hashtags.
- I could not read Instagram's own Jul 2025 notice or help page on search-engine indexing, so the age limit, Bing coverage and whether Stories are excluded come only from trade press.
- I read only the titles of Google's Jul 2026 Search Console posts, so whether Instagram creators can verify their accounts in Search Console is unconfirmed.
- I found no measured study of how much Google traffic indexed Instagram posts get.

## Q6. Links: link stickers, links in bio, links in captions, and any reach effects

### Takeaway
No Meta source I read says links reduce or increase reach, and links are not listed among the content kept out of recommendations. Since Sep 15, 2026, Meta has sold "links in organic posts and reels" as part of the Meta One Advanced creator/business plan, from $49.99 a month. That implies such links are not otherwise available, though the page doesn't say so outright. Otherwise links live in the bio and in Story link stickers. Stories are shown only to followers, so a link sticker cannot reach new people. The evidence that link-in-bio does not hurt reach is a paraphrased Mosseri remark.

### Cited Findings
- [PRIMARY, Meta newsroom, Sep 15, 2026] Meta One is a subscription across Meta's apps. Its Advanced creator/business plan, starting at $49.99 a month, includes "links in organic posts and reels". Creator and business plans add "a bold follow button on your reels" and automatic follow invitations to people who engage with your content. The Advanced plan also adds "scheduling stories up to 30 days in advance". The post says nothing about links in captions or about whether links affect ranking, reach or distribution. — [Introducing Meta One](https://about.fb.com/news/2026/09/introducing-meta-one-subscription-service-more-features-ai/)
- [LORE: third-party tracker; not in the newsroom post as read] Meta One allows 4, 8 or 12 links a month depending on plan, and a Meta help page reportedly says this does not change ranking. — [Keywords Everywhere tracker](https://keywordseverywhere.com/news/instagram-algorithm-updates/)
- [PRIMARY, relayed by Social Media Today, Apr 6, 2026] Stories are shown to followers, and "Feed generally gets more reach than Stories anyway" (Mosseri). — [SMT](https://www.socialmediatoday.com/news/instagram-chief-debunks-popular-engagement-hack/816781/)
- [PRIMARY, relayed by WERSM; search snippet only, date not confirmed in what I read] Mosseri announced that Instagram removed the 10,000-follower requirement for Story links, so any account can add a link sticker. — [WERSM](https://wersm.com/?p=106528)
- [LORE: weak relay, Lindsey Gamble, dated "Jul 30" with no year] Mosseri "confirmed" in a Reel that "link in bio" doesn't hurt reach. The page paraphrases and embeds the Reel without quoting it. — [Lindsey Gamble](https://www.lindseygamble.com/blog/instagram-head-adam-mosseri-confirms-link-in-bio-doesnt-hurt-reach)
- [PRIMARY, Help Center Recommendations Guidelines (Hindi rendering, current)] As extracted, the lists of non-recommendable content and accounts do not mention links. — [Recommendations on Instagram](https://www.facebook.com/help/instagram/313829416281232)
- [LORE: CreatorFlow, citing Socialinsider; search snippet, not read in full] Stories reach about 2% of followers for large accounts, and link-sticker taps run well below poll interactions. The same source says "a clean industry-published CTR benchmark for Instagram link stickers does not exist." — [CreatorFlow](https://creatorflow.so/blog/instagram-story-link-sticker/)
- [MEASURED: none found] None of the three large studies covers links: Buffer (Oct 2024), Metricool (Jun 2026) and Socialinsider (Feb 2026). — [Buffer](https://buffer.com/resources/instagram-reach-engagement-analysis/); [Metricool](https://metricool.com/press-release-instagram-study-2026/); [Socialinsider](https://www.socialinsider.io/social-media-benchmarks/instagram)

### Inferences
- No ranking rule penalises links, but the cards reward keeping people on Instagram. Feed predicts whether the first post keeps you in Feed for the session; Feed Recommendations predicts time spent in Reels after a tap. A post built to send people away probably scores worse on those predictions than one that pays off on the platform. This is inferred from the prediction lists; Meta has not stated it.
- Practical routing for strictly.fyi: carousels and reels should deliver the fact in full on Instagram, earning sends and saves. The bio link and follower-only Story link stickers carry people to the full entry. The paid caption links are not worth buying for reach, since Meta claims no reach effect.

### Gaps
- I found no Meta statement on whether Story link stickers lower Story reach, and no first-party data on link taps.
- I could not confirm the five-links-in-bio limit or the dates of the link-sticker and multi-link changes from a page read this session.
- The Meta One per-plan link counts and any ranking statement are unverified; the help page was not read.

## Q7. Meta's January 2025 move from third-party fact-checking to Community Notes in the US, and how it applies to Instagram posts

### Takeaway
On Apr 7, 2025, Meta ended third-party fact-checking in the United States across Facebook, Instagram and Threads, and switched to Community Notes, whose testing began on Mar 18, 2025. A note is a label, not a demotion. Meta says a note "won't limit who can see that content or how widely it can be shared", with no penalty for the author.

As of Sep 9, 2026, Community Notes is fully launched only in the US and is being tested in 16 Latin American countries. Third-party fact-checking continues everywhere else. There, content rated false is still kept out of recommendations, and accounts that repeatedly post it are not recommended.

### Cited Findings
- [PRIMARY, Meta newsroom, Mar 13, 2025, updated Apr 7, 2025] How Community Notes works:
  - Testing on Facebook, Instagram and Threads in the US was set to begin on Mar 18, 2025.
  - The Apr 7 update: "Starting today, we're ending our third-party fact checking program in the United States." Meta "will no longer show new fact check labels on content in the United States."
  - Notes start from X's open-source rating algorithm. A note is published only when contributors who usually disagree both find it helpful ("This isn't majority rules").
  - Notes are limited to 500 characters and "will need to include a link to support the note".
  - Unlike fact checks, which often reduced distribution, notes "won't impact who can see the content or how widely it can be shared".
  - Ads cannot receive notes at first. Notes launched in six languages, and global expansion was not immediate, with fact-checking staying in place elsewhere.

  Source: [Meta: Testing begins for Community Notes](https://about.fb.com/news/2025/03/testing-begins-community-notes-facebook-instagram-threads/)
- [PRIMARY, Transparency Center, updated Sep 9, 2026] Current status:
  - "Right now, Community Notes is only fully launched in the United States." Contributors are US-based.
  - Testing is listed in Argentina, Bolivia, Chile, Colombia, Costa Rica, Ecuador, El Salvador, Guatemala, Honduras, Mexico, Nicaragua, Panama, Paraguay, Peru, Uruguay and Venezuela.
  - It runs in six languages: English, Spanish, Chinese, Vietnamese, French and Portuguese.
  - On fact-checking outside the US: "There are no changes to other countries at this time."

  Source: [Meta Transparency Center: Community Notes](https://transparency.meta.com/features/community-notes/)
- [PRIMARY, same page] How notes behave:
  - A note "won't limit who can see that content or how widely it can be shared", and carries no penalty for the author.
  - Authors are notified when a note is published. They cannot remove it but can request another review.
  - Meta notifies some people who engaged with the post, including those who reposted it, commented on it or requested a note.
  - Anyone can request a note from a post's three-dot menu.
  - Contributors need 10 ratings before their ratings count. A note can appear and disappear for two weeks before its status locks.
  - Contributors can be asked whether a note should also appear on identical or nearly identical posts.
  - Notes cover "most organic public Facebook, Instagram or Threads content".

  The page does not say whether a post with a note can still be recommended. — [Meta Transparency Center: Community Notes](https://transparency.meta.com/features/community-notes/)
- [PRIMARY, Help Center Recommendations Guidelines (Hindi rendering, current)] Content rated false by independent third-party fact-checkers is not recommended "in countries where Meta runs that program". Accounts that repeatedly and recently post content rated false or altered are not recommended. — [Recommendations on Instagram](https://www.facebook.com/help/instagram/313829416281232)
- [PRIMARY, Mosseri, Jun 8, 2021; the fact-checking regime that still applies outside the US] Posts labelled as misinformation by third-party fact-checkers are labelled and shown lower in Feed and Stories. Repeated misinformation can make all of an account's content harder to find. — [Shedding More Light on How Instagram Works](https://about.instagram.com/blog/announcements/shedding-more-light-on-how-instagram-works)

### Inferences
- In the US, a Community Note on an Instagram post is a reputational cost, not a distribution penalty. Everyone who engaged may be notified, which matters for a brand selling accuracy. Outside the US, a false rating from fact-checkers still removes the post from recommendations and, if repeated, the whole account.
- strictly.fyi is run from India and posts to a global audience, so both regimes are relevant. The site's fact-checking discipline, with a correction log and sources for every claim, protects recommendation eligibility directly in fact-checked markets.

### Gaps
- I did not fetch Meta's Jan 7, 2025 announcement ("More Speech and Fewer Mistakes"), so its exact wording is not quoted here. The dates above come from the Mar and Apr 2025 newsroom update and the Sep 2026 Transparency page.
- No Meta page says how many Instagram posts carry notes, or whether a noted post's recommendation eligibility is affected. The pages say only that a note does not limit distribution.
- No page says which country's regime applies to a post viewed in several countries, for example an Indian account's post seen by US viewers.
