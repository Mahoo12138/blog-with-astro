import { createVar, globalStyle, style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

const gapMargin = '16px';
const gapPadding = '16px';
const gapMax = '32px';
const sideContentWidth = '224px';
const borderCardLarge = '24px';
const borderCardSmall = '12px';
const borderBar = '8px';
const sidebarHeight = `calc(100vh - ${gapMargin} * 2 - 96px)`;
const sidebarGlassBackground = createVar();
const sidebarGlassGlow = createVar();
const bgA20 = vars.color.surfaceMuted;
const bgA50 = vars.color.surface;
const bgA100 = vars.color.surfaceStrong;
const textP1 = vars.color.text;
const textP2 = vars.color.textMuted;
const textP3 = vars.color.textMeta;
const sidebarBackgroundImage = 'url(https://gcore.jsdelivr.net/gh/cdn-x/placeholder@1.0.13/image/sidebar-bg1@small.jpg)';

/* root: 照抄 .l_left margin + border-radius，position:sticky 在 StellarShell 里管 */
export const root = style({
	position: 'relative',
	borderRadius: borderCardLarge,
	margin: 0,
	maxHeight: sidebarHeight,
	overflow: 'visible', /* 允许 sidebg blur 溢出裁切在 leftbar-container 内 */
});

/* sidebg: 背景色光晕层，照抄 .sidebg —— 绝对填满 */
export const sidebg = style({
	pointerEvents: 'none',
	position: 'absolute',
	top: '32px',
	bottom: '32px',
	left: '32px',
	right: '32px',
	borderRadius: borderCardLarge,
	backgroundImage: sidebarBackgroundImage,
	backgroundPosition: 'center',
	backgroundSize: 'cover',
	filter: 'saturate(400%) blur(100px) opacity(0.8)',
});

/* container: 照抄 .leftbar-container —— 固定高度 + overflow:hidden + flex列 */
export const container = style({
	position: 'relative',
	height: sidebarHeight,
	display: 'flex',
	flexDirection: 'column',
	wordBreak: 'break-all',
	textAlign: 'justify',
	borderRadius: borderCardLarge,
	overflow: 'hidden',
	vars: {
		[sidebarGlassBackground]: 'rgba(255, 255, 255, 0.05)',
		[sidebarGlassGlow]: 'rgba(255, 255, 255, 0.5)',
	},
	selectors: {
		':root[data-theme="light"] &': {
			vars: {
				[sidebarGlassBackground]: 'rgba(255, 255, 255, 0.05)',
				[sidebarGlassGlow]: 'rgba(255, 255, 255, 0.5)',
			},
		},
		':root[data-theme="dark"] &': {
			vars: {
				[sidebarGlassBackground]: 'rgba(15, 23, 42, 0.18)',
				[sidebarGlassGlow]: 'rgba(148, 163, 184, 0.18)',
			},
		},
	},
	'@media': {
		'(prefers-color-scheme: dark)': {
			vars: {
				[sidebarGlassBackground]: 'rgba(15, 23, 42, 0.18)',
				[sidebarGlassGlow]: 'rgba(148, 163, 184, 0.18)',
			},
		},
	},
	/* ::before — 玻璃效果 + mask 渐变淡出 (核心灵魂) */
	'::before': {
		content: '',
		position: 'absolute',
		pointerEvents: 'none',
		top: 0, bottom: 0, left: 0, right: 0,
		borderRadius: borderCardLarge,
		background: sidebarGlassBackground,
		boxShadow: `inset 0 0 32px 1px ${sidebarGlassGlow}`,
		backdropFilter: 'saturate(300%)',
		WebkitBackdropFilter: 'saturate(300%)',
		mask: 'linear-gradient(black, rgba(0,0,0,0.5) 70%, transparent 90%, transparent)',
		WebkitMask: 'linear-gradient(black, rgba(0,0,0,0.5) 70%, transparent 90%, transparent)',
		zIndex: 0,
	},
});

/* 底部径向光晕，放在 sidebg 层 */
export const glow = style({
	display: 'none',
});

/* inner: 内容滚动区，照抄 >.widgets mask 淡出 */
export const inner = style({
	position: 'relative',
	flexGrow: 1,
	overflow: 'scroll',
	margin: `0 ${gapMargin}`,
	scrollbarWidth: 'none',
	zIndex: 1,
	lineHeight: 1.2,
	borderRadius: borderBar,
	mask: 'linear-gradient(white, white 90%, transparent)',
	WebkitMask: 'linear-gradient(white, white 90%, transparent)',
});

export const profile = style({
	position: 'relative',
	display: 'flex',
	alignItems: 'center',
	minHeight: '48px',
	margin: `${gapMax} ${gapMargin} 0`,
	padding: 0,
	overflow: 'hidden',
	zIndex: 1,
});

export const avatar = style({
	width: '48px',
	height: '48px',
	marginRight: '1rem',
	padding: '2px',
	borderRadius: '48px',
	background: 'rgba(255, 255, 255, 0.35)',
	boxShadow: 'none',
	objectFit: 'cover',
	flexShrink: 0,
	transformOrigin: 'center',
	transition: 'transform 560ms cubic-bezier(0.22, 1, 0.36, 1)',
	selectors: {
		'&:hover': {
			transform: 'rotate(1turn)',
		},
	},
});

export const titleWrap = style({
	minWidth: 0,
});

export const title = style({
	display: 'block',
	margin: 0,
	fontSize: '1.5rem',
	fontWeight: 900,
	lineHeight: 1.2,
	color: vars.color.textStrong,
	letterSpacing: 0,
	textShadow: 'none',
});

export const subtitle = style({
	margin: 0,
	fontSize: '0.78rem',
	lineHeight: 1.2,
	whiteSpace: 'nowrap',
	color: textP1,
});

export const navArea = style({
	position: 'relative',
	margin: `1rem ${gapMargin} 0`,
	zIndex: 1,
});

export const menuGrid = style({
	position: 'relative',
	display: 'grid',
	width: '100%',
	gridTemplateColumns: 'repeat(var(--menubar-columns), minmax(0, 1fr))',
	gap: '8px',
	margin: '8px 0',
	padding: 0,
	zIndex: 1,
});

export const menuLink = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	boxSizing: 'border-box',
	width: '100%',
	minHeight: '40px',
	borderRadius: borderBar,
	background: bgA20,
	color: textP3,
	fontSize: '15px',
	fontWeight: 500,
	lineHeight: 1.2,
	textAlign: 'center',
	position: 'relative',
	selectors: {
		'&:hover': {
			color: textP1,
			background: bgA100,
		},
		'&:focus-visible': {
			outline: 'none',
			boxShadow: vars.shadow.focus,
		},
	},
});

