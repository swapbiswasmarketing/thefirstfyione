---
title: "What Does GIF Stand For? A Format Older Than the Web"
description: "What does GIF stand for? It stands for Graphics Interchange Format, an image format CompuServe released in 1987. Its spec never said jif; CompuServe's magazine did."
pubDate: 2026-10-01
category: "tech"
readingTime: "5 min read"
filecode: "FYI-092"
featured: false
faqs:
  - q: "How do you pronounce GIF: gif or jif?"
    a: "Both pronunciations are accepted. The Oxford Advanced Learner's Dictionary and the American Heritage Dictionary list the hard g, as in gift, first and jif second, and 65.6 percent of the 51,008 developers who answered the question in Stack Overflow's 2017 survey said hard g. The format's creator, Steve Wilhite, insisted on jif, and CompuServe's own magazine told readers in September 1987 that GIF was pronounced \"Jif\" and said so again in October."
  - q: "Who invented the GIF?"
    a: "Steve Wilhite, a programmer at the online service CompuServe, is credited with inventing it, and he received a Webby lifetime achievement award for it in 2013. CompuServe's October 1987 magazine article on the format called him \"a principal software engineer who helped develop GIF,\" while a 1997 history of PNG by Greg Roelofs credits CompuServe's Bob Berry with the design. Wilhite died of COVID-19 on March 14, 2022, at 74."
  - q: "What was the first GIF?"
    a: "The first image Steve Wilhite created in the format was a picture of an airplane, The New York Times reported in 2013. The prototype took him about a month, and CompuServe released the format in June 1987."
  - q: "Why are GIFs limited to 256 colors?"
    a: "Each pixel in a GIF is stored as a number of 1 to 8 bits that points into a color table, and 8 bits can count only 256 entries. Each entry is three bytes, one each for red, green and blue, so those 256 colors can be picked from about 16.8 million."
  - q: "Was the GIF made for animation?"
    a: "No. CompuServe's 89a revision of July 1989 added frame delays and transparency, but its specification says GIF \"is not intended as a platform for animation, even though it can be done in a limited way.\" Looping came from Netscape, whose Navigator 2.0 browser read a block labeled NETSCAPE2.0 as an instruction to repeat the frames, with a count of zero meaning forever."
---

Steve Wilhite's acceptance speech at the Webby Awards was five words long, and he put it on a screen. The Webbys hold every winner to five words or fewer, and on the night of May 21, 2013, the retired CompuServe programmer was greeted onstage by Tumblr's founder, David Karp, to accept a lifetime achievement award for inventing the GIF. The screen above the stage read, in white capitals on black: IT'S PRONOUNCED "JIF" NOT "GIF".

