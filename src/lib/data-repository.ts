/**
 * 统一数据访问层（Data Repository）
 * 
 * 提供类型安全、缓存友好的数据获取 API，抽象 Astro Content Collections
 * 的细节，支持 SSR/SSG 环境下的数据预取和缓存策略。
 */

import type { CollectionEntry } from 'astro:content';
import { getCollection, render, type RenderResult } from 'astro:content';

// ============================================================================
// 类型定义
// ============================================================================

export type BlogPost = CollectionEntry<'posts'>;
export type WikiEntry = CollectionEntry<'wiki'>;
export type ColumnEntry = CollectionEntry<'columns'>;
export type NoteEntry = CollectionEntry<'notes'>;
export type GoodsEntry = CollectionEntry<'goods'>;
export type CityEntry = CollectionEntry<'cities'>;
export type ResidenceEntry = CollectionEntry<'residences'>;

export interface RenderedContent<T extends CollectionEntry<any>> {
	entry: T;
	content: RenderResult<any>;
	headings: Array<{ depth: number; slug: string; text: string }>;
}

export interface TaxonomyBucket {
	label: string;
	slug: string;
	count: number;
	posts: BlogPost[];
}

export interface ColumnBucket {
	title: string;
	slug: string;
	description: string;
	accent?: string;
	icon?: string;
	order: number;
	posts: BlogPost[];
	entry?: ColumnEntry;
}

interface HeadingInfo {
	depth: number;
	slug: string;
	text: string;
}

// ============================================================================
// 缓存管理
// ============================================================================

interface CacheEntry<T> {
	data: T;
	timestamp: number;
	staleWhileRevalidate?: boolean;
}

class DataCache {
	private cache = new Map<string, CacheEntry<any>>();
	private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 分钟

	get<T>(key: string, ttl: number = this.DEFAULT_TTL): T | null {
		const entry = this.cache.get(key) as CacheEntry<T> | undefined;
		if (!entry) return null;

		const isStale = Date.now() - entry.timestamp > ttl;
		if (isStale && !entry.staleWhileRevalidate) {
			this.cache.delete(key);
			return null;
		}

		return entry.data;
	}

	set<T>(key: string, data: T, staleWhileRevalidate: boolean = false): void {
		this.cache.set(key, {
			data,
			timestamp: Date.now(),
			staleWhileRevalidate,
		});
	}

	invalidate(pattern?: string): void {
		if (!pattern) {
			this.cache.clear();
			return;
		}

		for (const key of this.cache.keys()) {
			if (key.includes(pattern)) {
				this.cache.delete(key);
			}
		}
	}
}

export const cache = new DataCache();

// ============================================================================
// 工具函数
// ============================================================================

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