export const menuActive = style({
	color: 'var(--menu-theme, #2196f3)',
	background: bgA100,
	boxShadow: 'none',
	selectors: {
		'&::after': {
			content: '',
			position: 'absolute',
			width: '16px',
			height: '2px',
			left: '50%',
			bottom: '2px',
			transform: 'translateX(-50%)',
			borderRadius: '2px',
			background: 'currentColor',
		},
	},
});

export const menuIcon = style({
	height: '28px',
	width: '28px',
	objectFit: 'contain',
	fill: 'currentColor',
	stroke: 'none',
	filter: 'grayscale(50%) brightness(0.8) opacity(0.5)',
	selectors: {
		[`${menuLink}:hover &`]: {
			filter: 'unset',
		},
		[`${menuActive} &`]: {
			filter: 'unset',
		},
	},
});

export const menuIconBase = style({
	opacity: 0.42,
});

export const menuIconTone = style({
	opacity: 1,
});

export const menuLabel = style({
	position: 'absolute',
	width: '1px',
	height: '1px',
	padding: 0,
	margin: '-1px',
	overflow: 'hidden',
	clip: 'rect(0, 0, 0, 0)',
	whiteSpace: 'nowrap',
	border: 0,
});

export const searchWrapper = style({
	paddingBottom: '32px',
	width: '100%',
	borderRadius: borderCardSmall,
});

export const searchForm = style({
	position: 'sticky',
	top: 0,
	height: '40px',
	display: 'flex',
	alignItems: 'center',
	transition: '0.38s ease-out',
	zIndex: 1,
	borderRadius: borderCardSmall,
	color: vars.color.textStrong,
	selectors: {
		'&::before': {
			content: '',
			position: 'absolute',
			height: '2px',
			bottom: 0,
			left: gapPadding,
			right: gapPadding,
			borderRadius: borderBar,
			background: bgA100,
			zIndex: 0,
			transition: '0.2s ease-out',
		},
		'&:hover::before': {
			height: '100%',
			left: 0,
			right: 0,
		},
		'&:focus-within::before': {
			height: '100%',
			left: 0,
			right: 0,
		},
	},
});

export const searchButton = style({
	position: 'relative',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '40px',
	width: `calc((${sideContentWidth} + ${gapPadding} * 2 - 3 * 8px) * 0.25)`,
	padding: 0,
	border: 0,
	borderRadius: borderBar,
	background: 'transparent',
	color: textP2,
	cursor: 'pointer',
	zIndex: 1,
});

export const searchIcon = style({
	width: '1rem',
	height: '1rem',
	color: 'currentColor',
});

