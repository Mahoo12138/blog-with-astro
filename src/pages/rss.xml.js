import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { postUrl, SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { sortBlogPosts } from '../utils/content';

/** 从 Markdown/MDX 正文里剥出纯文本摘要，作为 description 兜底。 */
function excerptFromBody(body = '', maxLength = 120) {
	const text = body
		// 去掉 fenced code block
		.replace(/```[\s\S]*?```/g, ' ')
		// 去掉 MDX/HTML 标签
		.replace(/<[^>]+>/g, ' ')
		// 去掉图片、链接，保留链接文字
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		// 去掉标题、引用、列表等行首标记
		.replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s*/gm, '')
		// 去掉强调、行内代码标记
		.replace(/[*_`~]/g, '')
		// 压缩空白
		.replace(/\s+/g, ' ')
		.trim();

	if (text.length <= maxLength) {
		return text;
	}
	return `${text.slice(0, maxLength).trimEnd()}…`;
}

export async function GET(context) {
	// 草稿不进入 RSS（与列表 / sitemap 保持一致）
	const posts = sortBlogPosts(await getCollection('posts'));
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		stylesheet: '/rss.xsl',
		items: posts.map((post) => {
			// frontmatter description 空串时回退到正文摘要，
			// 否则阅读器里每条只有标题，订阅体验等于不可用。
			const description = post.data.description?.trim() || excerptFromBody(post.body) || post.data.title;
			return {
				title: post.data.title,
				description,
				pubDate: post.data.pubDate,
				link: postUrl(post.id),
				categories: [...(post.data.categories ?? []), ...(post.data.tags ?? [])],
				author: post.data.author || undefined,
			};
		}),
	});
}
