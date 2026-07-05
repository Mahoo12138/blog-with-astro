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

export interface ResolvedPostCover {
	variant: 'cover' | 'photo' | 'default';
	src: {}; // TODO: type this better
	isLocal: boolean;
}

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

export function sortBlogPosts(posts: BlogPost[]) {
	return [...posts]
		.filter((post) => !post.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/**
 * Resolve a post's cover from frontmatter.
 * - `cover` field → `cover` variant (top-of-card thumbnail)
 * - `img` field   → `photo` variant (full-bleed)
 * - both set      → `cover` wins, `img` ignored
 *
 * Source can be either a remote URL string or a local ImageMetadata.
 * `isLocal` lets callers choose between <Image> and plain <img>.
 */
export function resolvePostCover(post: BlogPost): ResolvedPostCover | null {
	const coverVal = post.data.cover;
	if (coverVal !== undefined && coverVal !== null) {
		return {
			variant: 'cover',
			src: coverVal,
			isLocal: typeof coverVal !== 'string',
		};
	}
	const imgVal = post.data.img;
	if (imgVal !== undefined && imgVal !== null) {
		const trimmed = typeof imgVal === 'string' ? imgVal.trim() : imgVal;
		if (trimmed) {
			return {
				variant: 'photo',
				src: trimmed,
				isLocal: typeof trimmed !== 'string',
			};
		}
	}
	return null;
}

export function slugifySegment(value: string) {
	const normalized = value.trim().toLowerCase().normalize('NFKC');
	const slug = normalized
		.replace(/["'’]+/g, '')
		.replace(/[^\p{Letter}\p{Number}]+/gu, '-')
		.replace(/^-+|-+$/g, '');
	const asciiSlug = slug
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^\x00-\x7F]+/g, '')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '');

	return asciiSlug || slug || normalized.replace(/\s+/g, '-');
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