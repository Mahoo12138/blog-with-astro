import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	// 草稿不进入 RSS（与列表 / sitemap 保持一致）
	const posts = (await getCollection('posts')).filter((post) => !post.data.draft);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		stylesheet: '/rss.xsl',
		items: posts.map((post) => ({
			...post.data,
			link: `/post/${post.id}/`,
		})),
	});
}
