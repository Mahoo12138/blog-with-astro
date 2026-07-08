/**
 * 节假日主题映射表 — chinese-days 节日名 → 视觉主题
 *
 * 关键约定：
 * 1. key 必须与 chinese-days `getDayDetail(date).name` 完全一致
 *    （实测包含 "元旦"、"春节"、"清明"、"劳动节"、"端午"、"中秋"、"国庆节"）
 * 2. chinese-days 节假日数据只覆盖 2004-2026 年，超出范围时本表覆盖
 * 3. 未匹配节日使用 defaultTheme，并在 dev 模式打印 warn
 * 4. theme 决定：颜色 + 装饰元素 + 排版 + 字体 + 大数字颜色
 */

import type { CSSProperties } from 'react';

/* ─────────── 类型 ─────────── */
export interface Palette {
	primary: string; // 主题强调色（图标/边框/主标题）
	primaryDark: string; // 渐变起色（深）
	accent: string; // 主题辅色（渐变末色）
	bg: string; // 卡片背景
	bgWarm: string; // track 背景
	ink: string; // 主文字色
	inkSoft: string; // 副文字色
	inkMeta: string; // 元信息
	divider: string; // 顶部细分隔线
	border: string; // 边框色
}

export type DecorType =
	| 'seal' // 朱红印章
	| 'moon' // 满月
	| 'star' // 星星
	| 'flower' // 花朵
	| 'leaf' // 粽子/叶子
	| 'willow' // 柳叶
	| 'firework' // 烟花
	| 'dot'; // 默认点

export interface Decor {
	type: DecorType;
	glyph: string; // 显示的字符/图标
	rotate?: number; // 印章旋转角度
}

export type NumberLayout = 'stacked' | 'inline';
export type FontFamily = 'serif' | 'sans';
export type BigNumberColor = 'primary' | 'ink' | 'gradient';

export interface Typography {
	layout: NumberLayout;
	unit?: string; // stacked 模式单位文字（如 "DAYS · TO GO"）
	template?: string; // inline 模式模板（{name} 节日名, {n} 天数）
	font: FontFamily;
}

export interface MilestoneOverride {
	label: string;
	total: number;
	remaining: number;
	unit: string;
}

export interface HolidayTheme {
	palette: Palette;
	decor: Decor;
	typography: Typography;
	bigNumberColor: BigNumberColor;
	/** 可选：自定义 milestones 覆盖默认 4 项 */
	milestones?: MilestoneOverride[];
}

