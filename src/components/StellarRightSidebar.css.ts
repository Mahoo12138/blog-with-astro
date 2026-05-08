import { style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

export const root = style({
	display: 'grid',
	gap: vars.space.lg,
});

export const card = style({
	padding: vars.space.xl,
	borderRadius: vars.radius.xl,
	border: `1px solid ${vars.color.border}`,
	background: vars.color.surface,
	boxShadow: vars.shadow.card,
	backdropFilter: 'blur(18px)',
});

export const cardTitle = style({
	margin: `0 0 ${vars.space.md}`,
	fontSize: '0.88rem',
	fontWeight: 700,
	letterSpacing: '0.08em',
	textTransform: 'uppercase',
	color: vars.color.textMeta,
});

export const intro = style({
	fontSize: '0.98rem',
	lineHeight: 1.7,
	color: vars.color.text,
});

export const quote = style({
	marginTop: vars.space.lg,
	padding: `${vars.space.md} ${vars.space.lg}`,
	borderLeft: `3px solid ${vars.color.borderStrong}`,
	borderRadius: `0 ${vars.radius.md} ${vars.radius.md} 0`,
	background: vars.color.surfaceStrong,
	color: vars.color.textMuted,
	fontSize: '0.92rem',
});

export const actionList = style({
	display: 'grid',
	gap: vars.space.xs,
	marginTop: vars.space.lg,
});

export const actionLink = style({
	display: 'flex',
	alignItems: 'center',
	gap: vars.space.sm,
	padding: `${vars.space.sm} ${vars.space.md}`,
	borderRadius: vars.radius.md,
	background: vars.color.surfaceStrong,
	color: vars.color.text,
	fontSize: '0.92rem',
	selectors: {
		'&:hover': {
			color: vars.color.textStrong,
			background: vars.color.backgroundElevated,
		},
	},
});

export const actionIcon = style({
	width: '0.95rem',
	height: '0.95rem',
	flexShrink: 0,
});

export const timeline = style({
	display: 'grid',
	gap: vars.space.md,
});

export const timelineItem = style({
	position: 'relative',
	paddingLeft: vars.space.lg,
	selectors: {
		'&::before': {
			content: '',
			position: 'absolute',
			left: 0,
			top: '0.35rem',
			width: '0.45rem',
			height: '0.45rem',
			borderRadius: vars.radius.pill,
			background: vars.color.accentStrong,
		},
		'&::after': {
			content: '',
			position: 'absolute',
			left: '0.21rem',
			top: '0.95rem',
			bottom: '-0.85rem',
			width: '1px',
			background: vars.color.border,
		},
		'&:last-child::after': {
			display: 'none',
		},
	},
});

export const timelineTime = style({
	marginBottom: vars.space.xs,
	fontSize: '0.8rem',
	color: vars.color.textMeta,
});

export const timelineLink = style({
	display: 'block',
	padding: `${vars.space.sm} ${vars.space.md}`,
	borderRadius: vars.radius.md,
	background: vars.color.surfaceStrong,
	color: vars.color.text,
	fontSize: '0.92rem',
	lineHeight: 1.55,
	selectors: {
		'&:hover': {
			color: vars.color.textStrong,
			background: vars.color.backgroundElevated,
		},
	},
});

export const mediaCard = style({
	overflow: 'hidden',
});

export const mediaImage = style({
	width: '100%',
	aspectRatio: '1.25 / 0.82',
	objectFit: 'cover',
	borderRadius: vars.radius.lg,
	marginBottom: vars.space.md,
});

export const mediaCaption = style({
	margin: 0,
	fontSize: '0.95rem',
	color: vars.color.text,
});