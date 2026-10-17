import { deptWord } from "./site";
/* Department copy for /topics/ and /topics/<key>/. The department list itself
   (key, number, name, note) lives in src/data/site.ts; this file holds only the
   words those pages add. Every claim in an intro comes from the entry it links,
   and links are written [text](slug). The department page fails the build when
   a slug stops resolving to an entry in that department, so an intro cannot
   point at a renamed or moved entry. Plain ASCII, third-person narrator. */

export interface TopicCopy {
  /* The <title>, before the " - Strictly FYI" suffix. */
  title: string;
  /* Meta description, 140-160 characters. */
  meta: string;
  /* One paragraph of 60-120 words. */
  intro: string;
}

export const topics: Record<string, TopicCopy> = {
  science: {
    title: "Science: How the Universe Actually Works",
    meta: "Science questions with the mechanism explained: why veins look blue, how bees make honey, how whales sleep and why Venus is hotter than Mercury.",
    intro:
      "Science covers questions with a mechanism behind them: how animals behave, how the body works, and why the sky and the sea look the way they do. Several entries correct the classroom version. Veins look blue, yet [measurement shows more red light than blue](why-are-veins-blue) coming back from one, and [bees make honey by drying nectar](how-do-bees-make-honey), not by digesting it. Others are open cases. Nobody has [watched eels reproduce](how-do-eels-reproduce), and the half-brain account of [whale sleep](how-do-whales-sleep) rests on five toothed species in captivity. The department runs from [wisdom teeth](why-we-have-wisdom-teeth) to [why Venus is hotter than Mercury](why-is-venus-hotter-than-mercury).",
  },
  history: {
    title: "History: The Stories Behind the Story",
    meta: "History questions traced back to the record: why Greenland got its name, when Rome really fell, why coins have ridges and why a marathon is 26.2 miles.",
    intro:
      "History collects the stories behind the story, and it often finds that the familiar version was written down long after the event. Erik the Red's pitch for [Greenland](why-is-greenland-called-greenland) survives only in a sentence written about 140 years later, and [the 476 date for the fall of Rome](when-did-rome-fall) was chosen decades afterwards, while the empire carried on in Constantinople until 1453. Other entries trace a habit to the event that set it: [coin ridges](why-coins-have-ridges) began as the fix for people shaving silver off the edges, and [the marathon's 26.2 miles](why-is-a-marathon-26-2-miles) comes from London's 1908 course. The department also covers [the Mayflower](when-did-the-mayflower-land) and [the Great Wall](did-the-great-wall-of-china-work).",
  },
  tech: {
    title: "Tech: Why the Things Around You Work",
    meta: "Tech questions, answered from the record: how planes fly, why the keyboard is QWERTY, what SOS stands for and when the fax machine was really invented.",
    intro:
      "Tech explains the machines and conventions people use every day without a second thought, and many of them are older than they look. A Scottish clockmaker [patented the fax machine in 1843](when-was-the-fax-machine-invented), and Paris was faxing Lyon 11 years before Bell patented the telephone. [The byte](what-is-a-byte) meant 1 to 6 bits when an IBM engineer coined the word in 1956. Other entries take a familiar explanation apart: [wings fly by turning air downward](how-do-planes-fly), and [SOS stands for nothing](what-does-sos-stand-for). The department also covers [QWERTY](why-the-keyboard-is-qwerty), [USB plugs](why-is-usb-not-reversible) and [the first video game](what-was-the-first-video-game).",
  },
  culture: {
    title: "Culture: Ideas, Language and Why We Do Things",
    meta: "Culture questions on words, customs and the calendar: why we say bless you, how cocktails got their name, why Easter moves and where the X in Xmas began.",
    intro:
      "Culture is the department for words, customs and the calendar, along with the origin stories attached to them. Several of those stories fall apart on the dates. The New Orleans egg-cup account of [the word cocktail](why-are-cocktails-called-cocktails) fails that test, and the skull-cup legend behind [skol](what-does-skol-mean) began as a Latin misreading of a Norse phrase for horns. Some answers are older than expected: English scribes were using X as shorthand for Christ by about 1100, the X standing for the Greek letter chi, centuries before anyone wrote [Xmas](why-do-people-say-xmas). The department also explains [why Easter moves](why-does-easter-change-every-year), [why February has 28 days](why-does-february-have-28-days) and whether [a sentence can start with but](can-you-start-a-sentence-with-but).",
  },
  everyday: {
    title: "Everyday: The Hidden Logic of Ordinary Life",
    meta: "Everyday questions about food and ordinary things: why honey never spoils, where candle wax goes, how dry cleaning works and why wagyu costs what it does.",
    intro:
      "Everyday takes the objects, foods and routines that rarely get a second look and asks how they work. The wax of a burning candle [leaves as water vapor and carbon dioxide](where-does-candle-wax-go), and [dry cleaning](how-does-dry-cleaning-work) soaks clothes in a liquid solvent. Much of the department is about food: where [capers](where-do-capers-come-from), [truffles](where-do-truffles-grow) and [coffee](where-does-coffee-come-from) come from, why [caviar](why-is-caviar-so-expensive) and [wagyu](why-is-wagyu-so-expensive) cost what they do, and why tryptophan is [the wrong suspect](why-does-turkey-make-you-sleepy) when turkey makes you sleepy. It also holds the chemistry of [why honey never spoils](why-honey-never-spoils).",
  },
  curiosity: {
    title: "Curiosity: The Wonderfully, Oddly True",
    meta: "Curious questions about animals, riddles and myths: why cats like boxes, what a group of ravens is called and which came first, the chicken or the egg.",
    intro:
      "Curiosity holds the wonderfully, oddly true: animal habits, collective nouns, riddles and the myths that grow around them. Cats get several entries, from [making biscuits](why-do-cats-make-biscuits) to [sitting in boxes](why-do-cats-like-boxes), including four pet cats that sat in a square that was only an illusion. Collective nouns get checked against the record: [an unkindness of ravens](what-is-a-group-of-ravens-called) comes from a 1486 word list, and [rafter for turkeys](what-is-a-group-of-turkeys-called) has not been found in print before 1908. [The egg came first](what-came-first-the-chicken-or-the-egg), by about 355 million years, and Lewis Carroll [answered his own raven riddle](why-is-a-raven-like-a-writing-desk) in 1896, then said it never had one.",
  },
};

/* The /topics/ index. */
export const topicsIndex = {
  title: `Topics: The ${deptWord.charAt(0).toUpperCase()}${deptWord.slice(1)} Departments`,
  meta: "Browse Strictly FYI by department: science, history, tech, culture, everyday life and curiosities, with every entry in each one listed newest first.",
};

export interface IntroPart {
  text: string;
  slug?: string;
}

const LINK = /\[([^\]]+)\]\(([a-z0-9-]+)\)/g;

/* Splits an intro into plain runs and entry links, in reading order. */
export function introParts(intro: string): IntroPart[] {
  const parts: IntroPart[] = [];
  let last = 0;
  for (const m of intro.matchAll(LINK)) {
    const at = m.index ?? 0;
    if (at > last) parts.push({ text: intro.slice(last, at) });
    parts.push({ text: m[1], slug: m[2] });
    last = at + m[0].length;
  }
  if (last < intro.length) parts.push({ text: intro.slice(last) });
  return parts;
}

/* The intro as plain text, for word counts. */
export const introText = (intro: string) => intro.replace(LINK, "$1");
