# Instagram format and posting-practice performance data, 2024-2026

Research date: 2026-11-01 (state as of November 2026). Scope: Instagram-specific evidence only. The general research on why posts spread is in `research_notes/X content engagement playbook/viral_content_psychology.md` and is not repeated here.

Provenance labels on every claim:
- **[PRIMARY]**: Meta or Instagram's own statements: creators.instagram.com, about.instagram.com, the Meta developer changelog, and Adam Mosseri. Mosseri and Instagram-guide statements reported by Social Media Today (SMT) also count as primary. Text in quotation marks is verbatim; everything else is SMT's close paraphrase of the video or post. "Headline only" means only the SMT headline and summary were seen.
- **[MEASURED]**: third-party data. Each bullet gives the sample, the period and the engagement-rate (ER) formula wherever the source states them.
- **[LORE]**: circulating claims with no traceable data or primary statement.
- Modifiers: **[SNIPPET]** means the number came from a search-result summary because the page itself was not opened. **[SECONDARY]** means an aggregator's transcription of another publisher's number. **[CHANGED?]** means Instagram has changed something since the data was collected that could alter the result.

Three warnings for whoever uses these numbers:
1. **The ER denominator changes the scale about tenfold.** Per-follower rates run about 0.3-0.6% for brand accounts: Socialinsider uses (likes + comments) ÷ followers, Rival IQ uses all interactions ÷ followers, and Buffer's timing study uses (likes + comments + shares + saves) ÷ followers. Per-reach rates run about 3-7%: Buffer's format data uses interactions ÷ unique accounts reached. Hootsuite does not state its formula, and its 3-5% figures sit on the per-reach scale. Never compare a rate across denominators.
2. **Every sample is a vendor's customer base.** Socialinsider, Rival IQ and Dash Social cover established business or brand accounts and exclude accounts under 1,000 followers. Buffer and Metricool cover their own users, mostly small businesses and creators, and state no follower floor. Sprout and Hootsuite cover their own customers. No source benchmarks brand-new accounts.
3. **"Views" are not comparable across eras.** Meta introduced the `views` metric on 2025-01-21 and deprecated `impressions` and `plays` in the API for all versions from 2025-04-21 (details in section 1). Views figures from 2025-26 cannot be compared with older studies built on impressions or plays.

The creators.instagram.com pages came back in Hindi from this machine. The quotes below are the fetch tool's English renderings.

## 1. Reach and engagement by format (Reels, carousels, single images, Stories), overall and for small accounts; ER benchmarks for media, publisher and education accounts

### Takeaway
In every 2025-2026 dataset, **carousels win on engagement rate and saves, and Reels win on unique reach.**
- **Engagement per reach** (Buffer, 2025 medians): carousels 6.9%, single images 4.4%, Reels 3.3%. Stories score 5.1%, but on a sample of only 520.
- **Unique reach:** Reels reached 1.36x carousels and 2.25x single images (Buffer, 4M+ posts, 2022-24), and 29% and 212% more (Metricool, 24.4M posts, early 2026).
- **Views:** carousels still log the most views per post (Metricool, and Socialinsider at every follower tier). A view is closer to the old impression count than to unique reach.
- **Engagement per follower** (Socialinsider 2025): carousels 0.55%, Reels 0.52%, images 0.37%. The Q3 2026 figures are 0.50%, 0.48% and 0.35%.
- **Brand medians per follower** (Rival IQ): roughly 0.30-0.36% across all industries. Higher Ed runs about 2.1% and Media about 0.44%, but those industry figures are second-hand.
- **Single images** are the format in decline in every source.

### Cited Findings

