---
title: "What Is a Byte? 8 Bits Today, 1 to 6 When It Was Coined"
description: "What is a byte? Today it means 8 bits, but when an IBM engineer coined the word in 1956 it meant 1 to 6 bits, and the fixed 8 came out of a fight inside IBM."
pubDate: 2026-10-01
category: "tech"
readingTime: "5 min read"
filecode: "FYI-085"
featured: false
faqs:
  - q: "Why is a byte 8 bits?"
    a: "Because IBM's System/360, launched in 1964, fixed the byte at 8 bits, and the word has generally meant 8 bits since. Fred Brooks, who made the decision, said in 2007 that it \"opened the lower case alphabet,\" while the 1964 paper on the design named coding efficiency, storing a decimal digit in 4 bits instead of 6, as the most important factor."
  - q: "Who invented the byte?"
    a: "Werner Buchholz, an IBM engineer planning the Stretch computer, had coined the word by June 1956, and a memo of his dated June 11, 1956, already uses it. It comes from bite, and the 1962 book Planning a Computer System says it was \"respelled to avoid accidental mutation to bit.\""
  - q: "What is the difference between a bit and a byte?"
    a: "A bit is a single binary digit, a 0 or a 1, and the smallest unit of storage. A byte is a group of bits, today almost always 8, that a computer handles as one unit, and 8 bits can form 256 different patterns. The word bit appears in Claude Shannon's 1948 paper on communication, which credits it to J. W. Tukey; byte followed in 1956."
  - q: "How many characters can one byte hold?"
    a: "One, if the character is in ASCII, the standard set of unaccented English letters, digits and common symbols. UTF-8, the encoding specified in RFC 3629, stores each ASCII character in a single byte and uses two to four bytes for every other character, so an em dash takes three."
  - q: "Is a byte always 8 bits?"
    a: "No. The first bytes, planned at IBM in 1956, ran from 1 to 6 bits, the Stretch computer delivered in 1961 allowed any size from 1 to 8, and machines with 6-bit and 9-bit bytes were common in the 1960s. Internet standards say octet when they mean exactly 8 bits, and the C language standard requires only that a byte have at least 8."
---

The first bytes on record could be a single bit long. Werner Buchholz, the IBM engineer who coined the word, wrote in June 1956 that his machine would take characters of **1 to 6 bits**, and could "handle bytes of only one bit for logical analysis."

His memo already treats the word as settled, in the phrase "characters, or 'bytes' as we have called them." An 8-bit maximum followed that September, and the fixed 8 came in the 1960s, after a fight inside IBM in which, by Fred Brooks's account, he and chief architect Gene Amdahl each quit the company once.

## What is a byte?

A byte is a group of binary digits, or bits, that a computer stores and moves as one unit, and today it almost always means **8 bits**. Eight bits can be set in **256** different patterns, enough to hold a whole number from 0 to 255 or one character of plain English text, such as A, x or $.

A bit is a single 0 or 1, the smallest unit of storage. Claude Shannon's 1948 paper "A Mathematical Theory of Communication" calls these units "binary digits, or more briefly bits, a word suggested by J. W. Tukey."

In the international standard, a kilobyte is 1,000 bytes and a megabyte 1,000,000, though most memory makers use megabyte for **1,048,576** bytes, the size the International Electrotechnical Commission named the mebibyte in 1998.

## The first bytes were sized for 1950s machines

Buchholz's company-confidential memo, dated **June 11, 1956**, described LINK, the part of IBM's Stretch computer that connected it to the outside world. In a 1977 letter to BYTE magazine, he explained that the byte's "first use was in the context of the input-output equipment of the 1950s, which handled six bits at a time."

Stretch's memory was then planned around a 60-bit word, the number of bits it moved in one memory cycle. In a memo of July 31, 1956, Buchholz noted that "60 is a multiple of 1, 2, 3, 4, 5, and 6," so every byte size from 1 to 6 fit a word evenly. The same memo also weighed 64: since 64, unlike 60, is a power of 2, a 64-bit word "would permit a completely binary address arithmetic."

At a meeting on **September 17, 1956**, attended by Buchholz, Brooks and four others, the word became 64 bits and the largest byte for input and output became **8 bits**. Stretch, renamed the IBM 7030 and delivered to Los Alamos in April 1961, let programs choose any byte size from **1 to 8 bits**.

## The word came from bite, and the y was deliberate

