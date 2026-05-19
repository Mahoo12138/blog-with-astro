import { keyframes, style } from '@vanilla-extract/css';
import { breakpoints, vars } from '../styles/theme.css';

const GAP = '40px';
const COMPACT_GAP = '24px';
const M = '16px';

const slideLeft = keyframes({
	from: { opacity: 0, transform: 'translate3d(16px, 0, 0)' },
	to: { opacity: 1, transform: 'none' },
});

export const body = style({
	minHeight: '100vh',
	position: 'relative',
});

export const background = style({
	position: 'fixed',
	inset: 0,
	pointerEvents: 'none',
	zIndex: 0,
});

export const glowLeft = style({
	position: 'absolute',
	left: '10%',
	top: '18%',
	width: '22rem',
	height: '22rem',
	borderRadius: '50%',
	background: 'radial-gradient(circle, rgba(255, 210, 119, 0.38), rgba(255, 210, 119, 0.08) 55%, transparent 72%)',
	filter: 'blur(16px)',
});

export const glowRight = style({
	position: 'absolute',
	right: '10%',
	top: '8%',
	width: '16rem',
	height: '16rem',
	borderRadius: '50%',
	background: 'radial-gradient(circle, rgba(188, 227, 255, 0.34), rgba(188, 227, 255, 0.08) 60%, transparent 78%)',
	filter: 'blur(12px)',
});

/* 宽版：两端留白 + 左侧固定侧边栏 + 内容占满剩余宽度 */
export const shell = style({
	position: 'relative',
	zIndex: 1,
	maxWidth: '1800px',
	margin: '0 auto',
	padding: `0 ${GAP}`,
	boxSizing: 'border-box',
	display: 'grid',
	gridTemplateColumns: '288px 1fr',
	gap: GAP,
	alignItems: 'start',
	'@media': {
		'screen and (max-width: 1440px)': {
			padding: `0 ${COMPACT_GAP}`,
			gap: COMPACT_GAP,
		},
		[`screen and (max-width: ${breakpoints.laptop})`]: {
			padding: `0 ${M}`,
			gap: M,
		},
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			display: 'block',
			padding: `0 ${M}`,
		},
	},
});

export const left = style({
	gridColumn: '1',
	width: '288px',
	justifySelf: 'right',
	position: 'sticky',
	top: `calc(${M} * 2)`,
	margin: `calc(${M} * 2) 0`,
	alignSelf: 'start',
	zIndex: 8,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			position: 'fixed',
			transform: 'translateX(-300px)',
			transition: 'transform 0.38s ease-out',
			margin: 0,
			left: '8px',
			top: `calc(${M} * 2)`,
			maxHeight: `calc(100vh - ${M} * 2 - 96px)`,
			boxShadow: '0 12px 16px -4px rgba(0, 0, 0, 0.2)',
			zIndex: 10,
			background: vars.color.background,
			overflow: 'auto',
		},
	},
	selectors: {
		[`${shell}[data-leftbar-open] &`]: {
			transform: 'translateX(0)',
		},
	},
});

export const mainArea = style({
	gridColumn: '2',
	width: '100%',
	minWidth: 0,
	padding: '32px 0',
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			paddingTop: 0,
		},
	},
});

export const mainContent = style({
	minWidth: 0,
	animation: `${slideLeft} 460ms cubic-bezier(0.22, 1, 0.36, 1) 40ms both`,
});

export const lead = style({
	marginBottom: vars.space.xl,
});

export const mainMask = style({
	position: 'fixed',
	pointerEvents: 'none',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	padding: 0,
	border: 0,
	background: 'rgba(0, 0, 0, 0.1)',
	zIndex: 9,
	opacity: 0,
	transition: 'opacity 0.2s ease',
	selectors: {
		[`${shell}[data-leftbar-open] &`]: {
			opacity: 1,
			pointerEvents: 'auto',
		},
	},
});

export const floatPanel = style({
	position: 'sticky',
	gridColumnEnd: 'span 2',
	right: 0,
	bottom: '4rem',
	marginLeft: 'auto',
	marginRight: '2rem',
	float: 'right',
	zIndex: 999999,
	display: 'flex',
	justifyContent: 'center',
	flexDirection: 'column',
	borderRadius: '64px',
	overflow: 'hidden',
	background: vars.color.surface,
	boxShadow: '0 8px 30px rgba(15, 23, 42, 0.10)',
	backdropFilter: 'saturate(300%) blur(18px)',
	WebkitBackdropFilter: 'saturate(300%) blur(18px)',
	transition: 'all 0.2s ease',
	selectors: {
		[`${shell}[data-leftbar-open] &`]: {
			boxShadow:
				'0 0 4px -1px var(--theme, #2196f3), 0 0 16px -4px var(--theme, #2196f3), 0 0 32px -12px var(--theme, #2196f3), 0 0 128px -32px var(--theme, #2196f3)',
		},
	},
	'@media': {
		[`screen and (min-width: ${breakpoints.laptop})`]: {
			display: 'none',
		},
		[`screen and (min-width: ${breakpoints.mobile})`]: {
			marginRight: '3rem',
		},
	},
});

export const floatButton = style({
	cursor: 'pointer',
	color: vars.color.textStrong,
	background: 'none',
	border: 0,
	width: '48px',
	height: '48px',
	lineHeight: 0,
	fontSize: '28px',
	margin: 0,
	padding: 0,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

export const leftbarToggle = style({
	display: 'none',
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			display: 'flex',
		},
	},
});

export const floatIcon = style({
	width: 'auto',
	height: '28px',
	selectors: {
		[`${shell}[data-leftbar-open] ${leftbarToggle} &`]: {
			color: vars.color.accentStrong,
		},
	},
});
