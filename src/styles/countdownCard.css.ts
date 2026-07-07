import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from './theme.css';

export const card = style({
	position: 'relative',
	width: '100%',
	height: '100%',
	padding: vars.space.xl,
	borderRadius: vars.radius.lg,
	background: vars.color.surfaceStrong,
	border: `1px solid ${vars.color.border}`,
	boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
	display: 'grid',
	gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.4fr)',
	gap: vars.space.xl,
	color: vars.color.textStrong,
	overflow: 'hidden',
});

export const leftCol = style({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'flex-start',
	gap: '0.35rem',
	minWidth: 0,
});

export const title = style({
	fontSize: 'clamp(0.85rem, 1vw, 1rem)',
	color: vars.color.textMuted,
	margin: 0,
	whiteSpace: 'nowrap', // 强制单行，避免"距离春节"换行成"距离"+"春节"
	lineHeight: 1.2,
});

export const dayNumber = style({
	fontSize: 'clamp(2.6rem, 4vw, 3.4rem)',
	fontWeight: 800,
	lineHeight: 1, // 紧凑行高，让大数字与周围元素垂直对齐
	color: '#d77a30',
	letterSpacing: '-0.04em',
	fontVariantNumeric: 'tabular-nums',
	margin: 0,
});

export const dateLabel = style({
	fontSize: '0.78rem',
	color: vars.color.textMuted,
	fontVariantNumeric: 'tabular-nums',
	margin: 0,
	lineHeight: 1.2,
});

export const list = style({
	display: 'flex',
	flexDirection: 'column',
	gap: '0.5rem',
	justifyContent: 'center',
});

/** 单行：左侧 label + 右侧 track（长条进度条） */
export const row = style({
	display: 'grid',
	gridTemplateColumns: '3rem 1fr',
	alignItems: 'stretch',
	gap: vars.space.sm,
	fontSize: '0.85rem',
});

/** 左侧 label：垂直居中与 track 对齐，line-height 匹配 track 高度 */
export const label = style({
	color: vars.color.text,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-start',
	height: '1.6rem',
	lineHeight: 1.2,
});

/** 进度条容器：长条形，高度 1.6rem */
export const track = style({
	position: 'relative',
	height: '1.6rem',
	borderRadius: vars.radius.pill,
	background: vars.color.surfaceMuted,
	overflow: 'hidden',
});

/** 已过比例填充 */
export const fill = style({
	position: 'absolute',
	left: 0,
	top: 0,
	bottom: 0,
	background: 'linear-gradient(90deg, #d8a14a 0%, #d77a30 100%)',
	borderRadius: 'inherit',
});

/** 文字容器：覆盖在 track 上，水平居中
 *  - 默认显示百分比，hover 时切换为"还剩 X"
 *  - 两个文字使用相同颜色（深棕色），仅内容切换，不变色
 */
export const textLayer = style({
	position: 'absolute',
	inset: 0,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	fontVariantNumeric: 'tabular-nums',
	fontWeight: 600,
	fontSize: '0.78rem',
	color: '#6b3a0f',
	pointerEvents: 'none',
});

/** 默认显示：已过百分比 */
export const percent = style({
	transition: 'opacity 0.2s ease',
});

/** hover 时显示：剩余量文字（颜色与默认相同） */
export const remaining = style({
	position: 'absolute',
	inset: 0,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	opacity: 0,
	transition: 'opacity 0.2s ease',
	pointerEvents: 'none',
	whiteSpace: 'nowrap',
	padding: '0 0.5rem',
	boxSizing: 'border-box',
});

// 卡片整体 hover 时，所有行的文字一起切换（仅内容，颜色不变）
globalStyle(`${card}:hover .${percent}`, { opacity: 0 });
globalStyle(`${card}:hover .${remaining}`, { opacity: 1 });
