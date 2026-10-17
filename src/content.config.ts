import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(["science", "history", "tech", "culture", "everyday", "curiosity"]).default("curiosity"),
    /* No longer rendered: reading time is computed from the body at build time
       (src/lib/entries.ts). Kept optional so older frontmatter still validates. */
    readingTime: z.string().optional(),
    filecode: z.string().optional(),
    /* Evergreen "start here" pick. Featuring is the operator's call. */
    featured: z.boolean().default(false),
    /* Pins this entry as the front-page lead, but only while it belongs to the
       newest filing date. Without a pin, the newest filing leads. */
    lead: z.boolean().default(false),
    /* One standalone line for the front-page almanac: lifted from the entry's own
       verified text, plain ASCII, readable with no context around it. */
    almanac: z.string().max(160).optional(),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
});

export const collections = { blog };
