---
title: "What Does GIF Stand For? A Format Older Than the Web"
description: "GIF is short for Graphics Interchange Format, an image format CompuServe released in 1987. Its spec never said jif, but CompuServe's own magazine did."
pubDate: 2026-10-02
updatedDate: 2026-10-31
category: "tech"
readingTime: "6 min read"
filecode: "FYI-092"
almanac: "Steve Wilhite's acceptance speech at the Webby Awards was five words long, and he put it on a screen."
featured: false
faqs:
  - q: "How do you pronounce GIF: gif or jif?"
    a: "Both pronunciations are accepted. The Oxford Advanced Learner's Dictionary lists the hard g, as in gift, first and jif second, and 65.6 percent of the 51,008 developers who answered the question in Stack Overflow's 2017 survey said hard g. Steve Wilhite, credited as the format's inventor, insisted on jif, and CompuServe's own magazine told readers in September 1987 that GIF was pronounced \"Jif\" and said so again in October."
  - q: "Why are GIFs limited to 256 colors?"
    a: "Each pixel in a GIF is stored as a number of 1 to 8 bits that points into a color table, and 8 bits can count only 256 entries. Each entry is three bytes, one each for red, green and blue, so those 256 colors can be picked from about 16.8 million."
  - q: "Was the GIF made for animation?"
    a: "No. CompuServe's 89a revision, which its spec dates to July 1989, added frame delays and transparency, but its specification says GIF \"is not intended as a platform for animation, even though it can be done in a limited way.\" Looping came from Netscape, whose Navigator 2.0 browser read a block labeled NETSCAPE2.0 as an instruction to repeat the frames, with a count of zero meaning forever."
---

