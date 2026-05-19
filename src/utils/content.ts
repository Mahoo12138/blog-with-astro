import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'posts'>;
type ColumnEntry = CollectionEntry<'columns'>;

export type TaxonomyKey = 'categories' | 'tags';

export interface TaxonomyBucket {
	label: string;
	slug: string;
	posts: BlogPost[];
}

export interface ColumnBucket {
	title: string;
	slug: string;
	description: string;
	accent?: string;
	posts: BlogPost[];
	entry?: ColumnEntry;
}

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

export function sortBlogPosts(posts: BlogPost[]) {
	return [...posts]
		.filter((post) => !post.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getPhotoIndex(posts: BlogPost[]) {
	return posts.findIndex((post, index) => index > 1 && post.data.heroImage);
}

export function slugifySegment(value: string) {
	const slug = value
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	return slug || encodeURIComponent(value.trim().toLowerCase());
}

function normalizeValues(values: string[]) {
	return values.map((value) => value.trim()).filter(Boolean);
}

export function buildTaxonomyBuckets(posts: BlogPost[], key: TaxonomyKey) {
	const buckets = new Map<string, TaxonomyBucket>();

	for (const post of posts) {
		for (const value of normalizeValues(post.data[key] ?? [])) {
			const slug = slugifySegment(value);
			const existing = buckets.get(slug);

			if (existing) {
				existing.posts.push(post);
				continue;
			}

			buckets.set(slug, {
				label: value,
				slug,
				posts: [post],
			});
		}
	}

	return [...buckets.values()].sort((left, right) => right.posts.length - left.posts.length || collator.compare(left.label, right.label));
}

export function buildColumnBuckets(posts: BlogPost[], columns: ColumnEntry[]) {
	const postsByColumn = new Map<string, BlogPost[]>();

	for (const post of posts) {
		const columnId = post.data.columnId?.trim();
		if (!columnId) {
			continue;
		}

		const existing = postsByColumn.get(columnId) ?? [];
		existing.push(post);
		postsByColumn.set(columnId, existing);
	}

	const buckets: ColumnBucket[] = columns.map((column) => {
		const columnId = column.data.columnId ?? column.id;
		return {
			title: column.data.title,
			slug: slugifySegment(columnId),
			description: column.data.description,
			accent: column.data.accent,
			posts: postsByColumn.get(columnId) ?? [],
			entry: column,
		};
	});

	return buckets.sort((left, right) => {
		const leftOrder = left.entry?.data.order ?? Number.MAX_SAFE_INTEGER;
		const rightOrder = right.entry?.data.order ?? Number.MAX_SAFE_INTEGER;
		return leftOrder - rightOrder || collator.compare(left.title, right.title);
	});
}