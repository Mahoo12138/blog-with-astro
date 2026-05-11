import { style } from '@vanilla-extract/css';
import { breakpoints, vars } from './theme.css';

export const pageMain = style({
	width: '100%',
	margin: 0,
	padding: 0,
});

export const header = style({
	marginBottom: 0,
});

export const srOnly = style({
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

export const postList = style({
	margin: vars.space.lg,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			margin: `${vars.space.lg} 0`,
		},
	},
});

export const cats = style({
	padding: 0,
	margin: 0,
});

export const catRow = style({
	margin: 0,
});

export const catLink = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: vars.space.lg,
	padding: `0.5em ${vars.space.lg}`,
	borderRadius: '8px',
	color: vars.color.text,
	fontSize: 'calc(1rem - 2px)',
	fontWeight: 500,
	selectors: {
		'&:hover': {
			background: vars.color.border,
			color: vars.color.textStrong,
		},
	},
});

export const catName = style({
	display: 'flex',
	alignItems: 'center',
	minWidth: 0,
});

export const catIcon = style({
	height: '1em',
	width: 'auto',
	flexShrink: 0,
	transform: 'scale(1.2)',
	marginRight: '8px',
});

export const catText = style({
	minWidth: 0,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

export const catBadge = style({
	fontWeight: 700,
	fontFamily: vars.font.mono,
	opacity: 0.5,
	fontSize: '0.75rem',
	whiteSpace: 'nowrap',
	selectors: {
		[`${catLink}:hover &`]: {
			opacity: 1,
			color: vars.color.accentStrong,
		},
	},
});

export const tags = style({
	display: 'flex',
	flexWrap: 'wrap',
	padding: 0,
	margin: '0 -4px',
});

export const tagLink = style({
	display: 'inline-flex',
	alignItems: 'center',
	position: 'relative',
	margin: '4px',
	padding: `0.5em ${vars.space.md}`,
	borderRadius: '4px',
	background: vars.color.backgroundElevated,
	color: vars.color.text,
	fontSize: '0.8125rem',
	fontWeight: 500,
	selectors: {
		'&:before': {
			content: '"#"',
			marginLeft: '-2px',
			marginRight: '2px',
			opacity: 0.4,
		},
		'&:hover': {
			background: vars.color.border,
			color: vars.color.textStrong,
		},
		'&:hover:before': {
			color: vars.color.accentStrong,
			opacity: 1,
		},
	},
});

export const topicList = style({
	margin: vars.space.lg,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			margin: `${vars.space.lg} 0`,
		},
	},
});

export const topicCardWrap = style({
	margin: `${vars.space.lg} 0`,
});

export const topicCard = style({
	display: 'block',
	overflow: 'hidden',
	position: 'relative',
	zIndex: 0,
	borderRadius: '24px',
	background: vars.color.surfaceStrong,
	boxShadow: vars.shadow.card,
	color: vars.color.text,
	selectors: {
		'&:hover': {
			transform: 'translateY(-2px)',
			boxShadow: vars.shadow.head,
		},
		'&:visited': {
			color: vars.color.text,
		},
	},
});

export const topicArticle = style({
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: 'center',
	padding: `${vars.space.lg} ${vars.space.sm}`,
});

export const topicPreview = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	margin: `${vars.space.lg} ${vars.space.xxxl}`,
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			margin: `${vars.space.md} ${vars.space.lg}`,
		},
	},
});

export const topicImage = style({
	width: '96px',
	maxHeight: '96px',
	objectFit: 'contain',
	borderRadius: 0,
	transition: 'all 750ms ease',
	selectors: {
		[`${topicCard}:hover &`]: {
			filter: 'saturate(120%) brightness(92%)',
		},
	},
});

export const topicFallback = style({
	display: 'grid',
	placeItems: 'center',
	width: '96px',
	height: '96px',
	borderRadius: '24px',
	background: vars.color.backgroundElevated,
	fontSize: '2rem',
	fontWeight: 800,
	color: vars.color.accentStrong,
});

export const topicExcerpt = style({
	margin: `${vars.space.lg} ${vars.space.sm}`,
	minWidth: '280px',
	flex: 1,
	overflow: 'hidden',
	wordWrap: 'break-word',
	'@media': {
		'screen and (min-width: 950px)': {
			marginRight: vars.space.xxl,
		},
	},
});

export const topicCaps = style({
	display: 'flex',
	flexWrap: 'wrap',
	gap: '4px',
	lineHeight: 1,
	marginBottom: vars.space.md,
});

export const topicCap = style({
	background: vars.color.backgroundElevated,
	padding: '2px 4px',
	borderRadius: '2px',
	fontSize: '0.8125rem',
	fontWeight: 600,
	color: vars.color.textMuted,
});

export const topicTitle = style({
	fontWeight: 500,
	margin: `${vars.space.sm} auto ${vars.space.md} 0`,
	lineHeight: 1.2,
	fontSize: 'calc(1rem + 4px)',
	borderBottom: 'none',
	color: vars.color.textStrong,
});

export const topicDescription = style({
	margin: 0,
	color: vars.color.text,
	fontSize: '0.875rem',
	lineHeight: 1.5,
});

export const columnBody = style({
	margin: `${vars.space.lg} 0`,
	padding: vars.space.lg,
	borderRadius: '24px',
	background: vars.color.surfaceStrong,
	boxShadow: vars.shadow.card,
	fontSize: '0.875rem',
	color: vars.color.text,
});

export const list = style({
	listStyle: 'none',
	margin: 0,
	padding: 0,
});

export const item = style({
	margin: 0,
});

export const empty = style({
	margin: vars.space.lg,
	padding: vars.space.lg,
	borderRadius: '12px',
	background: vars.color.backgroundElevated,
	boxShadow: vars.shadow.card,
	color: vars.color.textMuted,
	fontSize: '0.875rem',
});