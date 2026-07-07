/**
 * 第二屏卡片式导航 grid — 默认配置
 *
 * 布局：8 列 × 4 行（宽屏）/ 4 列 × 8 行（窄屏）
 *
 *   宽屏 (default)
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │   poetry (4×2)              │   countdown (4×2)            │
 *   │   nav 2×1 │ nav 2×1 │ nav 2×1 │ nav 2×1                     │
 *   │   邮箱 2×1 │ 微信 2×1 │ GitHub 2×1 │ RSS 2×1                │
 *   └─────────────────────────────────────────────────────────────┘
 *
 *   窄屏 (<= 768px)：4 列 × 8 行
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │   poetry (2×4)              │   countdown (2×4)            │
 *   │   nav 1×2 │ nav 1×2 │ nav 1×2 │ nav 1×2                     │
 *   │   邮箱 1×2 │ 微信 1×2 │ GitHub 1×2 │ RSS 1×2                │
 *   └─────────────────────────────────────────────────────────────┘
 *
 * 转换规则：宽屏 span 转置后即窄屏 span（col/row 互换）
 * 卡片宽度在所有屏幕下保持不变（通过固定列数实现）。
 *
 * 调整建议：直接修改 items 数组的 span / responsive.narrow 即可
 */

import type { WelcomeGridConfig } from './welcomeGrid';

export const welcomeGridConfig: WelcomeGridConfig = {
	version: 1,
	grid: {
		columns: 8,
		rowHeight: '1fr',
		gap: '0.75rem',
		minRowHeight: '6.5rem',
	},
	items: [
		// ─── 行 1-2：大卡区（诗词 + 倒计时）───
		{
			id: 'poetry-daily',
			type: 'poetry',
			span: { col: 4, row: 2 },
			narrow: { col: 2, row: 4 },
			props: {
				content: '小荷障面避斜晖，分得翠阴归',
				dynasty: '宋代',
				author: '张先',
				quote: '《画堂春·外湖莲子长参差》',
				background: 'starry',
			},
		},
		{
			id: 'countdown-spring-festival',
			type: 'countdown',
			span: { col: 4, row: 2 },
			narrow: { col: 2, row: 4 },
			props: {
				title: '距离春节',
				date: '2027-01-29',
				dateLabel: '2027-01-06',
				milestones: [
					{ label: '今日', total: 24, remaining: 2, unit: '小时' },
					{ label: '本周', total: 7, remaining: 5, unit: '天' },
					{ label: '本月', total: 31, remaining: 25, unit: '天' },
					{ label: '本年', total: 365, remaining: 178, unit: '天' },
				],
			},
		},

		// ─── 行 3：导航链接卡片（宽屏 2×1，窄屏 1×2）───
		{
			id: 'nav-yuque',
			type: 'navigation',
			span: { col: 2, row: 1 },
			narrow: { col: 1, row: 2 },
			props: {
				href: 'https://www.yuque.com/',
				name: '语雀',
				desc: '知识库',
				icon: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
				iconColor: '#2196f3',
				openInNewTab: true,
			},
		},
		{
			id: 'nav-github',
			type: 'navigation',
			span: { col: 2, row: 1 },
			narrow: { col: 1, row: 2 },
			props: {
				href: 'https://github.com/',
				name: 'GitHub',
				desc: '代码仓库',
				icon: 'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.04 1.53 1.04.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2z',
				iconColor: '#181717',
				openInNewTab: true,
			},
		},
		{
			id: 'nav-notion',
			type: 'navigation',
			span: { col: 2, row: 1 },
			narrow: { col: 1, row: 2 },
			props: {
				href: 'https://www.notion.so/',
				name: 'Notion',
				desc: '工作空间',
				icon: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm2 4v8h2V8H6zm4 0v8h2v-4l2 4h2l-2-4 2-4h-2l-2 3V8H10z',
				iconColor: '#000000',
				openInNewTab: true,
			},
		},
		{
			id: 'nav-rss',
			type: 'navigation',
			span: { col: 2, row: 1 },
			narrow: { col: 1, row: 2 },
			props: {
				href: '/rss.xml',
				name: 'RSS',
				desc: '订阅',
				icon: 'M5 3v3a15 15 0 0 1 15 15h3A18 18 0 0 0 5 3zm0 7v3a8 8 0 0 1 8 8h3A11 11 0 0 0 5 10zm2 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
				iconColor: '#f26522',
			},
		},

		// ─── 行 4：联系方式卡片（宽屏 2×1，窄屏 1×2）───
		{
			id: 'contact-email',
			type: 'contact',
			span: { col: 2, row: 1 },
			narrow: { col: 1, row: 2 },
			props: {
				platform: '邮箱',
				value: 'hi@example.com',
				href: 'mailto:hi@example.com',
				icon: 'M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 2v.5l8 5 8-5V8H4zm0 2.7V17h16v-6.3l-8 5-8-5z',
				iconColor: '#3367d6',
				action: 'copy',
			},
		},
		{
			id: 'contact-wechat',
			type: 'contact',
			span: { col: 2, row: 1 },
			narrow: { col: 1, row: 2 },
			props: {
				platform: '微信',
				value: 'mahoo12138',
				icon: 'M9 4C5 4 2 6.7 2 10.2c0 2 1.1 3.7 2.8 4.9L4 17l2.3-1.2c.9.3 1.8.4 2.7.4h.6c-.2-.6-.3-1.2-.3-1.8 0-3.3 3-6 7-6h.4C16 5.7 12.8 4 9 4zm-3 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm6 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 4c-3.3 0-6 2.2-6 5 0 1.6.9 3 2.3 4l-.6 1.4 1.7-.8c.7.2 1.5.4 2.3.4 3.3 0 6-2.2 6-5s-2.4-5-5.7-5zm-2 3a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6zm4 0a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6z',
				iconColor: '#07c160',
				action: 'copy',
			},
		},
		{
			id: 'contact-github',
			type: 'contact',
			span: { col: 2, row: 1 },
			narrow: { col: 1, row: 2 },
			props: {
				platform: 'GitHub',
				value: '@mahoo12138',
				href: 'https://github.com/mahoo12138',
				icon: 'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.04 1.53 1.04.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2z',
				iconColor: '#181717',
				action: 'link',
			},
		},
		{
			id: 'contact-telegram',
			type: 'contact',
			span: { col: 2, row: 1 },
			narrow: { col: 1, row: 2 },
			props: {
				platform: 'Telegram',
				value: '@mahoo12138',
				href: 'https://t.me/mahoo12138',
				icon: 'M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z',
				iconColor: '#0088cc',
				action: 'link',
			},
		},
	],
};