The first published use, Buchholz wrote, came in a **June 1959** paper by Gerrit Blaauw, Brooks and himself, "Processing Data in Bits and Pieces." In a 1995 letter to BYTE, Louis G. Dooley wrote that the word "was coined around 1956 to 1957" on SAGE, an air-defense project at MIT Lincoln Laboratory, but his letter cites no document.

*Planning a Computer System*, the 1962 book on Stretch that Buchholz edited, explains the spelling on page 40: "The term is coined from bite, but respelled to avoid accidental mutation to bit."

The same page defines a byte as the bits that encode one character, or that move in parallel to and from input-output units. Parallel bits travel side by side, where a [serial link such as USB](/blog/why-is-usb-not-reversible/) sends them one at a time.

## Eight bits won the biggest fight of the System/360 project

In IBM's words, System/360, launched on **April 7, 1964**, replaced all five of its computer product lines with "one strictly compatible family." Brooks was its project leader and Amdahl its chief architect.

Brooks told the Computer History Museum in 2007 that two of the 12 or 13 teams in an internal design competition, Amdahl's and Blaauw's, came in with "essentially the same concept" and one big difference: Amdahl's used a 6-bit byte, Blaauw's an 8-bit byte.

Then, Brooks said, "came the biggest internal fight, and that was between the six and eight bit byte." He and Amdahl "each quit once that week, quit the company," until Manny Piore, IBM's senior scientist, got them back together.

Brooks made the decision, Amdahl appealed to Bob Evans, Brooks's boss, and Evans confirmed it. Brooks said "the reason was it opened the lower case alphabet." He saw language processing as a market IBM could not enter while it used 6-bit character sets.

> Of all his technical accomplishments, Brooks said, "making the 8-bit byte decision is far and away the most important."

Amdahl's own oral history, recorded in 2000, does not mention quitting over the byte. He said he "didn't want to continue with the 8-bit byte" and wanted 24-bit and 48-bit words instead of 32 and 64, for "a more rational floating point system."

The 1964 IBM Journal paper by Amdahl, Blaauw and Brooks named a different factor first: "Most important of these factors was coding efficiency," since numeric data in business records was "more than twice as frequent as alphanumeric," and the 8-bit plan stored a decimal digit in 4 bits rather than 6.

## The 8-bit byte is older than System/360

"Many have assumed that byte, meaning 8 bits, originated with the IBM System/360," Buchholz wrote in 1977. IBM's history page says the System/360 architecture "pioneered the 8-bit byte still in use on computers today," though Stretch's design had an 8-bit maximum by **September 1956**.

What System/360 changed, Buchholz wrote, was to fix the byte "at the 8 bit maximum," for economy, and to number memory byte by byte instead of bit by bit. "Since then the term byte has generally meant 8 bits."

## ASCII fits in 7 bits

ASCII, the American standard code for text, was approved on **June 17, 1963**, as "the 7-bit coded character set," with room for **128** characters. Its table left most of two columns unassigned, and the 1967 edition filled them with the lowercase letters.

UTF-8, the text encoding specified in RFC 3629, keeps each ASCII character to one byte and uses two to four for any other. An [em dash](/blog/why-is-it-called-an-em-dash/), U+2014, takes three. Images get packed into bytes too: a [GIF](/blog/what-does-gif-stand-for/) stores each pixel as an index of up to 8 bits into a color table, which caps each image at 256 colors.

## Octet is the word for exactly 8 bits

RFC 791, the **1981** specification of the Internet Protocol, defines an octet as "An eight bit byte." The C language still defines a byte by its job, as an "addressable unit of data storage large enough to hold any member of the basic character set," with at least 8 bits.

| When | Where | Bits in a byte |
|---|---|---|
| June 1956 | Buchholz's Stretch memo | 1 to 6 |
| September 1956 | Stretch planning meeting | Up to 8 |
| April 1961 | IBM 7030 (Stretch), delivered | 1 to 8, chosen by the program |
| April 1964 | IBM System/360 | 8, fixed |
| September 1981 | RFC 791, Internet Protocol | 8, called an octet |
| 2024 | C standard working draft | At least 8 |

The first byte could be a single bit, and its y was there to stop the word itself from turning into bit. The fixed 8 took a 1960s fight in which, by Brooks's account, IBM's project leader and chief architect each quit the company once, and the word has generally meant 8 bits ever since. Strictly FYI.
