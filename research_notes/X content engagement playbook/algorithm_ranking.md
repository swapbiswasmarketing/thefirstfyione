# How X's For You ranking works and which signals it rewards or penalizes (state as of 2026-11-01)

Labels used on every claim: **[PRIMARY: code]** = X/xAI published code or README; **[PRIMARY: statement]** = official X statement (Musk, Nikita Bier, Help Center), with the outlet that relayed it when x.com itself could not be read; **[MEASURED]** = third-party data, with sample size and period; **[LORE]** = unverified or vendor claim, or a press observation X has not confirmed. Unless another commit is named, xai-org/x-algorithm code citations refer to HEAD commit `9106e9f` (2026-10-31). Its `param.rs` header reads "mirrored from config feature-switch defaults; last sync 2026-10-30T22:59:56Z". The repo syncs almost daily, and the weights changed five times between Aug 13 and Oct 14, 2026, so any number below may have changed after Oct 31, 2026.

## Q1. What did the 2023 open-sourced algorithm weight (heavy ranker engagement weights), and how were out-of-network candidates sourced (SimClusters, TwHIN, RealGraph, TweepCred)?

### Takeaway
The 2023 heavy ranker scored each candidate as a weighted sum of predicted engagement probabilities. "Reply that the author then engages with" (75) and "reply" (13.5) far outweighed "like" (0.5). Negative feedback ("show less", block or mute: -74) and reports (-369) carried large negative weights. About half of candidates came from the in-network Earlybird search index. Out-of-network candidates came from graph and embedding systems: UTEG/GraphJet, SimClusters (~145k communities), TwHIN, and follow recommendations. RealGraph scored user-to-user interaction likelihood, and TweepCred scored PageRank reputation. The 2023 code also gave blue-verified authors a 4x in-network and 2x out-of-network multiplier. X has since replaced this stack (see Q2), so it is historical context, not current behaviour.

