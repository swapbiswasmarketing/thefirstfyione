# Viral content psychology on X/Twitter: what makes factual, educational and "today I learned" posts spread

Conventions used in these notes. Each finding carries a platform tag: [X/Twitter], [Facebook], [NYT email] (New York Times most-emailed list), [Upworthy web] (headline A/B tests on a website), [Lab] (survey or online experiment) or [Other]. Effect sizes are given as the authors report them. "Per +1 SD" means per one-standard-deviation increase. Most large-sample effects are observational, per-feature associations: they are not additive and do not prove causation unless the design was randomized. Research was done on 2026-11-01 with 20 web searches, plus direct reads of primary PDFs, GitHub READMEs, and the Europe PMC and OpenAlex bibliographic APIs for abstracts.

## Q1. Novelty and surprise, curiosity gaps, emotional arousal (awe, anger, amusement), moral-emotional language, humor and controversy: what spreads on Twitter/X, and by how much?

### Takeaway
Novelty and surprise, together with high-arousal emotion, are the most consistently measured drivers of sharing.

The largest effects measured on Twitter come from tactics that are risky for an accuracy brand:
- **Political out-group language:** +67% odds of a share per out-group term.
- **Moral-emotional words:** about +13% more shares per word in a 2025 meta-analysis of 27 studies.
- **Outrage:** helps misinformation spread at least as well as trustworthy news.

The brand-safe levers are novelty, awe, amusement, interest and practical value. In the best-known study (NYT email sharing, 2008, not Twitter), each was worth roughly +14% to +30% per +1 SD.

Curiosity-gap and clickbait styling gives small, inconsistent click gains and measurable credibility losses. Controversy helps conversation only up to a moderate level.

### Cited Findings