function slugifySegment(value: string): string {
	const normalized = value.trim().toLowerCase().normalize('NFKC');
	const slug = normalized
		.replace(/["''']/g, '')
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

function normalizeValues(values: string[]): string[] {
	return values.map((value) => value.trim()).filter(Boolean);
}

// ============================================================================
// 博客文章数据访问
// ============================================================================

export async function getAllPosts(options?: { includeDrafts?: boolean }): Promise<BlogPost[]> {
	const cacheKey = `posts:all:${options?.includeDrafts ?? false}`;
	const cached = cache.get<BlogPost[]>(cacheKey);
	if (cached) return cached;

	const posts = await getCollection('posts');
	const filtered = options?.includeDrafts
		? posts
		: posts.filter((post: BlogPost) => !post.data.draft);

	const sorted = filtered.sort(
		(a: BlogPost, b: BlogPost) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
	);

	cache.set(cacheKey, sorted, true);
	return sorted;
}

export async function getRecentPosts(limit: number = 10): Promise<BlogPost[]> {
	const cacheKey = `posts:recent:${limit}`;
	const cached = cache.get<BlogPost[]>(cacheKey);
	if (cached) return cached;

	const allPosts = await getAllPosts({ includeDrafts: false });
	const recent = allPosts.slice(0, limit);
	cache.set(cacheKey, recent, true);
	return recent;
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
	const cacheKey = 'posts:featured';
	const cached = cache.get<BlogPost[]>(cacheKey);
	if (cached) return cached;

	const allPosts = await getAllPosts({ includeDrafts: false });
	const featured = allPosts.filter((post) => post.data.featured);
	cache.set(cacheKey, featured, true);
	return featured;
}

export async function getRelatedPosts(
	currentPost: BlogPost,
	limit: number = 5
): Promise<BlogPost[]> {
	const allPosts = await getAllPosts({ includeDrafts: false });
	const currentTags = new Set(currentPost.data.tags ?? []);
	const currentCategory = currentPost.data.categories?.[0];

	const scored = allPosts
		.filter((post) => post.id !== currentPost.id)
		.map((post) => {
			let score = 0;

			// 标签匹配
			const postTags = new Set(post.data.tags ?? []);
			const tagIntersection = [...currentTags].filter((t) => postTags.has(t)).length;
			score += tagIntersection * 3;

			// 分类匹配
			if (currentCategory && post.data.categories?.includes(currentCategory)) {
				score += 5;
			}

			// 时间接近度
			const timeDiff = Math.abs(
				post.data.pubDate.valueOf() - currentPost.data.pubDate.valueOf()
			);
			const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
			if (daysDiff < 30) score += 2;
			else if (daysDiff < 90) score += 1;

			return { post, score };
		})
		.filter(({ score }) => score > 0)
		.sort((a, b) => b.score - a.score || b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf());

	return scored.slice(0, limit).map(({ post }) => post);
}

// ============================================================================
// 分类法数据访问
// ============================================================================

export async function getTaxonomyBuckets(
	key: 'categories' | 'tags'
): Promise<TaxonomyBucket[]> {
	const cacheKey = `taxonomy:${key}`;
	const cached = cache.get<TaxonomyBucket[]>(cacheKey);
	if (cached) return cached;

	const posts = await getAllPosts({ includeDrafts: false });
	const buckets = new Map<string, TaxonomyBucket>();

	for (const post of posts) {
		for (const value of normalizeValues(post.data[key] ?? [])) {
			const slug = slugifySegment(value);
			const existing = buckets.get(slug);

			if (existing) {
				existing.posts.push(post);
				existing.count = existing.posts.length;
			} else {
				buckets.set(slug, {
					label: value,
					slug,
					count: 1,
					posts: [post],
				});
			}
		}
	}

	const result = [...buckets.values()].sort(
		(left, right) =>
			right.count - left.count || collator.compare(left.label, right.label)
	);

	cache.set(cacheKey, result, true);
	return result;
}

export async function getPostsByTaxonomy(
	key: 'categories' | 'tags',
	slug: string
): Promise<BlogPost[]> {
	const buckets = await getTaxonomyBuckets(key);
	const bucket = buckets.find((b) => b.slug === slug);
	return bucket?.posts ?? [];
}

// ============================================================================
// 专栏数据访问
// ============================================================================

export async function getAllColumns(): Promise<ColumnEntry[]> {
	const cacheKey = 'columns:all';
	const cached = cache.get<ColumnEntry[]>(cacheKey);
	if (cached) return cached;

	const columns = await getCollection('columns');
	const sorted = columns.sort(
		(a: ColumnEntry, b: ColumnEntry) => (a.data.order ?? Number.MAX_SAFE_INTEGER) - (b.data.order ?? Number.MAX_SAFE_INTEGER)
	);

	cache.set(cacheKey, sorted, true);
	return sorted;
}

export async function getColumnBuckets(): Promise<ColumnBucket[]> {
	const cacheKey = 'columns:buckets';
	const cached = cache.get<ColumnBucket[]>(cacheKey);
	if (cached) return cached;

	const [posts, columns] = await Promise.all([
		getAllPosts({ includeDrafts: false }),
		getAllColumns(),
	]);

	const postsByColumn = new Map<string, BlogPost[]>();

	for (const post of posts) {
		const columnId = post.data.columnId?.trim();
		if (!columnId) continue;

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
			icon: column.data.icon,
			order: column.data.order ?? Number.MAX_SAFE_INTEGER,
			posts: postsByColumn.get(columnId) ?? [],
			entry: column,
		};
	});

	const sorted = buckets.sort(
		(left, right) =>
			left.order - right.order || collator.compare(left.title, right.title)
	);

	cache.set(cacheKey, sorted, true);
	return sorted;
}

export async function getColumnBySlug(slug: string): Promise<ColumnBucket | null> {
	const buckets = await getColumnBuckets();
	return buckets.find((b) => b.slug === slug) ?? null;
}

// ============================================================================
// 渲染内容
// ============================================================================

export async function renderEntry<T extends CollectionEntry<any>>(
	entry: T
): Promise<RenderedContent<T>> {
	const cacheKey = `render:${entry.collection}:${entry.id}`;
	const cached = cache.get<RenderedContent<T>>(cacheKey);
	if (cached) return cached;

	const content = await render(entry);
	const headings = content.headings
		.filter((h: any) => h.depth >= 2 && h.depth <= 4)
		.map((h: any) => ({ depth: h.depth, slug: h.slug, text: h.text }) as HeadingInfo);

	const result = { entry, content, headings };
	cache.set(cacheKey, result, false); // 不缓存渲染结果，避免内存泄漏
	return result;
}

// ============================================================================
// 分页辅助
// ============================================================================

export function paginate<T>(items: T[], pageSize: number, page: number): {
	items: T[];
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
} {
	const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
	const startIndex = (page - 1) * pageSize;
	const endIndex = startIndex + pageSize;

	return {
		items: items.slice(startIndex, endIndex),
		totalPages,
		hasNext: page < totalPages,
		hasPrev: page > 1,
	};
}
