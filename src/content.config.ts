// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; 

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(), 
    category: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(), 
    pinned: z.boolean().optional(),      
    updatedDate: z.coerce.date().optional(), 
  }),
});

const nothing = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/nothing" }),
  schema: z.object({
    date: z.string(), 
  }),
});

export const collections = { blog, nothing };
