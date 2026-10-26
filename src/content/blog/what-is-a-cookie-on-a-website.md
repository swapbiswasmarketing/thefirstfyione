---
title: "What Is a Cookie on a Website? Invented for a Shopping Cart"
description: "What is a cookie on a website? It is a small piece of data your browser stores and sends back, and Netscape invented it in 1994 to make a shopping cart work."
pubDate: 2026-10-25
category: "tech"
filecode: "FYI-125"
almanac: "Netscape's original cookie specification says that 'the state object is called a cookie, for no compelling reason.'"
featured: false
faqs:
  - q: "Why are they called cookies?"
    a: "The name comes from magic cookie, programmers' slang for a token that one program hands to another and later gets back, much like a claim check. Lou Montulli, the Netscape programmer who invented web cookies in 1994, had heard the term in an operating systems course in college, and he later wrote that cookies was the first name he came up with."
  - q: "What is the difference between first-party and third-party cookies?"
    a: "A first-party cookie is set by the website shown in the browser's address bar. A third-party cookie is set by a different domain whose content, such as an ad or an embedded image, loads inside the page. Because the same company's content can appear on many sites, its cookie can let it recognize one browser across all of them, though by default Safari blocks such cookies and Firefox keeps a separate set for each site."
  - q: "What happens when you delete cookies?"
    a: "The browser discards what those websites had stored, which can sign you out of sites and reset saved settings or a shopping cart. Apple's guide to Safari says that removing cookies and website data may reduce tracking but may also sign you out of websites or change how they behave. The sites can set new cookies on your next visit."
  - q: "Are cookies the same as browsing history?"
    a: "No. Browsing history is the browser's own list of the pages you have visited, while cookies are small pieces of data that websites ask the browser to store and send back to them, and a browser can clear one without the other."
  - q: "What is website data?"
    a: "Website data is what a browser keeps on behalf of the sites you visit, including their cookies and cached files. Apple's instructions for clearing cookies and cache on an iPhone while keeping the history use a single Safari button, Remove All Website Data."
---

