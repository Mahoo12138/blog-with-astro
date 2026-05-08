import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

/* 侧栏高度 = 100vh - gap-margin*2 - leftbar-bottom-margin(96px) */
const sidebarHeight = 'calc(100vh - 32px - 96px)';

/* root: 照抄 .l_left margin + border-radius，position:sticky 在 StellarShell 里管 */
export const root = style({
	position: 'relative',
	borderRadius: vars.radius.xl,
	margin: `${vars.space.xl} ${vars.space.md}`,
	overflow: 'visible', /* 允许 sidebg blur 溢出裁切在 leftbar-container 内 */
});

/* sidebg: 背景色光晕层，照抄 .sidebg —— 绝对填满 */
export const sidebg = style({
	pointerEvents: 'none',
	position: 'absolute',
	top: 0,
	bottom: 0,
	left: 0,
	right: 0,
	borderRadius: vars.radius.xl,
	background: 'linear-gradient(160deg, #e4f5ff 0%, #fff2e8 55%, #ffe9bf 100%)',
});

/* container: 照抄 .leftbar-container —— 固定高度 + overflow:hidden + flex列 */
export const container = style({
	position: 'relative',
	height: sidebarHeight,
	display: 'flex',
	flexDirection: 'column',
	wordBreak: 'break-all',
	borderRadius: vars.radius.xl,
	overflow: 'hidden',
	/* ::before — 玻璃效果 + mask 渐变淡出 (核心灵魂) */
	'::before': {
		content: '',
		position: 'absolute',
		pointerEvents: 'none',
		top: 0, bottom: 0, left: 0, right: 0,
		borderRadius: vars.radius.xl,
		background: 'rgba(255,255,255,0.05)',
		boxShadow: 'inset 0 0 32px 1px rgba(255,255,255,0.5)',
		backdropFilter: 'saturate(300%)',
		WebkitBackdropFilter: 'saturate(300%)',
		mask: 'linear-gradient(black, rgba(0,0,0,0.5) 70%, transparent 90%, transparent)',
		WebkitMask: 'linear-gradient(black, rgba(0,0,0,0.5) 70%, transparent 90%, transparent)',
		zIndex: 0,
	},
});

/* 底部径向光晕，放在 sidebg 层 */
export const glow = style({
	position: 'absolute',
	left: '-12%',
	right: '-10%',
	bottom: '-18%',
	height: '17rem',
	background: 'radial-gradient(circle, rgba(255,188,83,0.82), rgba(255,188,83,0.14) 52%, transparent 74%)',
	filter: 'blur(22px)',
	pointerEvents: 'none',
	zIndex: 0,
});

/* inner: 内容滚动区，照抄 >.widgets mask 淡出 */
export const inner = style({
	position: 'relative',
	flexGrow: 1,
	overflowY: 'auto',
	overflowX: 'hidden',
	paddingBottom: vars.space.xl,
	scrollbarWidth: 'none',
	zIndex: 1,
	mask: 'linear-gradient(white 90%, transparent)',
	WebkitMask: 'linear-gradient(white 90%, transparent)',
});

export const profile = style({
	position: 'relative',
	display: 'flex',
	alignItems: 'center',
	gap: vars.space.lg,
	padding: `${vars.space.xl} ${vars.space.xl} ${vars.space.lg}`,
	zIndex: 1,
});

export const avatar = style({
	width: '3.25rem',
	height: '3.25rem',
	borderRadius: vars.radius.pill,
	border: '2px solid rgba(255, 255, 255, 0.84)',
	boxShadow: '0 12px 28px rgba(15, 23, 42, 0.14)',
	objectFit: 'cover',
	flexShrink: 0,
});

export const titleWrap = style({
	minWidth: 0,
});

export const title = style({
	display: 'block',
	margin: 0,
	fontSize: '1.35rem',
	fontWeight: 900,
	lineHeight: 1,
	color: vars.color.textStrong,
	letterSpacing: '0.02em',
	textShadow: '0 1px 0 rgba(255, 255, 255, 0.5)',
});

export const subtitle = style({
	margin: `${vars.space.xs} 0 0`,
	fontSize: '0.9rem',
	color: vars.color.textMuted,
});

export const menuGrid = style({
	position: 'relative',
	display: 'grid',
	gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
	gap: vars.space.sm,
	padding: `0 ${vars.space.xl} ${vars.space.lg}`,
	zIndex: 1,
});

export const menuLink = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '3rem',
	borderRadius: vars.radius.md,
	background: 'rgba(255, 255, 255, 0.58)',
	color: vars.color.textMuted,
	boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.48)',
	backdropFilter: 'blur(14px)',
	selectors: {
		'&:hover': {
			color: vars.color.textStrong,
			background: 'rgba(255, 255, 255, 0.78)',
		},
		'&:focus-visible': {
			outline: 'none',
			boxShadow: vars.shadow.focus,
		},
	},
});

export const menuActive = style({
	color: vars.color.accentStrong,
	background: 'rgba(255, 255, 255, 0.92)',
	boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.72), 0 10px 20px rgba(15, 23, 42, 0.08)',
});

export const menuIcon = style({
	width: '1.2rem',
	height: '1.2rem',
});

export const search = style({
	position: 'relative',
	display: 'flex',
	alignItems: 'center',
	gap: vars.space.sm,
	padding: `${vars.space.sm} ${vars.space.xl} ${vars.space.md}`,
	marginBottom: vars.space.xl,
	color: vars.color.text,
	zIndex: 1,
	selectors: {
		'&::after': {
			content: '',
			position: 'absolute',
			left: 0,
			right: 0,
			bottom: 0,
			height: '2px',
			borderRadius: vars.radius.pill,
			background: 'rgba(255, 255, 255, 0.58)',
		},
	},
});

export const searchIcon = style({
	width: '1rem',
	height: '1rem',
	color: vars.color.textMuted,
	flexShrink: 0,
});

export const searchLabel = style({
	fontSize: '0.92rem',
	color: vars.color.textMuted,
});

export const widgets = style({
	position: 'relative',
	display: 'grid',
	gap: vars.space.xl,
	padding: `0 ${vars.space.xl}`,
	zIndex: 1,
});

export const widget = style({
	display: 'grid',
	gap: vars.space.sm,
});

export const widgetTitle = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	fontSize: '0.82rem',
	fontWeight: 700,
	letterSpacing: '0.08em',
	textTransform: 'uppercase',
	color: vars.color.textMeta,
});

export const widgetLink = style({
	fontSize: '0.78rem',
	color: vars.color.textMeta,
});

export const recentList = style({
	display: 'grid',
	gap: vars.space.xs,
});

export const recentItem = style({
	display: 'block',
	padding: `${vars.space.xs} 0`,
	color: vars.color.text,
	fontSize: '0.94rem',
	lineHeight: 1.45,
	selectors: {
		'&:hover': {
			color: vars.color.textStrong,
		},
	},
});

export const footer = style({
	position: 'relative',
	flexShrink: 0,
	padding: `${vars.space.md} ${vars.space.xl} ${vars.space.xl}`,
	fontSize: '0.84rem',
	color: vars.color.textMeta,
	zIndex: 1,
});

globalStyle(`${container}::-webkit-scrollbar`, { display: 'none' });
globalStyle(`${inner}::-webkit-scrollbar`, { display: 'none' });