#### Novelty and surprise
- [X/Twitter] Vosoughi, Roy & Aral (*Science*, 9 March 2018) found that false rumors were "more novel than the truth across all novelty metrics". For information uniqueness, the K-S statistic was 0.457.
  - Novelty was measured against a random sample of ~25,000 tweets that ~5,000 rumor-spreaders had been exposed to in the 60 days before they retweeted.
  - The authors conclude that "novel information is more likely to be retweeted".
  - They caution that "we cannot claim that novelty causes retweets", and that although false rumors were measurably more novel, "users may not have perceived them as such".
  - Source: [Vosoughi et al. 2018, full text PDF](https://politics.media.mit.edu/papers/Vosoughi_Science.pdf)
- [X/Twitter] In the same study, replies to false rumors expressed more surprise (K-S = 0.205) and more disgust (K-S = 0.102). Replies to true rumors expressed more sadness, anticipation, joy and trust. — [Vosoughi et al. 2018 PDF](https://politics.media.mit.edu/papers/Vosoughi_Science.pdf)
- [X/Twitter] Vosoughi et al. explain why novelty spreads. Novel information is "more valuable", and from a social perspective it "conveys social status on one that is 'in the know' or has access to unique 'inside' information". — [Vosoughi et al. 2018 PDF](https://politics.media.mit.edu/papers/Vosoughi_Science.pdf)
- [NYT email] Berger & Milkman (*Journal of Marketing Research* 2012) studied 6,956 NYT articles published between 30 August and 30 November 2008. Of these, 20% made the most-emailed list.
  - Interest (+25% per +1 SD), surprise (+14%) and practical value (+30%) were all "positively linked to virality".
  - The emotion results held after controlling for these three and for homepage placement.
  - Source: [Berger & Milkman, Wharton PDF](https://faculty.wharton.upenn.edu/wp-content/uploads/2011/11/Virality.pdf)
- [Other: web search pages] Tsurel et al. ("Fun Facts", arXiv 2016, WSDM 2017) formalized "trivia-worthiness". Their algorithm ranks an entity's Wikipedia categories by how surprising that membership is, surfacing facts "such as Obama's Grammy or Elvis' stint as a tank gunner".
  - In user studies, it captured "good trivia" 45% better than prior work.
  - On live search pages, it cut bounce rates by 22% and raised dwell time by 12%.
  - Source: [arXiv 1612.03896](https://arxiv.org/abs/1612.03896)

#### Emotional arousal: awe, anger, anxiety, sadness, amusement
- [NYT email] Berger & Milkman report: "a one-standard-deviation increase in the amount of anger an article evokes increases the odds that it will make the most e-mailed list by 34%" and "a one-standard-deviation increase in awe increases the odds ... by 30%". — [Berger & Milkman PDF](https://faculty.wharton.upenn.edu/wp-content/uploads/2011/11/Virality.pdf)
- [NYT email] Figure 2 of the same paper gives the percentage change in the fitted probability of making the list, per +1 SD:

  | Characteristic | Change |
  |---|---|
  | Anxiety | +21% |
  | Anger | +34% |
  | Sadness | -16% |
  | Awe | +30% |
  | Positivity | +13% |
  | Emotionality | +18% |
  | Interest | +25% |
  | Surprise | +14% |
  | Practical value | +30% |
  | Time at top of homepage (comparison) | +20% |

  Caveat: the anger and awe values are stated in the text. The other values were read from the PDF's extracted figure text, where labels and values follow the same order. — [Berger & Milkman PDF](https://faculty.wharton.upenn.edu/wp-content/uploads/2011/11/Virality.pdf)
- [NYT email] Berger & Milkman define awe as "a feeling of admiration and elevation in the face of something greater than oneself (e.g., a new scientific discovery...)". Their high-awe example article is "Rare Treatment Is Reported to Cure AIDS Patient". Their summary: "content that evokes high-arousal positive (awe) or negative (anger or anxiety) emotions is more viral. Content that evokes low-arousal, or deactivating, emotions (e.g., sadness) is less viral." — [Berger & Milkman PDF](https://faculty.wharton.upenn.edu/wp-content/uploads/2011/11/Virality.pdf)
- [Other: YouTube video ads shared across platforms] Tellis, MacInnis, Tirunillai & Zhang (*Journal of Marketing* 2019) tested 11 emotions and over 60 ad characteristics. The abstract gives no effect sizes. Key findings:
  - "Information-focused content has a significantly negative effect on sharing, except in risky contexts."
  - "Positive emotions of amusement, excitement, inspiration, and warmth positively affect sharing."
  - "Emotional ads are shared more on general platforms (Facebook, Google+, Twitter) than on LinkedIn, and the reverse holds for informational ads."
  - Drama elements such as surprise arouse emotions. Prominent brand placement hurts sharing.
  - Source: [Tellis et al. 2019](https://doi.org/10.1177/0022242919841034)
- [Upworthy web, randomized] Robertson et al. (*Nature Human Behaviour* 2023) analyzed 12,448 randomized headline tests after pre-registered filtering. These covered 53,699 headlines, more than 205 million impressions and 2,778,124 clicks. The full dataset was ~105,000 variants, ~370 million impressions and ~5.7 million clicks.
  - For an average-length headline (~15 words), each negative word raised click-through rate (CTR) by 2.3% and each positive word lowered it by 1.0%.
  - By discrete emotion, per +1 SD: sadness raised the odds of a click by 0.7%, joy lowered them by 0.9% and fear by 0.7%. Anger was not significant, and an equivalence test was inconclusive.
  - Source: [Robertson et al. 2023, PMC10202797](https://pmc.ncbi.nlm.nih.gov/articles/PMC10202797/)
- [Upworthy web] Nieman Lab coverage of the same study:
  - Average CTR was 1.39% and median CTR 1.07%.
  - The negative words were mostly mild ones such as "wrong", "bad" and "awful".
  - Source: [Nieman Lab, March 2023](https://www.niemanlab.org/2023/03/negative-words-in-news-headlines-generate-more-clicks-but-sad-words-are-more-effective-than-angry-or-scary-ones/)
- [Upworthy web] Coverage of the study describes Upworthy's headline style as aiming for a "curiosity gap", which teases a payoff available only by clicking through. This was seen in search-result summaries of the coverage, so the exact page was not pinned down. — [Nieman Lab, March 2023](https://www.niemanlab.org/2023/03/negative-words-in-news-headlines-generate-more-clicks-but-sad-words-are-more-effective-than-angry-or-scary-ones/)

#### Humor
- [Lab, Twitter-style science messages] A 2020 *Science Communication* experiment (Yeo et al.) found that "different humor types caused viewers to experience different levels of mirth, which mediated the relationship between our experimental manipulation and engagement intentions". The trait "need for humor" moderated the effect. Outcomes were stated intentions, not real reposts, and the abstract gives no effect size. — [Science Communication 2020](https://doi.org/10.1177/1075547020942512)
- [Other] Tellis et al. 2019 (above) found that amusement positively affects sharing of video ads. — [Tellis et al. 2019](https://doi.org/10.1177/0022242919841034)

#### Moral-emotional language
- [X/Twitter] Brady, Wills, Jost, Tucker & Van Bavel (*PNAS* 2017) analyzed n = 563,312 tweets about gun control, same-sex marriage and climate change.
  - "The presence of moral-emotional words in messages increased their diffusion by a factor of 20% for each additional word."
  - "Moral contagion was bounded by group membership": it spread more within liberal and conservative networks than between them.
  - Source: [Brady et al. 2017](https://doi.org/10.1073/pnas.1618923114)
- [X/Twitter] Contradicted by Burton, Cruz & Hahn (*Nature Human Behaviour* 2021). Using out-of-sample prediction, model comparisons and specification curves, "the moral contagion model performs no better than an implausible XYZ contagion model". — [Burton et al. 2021](https://www.nature.com/articles/s41562-021-01133-5)
- [X/Twitter and others] Brady et al.'s rebuttal (*PNAS Nexus* 2025) combined a pre-registered replication (N = 849,266) with a meta-analysis (5 labs, 27 studies, N = 4,821,006).
  - Pooled IRR = 1.13 (95% CI 1.06-1.20): "for each additional moral-emotional word in a post, the expected number of shares was 13% greater".
  - The replication gave IRR = 1.17, against 1.20 in the original study.
  - "The moral contagion model substantially outperforms nonsense models of diffusion ('XYZ contagion model')."
  - Source: [Brady et al. 2025, PMC12578369](https://pmc.ncbi.nlm.nih.gov/articles/PMC12578369/)
  - A Kellogg School summary gives slightly different figures (IRR 1.12, CI 1.06-1.19; replication 1.15), probably from an earlier version. Prefer the published abstract. — [Kellogg summary](https://www.kellogg.northwestern.edu/academics-research/research/detail/2025/estimating-the-effect-size-of-moral-contagion-in-online/?p=1)

#### Out-group animosity and outrage
- [Facebook + X/Twitter] Rathje, Van Bavel & van der Linden (*PNAS* 2021) analyzed n = 2,730,215 posts from news-media accounts and US congressional members.
  - Posts about the political out-group were shared or retweeted "about twice as often" as posts about the in-group.
  - "Each individual term referring to the political out-group increased the odds of a social media post being shared by 67%."
  - Out-group language was "about 4.8 times as strong as that of negative affect language and about 6.7 times as strong as that of moral-emotional language".
  - Out-group language strongly predicted "angry" reactions, and in-group language predicted "love" reactions.
  - The effect was not moderated by platform or political orientation. It was stronger for political leaders than for news media.
  - Source: [Rathje et al. 2021, PMC8256037](https://pmc.ncbi.nlm.nih.gov/articles/PMC8256037/)
- [Facebook + X/Twitter + Lab] McLoughlin, Brady, Goolsbee, Kaiser, Klonick & Crockett (*Science*, 28 November 2024) used 1,063,298 Facebook links, 44,529 tweets from 24,007 users, and two experiments with 1,475 participants. They found three things:
  - "misinformation sources evoke more outrage than do trustworthy sources";
  - "outrage facilitates the sharing of misinformation at least as strongly as sharing of trustworthy news";
  - "users are more willing to share outrage-evoking misinformation without reading it first".
  - Source: [McLoughlin et al. 2024](https://doi.org/10.1126/science.adl2829)
- [X/Twitter + Lab] Brady, McLoughlin, Doan & Crockett (*Science Advances* 2021) studied 7,331 users and 12.7 million tweets, plus two experiments (N = 240). "Positive social feedback for outrage expressions increases the likelihood of future outrage expressions." Users also conform to the outrage norms of their networks. — [Brady et al. 2021](https://doi.org/10.1126/sciadv.abe5641)

#### Controversy
- [Field + Lab; not Twitter] Chen & Berger (*Journal of Consumer Research* 2013) ran five studies.
  - "Controversy increases likelihood of discussion at low levels, but beyond a moderate level of controversy, additional controversy actually decreases likelihood of discussion."
  - Two processes pull in opposite directions: controversy raises interest but also discomfort.
  - Anonymity, and whether people are talking to friends or strangers, moderate the effect.
  - Source: [Chen & Berger 2013](https://doi.org/10.1086/671465)

#### Curiosity gaps and clickbait
- [Theory] Loewenstein's information-gap account (*Psychological Bulletin* 1994) treats curiosity "as a form of cognitively induced deprivation that arises from the perception of a gap in knowledge or understanding". He notes its "intensity, transience, association with impulsivity, and tendency to disappoint when satisfied". — [Loewenstein 1994](https://doi.org/10.1037/0033-2909.116.1.75)
- [Other: Blendle newsletter, Netherlands] Kuiken et al. (*Digital Journalism* 2017) measured CTRs on rewritten headlines. "Most, but not all, of the clickbait features lead to a statistically significant increase in the number of clicks", but "predicting the effectiveness of a headline only on the basis of its clickbait features is not possible". — [Kuiken et al. 2017](https://doi.org/10.1080/21670811.2017.1279978)
- [Lab + sharing data] Molina, Sundar & Rony (CHI 2021) found that in Studies 1 and 2, "clickbait did not generate more curiosity than non-clickbait". In Study 3 some headlines generated more engagement, and the four clickbait detectors agreed on a classification only 47% of the time. — [Molina et al. 2021](https://pure.psu.edu/en/publications/does-clickbait-actually-atract-more-clicks-three-clickbait-studie/)
- [Lab] An experiment in the *Atlantic Marketing Journal* (Kennesaw State) is known only from a search snippet; the full paper was not read. Per the snippet, curiosity and click intention were higher when copy pointed to missing information, while sensational copy lowered arousal, curiosity and click intention. — [Atlantic Marketing Journal vol. 13 iss. 1](https://digitalcommons.kennesaw.edu/amj/vol13/iss1/7)
- [X/Twitter] Chakraborty, Sarkar, Mrigen & Ganguly (CSCW 2018) analyzed how clickbait and non-clickbait tweets from media houses are shared. Only the abstract was read, so no quantitative results were retrieved. — [arXiv 1709.02957](https://arxiv.org/abs/1709.02957)
- Evidence on the credibility cost of clickbait is under Q5.

### Inferences
- **Brand-safe levers** are novelty and surprise relative to what the audience has already seen, awe, amusement, interest and practical value. For "today I learned" posts, Vosoughi's measure implies the fact must be new to the audience's recent feed, not merely true. Tsurel's trivia work suggests the most shareable facts show a familiar entity in a surprising category.
- **Risk of novelty.** Novelty is the property false news has more of, so the most surprising "facts" are where errors concentrate. The verification burden should scale with how surprising a claim feels. A too-good-to-be-true fact that is wrong does disproportionate reputational damage (Altay 2020, under Q2).
- **Strong but brand-hostile levers** are out-group animosity (+67% per term), outrage, and moral-emotional framing (+13% per word).
  - Moral contagion is bounded within ideological groups (Brady 2017). It deepens reach inside an in-group rather than reaching new audiences.
  - Outrage gets shared without reading (McLoughlin 2024), which is engagement without comprehension: the opposite of an accuracy brand's goal.
  - Outrage is self-reinforcing for the author (Brady 2021). An account rewarded for outrage drifts toward more outrage.
- **Out-group framing in non-political fact posts.** Framing such as "people who think X are wrong" or "Americans believe..." probably taps the out-group mechanism. That framing is untested for non-political content.
- **Negativity.** The Upworthy effect is real but small (+2.3% relative CTR per mild negative word). Sad words outperform angry or fearful ones for clicks. This suggests mild, honest negative framing ("the sad reason...") rather than alarm.
- **Curiosity gaps.** Gains are small and inconsistent across studies. Loewenstein's "tendency to disappoint when satisfied" means a gap that the post does not pay off risks disappointment and credibility loss (see Q5).
- **Controversy.** The evidence supports moderately debatable, low-discomfort prompts, not divisive ones.
- **Transfer caveat.** The cleanest emotion effect sizes come from NYT email sharing in 2008 and Upworthy clicks in 2013-2015, not from X in 2026. Treat their magnitudes as directional.

### Gaps
- No X/Twitter study was found that measures the effect of curiosity-gap phrasing on reposts or likes with an effect size. The Twitter clickbait study (Chakraborty et al., CSCW 2018) was read only at abstract level.
- No Twitter field study of humor's effect on actual reposts or likes was found. The best Twitter-specific evidence measures intentions.
- Milkman & Berger, "The science of sharing and the sharing of science" (*PNAS* 2014, [DOI](https://doi.org/10.1073/pnas.1317511111)), studies sharing of "hundreds of recent scientific discoveries". It is directly relevant to educational content, but only its abstract was accessible; the full text is not open access through the APIs used. Its specific results (for example, on awe or usefulness in science stories) could not be verified.
- Amusement as a measured emotion with an effect size on Twitter was not found.

## Q2. Does false or exaggerated information spread faster than truth, what does that imply for an accurate fact account, and how do myth-correction framing and corrections perform?

### Takeaway
Yes. In the largest Twitter study (2006-2017), falsehoods were 70% more likely to be retweeted and reached 1,500 people about six times faster than truth.

A reanalysis shows the gap is about infectiousness: false items more often grow large. It is not a different spreading mechanism. True posts that do go viral spread the same way as false ones of the same size.

For an accuracy brand, this means:
- **Make the truth more infectious.** Use novelty, surprise and "interestingness-if-true" on claims that are actually true.
- **Exaggeration is not needed.** In science press-release studies, it did not raise media pickup, and caveats did not lower it.
- **Reputation is asymmetric.** One false post costs more trust than one true post earns, and a Community Note cuts a post's reposts by ~46% after it is attached.
- **Myth-correction framing is safe for belief.** Repeating the myth does not backfire, and fact-checks with a conclusive verdict get shared more.

No study was found that directly measures the engagement of "you were taught X; actually Y" posts on X.

### Cited Findings

#### True vs false spread
- [X/Twitter] Vosoughi, Roy & Aral (*Science* 2018) studied "~126,000 stories tweeted by ~3 million people more than 4.5 million times", 2006-2017. Veracity came from "six independent fact-checking organizations that exhibited 95 to 98% agreement". — [Vosoughi et al. 2018 PDF](https://politics.media.mit.edu/papers/Vosoughi_Science.pdf)
- [X/Twitter] Main results from the same paper:
  - "Falsehoods were 70% more likely to be retweeted than the truth". This held after controlling for the original tweeter's account age, activity level, follower and followee counts, and verification.
  - "It took the truth about six times as long as falsehood to reach 1500 people and 20 times as long as falsehood to reach a cascade depth of 10."
  - The top 1% of false cascades reached 1,000-100,000 people, while truth rarely reached more than 1,000.
  - The top 0.01% of false cascades diffused eight hops deeper than the truth.
  - Source: [Vosoughi et al. 2018 PDF](https://politics.media.mit.edu/papers/Vosoughi_Science.pdf)
- [X/Twitter] The effect held in all categories but was "more pronounced for false political news" than for news about terrorism, natural disasters, science, urban legends or financial information. — [MIT Media Lab summary](https://www.media.mit.edu/publications/the-spread-of-true-and-false-news-online/)
- [X/Twitter] "Robots accelerated the spread of true and false news at the same rate", so humans, not bots, drive the gap. — [Vosoughi et al. 2018 PDF](https://politics.media.mit.edu/papers/Vosoughi_Science.pdf)
- [X/Twitter] Selection caveat. The main sample is "all rumor cascades investigated by six independent fact-checking organizations", so it consists of claims contested enough to be fact-checked. As a robustness check, the authors had trained students label rumors that fact-checkers had not investigated, drawn from an automated rumor detector run on 3 million English-language tweets from 2016. — [Vosoughi et al. 2018 PDF](https://politics.media.mit.edu/papers/Vosoughi_Science.pdf)
- [X/Twitter] Juul & Ugander (*PNAS* 2021) reanalyzed the comparison.
  - The previously reported structural differences between false and true diffusion "disappear when comparing only cascades of the same size". False-news cascades were mostly larger: more infectious, not structurally different.
  - Differences in depth and structural virality between content types (images, videos, news, petitions) largely persisted after controlling for size.
  - Source: [Juul & Ugander 2021, PMC8609637](https://pmc.ncbi.nlm.nih.gov/articles/PMC8609637/)
  - A press summary is headlined "Viral true tweets spread just as far as viral untrue tweets". — [Newswise / Cornell](https://www.newswise.com/articles/viral-true-tweets-spread-just-as-far-as-viral-untrue-tweets)
- [X/Twitter] Slaughter et al. (*PNAS* 2025) independently restate the point: false information "diffuses farther, but with structural patterns that are otherwise indistinguishable from those of true information, conditional on reach". — [Slaughter et al. 2025, PMC12478135](https://pmc.ncbi.nlm.nih.gov/articles/PMC12478135/)

#### Exaggeration
- [Other: UK university press releases to news] Sumner et al. (*BMJ* 2014) analyzed 462 press releases from 20 leading UK universities (2011) and 668 news stories.
  - 40% of releases contained exaggerated advice, 33% exaggerated causal claims and 36% exaggerated animal-to-human inference.
  - Exaggeration in releases strongly predicted exaggeration in news (odds ratios 6.5 to 56).
  - Yet "there was little evidence that exaggeration in press releases increased the uptake of news".
  - Source: [Sumner et al. 2014](https://doi.org/10.1136/bmj.g7015)
- [Other: journal press releases to news] Sumner et al. (*PLoS ONE* 2016) analyzed 534 press releases and 582 news stories. Exaggerations "were not associated with increased news coverage". Across a combined 996 releases and 1,250 news stories, caveats in press releases produced "no reduction in journalistic uptake" but strongly increased caveats in the news (odds ratios ~9.5). — [Sumner et al. 2016](https://doi.org/10.1371/journal.pone.0168217)

#### Why people share true vs false
- [Lab] Altay, de Araujo & Mercier (*Digital Journalism* 2021) ran three pre-registered experiments (N = 904).
  - "Participants were more willing to share news they found more interesting-if-true, as well as news they deemed more accurate."
  - Participants rated fake news "less accurate but more interesting-if-true than true news", but "were more likely to share true news than fake news".
  - Source: [Altay et al. 2021](https://doi.org/10.1080/21670811.2021.1941163)
- [Lab] Altay, Hacquin & Mercier (*New Media & Society* 2020) ran four pre-registered experiments (N = 3,656).
  - "The decrease in trust a source (media outlet or individual) suffers when sharing one fake news story against a background of real news is larger than the increase in trust a source enjoys when sharing one real news story against a background of fake news."
  - "Only sources sharing no fake news at all had similar trust ratings to mainstream media."
  - Most people "would have to be paid to share fake news".
  - Source: [Altay et al. 2020](https://doi.org/10.1177/1461444820969893)
- [Lab + X/Twitter field experiment] Pennycook et al. (*Nature* 2021) found that "the veracity of headlines has little effect on sharing intentions, despite having a large effect on judgments of accuracy". Yet "most participants say it is important to share only accurate news". Subtly shifting attention to accuracy raised the quality of news people later shared, including in a Twitter field experiment. — [Pennycook et al. 2021](https://doi.org/10.1038/s41586-021-03344-2)
- [Facebook + X/Twitter] McLoughlin et al. (2024): users are "more willing to share outrage-evoking misinformation without reading it first", so such misinformation "may be difficult to mitigate with interventions that assume users want to share accurate information". — [McLoughlin et al. 2024](https://doi.org/10.1126/science.adl2829)

#### Community Notes (the main platform-side risk for an accuracy brand)
- [X/Twitter] Slaughter, Peytavin, Ugander & Saveski (*PNAS* 2025) studied 40,078 posts with proposed notes using synthetic controls.
  - After a note was attached, the post saw reductions of 46.1% in reposts, 44.1% in likes, 21.9% in replies and 13.5% in views.
  - Over a post's whole lifespan, the reductions were 11.6% in reposts, 13.3% in likes, 6.9% in replies and 5.5% in views.
  - Noted cascades were "less deep and less 'viral', but not less broad".
  - Source: [Slaughter et al. 2025, PMC12478135](https://pmc.ncbi.nlm.nih.gov/articles/PMC12478135/)
- [X/Twitter] Drolsbach & Pröllochs (CSCW 2023; Birdwatch pilot data) found that among community fact-checked posts, misleading ones were "estimated to receive 36.62% fewer retweets than not misleading posts". Community fact-checkers tended to target high-follower accounts. — [arXiv 2205.13673](https://arxiv.org/abs/2205.13673)

#### How corrections and fact-checks spread
- [Social media; platform not verified] Per a search snippet, Li & Chang (*Information Systems Frontiers* 2022) found that "conclusive fact-checks (either true or false) tend to be shared more than others", and that source credibility and political leaning also mattered. Only the snippet was seen. — [Oregon State listing](https://business.oregonstate.edu/biblio/combating-misinformation-sharing-truth-study-spread-fact-checks-social-media); [DOI](https://doi.org/10.1007/s10796-022-10296-z)
- [X/Twitter; unreviewed preprint] Croston & Harris studied a graphene-oxide vaccine myth. Misinformation had "far more" tweets, retweets, quote tweets and posting accounts overall, "however, fact-check tweets spread the furthest through retweets and quote tweets compared to misinformation tweets". — [JMIR Preprints 73538](https://preprints.jmir.org/preprint/73538)
- [X/Twitter] Margolin, Hannak & Weber (*Political Communication* 2017/2018) studied real corrections on Twitter from January 2012 to April 2014, replicated on November 2015 to February 2016 data. People "who follow and are followed by the people who correct them are significantly more likely to accept the correction than individuals confronted by strangers". — [Margolin et al.](https://doi.org/10.1080/10584609.2017.1334018)
- [X/Twitter field experiment] Mosleh et al. (CHI 2021) replied to N = 2,000 users' false political tweets with fact-check links. Being corrected "decreases the quality, and increases the partisan slant and language toxicity, of the users' subsequent retweets", with no significant effect on their original tweets. — [Mosleh et al. 2021](https://doi.org/10.1145/3411764.3445642)

#### Myth-correction framing: effects on belief, not engagement
- [Lab] Ecker, Lewandowsky & Chadwick (2020) ran three experiments (N = 1,718) on novel misinformation with a one-week delay. "Corrections that exposed participants to novel misinformation did not lead to stronger misconceptions compared to a control group never exposed to the false claims or corrections. This suggests that it is safe to repeat misinformation when correcting it, even when the audience might be unfamiliar with the misinformation." — [Ecker et al. 2020, PMC7447737](https://pmc.ncbi.nlm.nih.gov/articles/PMC7447737/)
- [Review] Swire-Thompson, DeGutis & Lazer (2020) conclude that "backfire effects are not a robust empirical phenomenon". — [Swire-Thompson et al. 2020, PMC7462781](https://pmc.ncbi.nlm.nih.gov/articles/PMC7462781/)
- [Lab] Kotz et al. (*British Journal of Health Psychology* 2023) used a representative German sample (N = 4,906).
  - Text structure ("truth sandwich" vs bottom-heavy) and headline format (statement vs question) did not affect belief in the myth or acceptance of the debunk.
  - Debunks worked less well on people with strong opposing attitudes and distrust in science.
  - "The risk of backfire effects in debunking misinformation is low", and writers should make the text "comprehensive, trustworthy and persuasive".
  - Source: [Kotz et al. 2023](https://doi.org/10.1111/bjhp.12670)

### Inferences
- **"True and surprising" is the brand-safe substitute for "false and novel".** Juul & Ugander show the true/false gap is about infectiousness, so accurate content can go just as viral if it is equally interesting. Altay shows people share for interestingness-if-true and for accuracy. A post that is both interesting and verifiably accurate gets both motives.
- **No need to exaggerate.** The press-release studies are the closest evidence on whether exaggeration buys reach: it did not raise media pickup, and caveats did not lower it. That is journalism pickup, not X engagement, so transfer is an inference.
- **Myth-correction framing ("you were taught X; actually Y").**
  - It plausibly borrows the engine that powers false news: the correction is the novel, surprising information set against a familiar belief.
  - The belief literature says repeating the myth does not backfire (Ecker 2020; Swire-Thompson 2020), and structure matters little (Kotz 2023). Conclusive verdicts appear to be shared more (Li & Chang, snippet-level).
  - Brand risks: if the "myth" is a straw man nobody holds, it invites "actually..." replies and possibly a Community Note. If the "actually" is itself oversimplified, the account becomes the source of misinformation. A myth-first image or headline can be screenshotted without the correction. The screenshot risk is untested and is an inference.
- **Reputation asymmetry (Altay 2020) plus Community Notes (Slaughter 2025).** For a publisher whose brand is accuracy, one noted or wrong post costs more than many correct posts gain. That argues for conservative claim scoping on surprising facts, and for adding caveats, which cost no pickup (Sumner 2016).
- **Avoid correcting strangers in replies.** Mosleh 2021 found it backfires on the corrected user's later sharing, and Margolin 2018 found corrections land mainly within mutual-follow relationships. Publishing general myth-busting posts is a different act from replying to individuals.

### Gaps
- No study measured engagement (reposts, likes, replies) for myth-correction framing versus a plain fact statement on X.
- The Ecker et al. 2022 review (*Nature Reviews Psychology*, "The psychological drivers of misinformation belief and its resistance to correction") has no abstract in the APIs used and was not read.
- Vosoughi's category-level numbers for science and urban-legend rumors, the categories closest to trivia, were not extracted.
- Li & Chang 2022 and the Croston & Harris preprint were seen only via search snippets.

## Q3. What generates replies (questions, polls, debatable prompts, "which one are you" framing, ragebait), what is the evidence on engagement bait, and how does X treat it?

### Takeaway
**Replies are weighted heavily.** In X's 2023 open-source ranker:
- a reply was weighted 27 times a like (13.5 vs 0.5);
- a reply the author then engaged with was weighted 150 times a like (75);
- negative feedback such as "show less", mute or block was -74, and a report was -369.

The 2026 open-source ranker (Phoenix) predicts more than 20 actions, including replies, quotes, DM shares, dwell and negative actions, but its weights are not stated in the README.

**What drives replies:**
- On Facebook, questions raise comments.
- On Twitter, most questions get no reply at all, and answers scale with the asker's audience size.
- Moderate controversy maximizes conversation.
- Outrage drives engagement that users say they do not prefer.

**How platforms treat engagement bait:**
- X's then head of product, Nikita Bier, said in March 2026 that Grok would identify and downrank posts that directly solicit engagement.
- Engagement baiting has reportedly been grounds for removal from creator payouts.
- Facebook has demoted engagement bait since December 2017, while exempting genuine requests for help, advice or recommendations.

**No evidence was found on polls or "which one are you" prompts.**

### Cited Findings

#### Questions and debatable prompts
- [X/Twitter] Paul, Hong & Chi (ICWSM 2011) took 1.2 million public tweets and used Mechanical Turk to identify 1,152 questions.
  - "The most popular question types were rhetorical and factual."
  - "The majority of questions received no response, while a handful of questions received a high number of responses."
  - "The larger the askers' network, the more responses she received; however, posting more tweets or posting more frequently did not increase chances of receiving a response."
  - Source: [Paul et al. 2011](https://ojs.aaai.org/index.php/ICWSM/article/view/14165)
- [Facebook] De Vries, Gensler & Leeflang (*Journal of Interactive Marketing* 2012) analyzed 355 brand posts from 11 brands. "The number of comments can be enhanced by the interactive brand post characteristic, a question." Likes were driven by vivid and interactive characteristics, so the drivers of likes and of comments differ. — [de Vries et al. 2012](https://doi.org/10.1016/j.intmar.2012.01.003)
- [Field + Lab] Chen & Berger (2013): discussion peaks at moderate controversy, because discomfort beyond that level suppresses it. Talking to strangers rather than friends, and anonymity, moderate the effect. — [Chen & Berger 2013](https://doi.org/10.1086/671465)

#### X's ranking signals: 2023 open-source "heavy ranker"
- [X/Twitter, primary] The README of twitter/the-algorithm-ml, stated as of 5 April 2023, gives these weights on predicted probabilities:

  | Signal | Weight |
  |---|---|
  | fav (like) | 0.5 |
  | retweet | 1.0 |
  | reply | 13.5 |
  | good_profile_click | 12.0 |
  | video_playback50 | 0.005 |
  | reply_engaged_by_author | 75.0 |
  | good_click | 11.0 |
  | good_click_v2 | 10.0 |
  | negative_feedback_v2 | -74.0 |
  | report | -369.0 |

  - Definitions: reply_engaged_by_author is "the user replies and the author engages with that reply". negative_feedback_v2 covers asking to see less, blocking or muting. good_click_v2 means the user opens the conversation and stays at least two minutes.
  - The page says weights can change at any time and production may differ.
  - Source: [twitter/the-algorithm-ml README](https://github.com/twitter/the-algorithm-ml/blob/main/projects/home/recap/README.md)
- [X/Twitter, secondary] Conflicting numbers circulate ("like 30x, retweet 20x, reply 1x"). These appear to describe the light ranker, which NYU's Center for Social Media and Politics (CSMaP) says is used only to retrieve in-network candidates. Do not confuse them with heavy-ranker weights. — [Zvi Mowshowitz](https://thezvi.substack.com/p/more-on-twitter-and-algorithms); [NYU CSMaP](https://csmapnyu.org/impact/news/what-can-we-learn-from-twitters-open-source-algorithm)

#### X's ranking signals: 2026 open-source "Phoenix" ranker
- [X/Twitter, primary] The xai-org/x-algorithm README lists the actions Phoenix "predicts how likely the viewer is to take":
  - Engagement: favorite, reply, repost, quote, share, share via DM, share via copy link.
  - Clicks: post, profile, link, photo expand, video open, quoted post.
  - Attention: video quality view, dwell, dwell time, click dwell time, video continuation seconds, profile visit seconds.
  - Author: follow author.
  - Negative: not interested, mute author, block author, report, not dwelled.
- [X/Twitter, primary] Scoring and filtering per the same README:
  - Score = Σ (weight × P(action)). "Positive actions carry positive weights, negative actions negative ones."
  - Weights live in `home-mixer/params/param.rs` and are not printed in the README.
  - After scoring, an author-diversity decay applies to each additional post from the same author, an out-of-network discount applies, and a new-author boost lifts small accounts.
  - Filters remove muted keywords, blocked or muted authors, and posts older than 48 hours, among others.
  - The latest "Notable Update" is dated 26 October 2026.
  - Source: [xai-org/x-algorithm README](https://github.com/xai-org/x-algorithm)
- [X/Twitter, secondary] Secondary write-ups say the repo went live in January 2026, that a 15 May 2026 update added an end-to-end pipeline and a downloadable mini Phoenix model, and that the transformer is ported from Grok-1. — [Pasquale Pillitteri](https://pasqualepillitteri.it/en/news/2594/x-algorithm-open-source-may-2026); [Mintlify docs mirror](https://mintlify.com/xai-org/x-algorithm/introduction)
  - Conflict: the README itself describes Phoenix as a transformer "in JAX with a Rust serving layer". It mentions "Grox" only as a separate content-classification system. — [xai-org/x-algorithm README](https://github.com/xai-org/x-algorithm)

#### X's treatment of engagement bait (mostly secondary reporting)
- [X/Twitter, secondary] Around 19 March 2026, Bier said X was "very close" to having Grok identify posts that directly solicit engagement and rank them lower. This is the article's paraphrase; Bier's post is embedded as an image and not quoted verbatim. — [PiunikaWeb, 20 March 2026](https://piunikaweb.com/2026/03/20/x-grok-downrank-engagement-bait-nikita-bier/)
  - The article, not Bier, describes the targeted posts as ones that "plead for replies, reposts, or copy-paste reactions". It frames the effort as covering "any behavior designed to game the algorithm" and says it is in early stages.
- [X/Twitter, secondary, low reliability] A July 2026 guide says Bier announced a Grok-driven sweep that removed nearly 4,000 accounts from creator revenue sharing in one day, mostly for engagement baiting. The same guide says no verified reach-penalty percentage exists and that pages quoting exact penalties are inventing them. — [Kompozy guide](https://kompozy.io/guides/x-engagement-bait-detection-update)
- [X/Twitter, secondary] In May 2026, Bier replied that MrBeast would not receive a payout that cycle over "giveaway" engagement bait, then deleted the reply. — [PiunikaWeb, 2 May 2026](https://piunikaweb.com/2026/05/02/x-deny-revenue-mrbeast-giveaway-engagement-bait/)
- [X/Twitter, secondary] Bier attributed falling reach for crypto content to engagement farming, bots and repetitive "GM" replies, not to anti-crypto bias. — [BeInCrypto](https://beincrypto.com/crypto-x-algorithm-suppression-controversy); [Backpack Learn](https://learn.backpack.exchange/articles/nikita-bier-crypto-twitter)
- [X/Twitter, secondary] In April 2024, Elon Musk warned accounts engaged in "engagement farming" and threatened suspension (headline-level report). — [Business Today, 19 April 2024](https://businesstoday.in/technology/news/story/musk-warns-twitter-accounts-of-engagement-farming-threatens-suspension-426097-2024-04-19)
- [X/Twitter, secondary] Engadget reported in August 2026 that Bier was leaving the head-of-product role and staying on as an advisor. It is unclear whether the anti-bait push continues at the same intensity. — [Engadget](https://engadget.com/2231302/x-head-of-product-nikita-bier-leaving-the-company-one-year-after-joining/)

#### Facebook's engagement-bait policy (reference point)
- [Facebook] Meta's policy dates from 18 December 2017 and was updated 7 November 2019.
  - Engagement bait is a tactic that "seeks to take advantage of our News Feed algorithm by boosting engagement in order to get greater reach". The example given is "LIKE this if you're an Aries!"
  - Offending posts are shown less, and Pages that "systematically and repeatedly" use it face Page-level demotions.
  - "Posts asking for help, advice, or recommendations" are not affected; examples include a missing-child report, fundraising and asking for travel tips.
  - Source: [Meta newsroom](https://about.fb.com/news/2017/12/news-feed-fyi-fighting-engagement-bait-on-facebook/)

#### Ragebait: evidence of engagement and of its costs
- [Facebook + X/Twitter] Out-group language was the strongest predictor of shares (+67% per term) and a "very strong predictor of 'angry' reactions". — [Rathje et al. 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8256037/)
- [X/Twitter] Milli et al. (*PNAS Nexus* 2025), in a pre-registered algorithmic audit, found that "Twitter's engagement-based ranking algorithm amplifies emotionally charged, out-group hostile content that users say makes them feel worse about their political out-group", and that "users do not prefer the political tweets selected by the algorithm". — [Milli et al. 2025, PMC11894805](https://pmc.ncbi.nlm.nih.gov/articles/PMC11894805/)
- [X/Twitter] Positive feedback for outrage reinforces future outrage. — [Brady et al. 2021](https://doi.org/10.1126/sciadv.abe5641)
- [Practitioner, headline only] Buffer data reported that replying to comments boosts engagement across all major platforms. Numbers were not verified. — [Net Influencer](https://www.netinfluencer.com/replying-to-comments-boosts-social-media-engagement-across-all-major-platforms-data-shows/)

### Inferences
- **Under the 2023 weights, conversation was the most valuable positive outcome.**
  - A reply carried 27 times the weight of a like, and a reply the author answered carried 150 times.
  - These weights multiply predicted probabilities, not counts. Replies are rarer than likes, so "one reply equals 27 likes" is a simplification.
  - Whether 2026 Phoenix keeps similar ratios is unknown, because its weights are unpublished.
- **The author replying to repliers was the single largest published weight.** The account's own reply activity is a lever, and it has a staffing cost.
- **The best reply-generators for a fact account** are genuine, answerable, low-stakes questions and moderately debatable claims (Chen & Berger), especially prompts that ask for knowledge or experience. Facebook explicitly exempts help, advice and recommendation requests from its bait rules.
- **"Which one are you" and "reply with X" framings** closely resemble Facebook's own engagement-bait example ("LIKE this if you're an Aries!") and the reported description of X's target as posts that "plead for replies". They carry downranking and monetization risk on X as of 2026.
- **Ragebait reliably produces engagement** (Rathje, McLoughlin), but its brand costs are well documented:
  - users report not preferring it (Milli 2025);
  - it triggers the negative actions the ranker penalizes (mute, block, report, "not interested"; -74 and -369 in the 2023 weights);
  - it invites Community Notes;
  - it reinforces the author's own drift toward outrage (Brady 2021).
- **Paul et al.** imply that question posts from a small account will mostly go unanswered. Reply-seeking prompts work better once the audience is larger, or when the post also travels for other reasons, such as its novelty or a strong image.

### Gaps
- No peer-reviewed or primary data was found on X polls' effect on replies or reach.
- No study isolates "which one are you" or "pick one" framing.
- X's official written policy on engagement bait (help center or blog) was not retrieved: blog.x.com returned HTTP 403 to automated fetch. Claims rest on secondary reporting of Bier's posts.
- The actual 2026 Phoenix weights in `home-mixer/params/param.rs` were not inspected.
- Paul et al. report most questions went unanswered but did not report a single verified response-rate figure in the abstract read.

## Q4. What makes people repost or quote-post (identity signaling, usefulness, social currency, awe)?

### Takeaway
Reposting is mostly self-presentation and relationship work. People repost to:
- amplify something or inform and entertain their audience;
- publicly agree, or "validate others' thoughts" because "someone else just says it better";
- show they are "in the know".

Interesting, surprising and useful content reflects well on the sharer; practical value was worth about +30% per SD in the NYT data. Identity signaling drives moral and outrage sharing, often without reading.

Quote posts combine commentary with amplification. When they launched, they increased political discourse and its diffusion.

Sharers also guard their own reputation for accuracy: most would need to be paid to share fake news. That favors reposting from a reliably accurate source.

### Cited Findings
- [X/Twitter] boyd, Golder & Lotan (HICSS 2010) list non-exhaustive motives for retweeting:
  - "To amplify or spread tweets to new audiences";
  - "To entertain or inform a specific audience, or as an act of curation";
  - "To comment on someone's tweet by retweeting and adding new content, often to begin a conversation";
  - "To make one's presence as a listener visible";
  - "To publicly agree with someone";
  - "To validate others' thoughts (e.g., ... because sometimes, someone else just says it better)";
  - "As an act of friendship, loyalty, or homage";
  - "To recognize or refer to less popular people or less visible content";
  - "For self-gain, either to gain followers or reciprocity from more visible participants";
  - "To save tweets for future personal access".
  - Source: [boyd et al. 2010 PDF](http://www.danah.org/papers/TweetTweetRetweet.pdf); [DOI](https://doi.org/10.1109/HICSS.2010.412)
- [X/Twitter] The same paper analyzed 720,000 random tweets (26 January to 13 June 2009) and 203,371 retweets (20 April to 13 June 2009).
  - 52% of retweets contained a URL, against 22% of all tweets.
  - 18% of retweets contained a hashtag, against 5% of all tweets: "hashtag usage and linking are overrepresented in retweets".
  - One participant said: "Everything is urgent so only the fun and interesting stuff gets the RT."
  - Source: [boyd et al. 2010 PDF](http://www.danah.org/papers/TweetTweetRetweet.pdf)
- [NYT email] Berger & Milkman: "Self-presentation motives also shape transmission ... people may share interesting or surprising content because it is entertaining and reflects positively on them (i.e., suggests that they know interesting or entertaining things)." Practical value was worth +30% and interest +25% per +1 SD. — [Berger & Milkman PDF](https://faculty.wharton.upenn.edu/wp-content/uploads/2011/11/Virality.pdf)
- [X/Twitter] Vosoughi et al.: novel information "conveys social status on one that is 'in the know'". — [Vosoughi et al. 2018 PDF](https://politics.media.mit.edu/papers/Vosoughi_Science.pdf)
- [Lab + ~20,000 everyday conversations; not Twitter] Berger & Iyengar (*Journal of Consumer Research* 2013): "Compared to oral communication, written communication leads people to mention more interesting products and brands", driven by "communication asynchrony and self-enhancement concerns". — [Berger & Iyengar 2013](https://doi.org/10.1086/671345)
- [Facebook + X/Twitter] For outrage-evoking misinformation, a proposed mechanism is signaling. People may share without checking accuracy because sharing signals their moral position or group membership. — [Kellogg School summary of McLoughlin et al. 2024](https://www.kellogg.northwestern.edu/academics-research/research/detail/2024/misinformation-exploits-motivations-to-share-outrage-online/)
- [Review] Brady, Crockett & Van Bavel's MAD model (*Perspectives on Psychological Science* 2020) "posits that people have group-identity-based motivations to share moral-emotional content, that such content is especially likely to capture our attention, and that the design of social-media platforms amplifies" these tendencies. — [MAD model 2020](https://doi.org/10.1177/1745691620917336)
- [X/Twitter] Moral contagion spreads more within ideological networks than between them. — [Brady et al. 2017](https://doi.org/10.1073/pnas.1618923114)
- [Facebook + X/Twitter] In-group language predicted "love" reactions, and out-group language predicted "angry" reactions. — [Rathje et al. 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8256037/)
- [X/Twitter] Garimella, Weber & De Choudhury (WebSci 2016) studied quote retweets, introduced in April 2015. Using content, network and crowd-labeled data on political users, they found that "the feature has increased political discourse and its diffusion, compared to existing features". — [Garimella et al. 2016](https://doi.org/10.1145/2908131.2908170); [arXiv 1603.07933](https://www.arxiv.org/abs/1603.07933)
- [X/Twitter, primary] The 2026 ranker models "quote", "share via DM", "share via copy link" and "quoted post" clicks as separate predicted actions, so private sharing and quoting are explicit ranking inputs. — [xai-org/x-algorithm README](https://github.com/xai-org/x-algorithm)
- [Lab] Sharers have reputational skin in the game. One fake-news share costs more trust than one true share earns, and most people "would have to be paid to share fake news". — [Altay et al. 2020](https://doi.org/10.1177/1461444820969893)
- [Lab + X/Twitter field] "Most participants say it is important to share only accurate news." — [Pennycook et al. 2021](https://doi.org/10.1038/s41586-021-03344-2)
- [Other] "Emotional ads are shared more on general platforms (Facebook, Google+, Twitter) than on LinkedIn, and the reverse holds for informational ads." — [Tellis et al. 2019](https://doi.org/10.1177/0022242919841034)

### Inferences
- **Design fact posts as social currency.** The reposter should look smart, in the know, or helpful to their followers. The NYT data points to surprising-plus-useful ("practical value") content. The "someone else just says it better" motive points to crisp, quotable phrasing of a true point the audience half-knows.
- **The 2026 ranker explicitly predicts DM shares and copy-link shares.** "Send this to someone" utility is likely rewarded: facts that settle a common argument, or that are personally relevant. This is an inference from the action list, since weights are unpublished.
- **Quote posts reward clear, quotable claims.** A clear claim gives quoters something to add to. The same mechanism also carries criticism. Quote-post evidence comes from political discourse in 2015-2016, and nothing was found for non-political fact content.
- **Accuracy is a repost asset.** Reposters protect their own epistemic reputation (Altay 2020; Pennycook 2021), so a consistently accurate source is lower-risk to amplify. This rests on lab evidence of sharer motives, not on measured repost rates for accurate accounts.
- **Identity-based sharing.** In-group pride (the "love" reactions) is the brand-safe version of identity sharing; out-group derogation is the risky version. For a fact brand, plausible safe identity hooks are communities of interest such as "for anyone who studied chemistry". This is untested.

### Gaps
- No quantitative study of quote-post motivations for non-political content was found. Follow-up work on civility and broadcasting in quote tweets surfaced only in search snippets and was not verified.
- No X study measuring identity signaling for non-political educational content was found.
- Lee & Ma (2012), "News sharing in social media: the effect of gratifications and prior experience", was located ([DOI](https://doi.org/10.1016/j.chb.2011.10.002)), but its abstract was not available, so its findings on status-seeking and news sharing are not reported here.

## Q5. What do viral educational or fact posts have in common (a visual, a one-line hook, a specific number, a named source)?

### Takeaway
The evidence supports this combination:
- a high-quality visual that fits the text;
- a concrete number;
- a surprising, specific claim with a conclusive verdict;
- positive high-arousal emotion (awe or amusement);
- no sensational styling.

**Images.** Older evidence is strongest for images:
- +35% retweets for verified accounts in Twitter's own 2014 study;
- a robust "mere presence" effect of images on Twitter engagement in a peer-reviewed study;
- about 6x retweets for #SciComm tweets with images (2020-21, descriptive).

Newer practitioner data (2025-26) shows text-only posts matching or beating images on X, so the image advantage is format- and era-dependent.

**Other features.** Numbers were worth +17% in 2014. Clickbait styling lowers credibility, and in one 2026 experiment the damage was largest for true content. No study isolating the engagement effect of naming a source was found.

### Cited Findings

#### Visuals and format
- [X/Twitter, platform's own analysis, 2014] Twitter analyzed more than 2 million tweets from 1,000 verified users across TV, news, music, sports and government/politics, published March 2014.
  - Retweet lift by feature: photo URL +35%, video URL +28%, quote +19%, number (such as a sports statistic) +17%, hashtag +16%. Links were also said to boost engagement, but no figure was given.
  - In TV, quotes gave +53% and photos +46%. In sports, video gave the smallest increase, +15%.
  - Twitter's Simon Rogers said "it's important to think of your tweeting holistically".
  - Source: [Associations Now, 25 March 2014](https://associationsnow.com/2014/03/study-youre-tweeting-add-photo-higher-engagement/); [The Drum](https://www.thedrum.com/news/2014/03/12/photos-lead-35-boost-retweets-while-hashtags-cause-16-more-retweets)
- [X/Twitter + Instagram] Li & Xie (*Journal of Marketing Research* 2020) studied airline and SUV brand posts.
  - "After accounting for selection bias on the inclusion of image content, the authors find a significant and robust positive mere presence effect of image content on user engagement in both product categories on Twitter."
  - "High-quality and professionally shot pictures consistently lead to higher engagement on both platforms."
  - "The presence of human face and image–text fit can induce higher user engagement on Twitter but not on Instagram."
  - Source: [Li & Xie 2020](https://doi.org/10.1177/0022243719881113)
- [X/Twitter] A university summary of Li & Xie reports that tweets with a picture hyperlink, rather than an embedded image, got less engagement than even text-only tweets. Exact effect sizes for any Li & Xie figure were not verified. Secondary sources cite inconsistent figures (200% vs 119%). — [Baylor Keller Center summary](https://kellercenter.hankamer.baylor.edu/news/story/2021/using-images-increase-social-media-engagement)
- [X/Twitter, science communication] Mondal et al. (*Exploration of Digital Health Technologies* 2023) analyzed 656,992 #SciComm tweets from 176,863 users (28 May 2020 to 28 May 2021) using Symplur.
  - Text-only tweets averaged 0.7 retweets, and tweets with an image averaged 4.4: a "529% increase", or 6.3-fold.
  - Image plus link gave a "350% increase", so the effects were not additive.
  - The analysis was descriptive only, with no significance tests. The journal's editor-in-chief is a co-author.
  - Source: [Mondal et al. 2023](https://www.explorationpub.com/Journals/edht/Article/10115)
- [X/Twitter, practitioner, secondary] Buffer's study of 18.8 million posts from 71,000 X accounts (August 2024 to August 2025) found, for Premium accounts:
  - text posts led at roughly 0.9% median engagement by mid-2025;
  - video sustained more than 0.7%;
  - images were at about 0.4-0.5%.
  - For regular accounts, images fell to about 0.2%, and overall engagement fell to around 0.25% after March 2025.
  - Source: [Influencer Marketing Hub coverage](https://influencermarketinghub.com/x-premium-users-get-10x-more-reach-report/)
- [X/Twitter, practitioner, secondary] Buffer's 2026 engagement report found that on X, "text posts led at 3.56%, slightly ahead of images at 3.40%" median engagement. The engagement-rate definition evidently differs from the study above. — [SocialEcho summary](https://www.socialecho.net/en/blog/docs/2026-social-media-engagement-report-52m-posts-insight)
- [X/Twitter, practitioner, secondary] Adilo analyzed 3,200+ X posts. Text-only posts had the highest average engagement (~3.24%), images ~2.1% and video ~1.34%. — [Adilo blog](https://adilo.com/blog/?p=20988)
- [X/Twitter, primary] The 2026 ranker predicts "photo expand", "dwell" and "dwell time" as actions. Visuals that invite a tap and posts that hold attention are explicit ranking inputs, though the weights are unpublished. — [xai-org/x-algorithm README](https://github.com/xai-org/x-algorithm)

#### Hook, novelty and verdict
- [NYT email] Per +1 SD: awe +30%, practical value +30%, interest +25%, surprise +14%, sadness -16%. — [Berger & Milkman PDF](https://faculty.wharton.upenn.edu/wp-content/uploads/2011/11/Virality.pdf)
- [Other] Trivia-worthiness comes from surprising category membership ("Obama's Grammy", "Elvis' stint as a tank gunner"). Such facts raised dwell time by 12% and cut bounce by 22% on search pages. — [Tsurel et al.](https://arxiv.org/abs/1612.03896)
- [Social media, snippet-level] Conclusive fact-checks (true or false) are shared more than inconclusive ones. — [Li & Chang 2022 listing](https://business.oregonstate.edu/biblio/combating-misinformation-sharing-truth-study-spread-fact-checks-social-media)
- [X/Twitter] Novel information is more likely to be retweeted. — [Vosoughi et al. 2018 PDF](https://politics.media.mit.edu/papers/Vosoughi_Science.pdf)

#### Numbers
- [X/Twitter, 2014] Including a number (such as a statistic) gave +17% retweets. — [Associations Now](https://associationsnow.com/2014/03/study-youre-tweeting-add-photo-higher-engagement/)

#### Links and sources
- [X/Twitter, 2009] URLs were overrepresented in retweets: 52% of retweets against 22% of all tweets. — [boyd et al. 2010 PDF](http://www.danah.org/papers/TweetTweetRetweet.pdf)
- [X/Twitter, primary] The 2026 ranker predicts "link" clicks as one action and discounts out-of-network posts. The README read for these notes says nothing about a link penalty. — [xai-org/x-algorithm README](https://github.com/xai-org/x-algorithm)
- [X/Twitter, secondary] Practitioner blogs discuss whether X demotes posts with links. One example is a Martechs post, "Do posts with links affect content performance on X?", found in search results but not read. — [Martechs blog](https://blog.martechs.io/2025/10/15/do-posts-with-links-affect-content-performance-on-x)
  - In this research, link-demotion claims surfaced only in lower-reliability blogs and aggregators, and none were confirmed against official X sources (see Gaps).

#### Styling and credibility
- [Lab] Molyneux & Coddington (*Journalism Practice* 2019): "clickbait headlines may lower perceptions of credibility and quality", while "writing proficiency is more closely linked to these perceptions". — [Molyneux & Coddington 2019](https://doi.org/10.1080/17512786.2019.1628658)
- [Lab, in press] Craig, Tsang & Vijaykumar ("The Clickbait Paradox", *PLoS ONE*, accepted 2026) ran a within-subjects experiment with 203 adults.
  - Perceived truthfulness and credibility were "significantly lower for posts with clickbait features and for false content".
  - "The harmful effect of clickbait was stronger for factually accurate posts."
  - Engagement intentions were low overall and especially for clickbait. The drop for clickbait was concentrated among participants with higher media literacy.
  - Source: [Northumbria research portal](https://researchportal.northumbria.ac.uk/en/publications/the-clickbait-paradox-why-sensationalist-styling-damages-trustwor/)
- [Lab] Debunking effectiveness depends on text being "comprehensive, trustworthy and persuasive" more than on structure or headline format. — [Kotz et al. 2023](https://doi.org/10.1111/bjhp.12670)

### Inferences
- **A composite pattern supported by the evidence:**
  1. One surprising, specific, true claim, phrased as a conclusive verdict and new to the audience (Vosoughi; Li & Chang; Tsurel).
  2. A concrete number (2014: +17%).
  3. A native, high-quality image with good text fit, ideally with a human face. The image should not be a link to an image (Li & Xie).
  4. An awe or amusement register rather than outrage (Berger & Milkman; Tellis).
  5. Plain rather than sensational styling, which protects credibility exactly where an accuracy brand needs it (Craig et al.; Molyneux & Coddington).
  6. A useful angle, so the post is worth sending to someone (practical value +30%; DM and copy-link shares in the 2026 ranker).
- **The image advantage is weaker on today's X than in 2014.** Practitioner data from 2025-26 shows text-only posts at parity or ahead. Images likely help most when they carry the fact (a chart, a labeled photo, a striking object) rather than decorating it.
- **Named sources are a credibility and risk-control device, not a proven engagement driver.** They support the accuracy reputation that reposters rely on (Altay 2020) and lower the odds of a Community Note, which would cut reposts by ~46% (Slaughter 2025).
- **Timing matters for evergreen facts.** The 2026 ranker filters out posts older than 48 hours from candidates, so an evergreen fact has a short window in recommendations.

### Gaps
- No study was found that measures whether naming a source ("per NASA", "according to a 2019 study") changes reposts or likes on X.
- No study was found on the "TIL" or "Today I learned" label itself as a hook on X.
- Precise-versus-round number effects on credibility or sharing (consumer-psychology literature) were not retrieved within the search budget.
- Whether X currently demotes posts that contain external links could not be verified from primary sources. The 2026 README read here does not state it. This is adjacent to algorithm research being done separately.
- Exact Li & Xie (2020) effect sizes were not verified, and secondary sources conflict.
