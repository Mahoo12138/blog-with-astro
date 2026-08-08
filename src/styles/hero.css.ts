import { style, keyframes } from '@vanilla-extract/css';
import { breakpoints, vars } from './theme.css';

const fadeInUp = keyframes({
	'0%': { opacity: '0', transform: 'translateY(24px)' },
	'100%': { opacity: '1', transform: 'translateY(0)' },
});

const float = keyframes({
	'0%, 100%': { transform: 'translateY(0)' },
	'50%': { transform: 'translateY(-10px)' },
});

const bounce = keyframes({
	'0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
	'50%': { transform: 'translateX(-50%) translateY(8px)' },
});

// 星云缓慢漂移 — 营造深空大气感（GPU 合成，零 canvas 开销）
const nebulaDrift = keyframes({
	'0%': { transform: 'translate(0, 0) scale(1)' },
	'50%': { transform: 'translate(2%, -1%) scale(1.05)' },
	'100%': { transform: 'translate(-1%, 2%) scale(1)' },
});

// 星云色彩：亮色模式（柔和蓝紫）与暗色模式（深空蓝紫）
const lightNebula =
	'radial-gradient(ellipse 60% 50% at 30% 40%, rgba(33, 150, 243, 0.05), transparent 70%),' +
	'radial-gradient(ellipse 50% 40% at 70% 60%, rgba(139, 92, 246, 0.04), transparent 70%)';
const darkNebula =
	'radial-gradient(ellipse 60% 50% at 30% 40%, rgba(126, 203, 255, 0.07), transparent 70%),' +
	'radial-gradient(ellipse 50% 40% at 70% 60%, rgba(167, 139, 250, 0.05), transparent 70%)';

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
	opacity: 1,
	visibility: 'visible',
	pointerEvents: 'auto',
	willChange: 'opacity, transform',
	selectors: {
		// 星云背景层 — 在 canvas 之下，GPU 合成漂移
		'&::before': {
			content: '""',
			position: 'absolute',
			inset: '-10%',
			zIndex: 0,
			pointerEvents: 'none',
			background: lightNebula,
			animation: `${nebulaDrift} 24s ease-in-out infinite alternate`,
			willChange: 'transform',
			'@media': {
				'(prefers-color-scheme: dark)': {
					background: darkNebula,
				},
			},
		},
		':root[data-theme="light"] &::before': {
			background: lightNebula,
		},
		':root[data-theme="dark"] &::before': {
			background: darkNebula,
		},
	},
});

export const heroCanvas = style({
	position: 'absolute',
	inset: 0,
	width: '100%',
	height: '100%',
	zIndex: 0,
	pointerEvents: 'none',
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
	animation: `${fadeInUp} 0.8s ease-out both`,
});

export const heroAvatar = style({
	width: '120px',
	height: '120px',
	borderRadius: '50%',
	objectFit: 'cover',
	border: `3px solid ${vars.color.surfaceStrong}`,
	boxShadow: `0 0 0 4px ${vars.color.accentSoft}, 0 8px 32px rgba(33, 150, 243, 0.2)`,
	animation: `${float} 3.5s ease-in-out 0.8s infinite`,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			width: '96px',
			height: '96px',
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
	// 纯色：与第二屏欢迎语形成色彩对位（主标中性、点睛留给副标）
	color: vars.color.textStrong,
});

export const heroTagline = style({
	fontSize: 'clamp(1rem, 2vw, 1.25rem)',
	color: vars.color.textMuted,
	margin: 0,
	maxWidth: '32rem',
	lineHeight: 1.6,
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
	color: vars.color.textMuted,
	font: 'inherit',
	fontSize: '0.875rem',
	animation: `${bounce} 2s ease-in-out 1.2s infinite`,
	transition: 'color 200ms ease',
	selectors: {
		'&:hover': {
			color: vars.color.accent,
		},
	},
});

export const scrollArrow = style({
	width: '24px',
	height: '24px',
});
