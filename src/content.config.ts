import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const taxonomyFields = {
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
};

const publicationFields = {
  updatedDate: z.coerce.date().optional(),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
};

const mediaFields = (image: () => z.ZodTypeAny) => ({
  heroImage: image().optional(),
  cover: image().optional(),
  banner: image().optional(),
});

const posts = defineCollection({
  // Load Markdown and MDX files in the `src/content/posts/` directory.
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string().default(""),
        // Accept both Astro-style pubDate and Hexo-style date
        pubDate: z.coerce.date().optional(),
        date: z.coerce.date().optional(),
        author: z.string().default(""),
        layout: z.string().optional(),
        columnId: z.string().optional(),
        // Hexo fields
        img: z.string().optional(), // Hexo cover image URL
        mathjax: z.boolean().default(false),
        topic: z.string().optional(),
        updated: z.coerce.date().optional(), // Hexo alias for updatedDate
        ...taxonomyFields,
        ...publicationFields,
        ...mediaFields(image),
      })
      .transform((data) => ({
        ...data,
        pubDate: data.pubDate ?? data.date ?? new Date(0),
        updatedDate: data.updatedDate ?? data.updated,
      })),
});

const wiki = defineCollection({
  loader: glob({ base: "./src/content/wiki", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().default(""),
      pubDate: z.coerce.date().optional(),
      order: z.number().int().default(0),
      wikiTab: z.string().optional(),
      icon: z.string().optional(),
      layout: z.string().default("wiki"),
      toc: z.boolean().default(true),
      sidebar: z
        .object({
          label: z.string().optional(),
          hidden: z.boolean().default(false),
          collapsed: z.boolean().default(false),
        })
        .optional(),
      ...taxonomyFields,
      ...publicationFields,
      ...mediaFields(image),
    }),
});

const columns = defineCollection({
  loader: glob({ base: "./src/content/columns", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().default(""),
      pubDate: z.coerce.date().optional(),
      columnId: z.string().optional(),
      order: z.number().int().default(0),
      icon: z.string().optional(),
      accent: z.string().optional(),
      layout: z.string().default("column"),
      ...taxonomyFields,
      ...publicationFields,
      ...mediaFields(image),
    }),
});

const notes = defineCollection({
  loader: glob({ base: "./src/content/notes", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().default(""),
      pubDate: z.coerce.date(),
      layout: z.string().default("note"),
      visibility: z.enum(["public", "unlisted"]).default("public"),
      pinned: z.boolean().default(false),
      mood: z.string().optional(),
      location: z.string().optional(),
      ...taxonomyFields,
      ...publicationFields,
      cover: image().optional(),
    }),
});

const goods = defineCollection({
  loader: glob({ base: "./src/content/goods", pattern: "**/*.{yaml,yml}" }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    category: z.enum(["电子产品", "生活用品", "数码配件"]),
    price: z.number(),
    rating: z.number(),
    reviewCount: z.number().int(),
    purchaseDate: z.coerce.date(),
    status: z.enum(["仍在使用", "已废置", "偶尔使用"]),
    image: z.string().optional(),
  }),
});

const phones = defineCollection({
  loader: glob({ base: "./src/content/phones", pattern: "**/*.{yaml,yml}" }),
  schema: z.object({
    name: z.string(),
    alias: z.string(),
    brand: z.string(),
    brandAlias: z.string(),
    releaseYear: z.number().int(),
    yearFrom: z.number().int(),
    yearTo: z.number().int().nullable().default(null),
    stillOwn: z.boolean().default(false),
    isPrimary: z.boolean().default(false),
    color: z.string(),
    colorName: z.string().optional(),
    like: z.enum(["y", "n", ""]).default(""),
    review: z.string().optional(),
    imagePath: z.string(),
    addedAt: z.coerce.date().optional(),
    order: z.number().int().default(0),
  }),
});

const loveTimeline = defineCollection({
  loader: file("./src/content/love/timeline.yaml"),
  schema: z.object({
    badge: z.string(),
    date: z.string(),
    title: z.string(),
    description: z.string(),
  }),
});

const lovePhotos = defineCollection({
  loader: file("./src/content/love/photos.yaml"),
  schema: z.object({
    date: z.string(),
    title: z.string(),
    caption: z.string(),
    gradient: z.string(),
  }),
});

const loveFirsts = defineCollection({
  loader: file("./src/content/love/firsts.yaml"),
  schema: z.object({
    icon: z.string(),
    title: z.string(),
    date: z.string(),
    description: z.string(),
  }),
});

const loveStats = defineCollection({
  loader: file("./src/content/love/stats.yaml"),
  schema: z.object({
    icon: z.string(),
    target: z.number(),
    suffix: z.string().default(""),
    label: z.string(),
  }),
});

const loveTraits = defineCollection({
  loader: file("./src/content/love/traits.yaml"),
  schema: z.object({
    icon: z.string(),
    label: z.string(),
    size: z.enum(["sm", "md", "lg"]).default("md"),
  }),
});

const loveDestinations = defineCollection({
  loader: file("./src/content/love/destinations.yaml"),
  schema: z.object({
    number: z.string(),
    city: z.string(),
    description: z.string(),
    tag: z.string(),
    visited: z.boolean().default(false),
  }),
});

const loveWishes = defineCollection({
  loader: file("./src/content/love/wishes.yaml"),
  schema: z.object({
    text: z.string(),
    category: z.string(),
    done: z.boolean().default(false),
  }),
});

const lovePromises = defineCollection({
  loader: file("./src/content/love/promises.yaml"),
  schema: z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string(),
    tag: z.string(),
  }),
});

const loveDateIdeas = defineCollection({
  loader: file("./src/content/love/date-ideas.yaml"),
  schema: z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string(),
  }),
});

const loveNotes = defineCollection({
  loader: file("./src/content/love/notes.yaml"),
  schema: z.object({
    text: z.string(),
  }),
});


const cities = defineCollection({
  loader: glob({ base: "./src/content/cities", pattern: "**/*.{yaml,yml}" }),
  schema: z.object({
    name: z.string(),
    nameEn: z.string().optional(),
    country: z.string().default("中国"),
    countryCode: z.string().optional(),
    region: z.string().optional(),
    lat: z.number(),
    lng: z.number(),
    visitedAt: z.coerce.date(),
    revisits: z.array(z.coerce.date()).default([]),
    note: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const residences = defineCollection({
  loader: glob({
    base: "./src/content/residences",
    pattern: "**/*.{yaml,yml}",
  }),
  schema: z.object({
    name: z.string(),
    nameEn: z.string().optional(),
    country: z.string().default("中国"),
    province: z.string().optional(),
    lat: z.number(),
    lng: z.number(),
    since: z.coerce.date(),
    until: z.coerce.date().optional(),
    kind: z.enum(["birth", "school", "university", "work", "home"]),
    order: z.number().int().default(0),
    note: z.string().optional(),
  }),
});

export const collections = {
  posts,
  wiki,
  columns,
  notes,
  goods,
  phones,
	cities,
	residences,
  loveTimeline,
  lovePhotos,
  loveFirsts,
  loveStats,
  loveTraits,
  loveDestinations,
  loveWishes,
  lovePromises,
  loveDateIdeas,
  loveNotes,
};