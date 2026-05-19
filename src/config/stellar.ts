import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export type MenuId = 'post' | 'columns' | 'explore' | 'about' | 'rss' | 'wiki' | 'notebooks';
export type SidebarWidgetId = 'welcome' | 'recent' | 'related' | 'timeline' | 'media' | 'toc' | 'ghrepo' | 'heatmap' | 'goods-stats' | 'gallery-info' | 'gallery-albums';
export type SiteTreeKey = 'home' | 'index_blog' | 'index_topic' | 'explore' | 'gallery' | 'post' | 'topic' | 'wiki' | 'notebooks' | 'notes' | 'note' | 'author' | 'error_page' | 'page';

export interface MenubarItem {
	id: MenuId;
	theme: string;
	icon: string;
	title: string;
	url: string;
}

export interface SidebarWidgetConfig {
	id: SidebarWidgetId;
	layout: SidebarWidgetId;
	title?: string;
	body?: string;
	limit?: number;
}

interface FooterSocialItem {
	title: string;
	url: string;
	icon: string;
}

interface FooterSitemapGroup {
	title: string;
	items: { label: string; url: string }[];
}

export type SidebarWidgetRef = SidebarWidgetId | (Partial<SidebarWidgetConfig> & { id?: SidebarWidgetId; override?: SidebarWidgetId });
export type SidebarValue = SidebarWidgetRef | SidebarWidgetRef[] | string | null | undefined;

interface SiteTreeEntry {
	menuId: MenuId;
	leftbar: SidebarValue;
	rightbar: SidebarValue;
}

export const stellarConfig = {
	logo: {
		title: SITE_TITLE,
		subtitle: SITE_DESCRIPTION,
		url: '/',
	},
	menubar: {
		columns: 5,
		items: [
			{
				id: 'post',
				theme: '#1BCDFC',
				icon: 'stellar:menu-post',
				title: '博客',
				url: '/',
			},
			{
				id: 'columns',
				theme: '#FA6400',
				icon: 'stellar:menu-columns',
				title: '专栏',
				url: '/columns',
			},
			{
				id: 'explore',
				theme: '#32B67A',
				icon: 'solar:planet-bold-duotone',
				title: '探索',
				url: '/explore',
			},
			{
				id: 'about',
				theme: '#F44336',
				icon: 'stellar:menu-about',
				title: '关于',
				url: '/about',
			},
			{
				id: 'rss',
				theme: '#FFB300',
				icon: 'stellar:menu-rss',
				title: 'RSS',
				url: '/rss.xml',
			},
		] satisfies MenubarItem[],
	},
	footer: {
		content: `© {year} {site.title}. Built with Astro · Inspired by Stellar.`,
		sitemap: [
			{
				title: '内容',
				items: [
					{ label: '近期发布', url: '/' },
					{ label: '归档', url: '/archives' },
					{ label: '分类', url: '/categories' },
					{ label: '标签', url: '/tags' },
					{ label: '探索', url: '/explore' },
				],
			},
			{
				title: '站点',
				items: [
					{ label: '专栏', url: '/columns' },
					{ label: '关于', url: '/about' },
					{ label: 'RSS', url: '/rss.xml' },
				],
			},
		] satisfies FooterSitemapGroup[],
		social: [
			{
				title: 'RSS',
				url: '/rss.xml',
				icon: 'default:rss',
			},
			{
				title: 'About',
				url: '/about',
				icon: 'stellar:menu-about',
			},
			{
				title: 'Columns',
				url: '/columns',
				icon: 'stellar:menu-columns',
			},
		] satisfies FooterSocialItem[],
	},
	widgets: {
		welcome: { id: 'welcome', layout: 'welcome', title: '欢迎', body: '这里是静态内容与长期写作的整理地。' },
		recent: { id: 'recent', layout: 'recent', title: '最近更新', limit: 8 },
		related: { id: 'related', layout: 'recent', title: '相关文章', limit: 5 },
		timeline: { id: 'timeline', layout: 'timeline', title: '近期动态', limit: 3 },
		media: { id: 'media', layout: 'media', title: '精选文章' },
		toc: { id: 'toc', layout: 'toc', title: '本文目录' },
		ghrepo: { id: 'ghrepo', layout: 'ghrepo', title: '仓库' },
		heatmap: { id: 'heatmap', layout: 'heatmap', title: '热力图', limit: 8 },
		'goods-stats': { id: 'goods-stats', layout: 'goods-stats', title: '好物统计' },
		'gallery-info': { id: 'gallery-info', layout: 'gallery-info', title: '我的相册', body: '这里是我的日常生活记录，用镜头记下每一个小确幸。' },
		'gallery-albums': { id: 'gallery-albums', layout: 'gallery-albums', title: '相册列表' },
	} satisfies Record<SidebarWidgetId, SidebarWidgetConfig>,
	siteTree: {
		home: { menuId: 'post', leftbar: ['welcome', 'recent'], rightbar: ['heatmap'] },
		index_blog: { menuId: 'post', leftbar: ['welcome', 'recent'], rightbar: null },
		index_topic: { menuId: 'columns', leftbar: ['welcome', 'recent'], rightbar: null },
		explore: { menuId: 'explore', leftbar: ['welcome', 'recent'], rightbar: null },
		gallery: { menuId: 'explore', leftbar: ['gallery-info', 'gallery-albums'], rightbar: null },
		post: { menuId: 'post', leftbar: ['related', 'recent'], rightbar: ['ghrepo', 'toc'] },
		topic: { menuId: 'post', leftbar: ['related', 'recent'], rightbar: ['ghrepo', 'toc'] },
		wiki: { menuId: 'wiki', leftbar: ['related', 'recent'], rightbar: ['ghrepo', 'toc'] },
		notebooks: { menuId: 'notebooks', leftbar: ['recent'], rightbar: null },
		notes: { menuId: 'notebooks', leftbar: ['recent'], rightbar: null },
		note: { menuId: 'notebooks', leftbar: ['recent'], rightbar: ['timeline'] },
		author: { menuId: 'about', leftbar: ['recent'], rightbar: ['timeline'] },
		error_page: { menuId: 'post', leftbar: ['recent'], rightbar: ['timeline'] },
		page: { menuId: 'about', leftbar: ['recent'], rightbar: ['timeline'] },
	} satisfies Record<SiteTreeKey, SiteTreeEntry>,
};

