import { style, keyframes, globalStyle } from '@vanilla-extract/css';
import { breakpoints, vars } from './theme.css';

const waveHand = keyframes({
	'0%, 60%, 100%': { transform: 'rotate(0deg)' },
	'10%, 30%': { transform: 'rotate(14deg)' },
	'20%': { transform: 'rotate(-8deg)' },
	'40%': { transform: 'rotate(-4deg)' },
	'50%': { transform: 'rotate(10deg)' },
});

const cardPopIn = keyframes({
	'0%': { opacity: '0', transform: 'translateY(12px) scale(0.96)' },
	'100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
});

export const section = style({
	// 在 PinnedScrollSection 中以 absolute 填满父级（100vh 舞台）
	position: 'absolute',
	inset: 0,
	width: '100%',
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: `${vars.space.xxl} ${vars.space.xl}`,
	// background: vars.color.surfaceStrong,
	zIndex: 2,
	overflow: 'auto',
});

export const container = style({
	width: '100%',
	maxWidth: vars.layout.shell,
	display: 'grid',
	gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
	gap: vars.space.xxl,
	alignItems: 'center',
	'@media': {
		[`screen and (max-width: ${breakpoints.laptop})`]: {
			gridTemplateColumns: '1fr',
			gap: vars.space.xl,
			textAlign: 'center',
		},
	},
});

export const left = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space.lg,
	alignItems: 'flex-start',
	'@media': {
		[`screen and (max-width: ${breakpoints.laptop})`]: {
			alignItems: 'center',
		},
	},
});

export const greeting = style({
	fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
	fontWeight: 800,
	margin: 0,
	lineHeight: 1.15,
	color: vars.color.textStrong,
	letterSpacing: '-0.02em',
	display: 'flex',
	alignItems: 'center',
	gap: vars.space.sm,
	'@media': {
		[`screen and (max-width: ${breakpoints.laptop})`]: {
			justifyContent: 'center',
		},
	},
});

export const wave = style({
	display: 'inline-block',
	transformOrigin: '70% 70%',
	animation: `${waveHand} 2.4s ease-in-out infinite`,
});

export const headline = style({
	fontSize: 'clamp(2rem, 5vw, 3.25rem)',
	fontWeight: 800,
	margin: 0,
	lineHeight: 1.15,
	letterSpacing: '-0.03em',
	// 纯色：用品牌重点蓝与首屏主标形成色彩对位
	// light: #3367d6  /  dark: #a8ddff（已在 theme.css.ts 定义）
	color: vars.color.accentStrong,
});

export const subline = style({
	fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
	color: vars.color.textMuted,
	margin: 0,
});

export const pills = style({
	display: 'flex',
	gap: vars.space.md,
	marginTop: vars.space.md,
	flexWrap: 'wrap',
	'@media': {
		[`screen and (max-width: ${breakpoints.laptop})`]: {
			justifyContent: 'center',
		},
	},
});

const pillBase = style({
	display: 'inline-flex',
	alignItems: 'center',
	gap: vars.space.sm,
	padding: `${vars.space.sm} ${vars.space.lg}`,
	borderRadius: vars.radius.pill,
	fontSize: '0.95rem',
	fontWeight: 600,
	border: 'none',
	textDecoration: 'none',
	transition: 'transform 200ms ease, box-shadow 200ms ease',
	selectors: {
		'&:hover': {
			transform: 'translateY(-2px)',
		},
	},
});

export const pillPrimary = style([
	pillBase,
	{
		background: vars.color.accent,
		color: '#fff',
		boxShadow: '0 6px 18px rgba(33, 150, 243, 0.32)',
		selectors: {
			'&:hover': {
				background: vars.color.accentStrong,
				color: '#fff',
			},
		},
	},
]);

export const pillAccent = style([
	pillBase,
	{
		background: 'linear-gradient(135deg, #ff8a65 0%, #ff6b35 100%)',
		color: '#fff',
		boxShadow: '0 6px 18px rgba(255, 107, 53, 0.32)',
		selectors: {
			'&:hover': {
				color: '#fff',
			},
		},
	},
]);

export const right = style({
	width: '100%',
});

export const grid = style({
	listStyle: 'none',
	margin: 0,
	padding: 0,
	display: 'grid',
	gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
	gap: vars.space.md,
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
		},
		[`screen and (max-width: 420px)`]: {
			gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
			gap: vars.space.sm,
		},
	},
});

globalStyle(`${grid} li`, {
	margin: 0,
});

globalStyle(`${section}[data-visible="true"] ${grid} li`, {
	animation: `${cardPopIn} 500ms ease-out both`,
});

globalStyle(`${section}[data-visible="true"] ${grid} li:nth-child(1)`, { animationDelay: '60ms' });
globalStyle(`${section}[data-visible="true"] ${grid} li:nth-child(2)`, { animationDelay: '120ms' });
globalStyle(`${section}[data-visible="true"] ${grid} li:nth-child(3)`, { animationDelay: '180ms' });
globalStyle(`${section}[data-visible="true"] ${grid} li:nth-child(4)`, { animationDelay: '240ms' });
globalStyle(`${section}[data-visible="true"] ${grid} li:nth-child(5)`, { animationDelay: '300ms' });
globalStyle(`${section}[data-visible="true"] ${grid} li:nth-child(6)`, { animationDelay: '360ms' });
globalStyle(`${section}[data-visible="true"] ${grid} li:nth-child(7)`, { animationDelay: '420ms' });
globalStyle(`${section}[data-visible="true"] ${grid} li:nth-child(8)`, { animationDelay: '480ms' });
globalStyle(`${section}[data-visible="true"] ${grid} li:nth-child(9)`, { animationDelay: '540ms' });
globalStyle(`${section}[data-visible="true"] ${grid} li:nth-child(10)`, { animationDelay: '600ms' });
globalStyle(`${section}[data-visible="true"] ${grid} li:nth-child(11)`, { animationDelay: '660ms' });
globalStyle(`${section}[data-visible="true"] ${grid} li:nth-child(12)`, { animationDelay: '720ms' });

export const card = style({
	display: 'flex',
	alignItems: 'center',
	gap: vars.space.md,
	padding: vars.space.lg,
	borderRadius: vars.radius.lg,
	background: vars.color.surface,
	border: `1px solid ${vars.color.border}`,
	textDecoration: 'none',
	color: 'inherit',
	transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease, background 220ms ease',
	boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
	selectors: {
		'&:hover': {
			transform: 'translateY(-4px)',
			borderColor: vars.color.accent,
			boxShadow: `0 14px 32px rgba(33, 150, 243, 0.18), 0 0 0 4px ${vars.color.accentSoft}`,
			background: vars.color.surfaceStrong,
		},
	},
});

globalStyle(`${card}:hover`, {
	color: 'inherit',
});

export const cardIcon = style({
	flexShrink: 0,
	width: '44px',
	height: '44px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: vars.radius.md,
	background: vars.color.surfaceMuted,
	transition: 'background 220ms ease, transform 220ms ease',
	selectors: {
		[`${card}:hover &`]: {
			background: vars.color.accentSoft,
			transform: 'scale(1.08)',
		},
	},
});

export const cardBody = style({
	display: 'flex',
	flexDirection: 'column',
	minWidth: 0,
	gap: '2px',
});

export const cardName = style({
	fontSize: '0.98rem',
	fontWeight: 700,
	color: vars.color.textStrong,
	letterSpacing: '-0.01em',
});

export const cardDesc = style({
	fontSize: '0.78rem',
	color: vars.color.textMuted,
});
