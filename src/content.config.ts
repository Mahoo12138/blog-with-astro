import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

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

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().default(''),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			author: z.string().default(''),
			layout: z.string().optional(),
			columnId: z.string().optional(),
			...taxonomyFields,
			...publicationFields,
			...mediaFields(image),
		}),
});

const wiki = defineCollection({
	loader: glob({ base: './src/content/wiki', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().default(''),
			pubDate: z.coerce.date().optional(),
			order: z.number().int().default(0),
			wikiTab: z.string().optional(),
			icon: z.string().optional(),
			layout: z.string().default('wiki'),
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
	loader: glob({ base: './src/content/columns', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().default(''),
			pubDate: z.coerce.date().optional(),
			columnId: z.string().optional(),
			order: z.number().int().default(0),
			icon: z.string().optional(),
			accent: z.string().optional(),
			layout: z.string().default('column'),
			...taxonomyFields,
			...publicationFields,
			...mediaFields(image),
		}),
});

const notes = defineCollection({
	loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().default(''),
			pubDate: z.coerce.date(),
			layout: z.string().default('note'),
			visibility: z.enum(['public', 'unlisted']).default('public'),
			pinned: z.boolean().default(false),
			mood: z.string().optional(),
			location: z.string().optional(),
			...taxonomyFields,
			...publicationFields,
			cover: image().optional(),
		}),
});

const goods = defineCollection({
	loader: glob({ base: './src/content/goods', pattern: '**/*.{yaml,yml}' }),
	schema: z.object({
		name: z.string(),
		description: z.string(),
		category: z.enum(['电子产品', '生活用品', '数码配件']),
		price: z.number(),
		rating: z.number(),
		reviewCount: z.number().int(),
		purchaseDate: z.coerce.date(),
		status: z.enum(['仍在使用', '已废置', '偶尔使用']),
		image: z.string().optional(),
	}),
});

export const collections = { blog, wiki, columns, notes, goods };
