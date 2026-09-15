import { style } from '@vanilla-extract/css';
import { breakpoints, vars } from './theme.css';

/**
 * 专栏章节的阅读界面样式：目录（专栏页）与前后章导航（章节页）。
 *
 * 这两块是「专栏连续阅读」的核心 —— 让读者任何时候都知道
 * 自己在系列里的位置，并且能直接翻到下一章，而不用退回列表再找。
 */

export const chapterSection = style({
	marginTop: vars.space.xxl,
});

export const chapterSectionTitle = style({
	display: 'flex',
	alignItems: 'baseline',
	gap: vars.space.sm,
	margin: `0 0 ${vars.space.lg}`,
	fontSize: 'calc(1rem + 2px)',
	fontWeight: 500,
	color: vars.color.textStrong,
});

export const chapterSectionCount = style({
	fontSize: '0.82rem',
	fontWeight: 400,
	color: vars.color.textMeta,
});

export const chapterList = style({
	listStyle: 'none',
	margin: 0,
	padding: 0,
	display: 'grid',
	gap: vars.space.sm,
});

export const chapterItem = style({
	margin: 0,
});

export const chapterLink = style({
	display: 'grid',
	gridTemplateColumns: 'auto minmax(0, 1fr) auto',
	alignItems: 'center',
	gap: vars.space.md,
	padding: `${vars.space.md} ${vars.space.lg}`,
	borderRadius: vars.radius.lg,
	background: vars.color.surfaceStrong,
	border: `1px solid ${vars.color.border}`,
	textDecoration: 'none',
	color: vars.color.textStrong,
	selectors: {
		'&:hover': {
			borderColor: vars.color.accent,
			transform: 'translateY(-1px)',
			boxShadow: vars.shadow.card,
		},
		'&:focus-visible': {
			outline: 'none',
			boxShadow: vars.shadow.focus,
		},
	},
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			gap: vars.space.sm,
			padding: `${vars.space.sm} ${vars.space.md}`,
		},
	},
});

export const chapterIndex = style({
	fontFamily: vars.font.mono,
	fontSize: '0.82rem',
	fontWeight: 700,
	color: vars.color.textMeta,
	flexShrink: 0,
});

export const chapterTitle = style({
	minWidth: 0,
	fontSize: '0.95rem',
	lineHeight: 1.5,
	color: 'inherit',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
});

export const chapterDate = style({
	fontFamily: vars.font.mono,
	fontSize: '0.78rem',
	color: vars.color.textMeta,
	flexShrink: 0,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			display: 'none',
		},
	},
});

/** 章节页底部的前后章导航 */
export const nav = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
	gap: vars.space.md,
	marginTop: vars.space.xxl,
	paddingTop: vars.space.xl,
	borderTop: `1px solid ${vars.color.border}`,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			gridTemplateColumns: 'minmax(0, 1fr)',
		},
	},
});

export const navLink = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space.xs,
	padding: `${vars.space.md} ${vars.space.lg}`,
	borderRadius: vars.radius.lg,
	background: vars.color.surfaceStrong,
	border: `1px solid ${vars.color.border}`,
	textDecoration: 'none',
	minWidth: 0,
	selectors: {
		'&:hover': {
			borderColor: vars.color.accent,
			boxShadow: vars.shadow.card,
		},
		'&:focus-visible': {
			outline: 'none',
			boxShadow: vars.shadow.focus,
		},
	},
});

export const navLinkNext = style({
	textAlign: 'right',
	alignItems: 'flex-end',
});

export const navLinkEmpty = style({
	background: 'transparent',
	border: `1px dashed ${vars.color.border}`,
	color: vars.color.textMeta,
});

export const navLabel = style({
	fontSize: '0.78rem',
	color: vars.color.textMeta,
});

export const navTitle = style({
	fontSize: '0.92rem',
	fontWeight: 500,
	lineHeight: 1.45,
	color: vars.color.textStrong,
	overflow: 'hidden',
	display: '-webkit-box',
	WebkitLineClamp: 2,
	WebkitBoxOrient: 'vertical',
});

/** 章节页顶部：所属专栏 + 位置 */
export const columnBar = style({
	display: 'flex',
	alignItems: 'center',
	flexWrap: 'wrap',
	gap: vars.space.sm,
	marginBottom: vars.space.lg,
	padding: `${vars.space.sm} ${vars.space.md}`,
	borderRadius: vars.radius.lg,
	background: vars.color.surfaceMuted,
	border: `1px solid ${vars.color.border}`,
});

export const columnBarLink = style({
	display: 'inline-flex',
	alignItems: 'center',
	gap: vars.space.xs,
	fontSize: '0.82rem',
	fontWeight: 500,
	color: vars.color.accentStrong,
	textDecoration: 'none',
	selectors: {
		'&:hover': {
			textDecoration: 'underline',
		},
	},
});

export const columnBarPosition = style({
	fontFamily: vars.font.mono,
	fontSize: '0.78rem',
	color: vars.color.textMuted,
});

export const backToColumn = style({
	display: 'flex',
	justifyContent: 'center',
	marginTop: vars.space.lg,
});
