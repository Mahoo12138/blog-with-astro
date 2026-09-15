import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE, postUrl } from '../consts';
import { resolvePostDescription, sortBlogPosts, standalonePosts } from '../utils/content';

export async function GET(context) {
	// 草稿不进入 RSS（与列表 / sitemap 保持一致）；
	// 专栏章节同样不进 RSS —— 订阅者不该被某个学习系列的连载刷屏，
	// 专栏更新靠站点内的「专栏」入口与首页展示位触达。
	const posts = sortBlogPosts(standalonePosts(await getCollection('posts')));
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		stylesheet: '/rss.xsl',
		items: posts.map((post) => ({
			title: post.data.title,
			// 手写 description 优先，缺省回退正文摘要。
			// 修复前 124 条 item 全部没有 description，阅读器里只有标题。
			description: resolvePostDescription(post),
			pubDate: post.data.pubDate,
			link: postUrl(post.id),			categories: [...(post.data.categories ?? []), ...(post.data.tags ?? [])],
			author: post.data.author || undefined,
		})),
	});
}
