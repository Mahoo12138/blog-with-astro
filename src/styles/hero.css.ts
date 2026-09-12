import { style, keyframes } from '@vanilla-extract/css';
import { breakpoints, vars } from './theme.css';

/* ── 深空配色（Hero 恒为深空场景，与站点明暗主题解耦）── */
const spaceInk = 'rgba(236, 246, 255, 0.96)';
const spaceInkMuted = 'rgba(168, 199, 231, 0.75)';
const spaceAccent = '#7fe3ff';

/* 星球抵达：由远及近，模糊到清晰 */
const planetArrival = keyframes({
	'0%': { opacity: '0', visibility: 'visible', transform: 'scale(0.36)', filter: 'blur(14px)' },
	'55%': { opacity: '1', filter: 'blur(0)' },
	'100%': { opacity: '1', visibility: 'visible', transform: 'scale(1)', filter: 'blur(0)' },
});

/* 星环展开：光环自星球两侧晕开 */
const ringBloom = keyframes({
	'0%': { opacity: '0', visibility: 'visible', transform: 'translate(-50%, -50%) rotate(-18deg) scale(1.7)' },
	'100%': { opacity: '1', visibility: 'visible', transform: 'translate(-50%, -50%) rotate(-18deg) scale(1)' },
});

/* 文字错峰升入 */
const riseIn = keyframes({
	'0%': { opacity: '0', visibility: 'visible', transform: 'translateY(26px)', filter: 'blur(6px)' },
	'100%': { opacity: '1', visibility: 'visible', transform: 'translateY(0)', filter: 'blur(0)' },
});

const float = keyframes({
	'0%, 100%': { transform: 'translateY(0)' },
	'50%': { transform: 'translateY(-10px)' },
});

const bounce = keyframes({
	'0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
	'50%': { transform: 'translateX(-50%) translateY(8px)' },
});

const reduceMotion = '(prefers-reduced-motion: reduce)';

export const hero = style({
	// 在 PinnedScrollSection 中以 absolute 填满父级（100vh 舞台）
	position: 'absolute',
	inset: 0,
	width: '100%',
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	overflow: 'hidden',
	zIndex: 1,
	// 深空底色：canvas 首帧之前 / 回退场景的兜底
	background: '#03060d',
	opacity: 1,
	visibility: 'visible',
	pointerEvents: 'auto',
	willChange: 'opacity, transform',
});

export const heroCanvas = style({
	position: 'absolute',
	inset: 0,
	width: '100%',
	height: '100%',
	zIndex: 0,
	pointerEvents: 'none',
});

export const starfieldCanvas = style({
	width: '100%',
	height: '100%',
	display: 'block',
});

export const heroContent = style({
	position: 'relative',
	zIndex: 2,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: vars.space.xl,
	padding: `${vars.space.xxxl} ${vars.space.xl}`,
	textAlign: 'center',
});

/* ── 头像星球：大气光晕（::before）+ 倾斜星环（::after）── */

export const planet = style({
	position: 'relative',
	display: 'inline-block',
	width: '132px',
	height: '132px',
	willChange: 'opacity, transform, filter',
	selectors: {
		// 待航：星球尚未进入视野（曲速漂移中）
		'[data-hero-state="travel"] &': {
			opacity: 0,
			visibility: 'hidden',
			transform: 'scale(0.36)',
			filter: 'blur(14px)',
		},
		// 抵达：星球由远及近浮现（回访 instant 路径不加动画，直接在位）
		'[data-hero-state="arrived"]:not([data-hero-arrival="instant"]) &': {
			animation: `${planetArrival} 1.5s cubic-bezier(0.17, 0.84, 0.26, 1) both`,
		},
		'[data-hero-state="arrived"]:not([data-hero-arrival="instant"]) &::after': {
			animation: `${ringBloom} 1.6s cubic-bezier(0.22, 0.8, 0.3, 1) 0.35s both`,
		},
		'&::before': {
			content: '""',
			position: 'absolute',
			inset: '-30%',
			zIndex: -2,
			borderRadius: '50%',
			pointerEvents: 'none',
			background:
				'radial-gradient(circle, rgba(127, 227, 255, 0.26) 0%, rgba(33, 150, 243, 0.10) 46%, transparent 70%)',
		},
		'&::after': {
			content: '""',
			position: 'absolute',
			left: '50%',
			top: '50%',
			width: '178%',
			height: '46%',
			zIndex: -1,
			border: `1.5px solid rgba(127, 227, 255, 0.36)`,
			borderRadius: '50%',
			transform: 'translate(-50%, -50%) rotate(-18deg)',
			boxShadow:
				'0 0 18px rgba(127, 227, 255, 0.22), inset 0 0 18px rgba(127, 227, 255, 0.16)',
			pointerEvents: 'none',
		},
	},
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			width: '110px',
			height: '110px',
		},
	},
});

