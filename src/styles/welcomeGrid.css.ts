import { style, globalStyle, keyframes } from '@vanilla-extract/css';
import { vars } from './theme.css';

/** 第二屏 grid 容器
 *  - 宽屏（默认）：8 列 × 4 行，卡片宽度由列数决定
 *  - 窄屏 (<= 768px)：4 列 × 8 行，卡片宽度保持不变（通过切换列数实现转置）
 *
 * 卡片宽度在所有屏幕下保持一致：
 *  - 宽屏 1 列 = 容器宽度 / 8
 *  - 窄屏 1 列 = 容器宽度 / 4
 *  - 因为窄屏容器压缩到 1/2，1 列宽度自然与宽屏相等
 */
export const gridRoot = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(8, minmax(0, 1fr))',
	gridAutoRows: 'minmax(7rem, auto)',
	gap: '0.75rem',
	width: '100%',
	'@media': {
		'screen and (max-width: 768px)': {
			gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
			// 窄屏 4×8 = 8 行，扣除 padding 后行高 = (100vh - 6rem) / 8
			gridAutoRows: 'minmax(calc((100vh - 8rem) / 8), auto)',
		},
	},
});

/** 卡片通用容器 — 仅负责布局占位，颜色由各卡片类型自带 */
export const card = style({
	position: 'relative',
	width: '100%',
	height: '100%',
	minHeight: 0,
	overflow: 'hidden',
	borderRadius: vars.radius.lg,
	background: vars.color.surfaceStrong,
	border: `1px solid ${vars.color.border}`,
	boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
	transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
});

/** 可点击卡片的悬浮态 */
export const cardInteractive = style({
	selectors: {
		'&:hover': {
			transform: 'translateY(-3px)',
			borderColor: vars.color.accent,
			boxShadow: `0 14px 32px rgba(33, 150, 243, 0.18), 0 0 0 4px ${vars.color.accentSoft}`,
		},
	},
});

/** 卡片内容布局：图标 + 文字 */
export const navIcon = style({
	flexShrink: 0,
	width: '40px',
	height: '40px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: vars.radius.md,
	background: vars.color.surfaceMuted,
	transition: 'background 220ms ease, transform 220ms ease',
});

export const navBody = style({
	display: 'flex',
	flexDirection: 'column',
	minWidth: 0,
	gap: '2px',
});

export const navName = style({
	fontSize: '0.95rem',
	fontWeight: 700,
	color: vars.color.textStrong,
	letterSpacing: '-0.01em',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

export const navDesc = style({
	fontSize: '0.74rem',
	color: vars.color.textMuted,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

/** 1×1 小方块 — 仅图标居中，可显示底部小字（可选） */
export const navCompact = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	gap: '0.25rem',
	padding: vars.space.sm,
	textDecoration: 'none',
	height: '100%',
	fontSize: '0.7rem',
	fontWeight: 600,
	color: vars.color.text,
});

/** 1×2 竖卡（默认）— 上下布局：图标在上，文字在下 */
export const navVertical = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	gap: vars.space.sm,
	padding: vars.space.lg,
	color: 'inherit',
	textDecoration: 'none',
	height: '100%',
});

/** 2×1+ 横卡（用于多列宽卡）— 左右布局：图标左，文字右 */
export const navHorizontal = style({
	display: 'flex',
	alignItems: 'center',
	gap: vars.space.md,
	padding: vars.space.lg,
	color: 'inherit',
	textDecoration: 'none',
	height: '100%',
});

/** 2×2+ 大卡 — 左上图标/标签 + 右下/下方内容 */
export const navLarge = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space.sm,
	padding: vars.space.xl,
	color: 'inherit',
	textDecoration: 'none',
	height: '100%',
});

/** 链接清色（避免 a 标签默认色覆盖） */
globalStyle(`${card} a`, { color: 'inherit', textDecoration: 'none' });
globalStyle(`${card} a:hover`, { color: 'inherit' });

/** 卡片入场动画：保持和原 WelcomeCards 一致的节奏 */
const cardPopIn = keyframes({
	'0%': { opacity: '0', transform: 'translateY(12px) scale(0.96)' },
	'100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
});

globalStyle(`[data-welcome-grid][data-visible="true"] > *`, {
	animation: `${cardPopIn} 500ms ease-out both`,
});

// 用 nth-child 给前 14 张卡片做错峰入场（防止动画堆叠过长）
for (let i = 1; i <= 14; i++) {
	globalStyle(`[data-welcome-grid][data-visible="true"] > *:nth-child(${i})`, {
		animationDelay: `${i * 60}ms`,
	});
}

/** 联系方式卡片的"复制成功"小提示 */
export const toastHint = style({
	position: 'absolute',
	left: '50%',
	bottom: '8px',
	transform: 'translateX(-50%) translateY(8px)',
	padding: '2px 10px',
	fontSize: '0.72rem',
	fontWeight: 600,
	color: '#fff',
	background: 'rgba(15, 23, 42, 0.78)',
	borderRadius: vars.radius.pill,
	opacity: 0,
	pointerEvents: 'none',
	transition: 'opacity 180ms ease, transform 180ms ease',
	selectors: {
		'&[data-toast="true"]': {
			opacity: 1,
			transform: 'translateX(-50%) translateY(0)',
		},
	},
});