#### Engagement per reach and unique reach (Buffer)
- **[MEASURED]** (published 2026-03-05; 2025 data through 2025-12-03, compared with 2024)
  - Instagram's median ER was **5.46% in 2025**, down from about **7.3% in 2024** (about -26% YoY).
  - Instagram fell from 1st to 3rd among the platforms Buffer tracks, behind LinkedIn and Facebook.
  - ER = (likes + comments + shares, plus saves where available) ÷ unique accounts reached. Buffer does not give an Instagram-only sample size.
  - Buffer notes that Instagram increasingly emphasises views, so ER may capture less of what the platform optimises for.
  — [Buffer, State of Social Media Engagement 2026](https://buffer.com/resources/state-of-social-media-engagement-2026/)
- **[MEASURED]** (published 2026-03-19) Median ER per reach by format:

  | Format | Median ER per reach |
  |---|---|
  | Carousels | 6.9% |
  | Stories | 5.1% (n=520; Buffer says "treat with caution") |
  | Single images | 4.4% |
  | Reels | 3.3% |

  Carousels earn "109% more engagement per person reached" than Reels. Buffer gives no sample sizes for the other formats and no period; it is presumably the same 2025 data. — [Buffer, Best Content Format 2026](https://buffer.com/resources/data-best-content-format-social-media/)
- **[MEASURED] [CHANGED?]** (data Jan 2022 to Oct 2024; 4M+ Buffer-published Instagram posts)
  - **Reach:** Reels reached **1.36x carousels** and **2.25x single images**.
  - **ER:** carousels were 2.09x Reels and 1.55x single images, and single images were 1.34x Reels.
  - Buffer calls Reels the discovery format (helped by the dedicated Reels tab) and carousels the relationship format.
  - The data predates the views metric (2025), the five-hashtag cap (December 2025) and the "Your Algorithm" controls.
  — [Buffer, State of Social Media Engagement 2026](https://buffer.com/resources/state-of-social-media-engagement-2026/); [Buffer, Best Content Format 2026](https://buffer.com/resources/data-best-content-format-social-media/)

#### Engagement per follower, views, saves and comments by follower tier (Socialinsider)
- **[MEASURED]** (page dated 2026-02-20, with a Q3 2026 quarterly update)
  - **Sample:** 67,541,436 organic posts from about 579K business accounts. The page says it holds "2025 values, presented as 2026".
  - **Formula:** ER = (likes + comments) ÷ followers × 100, averaged per post.
  - **Average:** 0.48% in 2025, which Socialinsider calls a 24% YoY decrease. The platform average for Q3 2026 is 0.45%.

  | Format | 2024 | 2025 | Q3 2026 |
  |---|---|---|---|
  | Reels | 0.50% | 0.52% | 0.48% |
  | Carousels | 0.55% | 0.55% | 0.50% |
  | Images | 0.45% | 0.37% | 0.35% (up from 0.33%) |

  - **Inconsistencies:** the "-24%" headline does not match the page's own format table, where Reels and carousels are flat or up. The methodology says accounts under 1K and over 100K followers were excluded, yet a 100K-1M tier is reported.

  — [Socialinsider, 2026 Instagram Organic Benchmarks](https://www.socialinsider.io/social-media-benchmarks/instagram)
- **[MEASURED]** Same dataset, median per post by follower tier (Reels / carousels / images):

  | Tier | Views | Saves | Comments |
  |---|---|---|---|
  | 1K-5K | 580 / 993 / 417 | 1 / 1 / 1 | 3 / 2 / 1 |
  | 5K-10K | 1,000 / 2,117 / 1,068 | 2 / 2 / 1 | 6 / 4 / 1 |
  | 10K-50K | 2,460 / 4,275 / 2,340 | 7 / 8 / 3 | 12 / 10 / 4 |
  | 50K-100K | 6,095 / 11,597 / 7,405 | 22 / 35 / 10 | 22 / 15 / 10 |
  | 100K-1M | 16,035 / 35,370 / 22,900 | 96 / 98 / 43 | 60 / 40 / 38 |

  Carousels get the most views in every tier, about 1.7-2.2x Reels. — [Socialinsider, 2026 Instagram Organic Benchmarks](https://www.socialinsider.io/social-media-benchmarks/instagram)
- **[MEASURED]** (published 2026-09-03, updated 2026-10-21)
  - **Sample:** 72,556,344 organic posts from brands with 1K-1M followers, January 2025 to August 2026.
  - **Formula:** reach rate = reach ÷ followers × 100. Socialinsider notes that reach is an estimated metric.
  - **By format:** carousels **4.50%**, Reels **4.10%**, images **4.00%**.
  - **By tier:**

    | Tier | Reach rate | Posts | Profiles |
    |---|---|---|---|
    | 1-5K | **6.65%** | 3.96M | 148,330 |
    | 5-10K | 5.75% | | |
    | 10-50K | 5.50% | | |
    | 50-100K | 4.50% | | |
    | 100K-1M | 3.50% | | |

  - **Inconsistencies:** the body gives the average reach rate as 4.90% (-14% YoY), while the summary says 3.20%. The 3.20% equals the August 2026 engagement-by-reach value, which fell from 3.70% in January 2025, so it is probably a mix-up. The tier post counts sum to about 38M, not 72.6M.

  — [Socialinsider, social media reach study](https://www.socialinsider.io/blog/social-media-reach/)
- **[SECONDARY] [SNIPPET]** A roundup that cites "Socialinsider 2025" gives much higher figures: Reels 1.23%, carousels 0.99%, video 0.80%, images 0.59%. These conflict with Socialinsider's own page, so treat the roundup as unreliable. — [Colorlib](https://colorlib.com/wp/instagram-engagement-rate/)

#### Metricool 2026 Instagram Study (24.4M posts, early 2026 vs early 2025)
- **[MEASURED]** (press release 2026-06-16; 24,364,803 posts from 375,118 accounts; January-February 2025 compared with January-February 2026)
  - Reels earn **more than 4x the interactions** of single-image posts.
  - Carousels earn **9x the saves** of single images and outperform single images "on every major metric".
  - Single images, YoY: reach **-21.96%**, interactions -25.41%, engagement **-45.98%**.
  - Platform-wide, YoY: brand content published +24.04%, views +26.56%, interactions +19.25%.
  — [Metricool press release](https://metricool.com/press-release-instagram-study-2026/)
- **[MEASURED]** (newsletter 2026-06-21, same study)
  - Reels "reach 29% more people than carousels" and 212% more than single images.
  - Carousels average **27k+ views per post**, 20% more than Reels and 143% more than single images.
  — [Metricool newsletter](https://newsletter.metricool.com/p/instagram-tell-me-your-goal-and-i-ll-tell-you-what-can-help)
- **[MEASURED]** Publishing volume grew most for Reels (+35%), then carousels (+24%) and single images (+12%). — [Metricool, 2026 Instagram Study page](https://metricool.com/instagram-research-study/)

#### Brand industry benchmarks: media, education, nonprofits
- **[MEASURED]** (Rival IQ, published 2025-02-25)
  - **Sample:** 150 randomly selected companies in each of 14 industries, drawn from a 200K-company database. Eligible brands had 25K-1M Facebook fans and at least 1K Instagram followers. Figures are medians.
  - **Formula:** ER = all interactions ÷ followers, per post. The data period is not stated.
  - **Findings:**
    - Instagram engagement fell 16% YoY, and median posting frequency dipped slightly, the first decline in three years.
    - Carousels were the top post type overall.
    - Higher Ed was the clear Instagram winner: its engagement "more than quadrupled the median" while it posted less often than the median.
    - Media Reels earned more than 3x the engagement of Media video posts.
    - The page text gives no numeric rates; they appear only in charts.
  — [Rival IQ, 2025 Social Media Industry Benchmark Report](https://www.rivaliq.com/blog/social-media-industry-benchmark-report/)
- **[SECONDARY]** Rival IQ 2025 values as transcribed by one aggregator, all per follower:

  | Industry | ER | Posts per week |
  |---|---|---|
  | Media / Entertainment | 0.44% | 13.03 |
  | Higher Education | 2.10% | 4.07 |
  | Nonprofits | 0.56% | 4.18 |

  Industry medians range from 0.14% (Health & Beauty) to 2.10% (Higher Ed). — [Apaya, Social Media Benchmarks 2026](https://apaya.com/blog/social-media-benchmarks)

  A second aggregator gives different values: all-industry median 0.36%, Higher Ed 2.43%, Media 0.38-0.56%, Nonprofits 0.93-1.04%. — [UpGrow](https://www.upgrow.com/en/blog/post/instagram-engagement-rate-statistics-2026-industry-follower-size)
- **[SECONDARY] [SNIPPET]** Search summaries of 2026 benchmark posts attribute a **0.30%** all-industry median for 2026 (-17% from 0.36%) to Rival IQ's 2026 report, which is now published under its parent company Quid. The report itself could not be opened. — [inmagic.ai](https://inmagic.ai/instagram-engagement-rate-benchmarks/); [PostPlanify](https://postplanify.com/blog/social-media-engagement-rate-benchmarks-2026)
- **[MEASURED]** (Hootsuite, published 2026-04-14; sample, period and ER formula not stated)
  - **Best format:** carousels, at 4.2% overall.
  - **Carousels by industry:** Education 5.4%, Nonprofits 5.5%, Entertainment & media 3.2%. Reels score 2.7% in Entertainment & media.
  - **Highest ER by posting frequency:**

    | Segment | Highest ER | At posts per week |
    |---|---|---|
    | Overall | 4.04% | 2 |
    | Education | 4.52% | 28 |
    | Entertainment & media | 3.70% | 13 |
    | Nonprofits | 4.95% | 25 |

  - The page's FAQ mislabels the carousel figures as industry "average engagement rates".
  — [Hootsuite, Social media benchmarks](https://blog.hootsuite.com/social-media-benchmarks/)
- **[SECONDARY]** Hootsuite's January 2025 figures, as transcribed by an aggregator: cross-industry average 3.50%, Media/Entertainment 3.00%, Nonprofits 4.40%, Reels 2.80%. — [Apaya](https://apaya.com/blog/social-media-benchmarks)

#### Stories
- **[MEASURED]** Buffer's per-reach ER for Stories is 5.1%, on n=520. — [Buffer, Best Content Format 2026](https://buffer.com/resources/data-best-content-format-social-media/)
- **[MEASURED]** (Socialinsider, published 2025-06-26; January-May 2025; the page says both 113,361 and 161,180 Stories; about 46.6K accounts with 1K-1M followers)
  - **Feed vs Stories reach rate** (reach ÷ followers):

    | Tier | Feed | Stories |
    |---|---|---|
    | 1K-5K | 4.00% | 3.30% |
    | 5K-10K | 3.40% | 1.50% |
    | 10K-50K | 3.70% | 0.60% |
    | 50K-100K | 3.00% | 0.30% |
    | 100K-1M | 2.50% | 0.25% |

  - A second table on the same page gives much higher Stories reach for 1K-5K accounts (image 9.55%, video 10.40%), which conflicts with the first.
  - Video Stories out-reach image Stories in every tier.
  - Exit rate falls from **23.8% on the first Story** to about 12.5% by the 15th.
  - Socialinsider recommends at least 6 Stories a day. Other sources say about two (see Dash Social below, and Buffer in section 4).
  — [Socialinsider, Instagram Stories Benchmarks](https://www.socialinsider.io/social-media-benchmarks/instagram-stories-benchmarks)
- **[MEASURED]** (Dash Social, updated 2025-12-19; 2K+ brands with at least 1K followers; January-June 2025)
  - Average Stories completion is about **70%**, exit about 5%, and brands post about 2 Stories a day.
  - Small accounts (up to 190K followers) show 68.3% completion, 6.0% exit and an average reach of 1,064 per Story.
  - The page's tables contain internal inconsistencies, such as reach exceeding impressions.
  — [Dash Social, Instagram Stories benchmarks](https://www.dashsocial.com/blog/every-instagram-stories-performance-benchmark-you-need-to-know)
- **[MEASURED]** (Metricool 2026) Story replies rose 88% YoY, and Stories reach was flat YoY. — [Metricool newsletter](https://newsletter.metricool.com/p/instagram-tell-me-your-goal-and-i-ll-tell-you-what-can-help)
- **[PRIMARY] [CHANGED?]** (2023-05-31, Mosseri) Stories rank on "Viewing history," "Engagement history" and "Closeness". They predict whether you will "tap into a story, reply to a story or move on to the next story", which means they are shown mostly to existing followers. — [Instagram, Ranking Explained](https://about.instagram.com/blog/announcements/instagram-ranking-explained)
- **[PRIMARY, headline only]** (2026-10-05) Instagram is testing an option to open the app on Reels, which SMT reads as a further move away from Stories. — [SMT](https://www.socialmediatoday.com/news/instagram-tests-option-to-open-to-reels/832202/)

#### What Instagram says it ranks on
- **[PRIMARY]** (2025-01-22, Mosseri)
  - "The top three signals that matter most for ranking are watch time, likes and sends."
  - "So when looking at your insights, pay close attention to average watch time, likes per reach, and sends per reach."
  - "Likes are slightly more important for connected content, and sends are slightly more important for unconnected content." Connected means followers and unconnected means non-followers.
  — [SMT, 2025-01-22](https://www.socialmediatoday.com/news/instagram-shares-algorithm-insights-2025/738034/)
- **[PRIMARY] [CHANGED?]** (2023-05-31, Mosseri, "Instagram Ranking Explained")
  - **Feed** predicts whether you will "spend a few seconds on a post, comment on it, like it, share it, and tap on the profile photo".
  - **Explore** predicts "likes, saves, and shares".
  - **Reels** predict "how likely you are to reshare a reel, watch a reel all the way through, like it, and go to the audio page".
  - Reels that were "already been posted on Instagram", and "low-resolution or watermarked reels", are made less visible.
  — [Instagram, Ranking Explained](https://about.instagram.com/blog/announcements/instagram-ranking-explained)
- **[PRIMARY]** Each part of the app uses its own algorithm, and Reels take 50% of time spent on Instagram (creators.instagram.com, © 2026). — [Instagram, How to grow](https://creators.instagram.com/how-to-grow)
- **[PRIMARY]** (2026-09-24, Mosseri video series, reported by SMT)
  - Ranking follows four principles:
    - **Originality:** original posts take priority over reposts.
    - **Recency:** newer posts get more exposure, and the feed is "roughly in chronological order".
    - **"Breaking content":** Instagram shows posts from small creators to non-followers to gauge the response.
    - **Larger models.**
  - Creators should watch engagement rates rather than total views or likes.
  - Trial Reels are for experimenting.
  - Users can steer their feeds through favourites, "Not interested" and "Your Algorithm".
  — [SMT, 2026-09-24](https://www.socialmediatoday.com/news/instagram-chief-shares-algorithm-insights-and-posting-tips/831326/)
- **[PRIMARY]** (2026-09-28, Instagram Reels guide) Reels account for "more than 50% of all user time spent on IG". — [SMT, 2026-09-28](https://www.socialmediatoday.com/news/instagram-shares-reels-creation-tips-in-new-guide/831551/)

#### Platform changes that affect comparisons (dated)
- **[PRIMARY]** (2025-01-21) Meta introduced `views` for Instagram media and user insights and deprecated `impressions` and `plays`. The deprecation applied to API v22.0+ at once and to all versions from 2025-04-21. On 2026-04-22 Meta added `total_views`, "aggregated views across all surfaces (video media only)", and extended `facebook_views` to Feed, Reels and Story media. — [Meta, Instagram Platform changelog](https://developers.facebook.com/docs/instagram-platform/changelog)
- **[MEASURED]** Socialinsider describes views as "the equivalent of the old impressions metric", so they count repeat displays. It dates the switch to 2026, which conflicts with Meta's changelog. — [Socialinsider, Reels length](https://socialinsider.io/blog/instagram-reels-length/)
- **[PRIMARY]** (2025-12-18) Hashtags were capped at five per post or Reel; see section 4. — [SMT](https://www.socialmediatoday.com/news/instagram-implements-new-limits-on-hashtag-use/808309/)
- **[PRIMARY]** (2026-10-19, Mosseri) "We do not throttle the reach of AI content just for being AI content." Instagram wants AI-made content labelled, is planning more labels and wants creators to disclose AI use voluntarily. Mosseri is "very worried" about AI copies of creators' work. — [SMT, 2026-10-19](https://www.socialmediatoday.com/news/instagram-chief-says-stronger-ai-slop-prevention-is-needed/833416/)
- **[PRIMARY]** (2026-10-26) A limited US test began of three long-form features:
  - **Features:** videos up to 90 minutes.
  - **Clips:** up to eight Reels linked to a longer video.
  - **Series:** Reels grouped by topic, in testing since June 2026.
  — [SMT, 2026-10-26](https://www.socialmediatoday.com/news/instagram-rolls-out-limited-features-test-in-the-us/872825/)

### Inferences
- **The reach-versus-views conflict resolves by metric.**
  - Buffer and Metricool both measure unique accounts reached, and both put Reels ahead (+36% and +29% over carousels).
  - Carousels lead on views, which count repeat displays, so their view lead plausibly comes from the same people seeing them more than once.
  - Socialinsider's per-follower reach rate is nearly flat across formats (4.0-4.5%) and covers established brands only. It narrows the Reels lead for those accounts but does not contradict it.
  - For reaching non-followers, use Reels. For engaging people already reached, use carousels.
- **Use per-reach yardsticks, not per-follower ones.** For a new account, per-follower ER is noise because the follower count is tiny. Track ER per reach instead, which has a median of about 5.5% and about 6.9% for carousels (Buffer), and Mosseri's likes per reach and sends per reach.
- **Compare against education accounts, not media accounts.** Education-type accounts beat media accounts on Instagram (Rival IQ Higher Ed, Hootsuite Education carousels), while media accounts post about three times as often (about 13 per week against about 4). Evergreen, fact-led carousels resemble education content more than news output. The closest yardsticks are therefore the education figures (about 2.1% per follower, second-hand; carousels 5.4% on Hootsuite's scale), with Media's about 0.44% per follower as a floor.
- **Stories serve existing followers, not discovery.** Two facts point the same way: Stories ranking runs on closeness and viewing history, and Stories reach rate falls far below feed reach rate as accounts grow (Socialinsider).
- **Single images lose ground.** They lose reach and engagement YoY in Metricool, and per-follower ER in Socialinsider. They are the weakest default format in 2026.

### Gaps
- No 2025-26 dataset reports format performance for accounts under 1,000 followers.
- Rival IQ/Quid's 2026 report could not be opened. The 0.30% median is unverified, and the 2025 industry values come from aggregators who disagree with each other.
- No per-reach ER benchmark for media, publisher or education accounts comes from a source that states its formula. Hootsuite does not state its formula.
- No source gives shares (DM sends) per post by format. Socialinsider excludes saves and shares from ER as private metrics.
- Later's, Emplifi's and Dash Social's 2025-26 feed and Reels format benchmarks were not retrieved within the search budget of 12 searches.

## 2. Carousels: best slide counts, swipe-through, saves and shares; text-heavy educational carousels

### Takeaway
Carousels are the most reliable engagement and saves format in 2025-26 data. They have the highest ER per reach (6.9%, about 2.1x Reels), the highest per-follower ER, 9x the saves of single images, and the top format for education and nonprofit accounts.

Almost all slide-level guidance traces to **one Socialinsider study published in 2020**, under the old 10-slide cap:
- 10-slide carousels did best, at about 2.07% against about 1.7-1.9% for 2-4 slides.
- Engagement dipped after slide 3 and recovered at 8 or more slides.
- Mixed photo-and-video carousels scored highest (2.33%).
- A "swipe" prompt lifted ER from 1.83% to 2.0%.

No public data measures swipe-through or isolates text-heavy educational carousels. The best proxies are education-industry results, plus Instagram's guidance that captions should "offer useful information that viewers will want to save or share".

### Cited Findings

#### Current (2025-26) carousel performance
- **[MEASURED]** Carousels have the highest median ER per reach, at 6.9%: 109% more engagement per person reached than Reels (3.3%), and above single images (4.4%). The figures are 2025 medians. In the 2022-24 subset, carousels were 2.09x Reels and 1.55x single images. — [Buffer, Best Content Format 2026](https://buffer.com/resources/data-best-content-format-social-media/); [Buffer, State of Social Media Engagement 2026](https://buffer.com/resources/state-of-social-media-engagement-2026/)
- **[MEASURED]** Per follower, carousels scored 0.55% in 2024 and 2025 and 0.50% in Q3 2026, the highest of any format each time (67.5M posts). Saves per post are highest for carousels from 10K followers up: 8 against Reels' 7 at 10-50K, 35 against 22 at 50-100K, and 98 against 96 at 100K-1M. At 1K-5K followers, every format averages about 1 save. — [Socialinsider, 2026 Instagram Organic Benchmarks](https://www.socialinsider.io/social-media-benchmarks/instagram)
- **[MEASURED]** (24.4M posts, January-February 2025 vs 2026)
  - Carousels get 9x the saves of single images.
  - Carousel saves rose **+819%** YoY. That is implausibly large, and may reflect a change in a metric or in the sample.
  - Carousels average 27k+ views per post.
  - Instagram carousels get 4.7x the views and 5.8x the interactions of TikTok carousels.
  — [Metricool press release](https://metricool.com/press-release-instagram-study-2026/); [Metricool newsletter](https://newsletter.metricool.com/p/instagram-tell-me-your-goal-and-i-ll-tell-you-what-can-help)
- **[MEASURED]** (Rival IQ, 2025-02-25; 14 industries x 150 brands; per follower)
  - Carousels were the top Instagram post type overall.
  - They led for Higher Ed, Nonprofits, Financial Services, Food & Beverage, Alcohol and Influencers.
  - Financial Services brands posted Reels more than twice as often as carousels, yet carousels led their engagement.
  — [Rival IQ 2025](https://www.rivaliq.com/blog/social-media-industry-benchmark-report/)
- **[MEASURED]** (Hootsuite, 2026-04-14; formula not stated) Carousels are the best format overall (4.2%) and in Education (5.4%), Nonprofits (5.5%) and Entertainment & media (3.2%). — [Hootsuite](https://blog.hootsuite.com/social-media-benchmarks/)
- **[MEASURED] [CHANGED?]** (Socialinsider; 9,117,401 posts from 82,952 business pages; January-July 2023 data) Carousels are "the most effective content type for generating conversations". — [Socialinsider, caption length study](https://www.socialinsider.io/blog/instagram-caption-length/)

#### Slide count, mixed media and swipe prompts (2020 data, under the 10-slide cap)
- **[MEASURED] [CHANGED?]** (published 2020-08-30; Socialinsider, 22M+ posts including about 3M carousels; period and ER formula not stated)

  | Comparison | Result |
  |---|---|
  | Format ER | carousels 1.92%, images 1.74%, videos 1.45% |
  | Slide count | 10-slide carousels highest (above 2%); ER dipped after 3 slides and rose again at 8+ |
  | Slide-count usage | most carousels had 2-4 slides; only 6% used all 10 |
  | Media mix | mixed image + video 2.33% (7% of carousels); video-only 1.86%; image-only 1.80% (88%) |
  | Median comments | video-only 26, mixed 16, image-only 7 |
  | "Swipe" prompt | 2.0% with one vs 1.83% without (5% of carousels used one) |

  This was measured under the 10-slide cap and before Reels-first ranking, so treat it as directional only. — [Search Engine Journal on the Socialinsider study](https://www.searchenginejournal.com/instagram-carousels/379311/)
- **[MEASURED] [SNIPPET]** The study's PDF reportedly puts 10-slide carousels at 2.07%, 2-slide at 1.90% and 4-slide at 1.70%. — [Socialinsider, Instagram Carousel Study (PDF)](https://www.socialinsider.io/data-geeks/Instagram-Carousel-Study.pdf)

#### What Instagram says (relevant to fact and explainer carousels)
- **[PRIMARY]** (2026-08-23, Instagram guidance reported by SMT)
  - The strongest captions "tell a personal story or offer useful information that viewers will want to save or share".
  - Suggested calls to action: "Invite them to save for later" and "Direct them to a link in your bio."
  - Instagram suggested multiple captions for carousel posts to add context.
  — [SMT, 2026-08-23](https://www.socialmediatoday.com/news/instagram-stresses-the-importance-of-captions/828554/)
- **[PRIMARY]** (2023) Explore ranking predicts "likes, saves, and shares". (2025) Sends matter most for reaching non-followers. — [Instagram, Ranking Explained](https://about.instagram.com/blog/announcements/instagram-ranking-explained); [SMT, 2025-01-22](https://www.socialmediatoday.com/news/instagram-shares-algorithm-insights-2025/738034/)
- **[PRIMARY]** (creators.instagram.com, © 2026) Instagram's original-content guidelines:
  - **Counts as original:** overlaid text that does more than describe what is shown, narration, a storyline, or creative graphics that add information.
  - **Does not count:** borders, watermarks, speed changes, merely crediting the creator, or only a different caption.
  - **Consequence:** if an account mainly posts unoriginal Reels, photos or carousels, it is not recommended to new audiences.
  - **Recovery:** eligibility returns when recent posts are original for 30 days. Status shows under Account Status.
  — [Instagram, Original content guidelines](https://creators.instagram.com/original-content-guidelines)
- **[PRIMARY, headline only]** (2026-10-07) The Edits app gained carousel editing tools: video-editing features for carousel layouts, font changes and overlays. — [SMT](https://www.socialmediatoday.com/news/edits-app-gets-carousel-editing-tools/832448/)

#### Lore
- **[LORE] [SNIPPET]** "About 80% of a carousel's engagement comes from the opening frame", which a blog attributes to Mentionlytics without data. — [blog.mean.ceo](https://blog.mean.ceo/instagram-carousel-engagement-statistics/)

### Inferences
- **Saves and comments only count once there is an audience.** At 1K-5K followers, every format averages about 1 save and 1-3 comments per post (Socialinsider). Early on, a carousel's value is its higher ER per reach and its chance of being sent to non-followers, not saves.
- **On slide count, the only evidence favours many slides.** The 2020 data puts 8-10 slides ahead of 4-7. Nothing shows whether going beyond 10 helps.
- **Text-heavy fact carousels:**
  - Instagram counts informative overlay text as original.
  - Its caption guidance ("useful information... save or share", "save for later") fits evergreen explainers.
  - Sends drive non-follower reach, which favours slides that carry a surprising, forwardable fact.
  - These points come from primary statements; no measured data shows that text-heavy carousels perform differently from photo carousels.
- **Mixed media did best in 2020** (2.33%), so a carousel with one short video slide is worth testing. It is untested since 2020.

### Gaps
- No source found gives swipe-through or per-slide drop-off rates for carousels.
- No slide-count study after 2020 exists. The current maximum number of slides (reportedly raised from 10 to 20 in 2024) was not verified this session.
- No study isolates text-heavy or educational carousels from photo carousels.
- No source gives shares or sends per carousel.
- Common claim, not traced to any source: Instagram re-serves unswiped carousels starting at slide 2.

## 3. Reels: best lengths, opening seconds, on-screen text, captions and music; text-based or faceless Reels

### Takeaway
Reels are Instagram's reach format, and Instagram says they take more than half of time spent. They have the lowest ER per reach of any format (3.3%, Buffer).

On length, the best current data is Socialinsider's (9.8M Reels, January-June 2026):
- **45-60 seconds:** highest per-follower ER (0.35%) and highest median views (10,374).
- **Under 30 seconds:** the fewest views (4,700).
- **Up to 3 minutes:** a plateau.
- **Over 3 minutes:** a collapse (0.15%, 4,428 views).

Average watch time is only about **8.5 seconds** (Metricool 2026), and Instagram's top signals are watch time, likes per reach and sends per reach. The first seconds and shareability therefore matter most.

Instagram's own September 2026 guide says to:
- choose a length by purpose (3-15 seconds, 15-60 seconds, or 60 seconds to 3 minutes);
- be engaging "from the first second";
- use text overlays as a hook;
- add captions for accessibility.

Still photos can also be published as a slideshow Reel. No measured data exists on music, on-screen text, subtitles, or faceless and text-only Reels.

### Cited Findings

#### Length
- **[MEASURED]** (published 2026-07-14, updated 2026-10-20; 9,771,822 organic Reels from 295,475 profiles; January-June 2026; ER = (likes + comments) ÷ followers, averaged per post)

  | Length | ER per follower | Median views |
  |---|---|---|
  | 0-30 s | 0.28% | 4,700 |
  | 30-45 s | 0.30% | 8,564 |
  | 45-60 s | **0.35%** | **10,374** |
  | 60-90 s | 0.30% | 9,790 |
  | 90-120 s | 0.30% | 8,000 |
  | 120-180 s | 0.33% | 9,000 |
  | 180 s+ | 0.15% | 4,428 |

  The page does not split by account size, and its follower-range description is internally inconsistent. — [Socialinsider, Ideal Instagram Reels length](https://socialinsider.io/blog/instagram-reels-length/)
- **[LORE]** The same Socialinsider page says Reels can be up to 20 minutes long, but Reels over 3 minutes are not placed in the Reels tab. It cites only Instagram's Help Center, for the 20-minute limit. This conflicts with Instagram's own September 2026 guide, which says Reels run "from 3 seconds to 3 minutes". — [Socialinsider](https://socialinsider.io/blog/instagram-reels-length/); [SMT, 2026-09-28](https://www.socialmediatoday.com/news/instagram-shares-reels-creation-tips-in-new-guide/831551/)
- **[LORE] [SNIPPET]** Buffer's Reels-length page says Mosseri sees no "perfect" length. It adds that Reels under 90 seconds have "the highest chance of landing on the reels tab", while 90 seconds to 3 minutes suits deeper content with slightly lower reach. The attribution and the 90-second threshold are unverified. — [Buffer, Instagram Reels length](https://buffer.com/library/instagram-reels-length)

#### What Instagram says (length, hook, text, captions, audio)
- **[PRIMARY]** (2026-09-28, Instagram's Reels creation guide, reported by SMT)
  - **Length by purpose:**
    - 3-15 seconds for "quick transitions, trends, and short punchy lines".
    - 15-60 seconds for "tutorials, day-in-the-life clips, and most creative formats".
    - 60 seconds to 3 minutes for "longer storytelling, walkthroughs, and detailed how-tos".
  - **Hook:** make Reels "high-quality, original and engaging from the first second", and use text overlays to "create an opening hook" or highlight a detail.
  - **Captions:** add captions (subtitles) for accessibility even when text overlays are used.
  - **Still photos:** creators can upload multiple photos that play as a slideshow in the Reels feed.
  - **Distribution:** Reels that perform well can appear on Explore.
  — [SMT, 2026-09-28](https://www.socialmediatoday.com/news/instagram-shares-reels-creation-tips-in-new-guide/831551/)
- **[PRIMARY]** (2025-01-22, Mosseri) Watch time is the top signal, then likes per reach for followers and sends per reach for non-followers. — [SMT, 2025-01-22](https://www.socialmediatoday.com/news/instagram-shares-algorithm-insights-2025/738034/)
- **[PRIMARY] [CHANGED?]** (2023-05-31) Reels ranking predicts resharing, watching "all the way through", liking, and going "to the audio page". Watermarked, low-resolution and already-posted Reels are made less visible. — [Instagram, Ranking Explained](https://about.instagram.com/blog/announcements/instagram-ranking-explained)
- **[PRIMARY]** (creators.instagram.com, © 2026)
  - **Audio:** creators can add up to 20 audio tracks to a Reel, and should align text, stickers and clips visually with the audio.
  - **Trial Reels:** share a Reel with non-followers before followers, "to see which content performs best", or to "soft launch" new ideas.
  — [Instagram, Create engaging content](https://creators.instagram.com/create-engaging-content)
- **[PRIMARY]** (© 2026) Overlaid text that adds information, voiceover, narration and creative graphics count as original. Unoriginal accounts are not recommended to new audiences. — [Instagram, Original content guidelines](https://creators.instagram.com/original-content-guidelines)
- **[PRIMARY]** (2026-10-19, Mosseri) AI-made content is not throttled "just for being AI content", but Instagram wants it labelled. — [SMT, 2026-10-19](https://www.socialmediatoday.com/news/instagram-chief-says-stronger-ai-slop-prevention-is-needed/833416/)

#### Measured Reels behaviour (2025-26)
- **[MEASURED]** (Metricool; 24.4M posts, January-February 2025 vs 2026)
  - Average Reels watch time was **8.5 seconds**, more than double the year before.
  - Reels shares grew 67% YoY, the fastest of any format.
  - 65% of a Reel's views arrive in its first 3 days.
  - Instagram Reels get about 30% fewer views and 14% fewer interactions than TikTok videos on average.
  — [Metricool press release](https://metricool.com/press-release-instagram-study-2026/); [Metricool newsletter](https://newsletter.metricool.com/p/instagram-tell-me-your-goal-and-i-ll-tell-you-what-can-help)
- **[MEASURED]** (Rival IQ 2025) Reels were the top post type for Fashion, Home Decor, Retail and Travel. In Media, Reels earned more than 3x the engagement of video posts. — [Rival IQ 2025](https://www.rivaliq.com/blog/social-media-industry-benchmark-report/)
- **[MEASURED]** (Hootsuite, 2026-04-14) Entertainment & media Reels score 2.7%, against 3.2% for carousels; the formula is not stated. — [Hootsuite](https://blog.hootsuite.com/social-media-benchmarks/)

### Inferences
- **Length and attention pull in different directions.** 45-60 seconds maximised views and ER in the only large 2026 length study. Yet an average watch time of 8.5 seconds means most viewers leave within seconds. The opening line or frame decides most outcomes, whatever the length.
- **Format for a text-and-fact publisher without a presenter:**
  - Instagram's rules count photo-slideshow Reels and text-overlay Reels with narration as original.
  - Trial Reels can test them on non-followers without affecting followers.
  - There is no measured performance data for faceless or text-only Reels, so treat them as an experiment and judge by watch time and sends per reach.
- **Sends are the documented lever for non-follower reach**, which favours Reels built around one surprising, forwardable fact.

### Gaps
- Music and trending audio: no measured effect found. The only evidence is the primary "go to the audio page" prediction from 2023.
- On-screen text and burned-in subtitles: no measured data, only Instagram's recommendation.
- Faceless, text-only or AI-voiced Reels: no measured data, and no source compares them with on-camera Reels.
- Retention curves for the opening seconds: none public. The "3-second hook" rule is not supported by any source found; Instagram says "from the first second".
- Whether Reels longer than 3 minutes can be recommended: the sources conflict (see the length findings above).

## 4. Captions, hashtags, calls to action, posting times for a US audience, posting frequency and consistency

### Takeaway
**Hashtags:** capped at five per post since December 2025. Instagram says they help describe a post and aid search, not reach. The newest large dataset (Metricool, early 2026) found that posts with any hashtag got about 32% fewer views and about 34% fewer interactions than the platform average. That is a correlation; the older studies (2021-22) contradict each other and predate the cap.

**Captions:** they now matter mainly for search. Instagram's August 2026 guidance says to use descriptive keywords, put a hook in the first two lines and invite saves. The only measured data on caption length is old (2023: under 30 words did better) and conflicting.

**Calls to action:** asking a question was associated with 36.7% more comments, and comment-focused CTAs with 202.8% more (Metricool 2026). Replying to comments was associated with about 21% higher engagement (Buffer).

**Timing (audience local time):**
- **Buffer** (9.6M posts, 2024-25): best slots are Thursday 9 AM, Wednesday 12 PM and Wednesday 6 PM. Weekday evenings are strong. Friday, Saturday and 1-5 AM are worst.
- **Sprout** (November 2025 to February 2026): Tuesday and Wednesday afternoons are best, and weekends worst.

**Frequency:** within-account data (Buffer, 2.1M posts) shows that weeks with 3-5 posts lift follower growth about 2.2x as much as weeks with 1-2 posts. Higher tiers add more with diminishing returns, and weeks without a post are associated with losses.

### Cited Findings

#### Hashtags
- **[PRIMARY]** (2025-12-18) "Instagram will gradually update the number of hashtags that you can include in a caption for a reel or post to five."
  - Instagram's rationale: "We find that using fewer (up to 5) more targeted hashtags, rather than many generic ones..."
  - Many users had already been limited to three in a test.
  - SMT also cites earlier Mosseri statements, dated in the article only as "February" and "May": hashtags "don't work" to increase reach, but are "a great way to let people know what a post is about and connect posts".
  — [SMT, 2025-12-18](https://www.socialmediatoday.com/news/instagram-implements-new-limits-on-hashtag-use/808309/)
- **[SECONDARY] [SNIPPET]** (2025-12-19) Press coverage reports the limit was cut from 30 to five for both posts and Reels. — [Business Today](https://www.businesstoday.in/technology/news/story/no-more-hashtag-stuffing-instagram-limits-hashtag-usage-to-just-5-per-reel-and-post-507444-2025-12-19)
- **[MEASURED]** (Metricool; 24.4M posts, January-February 2025 vs 2026) Posts with at least one hashtag had **31.70% fewer views** and **33.89% fewer interactions** than the platform average. The comparison is against the platform average, not matched posts, so it is not causal. — [Metricool press release](https://metricool.com/press-release-instagram-study-2026/)
- **[MEASURED] [CHANGED?]** (Socialinsider, reported 2022-04-18; 75M+ posts, March 2021 to March 2022; ER by impressions)
  - The number of hashtags "does not influence post distribution" in any significant way.
  - The highest average, **3.41%**, came from posts with 3-4 hashtags.
  - For accounts with 5K-50K followers, 5-6 hashtags were associated with somewhat better impression rates.
  — [SMT on the Socialinsider study](https://www.socialmediatoday.com/news/new-report-highlights-that-instagram-hashtags-dont-significantly-increase/622260/)
- **[MEASURED] [CHANGED?]** (Later, reported 2021-11-19; 18M+ feed posts with no video, Reels or Stories; period not stated) Posts with 20 hashtags had the highest average reach rate, and posts with 30 the best engagement. Neither count is possible now. — [SMT on the Later study](https://www.socialmediatoday.com/news/new-study-looks-at-optimal-hashtag-usage-in-instagram-feed-posts-based-on/610377/)
- **[MEASURED] [SNIPPET]** (Fanpage Karma; 1.6M posts; date not seen) The reach sweet spot was 4-5 hashtags, and accounts using more than five lost reach (-3%). Fanpage Karma sells a hashtag tool. — [Fanpage Karma](https://www.fanpagekarma.com/insights/how-many-hashtags-should-you-use-on-instagram/)
- **[MEASURED]** (Rival IQ 2025) The top-engaging hashtags were topical or event tags: Media #funny, #film and #viral; Higher Ed #finalsweek, #collegelife and #graduation. These are correlations with seasonal or event posts. — [Rival IQ 2025](https://www.rivaliq.com/blog/social-media-industry-benchmark-report/)

#### Captions and keywords
- **[PRIMARY]** (2026-08-23, Instagram guidance reported by SMT)
  - "Captions add relevant context, spark conversation, and tell search engines what your content is about."
  - Use descriptive, relevant keywords, because Instagram search uses captions as reference data for discovery.
  - Only the first two lines show before "more", so lead with a question, a surprising fact or a teaser.
  - Use line breaks, emojis and short paragraphs.
  - The guidance gives no recommended length and does not say captions affect ranking.
  — [SMT, 2026-08-23](https://www.socialmediatoday.com/news/instagram-stresses-the-importance-of-captions/828554/)
- **[MEASURED] [CHANGED?]** (Socialinsider; 9,117,401 posts from 82,952 business pages; January-July 2023; ER per follower)
  - "Shorter captions (the ones below 30 words) usually lead to a higher engagement rate", and engagement tends to fall as captions lengthen.
  - Five CTA phrases were tested: "Read more", "Let us know in the comments", "Like if you..", "Check the link in bio" and "Available now". Their rates appear only in charts.
  — [Socialinsider, Instagram caption length](https://www.socialinsider.io/blog/instagram-caption-length/)
- **[MEASURED] [SNIPPET]** A cross-platform Socialinsider analysis found carousels with captions under 60 words performed best. 90+ words was the weakest band for every format, and caption length barely moved Reels results. — [Socialinsider, caption length best practices](https://www.socialinsider.io/blog/social-media-caption-length-best-practices/)
- **[MEASURED] [SNIPPET]** (PostPlanify, 2026; 4,408 posts, a small vendor sample) Feed-post engagement rose with caption length, peaking at 126-800 characters, and 51-125 characters was the weakest band. Reels were flat. This contradicts Socialinsider. — [PostPlanify](https://postplanify.com/blog/instagram-caption-length)

#### Calls to action and replies
- **[MEASURED]** (Metricool 2026) Posts that include a question get **36.70% more comments**, and posts with comment-focused CTAs get **202.78% more comments**. These are against the platform average, not matched comparisons. — [Metricool press release](https://metricool.com/press-release-instagram-study-2026/)
- **[MEASURED]** (Buffer, 2026-03-05; about 2M posts across six platforms)
  - Posts where the account replied to comments showed about a **21%** engagement lift, measured within the same account.
  - About 63% of Instagram profiles did better on posts where they replied.
  - Buffer says causality is unclear.
  — [Buffer, State of Social Media Engagement 2026](https://buffer.com/resources/state-of-social-media-engagement-2026/)

#### Posting times (audience local time)
- **[MEASURED]** (Buffer, published 2026-09-23)
  - **Sample:** 9.6M Instagram posts from a 52M+ post, 200K+ account study, January 2024 to December 2025.
  - **Method:** median ER = (likes + comments + shares + saves) ÷ followers × 100, with times normalised to the poster's local time and all formats pooled.
  - **Top slots:** Thursday 9 AM, Wednesday 12 PM, Wednesday 6 PM. The best days are Wednesday, then Thursday and Tuesday.
  - **Best hours by day:**

    | Day | Best hours | Day rating |
    |---|---|---|
    | Monday | 7 PM, 6 PM, 8 PM | Moderate |
    | Tuesday | 7 PM, 3 PM, 5 PM | High |
    | Wednesday | 12 PM, 6 PM, 8 AM | Highest |
    | Thursday | 9 AM, 8 AM, 7 AM | Highest |
    | Friday | 10 PM, 9 PM, 6 AM | Low |
    | Saturday | 9 PM, 10 PM, 8 PM | Low |
    | Sunday | 9 PM, 10 PM, 8 PM | Moderate |

  - **Worst:** 1-5 AM every day; Friday and Saturday overall; weekday mornings from 6 to 11 AM, except Thursday 7-9 AM.
  - **Format guidance** (not measured separately): Reels in the evening (6-11 PM); carousels on Wednesday at 12 PM or 6 PM, or Thursday at 9 AM; 1-2 Stories a day.
  - **Inconsistencies:** some chart captions say "median video views" rather than ER, and the Saturday and Sunday slot lists are identical.
  — [Buffer, Best time to post on Instagram](https://buffer.com/resources/when-is-the-best-time-to-post-on-instagram/)
- **[MEASURED]** (Buffer, 2026-03-05) The engagement report suggests 6-9 PM on weekdays, but also says Thursday 9 AM is the peak; the page does not reconcile the two. — [Buffer, State of Social Media Engagement 2026](https://buffer.com/resources/state-of-social-media-engagement-2026/)
- **[MEASURED]** (Sprout Social, updated 2026-03-31)
  - **Sample:** nearly 2B engagements across about 307K profiles from 30,000+ customers, spread over six networks, from 2025-11-27 to 2026-02-27, in the audience's local time.
  - **Instagram windows:**

    | Day | Best window |
    |---|---|
    | Monday | 2-4 PM |
    | Tuesday | 1-7 PM |
    | Wednesday | 12-9 PM, plus 11 PM |
    | Thursday | 12-2 PM |
    | Friday | no significant peak |
    | Saturday | lowest engagement of the week |
    | Sunday | among the worst days |

  - **Worst:** a weekday "dead zone" from 3 to 7 AM.
  - Sprout says Reels follow the same windows.
  - **Education** is given as Tuesday and Wednesday at 11 AM in the text, but the industry table is broader, so the two conflict.
  - **Nonprofits:** Tuesday to Thursday, 11 AM to 4 PM.
  - Media is not covered.
  — [Sprout Social, Best times to post on Instagram](https://sproutsocial.com/insights/best-times-to-post-on-instagram/)
- **[PRIMARY]** (2026-09-24, Mosseri) Recency "matters a lot". The feed is "roughly in chronological order", and newer posts get more exposure. — [SMT, 2026-09-24](https://www.socialmediatoday.com/news/instagram-chief-shares-algorithm-insights-and-posting-tips/831326/)
- **[MEASURED]** (Metricool 2026) 65% of a Reel's views and 76% of a regular post's views arrive in the first 3 days. — [Metricool newsletter](https://newsletter.metricool.com/p/instagram-tell-me-your-goal-and-i-ll-tell-you-what-can-help)

#### Posting frequency and consistency
- **[MEASURED]** (Buffer, published 2025-08-13)
  - **Sample:** about 2.1M feed posts (photos, Reels and carousels; Stories excluded) from about 102K accounts. The period is not stated.
  - **Method:** a fixed-effects model that compares each account with its own baseline in weeks when it posts more, alongside z-scores against the account's own growth.
  - **Estimated rise in weekly follower growth rate by posting tier:**

    | Posts per week | Growth-rate rise | vs 1-2 posts | Reach per post vs 1-2 posts |
    |---|---|---|---|
    | 1-2 | +0.12% | baseline | baseline |
    | 3-5 | +0.26% | about 2.2x | +12% |
    | 6-9 | +0.44% | about 3.7x | +18% |
    | 10+ | +0.66% | about 5.5x | +24% |

  - **Z-scores:** -0.08 in weeks with no posts (the "no-post penalty"), 0.00 at 1-2 posts, 0.07 at 3-5, 0.11 at 6-9 and 0.14 at 10+.
  - **Recommendation:** 3-5 posts a week as the sustainable sweet spot, with 1-2 as the minimum. Treat 6-9+ "with caution" for full-time creators.
  - No breakdown by format is given.
  — [Buffer, How often to post on Instagram](https://buffer.com/resources/how-often-to-post-on-instagram/)
- **[MEASURED]** (Buffer, 2026-03-05) The top 10% of accounts by weekly engagement post more often than the median account. The gap is smaller and less consistent on Instagram than on text-first platforms. — [Buffer, State of Social Media Engagement 2026](https://buffer.com/resources/state-of-social-media-engagement-2026/)
- **[MEASURED]** (Socialinsider, 2025 data) The average business account posted 8 Reels, 5 carousels and 7 images a month, about 4.6 posts a week. In 2024 it was 6 Reels, 4 carousels and 10 images. — [Socialinsider, 2026 Instagram Organic Benchmarks](https://www.socialinsider.io/social-media-benchmarks/instagram)
- **[SECONDARY]** (Rival IQ 2025, as transcribed by an aggregator) Media posts 13.03 times a week, Higher Ed 4.07 and Nonprofits 4.18. — [Apaya](https://apaya.com/blog/social-media-benchmarks)
- **[MEASURED]** (Hootsuite, 2026-04-14; formula not stated) The highest overall ER came at 2 posts a week (4.04%). Industry peaks sit at much higher volumes: Education 28 a week, Nonprofits 25, Entertainment & media 13. This is internally hard to reconcile. — [Hootsuite](https://blog.hootsuite.com/social-media-benchmarks/)
- **[PRIMARY]** (2026-09-24, Mosseri) Creators tend to post as much as they can to improve the odds of a hit, while managing their time to avoid burnout. Mosseri encourages experimenting, including with Trial Reels. — [SMT, 2026-09-24](https://www.socialmediatoday.com/news/instagram-chief-shares-algorithm-insights-and-posting-tips/831326/)

### Inferences
- **US time converted to IST.** From 2026-11-01 to 2027-03-14 the US Eastern zone is on standard time, so ET = IST - 10h30.

  | US slot (ET) | IST |
  |---|---|
  | Thursday 9:00 AM (Buffer #1) | Thursday 7:30 PM |
  | Wednesday 12:00 PM (Buffer #2) | Wednesday 10:30 PM |
  | Wednesday 6:00 PM (Buffer #3) | Thursday 4:30 AM |
  | Sprout's weekday midday windows | about 10:30 PM to 12:30 AM IST |

  - The 9:00 PM IST slot used for X is 10:30 AM ET and 7:30 AM PT. That falls in Buffer's weak weekday-morning band (except Thursday) and outside Sprout's windows.
  - For Instagram, 10:30 PM to 12:30 AM IST (12-2 PM ET) matches both datasets. Thursday 7:30 PM IST also works.
  - After 2027-03-14 every slot moves one hour earlier in IST.
- **Timing is a second-order lever.** Neither timing study reports how much the best slots beat average ones. Format, the hook and sends are better-documented levers. Sprout's window also covers the holiday season, which may bias it.
- **Thirty carousels in a month is about 7 posts a week**, Buffer's 6-9 tier: more growth on average than 3-5 posts, with diminishing returns. Consistency matters, because weeks with no posts carry a measured penalty.
- **Use hashtags as labels.** 3-5 specific, topical tags help Instagram classify a post and serve search, but expect no reach gain. Every measurement of large hashtag counts was made before the cap.
- **Write captions for search.** A keyword-bearing first line that states the fact or question doubles as the hook in the two-line preview. Close with an invitation to save, or a question to draw comments.

### Gaps
- Neither Buffer nor Sprout gives the size of the gap between best and average posting times.
- No large 2025-26 caption-length study with a stated method was found; the evidence is the 2023 Socialinsider data against a small 2026 vendor sample.
- No matched-post study after the cap compares 0 hashtags with 1-5.
- A widely repeated claim that Mosseri recommends about 2 Reels plus 3-5 feed posts a week could not be traced to a primary statement. Neither could the claim that DM sends weigh 3-5x as much as likes; Instagram publishes no signal weights.
- No study separates consistency (a regular schedule) from volume, apart from Buffer's no-post penalty.

## 5. Follower-growth benchmarks for small and new accounts

### Takeaway
Socialinsider's 2025 averages put the smallest business accounts (1K-5K followers) at about **22% growth for the year**, down from 38% in 2024. Larger tiers grew 11-20%.

The average hides a skew. **Metricool found only 21% of accounts under 10,000 followers grew at all** in early 2026, so a minority carries the average.

Other benchmarks:
- **Hootsuite's 2026 benchmark** gives follower growth as 1.37% overall, labelled weekly: Entertainment & media 1.82% and Nonprofits 0.62%. The scale suggests it is actually monthly.
- **Buffer's within-account data:** posting more in a given week raises growth that week, and weeks without posts are associated with losses.

No benchmark covers brand-new accounts with fewer than 1,000 followers. Instagram's stated mechanisms for small accounts are "breaking content" tests with non-followers and Trial Reels.

### Cited Findings
- **[MEASURED]** (Socialinsider, page dated 2026-02-20; 67.5M posts from about 579K business accounts; the growth definition is not stated and is presumably annual and averaged) Audience growth rate by tier, 2024 to 2025:

  | Tier | 2024 | 2025 |
  |---|---|---|
  | 1K-5K | 38.00% | **22.00%** |
  | 5K-10K | 35.00% | 20.29% |
  | 10K-50K | 33.80% | 17.20% |
  | 50K-100K | 30.00% | 13.62% |
  | 100K-1M | 27.00% | 11.25% |

  — [Socialinsider, 2026 Instagram Organic Benchmarks](https://www.socialinsider.io/social-media-benchmarks/instagram)
- **[MEASURED]** (Metricool, 2026-06-16; 24.4M posts from 375K accounts; January-February 2025 vs 2026) "Only 21% of accounts under 10,000 followers grew in 2026." The definition of "grew" is not given. — [Metricool press release](https://metricool.com/press-release-instagram-study-2026/)
- **[MEASURED]** (Hootsuite, 2026-04-14; sample and period not stated) Instagram follower growth rate, labelled weekly:
  - overall 1.37%;
  - Entertainment & media 1.82%;
  - Nonprofits 0.62%;
  - Financial services 2.26%;
  - Government 2.17%;
  - Technology 0.68%;
  - Education not reported for Instagram.
  — [Hootsuite](https://blog.hootsuite.com/social-media-benchmarks/)
- **[MEASURED]** (Socialinsider, Jan 2025-Aug 2026) Smaller accounts reach a larger share of their followers per post: 6.65% at 1-5K against 3.50% at 100K-1M. — [Socialinsider, reach study](https://www.socialinsider.io/blog/social-media-reach/)
- **[MEASURED]** (Buffer, 2025-08-13; about 2.1M posts, 102K accounts, fixed effects)
  - Estimated weekly follower-growth rate rises with posting tier: +0.12% at 1-2 posts, +0.26% at 3-5, +0.44% at 6-9 and +0.66% at 10+.
  - Reach per post also rises with frequency (+12% to +24% against 1-2 posts).
  - Weeks with no posts sit below the account's baseline (z = -0.08).
  — [Buffer, How often to post on Instagram](https://buffer.com/resources/how-often-to-post-on-instagram/)
- **[PRIMARY]** (2026-09-24, Mosseri) "Breaking content" is one of four ranking principles: Instagram shows posts from small creators to non-followers to gauge the response, in order to boost new creators. Originality is prioritised over reposts. — [SMT, 2026-09-24](https://www.socialmediatoday.com/news/instagram-chief-shares-algorithm-insights-and-posting-tips/831326/)
- **[PRIMARY]** (© 2026) Trial Reels go to non-followers first, so new ideas can be soft-launched. — [Instagram, Create engaging content](https://creators.instagram.com/create-engaging-content)
- **[PRIMARY]** (© 2026) Accounts that mainly post unoriginal content are not recommended to new audiences. Eligibility returns after 30 days of original posts. — [Instagram, Original content guidelines](https://creators.instagram.com/original-content-guidelines)
- **[PRIMARY]** (2025-01-22) Sends per reach is "slightly more important" for unconnected content, meaning reach to non-followers. That makes shares the stated growth signal. — [SMT, 2025-01-22](https://www.socialmediatoday.com/news/instagram-shares-algorithm-insights-2025/738034/)

### Inferences
- **Growth is skewed, so set targets from the median, not the average.** Socialinsider's 22% a year for 1K-5K accounts is an average, about 1.7% a month. Since only about one in five sub-10K accounts grew at all in Metricool's comparison, the typical small account probably stagnates. A target of "average" growth is optimistic without an above-average format mix and cadence.
- **Hootsuite's figure is probably monthly, not weekly.** Compounded weekly, 1.37% would mean about 100% growth a year, which is implausible next to Socialinsider's 11-22% annual figures for brands. It is consistent with a monthly figure, so treat it as unverified.
- **For a brand-new account, these levers are documented:**
  - **Reels and Trial Reels** for non-follower reach; Reels win on unique reach (sections 1 and 3).
  - **Shareable content**, because sends matter for non-followers.
  - **Steady 3-5+ posts a week**, because no-post weeks carry a penalty.
  - **Originality**, because unoriginal accounts are excluded from recommendations.
  Carousels convert the people reached into engagement.

### Gaps
- No public benchmark covers accounts from 0 to 1,000 followers, or how long new accounts take to reach 1K. Every benchmark dataset either starts at 1K followers or states no floor.
- Socialinsider does not say whether its growth rates are annual or whether they are means or medians. Hootsuite's period label (weekly) is doubtful.
- No 2025-26 source quantifies follower growth from Collab posts or Trial Reels.
- Unverified secondary claims: "Your Algorithm" launched in December 2025 (Mosseri mentions the feature in September 2026, but the launch date was not confirmed), and an April 2026 update prioritising original content (reported only by a single market-intelligence page).
