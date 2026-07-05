import { style, globalStyle } from '@vanilla-extract/css';

// 钉屏容器：高度 = 1 屏（粘性） + 额外滚动距离（驱动动画用）
// 当前：约 2.2 屏的滚动驱动距离 = 220vh
// 前半段做 hero→welcome 淡隐切换，后半段保持 welcome 稳定可见
export const pinContainer = style({
	position: 'relative',
	width: '100%',
	height: '220vh',
	zIndex: 1,
});

// 粘性舞台：滚动期间一直钉在视口顶部
export const stage = style({
	position: 'sticky',
	top: 0,
	left: 0,
	width: '100%',
	height: '100vh',
	overflow: 'hidden',
});

// 叠放层：hero 与 welcome 绝对定位重叠，由 JS 驱动透明度
export const layer = style({
	position: 'absolute',
	inset: 0,
	width: '100%',
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	willChange: 'opacity, transform',
});

// 子层里的 <section> 也要填满父级
globalStyle(`${layer} > section`, {
	width: '100%',
	height: '100%',
});

// 默认初始态：hero 可见，welcome 隐藏。
// 关键：必须用 CSS 默认值兜底，否则当 is:inline 脚本因 ClientRouter 同页跳转未执行时，
// 两个 layer 会同时保持 opacity:1 出现"两层叠"的 bug。
globalStyle(`[data-pinned-layer="hero"]`, {
	opacity: 1,
	transform: 'scale(1)',
	pointerEvents: 'auto',
});
globalStyle(`[data-pinned-layer="welcome"]`, {
	opacity: 0,
	transform: 'translateY(24px)',
	pointerEvents: 'none',
});

// 进度提示条（可选调试 / 视觉引导）
export const progressHint = style({
	position: 'fixed',
	right: '1.25rem',
	bottom: '1.25rem',
	zIndex: 50,
	display: 'flex',
	alignItems: 'center',
	gap: '0.5rem',
	padding: '0.5rem 0.75rem',
	borderRadius: '999px',
	background: 'rgba(15, 23, 42, 0.55)',
	color: '#fff',
	fontSize: '0.75rem',
	fontVariantNumeric: 'tabular-nums',
	backdropFilter: 'blur(8px)',
	WebkitBackdropFilter: 'blur(8px)',
	pointerEvents: 'none',
	opacity: 0,
	transition: 'opacity 220ms ease',
	selectors: {
		'&[data-active="true"]': {
			opacity: 1,
		},
	},
});
