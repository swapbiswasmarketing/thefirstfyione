---
title: "Why Is USB Not Reversible? It Took 24 Pins to Fix"
description: "The 1996 USB plug put four contacts in one row, and a flippable one would have meant double the wires and the cost. USB-C's 24-pin socket fixed it in 2014."
pubDate: 2026-09-03
updatedDate: 2026-10-31
category: "tech"
filecode: "FYI-049"
almanac: "In standard USB plugs the data pins are recessed compared with the power pins, so power and ground make contact first on the way in."
featured: false
faqs:
  - q: "What does USB stand for?"
    a: "Universal Serial Bus. Universal was the job description, since the 1996 specification complained that the PC's serial and parallel ports and its keyboard, mouse and joystick interfaces lacked plug and play. Serial because it sends data one bit at a time, and bus because many devices share one connection, a name early computer buses took from the busbars of power distribution."
  - q: "Why does USB-C plug in both ways up?"
    a: "The USB-C plug can go into its socket in either of two orientations. The socket has 24 pins, and its two Configuration Channel pins let the device work out which way round the plug went in."
  - q: "Is Ajay Bhatt the man in the 2009 Intel USB advert?"
    a: "No. Bhatt led the team at Intel that created USB, but the man on screen in the 2009 advertisement is the actor Sunil Narkar, playing him."
---

