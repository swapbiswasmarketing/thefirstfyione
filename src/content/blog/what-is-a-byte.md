---
title: "What Is a Byte? 8 Bits Today, 1 to 6 When It Was Coined"
description: "A byte is 8 bits today, but in the oldest memo Werner Buchholz found using the word, written at IBM in June 1956, a byte could be anywhere from 1 to 6 bits long."
pubDate: 2026-10-02
updatedDate: 2026-10-31
category: "tech"
readingTime: "5 min read"
filecode: "FYI-085"
almanac: "The first byte could be a single bit, and its y was there to stop the word itself from turning into bit."
featured: false
faqs:
  - q: "Why is a byte 8 bits?"
    a: "IBM chose an 8-bit character size in 1961 for the machines it announced in 1964 as System/360, which fixed the byte at the 8-bit maximum that IBM's earlier Stretch computer had allowed, and the word has generally meant 8 bits since. Fred Brooks, who said he made the call, credited it with opening the lower case alphabet, while the 1964 paper on the design named coding efficiency as the most important factor."
  - q: "Who coined the word byte?"
    a: "Werner Buchholz, an IBM engineer planning the Stretch computer, used it in a memo dated June 11, 1956, the oldest he could find, and later said he had perpetrated the term. A later claim that the word arose on MIT's SAGE project offers no document. The 1962 book on Stretch says it comes from bite, respelled to avoid accidental mutation to bit."
  - q: "Is a kilobyte 1,000 or 1,024 bytes?"
    a: "By the standard definitions, 1,000. Computer professionals long used kilo to mean 1,024, so in December 1998 the International Electrotechnical Commission approved separate binary names: 1,024 bytes is a kibibyte and 1,048,576 bytes a mebibyte. NIST notes that most makers of computer memory use megabyte to mean 1,048,576 bytes, while makers of storage devices usually mean 1,000,000."
---

