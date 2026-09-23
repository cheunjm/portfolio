import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    repoUrl: z.string().url(),
    stars: z.number().default(0),
    language: z.string().nullable().default(null),
    updatedAt: z.coerce.date(),
    featured: z.boolean().default(false),
    hidden: z.boolean().default(false),
  }),
});

export const collections = { projects };
