// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Mahoo Space';
export const SITE_DESCRIPTION = 'Welcome to my planet!';
export const SITE_AUTHOR = 'mahoo12138';

export const POSTS_PER_PAGE = 10;

// 文章固定链接。全站 URL 规则只在此处定义一次，
// 避免散落在 archives / rss / StellarPostCard / 侧栏挂件等处各自拼字符串（历史上曾出现 /blog/ 死链）。
export const POST_ROUTE_PREFIX = 'post';

export function postUrl(id: string): string {
	return `/${POST_ROUTE_PREFIX}/${id}/`;
}
