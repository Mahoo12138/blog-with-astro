import type { ExploreIconImageKey } from '../assets/explore-icons';

export type ExploreContentLayoutKey = 'default' | 'wide' | 'blank';
export type ExploreRouteKind = 'generated' | 'file';

interface ExploreItemBase {
	title: string;
	description: string;
	href: string;
	icon: ExploreIconImageKey;
	openInNewTab?: boolean;
}

export interface ExploreInternalItem extends ExploreItemBase {
	layout: ExploreContentLayoutKey;
	routeKind?: ExploreRouteKind;
	external?: false;
}

export interface ExploreExternalItem extends ExploreItemBase {
	external: true;
	layout?: never;
	openInNewTab: true;
}

export type ExploreItem = ExploreInternalItem | ExploreExternalItem;

export interface ExplorePageConfig {
	title: string;
	description: string;
	items: ExploreItem[];
}

export const explorePageConfig: ExplorePageConfig = {
	title: '探索',
	description: '一些独立的小页面、记录和生活入口。',
	items: [
		{
			title: '阅读列表',
			description: '收藏的一些有趣的文章',
			href: '/reading-list/',
			icon: 'bookmark',
			layout: 'default',
		},
		{
			title: '碎碎念',
			description: '记录自己的奇思妙想',
			href: 'https://memos.mahoo12138.cn/',
			icon: 'memos',
			external: true,
			openInNewTab: true,
		},
		{
			title: '恋爱纪念日',
			description: '记录自己的恋爱纪念日',
			href: '/love/',
			icon: 'love',
			layout: 'blank',
			routeKind: 'file',
		},
		{
			title: '我的好物',
			description: '我购置的一些觉得好用的东西',
			href: '/my-goods/',
			icon: 'goods',
			layout: 'default',
			routeKind: 'file',
		},
		{
			title: '我的穿搭',
			description: '我的日常穿搭分享',
			href: '/my-outfits/',
			icon: 'clothes',
			layout: 'default',
		},
		{
			title: '我的相册',
			description: '我的日常生活记录',
			href: '/gallery/',
			icon: 'photo',
			layout: 'wide',
		},
	],
};

function normalizeExploreHref(href: string) {
	return href.replace(/^\/|\/$/g, '');
}

export function getExploreRouteParam(item: ExploreInternalItem) {
	return normalizeExploreHref(item.href);
}

export function getExploreInternalItems() {
	return explorePageConfig.items.filter((item): item is ExploreInternalItem => !item.external && Boolean(item.layout));
}

export function getGeneratedExploreInternalItems() {
	return getExploreInternalItems().filter((item) => item.routeKind !== 'file');
}

export function getExploreInternalItemByHref(href: string) {
	const routeParam = normalizeExploreHref(href);
	return getExploreInternalItems().find((item) => getExploreRouteParam(item) === routeParam);
}