Around July 1994, by his own account, Lou Montulli went to a meeting about a shopping server that another group at his company was building. They needed a shopping cart, and Montulli had to tell them that they "could not do it in any reasonable way with what existed," he wrote on [his blog](https://montulli.blogspot.com/2013/05/the-reasoning-behind-web-cookies.html) in 2013. He promised to think about the problem, and "at some point during the next week the general concept of Web Cookies formed in my head," [he recalled](https://montulli.blogspot.com/2013/05/the-reasoning-behind-web-cookies.html).

Montulli, [then 23](https://hiddenheroes.netguru.com/lou-montulli), was one of the first employees of Mosaic Communications, the start-up that took the name [Netscape](https://en.wikipedia.org/wiki/Netscape) that November. "It's one week of my life that turned into the most important thing that I ever did," he told the writer [Steven Johnson](https://hiddenheroes.netguru.com/lou-montulli).

## What is a cookie on a website?

A cookie is **a small piece of data that a website asks your browser to store** and then send back to that same site with later requests. Because the web's basic protocol forgets each visitor between pages, cookies are how a site remembers a login, a shopping cart or a setting from one click to the next.

[MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies), Mozilla's reference for web developers, calls a cookie "a small piece of data a server sends to a user's web browser," and adds that the browser may "send them back to the same server with later requests." The IETF's cookie standard, [RFC 6265](https://www.rfc-editor.org/rfc/rfc6265.html), published in **2011**, says they let servers "maintain a stateful session over the mostly stateless HTTP protocol."

Cookies are most often sorted two ways, by how long they last and by who sets them. A session cookie is "deleted when the current session ends," in [MDN's wording](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies), and a third-party cookie "belongs to a domain different from the one shown in the address bar," in [Wikipedia's definition](https://en.wikipedia.org/wiki/HTTP_cookie).

| Kind | How it differs |
|---|---|
| Session cookie | Has no expiry date, so the browser drops it when the session ends, though browsers that restore sessions can keep it |
| Persistent cookie | Carries an expiry date or a maximum age and can last until then |
| First-party cookie | Set by the site shown in the address bar |
| Third-party cookie | Set by another domain whose ad, image or widget loads inside the page |

## The web forgot every visitor between clicks

The web needed a memory because of how HTTP, the protocol browsers use to fetch pages, was built: to "connect to a website, grab a document and then disconnect," as Montulli [put it](https://montulli.blogspot.com/2013/05/the-reasoning-behind-web-cookies.html). That freed servers for other visitors but left no idea of a session, so each click arrived as if from a stranger, and using a site meant, [in his words](https://montulli.blogspot.com/2013/05/the-reasoning-behind-web-cookies.html), "having to introduce yourself again, and again, and again."

For a shop, that meant a cart that emptied itself. Montulli told [Steven Johnson](https://hiddenheroes.netguru.com/lou-montulli) that the team had in mind a shopper who clicks to buy a pair of shoes and expects them "to go in the cart" and "not just disappear."

His answer was to let the server hand the browser a small payload and have the browser hand it back. "A Web server can return information to the browser that the browser should give back to the server each time it contacts the server in the future," [he wrote](https://montulli.blogspot.com/2013/05/the-reasoning-behind-web-cookies.html), and a server could put inside it "a random session identifier, a username, a shopping cart, or anything it wants."

## The original spec has Wile E. Coyote ordering a rocket launcher

His colleague John Giannandrea "was especially helpful with the design," Montulli [wrote](https://montulli.blogspot.com/2013/05/the-reasoning-behind-web-cookies.html), and the result was a short document, *Persistent Client State HTTP Cookies*. Netscape's original cookie specification, which [curl's website](https://curl.se/rfc/cookie_spec.html) keeps online, says that "the state object is called a cookie, for no compelling reason."

[The spec](https://curl.se/rfc/cookie_spec.html) promised that "shopping applications can now store information about the currently selected items," and its worked example is an order. The server sets `CUSTOMER=WILE_E_COYOTE`, then `PART_NUMBER=ROCKET_LAUNCHER_0001`, then `SHIPPING=FEDEX`, and the browser sends the pairs back with its next requests. Johnson dates the line that sets `CUSTOMER=WILE_E_COYOTE` to [the fall of 1994](https://hiddenheroes.netguru.com/lou-montulli).

Netscape's browser supported cookies from its first release in **October 1994**, [Wikipedia records](https://en.wikipedia.org/wiki/HTTP_cookie), and their first use on the internet, according to [Guinness World Records](https://www.guinnessworldrecords.com/world-records/106750-first-use-of-cookies-on-the-internet), was telling Netscape's own website whether a visitor had been there before. Browsers were expected to make room for at least **300** cookies, 20 per server, at 4 [kilobytes](/blog/what-is-a-byte/) each, under [Netscape's spec](https://curl.se/rfc/cookie_spec.html). The [2011 standard](https://www.rfc-editor.org/rfc/rfc6265.html) raised the counts to 3,000 cookies and 50 per domain, but it still asks for only **4,096 bytes** per cookie. Those few kilobytes stay in the visitor's own browser, unlike files kept in [the cloud](/blog/what-is-the-cloud/), which sit on a provider's servers in remote data centers.

## Magic cookie was Unix slang for a token programs pass back and forth

The name came from programmers' jargon. "I had heard the term 'magic cookie' from an operating systems course from college," Montulli [wrote](https://montulli.blogspot.com/2013/05/the-reasoning-behind-web-cookies.html), and "Cookies was the first thing I came up with and the name stuck."

The phrase was already in the Seventh Edition of the Unix manual, which [Bell Telephone Laboratories copyrighted in 1979](https://plan9.io/7thEdMan/index.html). Its page for [the fseek routine](https://man.cat-v.org/unix_7th/3/fseek), quoted in [Wikipedia's article on the term](https://en.wikipedia.org/wiki/Magic_cookie), says a position in a file "is measured in bytes on UNIX; on some other systems it is a magic cookie."

The [Jargon File](https://www.gutenberg.org/ebooks/38), "a comprehensive compendium of hacker slang," defined a cookie in a 1992 edition as "a handle, transaction ID, or other token of agreement between cooperating programs." [Its everyday example](https://www.gutenberg.org/ebooks/38) is the claim check from a [dry-cleaning shop](/blog/how-does-dry-cleaning-work/), useful only "to relate a later transaction to this one (so you get the same clothes back)."

## Montulli designed cookies not to track people across sites

The belief that cookies were invented to follow people around the web has the story backwards. Before cookies, a popular proposal was to give every browser a unique identifier, which Montulli [opposed](https://montulli.blogspot.com/2013/05/the-reasoning-behind-web-cookies.html): "I was very much against this concept because the unique identifier could be used to track a user at every website." His design sent a site's cookie back "only to the server," which, [he added](https://montulli.blogspot.com/2013/05/the-reasoning-behind-web-cookies.html), "prevented cross site tracking."

What he missed, [he later wrote](https://montulli.blogspot.com/2013/05/the-reasoning-behind-web-cookies.html), was "an interaction between cookies and embedded content within a webpage." A page can load images and ads from other servers, and those servers can set cookies of their own. When someone visits two sites that carry content from the same third party, [RFC 6265](https://www.rfc-editor.org/rfc/rfc6265.html) warns, "the third party can track the user between the two sites."

Ad networks found the gap. "Big ad companies, in particular DoubleClick, started using 3rd party cookies to track a browser uniquely across all of the sites that used DoubleClick to serve ads," Montulli [recalled](https://montulli.blogspot.com/2013/05/the-reasoning-behind-web-cookies.html), at first to count the unique users who saw an ad and to keep from showing them the same one every time, and later to fit the ads to each browser's habits. DoubleClick had incorporated in **January 1996**, according to a [history of the cookie standard](https://arxiv.org/pdf/cs/0105018) by David Kristol of Bell Labs, who headed the group that wrote it.

Kristol's group saw the danger that year. "In February, 1996, we identified what we felt was a considerable threat to privacy, third-party cookies," he wrote in [the same history](https://arxiv.org/pdf/cs/0105018). The group's standard, [RFC 2109](https://www.rfc-editor.org/rfc/rfc2109.html), published in **February 1997** with Kristol and Montulli as authors, let a browser accept such cookies only through settings that default to off.

The ad networks felt that language was "a dagger aimed at the heart of their business," Kristol [recalled](https://arxiv.org/pdf/cs/0105018), and the browser makers proved "unwilling to change the third-party default to 'off.'" At Netscape the call was Montulli's. "I agonized about the decision for weeks and in the end I chose to keep them," [he wrote](https://montulli.blogspot.com/2013/05/the-reasoning-behind-web-cookies.html), reasoning that if third-party cookies were blocked, advertisers would track people by other means, with less visibility and control.

> "Tracking across websites was certainly not what cookies were designed to do, they were designed with the opposite intention." - Lou Montulli, 2013

Some browsers later closed the gap on their own. In **2020** WebKit, the engine behind Safari, [announced](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/) that "cookies for cross-site resources are now blocked by default across the board," and Firefox by default gives third-party cookies "a separate cookie jar per site, preventing cross-site tracking," according to [MDN's guide](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Third-party_cookies). Google Chrome, the same guide notes, "doesn't block third-party cookies by default."

## Cookie banners trace to a 2009 European law

The consent pop-ups come from Europe. A 2009 amendment to the European Union's ePrivacy Directive, [Wikipedia's history of cookies](https://en.wikipedia.org/wiki/HTTP_cookie) explains, replaced an option to opt out of cookie storage with a requirement for consent, and cookies that a service the user asked for cannot work without are exempt. Britain's data regulator, the [Information Commissioner's Office](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/), gives as an example of a cookie that needs no consent one used "to remember what's in their online basket."

Three decades of tracking and lawmaking have piled onto one week of Montulli's work, and Europe's consent rules still wave through the job he built it for: a site can remember your shopping cart without asking. Strictly FYI.
