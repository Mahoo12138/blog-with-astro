import { style } from '@vanilla-extract/css';
import { breakpoints, vars } from '../styles/theme.css';

const stellarGapMargin = '16px';
const stellarSidebarWidth = '288px';

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

/* 三栏：左右各 1fr，中间 minmax(0, 主内容最大宽) —— 照抄原主题 l_body */
export const shell = style({
	position: 'relative',
	zIndex: 1,
	width: '100%',
	maxWidth: '100%',
	margin: '0 auto',
	padding: 0,
	display: 'grid',
	gridTemplateColumns: '1fr minmax(200px, 720px) 1fr',
	gap: '64px',
	alignItems: 'start',
	'@media': {
		'screen and (min-width: 2048px)': {
			gridTemplateColumns: '1fr minmax(200px, 780px) 1fr',
		},
		'screen and (min-width: 3840px)': {
			gridTemplateColumns: '1fr minmax(200px, 860px) 1fr',
		},
		'screen and (max-width: 1440px)': {
			gap: '32px',
		},
		/* 平板：隐藏两侧栏，主栏撑满 */
		[`screen and (max-width: ${breakpoints.laptop})`]: {
			width: 'min(100%, calc(100% - 1rem))',
			gridTemplateColumns: `${stellarSidebarWidth} minmax(0, 720px)`,
			gap: stellarGapMargin,
			padding: 0,
		},
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			display: 'block',
			width: 'min(100%, calc(100% - 1rem))',
		},
	},
});

/* 左侧栏：固定宽度，靠右对齐，吸顶 —— 照抄 .l_left */
export const left = style({
	width: stellarSidebarWidth,
	justifySelf: 'right',
	position: 'sticky',
	top: `calc(${stellarGapMargin} * 2)`,
	margin: `calc(${stellarGapMargin} * 2) ${stellarGapMargin}`,
	alignSelf: 'start',
	zIndex: 8,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			position: 'fixed',
			transform: 'translateX(-320px)',
			transition: 'transform 0.38s ease-out',
			margin: 0,
			left: '8px',
			top: `calc(${stellarGapMargin} * 2)`,
			maxHeight: `calc(100vh - ${stellarGapMargin} * 2 - 96px)`,
			boxShadow: '0 12px 16px -4px rgba(0, 0, 0, 0.2)',
			zIndex: 10,
		},
	},
	selectors: {
		[`${shell}[data-leftbar-open] &`]: {
			transform: 'translateX(0)',
		},
	},
});

export const mainArea = style({
	width: '100%',
	minWidth: 0,
	margin: 0,
	padding: `calc(${stellarGapMargin} * 2) 0 calc(${stellarGapMargin} + 16px)`,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			paddingTop: 0,
		},
	},
});

export const mainContent = style({
	minWidth: 0,
});

export const lead = style({
	marginBottom: vars.space.xl,
});

/* 右侧栏：固定宽度，靠左对齐，吸顶 —— 照抄 .l_right */
export const right = style({
	width: stellarSidebarWidth,
	justifySelf: 'left',
	position: 'sticky',
	top: `calc(${stellarGapMargin} * 2)`,
	margin: `calc(${stellarGapMargin} * 2) 0`,
	alignSelf: 'start',
	zIndex: 8,
	'@media': {
		[`screen and (max-width: ${breakpoints.laptop})`]: {
			position: 'fixed',
			transform: 'translateX(320px)',
			transition: 'transform 0.38s ease-out',
			margin: 0,
			right: '8px',
			top: `calc(${stellarGapMargin} * 2)`,
			maxHeight: `calc(100vh - ${stellarGapMargin} * 2 - 96px)`,
			boxShadow: '0 12px 16px -4px rgba(0, 0, 0, 0.2)',
			zIndex: 10,
			background: vars.color.background,
			overflow: 'auto',
		},
	},
	selectors: {
		[`${shell}[data-rightbar-open] &`]: {
			transform: 'translateX(0)',
		},
	},
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
		[`${shell}[data-rightbar-open] &`]: {
			opacity: 1,
			pointerEvents: 'auto',
		},
	},
});

export const floatPanel = style({
	position: 'sticky',
	gridColumnEnd: 'span 3',
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
	background: 'rgba(255, 255, 255, 0.55)',
	boxShadow: '0 8px 30px rgba(15, 23, 42, 0.10)',
	backdropFilter: 'saturate(300%) blur(18px)',
	WebkitBackdropFilter: 'saturate(300%) blur(18px)',
	transition: 'all 0.2s ease',
	selectors: {
		[`${shell}[data-leftbar-open] &`]: {
			boxShadow: '0 0 4px -1px var(--theme, #2196f3), 0 0 16px -4px var(--theme, #2196f3), 0 0 32px -12px var(--theme, #2196f3), 0 0 128px -32px var(--theme, #2196f3)',
		},
		[`${shell}[data-rightbar-open] &`]: {
			boxShadow: '0 0 4px -1px var(--theme, #2196f3), 0 0 16px -4px var(--theme, #2196f3), 0 0 32px -12px var(--theme, #2196f3), 0 0 128px -32px var(--theme, #2196f3)',
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

export const rightbarToggle = style({
	display: 'flex',
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
		[`${shell}[data-rightbar-open] ${rightbarToggle} &`]: {
			color: vars.color.accentStrong,
		},
	},
});