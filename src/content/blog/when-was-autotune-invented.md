---
title: "When Was Autotune Invented? In 1996, Built to Go Unheard"
description: "When was autotune invented? A former oil engineer wrote it in early 1996, it went on sale in 1997, and Cher's 1998 hit turned its hidden fix into a robot voice."
pubDate: 2026-10-01
category: "tech"
readingTime: "5 min read"
filecode: "FYI-093"
featured: false
faqs:
  - q: "Who invented autotune and why?"
    a: "Andy Hildebrand, an electrical engineer who had spent more than a decade in the oil industry working out the shape of buried rock from sound echoes, invented Auto-Tune. The idea came from a woman at a 1995 music trade show lunch who joked that he should make a box to let her sing in tune, and his patent gives its purpose as correcting the intonation errors of vocals or other soloists in real time."
  - q: "What was the first song to use autotune?"
    a: "Cher's 'Believe,' released in October 1998, was the first commercial recording to make Auto-Tune's effect audible as a deliberate creative choice, according to Sound On Sound. It was not the first record to use the software, which had been on the market for about a year and was used discreetly to fix vocals, as its makers intended."
  - q: "How does autotune work?"
    a: "Auto-Tune measures how often the sound wave of a sung note repeats, which sets its pitch, using a method called autocorrelation. It then compares that pitch with the nearest note in a chosen scale and resamples the audio, adding or dropping wave cycles to move the voice onto the note, while a speed control sets how quickly the correction happens."
  - q: "Did Cher use autotune or a vocoder on Believe?"
    a: "Cher's 'Believe' used Auto-Tune, not a vocoder. In a February 1999 Sound On Sound article, producer Mark Taylor said he tried a 1970s Korg VC10 vocoder, dropped it, and got the effect from a DigiTech Talker vocoder pedal, but a note the magazine added later says the effect came from Antares Auto-Tune and that the producers were apparently guarding a trade secret. A musical vocoder takes its notes from a second sound such as a synthesizer, while Auto-Tune moves the pitch of the singer's own voice."
  - q: "Was autotune invented for oil drilling?"
    a: "No. Auto-Tune was designed from the start to correct singers' pitch, and its 1999 patent never mentions oil. The link is its inventor: Andy Hildebrand had used autocorrelation, the math at the heart of Auto-Tune, as an oil engineer, and Antares says he realized the techniques he had used to map oil fields could track the pitch of a voice."
---

The question went around a lunch table at the **1995** National Association of Music Merchants trade show: "What needs to be invented?" Andy Hildebrand had asked it of a few friends and their wives, and one of the women half-jokingly answered, "Why don't you make a box that will let me sing in tune?"