function parseSidebarValue(value: SidebarValue): SidebarWidgetRef[] {
	if (value == null) {
		return [];
	}
	if (Array.isArray(value)) {
		return value;
	}
	if (typeof value === 'string') {
		return value.split(',').map((item) => item.trim()).filter(Boolean) as SidebarWidgetId[];
	}
	return [value];
}

export function resolveSidebarWidgets(value: SidebarValue): SidebarWidgetConfig[] {
	const widgets: SidebarWidgetConfig[] = [];

	for (const widgetRef of parseSidebarValue(value)) {
		if (typeof widgetRef === 'string') {
			widgets.push(stellarConfig.widgets[widgetRef] as SidebarWidgetConfig);
			continue;
		}

		const id = widgetRef.override ?? widgetRef.id;
		if (!id) {
			continue;
		}

		const baseWidget = stellarConfig.widgets[id] as SidebarWidgetConfig;
		widgets.push({
			...baseWidget,
			...widgetRef,
			id,
			layout: widgetRef.layout ?? baseWidget.layout,
		});
	}

	return widgets;
}

export function resolveShellConfig(siteTree: SiteTreeKey = 'page', overrides: { menuId?: MenuId; leftbar?: SidebarValue; rightbar?: SidebarValue } = {}) {
	const entry = stellarConfig.siteTree[siteTree] ?? stellarConfig.siteTree.page;

	return {
		menuId: overrides.menuId ?? entry.menuId,
		leftbar: resolveSidebarWidgets(overrides.leftbar ?? entry.leftbar),
		rightbar: resolveSidebarWidgets(overrides.rightbar ?? entry.rightbar),
	};
}