/* ─────────── 7 个法定节日主题（key 与 chinese-days 完全一致） ─────────── */
export const holidayThemes: Record<string, HolidayTheme> = {
	/** 元旦 — 新年，蓝黑冷调 */
	元旦: {
		palette: {
			primary: '#1a3a5a',
			primaryDark: '#0d2238',
			accent: '#74b9ff',
			bg: '#f0f4ff',
			bgWarm: '#e1ebf8',
			ink: '#0a1929',
			inkSoft: 'rgba(10, 25, 41, 0.62)',
			inkMeta: 'rgba(10, 25, 41, 0.42)',
			divider: 'linear-gradient(to right, #1a3a5a 0%, #1a3a5a 30%, transparent 100%)',
			border: 'rgba(26, 58, 90, 0.18)',
		},
		decor: { type: 'firework', glyph: '✦' },
		typography: { layout: 'inline', template: '{name} {n} 天', font: 'sans' },
		bigNumberColor: 'gradient',
	},

	/** 春节 — 春节红 + 纸张米黄 + 金（默认 / 票根风） */
	春节: {
		palette: {
			primary: '#c8403a',
			primaryDark: '#9a2e2a',
			accent: '#c8932f',
			bg: '#faf6ed',
			bgWarm: '#f5ecd9',
			ink: '#2a2420',
			inkSoft: 'rgba(42, 36, 32, 0.62)',
			inkMeta: 'rgba(42, 36, 32, 0.42)',
			divider: 'linear-gradient(to right, #c8403a 0%, #c8403a 30%, transparent 100%)',
			border: 'rgba(200, 64, 58, 0.18)',
		},
		decor: { type: 'seal', glyph: '福', rotate: -12 },
		typography: { layout: 'stacked', unit: 'DAYS · TO GO', font: 'serif' },
		bigNumberColor: 'primary',
		milestones: [
			{ label: '今日', total: 24, remaining: 12, unit: '小时' },
			{ label: '本周', total: 7, remaining: 4, unit: '天' },
			{ label: '本月', total: 31, remaining: 21, unit: '天' },
			{ label: '本年', total: 365, remaining: 180, unit: '天' },
		],
	},

	/** 清明 — 浅绿 + 墨色 */
	清明: {
		palette: {
			primary: '#3d6b4a',
			primaryDark: '#234a30',
			accent: '#94b08a',
			bg: '#f5f9f3',
			bgWarm: '#e8efe4',
			ink: '#1f2e22',
			inkSoft: 'rgba(31, 46, 34, 0.62)',
			inkMeta: 'rgba(31, 46, 34, 0.42)',
			divider: 'linear-gradient(to right, #3d6b4a 0%, #3d6b4a 30%, transparent 100%)',
			border: 'rgba(61, 107, 74, 0.18)',
		},
		decor: { type: 'willow', glyph: '柳' },
		typography: { layout: 'stacked', unit: 'DAYS', font: 'serif' },
		bigNumberColor: 'ink',
	},

	/** 劳动节 — 蓝金现代风 */
	劳动节: {
		palette: {
			primary: '#0984e3',
			primaryDark: '#065aa3',
			accent: '#fdcb6e',
			bg: '#f0f8ff',
			bgWarm: '#e1edf9',
			ink: '#0d2849',
			inkSoft: 'rgba(13, 40, 73, 0.62)',
			inkMeta: 'rgba(13, 40, 73, 0.42)',
			divider: 'linear-gradient(to right, #0984e3 0%, #0984e3 30%, transparent 100%)',
			border: 'rgba(9, 132, 227, 0.18)',
		},
		decor: { type: 'flower', glyph: '✿' },
		typography: { layout: 'inline', template: '{name} {n} 天', font: 'sans' },
		bigNumberColor: 'gradient',
	},

	/** 端午 — 粽叶绿 + 暖金 */
	端午: {
		palette: {
			primary: '#2d8a4e',
			primaryDark: '#1d5e35',
			accent: '#d4a44a',
			bg: '#f4f9f0',
			bgWarm: '#e6efd9',
			ink: '#1b3a1b',
			inkSoft: 'rgba(27, 58, 27, 0.62)',
			inkMeta: 'rgba(27, 58, 27, 0.42)',
			divider: 'linear-gradient(to right, #2d8a4e 0%, #2d8a4e 30%, transparent 100%)',
			border: 'rgba(45, 138, 78, 0.18)',
		},
		decor: { type: 'leaf', glyph: '粽' },
		typography: { layout: 'stacked', unit: 'DAYS LEFT', font: 'serif' },
		bigNumberColor: 'primary',
	},

	/** 中秋 — 暖金 + 夜蓝（深色背景） */
	中秋: {
		palette: {
			primary: '#d99a3a',
			primaryDark: '#a06a18',
			accent: '#3a5a8a',
			bg: '#1a1f2e',
			bgWarm: '#2a3142',
			ink: '#f5ecd9',
			inkSoft: 'rgba(245, 236, 217, 0.72)',
			inkMeta: 'rgba(245, 236, 217, 0.48)',
			divider: 'linear-gradient(to right, #d99a3a 0%, #d99a3a 30%, transparent 100%)',
			border: 'rgba(217, 154, 58, 0.32)',
		},
		decor: { type: 'moon', glyph: '🌕' },
		typography: { layout: 'inline', template: '{name} {n} 天', font: 'serif' },
		bigNumberColor: 'primary',
	},

	/** 国庆节 — 中国红 + 金（注意是"国庆节"不是"国庆"） */
	国庆节: {
		palette: {
			primary: '#d63031',
			primaryDark: '#9a1a1a',
			accent: '#fdcb6e',
			bg: '#fff5f5',
			bgWarm: '#fce4e4',
			ink: '#2d1b1b',
			inkSoft: 'rgba(45, 27, 27, 0.62)',
			inkMeta: 'rgba(45, 27, 27, 0.42)',
			divider: 'linear-gradient(to right, #d63031 0%, #d63031 30%, transparent 100%)',
			border: 'rgba(214, 48, 49, 0.18)',
		},
		decor: { type: 'star', glyph: '★' },
		typography: { layout: 'stacked', unit: 'DAYS', font: 'sans' },
		bigNumberColor: 'gradient',
	},
};

/* ─────────── 默认主题（兜底） ─────────── */
export const defaultTheme: HolidayTheme = {
	palette: {
		primary: '#636e72',
		primaryDark: '#2d3436',
		accent: '#b2bec3',
		bg: '#f5f5f5',
		bgWarm: '#e8e8e8',
		ink: '#2d3436',
		inkSoft: 'rgba(45, 52, 54, 0.62)',
		inkMeta: 'rgba(45, 52, 54, 0.42)',
		divider: 'linear-gradient(to right, #636e72 0%, #636e72 30%, transparent 100%)',
		border: 'rgba(99, 110, 114, 0.18)',
	},
	decor: { type: 'dot', glyph: '•' },
	typography: { layout: 'stacked', unit: 'DAYS', font: 'sans' },
	bigNumberColor: 'ink',
};

/* ─────────── 字体族映射 ─────────── */
export const FONT_MAP: Record<FontFamily, string> = {
	serif: '"Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", serif',
	sans: '"Noto Sans SC", "Source Han Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
};

/* ─────────── 工具函数 ─────────── */
export function getTheme(name: string): HolidayTheme {
	const theme = holidayThemes[name];
	if (!theme) {
		if (typeof window !== 'undefined' && import.meta.env?.DEV) {
			console.warn(`[CountdownCard] holidayTheme missing: ${name}, using default`);
		}
		return defaultTheme;
	}
	return theme;
}

/** theme → React CSS variable 注入对象 */
export function themeToCssVars(theme: HolidayTheme): CSSProperties {
	return {
		'--theme-primary': theme.palette.primary,
		'--theme-primary-dark': theme.palette.primaryDark,
		'--theme-accent': theme.palette.accent,
		'--theme-bg': theme.palette.bg,
		'--theme-bg-warm': theme.palette.bgWarm,
		'--theme-ink': theme.palette.ink,
		'--theme-ink-soft': theme.palette.inkSoft,
		'--theme-ink-meta': theme.palette.inkMeta,
		'--theme-divider': theme.palette.divider,
		'--theme-border': theme.palette.border,
		'--theme-font': FONT_MAP[theme.typography.font],
		'--theme-decor-glyph': `"${theme.decor.glyph}"`,
		'--theme-decor-rotate': `${theme.decor.rotate ?? 0}deg`,
	} as CSSProperties;
}
