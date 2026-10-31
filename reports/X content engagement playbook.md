# Win X Through Conversation, Not Broadcasting

On X in 2025-2026, a brand-new account earns likes, replies, reposts and follows less through the format of its posts than through what surrounds them: a self-contained, surprising and true claim that strangers like within its first two hours, an account that answers the people who reply, and a follower base built by hand in other accounts' reply sections. Measured format gaps are small (Buffer's 2025 medians put engagement at **3.56% for text, 3.40% for images, 2.96% for video and 2.25% for links**), while the gap a new free account faces is large: free accounts' median post drew **under 100 impressions** and, since March 2025, no likes, replies or reposts at all, against about **ten times the reach** for Premium accounts, a correlation nobody has shown to be causal. X's open-sourced 2026 ranker shows where traction comes from, weighting a predicted reply at about **7.6 likes**, a reply between mutual follows or a copy-link share at about **30** and a follow at about **6**, while a "not interested" tap or a mute counts against a post at roughly **80-90 likes**; each fresh post from a small account also gets a cold-start trial decided by its early like rate. Graduated access limits how far a new account reaches beyond its followers, not what its followers see, and every documented zero-to-traction story was a person replying by hand every day, never a brand, so the plan for @strictlyfyi keeps the 30 checked, link-free, date-pegged texts but posts them at **10:30 a.m. New York (21:00 IST)**, makes text-only the default while testing the title card on alternate days, and adds a weekday second post, quote posts and single trials of threads, a four-image post and polls. Scheduling stays by hand in X's free composer until a roughly $1-a-month API app is worth building in December, and Premium waits for a day-15 purchase of the cheapest reply-prioritization tier, made only if the owner has kept up about an hour of hand engagement each evening. A reasonable day-30 target is a lifted gate, a median above 200 impressions per post and 50-150 followers; virality cannot be scheduled, and an automation flag or a wrong fact would cost more than any post can earn.

## Format gaps are small next to the free-account reach gap

