import { style } from '@vanilla-extract/css';
import { breakpoints, vars } from '../styles/theme.css';

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
	width: 'min(1560px, calc(100% - 2rem))',
	margin: '0 auto',
	padding: `${vars.space.lg} 0 ${vars.space.section}`,
	display: 'grid',
	gridTemplateColumns: '1fr minmax(0, 42rem) 1fr',
	gap: `calc(${vars.space.xl} * 4)`,
	alignItems: 'start',
	'@media': {
		/* 平板：隐藏两侧栏，主栏撑满 */
		[`screen and (max-width: ${breakpoints.laptop})`]: {
			display: 'block',
			padding: `${vars.space.md} 0 ${vars.space.section}`,
		},
	},
});

/* 左侧栏：固定宽度，靠右对齐，吸顶 —— 照抄 .l_left */
export const left = style({
	width: '17rem',
	justifySelf: 'right',
	position: 'sticky',
	top: vars.space.lg,
	alignSelf: 'start',
	zIndex: 8,
	'@media': {
		[`screen and (max-width: ${breakpoints.laptop})`]: {
			display: 'none',
		},
	},
});

export const mainArea = style({
	width: '100%',
	minWidth: 0,
	margin: 0,
	padding: 0,
});

export const mobileBrand = style({
	display: 'none',
	marginBottom: vars.space.lg,
	padding: `${vars.space.md} ${vars.space.lg}`,
	borderRadius: vars.radius.xl,
	background: vars.color.surface,
	border: `1px solid ${vars.color.border}`,
	boxShadow: vars.shadow.head,
	'@media': {
		[`screen and (max-width: ${breakpoints.laptop})`]: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
	},
});

export const mobileTitle = style({
	margin: 0,
	fontSize: '1rem',
	fontWeight: 800,
	color: vars.color.textStrong,
});

export const mobileSubtitle = style({
	margin: `${vars.space.xs} 0 0`,
	fontSize: '0.85rem',
	color: vars.color.textMuted,
});

export const mainContent = style({
	minWidth: 0,
});

export const lead = style({
	marginBottom: vars.space.xl,
});

/* 右侧栏：固定宽度，靠左对齐，吸顶 —— 照抄 .l_right */
export const right = style({
	width: '16rem',
	justifySelf: 'left',
	position: 'sticky',
	top: vars.space.lg,
	alignSelf: 'start',
	zIndex: 8,
	'@media': {
		[`screen and (max-width: ${breakpoints.laptop})`]: {
			display: 'none',
		},
	},
});