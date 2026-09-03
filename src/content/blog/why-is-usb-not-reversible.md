---
title: "Why Is USB Not Reversible? It Took 24 Pins to Fix"
description: "Why is USB not reversible? The 1996 Type-A plug wired four contacts in a single row. The connector that finally cured the flip needs 24 pins and software."
pubDate: 2026-09-03
category: "tech"
readingTime: "4 min read"
filecode: "FYI-049"
featured: false
faqs:
  - q: "Why is USB not reversible?"
    a: "The original USB Type-A plug carries four contacts in a single row, protected by a plastic tongue inside a metal shell. One row of contacts can only meet the matching row in the socket one way up. Reversibility needs a second mirrored row plus a circuit that detects which row is live."
  - q: "What does USB stand for?"
    a: "Universal Serial Bus. Universal because it was designed to replace serial ports, parallel ports, game ports and Apple Desktop Bus ports with one socket. Serial because it sends data one bit at a time. Bus because early computer buses were named after electrical power buses, or busbars."
  - q: "Why does USB-C plug in both ways up?"
    a: "USB-C receptacles have two-fold rotational symmetry, so the plug mates in either orientation. The connector has 24 pins arranged in two rows, and two Configuration Channel pins let the device work out which way round the cable went in."
  - q: "How many times can you plug in a USB cable before it wears out?"
    a: "Standard USB connectors have a minimum rated lifetime of 1,500 cycles of insertion and removal. Mini-B is rated for 5,000 cycles, and all Micro connectors and USB-C are rated for 10,000."
  - q: "Is Ajay Bhatt the man in the 2009 Intel USB advert?"
    a: "No. Bhatt and his team did work on the USB standard at Intel, but the man on screen in the 2009 advertisement is the actor Sunil Narkar, playing him."
---

The connector that finally lets a cable go in either way up carries **24 pins**. The one that does not carries **four**. Those two numbers are most of the answer to a question people have been asking since 1996.

USB 1.0 was released in **January 1996**. The specification for its reversible replacement, USB-C, was published in **August 2014**, more than eighteen years later.

## Why is USB not reversible?

The original Type-A plug carries **four contacts in a single row**, protected by a plastic tongue inside a metal shell. One row of contacts can only meet the matching row one way up. Reversibility needs a second row, mirrored, and a circuit that works out which of the two the device is talking to.

## The four contacts do not all land at once

The asymmetry goes further than the plastic. In standard USB plugs the data pins are recessed compared with the power pins, so power and ground make contact first on the way in and break last on the way out. A device gets its supply settled before anything tries to talk to it.

The standard was directional at both ends too. Every legacy USB cable carries a Type-A plug for the host and a mechanically distinct Type-B plug for the device, and only hosts and hubs are given Type-A sockets. That A-and-B split exists to enforce which end is in charge. A plug that fitted any socket any way up would have been arguing with the architecture it was built to police.

## The name is a wiring diagram

Universal Serial Bus. Each of the three words records a decision, and none of them were picked for the sound.

**Universal** was the job description. [Wikipedia's article on the standard](https://en.wikipedia.org/wiki/USB) says USB "was originally designed to standardize the connection of peripherals to computers, replacing various interfaces such as serial ports, parallel ports, game ports, and Apple Desktop Bus (ADB) ports." One socket, an entire drawer of cables retired.

**Serial** is the method. [Serial communication](https://en.wikipedia.org/wiki/Serial_communication) means sending data one bit at a time, sequentially, as against parallel communication, where several bits go out together across several channels. The [parallel printer port](https://en.wikipedia.org/wiki/Parallel_port) that USB helped kill needed eight data pins plus control pins and grounds, and arrived at the PC on a 25-pin DB-25 connector. USB carries its data on **two wires** and its power on two more. Doing less at a time, with better manners, is a strategy [that also works for an animal hanging upside down in a tree](/blog/why-are-sloths-slow/).

**Bus** is a borrowed word. Early computer buses "were named after electrical power buses, or [busbars](https://en.wikipedia.org/wiki/Bus_%28computing%29)" - the fat copper strips that carry current into a building so that everything downstream can tap the same supply. A bus is a shared road rather than a private line, which is why one USB port can end up feeding a hub, a keyboard, a mouse and a hard drive at once. Electricity is doing something considerably more photogenic [in the sky above northern Norway](/blog/what-causes-the-northern-lights/).

## The reference account calls this hard to get wrong

Wikipedia's article on [USB hardware](https://en.wikipedia.org/wiki/USB_hardware) sets the position down in a single sentence:

**"By design, it is difficult to insert a USB plug into its receptacle incorrectly."**

The same passage reports the official remedy: "The USB specification requires that the cable plug and receptacle be marked so the user can recognize the proper orientation." A mechanical problem was handed a documentation solution, and the human race has been overruling it ever since.

## The rock star in the 2009 advert is an actor

Ajay Bhatt and his team worked on the standard at Intel, and Intel produced the first integrated circuits supporting USB in 1995. A 2009 Intel television advertisement turned him into a public figure, and the clip is still passed around as footage of the man who invented USB.

The man on screen is an actor. [Wikipedia's entry on Bhatt](https://en.wikipedia.org/wiki/Ajay_Bhatt) records that he "was brought greater attention by a 2009 Intel television advertisement in which he was portrayed by actor Sunil Narkar." The real Bhatt is described there as Intel's chief I/O architect, responsible for the platform and I/O interconnects, which is a less photogenic job than the one in the commercial.

## Four contacts against twenty-four

| | Type-A (1996) | USB-C (2014) |
|---|---|---|
| Contacts | 4 | 24 |
| Goes in either way up | No | Yes |
| Rated insertion cycles | 1,500 | 10,000 |
| Orientation handled by | The user | The cable and the device |

Standard USB connectors have a minimum rated lifetime of **1,500 cycles of insertion and removal**. Micro connectors are rated for **10,000**, and USB-C carries the same figure. That durability came from a redesign in which a locking device was added and a leaf spring was moved from the jack to the plug, so the most-stressed part sits on the cheap, replaceable cable rather than the port soldered to a motherboard.

## USB-C is not symmetrical either

The reversible connector solved the flip without ever becoming symmetrical. Mechanically, USB-C receptacles have two-fold rotational symmetry, so the plug seats in either orientation. Electrically, [the two rows of pins are different](https://en.wikipedia.org/wiki/USB-C), and so are the two ends of a cable.

What closes the gap is a pair of Configuration Channel pins, which the device reads to determine the orientation of the cable before anything else happens. The port finds out which way round you plugged it in, then rearranges itself to match. Even the wiring is thriftier than the pin count suggests: the plug has 24 pins, but a cable commonly carries only 18 wires.

> USB-C carries 24 asymmetrical pins and enough circuitry to pretend they are symmetrical. Wikipedia's account of the standard puts it flatly: "Software makes the plugs and cables behave as though they are symmetric."

That is the price of not having to look at a plug: twenty extra pins and a negotiation. Four contacts in a row was the smaller, simpler arrangement, and it kept working, so it stayed on the side of computers for eighteen years. Hardware layouts calcify like that once enough of them exist, which is roughly the story of [the odd order of the letters under your fingers](/blog/why-the-keyboard-is-qwerty/).

Every failed insertion is a small, accurate report on an engineering trade-off from 1996: four wires, no orientation logic, and a marking on the plug asking you to look first. Strictly FYI.