The biggest measured driver of reach on X in 2025 was the account's tier, not the format of the post. Buffer tracked **18.8 million posts from 71,000 accounts** from August 2024 to August 2025. Median impressions per post were "typically under 100" for free accounts, "closer to 600" for Premium and "over 1,550" for Premium+. Free accounts' median engagement rate fell from about 0.15% to **0% by March 2025**, so at least half of their posts drew no like, reply or repost at all ([Buffer](https://buffer.com/resources/x-premium-review/)). Three limits apply. Buffer offers no controlled analysis, the panel predates X's January 2026 ranking rebuild, and subscribers may simply run more active accounts. The tenfold gap is therefore a strong association, not a price list for reach, but it is the baseline @strictlyfyi starts from. Outcomes are also extremely skewed. Across 1.7 million posts, half of X posts drew **four or fewer engagements**, while the mean was 328 ([Buffer](https://buffer.com/resources/x-threads-bluesky-data/)). Medians are the honest yardstick, and a handful of hits will produce most of any account's totals.

Format differences are modest, and their direction depends on who is measured:

| Dataset | Accounts measured | Result |
|---|---|---|
| Buffer 2025 medians, per reach ([source](https://buffer.com/resources/data-best-content-format-social-media/)) | All accounts | Text 3.56%, images 3.40%, video 2.96%, links 2.25% |
| Buffer, August 2025 ([source](https://buffer.com/resources/links-on-x/)) | Free accounts | Text about 0.40%, video 0.25%, images 0.20%, links 0% |
| Ordinal, January 2024 to May 2026 ([source](https://www.tryordinal.com/blog/twitter-x-engagement-data-study)) | Mostly B2B accounts | Images had the higher rate (0.79% vs 0.68%), but text drew almost twice the average impressions (35,975 vs 18,334) |
| Adilo, 3,200 posts ([source](https://adilo.com/blog/x-engagement-rate-chart-2025/)) | Creators, brands and advertisers | Images had the higher median, text the higher average |
| Rival IQ, per follower ([source](https://get.rivaliq.com/hubfs/eBooks/2025-Social-Media-Industry-Benchmark-Report.pdf)) | Brands with at least 5,000 followers | Photos led in 7 of 14 industries, video in 4 |

Peer-reviewed work on Twitter found that the image advantage came mostly from professionally shot pictures that fit the text ([Li & Xie](https://doi.org/10.1177/0022243719881113)). For a small free account, the defensible reading is text first, with an image only when it carries the fact. Video is no reliable lift: it ranks third in Buffer's medians, X set the ranking weight on video quality views to zero on 25 August 2026 ([param.rs history](https://github.com/xai-org/x-algorithm/commits/main/home-mixer/params/param.rs)), and X's head of product said reposted clips that carry another platform's watermark lose **90% of their impressions** ([Social Media Today](https://www.socialmediatoday.com/news/niemanlab-offers-advice-for-posting-news-on-x/817383/)).

Threads, polls, multi-image posts, GIFs, long posts and X Articles have **no rigorous 2024-2026 measurement**. The multipliers in circulation, such as 2.1 times for threads and 2-3 times for polls, come from a vendor that discloses no sample ([SociaVault](https://sociavault.com/blog/twitter-x-engagement-declining-2026-data)). Quote posts have older, peer-reviewed support. Across 204,905 tweets from 53 advocacy organisations over 12 years, quote tweets reached peak engagement about **three times** as readily as plain tweets ([Ng et al.](https://aging.jmir.org/2024/1/e49608)).

Links finish last in every dataset that measured them, although X denies penalising them. Nikita Bier, then X's head of product, called the penalty claim "Fake news" in April 2026 ([Roboin](https://roboin.io/article/en/2026/04/13/x-denies-link-deboost-recommends-in-post-links/)), and in July 2026 Musk said "We haven't for over a year" ([Free Press Journal](https://www.freepressjournal.in/amp/tech/x-product-head-nikita-bier-confirms-link-penalty-removed-over-a-year-ago-tells-mark-zuckerberg-he-can-post-them-directly)). The 2026 code agrees with them: opening a link carries a small positive weight and nothing demotes URLs ([param.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/params/param.rs)). A vendor that compared link and no-link posts within each of 60 mostly small accounts in 2026 also found about the same impressions ([OpenTweet](https://opentweet.io/answers/does-x-penalize-links-2026)). X explains the weak numbers as substitution: people who tap out to a link "forget to Like or Reply" ([Social Media Today](https://www.socialmediatoday.com/news/x-formerly-twitter-testing-links-in-app-link-post-penalties/803176/)). Either way, a link post gives up the engagement that @strictlyfyi is after.

Hashtags no longer help. X Business tells organic posters to "avoid using hashtags in your Post copy" ([X Business](https://business.x.com/en/basics/organic-best-practices)). The 2026 code reads hashtags only for a spam class, `SpamHashTagAbuse` ([Grox policy classes](https://github.com/xai-org/x-algorithm/blob/main/grox/flows/ptos/state.py)).

On length, the only recent figure is Ordinal's finding that 100-200-character posts did best, with no rates given ([Ordinal](https://www.tryordinal.com/blog/twitter-x-engagement-data-study)). X's own advice is that a post "should stand alone as great content" ([NiemanLab](https://www.niemanlab.org/2025/10/x-makes-overtures-to-journalists-with-new-feature-designed-to-improve-reach-for-links/)).

The two big timing studies agree on days but disagree on hours. Buffer measures engagement rate and Sprout measures engagement volume, which is the likeliest reason for the split.

| Study | Best | Worst |
|---|---|---|
| Buffer ([source](https://buffer.com/resources/best-time-to-post-on-twitter-x/)) | **Tuesday 9 a.m.**; each day's three best hours fall between 8 and 11 a.m. local time | Saturday; a sharp drop from 6 to 11 p.m. |
| Sprout Social: nearly 2 billion engagements, November 2025 to February 2026 ([source](https://sproutsocial.com/insights/best-times-to-post-on-Twitter/)) | **Noon to 6 p.m.**, Tuesday to Thursday | Saturday |

No study tests posting frequency within X accounts. Cross-sectional data show that high-volume publishers earn least per post. Media brands averaged 49.9 tweets a week at a median 0.006% engagement per follower, the lowest of any industry that tweets weekly ([Rival IQ](https://get.rivaliq.com/hubfs/eBooks/2025-Social-Media-Industry-Benchmark-Report.pdf)). That does not show that extra posts lower total engagement. Curated fact accounts have built large audiences at a modest pace: Wonder of Science gained 445,000 followers in the year to June 2022 while posting about ten times a week ([Social Blade capture](https://web.archive.org/web/20220619123008/https://socialblade.com/twitter/user/wonderofscience)).

## The 2026 ranker pays for replies, sends and early likes

X rebuilt its For You ranking around a Grok-derived transformer called Phoenix and published the code in January 2026. Default weights were added on 13 August 2026 and last synced on 30 October ([README](https://github.com/xai-org/x-algorithm); [param.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/params/param.rs)). A post's score is the sum of each predicted action's probability times its weight. The weights therefore show how much X values each action per unit of likelihood, not how many likes a reply is "worth". The code warns against that reading itself, noting that a report is more than 1,000 times rarer than a like. The weights changed five times between 13 August and 14 October, and production values can differ from these defaults ([param.rs history](https://github.com/xai-org/x-algorithm/commits/main/home-mixer/params/param.rs)).

| Predicted action | Weight (30 Oct 2026) | Relative to a like | What tends to earn it (inference) |
|---|---|---|---|
| Share via copy link | 20.0 | ~30x | A fact worth carrying into another conversation |
| Reply, when viewer and author follow each other | 5.0 + 15.0 | ~30x | Conversation among mutual follows |
| Reply | 5.0 | ~7.6x | An answerable question or a moderately debatable claim |
| Quote | 5.0 | ~7.6x | A crisp claim others can add to |
| Share via DM | 5.0 | ~7.6x | Practical value: "send this to someone" |
| Follow author | 4.0 | ~6x | A post or reply that promises more of the same |
| Repost | 1.0 | ~1.5x | Social currency: looking "in the know" |
| Like | 0.66 | 1x | An instant reward in the first line |
| Open link | 0.2 | ~0.3x | — |
| Profile click; video quality view | 0.0 | 0 | — |
| Block author | −31.2 | ~−47x | Irritation |
| Not interested | −52.272 | ~−79x | Off-topic, repetitive or bait-like posts |
| Mute author | −58.8 | ~−89x | Repeated irritation |
| Report | −234.0 | ~−355x | Abuse or spam |

Three mechanics decide whether a zero-follower account is seen at all.

The first is a **cold-start lane**. An original post (not a reply or repost) whose author has 50,000 followers or fewer, and which is under two hours old with fewer than 200 home-timeline views, can be lifted to about **position 15-16** of a viewer's feed ([author_cold_start.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/scorers/author_cold_start.rs); [param.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/params/param.rs)). The winners are chosen by sampling on each post's **likes per home view**, starting from a prior that assumes a 1.5% like rate. In this lane the like, worth little in the main score, is the deciding signal. An illustration from the published prior: a post with three likes from its first 40 home views gets an estimated like rate near 4%, almost three times the prior, while a post with none falls below 1%. A post's first two hours, and whether its opening line rewards a stranger, matter more than anything that happens later. Posts older than 48 hours drop out of For You entirely ([README](https://github.com/xai-org/x-algorithm)).

The second is that **reach beyond followers goes almost entirely to original posts**. For You filters out replies and reposts from accounts the viewer does not follow and multiplies other posts from non-followed accounts by 0.75. It also scales an author's second and third posts in one feed to about 0.63 and 0.44 of their score, down to a floor of 0.25 ([README](https://github.com/xai-org/x-algorithm); [vm-ranker params](https://github.com/xai-org/x-algorithm/blob/main/vm-ranker/params.rs)). Replies therefore grow an account through the people who read a thread and tap through to the profile, not through algorithmic distribution.

The third is a **mutual-follow premium**. Since July 2026, when a viewer and a post's author follow each other, a predicted reply to the author's original post is weighted 20 instead of 5. X shipped the change after World Cup fans complained that they were missing discussion among people they knew ([bidirectional boost note](https://github.com/xai-org/x-algorithm/blob/main/docs/BIDIRECTIONAL_BOOST_CHANGE.md)). Each mutual follow the account earns therefore makes that person's future replies count four times over. Even the Following tab now runs through the ranked pipeline, so followers do not see posts in time order ([author_cold_start.rs](https://github.com/xai-org/x-algorithm/blob/main/home-mixer/scorers/author_cold_start.rs)).

The rest of the code points the same way. **Attention gained weight through the autumn**: the dwell weight rose from 0 to 0.05 and the click-through dwell weight from 0 to 0.4. On 13 October, retrieval was retrained "to surface posts that people read all the way through". Meanwhile **"not interested" became 21% heavier** in two months, reaching −52.3 ([README](https://github.com/xai-org/x-algorithm); [param.rs history](https://github.com/xai-org/x-algorithm/commits/main/home-mixer/params/param.rs)). Offline jobs label accounts by the blocks and reports their posts collect relative to likes, and those labels can drop an account's posts for non-followers ([README](https://github.com/xai-org/x-algorithm)). **Paid status, by contrast, no longer boosts For You scores.** The 2023 code multiplied blue-verified authors' scores by 4 in-network and 2 out-of-network ([2023 code](https://github.com/twitter/the-algorithm/blob/ef4c5eb65e6e04fac4f0e1fa8bbeff56b75c1f98/home-mixer/server/src/main/scala/com/twitter/home_mixer/param/HomeGlobalParams.scala)). Those multipliers are missing from X's September 2025 legacy update and from the 2026 scorer, where the only verified-author input found sits in the model that ranks replies ([reply model](https://github.com/xai-org/x-algorithm/blob/main/phoenix/xrex/models/recsys_reply_two_tower_v2_model.py)).

Read against the owner's four goals, the code gives each one a different job. **Likes** are the cheapest to earn and they decide the cold-start trial, so a post's first line must reward a stranger at once. **Replies** are the heaviest common signal. People give them to questions they can answer and claims they want to discuss, and they count four times more among mutual follows. **Reposts, quotes and sends** follow usefulness. A copy-link share is the heaviest positive action of all, which favours facts that settle an argument going on somewhere else. **Follows** (weight 4) come when a post or a reply promises more of the same, which is why they arrive mostly through replies and profile visits rather than through broadcasts.

## A gated account grows from other people's reply sections

New accounts start behind an undocumented trust gate. In December 2022, Twitter was reported to be building "Graduated Access", "a set of perks that Twitter only unlocks when they're confident the user is a human". The perks included more discoverable content and appearing "in search results and trends" ([Jane Manchun Wong](https://x.com/wongmjane/status/1601871343099805696)). X has never published the gate's criteria or how long it lasts. Forum users who trade in new accounts report it lifting after "a couple of days" to "a few weeks" of normal manual use ([BlackHatWorld](https://www.blackhatworld.com/seo/how-to-fix-twitter-authentic-flag.1817536/)). X's Help Center says trends are filtered against "an author account with a low number of followers, bots, and newly created accounts" ([X Help](https://help.x.com/en/resources/recommender-systems/trends-recommendations)). The 2026 code's visibility rules can drop a post recommended to non-followers, while "the same post is allowed to a follower" ([README](https://github.com/xai-org/x-algorithm)).

This leads to the most important practical point in this report: **while the account is gated, its dependable audience is its followers**. The first weeks are for earning followers, not for polishing posts.

Followers come from other people's conversations, and X ranks those conversations against a free account. X sorts replies into three bands: "Replies from accounts viewer follows and root author has replied to; Verified accounts; Everyone else". Each band is ordered by predicted engagement, and the reply cache keeps only the 3,200 most recent replies, or the top 800 in larger threads ([X Help](https://help.x.com/en/resources/recommender-systems/conversations-recommendations)). A free account's reply under a mega-account's post therefore sits below every subscriber's reply and is unlikely to be seen. The free lever is getting the original author to answer, which X lists as a reason to rank a reply higher. That is likeliest under mid-sized accounts, early in a post's life. The paid lever is "reply prioritization", which X sells at every tier: "larger" for Premium and "the largest" for Premium+ ([X Help](https://help.x.com/en/using-x/x-premium)). It now also covers subscribers to the Plus, Premium, Super and Ultra plans of The X Subscription, launched on 12 October 2026 ([xAI](https://x.ai/news/x-subscription)). It is the only documented ranking benefit of paying.

The documented zero-to-traction stories all follow this route, all describe people rather than brands, and all are self-reported. **Tom Butler** reached about 66 followers after one week, 135 after two and **470 after ten** by following, liking and replying to small accounts, which are "much more likely to see your replies and follow you back" ([Tom Butler](https://x.com/tomlbutler/status/1923972320973967595)). A 2026 Indie Hackers post reports **560,000 impressions in ten days** for a new account that replied to larger accounts within 30-60 minutes of their posts ([Indie Hackers](https://www.indiehackers.com/post/zero-followers-high-reach-how-to-get-impressions-on-x-in-2026-1dd99f725d)). A 2023 account grew from about 200 to 20,000 followers in 59 days. It posted 10-15 times a day, replied under similar accounts with 50,000+ followers, had several million-view posts, and spent "at least 3-4 hours a day on X" ([pozoe](https://pozoe.substack.com/p/how-i-grew-a-twitterx-account-to)). No brand or publisher case with verifiable numbers was found for 2024-2026, and none under the 2026 enforcement regime. A realistic pace for a brand spending an hour a day in month one is tens of followers a week.

Communities are the one documented way to put a post in front of an interested audience that does not yet follow the account. X says Community posts are "shared with Community members, your followers, and other X users". They appear on the Community page, in global search, on the profile and "in other timelines" ([X Help](https://help.x.com/en/using-x/communities)). The only fitting Community confirmed from outside the app is **History on X, with about 65,400 members** ([History on X](https://x.com/i/communities/1691711931751534664)). Science and trivia Communities have to be found inside the app. Nobody has measured how far Community posts travel compared with ordinary posts.

The rules hardened in 2026. X forbids automated likes, automated follows and replies triggered by keyword searches. It says "non-API-based forms of automation, such as scripting the X website" "may result in the permanent suspension of your account" ([X automation rules](https://help.x.com/en/rules-and-policies/x-automation)). Its developer guidelines say browser automation "results in permanent suspension", while allowing scheduled posting through the API ([X Developer Guidelines](https://docs.x.com/developer-guidelines)). Bier warned in February 2026 that "If a human is not tapping on the screen, the account and all associated accounts will likely be suspended—even if you're just experimenting" ([Bier](https://x.com/nikitabier/status/2022496540275937525?lang=en)). In July 2026 he said that accounts soliciting engagement three or more times would be removed from revenue sharing and referred for suspension, and about 4,000 accounts were removed that day ([Bier](https://x.com/nikitabier/status/2077774853650944028)). The published ceilings sit far above anything a careful plan needs: 400 follows a day, and reportedly 50 original posts and 200 replies a day for unverified accounts ([X Help: following](https://help.x.com/en/using-x/x-follow-limit); [X Help: limits](https://help.x.com/en/rules-and-policies/x-limits)).

## Surprising, true and useful beats outrage for a fact brand

Accuracy does not buy reach by itself, but the research on sharing gives true facts a clear playbook. The largest Twitter study covered about 126,000 stories from 2006 to 2017. Falsehoods were **70% more likely to be retweeted** than the truth and reached 1,500 people about six times faster, largely because they were more novel ([Vosoughi et al.](https://politics.media.mit.edu/papers/Vosoughi_Science.pdf)). A reanalysis found that the structural differences disappear when cascades of the same size are compared: false stories were more infectious, not spread differently. A true story that is just as interesting travels the same way ([Juul & Ugander](https://pmc.ncbi.nlm.nih.gov/articles/PMC8609637/)). People share what is interesting if true and what they judge accurate ([Altay et al. 2021](https://doi.org/10.1080/21670811.2021.1941163)). Exaggeration did not raise news coverage of university press releases, and caveats did not lower it ([Sumner et al. 2014](https://doi.org/10.1136/bmj.g7015); [Sumner et al. 2016](https://doi.org/10.1371/journal.pone.0168217)). The job is to make the truth as surprising as the myth, not to stretch it.

The emotional levers that are safe for the brand are well measured, though in older settings. In a study of 6,956 New York Times articles, each standard-deviation rise in a quality changed the odds of making the most-emailed list ([Berger & Milkman](https://faculty.wharton.upenn.edu/wp-content/uploads/2011/11/Virality.pdf)):

| Quality | Change in odds per standard deviation |
|---|---|
| Awe | +30% |
| Practical value | +30% |
| Interest | +25% |
| Surprise | +14% |
| Sadness | −16% |

The strongest Twitter effects belong to levers an accuracy brand should refuse. Each term referring to the political out-group raised sharing odds by **67%** across 2.7 million posts ([Rathje et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC8256037/)). Each moral-emotional word raised shares by about **13%** in a 27-study meta-analysis ([Brady et al. 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12578369/)). Outrage helps misinformation spread at least as well as trustworthy news, and people often share outrage-evoking misinformation without reading it ([McLoughlin et al.](https://doi.org/10.1126/science.adl2829)). These are also the levers that draw the mutes, blocks and "not interested" taps the 2026 ranker punishes hardest. Styling matters as well. A 2026 experiment found that clickbait features cut perceived credibility and that "the harmful effect of clickbait was stronger for factually accurate posts" ([Craig et al.](https://researchportal.northumbria.ac.uk/en/publications/the-clickbait-paradox-why-sensationalist-styling-damages-trustwor/)).

Conversation is harder to manufacture than sharing. In 1.2 million tweets, "the majority of questions received no response", and the number of answers rose with the size of the asker's network, not with how often they posted ([Paul et al.](https://ojs.aaai.org/index.php/ICWSM/article/view/14165)). On Facebook, asking a question raised comments ([de Vries et al.](https://doi.org/10.1016/j.intmar.2012.01.003)). Discussion peaks at moderate controversy rather than high controversy ([Chen & Berger](https://doi.org/10.1086/671465)).

Correcting a myth is safe for belief. Repeating a myth while correcting it did not strengthen the misconception, even among people who had never heard it ([Ecker et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC7447737/)). A review found that backfire effects "are not a robust empirical phenomenon" ([Swire-Thompson et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC7462781/)). No study has measured how myth-correction posts perform on X. Correcting individual strangers is different: Twitter users corrected in replies went on to share lower-quality, more partisan content ([Mosleh et al.](https://doi.org/10.1145/3411764.3445642)).

The biggest accounts in this niche show what reach looks like and what accuracy is worth. **@historyinmemes** grew **61-fold, from 100,193 followers in July 2022 to 6.14 million in June 2026**. Of its 101 most visible posts, 85 were native videos and 16 photos, with a median of 36.4 million views and a median caption of ten words, and not one credited a creator, archive or link ([2022 capture](https://web.archive.org/web/20220730173114/https://socialblade.com/twitter/user/historyinmemes); [2026 capture](https://web.archive.org/web/20260627221841/https://x.com/historyinmemes)). Massimo posted about once every six minutes in a sampled window and drew 41 to 454 likes per post, against roughly 3-4 million followers ([capture](https://web.archive.org/web/20250914130000/https://xcancel.com/Rainmaker1973)). Meanwhile the researched, original Cultural Tutor slipped from 1.76 million followers to 1.67 million between December 2024 and August 2026 ([2024 capture](https://web.archive.org/web/20241201062245/https://nitter.privacydev.net/culturaltutor); [2026 capture](https://web.archive.org/web/20260823004641/https://x.com/culturaltutor)), and UberFacts lost 1.24 million followers in about 15 months ([2025 capture](https://web.archive.org/web/20250228144610/https://socialblade.com/twitter/user/uberfacts); [2026 capture](https://web.archive.org/web/20260515170259/https://x.com/UberFacts)).

Sourcing, in other words, is not a growth engine on X; it is insurance. A Community Note cuts a post's reposts by **46%** once it is attached ([Slaughter et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC12478135/)), and sharing one false story costs a source more trust than sharing one true story earns it ([Altay et al. 2020](https://doi.org/10.1177/1461444820969893)). Fewer than one proposed note in ten is ever published, and in 2025 publication took 14 days on average ([Fortune](https://fortune.com/2025/07/10/more-than-90-x-community-notes-are-never-published-stuck-limbo-study/)). That leaves room for a fast, sourced account to supply the correction while a fake is still trending.

Calendar pegs reliably concentrate attention. Seven recurring pegs were tracked in English Wikipedia pageviews for 2024 and 2025. In 13 of the 14 topic-years, pageviews peaked on the peg date. Peg-day traffic ranged from 3.5 times the yearly median (Titanic) to more than 400 times (Pi Day). The 80th D-Day anniversary drew 102 times the median, against 31 times a year later ([Wikimedia API: Pi Day](https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Pi_Day/daily/20240101/20251231); [Normandy landings](https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Normandy_landings/daily/20240101/20251231)). The spike attaches to the pegged topic itself, so a post that only mentions the date borrows little of it.

## A 30-day plan for @strictlyfyi

The plan keeps what the evidence supports in the prepared kit and adds the part it lacks: hand-run conversation, which feeds the cold-start trials. Every recommendation carries one of four evidence labels:

| Label | Meaning |
|---|---|
| **Strong** | X's own rules or code, matched by independent data or by X's public statements |
| **Moderate** | One large dataset, or X's code alone (whose defaults can differ from production) |
| **Weak** | Vendor figures without a method, self-reported cases, older or off-platform studies, or inference from parameter names |
| **Judgment** | No direct evidence; a reasoned call, set up as a test |

### Keep the checked texts, but change the clock and the image default

The 30 prepared `x` texts already fit the evidence. Each delivers its fact with no link or hashtag and opens on a concrete claim. Most end with a question about experience or opinion, not a request for likes. The changes are about timing, images and volume:

| Change | What to do | Why | Evidence |
|---|---|---|---|
| Keep the texts, with no links and no hashtags | Post the 30 `x` texts as written | Self-contained posts are what X advises; X tells organic posters to drop hashtags; links trade away the engagement this goal needs; an API post with a URL costs 13 times as much | Strong |
| Move the slot | Post at 21:00 IST (10:30 a.m. New York) from 2 November. Leave 1 November at 20:00 IST | The two-hour cold-start window then runs from 10:30 a.m. to 12:30 p.m. Eastern. It falls inside Buffer's 8-11 a.m. local peak in the Eastern, Central and Mountain zones and reaches 9:30 a.m. on the West Coast. It also touches the start of Sprout's noon-to-6 p.m. window | Moderate for the window; Judgment for the exact minute |
| Make text-only the default and test the title card | Add the card on odd dates and post text only on even dates from 3 November. Read the results on 16 and 30 November | Free accounts: text about 0.40% vs images about 0.20% (Buffer). Other datasets lean slightly toward images. The card restates the entry's title and a teaser rather than adding a new fact | Moderate for the default; Judgment for the test |
| Keep the closing questions; cut the rhetorical one | Drop "Still hungry?" on 6 November and keep the other 20 | Genuine, answerable questions are not engagement bait. Rhetorical ones invite no answer, and most questions from small accounts go unanswered anyway | Weak |
| Do not shorten the texts | Keep their current 189-274 characters | The only length data (100-200 characters best) is an unquantified vendor figure, and attention weights rose this autumn | Weak |
| Keep the date pegs | Optionally cut the "Fibonacci Day" line on 23 November | Pegs lift their own topic. A post about Graham's number borrows nothing from Fibonacci Day | Moderate for pegs; Judgment for the cut |
| No trials on weekends | Keep weekend posts as scheduled, but run every test on a weekday | Saturday is the weakest day in both timing studies | Moderate |
| Add a weekday second post | From 9 November, Monday to Friday at 23:30 IST (1:00 p.m. New York), text only. Use the day's new entry if there is one, otherwise the next unused `posts.csv` line with its link removed | Each original post gets its own cold-start trial. 1 p.m. Eastern covers Sprout's midday peak and 10 a.m. Pacific. No study shows that extra posts cut total engagement | Weak |
| No video in November | Post no video this month | Video trails text for free accounts, gets no weight for quality views, and third-party clips lose 90% of impressions | Moderate |

Cutting "Still hungry?" keeps the kit's rule that the `x` text minus its question equals the `text` field. Cutting the Fibonacci line would need the same edit to `text`. SOCIAL.md's X line (20:00 IST, a card on every post) should be updated once the owner adopts these changes. The 20 question days and 9 no-question days give a built-in comparison of reply rates, but five of the nine no-question days fall on weekends, so read it loosely.

Trial days and Community days are posted by hand at 21:00 IST, because nobody has confirmed that the composer can schedule threads, polls or Community posts. All of them are left out of the card comparison.

| Date | Entry | Main post (21:00 IST) | Also that day |
|---|---|---|---|
| Sun 1 | Daylight saving and farmers | Already scheduled for 20:00 IST, text only | Join History on X; start the routine |
| Mon 2 | Catacombs (All Souls' Day) | Text; into History on X if admitted | — |
| Tue 3 | How planes fly | Card | — |
| Wed 4 | Chicken or egg | Text | — |
| Thu 5 | QWERTY | Card | — |
| Fri 6 | Flies' feet | Text, without "Still hungry?" | — |
| Sat 7 | Cats and illusory squares | Card | — |
| Sun 8 | Hamsters | Text | First weekly review |
| Mon 9 | 12 a.m. and 12 p.m. | Card | Second post and quote posts begin |
| Tue 10 | Veins | Text | Second post |
| Wed 11 | Veterans Day | Card | Second post |
| Thu 12 | Einstein's IQ | Thread of 4-6 posts, by hand | Second post |
| Fri 13 | Illuminati, Friday the 13th | Card | Second post |
| Sat 14 | Hyenas | Text | — |
| Sun 15 | Em dash | Card | Weekly review; Premium decision |
| Mon 16 | Fax machine | Text | Second post; first read of the card test |
| Tue 17 | Moon's far side | Four-image post, by hand | Second post |
| Wed 18 | Gold | Thread, by hand | Second post |
| Thu 19 | Poop deck (World Toilet Day) | Card; into History on X | Second post |
| Fri 20 | Bluetooth | Text | Second post |
| Sat 21 | TV sizes (World Television Day) | Card | — |
| Sun 22 | Exploding whale | Text | Weekly review |
| Mon 23 | Graham's number | Card | Second post |
| Tue 24 | Plymouth Rock | Text; into History on X | Second post |
| Wed 25 | Turkeys | Poll (flock, gang, rafter), by hand | Second post |
| Thu 26 | Tryptophan (Thanksgiving) | Text | Second post |
| Fri 27 | Flea market (Black Friday) | Card | Second post |
| Sat 28 | Cucumbers | Text | — |
| Sun 29 | Xmas (Advent Sunday) | Card | Weekly review |
| Mon 30 | Web cookies (Cyber Monday) | Poll (accept, reject), by hand | Second post; month review |

### Add conversation formats before production formats

These additions reuse checked material and cost little production time. Every word in them must come from the checked kit (`instagram.json`, `replies.json` or `posts.csv`) or state no fact.

**Quote posts** (evidence: weak to moderate). From 9 November, when one of the day's two `replies.json` searches turns up a popular, fresh post on the topic, the owner can post one of the two checked replies as a quote post instead of a reply. A quote is neither a reply nor a repost, so by the code's wording it should qualify for the cold-start lane, which replies never reach; this is an inference. It also borrows an audience already gathered around the topic, and in older data quote tweets reached peak engagement about three times as readily as plain tweets ([Ng et al.](https://aging.jmir.org/2024/1/e49608)). The tone rule follows from the correction research: add to the post, and never tell its author they are wrong. Strangers who were corrected went on to share worse content ([Mosleh et al.](https://doi.org/10.1145/3411764.3445642)). People accept corrections mainly from accounts they follow and that follow them back ([Margolin et al.](https://doi.org/10.1080/10584609.2017.1334018)).

**Two threads**, on 12 November (Einstein's IQ) and 18 November (gold) (evidence: weak). Each turns the entry's `instagram.json` slide text into four to six posts that follow the day's `x` text. Only vendor figures support threads, but Bier recommended "longer threads that summarize key points" ([Social Media Today](https://www.socialmediatoday.com/news/niemanlab-offers-advice-for-posting-news-on-x/817383/)), and the ranker's attention weights have risen. The opening post must stand on its own: in one sampled Cultural Tutor thread, likes fell by more than half after the opener ([capture](https://web.archive.org/web/20241201062245/https://nitter.privacydev.net/culturaltutor)).

**One four-image post**, on 17 November (evidence: judgment). It tests whether slides that carry facts beat a single title card. No 2024-2026 data on multi-image posts exist. X takes at most four images, so use four body slides. Never use the end slide, which points to a link in bio.

**Two polls**, on 25 and 30 November (evidence: weak). Each turns an existing closing question into poll options. The only support is a vendor's undisclosed "2-3x" ([SociaVault](https://sociavault.com/blog/twitter-x-engagement-declining-2026-data)). The 2026 ranker's list of predicted actions has no poll vote ([README](https://github.com/xai-org/x-algorithm)), so a poll can trade a reply weighted 5 for a vote weighted nothing. That trade-off is exactly what the trial should check.

**Communities** get the history entries on 2, 19 and 24 November (evidence: moderate that such posts reach beyond members; none on how far). The owner posts them by hand into History on X after reading its rules. Science or trivia Communities found in the app can take science entries the same way.

**Video** waits (evidence: moderate). The niche's video giants are accounts with millions of followers that post other people's footage, a model a sourced publication cannot copy.

### Schedule by hand in November and build the API app in December

X's own composer is free and fully compliant, and the owner must be in the app every evening anyway. A weekly batch at two to three minutes per post fits into one Sunday sitting. The 3 November card post will also show whether the composer schedules images. If it cannot, card days are posted by hand at 21:00 IST.

| Route | Cost | What it can and cannot do | Verdict | Evidence |
|---|---|---|---|---|
| X composer, Schedule post, by the owner | Free; about 35 minutes each Sunday for 12 posts | Works on this free account. Long posts cannot be scheduled ([X Help](https://help.x.com/en/using-x/x-premium-how-to)). Scheduling of images, threads and polls is unconfirmed | Use for November | Strong |
| Buffer free plan | $0; Essentials costs $5 a month or $60 a year per channel ([Buffer](https://buffer.com/pricing)) | 10 queued posts per channel and 1 thread. Publishes to free X profiles through the official API. No confirmed polls, and no analytics for free X profiles | Backup for travel weeks | Moderate |
| The account's own app on X's pay-per-use API, run from a GitHub Action | $0.015 per post (about $0.70 a month for 46 posts); $0.20 per post with a URL; $0.001 per item to read the account's own posts; $20 of credit for new paying users ([X API pricing](https://docs.x.com/x-api/getting-started/pricing)) | Scheduled posting is allowed. Replies, likes and follows must stay manual. Image upload pricing was not checked | Build in December if the queue continues. It doubles as the weekly metrics logger for about $1-2 a month | Moderate (X's official price list, "subject to change") |
| Any browser automation of x.com | — | "May result in the permanent suspension of your account" | Never | Strong |

### Buy reply prioritization on day 15, not today

Premium is not worth buying today (evidence: moderate). Its only documented ranking benefit is reply prioritization, which pays off only for an account that replies by hand every day; for a queue that only posts on a schedule it buys almost nothing. The 2026 For You code has no subscriber multiplier, and Buffer's tenfold reach gap is a correlation measured before Phoenix. Several practical questions are also open. Nobody has checked whether a two-day-old account qualifies for the checkmark, which legacy tiers new customers can still buy after the 12 October relaunch, what the new plans cost in India, whether a brand may hold individual Premium rather than Premium Business, or whether paying ends graduated access at all.

On 15 November, apply one rule (evidence: judgment). If the evening session ran on at least 10 of the first 14 days, buy for one month the cheapest tier on the purchase screen that lists reply prioritization. Then compare the median impressions and profile visits of the account's own replies in weeks 3-4 against weeks 1-2. Keep the subscription only if those numbers at least double, because the account will also be maturing and smaller gains cannot be separated from that. If the routine has not held, do not buy.

| Tier | Price | Reply prioritization | Notes |
|---|---|---|---|
| Legacy Basic | ₹170 a month or ₹1,700 a year on the web in India ([NavBharat Live](https://navbharatlive.com/technology/good-news-for-x-users-in-india-you-will-get-premium-subscription-just-this-much-rupees-1282377.html)); $3 a month in the US ([X Help](https://help.x.com/en/using-x/x-premium-faq)) | Yes | Editing and longer posts; no checkmark. The first choice on day 15 if still sold |
| Legacy Premium | ₹427 a month on the web, ₹470 in the app; $8 a month in the US | "Larger" | Checkmark, about 50% fewer ads, and the full analytics dashboard, which free accounts lack ([Hootsuite](https://blog.hootsuite.com/twitter-analytics-guide/)) |
| X Subscription Plus | $8 a month in the US; India price unpublished ([xAI](https://x.ai/news/x-subscription)) | Counted in reply ranking | The fallback if legacy tiers are closed to new customers. Its X features are not itemised |
| Premium Business | $200 a month ([X Help](https://help.x.com/en/using-x/premium-business)) | "Prioritized" | Not justified at zero followers |

### An hour each Indian evening covers the American morning

From 1 November, IST runs 10.5 hours ahead of New York. That puts the owner's evening on the US morning, which is also Buffer's peak.

The evening routine runs on the phone app, where per-post analytics also live. Every like, follow and reply is done by hand. No reply text is ever pasted twice: keep a "used" column so each checked line goes out once. Target accounts big enough to have an audience but small enough that the author reads the replies, and reply while their posts are under about an hour old (evidence: weak, from self-reported cases and the reply cache). Follow back real accounts that engage, because the mutual-follow weight makes their future replies count four times (evidence: moderate).

| IST | New York | Task | Minutes |
|---|---|---|---|
| 20:40-21:00 | 10:10-10:30 a.m. | Read the timeline and like posts that deserve it. Run the day's two `replies.json` searches on the Latest tab, pick fresh posts from active mid-sized accounts, and post the two checked replies (or one as a quote post) | 20 |
| 21:00 | 10:30 a.m. | The main post goes out | 0 |
| 21:00-21:40 | 10:30-11:10 a.m. | Answer every reply on the main post, using the entry or no facts at all. Follow back real accounts that engage, and follow 5-10 relevant accounts. Add 2-4 replies on live threads that match an older entry, using that entry's `posts.csv` line without the link | 40 |
| 07:30-07:40, next day | 9:00-9:10 p.m. | Answer overnight replies, including those on the 1 p.m. second post | 10 |
| Sunday 20:00-21:00 | — | Schedule next week's 7 main and 5 second posts (about 35 minutes), log the week's numbers (15), and prepare the week's trial post from `instagram.json` (10) | 60 |

That comes to about 70 minutes on weekdays and 40 at weekends (with a shorter evening session), plus the Sunday hour: roughly eight hours a week (evidence: weak; the only documented account that reported its hours spent three to four a day). If that is too much, the core that cannot be cut is 30 minutes a day: the two kit replies plus an answer to every reply on the day's post. Growth will then be slower.

### Five numbers every Sunday decide what changes

Free accounts get no analytics dashboard, only per-post figures in the app ("View analytics": impressions, engagements, detail expands, new followers, profile visits). So each Sunday, log every original post and a sample of five of the account's own replies.

The thresholds below are judgment calls, each anchored to a published benchmark.

| Number | Anchor | Day 14 | Day 30 | If it misses |
|---|---|---|---|---|
| Median impressions per main post | Free accounts' median is under 100 ([Buffer](https://buffer.com/resources/x-premium-review/)); the cold-start lane closes at 200 home views | 100 | 200 | Under 50 at day 14: run the trust checks (last row) and move 20 minutes from trials to replies |
| Engagement rate on main posts (likes, replies, reposts and quotes ÷ impressions) | Free-account text about 0.4% (Buffer); 0.5-1% "normal", above 1% "strong" ([Ordinal](https://www.tryordinal.com/blog/twitter-x-engagement-data-study)) | 0.5% | 1% | Under 0.3% for two weeks: open the next week's posts on the number or the surprise |
| New followers per week | Butler: about 66 after one week and 135 after two, with heavy replying | 15 a week | 50-150 in total | Under 10 a week in week three: double the reply block and drop the trials |
| The account's own replies: median impressions and profile visits per reply | None published | Track | Track | If replies bring more profile visits per minute spent than posts, shift time to replies |
| Health: graduated-access notice, logged-out search for the handle, Under the Hood labels once eligible | Under the Hood shows visibility-limiting labels; it is a pilot open to accounts with at least 10 posts in the past month ([README](https://github.com/xai-org/x-algorithm); [TechRound](https://techround.co.uk/business/x-just-open-sourced-its-algorithm-and-added-a-shadowban-checker-real-transparency-or-pr-theatre/)) | Notice gone; account findable | No labels | Still gated at day 14: confirm phone and email, pass any captcha or liveness check by hand, and keep using the app by hand. Paying is not a documented fix |

Four decision rules sit on top of the table (evidence: judgment). For **title cards**, compare card days with text-only days on 16 and 30 November, and adopt the card only if it leads by at least 1.5 times on median impressions without a lower engagement rate. With about seven posts per side by mid-month, smaller gaps are noise. Keep the **second post** on 22 November if its median impressions reach at least 70% of the main slot's; otherwise cut it back to Tuesday to Thursday. A **trial** format (a thread, four-image post or poll) earns a repeat only if it beats the month's main-post median on both impressions and replies. And when someone credibly says a post is wrong, check it against the entry within 24 hours. If it is wrong, reply with the **correction** and a link to the corrections page, as the house policy requires.

### The likeliest failures are self-inflicted

| Risk | What the evidence says | Mitigation | Evidence |
|---|---|---|---|
| An automation flag | X's rules allow suspension for scripting the website. Project memory records that the profile, the pinned post and the 1 November scheduled-post edit were all done by an agent in the owner's Chrome ([project memory](file:///C:/Users/swapnilb/.claude/projects/c--Website-strictly-fyi/memory/project_social_profiles.md)) | Do everything by hand on the phone app from now on. Schedule only through the composer, Buffer or the account's own API app. Answer any captcha or liveness check at once ([X Help](https://help.x.com/en/using-x/liveness-checks)) | Strong |
| Quiet suppression for non-followers | Visibility rules can drop posts for non-followers only, and the gate is undocumented | Treat followers as the audience; watch logged-out search and Under the Hood | Moderate |
| Replies labelled as spam | Replies "may be marked as spam when unrelated to original posts, of low quality" ([X Help](https://help.x.com/en/using-x/x-premium-faq)). Offline jobs label accounts by the blocks and reports they collect relative to likes | Reply only on topic, each time with a checked fact or a real question. Never repeat text, never put links in replies, and send only a few replies to any one account per day | Moderate |
| An engagement-bait label | The 2026 code has an engagement-baiting spam class, and X removed about 4,000 accounts from revenue sharing in one day for soliciting engagement | No "reply with", "repost if" or "follow for more". Every question must be answerable | Moderate |
| A wrong or overstated fact | One false story costs more trust than a true one earns. A note cuts reposts by 46% once attached. Novelty is where false stories concentrate | Take every claim from the checked entry, check the most surprising claims a second time, and correct in public | Strong |
| Paying for nothing | The 2026 For You code has no subscriber multiplier | The day-15 rule | Moderate |
| Tactics going stale | The weights changed five times in two months. The product head behind the anti-bait push left on 2 October 2026 ([Wikipedia](https://en.wikipedia.org/wiki/Nikita_Bier)). The subscription offer changed on 12 October | Re-read the repository's Notable Updates each month, and trust the account's own numbers over this report | Strong |
| Owner burnout | Every documented success took hours of daily, hands-on work | A fixed evening hour, with the 30-minute core as the fallback | Weak |

## Conclusion

The evidence turns the prepared kit inside out. The 30 checked posts looked like the plan and the reply kit like an extra. But the 2026 code gives a zero-follower account only one route to strangers, a two-hour cold-start trial judged on early likes, and a gated account's only dependable audience is its followers. The evening hour of hand-written replies is therefore what makes the queue work at all. It supplies the first followers, whose likes decide each trial, and the mutual follows, whose replies count four times over. Paying for Premium, posting more and formatting better all come after that hour.

The ranker will not reward Strictly FYI for being accurate, because it has no notion of truth, but accuracy changes which levers are safe to pull. The account can run true surprises and corrected myths on the same novelty engine that spreads false stories, without the mutes, notes and lost trust that follow outrage. Reposters who protect their own reputations also have a reason to prefer a source like that. Its most promising format is also its least tested: not the scheduled post, but the fast, sourced quote post on a trending claim, a role no large aggregator fills. X's weights, leadership and price list all changed this autumn, so the lasting part of this plan is the Sunday measurement loop. By 30 November, the account's own medians will be better evidence than anything cited here.