"The audience roared with approval," [The New York Times](https://bits.blogs.nytimes.com/2013/05/23/battle-over-gif-pronunciation-erupts/) reported. Before the ceremony, Wilhite had given [the paper](https://bits.blogs.nytimes.com/2013/05/21/an-honor-for-the-creator-of-the-gif/) a longer version. "The Oxford English Dictionary accepts both pronunciations," he said. "They are wrong. It is a soft 'G,' pronounced 'jif.' End of story."

## What does GIF stand for?

GIF stands for **Graphics Interchange Format**, an image file format that the online service CompuServe released in **June 1987** so that color pictures could be downloaded over slow dial-up modems. CompuServe programmer Steve Wilhite is credited as its inventor, and each image in a GIF can use at most **256 colors**.

The [specification](https://www.w3.org/Graphics/GIF/spec-gif87.txt), dated **June 15, 1987**, lists GIF and "Graphics Interchange Format" as CompuServe trademarks. The [Oxford Advanced Learner's Dictionary](https://www.oxfordlearnersdictionaries.com/definition/english/gif) writes the singular, "Graphic Interchange Format," which appears once in CompuServe's October 1987 magazine feature, though the magazine otherwise printed "Graphics."

## CompuServe built it for dial-up, before the web existed

CompuServe wanted to show things like color weather maps, but existing image formats took too much bandwidth for slow dial-up connections, the Times reported. "I saw the format I wanted in my head and then I started programming," Wilhite wrote to the paper. The prototype took about a month, and the first image he created was a picture of an airplane.

What GIF replaced is spelled out in the October 1987 issue of *Online Today*, CompuServe's subscriber magazine, under the headline ["Computer Users Choose GIF"](https://archive.org/details/Online_Today_Vol_06_10_1987_Oct/page/n33/mode/1up). "Remember," Wilhite said there, "that we had a graphics format code called RLE, which was black and white, low resolution and 256 by 192 pixels."

The article calls him "a principal software engineer who helped develop GIF," while Greg Roelofs's [1997 history of PNG](http://www.libpng.org/pub/png/pnghist.html) credits CompuServe's Bob Berry with the design. The 1987 article never mentions Berry.

All of this predates the World Wide Web. Tim Berners-Lee wrote his first proposal for it in **March 1989**, [CERN's project history](https://info.cern.ch/hypertext/WWW/History.html) records, and the project's files were posted to the internet in August 1991.

## Each image gets 256 colors out of 16.8 million

The 1987 spec stores each pixel as an index of 1 to 8 bits into a color table: "This translates to a range of 2 (B & W) to 256 colors," because [eight bits](/blog/what-is-a-byte/) can count 256 values. Each entry holds "three byte values representing the relative intensities of red, green and blue," so the 256 can be any of **16,777,216** shades. On many 1987 machines, *Online Today* noted, the decoder would translate images "into a lesser 32-color scheme."

To shrink files, GIF uses LZW compression, which the spec credits to "work done by Lempel-Ziv & Welch," citing Terry Welch's June 1984 article in *IEEE Computer*. It is lossless, the [Library of Congress](https://www.loc.gov/preservation/digital/formats/fdd/fdd000133.shtml) notes, and the magazine quoted ratios of 2:1 to 8:1.

## The 89a spec said GIF was not meant for animation

The [89a revision](https://www.w3.org/Graphics/GIF/spec-gif89a.txt) of **July 1989** added a delay, counted in "hundredths (1/100) of a second," before the next image, plus a transparent color. The original 1987 format already allowed several images in one file. Yet an appendix to the 89a spec is blunt: "The Graphics Interchange Format is not intended as a platform for animation, even though it can be done in a limited way."

The endless loop came from a browser. Netscape Navigator 2.0 read a block labeled "NETSCAPE" and "2.0" as an order to loop the file, and "an iteration count of zero indicates infinite," Royal Frazier's [1990s guide](https://web.archive.org/web/19990418091037/http://www6.uniovi.es/gifanim/gifabout.htm) explained. Wilhite himself, the Times reported in 2013, had never made an animated GIF, though he named the 1996 "dancing baby" a favorite.

## The compression was patented, and CompuServe did not know

The 1987 spec promised that its information "is made available for use in computer software without royalties, or licensing restrictions." But Welch had filed for [US patent 4,558,302](https://patents.google.com/patent/US4558302A/en) on LZW in **June 1983**, for his employer Sperry, which later merged with Burroughs to form Unisys. It was granted in December 1985.

"The LZW algorithm was incorporated from an open publication, and without knowledge that Unisys was pursuing a patent," CompuServe's Tim Oren wrote, in Roelofs's history. At the end of **December 1994**, CompuServe and Unisys announced that developers of certain kinds of GIF software would have to pay a license fee, according to [Mike Battilana's January 1995 account](https://mike.pub/19950127-gif-lzw). The comp.graphics newsgroup, Roelofs wrote, "went nuts, to use a technical term."

On **January 4, 1995**, Thomas Boutell posted the first draft of a replacement. It became PNG, a W3C Recommendation by October 1996, whose specification, [RFC 2083](https://www.rfc-editor.org/rfc/rfc2083.txt), calls it "a patent-free replacement for GIF" and adds a note GIF's spec never had: PNG is pronounced "ping." The US patent expired in **June 2003**, and its European and Japanese counterparts in June 2004, the Library of Congress notes.

## CompuServe's magazine printed jif, and the spec never did

A widely repeated story says the GIF specification itself prescribes the soft g, often with a joke about choosy programmers attached. The documents do not support it: neither the 1987 spec nor the 89a spec says anything about pronunciation.

The printed source is the magazine. *Online Today* told readers in September 1987 that GIF was pronounced "Jif," and repeated "pronounced 'jif'" in October. The joke is harder to pin down. Oxford's [2012 announcement](https://web.archive.org/web/20130117123724/http://blog.oup.com/2012/11/oxford-dictionaries-usa-word-of-the-year-2012-gif/) said the format's programmers "supposedly quipped 'choosy developers choose GIF,'" a play on Jif peanut butter's "choosy mothers choose Jif," while [Time](https://time.com/5791028/how-to-pronounce-gif/) in 2020 had Wilhite saying "choose JIF."

Dictionaries accept both. Oxford Dictionaries, naming the verb "to GIF" its US word of the year for 2012, wrote that GIF "may be pronounced with either a soft g (as in giant) or a hard g (as in graphic)," and the Oxford Advanced Learner's and [American Heritage](https://ahdictionary.com/word/search.html?q=GIF) dictionaries list the hard g first. A written abbreviation can pick up a spoken form nobody planned, as [Xmas](/blog/why-do-people-say-xmas/) did when people began reading it aloud as EKS-mas.

> "A coiner effectively loses control of a word once it's out there," John Simpson, the Oxford English Dictionary's chief editor at the time, told the [BBC](https://www.bbc.co.uk/news/technology-22620473) in a report published the day after the Webbys.

Developers, at least, lean toward the hard g. In [Stack Overflow's 2017 survey](https://survey.stackoverflow.co/2017), **65.6 percent** of 51,008 respondents chose it and 26.3 percent the soft g. In 2020 even Jif switched sides, unveiling limited-edition jars labeled "Gif" with Giphy, whose chief executive, Alex Chung, told hard-g speakers, "we know you're right."

Wilhite put his answer on a screen in 2013, but CompuServe's two specifications define a GIF byte by byte without ever saying how to say the name. The soft g that made the Webby audience roar was in print by September 1987, as two words in parentheses in a subscriber magazine. Strictly FYI.
