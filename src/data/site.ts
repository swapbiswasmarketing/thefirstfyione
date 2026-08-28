/* Shared brand constants. Single source of truth so the masthead,
   the department index and the archive never drift apart. */

export const catLabel: Record<string, string> = {
  science: "Science",
  history: "History",
  tech: "Tech",
  culture: "Culture",
  everyday: "Everyday",
  curiosity: "Curiosity",
};

export const cats = [
  { key: "science", n: "01", name: "Science", note: "How the universe actually works" },
  { key: "history", n: "02", name: "History", note: "The stories behind the story" },
  { key: "tech", n: "03", name: "Tech", note: "Why the things around you work" },
  { key: "culture", n: "04", name: "Culture", note: "Ideas, language, and why we do things" },
  { key: "everyday", n: "05", name: "Everyday", note: "The hidden logic of ordinary life" },
  { key: "curiosity", n: "06", name: "Curiosity", note: "The wonderfully, oddly true" },
];

export const facts = [
  "Honey found in 3,000-year-old Egyptian tombs was still edible.",
  "A day on Venus is longer than its year.",
  "Bananas are botanically berries. Strawberries are not.",
  "Octopuses have three hearts and blue blood.",
  "The Eiffel Tower can be about 15 cm taller in summer heat.",
];

export const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const fmtLong = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

/* Google Tag Manager container ID, e.g. "GTM-ABC1234". GA4 and Microsoft
   Clarity are configured as tags inside this container, so this is the only
   analytics snippet the site ships. Leave it empty to render no analytics at
   all, which is what local dev and any pre-launch build should do. */
export const gtmId = "GTM-WLHM6RXG";