Steve Wilhite's acceptance speech at the Webby Awards was five words long, and he put it on a screen. The Webbys hold every winner to five words or fewer, and on the night of May 21, 2013, the retired CompuServe programmer was greeted onstage by Tumblr's founder, David Karp, to accept a lifetime achievement award for inventing the GIF, [The New York Times](https://bits.blogs.nytimes.com/2013/05/23/battle-over-gif-pronunciation-erupts/) reported. The screen above the stage read: "It's Pronounced 'JIF' not 'GIF.'"

"The audience roared with approval," [the paper](https://bits.blogs.nytimes.com/2013/05/23/battle-over-gif-pronunciation-erupts/) added. Before the ceremony, Wilhite had given [the Times](https://bits.blogs.nytimes.com/2013/05/21/an-honor-for-the-creator-of-the-gif/) a longer version. "The Oxford English Dictionary accepts both pronunciations," he said. "They are wrong. It is a soft 'G,' pronounced 'jif.' End of story."

## What does GIF stand for?

GIF stands for **Graphics Interchange Format**, an image file format that the online service CompuServe released in **June 1987** so that color pictures could be downloaded over slow dial-up connections, [the Times reported](https://bits.blogs.nytimes.com/2013/05/21/an-honor-for-the-creator-of-the-gif/). CompuServe programmer Steve Wilhite is credited as its inventor, and each image in a GIF can use at most **256 colors**, as the [Library of Congress](https://www.loc.gov/preservation/digital/formats/fdd/fdd000133.shtml) notes in its description of the format.

The [specification](https://www.w3.org/Graphics/GIF/spec-gif87.txt), dated **June 15, 1987**, lists GIF and "Graphics Interchange Format" as CompuServe trademarks. The [Oxford Advanced Learner's Dictionary](https://www.oxfordlearnersdictionaries.com/definition/english/gif) writes the singular, "Graphic Interchange Format."

## CompuServe built it for dial-up, before the web existed

CompuServe wanted to display things like color weather maps, and dial-up speeds were "achingly slow," [the paper reported](https://bits.blogs.nytimes.com/2013/05/21/an-honor-for-the-creator-of-the-gif/) in its profile of Wilhite. "I saw the format I wanted in my head and then I started programming," he wrote to the paper. The prototype took about a month, and the first image he created was a picture of an airplane.

What GIF replaced is spelled out in the October 1987 issue of *Online Today*, CompuServe's subscriber magazine, under the headline ["Computer Users Choose GIF"](https://archive.org/details/Online_Today_Vol_06_10_1987_Oct/page/n33/mode/1up). "Remember," Wilhite said there, "that we had a graphics format code called RLE, which was black and white, low resolution and 256 by 192 pixels."

The [same article](https://archive.org/details/Online_Today_Vol_06_10_1987_Oct/page/n33/mode/1up) calls him "a principal software engineer who helped develop GIF," while Greg Roelofs's [1997 history of PNG](http://www.libpng.org/pub/png/pnghist.html) credits CompuServe's Bob Berry with the design. The 1987 article never mentions Berry.

All of this predates the World Wide Web. Tim Berners-Lee wrote his first proposal for it in **March 1989**, [CERN's project history](https://info.cern.ch/hypertext/WWW/History.html) records, and the project's files were posted to the internet in August 1991.

## Each image gets 256 colors out of 16.8 million

The [1987 spec](https://www.w3.org/Graphics/GIF/spec-gif87.txt) stores each pixel as an index of 1 to 8 bits into a color table: "This translates to a range of 2 (B & W) to 256 colors," because [eight bits](/blog/what-is-a-byte/) can count 256 values. Each table entry holds "three byte values representing the relative intensities of red, green and blue," so the 256 can be any of **16,777,216** shades.

On many machines of the day, *Online Today* [noted](https://archive.org/details/Online_Today_Vol_06_10_1987_Oct/page/n33/mode/1up), the decoder would translate images "into a lesser 32-color scheme."

To shrink files, GIF uses LZW compression, which Terry Welch [first described](https://mike.pub/19950127-gif-lzw) in the June 1984 issue of *IEEE Computer*, building on the work of Abraham Lempel and Jacob Ziv. It is lossless, the [Library of Congress](https://www.loc.gov/preservation/digital/formats/fdd/fdd000133.shtml) notes, and CompuServe's magazine [promised](https://archive.org/details/Online_Today_Vol_06_09_1987_Sep/page/n65/mode/1up) files cut to "between a half and an eighth of the original size."

## The 89a spec said GIF was not meant for animation

The [89a revision](https://www.w3.org/Graphics/GIF/spec-gif89a.txt), which the spec dates to **July 1989**, added a delay, counted in "hundredths (1/100) of a second," before the next image, plus a transparent color. The [original 1987 format](https://www.w3.org/Graphics/GIF/spec-gif87.txt) could already hold several images in one file, shown with "no pause between images." Yet [an appendix](https://www.w3.org/Graphics/GIF/spec-gif89a.txt) to the 89a spec is blunt: "The Graphics Interchange Format is not intended as a platform for animation, even though it can be done in a limited way."

The endless loop came from a browser. Netscape Navigator 2.0 read a block labeled "NETSCAPE" and "2.0" as an order to loop the file, and "an iteration count of zero indicates infinite," Royal Frazier's [1990s guide](https://web.archive.org/web/19990418091037/http://www6.uniovi.es/gifanim/gifabout.htm) explained. Wilhite himself had never made an animated GIF, [the Times reported](https://bits.blogs.nytimes.com/2013/05/21/an-honor-for-the-creator-of-the-gif/) in 2013, though he named the 1996 "dancing baby" a favorite.

## The compression was patented, and CompuServe said it did not know

The [1987 spec](https://www.w3.org/Graphics/GIF/spec-gif87.txt) promised that its information "is made available for use in computer software without royalties, or licensing restrictions." But Welch had filed for US patent 4,558,302 on LZW on June 20, 1983, [Mike Battilana's history of the dispute](https://mike.pub/19950127-gif-lzw) records, for his employer Sperry, which [later merged with Burroughs](http://www.libpng.org/pub/png/pnghist.html) to form Unisys. The patent was granted in December 1985.

"The LZW algorithm was incorporated from an open publication, and without knowledge that Unisys was pursuing a patent," CompuServe's Tim Oren wrote, as quoted in [Roelofs's history](http://www.libpng.org/pub/png/pnghist.html). At the end of **December 1994**, CompuServe and Unisys announced that developers of certain kinds of GIF software would have to pay a license fee, [Battilana wrote](https://mike.pub/19950127-gif-lzw). The comp.graphics newsgroup "went nuts, to use a technical term," [Roelofs recalled](http://www.libpng.org/pub/png/pnghist.html), and on **January 4, 1995**, Thomas Boutell posted the first draft of a replacement there.

It became PNG, whose specification, [RFC 2083](https://www.rfc-editor.org/rfc/rfc2083.txt), calls it "a patent-free replacement for GIF" and adds a note GIF's spec never had: PNG is pronounced "ping." The US patent expired in **June 2003**, and its European and Japanese counterparts in June 2004, the [Library of Congress](https://www.loc.gov/preservation/digital/formats/fdd/fdd000133.shtml) notes.

## CompuServe's magazine printed jif, and the spec never did

The claim that the GIF specification itself prescribes the soft g appears in the Graphics File Formats FAQ, which stated that the pronunciation "is specified in the GIF specification to be" jif, as quoted on [The GIF Pronunciation Page](http://www.olsenhome.com/gif/), a fan site. The documents do not support it: neither CompuServe's original spec nor the [89a revision](https://www.w3.org/Graphics/GIF/spec-gif89a.txt) says anything about pronunciation.

The printed source is the magazine. In September 1987, Charles Bowen's column in *Online Today* [told readers](https://archive.org/details/Online_Today_Vol_06_09_1987_Sep/page/n65/mode/1up) that GIF was pronounced "Jif" and stood for "Graphics Interchange Format." The October feature [introduced](https://archive.org/details/Online_Today_Vol_06_10_1987_Oct/page/n33/mode/1up) "Graphic Interchange Format (GIF)," pronounced jif, in a singular the Oxford Advanced Learner's Dictionary shares, though its own subhead reads "Graphics Interchange Format."

Bob Berry, the programmer Roelofs credits, held the same view. A sample GIF that came with CompuShow, a viewer he wrote and CompuServe distributed, lays text over a photo of Berry, including the line "Oh, incidentally, it's pronounced 'JIF'," according to [the same fan site](http://www.olsenhome.com/gif/); web browsers do not display it.

The joke is harder to pin down. Oxford's [2012 announcement](https://web.archive.org/web/20130117123724/http://blog.oup.com/2012/11/oxford-dictionaries-usa-word-of-the-year-2012-gif/) said the format's programmers "supposedly quipped 'choosy developers choose GIF,'" a play on Jif peanut butter's "choosy mothers choose Jif," while a 2020 [Time](https://time.com/5791028/how-to-pronounce-gif/) timeline says Wilhite "reportedly" put it as "choose JIF."

Dictionaries accept both. [Oxford Dictionaries](https://web.archive.org/web/20130117123724/http://blog.oup.com/2012/11/oxford-dictionaries-usa-word-of-the-year-2012-gif/), naming the verb "to GIF" its US word of the year for 2012, wrote that GIF "may be pronounced with either a soft g (as in giant) or a hard g (as in graphic)," and the [Oxford Advanced Learner's Dictionary](https://www.oxfordlearnersdictionaries.com/definition/english/gif) lists the hard g first.

> "A coiner effectively loses control of a word once it's out there," John Simpson, the Oxford English Dictionary's chief editor at the time, told the [BBC](https://www.bbc.co.uk/news/technology-22620473) in a report published the day after the Webbys.

Developers, at least, lean toward the hard g. In [Stack Overflow's 2017 survey](https://survey.stackoverflow.co/2017), **65.6 percent** of 51,008 respondents chose it and 26.3 percent the soft g. In February 2020 Jif and Giphy put out limited-edition jars of peanut butter labeled "Gif," and Giphy's chief executive, Alex Chung, told hard-g speakers, "we know you're right," [Time reported](https://time.com/5791028/how-to-pronounce-gif/).

Wilhite put his answer on a screen at the Webbys, but CompuServe's two specifications define a GIF byte by byte without ever saying how to say the name. The soft g that made the audience roar was in print by [September 1987](https://archive.org/details/Online_Today_Vol_06_09_1987_Sep/page/n65/mode/1up), as two words in parentheses in a subscriber magazine. Strictly FYI.
