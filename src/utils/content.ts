import type { ImageMetadata } from 'astro';
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
	src: ImageMetadata | string;
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
 *
 * 字段已收敛：Hexo 遗留的 `img` 与从未使用的 `banner` 均已下线，
 * 全站只保留 `cover`（迁移见 Schema 收敛提交）。
 * `variant` 保留是为了兼容卡片既有的两种呈现（缩略图 / 全幅）。
 *
 * Source can be either a remote URL string or a local ImageMetadata.
 * `isLocal` lets callers choose between <Image> and plain <img>.
 */
export function resolvePostCover(post: BlogPost): ResolvedPostCover | null {
	const coverVal = post.data.cover;
	if (coverVal === undefined || coverVal === null) {
		return null;
	}
	if (typeof coverVal === 'string' && !coverVal.trim()) {
		return null;
	}
	return {
		variant: 'cover',
		src: typeof coverVal === 'string' ? coverVal.trim() : coverVal,
		isLocal: typeof coverVal !== 'string',
	};
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

/**
 * 从 Markdown/MDX 正文抽取纯文本摘要。
 *
 * 用于 description 缺省时的兜底（RSS 条目、卡片摘要、OG 描述），
 * 使「121 篇没有手写 description」不再直接退化成空摘要。
 * 同一份实现同时服务 RSS 与列表页，避免两处规则漂移。
 */
export function excerptFromBody(body = '', maxLength = 120) {
	const text = body
		// 去掉 fenced code block（摘要里贴代码没有意义）
		.replace(/```[\s\S]*?```/g, ' ')
		// 去掉 MDX/HTML 标签
		.replace(/<[^>]+>/g, ' ')
		// 去掉图片，链接只保留文字
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		// 去掉标题 / 引用 / 列表的行首标记
		.replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s*/gm, '')
		// 去掉强调与行内代码标记
		.replace(/[*_`~]/g, '')
		// 压缩空白
		.replace(/\s+/g, ' ')
		.trim();

	if (text.length <= maxLength) {
		return text;
	}
	return `${text.slice(0, maxLength).trimEnd()}…`;
}

/**
 * 文章的最终描述：优先手写 description，缺省时回退正文摘要。
 */
export function resolvePostDescription(post: BlogPost, maxLength = 160) {
	const explicit = post.data.description?.trim();
	if (explicit) {
		return explicit;
	}
	return excerptFromBody(post.body, maxLength) || post.data.title;
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