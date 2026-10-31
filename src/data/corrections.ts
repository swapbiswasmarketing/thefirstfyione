/* The public corrections log, newest first, rendered at /corrections/.

   One row per correction of fact: what an entry got wrong, what it says now,
   and the day the fix shipped. Wording, formatting and link edits are not
   corrections and are never logged here. Every entry corrected for a fact also
   gets updatedDate set to the day of the fix, so its dateline says "Updated"
   (the promise made on /about/#corrections and /how-we-work/). */
export interface Correction {
  /* YYYY-MM-DD, the day the fix went live. */
  date: string;
  /* Entry slugs (file names in src/content/blog without .md). */
  entries: string[];
  /* What the entry said, in one or two plain sentences. */
  wrong: string;
  /* What it says now, and on what evidence. */
  fixed: string;
}

export const corrections: Correction[] = [
  {
    date: "2026-10-31",
    entries: ["what-are-the-names-of-santas-reindeer"],
    wrong:
      "The entry said Dunder and Blixem, the names the poem 'A Visit from St. Nicholas' gave its last two reindeer when it first appeared in 1823, were English spellings of two Dutch words, donder for thunder and bliksem for lightning.",
    fixed:
      "Blixem was itself a Dutch spelling: a Leeuwarden newspaper of March 6, 1804 reported heavy weather 'van Donder en Blixem', of thunder and lightning, at Antwerp. The entry now says Dunder and Blixem stand for the Dutch words donder and bliksem, and that Blixem was an older Dutch spelling, not an English respelling.",
  },
  {
    date: "2026-10-31",
    entries: ["why-do-flies-rub-their-hands"],
    wrong:
      "The entry said, in its description and opening answer, that a fly grooms itself 'head to tail', said the 2014 eLife paper it cited reports 'a suppression hierarchy running head to tail', and headed that section 'Dust a fruit fly and it cleans front to back', though its table and an FAQ answer gave the order correctly. Its description and closing paragraph also described a fly's feet as suction cups.",
    fixed:
      "The eLife paper, by Andrew Seeds and colleagues, gives the priority order as eyes, antennae, abdomen, wings, thorax, so the sequence ends at the thorax, just behind the head, rather than running head to tail; the entry now says a dust-covered fruit fly cleans its head first, then its abdomen, wings and thorax. The 1998 paper by Stanislav Gorb that the entry cites describes the pads on a fly's feet as covered in hairs, called tenent setae, that increase the area of attachment to the surface, and as delivering an adhesive secretion; the entry now calls them adhesive pads.",
  },
  {
    date: "2026-10-31",
    entries: ["why-do-hyenas-laugh"],
    wrong:
      "The entry said Nicolas Mathevon and colleagues 'found the laugh is produced by animals kept away from a kill by higher-ranking clanmates', and its table gave the giggle's reach as 'The scrum around the carcass', set against the whoop's 'Audible up to 5 km'. It also said neither the giggle's pitch nor its steadiness is 'under the caller's control', and called the giggle 'involuntary'.",
    fixed:
      "The 2010 BMC Ecology study recorded captive hyenas at Berkeley as they were teased with a bone or meat through a fence, none at a carcass, and credits earlier field researchers with observing that giggles are often produced during food contests by animals kept off a kill by higher-ranking ones. It also says giggles, though made at close quarters, 'are loud and propagate over great distances'. The entry now says both, gives the giggle's reach as made at close range but loud enough to carry, and no longer says the giggle is involuntary or that its pitch and steadiness are beyond the caller's control, which no cited source tested.",
  },
  {
    date: "2026-10-31",
    entries: ["why-is-bird-poop-white"],
    wrong:
      "The entry's title said the white part of a bird dropping is pee 'and Not Uric Acid', and its text said the compound credited for the colour 'did not show up in a single sample the last time anyone checked', referring to a 2019 X-ray study of six species. A heading also called Bob Folk's 1969 paper a correction that was 'lost by 1971', when a study of a single budgerigar reported uric acid dihydrate.",
    fixed:
      "The 2019 study was not the last check: a 2025 study in the Journal of the American Chemical Society matched the X-ray pattern of a greater rhea's urate to uric acid monohydrate, a form of uric acid, and calls Folk's position 'the erroneous claim that birds do not excrete uric acid, a direct challenge to consensus opinion'. The entry now says what the white part is made of is disputed, gives both the 2019 and the 2025 results, and describes Folk's paper as a challenge to the consensus.",
  },
  {
    date: "2026-10-31",
    entries: ["why-are-cats-afraid-of-cucumbers"],
    wrong:
      "The entry said that in a 2014 PLOS ONE study of two Japanese macaques, pulvinar neurons fired at a snake in threat display at 55.3 ms and at 'a snake in a harmless posture' at 56.2 ms, and that 'the timing did not separate danger from safety'.",
    fixed:
      "The paper says all its images are of live venomous vipers, three with the mouth open in threat display and three with it closed in postures it calls less threatening, so none of the snakes shown was harmless. The entry now says every picture showed a live venomous viper and gives mean latencies of 55.3 ms for the threat displays and 56.2 ms for the closed-mouth, non-threat postures, a gap the authors report as not significant, adding that 45 of the 78 neurons tested with every picture fired harder at the threat displays.",
  },
  {
    date: "2026-10-31",
    entries: ["why-do-whales-explode"],
    wrong:
      "The entry said the sperm whale that burst in a Tainan street on 26 January 2004 had stranded on 17 January, nine days earlier. It also said the putrefaction heading in the taxonomy of the archive at theexplodingwhale.com held two burst carcasses, Tainan and a California whale in August 2005.",
    fixed:
      "Of the reports the entry cites, only MSNBC's gives that date, saying the whale had died on 17 January; Taiwan News reported that a fisherman found it still alive on the Yunlin County shore on the Saturday before it burst and that it was dead by the time rescuers arrived that afternoon, and the Taipei Times said it was found dead on Sunday. The entry now gives the Taiwan News account, says the whale burst on 26 January, a Monday, and notes that MSNBC and the Taipei Times disagree. The archive's page on the August 2005 case, a humpback at Half Moon Bay, California, says the whale 'did not actually explode'; the entry now says so, and that the Tainan and Faroe Islands bursts are filed under putrefaction beside it.",
  },
  {
    date: "2026-10-31",
    entries: ["why-is-greenland-called-greenland"],
    wrong:
      "The entry said that western Greenland was cold when the Norse arrived and, in an FAQ answer, that 'the wider climate was not warm', citing beryllium-10 dating of moraines that put glaciers at or near their Little Ice Age maximum from about 975 to 1275 CE; quoting what it called the authors' 'blunt' conclusion that 'the western North Atlantic region remained cool', it said the medieval warmth people are picturing 'happened on the other side of the ocean'. It also said the 2007 Dye 3 ice-core paper was 'equally clear' that its four dating methods gave overlapping dates between 450,000 and 800,000 years ago for the silty ice holding its forest DNA, and that the forest 'was gone long before anatomically modern humans existed'. Its description said Erik the Red's sales pitch for the name 'survives only in a sentence written about 140 years later'.",
    fixed:
      "The moraines lie at about 70 degrees north, around Baffin Bay, and the study's authors write that other proxy data 'suggest' the western North Atlantic stayed cool; Northwestern University's lake records from near Narsaq, beside the southern Norse farms, show southern Greenland relatively warm when the Norse lived there, about 1.5 degrees Celsius above the cooler centuries around it, and a 2022 record from a lake beside a former Norse farm found no substantial temperature changes during the settlement period. The entry now says the moraines speak for the Baffin Bay region rather than for the farms, which show no medieval chill. The Dye 3 authors add that they 'cannot rule out the possibility of a LIG age' for the basal ice, meaning the Last Interglacial, about 130,000 to 116,000 years ago; the entry now gives that caveat, says even that youngest reading puts the forest more than a hundred thousand years before any Norse ship, and no longer mentions modern humans. The pitch survives in later texts too: Landnamabok has Erik say that 'many men would desire to visit it if he gave the land a good name', and the Saga of Erik the Red, which the entry quotes, has 'Men will desire much the more to go there if the land has a good name'. The description now says the pitch survives first in a sentence written about 140 years later.",
  },
  {
    date: "2026-10-31",
    entries: ["what-is-an-irish-goodbye"],
    wrong:
      "The entry said, in its description, almanac, opening answer, an FAQ answer and a heading, that English speakers were saying 'take French leave' by 1741, and in its text that the phrase was therefore in print 15 years before the Seven Years' War began in 1756. Its evidence was the earliest example in Green's Dictionary of Slang, from an anonymous novel called Benedicta that Green's dates to 1741.",
    fixed:
      "The edition of Benedicta that Green's quotes does read 'M.DCC.XLI' on its title page, but it was printed for William Lane 'at the Minerva', a press active from 1790, and it quotes Lavater, who was born in 1741; archive.org catalogues it as 1791. Quartz reported in 2017 that the Oxford English Dictionary traces French leave back to The Polite Politician, a collection dated 1751, whose satirical rondeau already calls French leave 'a phrase we had often in use'. The entry now says English speakers were saying 'take French leave' by 1751 and that the phrase was in print at least five years before the war began, and it explains why the 1741 date cannot be right.",
  },
  {
    date: "2026-10-31",
    entries: ["how-do-birds-mate"],
    wrong:
      "The entry said biologists usually call the bird organ a phallus 'because it evolved separately from the mammalian penis, as BBC Wildlife's Stuart Blackman points out', stating that separate origin as fact.",
    fixed:
      "That separate origin is disputed: a 2015 Biology Letters paper from Martin Cohn's lab reports that tuatara embryos start to form genitals although adult tuataras have no intromittent phallus, a finding it says 'suggests a single evolutionary origin of amniote external genitalia'. The entry now gives the separate origin as Blackman's reason for the stricter word and says the claim is disputed.",
  },
  {
    date: "2026-10-31",
    entries: ["why-do-bees-die-after-stinging"],
    wrong:
      "The entry said the popular idea that a honey bee sacrifices herself for the hive was 'folklore assembled backwards from the outcome', since 'a mechanism that anchors in one kind of tissue and slides out of another is not an act of will', and it headed the section 'The suicide reading is a story we added'. It also said Jianing Wu and three colleagues at Tsinghua University fixed each of about thirty honey bee stings upright and drove it into small cubes of agar, silica gel, soft rubber and paraffin wax.",
    fixed:
      "The 2021 Insects paper by Bissessarsingh and Starr, which the entry cites, reports that the prevailing opinion follows Charles Darwin in treating sting autotomy as favoured by natural selection in the interest of the colony as a whole, 'and therefore in no way maladaptive', and sets that against Jurgen Tautz's suggestion that the bee's failure to withdraw her sting from a vertebrate may be an evolutionary mistake. The entry now calls the sacrifice itself the mainstream reading; what it calls a story people added is the idea that the bee chooses it. The 2014 PLOS ONE paper says the team selected 30 stings, pushed 20 of them into the cubes and used the other 10 for electron microscopy, and the entry now says 20 of the 30 were driven in.",
  },
  {
    date: "2026-10-31",
    entries: ["is-mars-really-red"],
    wrong:
      "The entry said, in its title and description, that Mars is red only from a distance, and in its opening line that a camera pointed at the ground directly under a Mars rover sends back a picture that 'is not red'. A heading said the air on Mars did not do the rusting, and an FAQ that asked what made the rust 'if there is no oxygen in the Martian air' answered that ferrihydrite in Martian dust 'points to liquid water rather than air as the source'. The entry's closing called the rusty powder on the surface a leftover from 'a wetter, colder world'.",
    fixed:
      "NASA's caption for a 2013 Curiosity image describes 'red residue' in the rover's scoop from a sample of windblown dust and sand, and the entry now says the ground under a rover is usually not red and that Mars looks red mainly from a distance. NASA's Mars fact sheet puts oxygen at 0.16 percent of the atmosphere, and the 2025 Nature Communications study behind the ferrihydrite finding says the key question is whether the iron was 'oxidized by components in the atmosphere or by processes occurring in surface waters on Mars'; the entry now says today's Martian air holds almost no oxygen and that what oxidised the iron is still unknown. The study also says the weathering that formed the mineral may have happened at near-freezing surface temperatures, against a present-day average of about -70 C, and the entry now calls the rusty powder, if the ferrihydrite analysis holds, a leftover from a cold, wet early Mars.",
  },
  {
    date: "2026-10-31",
    entries: ["why-do-roosters-crow"],
    wrong:
      "The entry said, in its text and in an FAQ answer, that light or the sound of another rooster crowing can set a rooster off 'at any hour' or 'at any time of day', with the response strongest in the morning.",
    fixed:
      "In the 2013 Current Biology tests, half an hour of light, or of a recording of familiar roosters crowing, set the birds crowing when given early in their subjective day, the start of their internal day, but drew no crowing at all when given in their subjective night. The entry now says so, in its text and in that FAQ answer.",
  },
  {
    date: "2026-10-31",
    entries: ["how-is-paper-made"],
    wrong:
      "The entry stated as settled fact, in its text and in an FAQ answer, that Friedrich Gottlob Keller, who ground wood into pulp in Saxony in 1844, was granted a Saxon patent on 26 August 1845; the text added that it was applied for in his name and that of Heinrich Voelter, technical director of the Bautzen paper mills.",
    fixed:
      "The Neue Deutsche Biographie and the older Allgemeine Deutsche Biographie, which the entry cites, date a Saxon patent to August 1845, but the Saechsische Biografie says Keller could not get a patent on the grinding method on his own: the Saxon privilege he received in 1845 was for making tanning extract and bark paper from conifer bark, and Voelter later paid him 700 thalers in instalments for a share in that privilege and for instruction in the grinding method. A 2016 history of the invention says a five-year patent on the grinding process, which Voelter pursued, was granted in 1847. The entry now gives that account and the 1847 date; its FAQ no longer mentions a patent.",
  },
  {
    date: "2026-10-31",
    entries: ["what-does-skol-mean"],
    wrong:
      "The entry said, in a heading, that Thomas Percy put the enemies into Ragnar's mouth: the drinking line names no enemies in the Norse or the Latin, Aylett Sammes and Sir William Temple mention them only in their own narration, and Percy's 1763 version has Ragnar say 'we shall drink Beer out of the sculls of our enemies'.",
    fixed:
      "Paul-Henri Mallet's French version, printed in Copenhagen in 1756, seven years before Percy's, already has Ragnar himself speak of drinking beer 'dans les cranes de nos ennemis', in the skulls of our enemies; Percy quotes Mallet in his introduction to the poem, and his version of the stanza follows Mallet's French sentence by sentence. The entry now says Mallet and Percy put the enemies into Ragnar's mouth: Mallet's French had the line by 1756, and Percy put it into English in 1763.",
  },
  {
    date: "2026-10-31",
    entries: ["what-is-a-group-of-turkeys-called"],
    wrong:
      "The entry said in passing that the 1486 Book of St Albans was the source of the term 'an unkindness of ravens'.",
    fixed:
      "The term is older than that book: as this site's entry on ravens explains, William Caxton printed 'an vnkindnes of rauons' around 1476, and a manuscript list dated to about 1452 has the term too. The entry no longer calls the book the term's source; it now says the 1486 list gives 'a Mustre of Pecockys' and an unkindness of ravens, but no turkey.",
  },
  {
    date: "2026-10-31",
    entries: ["why-tennessee-is-the-volunteer-state"],
    wrong:
      "The entry said the sequence ran backwards from the way it is usually told: the name 'Volunteer State' arrived first, in peacetime, and the War of 1812 was fitted to it afterwards as an explanation.",
    fixed:
      "The Tennessee State Library and Archives post the entry relied on says the phrase was never used during the War of 1812 and was in use at least a decade before the Mexican-American War, but it also says most Tennessee historians agree the nickname 'is derived from the War of 1812'; the Tennessee Encyclopedia's entry on the nickname says Tennessee became known as the Volunteer State during that war, and the Tennessee Blue Book's history chapter credits the name to the state's role in 'America's wars of expansion', the Texas Revolution and the Seminole Wars among them. The entry now says instead that, by the archives' account, the reputation and the phrase have different birthdays, and sets out where state sources disagree on when Tennessee became the Volunteer State.",
  },
  {
    date: "2026-10-31",
    entries: ["where-did-sushi-originate"],
    wrong:
      "The entry said, citing the historian Eric Rath, that street vendors sold the first nigiri in the mornings with a little ice, setting out ice, fish and rice because the food had 'a very short shelf life'.",
    fixed:
      "Rath offered the ice only as a possibility: 'You might have people who put out some ice and put out some fish,' he said, adding that, with smaller fish, people 'could probably have sushi for a few hours'. The entry no longer mentions ice; it keeps Rath's point that nigiri, as nineteenth-century street food, at first had 'a very short shelf life', and says, following the sushi historian Terutoshi Hibino, that the first nigiri used fish marinated in salt, vinegar or soy sauce, or boiled or grilled, to keep it from spoiling.",
  },
  {
    date: "2026-10-31",
    entries: ["where-do-hamsters-come-from"],
    wrong:
      "The entry said that the three dwarf hamster species common as pets make up the genus Phodopus.",
    fixed:
      "The 2022 VetCompass study the entry cites says the National Hamster Council recognises four dwarf hamster species, among them the Chinese dwarf hamster, Cricetulus griseus, a species outside Phodopus; of the 16,605 pet hamsters in the study, 163 were Chinese dwarf hamsters, more than the 52 Campbell's dwarf hamsters. The entry now says that the Djungarian and Roborovski's hamsters belong to Phodopus, whose three species live only in the dry steppe and desert of central Asia.",
  },
  {
    date: "2026-10-31",
    entries: ["when-were-sunglasses-invented"],
    wrong:
      "The entry said, in its opening answer, an FAQ answer and its table, that Foster Grant made sunglasses a fashion item, starting at a Woolworth's on the Atlantic City Boardwalk in 1929.",
    fixed:
      "Yankee magazine credits Foster Grant with pioneering sunglasses as a fashion item, but other sources tell it differently. A 1972 history of the firm, Glenn D. Kittler's More Than Meets the Eye, says Foster Grant's first sunglasses sold for ten cents a pair and were 'marketed as a kiddie item,' and the British Optical Association Museum dates the turn to fashion to the 1930s, when 'Hollywood celebrities helped popularise sunglasses, making them fashionable beyond their functional purpose.' The entry now says Foster Grant was selling plastic sunglasses by 1929 and gives the fashion claim as Yankee's and a business directory's, set against the history and the museum.",
  },
  {
    date: "2026-10-31",
    entries: ["when-were-dinosaurs-discovered"],
    wrong:
      "The entry quoted Pliny, the Roman encyclopedist, as writing of an Arabian named Gabbara, 'exactly of the height of Goliath, viz. nine foot nine inches high.'",
    fixed:
      "The words are Robert Plot's, from his retelling of Pliny's story in The Natural History of Oxford-shire (1677). The entry now says Pliny had written of Gabbara, a man brought from Arabia in the reign of Claudius, who was, in Plot's words, 'exactly of the height of Goliath, viz. nine foot nine inches high.'",
  },
  {
    date: "2026-10-31",
    entries: ["what-came-first-the-chicken-or-the-egg"],
    wrong:
      "The entry's FAQ asked 'What is the oldest known egg fossil?' and answered with the oldest known amniote eggs, Early Jurassic sauropodomorph dinosaur eggs from 195 to 192 million years ago.",
    fixed:
      "Those are not the oldest egg fossils: Wikipedia's article on fish egg fossils says the fossil record of fish eggs goes 'at least as far back as the Devonian', a period that ended 358.9 million years ago. The FAQ now asks 'What are the oldest known amniote eggs?', and the entry now says that fish eggs, laid in water, have a fossil record going at least as far back as the Devonian.",
  },
  {
    date: "2026-10-31",
    entries: ["why-is-it-called-a-poop-deck"],
    wrong:
      "The entry said the compound 'poop deck' was attested from 1779, so that English had a poop on its ships for nearly four centuries before anyone added the word deck. It called the compound the youngest entry on its list of dates, later even than the 1744 it gave for poop meaning excrement.",
    fixed:
      "Merriam-Webster gives 1717 as the first known use of 'poop deck', and Grammarphobia's account of the word, drawn from the Oxford English Dictionary, says it was first recorded in 1717. The entry now gives 1717, which comes before the 1744 it gives for poop meaning excrement, and no longer says the words were joined nearly four centuries after the ship's poop reached English.",
  },
  {
    date: "2026-10-31",
    entries: ["when-was-the-fax-machine-invented"],
    wrong:
      "The entry said Xerox announced the Magnafax Telecopier in 1966.",
    fixed:
      "In Jonathan Coopersmith's history of the fax machine, Xerox and Magnavox announced the Telecopier on 11 November 1965, and the machine was delivered in July 1966; the entry now gives both dates.",
  },
  {
    date: "2026-10-31",
    entries: ["why-does-easter-change-every-year"],
    wrong:
      "The entry said the Episcopal Church's Book of Common Prayer finds a year's Golden Number by adding 1 to the year and dividing by 19, and that 'the remainder is the year's Golden Number.' Followed as written, that rule leaves a remainder of 0 one year in 19, as in 2013 and 2032.",
    fixed:
      "The prayer book's rule goes on: 'If nothing remains, then 19 is the Golden Number.' Its table for finding Easter Day lists 2013 and 2032 under Golden Number 19, and the entry now says the remainder, or 19 if nothing remains, is the year's Golden Number.",
  },
  {
    date: "2026-10-31",
    entries: ["what-is-a-flat-white"],
    wrong:
      "The entry's description called Sydney and Wellington 'the two cities that claim' the flat white.",
    fixed:
      "Sydney and Wellington are not the only places with a claim: the historian Garritt Van Dyk, writing in The Conversation, says there are 'many claims regarding the origin of the flat white, from England to New Zealand', and Google's 2024 doodle for the drink says many speculate it 'popped up on menus in Sydney and Auckland around the same time'. The description now calls Sydney and Wellington 'the two best-known claimants'.",
  },
  {
    date: "2026-10-31",
    entries: ["what-was-the-first-video-game"],
    wrong:
      "The entry's closing line, which paired five tests for the first video game with years, said 'Real-time play gives you 1958', the year of Tennis for Two. It also said copies of Spacewar! travelled to PDP-1 installations at Stanford, the University of Minnesota and Bolt Beranek and Newman.",
    fixed:
      "Wikipedia's article on the early history of video games describes games whose graphics updated in real time before 1958, among them a pool game that updated its graphics forty times a second, written for a 1954 demonstration of the University of Michigan's MIDSAC computer; the closing line now reads 'A computer game made to entertain rather than to sell a technology gives you 1958.' Wikipedia's article on Spacewar! records that the University of Minnesota's version was a 1967-68 recreation for a different computer, a CDC 3100, and the entry no longer names Minnesota: it now says that Russell followed John McCarthy to Stanford, that the game's program tapes were soon, in Martin Graetz's words, 'showing up all over the country', and that the PDP-1 at Bolt, Beranek and Newman ran it too.",
  },
  {
    date: "2026-10-31",
    entries: ["why-is-caviar-so-expensive"],
    wrong:
      "The entry said that because a female beluga sturgeon reproduces once every 4 to 8 years, a fish raised for caviar then 'yields intermittently rather than annually', and that a grower 'waits once for the animal to grow up, and keeps waiting between spawnings'.",
    fixed:
      "Caviar usually comes from a female that is harvested for her roe, not from the same fish spawning after spawning: the 2004 Fish and Wildlife Service rule says 'the female beluga sturgeon is harvested to produce beluga caviar', and an FAO fact sheet on farmed Siberian sturgeon lists stunning, gutting and removal of the ovaries among the steps for caviar. The entry now says that because a female beluga breeds only every few years in the wild, a stock stripped of its breeding females refills slowly, and that a farmed tin, like a wild one, usually costs the whole fish.",
  },
  {
    date: "2026-10-31",
    entries: ["what-does-am-stand-for"],
    wrong:
      "The entry said the everyday convention, 12 a.m. for midnight and 12 p.m. for noon, has no official backing.",
    fixed:
      "The US government's own style manual writes noon as '12 p.m. (12 noon)' and midnight as '12 a.m. (12 midnight)' in its 2008 and 2016 editions. The entry no longer says the convention lacks official backing, and leaves the narrower point to Britain's National Physical Laboratory, which says 'there are no official standards established for the meaning of 12am and 12pm', though 'it is generally accepted that 12am means midnight and 12pm means midday'.",
  },
  {
    date: "2026-10-31",
    entries: ["where-do-truffles-grow"],
    wrong:
      "The entry said brown hyenas in the southern Kalahari, in the plural, turned upwind 21 times in April 1975, sometimes covering as much as 200 meters, and each time dug up a desert truffle, Kalaharituber pfeilii.",
    fixed:
      "The 1978 diet study in Koedoe by M.G.L. Mills and M.E.J. Mills records that the truffle, which the paper calls Terfezia pfeilii, 'was observed to be eaten 21 times by one individual in two nights in April 1975', and Mills's 1977 thesis says that 'On at least seven of these occasions the digging was preceded by an upwind turn of up to 200 m.' The entry now describes one hyena over two nights and at least seven upwind turns.",
  },
  {
    date: "2026-10-31",
    entries: ["how-do-whales-sleep"],
    wrong:
      "The entry said John Lilly wrote in 1964 that dolphins 'lack our unconscious automatic, self-sustained breathing'.",
    fixed:
      "Lilly's words appear in his paper in the December 1958 issue of the American Journal of Psychiatry, which says of dolphins that they 'lack our unconscious, automatic, self-sustaining breathing system'. The entry now dates the remark to 1958 and quotes it as he wrote it.",
  },
  {
    date: "2026-10-31",
    entries: ["half-mast-or-half-staff"],
    wrong:
      "The entry said no surviving record explains what the lowered flag was meant to mean when, in July 1612, the Heart's Ease rejoined her companion ship with her flag hanging down after James Hall, who commanded the expedition, was speared on the west coast of Greenland. It also credited Flags of the World with the reason the custom began at sea, that tall poles with a suitable hoisting mechanism were probably found only on ships, and added: 'There was nowhere on land to half-mast anything.'",
    fixed:
      "The quartermaster John Gatonbe wrote that the ship came in with 'her flag hanging down, and her ancient hanging down over the poop, which was a sign of death', and the entry now says a crewman wrote that it was a sign of death but that no surviving record explains why a lowered flag came to mean one. The tall-poles idea is a 1998 suggestion by one Flags of the World contributor, David Prothero, who wrote of the Middle Ages, 'It's probable that at this time, tall poles with a suitable hoisting mechanism were found only on ships'; the entry now gives it as his suggestion and no longer says there was nowhere on land to half-mast a flag.",
  },
  {
    date: "2026-10-31",
    entries: ["how-were-the-pyramids-built"],
    wrong:
      "The entry said Merer wrote his logbook in 'the last known year of Khufu's reign'. It also said that when the stonemason Franck Burgos used copies of tools found in a quarry of Khufu's on a block, four workers took four days to free it.",
    fixed:
      "Merer's log dates to the year after Khufu's 13th cattle count, regnal year 26-27 if the counts came every two years, and Ancient Egypt Research Associates reports that in 2016 a Japanese team published a later date, the 14th count, from one of the boat pits beside the Great Pyramid; the entry now says so. In their 2020 paper Burgos and the architect Emmanuel Laroze give four days as a reckoning, not a measured time: four people, they calculate, could cut the trenches around a block of about one cubic meter in four six-hour days, and the entry now gives the figure that way.",
  },
  {
    date: "2026-10-31",
    entries: ["what-is-the-longest-word-in-the-world"],
    wrong:
      "The entry said the longest word in the world, counted by letters, is the chemical name of the protein titin, often quoted at 189,819 letters. After naming antidisestablishmentarianism (28 letters) and floccinaucinihilipilification (29), it said Oxford's AskOxford page lists 'longer technical words recorded in the OED, up to pseudopseudohypoparathyroidism (30 letters).'",
    fixed:
      "Oxford's AskOxford page says 'The formal names of chemical compounds are almost unlimited in length', and the entry now says that, counted by letters, the longest word usually cited is titin's chemical name. The page's list of other OED words, 'mainly technical ones', runs from otorhinolaryngological (22 letters) to pseudopseudohypoparathyroidism (30 letters), the only one longer than 29 letters, and the entry now gives that range.",
  },
  {
    date: "2026-10-31",
    entries: ["did-daylight-saving-start-for-farmers"],
    wrong:
      "The entry said that when Congress tried year-round daylight saving a second time, from January 6, 1974 to April 27, 1975, the clocks never went back at all.",
    fixed:
      "The Congressional Research Service records that in October 1974 Congress amended the 1973 law that set up the trial, requiring a return to standard time beginning October 27, 1974, and the entry now ends the year-round spell on October 27, 1974.",
  },
  {
    date: "2026-10-31",
    entries: ["where-do-pearls-come-from"],
    wrong:
      "The entry said a 1991 training manual from a UN Food and Agriculture Organization seafarming project lists 'sand grains' first among the possible nuclei of a pearl, ahead of parasites, eggs and the animal's own cells.",
    fixed:
      "The manual's chapter on pearl formation names possible nuclei 'such as parasites adults or larvae, molluscan eggs, decaying parts of plants, sand grains, epithelium or blood cells of the same animal, etc.', so sand grains come fourth, after parasites and eggs. The entry now says the manual lists sand grains after parasites, molluscan eggs and decaying parts of plants and before the animal's own epithelium or blood cells.",
  },
  {
    date: "2026-10-31",
    entries: ["why-is-a-marathon-26-2-miles"],
    wrong:
      "The entry said World Athletics' marathon page explains the race's distance with two stories: the 'legendary 26-mile run' of Philippides from Marathon to Athens and, for the odd 385 yards, the 1908 London Olympics.",
    fixed:
      "The page says 'The event is named after the legendary 26-mile run', and that at the 1908 London Olympics the distance was 'extended to the imperial measurement of 26 miles' and 'increased another 385 yards'. The entry now says the page uses the legend for the event's name and the 1908 Games for its distance.",
  },
  {
    date: "2026-10-31",
    entries: ["why-do-cowboys-wear-chaps"],
    wrong:
      "The entry said a traveller's description of the leg protection on a Mexican saddle, two undressed calf or goat skins hung at the pommel, was written down in 1828.",
    fixed:
      "The description is in a letter headed 'Mexico, 10th July, 1824' in A Sketch of the Customs and Society of Mexico, a book of letters and a travel journal covering 1824 to 1826 that was published in London in 1828. The entry now dates the description to July 1824 and gives 1828 as the year the book was published.",
  },
  {
    date: "2026-10-31",
    entries: ["what-does-iq-stand-for"],
    wrong:
      "The entry said Binet and Simon's scale of thirty tasks of increasing difficulty ran up to reproducing drawings from memory.",
    fixed:
      "In the 1916 English translation of Binet and Simon's papers, their 1905 series of thirty tests, arranged in order of difficulty, runs up to reversing the hands of a clock and defining abstract terms, and the entry now says so.",
  },
  {
    date: "2026-10-31",
    entries: ["why-is-it-called-an-em-dash"],
    wrong:
      "The entry said typists arrived at the two-hyphen dash three and a half centuries after Maurice Kyffin's 1588 translation of Terence's Andria, that every glyph in every font on screen is still drawn inside the em square, and that Brian Phillips dated the theory that em dashes mark chatbot prose to 'around this past February'.",
    fixed:
      "William Hickox's Correspondent's Manual, a 1902 guide for stenographers and typewriter operators, already told typists to 'Strike the hyphen twice to make the dash', 314 years after 1588, and the entry now says about three centuries later. Thomas Phinney's post on point size says 'there is no necessary and required relationship between the size of the letters and the em', and the entry now calls the em square a yardstick rather than a box. Phillips wrote that the theory 'has a disputed origin' and 'seems to have started going viral around this past February', and the entry now says he dated its viral spread to then.",
  },
  {
    date: "2026-10-31",
    entries: ["who-invented-pizza"],
    wrong:
      "The entry said pizza was sold from open-air stands and out of pizza bakeries 'until about 1830', when Antica Pizzeria Port'Alba, 'usually counted as the first pizzeria with tables to sit at', opened.",
    fixed:
      "Carol Helstosky's Pizza: A Global History says that 'By the mid-eighteenth century, many of the pizzerias installed tables so customers could sit down and eat.' The entry no longer dates the first sit-down pizzeria, and it quotes Francesco De Sanctis remembering pizza eaten in rooms on the Largo della Carita in about 1833.",
  },
  {
    date: "2026-10-31",
    entries: ["why-are-french-fries-called-french-fries"],
    wrong:
      "The entry said the 1910 Manual for Army Cooks lists French fried potatoes with liver and bacon at breakfast, and it stated as fact that an 1802 White House dinner served 'potatoes served in the French manner'.",
    fixed:
      "In the manual's breakfast menus French fried potatoes never come with liver and bacon; on day 2 they come with Hamburg steak, which the entry now names. The 'French manner' phrase comes from a widely repeated story about a request by Thomas Jefferson to his French chef, Honore Julien; the etymologist Michael Quinion reports that 'Nobody associated with the Jefferson archives knows of the request', and the entry now calls it an often-repeated story.",
  },
  {
    date: "2026-10-31",
    entries: ["why-do-people-say-xmas"],
    wrong:
      "The entry said Xmas saves four letters on a shop sign, and stated as fact that the English X forms for Christ were 'not the work of people cutting corners on a sacred word' but 'a marker of respect for a name too important to spell out casually'.",
    fixed:
      "Christmas has nine letters and Xmas four, so the saving is five. The entry now attributes the reverence reading to the scholar Larry Hurtado, whose case rests on early Christian scribes, and quotes the OED etymologist Inge Milfull, who allowed for religious motives but told the BBC in 2004: 'Parchment was expensive so anything that would save space would be welcome.'",
  },
  {
    date: "2026-10-31",
    entries: ["why-is-usb-not-reversible"],
    wrong:
      "The entry said the USB-C plug has 24 pins, and that every legacy USB cable carries a Type-A plug for the host and a Type-B plug for the device.",
    fixed:
      "The 24 are the socket's: the USB-C specification gives 24 pins for the receptacle and says two of those contacts should not be present in the plug. The 1996 USB specification reserved Series B plugs for devices that 'require an external connector so that the USB cabling is detachable,' such as printers, scanners and modems, and named keyboards and mice as devices with a permanently attached cable. The entry now gives 24 as the socket's count and quotes the Series B rule.",
  },
  {
    date: "2026-10-31",
    entries: ["why-does-ice-float"],
    wrong:
      "The entry's table said ice III forms from about 300 megapascals and ice V from about 500, it gave heavy ice's melting point as 3.7 C, and it called ordinary ice one of nineteen known crystalline phases of water.",
    fixed:
      "By the IAPWS figures, ice III first freezes out of liquid water at about 210 megapascals and ice V at about 350. NIST's reference data put heavy ice's melting point at 276.97 kelvin, about 3.8 C. A 2021 Nature Communications commentary counted twenty crystalline phases of water ice as identified, a 2025 Nature Materials paper reported ice XXI, and the entry now says more than twenty.",
  },
  {
    date: "2026-10-31",
    entries: ["why-we-only-see-one-side-of-the-moon"],
    wrong:
      "The entry said in three places that the far side can never be seen from Earth, which its own libration figures contradicted, and it put the dark maria on about 1 percent of the far side. It also said every location on the Moon gets about two weeks of sunlight and two weeks of night.",
    fixed:
      "Libration shows Earth the far side's edges at times, about 18 percent of it, and the entry now says so throughout. The US Geological Survey's 1987 monograph puts the maria on about 2 percent of the far side and about 30 percent of the near side, and the entry now uses those figures. World Book's Moon article on NASA's site says certain large peaks near the poles are always in sunlight and the floors of some craters are always in shadow, and the entry now makes that exception.",
  },
  {
    date: "2026-10-31",
    entries: ["why-are-cocktails-called-cocktails"],
    wrong:
      "The entry stated as fact that the drink is named for what it was meant to do to you, credited Francis Grose with calling the live-eel story 'very unlikely' (that verdict was a modern encyclopedia's), and said 'a morning brandy did it to a politician', which no source supports.",
    fixed:
      "The feaguing derivation is now presented as David Wondrich's reading, with the rival docked-horse derivation of Ayto and Liberman alongside it; Grose is quoted in his own words, hedge included; and the brandy line is gone.",
  },
  {
    date: "2026-10-31",
    entries: ["how-do-magnets-work"],
    wrong:
      "The entry said neodymium magnets were developed independently by General Motors and Sumitomo Special Metals in 1984.",
    fixed:
      "IEEE Spectrum reports that Masato Sagawa of Sumitomo and John Croat of General Motors each announced the magnet at the same conference in Pittsburgh in November 1983. The entry now gives 1983 and that conference.",
  },
  {
    date: "2026-10-31",
    entries: ["did-the-great-wall-of-china-work"],
    wrong:
      "The entry said the Ming general Wu Sangui opened the gates of Shanhai Pass to the Manchus on 22 May 1644, and that after a Ming field army was broken at Tumu on 1 September 1449, the emperor was captured two days later.",
    fixed:
      "Wu Sangui rode out of the pass and surrendered to Dorgon on 27 May 1644, the day of the battle, which was fought by the Sha River several kilometres west of the pass. The emperor was captured in the 1449 defeat itself, and the entry no longer gives a separate date for his capture.",
  },
  {
    date: "2026-10-31",
    entries: [
      "why-do-cats-like-boxes",
      "what-is-a-lady-in-waiting",
      "why-does-cilantro-taste-like-soap",
      "where-do-pearls-come-from",
      "what-does-paint-the-town-red-mean",
      "where-do-pineapples-grow",
      "when-was-the-fax-machine-invented",
      "how-does-dry-cleaning-work",
      "what-is-the-longest-word-in-the-world",
      "why-do-we-celebrate-veterans-day",
      "how-do-birds-mate",
      "what-is-a-byte",
      "how-does-a-compass-work",
      "where-do-capers-come-from",
      "why-is-alcohol-called-spirits",
      "what-is-the-oldest-country-in-the-world",
      "where-do-maggots-come-from",
      "how-are-cotton-candy-grapes-made",
      "what-does-gif-stand-for",
      "when-was-autotune-invented",
      "why-is-wagyu-so-expensive",
      "why-is-it-called-a-flea-market",
      "why-did-japan-attack-pearl-harbor",
      "what-is-a-spring-tide",
      "when-was-jesus-actually-born",
      "what-is-an-algorithm",
      "what-are-the-names-of-santas-reindeer",
      "what-is-a-cookie-on-a-website",
      "why-do-cats-purr",
      "do-female-reindeer-have-antlers",
      "what-is-good-friday",
      "what-does-iq-stand-for",
      "what-are-barnacles",
    ],
    wrong:
      "The filing dates printed on FYI-074 to FYI-097 and FYI-122 to FYI-130 were one day earlier than the days those entries were first published on this site.",
    fixed:
      "Each of the 33 entries now shows the day it was first published.",
  },
  {
    date: "2026-10-31",
    entries: ["why-airplane-windows-are-round"],
    wrong:
      "The entry said the rounded shape of the passenger window is 'a memorial to a disaster', implying that sharp corners on the de Havilland Comet's passenger windows had caused its 1954 break-ups, and it said rounding the corners left the problem 'solved, permanently.'",
    fixed:
      "Lord Cohen's 1955 Court of Inquiry report judged that the January 1954 break-up near Elba probably began at a bolt hole near a corner of a radio aerial window in the cabin roof, and de Havilland's proposed cure for cabin fatigue was thicker gauge materials in the pressure cabin and strengthened, redesigned windows and cut-outs to lower the general stress. The entry now says so, and notes that the Comet 1's passenger windows were already rectangles with rounded corners.",
  },
  {
    date: "2026-10-31",
    entries: ["why-honey-never-spoils"],
    wrong:
      "The entry's title said 'Honey Never Spoils', but honey that takes up water can ferment, as the entry's own caveats noted.",
    fixed:
      "The title now reads 'Why Honey Almost Never Spoils, and When It Does'. The USDA's 1980 beekeeping handbook says honey with less than 17.1 percent water will not ferment in a year, whatever its yeast count, while honey above 19 percent water can be expected to ferment with even one spore per gram, and the entry now gives those thresholds.",
  },
  {
    date: "2026-10-31",
    entries: ["why-we-have-wisdom-teeth"],
    wrong:
      "The entry said, under the heading 'Evolution caught in the act', that scientists generally see missing wisdom teeth as a plausible example of ongoing human evolution, and that the trend of missing third molars was 'a real, observable thing rather than a myth'.",
    fixed:
      "Whether humans are evolving away from wisdom teeth is disputed, and the entry now says so: a 2025 review calls third molar degeneration 'a key marker of human dental evolution', while the anthropologist Julia Boughner doubts that evolution is weeding wisdom teeth out. It also notes that a Homo erectus lower jaw from China, dated to between 710 and 684 thousand years ago, is missing its third molars.",
  },
  {
    date: "2026-10-31",
    entries: ["the-science-of-brain-freeze"],
    wrong:
      "The entry said brain freeze's proper medical name is 'sphenopalatine ganglioneuralgia', and stated as fact that cold on the palate causes it by making blood vessels there rapidly constrict and then dilate. It also said a 2012 study found that a major artery dilated and blood flow jumped as the headache hit.",
    fixed:
      "The entry now gives the name in the International Classification of Headache Disorders, 'Headache attributed to ingestion or inhalation of a cold stimulus', and notes that its previously used terms, 'Ice-cream headache; brain-freeze headache', do not include the ganglion name. It presents vascular changes as one of two main hypotheses named in a 2023 review, which says the mechanism is not completely understood. It describes the 2012 study as a conference abstract on 13 healthy adults: a press release said the anterior cerebral artery dilated as the pain began, but the abstract's results showed a tendency towards increased flow velocity in that artery (P=0.078) and none in the middle cerebral artery.",
  },
  {
    date: "2026-10-31",
    entries: ["why-the-keyboard-is-qwerty"],
    wrong:
      "The entry said the TYPEWRITER top-row spelling was plausibly 'a nine-letter coincidence', though the word has ten letters, and it placed both Koichi and Motoko Yasuoka at Kyoto University. Its FAQ stated as fact that the letters were rearranged so that frequently paired letters would not sit next to each other on the machine, and its body said Z and S 'sit oddly' because the two are easy to confuse in Morse, which misstated the Yasuokas' 2011 argument.",
    fixed:
      "It now counts the ten letters and gives Motoko Yasuoka's affiliation as Kyoto University of Foreign Studies. It calls the letter-pair account the textbook answer and reports that the Yasuokas, examining surviving machines, found TH, the most common English letter pair counting both orders, 180 degrees apart in the ring of typebars but ER, the second most common, just 16 degrees apart. It also gives their telegraph argument: in American Morse, Z was often confused with the commoner pair SE, so they argue S 'ought to be placed near by both Z and E', and it marks this as their inference.",
  },
  {
    date: "2026-10-31",
    entries: ["why-coins-have-ridges"],
    wrong:
      "The entry said reeding was implemented on English coins in 1698, during Isaac Newton's time as Warden of the Royal Mint, and that US nickels never contained precious metal.",
    fixed:
      "It now dates England's permanent machine-made coinage, with its milled and lettered edges, to 1662 under Charles II, more than three decades before Newton became Warden in 1696, and says 1698 is when the Great Recoinage ended. It also notes that the wartime nickels of 1942 to 1945 were 35 percent silver.",
  },
  {
    date: "2026-10-31",
    entries: ["how-do-eels-reproduce"],
    wrong:
      "The entry said Sigmund Freud dissected 400 eels and found nothing because they were 'too early in their life cycle to have anything to find', an explanation it said nobody yet knew. It also dated satellite tracking of migrating adult eels to 2022 and called that year's tags the first direct evidence for the route, though the 2022 study itself describes earlier satellite tagging that had traced routes up to 5000 km from release.",
    fixed:
      "Freud's 1877 report says he found, in some of the eels, the lobed organ Szymon Syrski had proposed as the testis but could neither prove nor rule out that it was one, and adds that, if it was, eels go out to sea not in the least prepared for breeding, as von Siebold had put it. The Austrian Biographical Lexicon credits Syrski with discovering the eel's male gonads. The entry now says so, and gives the 2022 study's own claim: the first direct evidence of adult European eels reaching their presumed breeding place in the Sargasso Sea.",
  },
  {
    date: "2026-10-31",
    entries: ["why-we-say-bless-you"],
    wrong:
      "The entry said that responses to a sneeze are 'near-universal' and that the words varied by culture but the impulse to acknowledge a sneeze did not.",
    fixed:
      "It now notes that in Japanese, Korean and Mandarin Chinese it is not customary to acknowledge another person's sneeze, and that the sneezer apologizes instead.",
  },
  {
    date: "2026-10-31",
    entries: ["why-barns-are-red"],
    wrong:
      "The entry said barns were red not because red paint was cheap but because farmers mixed in rust as a preservative that discouraged mould and moss, so the red was a side effect. It also said a white barn signalled a farmer who could afford costlier pigments, and that the iron in barn paint had piled up inside massive stars and was scattered when they exploded as supernovae.",
    fixed:
      "Washington State's historic preservation office lists rust as one of two theories for the red and gives no source for the mould claim, 19th-century recipes and trade writing sell the paint on price and durability, and the same office says, again without a source, that white barns appeared when whitewash became cheaper. A massive star's collapsing iron core becomes a neutron star or a black hole, and Scientific American reports that exploding white dwarfs made roughly two thirds of the iron in Earth's core and in our blood. The entry now says so.",
  },
  {
    date: "2026-10-31",
    entries: ["how-long-is-a-moment"],
    wrong:
      "The entry, and its line in the front-page almanac, said Roger Bacon divided the moment into 12 ounces of 47 atoms. It also said the name 'moment' described a shadow's movement across a sundial, that every moment stretched in summer and shrank in winter around a 90-second average, and that 13th-century mechanical clocks brought in base-60 minutes and seconds and replaced sundial time.",
    fixed:
      "Bacon's computus divides the hour into 60 ostents of 376 atoms and has no ounce; the ounces appear in Alexander de Villa Dei's Massa Compoti. Bede wrote that the calculators named the moment from the swiftest motion of the stars, and in Bacon's computus the moment was a fortieth of the equal hour, so it kept its size while a seasonal hour on the winter solstice held 10 parts instead of 15. The 60-minute hour was already an astronomers' unit in Bacon's book, and seasonal hours lasted for centuries after mechanical clocks.",
  },
  {
    date: "2026-10-31",
    entries: ["where-does-candle-wax-go"],
    wrong:
      "The entry said roughly one quarter of a candle's energy radiates outward as heat.",
    fixed:
      "A NIST study measured the flame's radiative fraction at 0.17, about one sixth; above the flame, NIST reported, the rising plume of hot gases apparently carries most of the heat.",
  },
  {
    date: "2026-10-31",
    entries: ["why-are-sloths-slow"],
    wrong:
      "The entry tied a zoo's 15-hour sleep figure for two-toed sloths to a measurement made on captive three-toed sloths. Its title and text also stated as fact that sloths' eyes, which lack working cones, limit how fast they can move.",
    fixed:
      "It now keeps the two genera apart: the zoo cites no study, the captive measurement of 15.85 hours a day was made on brown-throated three-toed sloths, and wild sloths of that species slept 9.63 hours a day. Its title now says the eyes may be part of the answer, and the text calls the link between eyesight and speed a hypothesis, not a measurement, which the genome study it cites did not test.",
  },
  {
    date: "2026-10-31",
    entries: ["why-is-a-raven-like-a-writing-desk"],
    wrong:
      "The entry said a proofreader corrected Carroll's 'nevar' to 'never', so that the note as printed read 'never' and readers never got the joke. It also quoted Aldous Huxley as answering 'Because there is a B in both and an N in neither,' and described Carroll's note dated Christmas 1896 as two sentences long.",
    fixed:
      "As Denis Crutch reported in 1976, Carroll's preface as first printed spelled 'never' as 'nevar', and Martin Gardner's The Annotated Alice says the word was corrected to 'never' in all later printings, 'perhaps by an editor'. Huxley's 1928 Vanity Fair essay offered two alternatives: 'because there's a b in both, or else: because there's an n in neither.' Only the first paragraph of the preface is about the riddle; most of it is printing business, including new type for the book and a price cut for the Nursery 'Alice'.",
  },
  {
    date: "2026-10-31",
    entries: ["why-is-venus-hotter-than-mercury"],
    wrong:
      "The entry said in passing that fatal crashes had traced failures back to the corners of square passenger windows, repeating the popular story of the de Havilland Comet.",
    fixed:
      "The aside is gone. As this site's entry on airplane windows explains, Lord Cohen's 1955 Court of Inquiry report traced the Comet's 1954 break-up near Elba to a radio aerial window in the cabin roof, not to a passenger window, and the Comet 1's passenger windows were rectangles with rounded corners.",
  },
  {
    date: "2026-10-31",
    entries: ["what-is-a-group-of-ravens-called"],
    wrong:
      "The entry's title and text said 'an unkindness of ravens' came from one line of the 1486 Book of St Albans, and it put 'a murder of crows' among the extra terms that it said had 'a traceable modern home'.",
    fixed:
      "Both are in fifteenth-century lists: William Caxton printed 'an vnkindnes of rauons' and 'a Murther of crowes' side by side around 1476, and a manuscript list dated to about 1452 has the raven term too. A 1909 survey found the raven term in fourteen lists, and the entry is retitled 'A Word Older Than 1486'.",
  },
  {
    date: "2026-10-31",
    entries: ["can-you-start-a-sentence-with-but"],
    wrong:
      "The entry quoted an 1854 schoolbook as saying 'A sentence should not commence with the conjunctions and, for, or however.' as if the sentence ended there.",
    fixed:
      "The full sentence continues 'but may do so with but, now, and moreover': the 1854 book expressly allowed a sentence to open with but. The entry now quotes the sentence in full.",
  },
  {
    date: "2026-10-31",
    entries: ["why-do-horses-need-shoes"],
    wrong:
      "The entry, titled 'The Shoe Creates the Need', said the shoe rather than the horse sets the six-week farrier calendar. It said an unshod hoof is self-managing, filed to length by the ground, so that after shoeing 'someone is being paid to do the job the ground was doing for nothing'.",
    fixed:
      "Unshod horses usually need trimming too: a New Mexico State University extension guide says most horses should be trimmed or shod every 6 to 12 weeks, and shod when wear exceeds new hoof growth. The entry now says so and is retitled 'When Wear Outruns Growth'.",
  },
  {
    date: "2026-10-31",
    entries: ["when-was-bluetooth-invented"],
    wrong:
      "The entry said that IBM, after agreeing with Ericsson in 1997 to link a notebook and a phone by short-range radio, recruited Intel, which brought in Toshiba and Nokia. That sequence conflicts with the Bluetooth SIG's own account, which says Intel, Ericsson and Nokia met in 1996 to plan the technology's standardization.",
    fixed:
      "The IBM story is gone. The entry now gives Ericsson's own account, that it approached several makers of portable electronic devices to discuss developing and promoting the technology.",
  },
  {
    date: "2026-10-31",
    entries: ["when-were-cameras-invented"],
    wrong:
      "The entry said the oldest surviving camera photograph needed several days of sunlight and that modern work points to days. It also said Daguerre signed contracts with two camera makers, Alphonse Giroux and Susse Freres, in 1839; Gernsheim records only one such contract, of 22 June 1839, granting Giroux the monopoly of making daguerreotype apparatus in France.",
    fixed:
      "Estimates of the exposure differ: Gernsheim gave about 8 hours, the Niepce House Museum says quite a few days, and an editors' note to a 1997 French translation of Gernsheim's account says most reconstructions put it at 12 to 18 hours and calls Jean-Louis Marignier's 40 to 60 hours an exception. The entry now gives each figure and says the photograph needed hours or even days of sunlight, and it says that two firms, Alphonse Giroux and Susse Freres, made the first photographic cameras sold to the public in 1839.",
  },
  {
    date: "2026-10-31",
    entries: ["illuminati-on-the-dollar-bill"],
    wrong:
      "The entry said the Eye of Providence was a common Christian motif through the Middle Ages, that Pontormo put one at the top of his Supper at Emmaus in 1525, and that the pyramid on the seal has 13 courses for the 13 original states.",
    fixed:
      "The entry no longer dates the motif to the Middle Ages, and gives the 1614 frontispiece of Walter Raleigh's History of the World as a surer early example. The Uffizi, which owns Pontormo's painting, says its eye in a triangle is a posthumous repainting that covered his original three-faced image of the Trinity. The official 1782 description of the seal specifies no number of courses, so the thirteen on the dollar are a tradition.",
  },
  {
    date: "2026-10-31",
    entries: [
      "why-airplane-windows-are-round",
      "why-your-brain-sees-faces",
      "why-honey-never-spoils",
      "why-we-have-wisdom-teeth",
      "the-science-of-brain-freeze",
      "do-we-need-mosquitoes",
      "why-the-keyboard-is-qwerty",
      "why-we-say-bless-you",
      "why-barns-are-red",
    ],
    wrong:
      "The filing dates printed on FYI-001 to FYI-009 were 2 to 19 days earlier than the days those entries were first published on this site.",
    fixed:
      "Each of the nine entries now shows the day it was first published.",
  },
];