export const heroAvatar = style({
	width: '120px',
	height: '120px',
	borderRadius: '50%',
	objectFit: 'cover',
	position: 'relative',
	zIndex: 0,
	// 行星临边：亮色描边 + 青色大气辉光
	border: '3px solid rgba(228, 241, 255, 0.88)',
	boxShadow:
		'0 0 0 5px rgba(127, 227, 255, 0.14), 0 0 34px rgba(127, 227, 255, 0.32), 0 14px 44px rgba(2, 8, 20, 0.65)',
	animation: `${float} 3.5s ease-in-out 0.8s infinite`,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			width: '96px',
			height: '96px',
		},
		[reduceMotion]: {
			animation: 'none',
		},
	},
});

export const heroTitle = style({
	fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
	fontWeight: 800,
	margin: 0,
	// 1.1 偏紧，大号粗体的下伸笔画（g/y/p/q）会被裁掉，这里放宽到 1.25
	lineHeight: 1.4,
	letterSpacing: '-0.03em',
	// 深空场景恒用亮色墨水
	color: spaceInk,
	textShadow: '0 0 32px rgba(127, 227, 255, 0.22)',
	selectors: {
		'[data-hero-state="travel"] &': {
			opacity: 0,
			visibility: 'hidden',
			transform: 'translateY(26px)',
			filter: 'blur(6px)',
		},
		'[data-hero-state="arrived"]:not([data-hero-arrival="instant"]) &': {
			animation: `${riseIn} 0.9s ease-out 0.5s both`,
		},
	},
});

export const heroTagline = style({
	fontSize: 'clamp(1rem, 2vw, 1.25rem)',
	color: spaceInkMuted,
	margin: 0,
	maxWidth: '32rem',
	lineHeight: 1.6,
	selectors: {
		'[data-hero-state="travel"] &': {
			opacity: 0,
			visibility: 'hidden',
			transform: 'translateY(26px)',
			filter: 'blur(6px)',
		},
		'[data-hero-state="arrived"]:not([data-hero-arrival="instant"]) &': {
			animation: `${riseIn} 0.9s ease-out 0.72s both`,
		},
	},
});

export const scrollIndicator = style({
	position: 'absolute',
	bottom: '2rem',
	left: '50%',
	transform: 'translateX(-50%)',
	zIndex: 2,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: vars.space.sm,
	background: 'none',
	border: 'none',
	cursor: 'pointer',
	color: spaceInkMuted,
	font: 'inherit',
	fontSize: '0.875rem',
	animation: `${bounce} 2s ease-in-out 2.5s infinite`,
	// 抵达后随星球错峰淡入；visibility 延迟切换保证淡入期间仍可交互
	transition: `color 200ms ease, opacity 900ms ease 1.15s, visibility 0s linear 1.15s`,
	opacity: 1,
	visibility: 'visible',
	selectors: {
		'&:hover': {
			color: spaceAccent,
		},
		'[data-hero-state="travel"] &': {
			opacity: 0,
			visibility: 'hidden',
			animation: 'none',
		},
	},
});

export const scrollArrow = style({
	width: '24px',
	height: '24px',
});
