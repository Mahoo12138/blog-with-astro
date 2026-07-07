import { style, keyframes, globalStyle } from '@vanilla-extract/css';
import { vars } from './theme.css';

const waveHand = keyframes({
	'0%, 60%, 100%': { transform: 'rotate(0deg)' },
	'10%, 30%': { transform: 'rotate(14deg)' },
	'20%': { transform: 'rotate(-8deg)' },
	'40%': { transform: 'rotate(-4deg)' },
	'50%': { transform: 'rotate(10deg)' },
});

export const section = style({
	position: 'absolute',
	inset: 0,
	width: '100%',
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: `${vars.space.xxl} ${vars.space.xl}`,
	zIndex: 2,
	// 关键：禁用内部滚动条，溢出内容由外层（PinnedScroll + body）处理
	// 否则窄屏下 4×8 grid 高度超过 100vh 时会出现双重滚动条
	overflow: 'hidden',
});

/**
 * 整体容器（grid 布局）：
 *  - 宽屏：intro 1fr（左自适应） + grid 800px（右固定）
 *  - 中等屏：intro 隐藏，container 单列 + grid 800px 居中
 *  - 窄屏：container 单列 + grid 400px 居中
 */
export const container = style({
	width: '100%',
	maxWidth: vars.layout.shell,
	display: 'grid',
	gridTemplateColumns: 'minmax(0, 1fr) 800px',
	gap: vars.space.xl,
	alignItems: 'center',
	'@media': {
		'screen and (max-width: 1180px)': {
			gridTemplateColumns: 'minmax(0, 1fr)',
			justifyItems: 'center',
		},
	},
});

/** 左侧 intro — 宽屏显示，中等屏以下隐藏 */
export const intro = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	gap: vars.space.sm,
	justifySelf: 'start',
	'@media': {
		'screen and (max-width: 1180px)': {
			display: 'none',
		},
	},
});

/** 卡片 grid 容器宿主
 *  - 宽屏：固定 800px，与 8 列网格对应
 *  - 窄屏：400px，与 4 列网格对应（卡片列宽始终 100px）
 *  - 窄屏高度自适应视口，避免内部滚动条
 */
export const welcomeGridHost = style({
	width: '100%',
	maxWidth: '800px',
	minWidth: 0,
	justifySelf: 'end',
	'@media': {
		'screen and (max-width: 1180px)': {
			justifySelf: 'center',
		},
		'screen and (max-width: 768px)': {
			maxWidth: '400px',
			maxHeight: 'calc(100vh - 4rem)',
		},
	},
});

export const greeting = style({
	fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
	fontWeight: 800,
	margin: 0,
	lineHeight: 1.15,
	color: vars.color.textStrong,
	letterSpacing: '-0.02em',
	display: 'flex',
	alignItems: 'center',
	gap: vars.space.sm,
});

export const headline = style({
	fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
	fontWeight: 800,
	margin: 0,
	lineHeight: 1.15,
	letterSpacing: '-0.03em',
	color: vars.color.accentStrong,
});

export const subline = style({
	fontSize: '0.95rem',
	color: vars.color.textMuted,
	margin: 0,
});

export const pills = style({
	display: 'flex',
	flexWrap: 'wrap',
	gap: vars.space.xs,
	marginTop: vars.space.xs,
});

export const pill = style({
	padding: '0.25rem 0.7rem',
	borderRadius: vars.radius.pill,
	background: vars.color.surfaceMuted,
	color: vars.color.text,
	fontSize: '0.78rem',
	fontWeight: 600,
	border: `1px solid ${vars.color.border}`,
});

export const wave = style({
	display: 'inline-block',
	transformOrigin: '70% 70%',
	animation: `${waveHand} 2.4s ease-in-out infinite`,
});

globalStyle(`[data-welcome-cards] a:hover`, {
	color: 'inherit',
});