Nobody took it up. "I looked around the table and everyone was just kind of looking down at their lunch plates," Hildebrand told [Priceonomics](https://priceonomics.com/the-inventor-of-auto-tune/) in 2015, "so I thought, 'Geez, that must be a lousy idea', and we changed the topic."

Hildebrand, a flutist with a doctorate in electrical engineering, had spent more than a decade in the oil industry. He spent the next six months on other projects, until the suggestion came back to him. "It just kind of clicked in my head," he said.

## When was autotune invented?

Auto-Tune was invented in **early 1996**, when engineer **Andy Hildebrand** wrote the program over a few months, according to Priceonomics, and it went on sale in **1997**. His company, Antares, released it as a plug-in for Pro Tools studio systems, built to correct off-key singing without anyone hearing the fix. Its robotic side became famous in **1998**, on Cher's "Believe."

The Recording Academy dates the release to [the spring of 1997](https://www.grammy.com/news/dr-andy-hildebrand-honored-recording-academy-special-merit-award/), and Sound On Sound reviewed it in its August 1997 issue, when it was "only available for Pro Tools TDM systems," as reviewer Paul White [recalled in 1998](https://www.soundonsound.com/reviews/antares-atr1).

| Date | What happened |
|---|---|
| 1995 | At a NAMM show lunch, a guest asks for a box to help her sing in tune |
| Early 1996 | Hildebrand writes Auto-Tune on a specially equipped Macintosh |
| Spring 1997 | Antares releases it as a Pro Tools plug-in |
| September 19, 1997 | A stand-alone version ships |
| October 27, 1997 | The provisional patent application is filed |
| October 1998 | Cher's "Believe" is released |
| October 26, 1999 | US patent 5,973,252 is granted |
| October 2018 | The patent expires |

## September 19, 1997 is the date of a later version

Wikipedia gives Auto-Tune's release date as **September 19, 1997**, citing, among other sources, a [news page from Antares's website](https://web.archive.org/web/20000819080205/http://www.antarestech.com/files/news.html) archived in 2000. That page's entry for 9/19/97 reads: "Auto-Tune is now stand-alone. It is shipped with AudioStream, the Antares stand-alone host program and can run on any Macintosh."

Sound On Sound had already reviewed the Pro Tools plug-in in its August issue.

## Hildebrand learned the math mapping oil fields

After his PhD at the University of Illinois in **1976**, Hildebrand joined Exxon, where, Priceonomics says, he was "tasked with using seismic data to pinpoint drill locations." The job, as he described it, was to send sound into the ground, "listen to reverberations that come up," and "try to figure out what the shape of the subsurface is."

In **1982** he co-founded Landmark Graphics, which built 3D mapping workstations for oil exploration, a field whose survey data also outlined [the crater under Mexico's cenotes](/blog/what-is-a-cenote/). He retired in **1989** to study composition at Rice University. As an oil engineer he had used **autocorrelation**, which measures how closely a signal matches [a delayed copy of itself](https://en.wikipedia.org/wiki/Autocorrelation).

## The oil-drilling origin story is about the inventor, not the software

Auto-Tune is often described as oil-exploration technology put to work on music. Its patent never mentions oil or geophysics, and it states its aim plainly: "The purpose of the invention is to correct intonation errors of vocals or other soloists in real time in studio and performance conditions."

What crossed over was the inventor's math. Antares's [company history](https://www.antarestech.com/about) says he realized "the same techniques he'd used to map oil fields could track and correct the pitch of a human voice."

## Autocorrelation finds the repeat in a sung note

A sung note is a sound wave that repeats, and its pitch is set by how often it repeats. Hildebrand's [patent](https://patents.google.com/patent/US5973252A/en), US **5,973,252**, puts it in one line: "Determining the pitch of a sound is equivalent to determining the period of repetition of the waveform."

Slide a copy of a repeating wave along the original, and when the shift equals exactly one period, the two line up again. Hildebrand says the method is "never fooled by the changing waveform."

The obstacle was arithmetic. "In practice, the auto-correlation function has not been used to search for periodicity or track existing periods, because it requires a high level of computation to generate," the patent notes. Hildebrand says he realized that "most of the arithmetic was redundant," and that his simplification "changed **a million multiply adds into just four**."

With the pitch measured, the software resamples the audio, adding or dropping whole wave cycles, to move the voice onto the closest note in a chosen scale.

## Hildebrand tells the zero-setting story two ways

A speed control sets how fast the correction happens. As Hildebrand put it, "I built in a dial where you could adjust the speed **from 1 (fastest) to 10 (slowest)**. Just for kicks, I put a '**zero**' setting, which changed the pitch the exact moment it received the signal."

Talking to the writer [David Friedman](https://ironicsans.ghost.io/blame-this-man-for-auto-tune/) in 2014, he credited the setting to his director of marketing, who asked, "What's the harm in letting it go to instantaneous?"

> "I disagreed. I thought nobody in their right mind would ever use it that way," Hildebrand told Friedman.

The patent leans toward the second telling. It allows a setting of zero "giving instantaneous pitch changes," and calls instant changes "objectionable when the human voice is being processed." At the fastest settings, the gradual slides a singer makes between notes disappear, and each note is, in Simon Reynolds's phrase in [Pitchfork](https://pitchfork.com/features/article/how-auto-tune-revolutionized-the-sound-of-popular-music/), "pegged to an exact pitch."

## The vocoder credit on "Believe" was a cover story

Cher's "Believe," released in **October 1998**, spent [seven weeks](https://en.wikipedia.org/wiki/Believe_(Cher_song)) at number one in Britain. Its producers, Mark Taylor and Brian Rawling, used Auto-Tune's zero setting to make Cher's voice sound robotic.

When Sound On Sound covered the recording in [February 1999](https://www.soundonsound.com/techniques/recording-cher-believe), Taylor said he tried a 1970s Korg VC10 vocoder, found "the results just weren't clear enough," and got the effect from a DigiTech Talker pedal instead. The magazine called the effect "basically down to vocoding and filtering."

A note the magazine added later says the producers were "apparently so keen to maintain their 'trade secret' process that they were willing to attribute the effect to the (then) recently-released Digitech Talker vocoder pedal." Reynolds calls it a "cover story": the vocoder story came from the people who made the record.

A musical vocoder needs a second sound, such as a synthesizer, as its [carrier](https://en.wikipedia.org/wiki/Vocoder). Auto-Tune uses the singer's own voice and moves its pitch to the nearest note. The same Sound On Sound note says the sound became known as the "Cher effect," and Priceonomics reports that Antares marketed Auto-Tune under that name.

## Records used it discreetly for about a year first

Sound On Sound's note calls "Believe" "the first commercial recording to feature the audible side-effects of Antares Auto-Tune software used as a deliberate creative effect." Auto-Tune had been on the market for **about a year** by then, and "its previous appearances had been discreet, as its makers, Antares Audio Technologies, intended," Reynolds wrote.

"Studios weren't going out and advertising, 'Hey we got Auto-Tune!'" Hildebrand said. [Wikipedia](https://en.wikipedia.org/wiki/Auto-Tune) names Aphex Twin's "Funny Little Man," from the 1997 Come to Daddy EP, as one of the earliest tracks to use it. As with [the first video game](/blog/what-was-the-first-video-game/), the answer depends on what counts.

## The robot voice came back in the mid-2000s

Wikipedia credits T-Pain with reintroducing Auto-Tune as a vocal effect in pop on his **2005** album Rappa Ternt Sanga. By **June 2009** it was common enough for Jay-Z to release ["D.O.A. (Death of Auto-Tune),"](https://en.wikipedia.org/wiki/D.O.A._(Death_of_Auto-Tune)) whose lyrics address its overuse. One inspiration, he said, was hearing the effect in a Wendy's commercial.

The box a lunch guest asked for in 1995 was meant to correct pitch "without artifacts in a seamless and continuous fashion," in the patent's words. The sound that made it famous is the artifact, from a zero setting its inventor, in one telling, said nobody in their right mind would use. Strictly FYI.