The socket that finally lets a USB cable go in either way up has [**24 pins**](https://www.usb.org/sites/default/files/USB%20Type-C%20Spec%20R2.0%20-%20August%202019.pdf#page=68). The plug that goes in only one way has [**four**](https://archive.org/details/usbspec_1.0/page/n29). Those two numbers are most of the answer to a question people have been asking since 1996.

The [USB 1.0 specification](https://archive.org/details/usbspec_1.0) is dated **January 15, 1996**. The specification for its reversible replacement, USB-C, was cleared for volume production in **August 2014**, more than eighteen years later: [The Register reported](https://www.theregister.com/2014/08/12/reversible_usb_connector_ready_for_largescale_production/) on 12 Aug 2014 that the "fully reversible" connector was ready.

## Why is USB not reversible?

USB is not reversible because the original Type-A plug, "a four-position plug with a shielded housing" in the [1996 specification](https://archive.org/details/usbspec_1.0/page/n89), sets its **four contacts in a single row**, as the [plug drawing](https://archive.org/details/usbspec_1.0/page/n90) shows, and one row of contacts can meet its socket only one way up. Reversibility needs a second row, mirrored, and a circuit that works out which of the two the device is talking to.

That second set was a cost the designers chose not to pay. Ajay Bhatt, who led the Intel team, told [NPR in 2019](https://www.npr.org/2019/06/21/734451600/ever-plugged-a-usb-in-wrong-of-course-you-have-heres-why) that "The biggest annoyance is reversibility," and NPR reported that a plug that went in both ways "would have required double the wires and circuits, which would have then doubled the cost."

The team needed every major computer company to adopt USB, so it kept the design cheap, and Bhatt does not pretend the trade was free: "In hindsight, based on all the experiences that we all had, of course it was not as easy as it should be," he said in the [same interview](https://www.npr.org/2019/06/21/734451600/ever-plugged-a-usb-in-wrong-of-course-you-have-heres-why).

> The one-way plug was a deliberate economy: a plug that worked both ways would have needed double the wires and circuits, and double the cost.

## The four contacts do not all land at once

The asymmetry goes further than the single row. In standard USB plugs the data pins are [recessed](https://archive.org/details/usbspec_1.0/page/n136) compared with the power pins, so power and ground make contact first on the way in and break last on the way out. The [specification](https://archive.org/details/usbspec_1.0/page/n136) says this "guarantees that the power rails to the downstream device are referenced before the signal pins make contact."

The standard was directional at both ends too. It reserved [Series B plugs](https://archive.org/details/usbspec_1.0/page/n84) for devices "that require an external connector so that the USB cabling is detachable, such as printers, scanners, and modems," and ruled that "Series A and B connectors cannot be interchanged." The architecture chapter puts the rule another way: "Upstream and downstream connectors are not mechanically interchangeable, thus eliminating illegal loopback connections at hubs," in the words of the [same specification](https://archive.org/details/usbspec_1.0/page/n29). That split also settled which end was in charge.

## The name is a wiring diagram

Universal Serial Bus. Each of the three words records a decision, and none of them were picked for the sound.

**Universal** was the job description. The [specification](https://archive.org/details/usbspec_1.0/page/n10) opens with its motivations, and one of them is a complaint that "the PC's I/O interfaces such as serial/parallel ports, keyboard/mouse/joystick interfaces, etc., do not have the attributes of plug and play." One socket, an entire drawer of cables retired.

**Serial** is the method. [Serial communication](https://en.wikipedia.org/wiki/Serial_communication) means sending data one bit at a time, sequentially, as against parallel communication, where several bits go out together across several channels. The [parallel printer port](https://en.wikipedia.org/wiki/Parallel_port) that USB helped kill needed eight data pins plus control pins and grounds, and arrived at the PC on a 25-pin DB-25 connector. USB carries its data on **two wires** and its power on two more: the original [cable](https://archive.org/details/usbspec_1.0/page/n29) "has four conductors: a twisted signal pair of standard gauge and a power pair in a range of permitted gauges."

**Bus** is a borrowed word. Early computer buses "were named after electrical power buses, or [busbars](https://en.wikipedia.org/wiki/Bus_%28computing%29)," the metal bars inside [switchgear and panel boards](https://en.wikipedia.org/wiki/Busbar) that distribute power and can be tapped at various points. A bus is a shared road rather than a private line, and the [specification](https://archive.org/details/usbspec_1.0/page/n26) describes USB as "a cable bus that supports data exchange between a host computer and a wide range of simultaneously accessible peripherals." One USB port can end up feeding a hub, a keyboard, a mouse and a hard drive at once.

## The 1996 fix was an icon you could feel

The original design did not try to make the plug reversible. It asked for a symbol: the [USB icon](https://archive.org/details/usbspec_1.0/page/n100) "should be molded into the connector and also placed on the product for ease of identifying the USB port," and the plug was to have "a 0.635 mm rectangular recessed area around the icon such that there is a perceptible feel of the icon."

The same section recommends that the icon on the product and the one on the plug sit next to each other when the two are mated, so lining up the two icons also tells you which way up the plug goes. A mechanical problem was handed a tactile label, and the human race has been overruling it ever since.

## The rock star in the 2009 advert is an actor

Bhatt's Intel team did not work alone. The [1.0 specification](https://archive.org/details/usbspec_1.0) went out under the names of seven companies: Compaq, Digital Equipment Corporation, IBM PC Company, Intel, Microsoft, NEC and Northern Telecom. A [2009 advertising campaign by Intel](https://www.cnn.com/2013/04/26/tech/innovation/usb-intel-billion-seller) made Bhatt famous by proxy, and the ad was popular enough that Conan O'Brien had the real engineer on the Tonight Show in October 2009, [CNN reported](https://edition.cnn.com/2010/TECH/02/04/ajay.bhatt.usb.inventor/index.html).

The man on screen is an actor. "Our rock stars aren't like your rock stars," the commercial said, but as [CNN's John D. Sutter wrote](https://edition.cnn.com/2010/TECH/02/04/ajay.bhatt.usb.inventor/index.html), "In the Intel ad, Bhatt is played by actor Sunil Narkar." The real Bhatt was an Intel Fellow who also held the post of chief I/O architect, and his [Intel press biography](https://web.archive.org/web/20091104041719/http://www.intel.com/pressroom/kits/bios/abhatt.htm) says that in that role "he is responsible for the platform and I/O interconnects directions for Intel," which is a less photogenic job than the one in the commercial.

## Four contacts against twenty-four

| | Type-A (1996) | USB-C (2014) |
|---|---|---|
| Contacts in the socket | 4 | 24 |
| Goes in either way up | No | Yes |
| Rated insertion cycles | 1,500 | 10,000 |
| Orientation handled by | The user | The cable and the device |

The original durability test has a connector [mated and unmated 1500 times](https://archive.org/details/usbspec_1.0/page/n102), at no more than 200 cycles an hour. The USB-C specification sets the durability rating at [10,000 cycles minimum](https://www.usb.org/sites/default/files/USB%20Type-C%20Spec%20R2.0%20-%20August%202019.pdf#page=126), more than six times the old figure.

## USB-C is not symmetrical either

The reversible connector solved the flip without ever becoming symmetrical. Its [specification](https://www.usb.org/sites/default/files/USB%20Type-C%20Spec%20R2.0%20-%20August%202019.pdf#page=33) says the plug "can be inserted into a receptacle in either one of two orientations," gives the socket two Configuration Channel pins that "enable a method for detecting plug orientation," and has those same pins settle which side is host and which is device, a job the different shapes of the Type-A and Type-B plugs used to do.

Inside a standard cable only one CC position in each plug is wired through, and the [specification](https://www.usb.org/sites/default/files/USB%20Type-C%20Spec%20R2.0%20-%20August%202019.pdf#page=31) says "the other CC pin is repurposed as VCONN for powering electronics in the USB Type-C plug." That one connected pin is what closes the gap. The port reads it, finds out which way round you plugged it in, and routes its signals to match.

That is the price of not having to look at a plug: twenty extra contacts in the socket and a negotiation. Four contacts in a row was the cheaper, simpler arrangement, and it kept working, so it ran for eighteen years before a reversible plug arrived.

Every failed insertion is a small, accurate report on an engineering trade-off from 1996: four wires, no orientation logic, and an icon on the plug that you were meant to feel for first. Strictly FYI.