In the memo that Werner Buchholz later called ["the first reference found in the files,"](https://archive.org/details/byte-magazine-1977-02/page/n145/mode/1up) a byte could be a single bit long. Buchholz, an engineer on IBM's Stretch computer, wrote in [that memo, dated June 11, 1956](https://archive.computerhistory.org/resources/text/IBM/Stretch/pdfs/06-07/102632284.pdf), that its input-output computer would handle "any characters or digits, from 1 to 6 bits long," and could "handle bytes of only one bit for logical analysis."

[The same memo](https://archive.computerhistory.org/resources/text/IBM/Stretch/pdfs/06-07/102632284.pdf) already uses the word as a familiar one, in the phrase "characters, or 'bytes' as we have called them." [An 8-bit maximum followed that September](https://archive.computerhistory.org/resources/text/IBM/Stretch/pdfs/06-08/102632292.pdf). IBM chose [an 8-bit character size in 1961](https://www.ece.ucdavis.edu/~vojin/CLASSES/EEC272/S2005/Papers/IBM360-Amdahl_april64.pdf) for the machines that became System/360, and by [Fred Brooks's account](https://s3.us-west-1.wasabisys.com/chm-cms-media/media-live/_file/import/102658255-05-01-acc.pdf) 8 bits then prevailed over a 6-bit design in a fight in which he and chief architect Gene Amdahl each quit the company once.

## What is a byte?

A byte is a group of binary digits, or bits, that a computer stores and moves as one unit, and today it almost always means **8 bits**, the value [NIST's page on the binary prefixes](https://physics.nist.gov/cuu/Units/binary.html) gives for one byte. Eight bits make **256** possible patterns, which the 1962 book on Stretch called ["all 256 combinations of 8 bits,"](https://archive.org/details/planning_a_computer_system_project_stretch_1962) enough for one character of plain English text, such as A, x or $.

A bit is a single 0 or 1. [Claude Shannon's 1948 paper](https://archive.org/details/bstj27-3-379) "A Mathematical Theory of Communication" called these units "binary digits, or more briefly bits, a word suggested by J. W. Tukey," and noted that a relay or a flip-flop circuit "can store one bit of information."

Multiples are where bytes get slippery. Computer professionals, in [NIST's account](https://physics.nist.gov/cuu/Units/binary.html), noticed that 2 to the 10th power "was very nearly equal to 1000 and started using the SI prefix 'kilo' to mean 1024." In [December 1998](https://physics.nist.gov/cuu/Units/binary.html) the International Electrotechnical Commission approved separate names for the binary multiples: a kibibyte is 1,024 bytes and a mebibyte **1,048,576**, leaving the kilobyte at **1,000** bytes and the megabyte at 1,000,000.

Both meanings stayed in use: [NIST notes](https://physics.nist.gov/cuu/Units/binary.html) that most makers of computer memory use megabyte to mean 1,048,576 bytes, while makers of storage devices usually mean 1,000,000.

## The first bytes were sized for 1950s machines

Buchholz's company-confidential memo, [Stretch Memo No. 39C](https://archive.computerhistory.org/resources/text/IBM/Stretch/pdfs/06-07/102632284.pdf), described LINK, the part of Stretch that connected it to the outside world. In [a 1977 letter to BYTE magazine](https://archive.org/details/byte-magazine-1977-02/page/n145/mode/1up), he explained that the byte's "first use was in the context of the input-output equipment of the 1950s, which handled six bits at a time."

A word, in [Stretch's own definition](https://archive.org/details/planning_a_computer_system_project_stretch_1962), was "the number of data bits transmitted in parallel from or to memory in one memory cycle." In [a memo of July 31, 1956](https://archive.computerhistory.org/resources/text/IBM/Stretch/pdfs/06-08/102632289.pdf), on a word then tentatively set at 60 bits, Buchholz noted that "60 is a multiple of 1, 2, 3, 4, 5, and 6," so bytes of every size from 1 to 6 packed into a word without one being split across two.

[The same memo](https://archive.computerhistory.org/resources/text/IBM/Stretch/pdfs/06-08/102632289.pdf) weighed 64: since 64, unlike 60, is a power of 2, a 64-bit word "would permit a completely binary address arithmetic." It also named [the byte sizes that mattered in practice](https://archive.computerhistory.org/resources/text/IBM/Stretch/pdfs/06-08/102632289.pdf): "1, 4, and 6 bits are the really important cases."

At [a meeting on September 17, 1956](https://archive.computerhistory.org/resources/text/IBM/Stretch/pdfs/06-08/102632292.pdf), attended by Buchholz, Brooks and four others, the word became 64 bits and the maximum byte for input and output became **8 bits**. Stretch, renamed the IBM 7030 and [delivered to Los Alamos in April 1961](https://archive.org/details/planning_a_computer_system_project_stretch_1962), let programs choose any byte size from **1 to 8 bits**.

## The word came from bite, and the y was deliberate

Buchholz, who [told BYTE in 1977](https://archive.org/details/byte-magazine-1977-02/page/n145/mode/1up) that he had "perpetrated this piece of jargon," said he "could not locate a birth certificate" in his files, and dated the first published use to a **June 1959** paper by Gerrit Blaauw, Brooks and himself, "Processing Data in Bits and Pieces."

A rival claim exists. [In a February 1995 letter to BYTE](https://web.archive.org/web/19961220122258/http://www.byte.com/art/9502/sec2/art12.htm), Louis G. Dooley wrote that the word "was coined around 1956 to 1957" at MIT Lincoln Laboratory, on the SAGE air-defense project, where it was "typically referred to as a set of 4 bits," but his letter offers no document to back the date.

*Planning a Computer System*, [the 1962 book on Stretch that Buchholz edited](https://archive.org/details/planning_a_computer_system_project_stretch_1962), says on page 40 that a byte "denotes a group of bits used to encode a character, or the number of bits transmitted in parallel to and from input-output units," and explains the spelling: "The term is coined from bite, but respelled to avoid accidental mutation to bit."

## Eight bits won what Brooks called the project's biggest internal fight

In [IBM's own history](https://www.ibm.com/history/system-360), System/360, with Fred Brooks as project leader and Gene Amdahl as chief architect, replaced all five of IBM's computer product lines with "one strictly compatible family." IBM [announced it on April 7, 1964](https://www.computerhistory.org/tdih/april/7/).

Brooks [told the Computer History Museum in 2007](https://s3.us-west-1.wasabisys.com/chm-cms-media/media-live/_file/import/102658255-05-01-acc.pdf) that an internal design competition drew "12 or 13 teams," and two came in with "essentially the same concept" and one very big difference: Amdahl's "was based on the six-bit byte," the other on an 8-bit byte.

Then, [Brooks said](https://s3.us-west-1.wasabisys.com/chm-cms-media/media-live/_file/import/102658255-05-01-acc.pdf), "came the biggest internal fight, and that was between the six and eight bit byte": he and Amdahl "each quit once that week, quit the company," until Manny Piore, IBM's senior scientist, got them back together.

By Brooks's account, he made the call, Amdahl appealed to Bob Evans, Brooks's boss, and Evans confirmed it; [Brooks's explanation](https://s3.us-west-1.wasabisys.com/chm-cms-media/media-live/_file/import/102658255-05-01-acc.pdf) was that "it opened the lower case alphabet," and with it language processing, a market IBM "couldn't get into very well, as long we were doing 6-bit character sets."

> Of all his technical accomplishments, Brooks said, "making the 8-bit byte decision is far and away the most important."

[Amdahl's own oral history](https://s3.us-west-1.wasabisys.com/chm-cms-media/media-live/_file/import/102702492-05-01-acc.pdf), recorded in 2000, says nothing about quitting over the byte. He remembered the 8-bit byte as the one thing ["binding from that report,"](https://s3.us-west-1.wasabisys.com/chm-cms-media/media-live/_file/import/102702492-05-01-acc.pdf) the report of IBM's SPREAD planning committee, and said he "didn't want to continue with the 8-bit byte": he wanted "to make it 24 and 48 instead of 32 and 64," for "a more rational floating point system."

[The 1964 IBM Journal paper](https://www.ece.ucdavis.edu/~vojin/CLASSES/EEC272/S2005/Papers/IBM360-Amdahl_april64.pdf) by Amdahl, Blaauw and Brooks put a plainer factor first: "Most important of these factors was coding efficiency," because "the use of numeric data in business records is more than twice as frequent as alphanumeric." Decimal digits need only 4 bits, [the paper explained](https://www.ece.ucdavis.edu/~vojin/CLASSES/EEC272/S2005/Papers/IBM360-Amdahl_april64.pdf), so 6 bits for every character meant "2 bits wasted on numeric data," while 4-bit digits and 8-bit characters wasted 2 bits only on alphanumeric characters.

## The 8-bit byte is older than System/360

[IBM's history page](https://www.ibm.com/history/system-360) says the System/360 architecture "pioneered the 8-bit byte still in use on computers today," though [Stretch's design had an 8-bit maximum by September 1956](https://archive.computerhistory.org/resources/text/IBM/Stretch/pdfs/06-08/102632292.pdf).

What System/360 changed, [Buchholz explained in 1977](https://archive.org/details/byte-magazine-1977-02/page/n145/mode/1up), was to fix the byte size "at the 8 bit maximum" for economy and to replace bit addressing with byte addressing: "Since then the term byte has generally meant 8 bits."

## The 1963 text code had no lowercase letters

ASCII, the American standard code for text, was [approved on June 17, 1963](https://archive.org/details/enf-ascii-1963-09) by the American Standards Association as "a coded character-set of 128 seven-bit characters," in the words of a special issue of IBM's customer magazine *Data Processor* that explained it that year. [The same issue](https://archive.org/details/enf-ascii-1963-09) counted 28 codes still unassigned and noted that neither ASCII nor IBM's own 6-bit code "has specified a standard method for representing the lower case of the alphabet."

A 7-bit code fits inside an 8-bit byte with a bit to spare, and [the 1964 System/360 paper](https://www.ece.ucdavis.edu/~vojin/CLASSES/EEC272/S2005/Papers/IBM360-Amdahl_april64.pdf) said IBM's choice of the 8-bit character size "proved wise by 1963," when ASCII arrived, printing an "8-bit representation of the 7-bit" code.

UTF-8, [the encoding specified in RFC 3629](https://www.rfc-editor.org/rfc/rfc3629), builds every character from "sequences of 1 to 4 octets," and keeps the old ASCII characters to one byte each, so plain English text costs a byte a letter while an em dash takes three.

## Octet is the word for exactly 8 bits

[RFC 791](https://www.rfc-editor.org/rfc/rfc791), the **September 1981** specification of the Internet Protocol, defines an octet as "An eight bit byte." [The 2011 C standard's committee draft](https://port70.net/~nsz/c/c11/n1570.html) defines a byte by its job, as an "addressable unit of data storage large enough to hold any member of the basic character set of the execution environment," and requires at least 8 bits in one.

| When | Where | Bits in a byte |
|---|---|---|
| June 1956 | Buchholz's Stretch memo | 1 to 6 |
| September 1956 | Stretch planning meeting | Up to 8 |
| April 1961 | IBM 7030 (Stretch), delivered | 1 to 8, chosen by the program |
| April 1964 | IBM System/360 | 8, fixed |
| September 1981 | RFC 791, Internet Protocol | 8, called an octet |
| 2011 | C standard (C11 committee draft) | At least 8 |

The first byte could be a single bit, and its y was there to stop the word itself from turning into bit. Eight bits survived a 1960s fight inside IBM to become the System/360 standard, and the word has generally meant 8 bits ever since. Strictly FYI.
