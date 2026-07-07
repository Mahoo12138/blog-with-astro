/**
 * 第二屏可配置卡片式导航 grid 系统 — 配置类型定义
 *
 * 设计原则：
 * 1. 卡片类型与尺寸解耦：每个 item 仅引用 type（决定 UI/行为）和 span（决定行列）
 * 2. 尺寸用「列数 × 行数」表示，方便不同卡片自由混排
 * 3. props 留作各类型自定义数据，类型层面不强制字段（运行时由各卡片组件校验）
 * 4. responsive 可在每个 item 上单独覆写断点行为，无需另起配置
 * 5. version 字段用于未来配置升级时做迁移
 *
 * JSON 示例（见 src/config/welcomeGrid.ts）：
 *   {
 *     "version": 1,
 *     "grid": { "columns": 6, "rowHeight": "1fr", "gap": "0.75rem" },
 *     "items": [
 *       { "id": "yuque", "type": "navigation", "span": { "col": 1, "row": 2 }, "props": { ... } }
 *     ]
 *   }
 */

import type { SidebarWidgetConfig } from './stellar';

/** 卡片类型注册表 key — 新增类型时只需在此处追加并实现对应组件 */
export type WelcomeCardType =
	| 'navigation' // 导航链接卡片
	| 'contact' // 联系方式卡片
	| 'poetry' // 古诗词卡片
	| 'countdown' // 倒计时/进度卡片
	| 'sidebar'; // 共享侧边栏 widget 的卡片

/** 行 × 列 尺寸定义，col/row 为正整数 */
export interface CardSpan {
	col: number;
	row: number;
}

/** 响应式覆写：未声明则继承桌面配置
 * - 卡片系统仅考虑两个断点：
 *   1. 宽屏（默认）：8 列布局
 *   2. 窄屏（<= 768px）：4 列布局（转置）
 */
export interface ResponsiveSpan {
	/** 窄屏 span（<= 768px），转置后的列/行 */
	narrow?: Partial<CardSpan>;
}

/** 通用样式覆写：每个卡片可在 props.style 上做局部样式覆盖 */
export interface CardStyle {
	accentColor?: string; // 主色（图标/边框）
	background?: string; // 背景色
	textColor?: string; // 文字色
}

interface BaseCardItem {
	id: string;
	type: WelcomeCardType;
	span: CardSpan;
	/** 窄屏 (<= 768px) span：转置后的列/行。省略时按桌面 span 转置（col/row 互换） */
	narrow?: Partial<CardSpan>;
	responsive?: ResponsiveSpan;
	hidden?: boolean; // 暂时从布局中移除（不删除配置）
	title?: string; // 可选 hover 标题
	style?: CardStyle;
}

// ─────────── 导航链接卡片 ───────────
export interface NavigationCardProps {
	href: string;
	name: string;
	desc?: string;
	icon?: string; // SVG path d
	iconColor?: string;
	openInNewTab?: boolean;
}

// ─────────── 联系方式卡片 ───────────
export interface ContactCardProps {
	platform: string; // 平台名（微信/邮箱/...）
	value: string; // 联系方式值
	icon?: string; // SVG path d
	iconColor?: string;
	href?: string; // 可选跳转链接（如 mailto:）
	action?: 'copy' | 'link' | 'qrcode'; // 交互方式
}

// ─────────── 古诗词卡片 ───────────
export interface PoetryCardProps {
	content: string; // 诗词正文
	dynasty: string; // 朝代
	author: string; // 作者
	quote: string; // 出处
	background?: 'starry' | 'plain' | 'paper'; // 背景主题
}

// ─────────── 倒计时卡片 ───────────
export interface CountdownCardProps {
	title: string; // "距离春节"
	date: string; // ISO 日期 "2027-01-29"
	dateLabel?: string; // "2027-01-06"
	milestones: Array<{
		// 剩余进度：进度条按 (total - remaining) / total 显示已过比例
		label: string;
		total: number; // 总量（24 / 7 / 30 / 365 ...）
		remaining: number; // 剩余量
		unit: string; // 单位（小时 / 天）
	}>;
}

// ─────────── 共享侧边栏 widget 卡片 ───────────
export interface SidebarCardProps {
	widget: SidebarWidgetConfig; // 复用 stellarConfig.widgets 中已定义的 widget
}

// ─────────── props 联合类型 ───────────
export type CardPropsByType = {
	navigation: NavigationCardProps;
	contact: ContactCardProps;
	poetry: PoetryCardProps;
	countdown: CountdownCardProps;
	sidebar: SidebarCardProps;
};

export type AnyCardItem = {
	[K in WelcomeCardType]: BaseCardItem & { type: K; props: CardPropsByType[K] };
}[WelcomeCardType];

/** 顶层 grid 容器参数 */
export interface WelcomeGridConfig {
	version: 1;
	grid: {
		columns: number; // 桌面列数（默认 6）
		rowHeight?: string; // CSS grid row height（默认 1fr）
		gap?: string; // 卡片间距（默认 vars.space.md）
		minRowHeight?: string; // auto-rows 高度（默认 7rem）
	};
	items: AnyCardItem[];
}