export const searchInput = style({
	position: 'relative',
	width: '100%',
	boxSizing: 'border-box',
	fontFamily: vars.font.body,
	fontSize: '14px',
	padding: '12px 0',
	border: 0,
	outline: 0,
	background: 'transparent',
	color: vars.color.textStrong,
	zIndex: 1,
	selectors: {
		'&::placeholder': {
			color: textP3,
		},
	},
});

export const searchNoResult = style({
	display: 'none',
	color: textP1,
	textAlign: 'center',
	fontSize: '14px',
	padding: '2rem',
	margin: '8px 0',
	background: bgA20,
	borderRadius: borderCardSmall,
});

export const widgets = style({
	position: 'relative',
	display: 'block',
	padding: 0,
	zIndex: 1,
});

export const widget = style({
	display: 'block',
	paddingBottom: '32px',
});

export const welcomeText = style({
	margin: 0,
	padding: `${vars.space.sm} ${vars.space.md}`,
	borderRadius: '12px',
	background: 'rgba(255, 255, 255, 0.42)',
	fontSize: '0.88rem',
	lineHeight: 1.55,
	color: vars.color.text,
});

export const markdownWidget = style({});

export const markdownBody = style({
	borderRadius: borderCardSmall,
	padding: '0.25rem 1rem',
	background: bgA50,
	color: textP1,
	fontSize: '14px',
	lineHeight: 1.5,
});

export const postListWidget = style({});

export const widgetTitle = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	paddingLeft: gapPadding,
	paddingRight: gapPadding,
	lineHeight: '28px',
	fontWeight: 500,
	fontSize: '13px',
	letterSpacing: 0,
	textTransform: 'none',
	color: textP1,
});

export const widgetLink = style({
	fontSize: '0.78rem',
	color: vars.color.textMeta,
});

export const recentList = style({
	display: 'block',
	paddingRight: '8px',
});

export const recentItem = style({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	gap: '8px',
	padding: `6px ${gapPadding}`,
	borderRadius: borderBar,
	color: textP1,
	fontSize: '14px',
	lineHeight: 1.2,
	minWidth: 0,
	overflow: 'hidden',
	transition: 'background-color 160ms ease, color 160ms ease',
	selectors: {
		'& + &': {
			marginTop: '2px',
		},
		'&:hover': {
			background: bgA100,
			color: textP1,
		},
	},
});

export const recentItemTitle = style({
	display: 'block',
	minWidth: 0,
	flex: '1 1 auto',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

export const footer = style({
	position: 'relative',
	flexShrink: 0,
	margin: `0.5rem ${gapMax} 1rem`,
	padding: 0,
	fontSize: '14px',
	color: textP3,
	zIndex: 1,
});

export const socialWrap = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fill, 32px)',
	gap: '0.25rem',
	textAlign: 'center',
});

export const socialLink = style({
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	lineHeight: 0,
	padding: '6px',
	borderRadius: '32px',
	filter: 'grayscale(100%)',
	overflow: 'hidden',
	background: 'transparent',
	color: textP2,
	transition: 'box-shadow 0.2s ease, background 0.2s ease, transform 0.2s ease',
	selectors: {
		'&:hover': {
			zIndex: 1,
			filter: 'unset',
			background: bgA100,
			color: vars.color.accentStrong,
		},
	},
});

export const themeToggle = style({
	padding: '6px',
	border: 0,
	cursor: 'pointer',
	selectors: {
		'&:focus-visible': {
			outline: 'none',
			boxShadow: vars.shadow.focus,
		},
	},
});

export const themeStatusIcon = style({
	display: 'none',
});

export const themeStatusSystem = style({
	display: 'block',
	selectors: {
		[`${themeToggle}[data-theme-mode='light'] &`]: {
			display: 'none',
		},
		[`${themeToggle}[data-theme-mode='dark'] &`]: {
			display: 'none',
		},
	},
});

export const themeStatusLight = style({
	selectors: {
		[`${themeToggle}[data-theme-mode='light'] &`]: {
			display: 'block',
		},
	},
});

export const themeStatusDark = style({
	selectors: {
		[`${themeToggle}[data-theme-mode='dark'] &`]: {
			display: 'block',
		},
	},
});

export const socialIcon = style({
	width: '20px',
	height: '20px',
});

globalStyle(`${container}::-webkit-scrollbar`, { display: 'none' });
globalStyle(`${inner}::-webkit-scrollbar`, { display: 'none' });
globalStyle(`${markdownBody} > *:first-child`, { marginTop: '0.75rem' });
globalStyle(`${markdownBody} > *:last-child`, { marginBottom: '0.75rem' });
globalStyle(`${widgetTitle} > span`, { opacity: 0.6 });
