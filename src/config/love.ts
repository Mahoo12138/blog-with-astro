/**
 * Love 页的页面级元数据。
 *
 * 这些字段此前硬编码在 `src/pages/love.astro:65-93`，与页面里 900 多行
 * 样式混在一起，改一个纪念日标签要在近千行里翻找。这里抽出来，
 * 让「内容」与「展示」分开：
 *   - 列表型内容（时间线、照片、愿望…）早已是 collection，见下方 collectionNames
 *   - 单例型内容（我们是谁、纪念日、情书、那首歌）留在本文件
 *
 * 头像用 ImageMetadata 而非字符串路径：让 Astro 图片管线负责压缩，
 * 避免 249KB 的源图直出（见 optimization-plan P1-4 / P2-8）。
 */
import type { ImageMetadata } from 'astro';
import leftPartnerAvatar from '../assets/love/partners/inin-kon.jpg';
import rightPartnerAvatar from '../assets/love/partners/inin.png';

export interface LovePartner {
	initial: string;
	name: string;
	avatar: ImageMetadata;
}

export interface LoveMeta {
	startDate: string;
	anniversaryDate: string;
	anniversaryLabel: string;
	partners: {
		left: LovePartner;
		right: LovePartner;
	};
	song: {
		title: string;
		artist: string;
		note: string;
		initialTime: string;
		totalTime: string;
		initialPercent: number;
	};
	letter: {
		date: string;
		greeting: string;
		paragraphs: string[];
		signature: string;
	};
}

export const loveMeta: LoveMeta = {
	startDate: '2025-12-06',
	anniversaryDate: '2026-12-06',
	anniversaryLabel: '一周年 · 2026.12.06',
	partners: {
		left: { initial: '他', name: '隐隐控', avatar: leftPartnerAvatar },
		right: { initial: '她', name: '隐隐', avatar: rightPartnerAvatar },
	},
	song: {
		title: '光年之外',
		artist: 'G.E.M. 邓紫棋',
		note: '"第一次牵手的那天，这首歌刚好在播。"',
		initialTime: '1:23',
		totalTime: '3:43',
		initialPercent: 37,
	},
	letter: {
		date: '2026 · 05 · 20',
		greeting: '亲爱的你，',
		paragraphs: [
			'想对你说的话有很多，却总是不知道从哪里开始。',
			'喜欢你不是因为某一件事，而是你所有细小的样子加在一起，刚好成了我最想靠近的人。',
			'喜欢你认真讲话时的样子，喜欢你笑起来的样子，喜欢你说"我知道了"却还是会忘记的样子。',
			'谢谢你愿意留在我身边，谢谢你让我相信，平凡的日子也可以这么闪光。',
			'希望我们可以一直这样下去，把所有的四季都过一遍，再过一遍。',
		],
		signature: '— 永远爱你的我 ♡',
	},
};

/** love 页用到的 collection 名。集中在这里，方便与 content.config.ts 对照增删。 */
export const loveCollections = [
	'loveTimeline',
	'lovePhotos',
	'loveFirsts',
	'loveStats',
	'loveTraits',
	'loveDestinations',
	'loveWishes',
	'lovePromises',
	'loveCalendar',
	'loveNotes',
] as const;