### Cited Findings
- [PRIMARY: code, weights dated April 5, 2023] The heavy ranker is a parallel MaskNet that outputs a probability per engagement type. Final score = Σ (weight × probability). Weights "as of April 5, 2023":
  - fav 0.5; retweet 1.0; reply 13.5
  - good_profile_click 12.0 (opens the author's profile and likes or replies to a post)
  - video_playback50 0.005 (watches at least half of a video)
  - reply_engaged_by_author 75.0
  - good_click 11.0 (clicks into the conversation and replies or likes)
  - good_click_v2 10.0 (clicks into the conversation and stays at least 2 minutes)
  - negative_feedback_v2 -74.0 ("show less often" on the post or author, block, or mute)
  - report -369.0

  Source: [the-algorithm-ml heavy ranker README](https://github.com/twitter/the-algorithm-ml/blob/main/projects/home/recap/README.md)
- [PRIMARY: code, 2023] The same README says the weights "were originally set so that, on average, each weighted engagement probability contributes a near-equal amount to the score. Since then, we have periodically adjusted the weights to optimize for platform metrics." It also warns of "small differences from the production model." — [heavy ranker README](https://github.com/twitter/the-algorithm-ml/blob/main/projects/home/recap/README.md)
- [PRIMARY: code, Mar 31, 2023] The repo's component table:
  - Candidate sources: search-index (Earlybird) "Find and rank In-Network posts. ~50% of posts come from this candidate source"; tweet-mixer ("coordination layer for fetching Out-of-Network tweet candidates"); user-tweet-entity-graph (UTEG, an in-memory GraphJet user-to-post interaction graph traversed to find candidates); follow-recommendation-service (FRS: accounts to follow, and posts from them).
  - Models: SimClusters ("community detection and sparse embeddings into those communities"); TwHIN ("dense knowledge graph embeddings for Users and Posts"); real-graph (likelihood of one user interacting with another); tweepcred (PageRank user reputation); trust-and-safety-models (NSFW and abusive content).
  - visibility-filters: "hard-filtering, visible product treatments, and coarse-grained downranking."

  Source: [twitter/the-algorithm README](https://github.com/twitter/the-algorithm/blob/main/README.md)
- [PRIMARY: code] SimClusters: "In production, the Known For dataset covers the top 20M producers and k ~= 145000" communities. — [SimClusters README](https://github.com/twitter/the-algorithm/blob/main/src/scala/com/twitter/simclusters_v2/README.md)
- [PRIMARY: code] Real Graph uses "a gradient boosting tree classifier to predict the likelihood of a Twitter user interacting with another user." — [RealGraph README](https://github.com/twitter/the-algorithm/blob/main/src/scala/com/twitter/interaction_graph/README.md)
- [PRIMARY: code] The Earlybird light ranker is a logistic regression with two models: in-network (`recap_earlybird`) and out-of-network UTEG (`rectweet_earlybird`). It is described as an "old part of the stack which we are currently in the process of replacing." — [light ranker README](https://github.com/twitter/the-algorithm/blob/main/src/python/twitter/deepbird/projects/timelines/scripts/models/earlybird/README.md)
- [PRIMARY: code] TweepCred is PageRank over user interactions, mapped from log(PageRank) to a 0-100 scale (max maps to 95, min to 15). For accounts following more than 2,500 accounts, PageRank mass is divided by exp(3.0 × (ratio − 0.6) × ln(ln(followings))), where ratio = (1+followings)/(1+followers), capped at a 50x divisor. The code comment: "reduce pagerank of users with low followers but high followings." — [Reputation.scala](https://github.com/twitter/the-algorithm/blob/main/src/scala/com/twitter/graph/batch/job/tweepcred/Reputation.scala); [TweepCred README](https://github.com/twitter/the-algorithm/blob/main/src/scala/com/twitter/graph/batch/job/tweepcred/README)
- [PRIMARY: code, 2023 defaults] Earlybird ranking params (used for search relevance and in-network light ranking):
  - Language demotions: langEnglishUIBoost 0.3; langEnglishTweetBoost 0.7; langDefaultBoost 0.1; unknownLanguageBoost 0.01, described as "Boost (demotion) if the tweet language is not one of user's understandable languages, nor interface language."
  - outOfNetworkReplyPenalty 10.0, subtractive.
  - Multiplicative knobs that default to 1, a no-op unless production overrides them: offensiveBoost; multipleHashtagsOrTrendsBoost ("multiplicative score dampen for results with more than one hash tag"); tweetFromBlueVerifiedAccountBoost; image, video and news URL boosts.
  - A facet-level multipleHashtagsOrTrendsPenalty, "penalty for keyword stuffing."

  Source: [ranking.thrift](https://github.com/twitter/the-algorithm/blob/main/src/thrift/com/twitter/search/common/ranking/ranking.thrift)
- [PRIMARY: code, Mar 31, 2023] home-mixer `BlueVerifiedAuthorInNetworkMultiplierParam` default 4.0 and `BlueVerifiedAuthorOutOfNetworkMultiplierParam` default 2.0. — [HomeGlobalParams.scala @ 2023-03-31](https://github.com/twitter/the-algorithm/blob/ef4c5eb65e6e04fac4f0e1fa8bbeff56b75c1f98/home-mixer/server/src/main/scala/com/twitter/home_mixer/param/HomeGlobalParams.scala)
- [PRIMARY: code, Jul 7, 2023] The multipliers moved into ScoredTweetsParam: BlueVerified in-network 4.0 and out-of-network 2.0; CreatorInNetworkMultiplier 1.1; CreatorOutOfNetworkMultiplier 1.3; OutOfNetworkScaleFactor 1.0. — [ScoredTweetsParam.scala @ 2023-07-07](https://github.com/twitter/the-algorithm/blob/72eda9a24f815f6d566818cbf8518138e29d83e9/home-mixer/server/src/main/scala/com/twitter/home_mixer/product/scored_tweets/param/ScoredTweetsParam.scala)
- [PRIMARY: code, Sep 3, 2025] X pushed a late update to the legacy repo (commit "update for-you recommendations code"). In this version:
  - the blue-verified multipliers are gone
  - Creator in-network and out-of-network multipliers are 1.0
  - OutOfNetworkScaleFactor is 0.75 and ReplyScaleFactor is 0.75
  - AuthorDiversityDecayFactor is 0.5, both in-network and out-of-network
  - new ControlAiShowLessScaleFactor 0.05 and ControlAiShowMoreScaleFactor 20.0

  Sources: [ScoredTweetsParam.scala @ 2025-09-03](https://github.com/twitter/the-algorithm/blob/c54bec0d4e029fe34926ef3258a86ccacc0d0182/home-mixer/server/src/main/scala/com/twitter/home_mixer/product/scored_tweets/param/ScoredTweetsParam.scala); [commit c54bec0](https://github.com/twitter/the-algorithm/commit/c54bec0d4e029fe34926ef3258a86ccacc0d0182)

### Inferences
- In 2023 the dominant lever was conversation. A reply the author engaged with carried 150x the weight of a like (75 vs 0.5), and a reply 27x. Weights multiply predicted probabilities, not counts (X stresses this for the 2026 code; see Q5), so these ratios do not mean "1 reply = 27 likes."
- The 2023 blue-verified multipliers were the clearest documented paid-reach advantage in any version of the code. They no longer appear in the September 2025 legacy update, and the 2026 code has no equivalent (Q4).
- The ControlAi "show less/show more" factors (0.05 and 20) in the September 2025 legacy code probably implement user-driven feed controls (users telling Grok to show more or less of something). This rests on the parameter names alone.
- TweepCred's follow-ratio penalty applies only above 2,500 followings. A new publisher that follows few accounts is unaffected.

### Gaps
- I could not re-fetch the March 31, 2023 engineering blog post (blog.x.com returned HTTP 403 to automated fetches and the Internet Archive was not reachable). Its commonly cited figures are therefore not re-verified here: ~1,500 candidates per request out of ~500M daily posts, a ~48M-parameter heavy ranker, and the list of post-ranking heuristics (author diversity, content balance, feedback-based fatigue, social proof).
- The 2023 open code has only defaults (mostly 1.0) for the Earlybird boosts covering offensive content, multiple hashtags and blue-verified accounts, not production values. Third-party claims of specific hashtag or offensive-content penalty values are unverified.
- I found no "all caps" feature or penalty in the 2023 ranking thrift or in the 2026 xai-org code I reviewed.

## Q2. What changed in 2025-2026: Grok/AI ranking, the newly open-sourced xai-org code, what it predicts and weights, treatment of new or small accounts, and For You vs Following

### Takeaway
Between October 2025 and January 2026, X replaced the legacy stack with an xAI-built system. Thunder supplies in-network posts. Out-of-network posts come from Phoenix retrieval (a two-tower model whose transformer derives from Grok-1), SimClusters, and a popular-posts list. Phoenix ranking predicts about 25 viewer actions, and a weighted sum combines them. The code is public at xai-org/x-algorithm: the repo was created Jan 19, 2026, production-default weights were added Aug 13, 2026, and it has been synced near-daily since.

As of Oct 30, 2026, the heaviest positive weights per unit of probability are:
- share via copy link: 20
- reply: 5, rising to 20 on original posts from authors the viewer mutually follows
- quote: 5
- share via DM: 5
- follow author: 4

Likes carry 0.66 and reposts 1.0. Other adjustments:
- Out-of-network posts are multiplied by 0.75.
- An author's repeated posts in one feed decay toward a 0.25x floor.
- One cold-start slot near position 16 is reserved for fresh, low-view posts from accounts with up to 50,000 followers.

The Following tab has been Grok-ranked since late November 2025. A Recent/Popular toggle exists, and its availability has varied by platform and subscription.

### Cited Findings
**Timeline (statements and releases)**
- [PRIMARY: statement, Oct 17, 2025, relayed by press] Musk: X was aiming for "deletion of all heuristics within 4 to 6 weeks," and Grok would "literally read every post and watch every video (100M+ per day)" to match users with content. — [TBPN Digest, Oct 17, 2025](https://tbpn-digest.vercel.app/story/2025-10-17/x-overhauls-recommendation-algorithm-grok-to-read-every-post-and-replace-all-heuristics-within-weeks); [The Hans India](https://assets.thehansindia.com/tech/elon-musk-says-x-to-scrap-heuristic-how-grok-ai-will-screen-100m-posts-and-videos-to-personalise-feeds-1015828)
- [PRIMARY: statement, ~Oct 19-20, 2025, relayed by press] Musk said that "xAI is building the X algorithm," and that this, not Bier, will dictate post reach. — [Social Media Today, Oct 19, 2025](https://www.socialmediatoday.com/news/x-formerly-twitter-testing-links-in-app-link-post-penalties/803176/)
- [PRIMARY: statement, Nov 27-28, 2025, relayed by press] Musk said Grok now ranks posts in the Following feed, which had been chronological, and that chronological viewing remains available. Reports said the rollout started with US iPhone users. — [Social Samosa](https://www.socialsamosa.com/news-2/x-chronological-following-grok-ai-algorithm-10827353); [Editorialge](https://editorialge.com/elon-musk-x-grok-smart-following-feed-launch/)
- [PRIMARY: statement, Jan 10, 2026, relayed by press] Musk said X would open-source "the new 𝕏 algorithm, including all code used to determine what organic and advertising posts are recommended" within 7 days, and repeat the release every four weeks with developer notes. — [Engadget](https://www.engadget.com/big-tech/elon-musk-says-xs-new-algorithm-will-be-made-open-source-next-week-225721656.html); [TechCrunch, Jan 20, 2026](https://techcrunch.com/2026/01/20/x-open-sources-its-algorithm-while-facing-a-transparency-fine-and-grok-controversies)
- [PRIMARY: code, Jan 20, 2026] The initial README:
  - For You is ranked "using a Grok-based transformer model," and the transformer is "ported from the Grok-1 open source release."
  - "We have eliminated every single hand-engineered feature and most heuristics from the system."
  - Predicted actions: P(favorite), P(reply), P(repost), P(quote), P(click), P(profile_click), P(video_view), P(photo_expand), P(share), P(dwell), P(follow_author), P(not_interested), P(block_author), P(mute_author), P(report).
  - It describes an "Author Diversity Scorer" and an "OON Scorer." It did not publish weights.

  Sources: [README @ aaa167b, Jan 20, 2026](https://github.com/xai-org/x-algorithm/blob/aaa167b3de8a674587c53545a43c90eaad360010/README.md); repo created 2026-01-19T23:12Z per the GitHub API — [xai-org/x-algorithm](https://github.com/xai-org/x-algorithm)
- [PRIMARY: code, commit history] Release cadence: Jan 20, 2026; two commits on May 15, 2026; then near-daily commits from Aug 13, 2026 (61 commits in total through Oct 31, 2026). The "every four weeks" promise was not kept between February and August 2026. — [commit history](https://github.com/xai-org/x-algorithm/commits/main)
- [PRIMARY: code, May 15, 2026] This update added:
  - an end-to-end retrieval→ranking inference pipeline
  - a pre-trained mini Phoenix model (256-dim embeddings, 4 heads, 2 layers, ~3 GB)
  - the Grox content-understanding service (spam detection, post-category classification, "PTOS policy enforcement")
  - an ads-blending module
  - new context hydrators: followed topics, starter packs, IP, mutual-follow graphs, served history

  Source: [README @ 0bfc279, May 15, 2026](https://github.com/xai-org/x-algorithm/blob/0bfc2795d308f90032544322747caacd535f75ae/README.md)
- [PRIMARY: code, Aug 13-14, 2026] This release added:
  - "key configuration parameters (including weights used to blend predicted action values into a score for a post)"
  - visibility filtering
  - the labeling systems: botmaker, scarecrow, agatha, bdsm, user-cred-v2, and the media models
  - Phoenix training code
  - SimClusters as an additional out-of-network source
  - the "Under the Hood" tool, which shows the visibility-limiting labels applied to an account and its posts

  Source: [README (Notable Updates)](https://github.com/xai-org/x-algorithm/blob/main/README.md)
- [PRIMARY: code, Sep 18 to Oct 26, 2026] Later notable updates:
  - Sep 18: Under the Hood now shows legally compelled withholding by country.
  - Oct 8: ranking "predicts time spent much better."
  - Oct 13: Phoenix retrieval is "now also trained to surface posts that people read all the way through."
  - Oct 26: `Brazil2026ElectionFilter` was removed. Since Aug 14 it had dropped posts from accounts reported to Brazil's Electoral Court unless the viewer followed them.

  Source: [README](https://github.com/xai-org/x-algorithm/blob/main/README.md)
- [LORE: press-reported] Coverage says Under the Hood is a pilot. Eligible accounts with at least 10 posts in the past month can download a JSON summary of labels. — [TechRound](https://techround.co.uk/business/x-just-open-sourced-its-algorithm-and-added-a-shadowban-checker-real-transparency-or-pr-theatre/); [Tony Reviews Things](https://www.tonyreviewsthings.com/x-open-sources-ranking-algorithm/)

**Current pipeline (code as of Oct 31, 2026)**
- [PRIMARY: code] The request path runs in this order:
  1. Query hydration: the user action sequence ("the main input to the model"), following list, blocks and mutes, muted keywords, already-seen and served posts, followed topics.
  2. Candidate sources in parallel: Thunder (recent posts from followed accounts, held in memory); Phoenix retrieval (embeds viewer and posts and returns the nearest posts); SimClusters; `popular_posts_source` ("a shared list of popular recent posts, initially from the most-followed active accounts").
  3. Candidate hydration.
  4. Pre-scoring filters, including AgeFilter (drops posts "older than 48 hours").
  5. PhoenixScorer, then RankingScorer ("weighted sum, then repeated-author decay, an out-of-network discount, a new-author boost"), then VMRanker reranking.
  6. Top-K selection.
  7. Visibility filtering after selection.
  8. Blending with ads, Who to Follow and prompts.

  Source: [README](https://github.com/xai-org/x-algorithm/blob/main/README.md)
- [PRIMARY: code] Candidate caps: Phoenix 1,000; Thunder 1,200; popular posts 500; Phoenix cold-start 200. The legacy tweet-mixer source is disabled. The scoring and retrieval sequence length is up to 1,024 user actions. The Phoenix aggregation type is "DENSE_WITH_LONG_DWELL." Hydrated viewer context includes inferred gender, installed apps and IP/geo features, all enabled by default. — [param.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/params/param.rs)
- [PRIMARY: code] What Phoenix predicts:
  - Engagement: favorite, reply, repost, quote, share, share via DM, share via copy link
  - Clicks: post, profile, link, photo expand, video open, quoted post
  - Attention: video quality view, dwell, dwell time, click dwell time, video continuation seconds, profile visit seconds
  - Author: follow author
  - Negative: not interested, mute author, block author, report, not dwelled

  Source: [README](https://github.com/xai-org/x-algorithm/blob/main/README.md)
- [PRIMARY: code, synced Oct 30, 2026] Current weights:

  | Signal | Weight |
  |---|---|
  | favorite | 0.66 |
  | reply | 5.0 (+15.0 bidirectional-follow boost) |
  | retweet (repost) | 1.0 |
  | quote | 5.0 |
  | share | 2.0 |
  | share_via_dm | 5.0 |
  | share_via_copy_link | 20.0 |
  | follow_author | 4.0 |
  | click | 0.3 |
  | open_link | 0.2 |
  | photo_expand | 0.05 |
  | video_open | 0.02 |
  | quoted_click | 0.05 |
  | dwell | 0.05 |
  | cont_dwell_time | 0.006 |
  | cont_click_dwell_time | 0.4 |
  | post_unexplored | 0.015 |
  | profile_click | 0.0 |
  | vqv (video quality view) | 0.0 |
  | quoted_vqv | 0.0 |
  | post_video | 0.0 |
  | not_interested | -52.272 |
  | block_author | -31.2 |
  | mute_author | -58.8 |
  | report | -234.0 |
  | not_dwelled | -0.02 |

  The file's comment says the weights "reflect a combination of how much an action is valued in ranking and typical propensities of these actions across the X network." — [param.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/params/param.rs)
- [PRIMARY: code] Weight changes, traced through param.rs commits:
  - Aug 13, 2026 (first published values): favorite 0.5, click 0.4, vqv 0.05, dwell 0.0, cont_dwell_time 0.004, cont_click_dwell_time 0.0, not_interested -43.2; all other weights as today.
  - Aug 25: vqv 0.05→0.0; dwell 0.0→0.05.
  - Sep 29: click 0.4→0.3; cont_click_dwell_time 0→0.4; not_interested -43.2→-47.52.
  - Oct 13: favorite 0.5→0.6; cont_dwell_time 0.004→0.006.
  - Oct 14: favorite 0.6→0.66; not_interested -47.52→-52.272.

  Sources: [param.rs history](https://github.com/xai-org/x-algorithm/commits/main/home-mixer/params/param.rs); commits [47c1bcd](https://github.com/xai-org/x-algorithm/commit/47c1bcdadfe4911568fd6db4f8838b194325beab), [0d3cdd8](https://github.com/xai-org/x-algorithm/commit/0d3cdd806c405f04db7030f720b48687aa304061), [a707cc2](https://github.com/xai-org/x-algorithm/commit/a707cc27ba36d3fa79450c9cffcc48a82d080b02), [e1a0375](https://github.com/xai-org/x-algorithm/commit/e1a0375a903899984545c663bb0bccb3cdcdf046), [17c96bf](https://github.com/xai-org/x-algorithm/commit/17c96bf346df3d62b90f1bb01830d432dba74485)
- [PRIMARY: code] The mutual-follow ("bidirectional") boost is additive. It applies only when the candidate is an original post (not a reply or repost) whose author the viewer follows and who follows the viewer back. In that case the reply weight becomes 5.0 + 15.0 = 20.0. A parallel dwell boost exists but is set to 0.0. — [weights.rs](https://github.com/xai-org/x-algorithm/blob/main/xai-value-model/weights.rs); [inputs.rs](https://github.com/xai-org/x-algorithm/blob/main/xai-value-model/inputs.rs); [param.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/params/param.rs)
- [PRIMARY: code, dated history] Bidirectional boost rollout:
  - Jul 10, 2026: A/B test with boost values 5, 10, 15 and 20 (most users at 0).
  - Jul 13: rolled out at 20 to "many users."
  - Jul 24: set to 15, after experiment results and feedback "that the World Cup was happening yet some people weren't seeing as much discussion of it as they wanted, given many of the posts were from accounts they didn't follow."
  - A dwell-weight boost was tested in the same A/B test but "not shipped more broadly."

  Source: [docs/BIDIRECTIONAL_BOOST_CHANGE.md](https://github.com/xai-org/x-algorithm/blob/main/docs/BIDIRECTIONAL_BOOST_CHANGE.md)
- [PRIMARY: statement, Jul 13-15, 2026, relayed by press] Bier announced a ranking tweak that boosts mutuals, calling reply sections a "battleground." He said the change should make posts more visible to mutuals and help interest clusters form, and claimed users were sending "double our average of original posts and replies." That last figure is a company claim with no independent verification. — [Social Media Today](https://socialmediatoday.com/news/x-formerly-twitter-updates-code-to-give-priority-to-posts-from-mutual-followers/825136); [9to5Mac, Jul 14, 2026](https://9to5mac.com/2026/07/14/your-x-feed-might-now-work-as-platform-finally-does-what-everyone-wanted/); [Engadget](https://engadget.com/2214455/x-will-prioritize-replies-from-people-you-follow); [Gigazine, Jul 15, 2026](https://wbgsv0a.gigazine.net/gsc_news/en/20260715-x-boost-mutuals-reply)
- [PRIMARY: code] Out-of-network discount: `OonWeightFactor` is 0.75. Because `EnableOonRescoreForInNetworkRepliesRetweets` is true, the 0.75 factor also applies to replies and reposts from accounts the viewer follows. Topic requests use 0.5. A `NewUserOonWeightFactor` of 0.00001 exists but is inactive, because `NewUserAgeThresholdSecs` is 0. — [vm-ranker/params.rs](https://github.com/xai-org/x-algorithm/blob/main/vm-ranker/params.rs); [vm-ranker/scoring/value_model.rs](https://github.com/xai-org/x-algorithm/blob/main/vm-ranker/scoring/value_model.rs); [README](https://github.com/xai-org/x-algorithm/blob/main/README.md)
- [PRIMARY: code] Author diversity is enabled, with decay 0.5 and floor 0.25. The multiplier is (1 − floor) × decay^n + floor, so successive posts by the same author score 1.0, 0.625, 0.4375, 0.34 and so on, approaching 0.25. This assumes n counts the author's earlier posts in the slate, which matches the README: "each post after an author's first is multiplied by a decaying factor, down to a floor." — [vm-ranker/params.rs](https://github.com/xai-org/x-algorithm/blob/main/vm-ranker/params.rs); [xai-value-model/scoring.rs](https://github.com/xai-org/x-algorithm/blob/main/xai-value-model/scoring.rs); [README](https://github.com/xai-org/x-algorithm/blob/main/README.md)
- [PRIMARY: code] VMRanker reorders posts with a determinantal point process (DPP) over their embeddings, "giving up a little score for less similarity between neighbours." DPP is enabled, with theta 0.65 and max selected rank 150. Per-viewer weight perturbation is off (sigma 0.0). — [README](https://github.com/xai-org/x-algorithm/blob/main/README.md); [vm-ranker/params.rs](https://github.com/xai-org/x-algorithm/blob/main/vm-ranker/params.rs); [weights.rs](https://github.com/xai-org/x-algorithm/blob/main/xai-value-model/weights.rs)
- [PRIMARY: code] Small and new authors get a cold-start boost, enabled by default. A post is eligible if all of these hold:
  - it is an original post, not a reply or repost
  - its author has 50,000 followers or fewer (`ColdStartFollowerCap`)
  - it is at most 2 hours old (7,200 s)
  - it has fewer than 200 home-timeline views (`view_count_on_home` < `ColdStartImpressionThreshold`)
  - it already ranks within the top 97% of non-zero-scored candidates

  Selection uses Thompson sampling over each post's likes per home view, with prior Beta(0.75, 49.25) (prior mean about 1.5%) and top-k 2. One post is lifted to a target slot in the 15-16 range of the feed. The README describes this as "posts from authors whose impressions are below a threshold are lifted toward a target position." — [author_cold_start.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/scorers/author_cold_start.rs); [param.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/params/param.rs); [README](https://github.com/xai-org/x-algorithm/blob/main/README.md)
- [PRIMARY: code] Rules for new viewers: `NewUserMinEngagementFilter` would remove out-of-network posts below an engagement threshold for viewer accounts younger than 30 minutes. It is disabled by default, with threshold 0. — [new_user_min_engagement_filter.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/filters/new_user_min_engagement_filter.rs); [param.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/params/param.rs)
- [PRIMARY: code] In For You, `OONRetweetReplyFilter` removes reposts and replies from accounts the viewer does not follow, and the out-of-network replies source (`EnablePhoenixOonReplies`) is off. Out-of-network distribution therefore goes almost entirely to original posts. — [README](https://github.com/xai-org/x-algorithm/blob/main/README.md); [param.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/params/param.rs)
- [PRIMARY: code] Following tab: the cold-start metrics label an in-network-only request as surface "ranked_following," as opposed to "for_you." The Following tab therefore runs through the same ranked candidate pipeline, restricted to in-network posts. — [author_cold_start.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/scorers/author_cold_start.rs)
- [LORE: press-reported, not confirmed by X] Following-tab sort controls:
  - Nov 2025: "Most recent" and "Popular" filters were reported.
  - Feb 15, 2026: the "Sort by" option was reported as appearing only for Premium on mobile, though still available on web.
  - Mar 31, 2026: Axios reported that the Following tab now defaults to "most popular." I could not fetch the Axios page (HTTP 403); this comes from the search snippet.

  Sources: [PiunikaWeb, Feb 15, 2026](https://piunikaweb.com/2026/02/15/x-following-feed-not-in-chronological-order-heres-what-we-know/); [Axios, Mar 31, 2026](https://www.axios.com/2026/03/31/twitter-feed-algorithim-lists-for-you-following)
- [LORE: press-reported] Apr 22, 2026: X rolled out AI-powered custom timelines for Premium users. — [MacRumors](https://www.macrumors.com/2026/04/22/x-custom-timelines-for-premium-users/)
- [PRIMARY: code] How the repo relates to production: X aims for experiments running on "e.g. 10% or more" of traffic "to be visible in this repository." Cron scripts set the code defaults "to be the primary production values." Withheld from the repo: Grox LLM prompts and "some botmaker rules," "to reduce the risk of gaming." — [README](https://github.com/xai-org/x-algorithm/blob/main/README.md)
- [LORE: press-reported company statement] Bier reportedly confirmed that, from Jan 19, 2026, reply impressions no longer count toward creator revenue. This is a monetization rule, not ranking. — [KuCoin News](https://www.kucoin.com/news/articles/x-platform-revenue-overhaul-the-end-of-reply-farming-as-earnings-shift-to-home-timeline-impressions)

**Independent measurement of algorithmic amplification**
- [MEASURED: field experiment, n = 4,965 active US users, 2023, ~7 weeks; Nature, online Feb 2026] Gauthier, Hodler, Widmer and Zhuravskaya, "The political effects of X's feed algorithm" (doi 10.1038/s41586-026-10098-2):
  - Switching users onto For You raised overall engagement.
  - It made them 4.7 percentage points more likely to prioritise issues favoured by Republicans.
  - Posts from news organisations appeared significantly less often in the algorithmic feed than in the chronological one.
  - Switching users back to chronological had little effect.

  This measures the pre-Grok algorithm. — [Nature Asia press release](https://www.natureasia.com/en/info/press-releases/detail/9242); [PsyPost, Mar 2026](https://www.psypost.org/2026/03/xs-feed-algorithm-shifts-users-political-opinions-to-the-right-new-study-finds-63556)
- [MEASURED: 120 sock-puppet accounts (30 neutral, 30 left, 30 right, 30 balanced), 2024 US election, 3-6 weeks depending on paper version; FAccT 2025] Ye, Luceri and Ferrara found that For You skews exposure toward a few high-popularity accounts for all users. They also found a right-leaning exposure bias in the default timelines of new accounts. — [arXiv 2411.01852](https://arxiv.org/abs/2411.01852)
- [MEASURED: 1,120 generative-AI agents, 14 personas, 3 counterfactual conditions, >200,000 exposures, shortly after the Nov 2024 election; arXiv, Jun 29, 2026] Morosini, Cen, Ilyas, Driss, Mądry and Podimata report that "X's algorithmic feed amplifies toxic, polarizing, political, and right-leaning content relative to the chronological feed." The abstract gives no effect sizes. — [arXiv 2606.30801](https://arxiv.org/abs/2606.30801)

### Inferences
- Positive levers ranked by weight per unit of predicted probability: copy-link share (20) and mutual-follow reply on original posts (20); then reply, quote and DM share (5); follow (4); share (2); repost (1); like (0.66); click (0.3); link open (0.2). Rare actions with large weights (copy-link, DM, follow) only move rankings when the content makes them plausible. Likes are frequent, so 0.66 still contributes substantially.
- The 2026 objective rewards content people send to others (copy link, DM) and conversation among mutuals more than the 2023 objective did. The 2023 "reply engaged by author" head (75) has no direct counterpart; author engagement now matters indirectly, through replies that the model predicts.
- Time spent gained weight between August and October 2026: dwell went 0→0.05, click dwell 0→0.4, continuous dwell 0.004→0.006, plus the Oct 8 time-spent update and the Oct 13 read-through retrieval training. Readable, attention-holding text and threads are favoured. The "not dwelled" penalty is tiny (-0.02).
- The video-quality-view weight was set to zero on Aug 25, 2026, and post_video is 0. For You weighting has no explicit video bonus (the video carousel has separate weights).
- For a new or small account, the cold-start slot is the documented path to non-followers. Only original posts qualify, within the first 2 hours and the first 200 home views, and the like rate among those early viewers decides selection. Replies and reposts never get that slot. Separately, the popular-posts source is seeded from "the most-followed active accounts," a candidate path that favours large accounts.
- Being followed matters. Out-of-network posts carry a 0.75x factor, and replies and reposts from non-followed accounts are filtered out of For You entirely. Mutual follows add a reply-weight boost on original posts.
- Posting bursts: within one viewer's feed, an author's 2nd and 3rd posts are scored at about 0.625x and 0.4375x of what they would otherwise get. Posts older than 48 hours cannot appear in For You at all.
- The academic audits measure distributional and political effects, mostly on the pre-2026 system. They are not direct tests of the Phoenix weights.

### Gaps
- What Phoenix has learned about content features (topic, writing quality, media type, language) cannot be read from the weights. The Grox prompts that drive content labels are unpublished.
- I found no 2026 primary figure for the For You in-network vs out-of-network mix. The 2023 figure was ~50% from in-network Earlybird.
- I could not confirm from code whether the "ranked_following" surface uses the same weights as For You.
- The Axios Mar 31, 2026 page could not be fetched, and current Following-tab defaults may vary by platform and subscription.
- I found no X explanation for the February-August 2026 gap in the "every four weeks" release cadence.

## Q3. What is the status of the external-link penalty in 2025-2026 (Musk and Bier statements, in-app browser and link-post changes, measured reach studies)?

### Takeaway
The October 2026 code contains no explicit link demotion: "open link" is a positive-weighted action (+0.2). X leadership has repeatedly denied any de-boost: Bier in October 2025, April 2026 and July 2026, and Musk on Jul 29, 2026 ("We haven't for over a year"). The mechanism X itself describes is indirect: people who tap out to a link forget to like or reply, which weakens engagement predictions. X responded with an in-app link view that keeps the post's engagement buttons on screen (iOS test from Oct 2025, later X Lite for Android).

Measurements conflict:
- Buffer (18.8M posts, Aug 2024 to Aug 2025): free-account link posts had 0% median engagement after March 2025.
- OpenTweet, a vendor (60 accounts, Jan 1 to Oct 10, 2026): link posts got about the same impressions as non-link posts (median ratio 1.05).

No large independent 2026 study exists.

### Cited Findings
- [PRIMARY: code, Oct 2026] `OpenLinkWeight` is +0.2, unchanged since Aug 13, 2026. RankingScorer and vm-ranker contain no URL-based demotion. `has_url` appears only as an input to an optional debias payload, and `UserDebiasEnabled` is false. — [param.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/params/param.rs); [vm_ranker_debias_payload.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/scorers/vm_ranker_debias_payload.rs); [vm-ranker/params.rs](https://github.com/xai-org/x-algorithm/blob/main/vm-ranker/params.rs)
- [PRIMARY: code] URL-related enforcement is aimed at bad or low-quality URLs, not links in general. Examples:
  - botmaker rules such as `Tweet_Spam_High_Recall_RTF_All_Bad_URL_Sources`, `LQ_Tweets_With_LQ_URL_Verdict_At_Mention_To_NonFollower` and `PinnedLowQualityOrBadUrl`
  - the Grox policy class `SpamScamLinks`

  These act through visibility filtering. — [botmaker-rules/scarecrow/bot/](https://github.com/xai-org/x-algorithm/tree/main/botmaker-rules/scarecrow/bot); [grox/flows/ptos/state.py](https://github.com/xai-org/x-algorithm/blob/main/grox/flows/ptos/state.py)
- [PRIMARY: statement, Oct 19, 2025, relayed by press] Bier on links:
  - "For creators, a common complaint is that posts with links tend to get lower reach. This is because the web browser covers the post and people forget to Like or Reply, so X doesn't get a clear signal whether the content is any good."
  - "To help get better signal, posts will now collapse to the bottom of the page so people can react while you're reading."
  - "the post should stand alone as great content so write a solid caption."

  X was testing this as an in-app browser on iOS. — [Social Media Today, Oct 19, 2025](https://www.socialmediatoday.com/news/x-formerly-twitter-testing-links-in-app-link-post-penalties/803176/); [Engadget](https://www.engadget.com/x-is-testing-a-new-way-of-opening-links-in-posts-to-improve-engagement-211210520.html)
- [PRIMARY: statement, ~Oct 19-20, 2025, relayed by press] Musk: "Posting a link with almost no description will get weak distribution, but posting a link with an interesting description/image will get distribution." — [Social Media Today](https://www.socialmediatoday.com/news/x-formerly-twitter-testing-links-in-app-link-post-penalties/803176/)
- [PRIMARY: statement, Apr 13, 2026, relayed by press] Bier replied "Fake news" to a claim that link posts are penalized. His advice: "Just post the link in the body of the post and provide sufficient context about what the user will see before they click it." The article paraphrases him as saying link clicks are higher than ever. It also reports, in the author's own words, that the overlay link view had reached X Lite for Android. — [Roboin, Apr 13, 2026](https://roboin.io/article/en/2026/04/13/x-denies-link-deboost-recommends-in-post-links/)
- [PRIMARY: statement, Jul 28-29, 2026, relayed by press] Bier to Mark Zuckerberg: "you do not need to put the links in replies anymore." Musk: "We haven't for over a year." The sources disagree on whom Musk was answering: OpenTweet says Paul Graham, while Free Press Journal places it in the Bier/Zuckerberg thread. — [OpenTweet](https://opentweet.io/answers/does-x-penalize-links-2026); [Free Press Journal, Jul 29, 2026](https://www.freepressjournal.in/amp/tech/x-product-head-nikita-bier-confirms-link-penalty-removed-over-a-year-ago-tells-mark-zuckerberg-he-can-post-them-directly); [Siècle Digital, Jul 31, 2026](https://siecledigital.fr/2026/07/31/elon-musk-affirme-que-x-ne-penalise-plus-les-publications-contenant-un-lien-externe/)
- [MEASURED: Buffer, published Oct 14, 2025; 18.8M posts, 71,000 accounts; data through Aug 2025, with the companion study covering Aug 2024 to Aug 2025] Approximate engagement rates as of August 2025:

  | Format | Regular accounts | Premium accounts |
  |---|---|---|
  | Link | 0% | ~0.28% |
  | Image | ~0.20% | ~0.42% |
  | Video | ~0.25% | ~0.85% |
  | Text | ~0.40% | ~0.90% |

  Non-Premium link posts "fall to absolute zero after March 2025," with median engagement stuck at zero. The method is thinly described: medians are stated for some figures only, and the engagement definition is unclear. — [Buffer](https://buffer.com/resources/links-on-x/)
- [MEASURED: OpenTweet (vendor), updated Oct 10, 2026]
  - Data: 28,124 posts published through OpenTweet (13,815 with links, 14,309 without), Jan 1 to Oct 10, 2026; threads excluded. The within-account comparison uses 60 accounts with at least 5 link and 5 no-link posts each.
  - Results: median link/no-link impression ratio 1.05, with links doing worse for 27 of 60 accounts. Since Jul 29, 2026: 1.07 (25 of 58 worse). Pooled median impressions: 57 for link posts, 44 for no-link posts.
  - Caveats the vendor states: mostly small accounts (median post ~50 impressions), impressions only, observational, the vendor's own unaudited data.

  Source: [OpenTweet](https://opentweet.io/answers/does-x-penalize-links-2026)
- [MEASURED: small sample, date not verified] A NiemanLab analysis of 200 tweets from 18 publishers reportedly found that posts with link clicks see less reach. This comes from a search summary only. — [Social Media Today](https://www.socialmediatoday.com/news/niemanlab-offers-advice-for-posting-news-on-x/817383/)
- [LORE] A search summary says PPC Land reported about "94% fewer views" for link posts in January 2026, derived from X's ranking model rather than from measured reach. I did not fetch or verify this. — [PPC Land](https://ppc.land/x-drops-year-old-link-penalty-musk-tells-zuckerberg-on-platform/)
- [PRIMARY: code, 2023, historical] Earlybird had link-related knobs: tweetHasNewsUrlBoost (default 1) and a deprecated host-quality multiplier for posts with links. — [ranking.thrift](https://github.com/twitter/the-algorithm/blob/main/src/thrift/com/twitter/search/common/ranking/ranking.thrift)

### Inferences
- The best current model of the "link penalty" is engagement substitution, not a rule. Opening a link earns +0.2, but a viewer who leaves is less likely to like (0.66), reply (5), quote (5), share or dwell. A link post whose caption itself earns replies, quotes or shares is not structurally disadvantaged in the published code. Musk (Oct 2025) and Bier (Apr 2026) gave the same advice: a substantive caption, with the link in the body.
- Buffer's March 2025 collapse predates the January 2026 Phoenix system, and it coincides with free-account engagement falling to a 0% median across all formats (Buffer's Premium study). The 2025 link result may therefore be mostly a free-account reach effect. Musk's July 2026 "over a year" claim would date the end of any penalty to around mid-2025, which only partly overlaps Buffer's data window.
- For a new publisher in November 2026: post links in the body with a caption that works on its own. Measure body vs reply placement on your own account, because the only 2026 data is a small-account vendor sample.

### Gaps
- I found no independent, large-sample 2026 measurement of link vs no-link reach under the Phoenix system.
- The NiemanLab study's date and method, and the PPC Land "94%" figure, are unverified.
- I could not confirm that the in-app link overlay is fully rolled out on iOS, Android and web as of November 2026.
- Who Musk was replying to on Jul 29, 2026 differs between sources (see above).

## Q4. How do X Premium and verification affect ranking (reply prioritization, For You boost, the 2023 blue-verified multipliers), and are there documented penalties (all caps, unknown language, offensive content, many hashtags, excessive posting)?

### Takeaway
Premium's only official, documented ranking benefit is reply prioritization ("larger" for Premium, "largest" for Premium+). X's Help Center lists subscriber status among the signals it uses when deciding which replies to lift. The 2023 code multiplied blue-verified authors' scores by 4x in-network and 2x out-of-network. Those multipliers are absent from X's September 2025 legacy-code update and from the 2026 For You scoring code, where the only "verified" input I found is a feature of a reply-ranking model. Buffer's 2025 data shows Premium accounts with about 10x the median reach, but that is correlational and predates the 2026 system.

The documented 2026 penalties are categorical spam and abuse labels applied through visibility filtering, including:
- engagement baiting and engagement farming
- hashtag abuse and mention abuse
- scam links

Repeated posts also face author-diversity decay. I found no all-caps or hashtag-count penalty in the 2026 code. The language and hashtag demotions documented in 2023 sat in Earlybird, which is not part of the 2026 stack.

### Cited Findings
- [PRIMARY: statement, X Help Center, wording seen via search snippets on Nov 1, 2026; direct fetch returned HTTP 403]
  - Premium includes "larger reply prioritization," and Premium+ the "largest reply prioritization."
  - When deciding whether to lift a reply, X considers "if the original post author has replied, if a reply is from someone you follow, or if the person is an X Premium subscriber or a subscriber to a Plus, Premium, Super, or Ultra plan on The X Subscription."
  - Premium Business and Premium Organizations get "prioritized rankings" in replies and conversations respectively.

  Sources: [About X Premium](https://help.x.com/en/using-x/x-premium); [About conversations on X](https://help.x.com/en/using-x/x-conversations); [Premium Business](https://help.x.com/en/using-x/premium-business); [Premium Organizations](https://help.x.com/en/using-x/premium-organizations)
- [PRIMARY: statement, Aug 2024, relayed by press] X introduced reply-sorting options, which reports noted do not rank blue-check users higher. Previously, replies from blue-check users had been prioritized. — [AlternativeTo, Aug 2024](https://alternativeto.net/news/2024/8/x-introduces-new-reply-sorting-options-that-don-t-rank-blue-check-users-higher)
- [PRIMARY: code, 2023] Blue-verified author multipliers of 4.0 in-network and 2.0 out-of-network, present in the Mar 31, 2023 and Jul 7, 2023 versions. — [HomeGlobalParams.scala @ 2023-03-31](https://github.com/twitter/the-algorithm/blob/ef4c5eb65e6e04fac4f0e1fa8bbeff56b75c1f98/home-mixer/server/src/main/scala/com/twitter/home_mixer/param/HomeGlobalParams.scala); [ScoredTweetsParam.scala @ 2023-07-07](https://github.com/twitter/the-algorithm/blob/72eda9a24f815f6d566818cbf8518138e29d83e9/home-mixer/server/src/main/scala/com/twitter/home_mixer/product/scored_tweets/param/ScoredTweetsParam.scala)
- [PRIMARY: code, Sep 3, 2025] The multipliers are absent from the legacy-repo update, and the Creator multipliers are 1.0. — [ScoredTweetsParam.scala @ 2025-09-03](https://github.com/twitter/the-algorithm/blob/c54bec0d4e029fe34926ef3258a86ccacc0d0182/home-mixer/server/src/main/scala/com/twitter/home_mixer/product/scored_tweets/param/ScoredTweetsParam.scala)
- [PRIMARY: code, Oct 31, 2026] In the 2026 code:
  - `SubscriptionLevel` (BASIC / PREMIUM / PREMIUM_PLUS) appears in the proto and in ads-injection logging.
  - I found no subscription or verification multiplier in home-mixer scorers, xai-value-model or vm-ranker.
  - The only author-verified ranking input found is `cand_author_verified` in the Phoenix reply two-tower v2 model, which ranks replies.

  Absence from the published code does not prove absence in production, and Phoenix can learn author effects from its inputs. — [recsys.proto](https://github.com/xai-org/x-algorithm/blob/main/phoenix/python/common/xai-proto/proto/recsys.proto); [ads_injection_logging_side_effect.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/side_effects/ads_injection_logging_side_effect.rs); [recsys_reply_two_tower_v2_model.py](https://github.com/xai-org/x-algorithm/blob/main/phoenix/xrex/models/recsys_reply_two_tower_v2_model.py)
- [PRIMARY: code] The spam-rule engine reads verification state: derived features `IsUserGoldVerified`, `IsUserGrayVerified` and `GetVerifiedFollowers`. — [botmaker-rules/scarecrow/derived-feature/](https://github.com/xai-org/x-algorithm/tree/main/botmaker-rules/scarecrow/derived-feature)
- [MEASURED: Buffer, published Oct 2, 2025; 18.8M+ posts, 71,000 accounts (~27% subscribed), Aug 2024 to Aug 2025; medians]
  - Reach: Premium gets "around 10x more reach per post." Regular accounts typically had under 100 median impressions per post, Premium about 600, Premium+ over 1,550.
  - Median engagement: Basic ~0.55%, Premium+ 0.53%, Premium 0.49%, regular 0%.
  - Regular-account engagement fell from ~0.15% to 0% by March 2025.

  The authors frame this as suggestive, not causal. They do not address selection bias, and the article contradicts itself on Basic vs Premium+. — [Buffer](https://buffer.com/resources/x-premium-review/)
- [LORE] Vendor blogs claim Premium multipliers of 2-4x, 6x (15x for Premium+), or "30-40% higher reply impressions" from "internal X data, Q1 2026." None of these is verified. — [Supabird](https://supabird.io/articles/x-premium-vs-free-does-it-really-help-you-grow-faster); [Sozee](https://sozee.ai/?p=764)
- [PRIMARY: statement via press] In December 2025, EU regulators fined X (reported as $140 million) for breaching Digital Services Act transparency obligations. Among other findings, they said the checkmark system made it "more difficult for users to judge the authenticity of particular accounts." — [TechCrunch, Jan 20, 2026](https://techcrunch.com/2026/01/20/x-open-sources-its-algorithm-while-facing-a-transparency-fine-and-grok-controversies)
- [PRIMARY: code] Documented 2026 penalty categories in Grox's safety policy enum:
  - Spam: `SpamEngagementFarming`, `SpamEngagementTrading`, `SpamEngagementBaiting`, `SpamHashTagAbuse`, `SpamMentionAbuse`, `SpamScamLinks`, `SpamBotProduced`, `SpamPlatformManipulation`, `SpamCardManipulation`, `SpamManipulatedMedia`, `SpamFinancialScam`
  - Also hate/abuse with a target, violent speech, adult and violent media

  Source: [grox/flows/ptos/state.py](https://github.com/xai-org/x-algorithm/blob/main/grox/flows/ptos/state.py)
- [PRIMARY: code] Visibility filtering returns ALLOW, NOTICE, INTERSTITIAL or DROP. Some rules drop a post only when it is an out-of-network recommendation ("spam caught at high recall," for instance), while "the same post is allowed to a follower." A dropped post also removes posts that quote, repost or descend from it. — [README](https://github.com/xai-org/x-algorithm/blob/main/README.md)
- [PRIMARY: code] Hashtags: I found no hashtag-count feature in 2026 ranking. Hashtags appear in the `SpamHashTagAbuse` label and in muted-keyword matching. — [grox/flows/ptos/state.py](https://github.com/xai-org/x-algorithm/blob/main/grox/flows/ptos/state.py); [viewer_muted_keyword_filter.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/filters/viewer_muted_keyword_filter.rs)
- [PRIMARY: statement, Dec 17, 2024, relayed by press] Musk: "Please stop using hashtags. The system doesn't need them anymore and they look ugly." In June 2025 X banned hashtags from ads, which Musk called an "esthetic nightmare." — [Fox 5 DC](https://www.fox5dc.com/news/hashtags-x-elon-musk-says-please-stop-using-them); [Inquirer](https://usa.inquirer.net/162874/elon-musk-says-hashtags-look-ugly-no-need-to-use-them-on-x); [Storyboard18](https://www.storyboard18.com/amp/brand-makers/elon-musk-bans-hashtags-from-ads-on-x-calls-them-esthetic-nightmare-71969.htm)
- [PRIMARY: code] Language: the 2023 Earlybird defaults included an unknown-language demotion of 0.01 (Q1). In 2026, language codes are hydrated and passed to VMRanker as `language_code`, but I found no explicit language multiplier in the published scorers. — [vm_ranker_request.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/scorers/vm_ranker_request.rs); [ranking.thrift](https://github.com/twitter/the-algorithm/blob/main/src/thrift/com/twitter/search/common/ranking/ranking.thrift)
- [PRIMARY: code] Account reputation: user-cred-v2 "runs PageRank over the follow graph and engagement edges, and turns the resulting mass into a per-account score." It is the TweepCred successor, and its config has `vit_threshold` default 55.0, whose meaning is undocumented. — [README](https://github.com/xai-org/x-algorithm/blob/main/README.md); [UserCredV2Config.scala](https://github.com/xai-org/x-algorithm/blob/main/user-cred-v2/UserCredV2Config.scala)
- [PRIMARY: code] Posting frequency: I found no explicit "excessive posting" penalty. Author diversity (decay 0.5, floor 0.25) discounts an author's later posts within a viewer's feed. — [vm-ranker/params.rs](https://github.com/xai-org/x-algorithm/blob/main/vm-ranker/params.rs)

### Inferences
- For a new publisher, the documented Premium benefit is reply prioritization, which matters if replying to larger accounts is part of the distribution strategy. A For You reach benefit is plausible (Buffer's 10x is correlational, from 2024-2025) but is not hard-coded in the published 2026 For You scorer. Any such effect would be learned by Phoenix or would live in unpublished parts of the system.
- Hashtags bring no ranking benefit in the code. Abuse is labelled as spam, and Musk discourages them. Use them sparingly or not at all.
- Engagement bait ("like if you agree," reply-farming prompts) and mention or hashtag stuffing match named spam classes. Those classes can drop a post for non-followers through out-of-network-only visibility rules, which cuts discovery while followers still see it.

### Gaps
- I could not read the Help Center pages directly (HTTP 403). The phrase "Plus, Premium, Super, or Ultra plan on The X Subscription" suggests a recent (late 2026) restructuring of subscription tiers. I did not verify tier names, prices, or which tiers carry reply prioritization.
- No primary source quantifies the size of the reply boost.
- Withheld botmaker rules and Grox prompts may contain further penalties; the README confirms that some are withheld.
- I could not determine what `vit_threshold` means in user-cred-v2.
- I found no evidence for or against an all-caps penalty; treat any such claim as lore.

## Q5. Which negative signals hurt reach (mutes, blocks, "show fewer", reports, Community Notes) and how heavily?

### Takeaway
Negative feedback is the most heavily weighted class in the 2026 ranker:

| Signal | 2026 weight (Oct 30) |
|---|---|
| report | -234 |
| mute author | -58.8 |
| not interested | -52.272 (up from -43.2 on Aug 13, 2026) |
| block author | -31.2 |
| not dwelled | -0.02 |

In 2023 the comparable weights were -74 for "show less", block or mute combined, and -369 for report. X stresses that these weights multiply each viewer's own predicted probability. The baseline report probability is more than 1000x lower than a like, so negative signals act mainly through personalization, and coordinated brigading has limited effect.

Beyond ranking, account-level labels derived from blocks and reports relative to likes (agatha) can trigger visibility filtering. Blocks, mutes and muted keywords also hard-filter content for the viewer who set them. Community Notes measurably reduce spread (PNAS 2025: reposts down 46% after a note is attached). In the published 2026 code, though, the Community Note label is used only for ad brand safety, not as an organic ranking demotion.

### Cited Findings
- [PRIMARY: code, synced Oct 30, 2026] Negative weights: report -234.0; mute author -58.8; not interested -52.272; block author -31.2; not dwelled -0.02. — [param.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/params/param.rs)
- [PRIMARY: code] Weight history: not_interested went from -43.2 (Aug 13) to -47.52 (Sep 29) to -52.272 (Oct 14, 2026), 21% heavier in two months. Report, block and mute were unchanged since Aug 13. — [param.rs history](https://github.com/xai-org/x-algorithm/commits/main/home-mixer/params/param.rs)
- [PRIMARY: code, comments added Aug 14, 2026]
  - "it'd be incorrect to see that a report has 468 times higher weight than a like and conclude that e.g. '1 report cancels out 468 likes'." (468 = 234/0.5 at that time; with today's favorite weight of 0.66 the ratio is about 355.)
  - "the baseline probability of a Report is more than 1000x lower than a Like, so it's weighted more to allow the prediction to affect the final ranking at all."
  - Mass blocking and reporting is limited in two ways. First, "reports from bad actors will primarily affect recommendations for users who are similar to the bad actors." Second, an action only counts if it "take[s] place on a post served in Home Timeline. Directly navigating to a post (i.e., coordinating via groupchat) has no ranking impact."

  Sources: [param.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/params/param.rs); [README](https://github.com/xai-org/x-algorithm/blob/main/README.md)
- [PRIMARY: code, 2023] negative_feedback_v2 -74.0 ("show less often" on the post or author, block or mute) and report -369.0. — [heavy ranker README](https://github.com/twitter/the-algorithm-ml/blob/main/projects/home/recap/README.md)
- [PRIMARY: code] Viewer hard filters: `AuthorSocialgraphFilter` removes posts from accounts the viewer blocks or mutes, and `MutedKeywordFilter` removes posts matching muted keywords. Visibility filtering also reads whether the viewer blocks or mutes the author. — [README](https://github.com/xai-org/x-algorithm/blob/main/README.md)
- [PRIMARY: code] Account-level consequences:
  - agatha: "Offline batch jobs that label an account from how others respond to its posts: blocks, reports and spam reports relative to favorites, plus spam-suspension and adult-content labels."
  - bdsm: reads action sequences "to identify signs of inauthentic or abusive behavior."
  - abuse-enforcement-service: "labels it or its posts, challenges it, or suspends it."
  - safety-label-user-agg: "labels an account for what its posts collected."
  - In visibility evaluation, "the first rule that answers drop ends the evaluation."

  Source: [README](https://github.com/xai-org/x-algorithm/blob/main/README.md)
- [PRIMARY: code] The "Under the Hood" pilot shows an account's visibility-impacting labels, including whether a label was applied manually, and since Sep 18, 2026, legal withholding. — [README](https://github.com/xai-org/x-algorithm/blob/main/README.md)
- [PRIMARY: code] Community Notes in the code: the `NSFA_COMMUNITY_NOTE` safety label is used in home-mixer's brand-safety model, which governs ad adjacency. Birdwatch status-change events feed the botmaker rule engine. I found no organic For You demotion keyed on Community Notes. — [brand_safety.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/models/brand_safety.rs); [FeaturesOfBirdwatchStatusChangeEvent.java](https://github.com/xai-org/x-algorithm/blob/main/botmaker/scarecrow_features/src/main/java/com/twitter/scarecrow/features/FeaturesOfBirdwatchStatusChangeEvent.java)
- [MEASURED: PNAS, Sep 18, 2025; ~40,000 posts with suggested notes, of which 6,757 had notes rated helpful and attached; Mar to Jun 2023; synthetic-control comparison tracked for 48 hours after attachment] Slaughter, Peytavin, Ugander and Saveski:
  - After a note is attached: reposts -46%, likes -44%, replies -22%, views -14%.
  - Over a post's whole lifespan: reposts -12%, likes -13%, replies -7%, views -6%.
  - "Notes that take 48 hours or so to go up have almost no effect."
  - The data predates X's later changes to the Community Notes algorithm.

  Sources: [UW News, Sep 18, 2025](https://www.washington.edu/news/2025/09/18/community-notes-x-false-information-viral); [arXiv 2502.13322](https://arxiv.org/abs/2502.13322v2)

### Inferences
- In practice, content that makes the people it is shown to tap "not interested" or mute is the most expensive mistake. The "not interested" weight keeps rising, and mute (-58.8) outweighs block (-31.2). Because predictions are personal, polarizing content can still rank well for audiences predicted to like it while being suppressed for others.
- Brigading is a lower ranking risk under X's stated design. Account-level agatha labels, however, depend on blocks and reports relative to favorites. Tactics that draw many blocks or spam reports for each like (engagement farming, mass mentions) risk labels that cut out-of-network distribution.
- Community Notes hurt reach mainly through behaviour: fewer reposts and likes feed back into the model's predictions. The note label also affects ad adjacency. For a fact-focused publisher, accuracy is a reach safeguard as well as a credibility one.

### Gaps
- The agatha label thresholds and the mapping from each label to drop, notice or interstitial are not documented in the README, and some rules are withheld.
- I did not verify X's monetization rule for posts with Community Notes (often reported as ineligible for revenue share since 2023).
- I found no measured study of how mutes or blocks affect reach under the 2026 Phoenix system.
