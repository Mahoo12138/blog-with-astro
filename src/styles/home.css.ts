import { style } from '@vanilla-extract/css';
import { breakpoints, vars } from './theme.css';

export const main = style({
	width: `min(${vars.layout.shell}, calc(100% - 2rem))`,
	margin: '0 auto',
	padding: `${vars.space.xxxl} 0 ${vars.space.section}`,
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			padding: `${vars.space.xxl} 0 ${vars.space.xxxxl}`,
		},
	},
});

export const hero = style({
	padding: `${vars.space.xxxl} ${vars.space.xxl}`,
	border: `1px solid ${vars.color.border}`,
	borderRadius: vars.radius.xl,
	background: vars.color.surface,
	boxShadow: vars.shadow.card,
	backdropFilter: 'blur(18px)',
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			padding: `${vars.space.xxl} ${vars.space.xl}`,
		},
	},
});

export const eyebrow = style({
	display: 'inline-flex',
	alignItems: 'center',
	padding: `${vars.space.xs} ${vars.space.md}`,
	borderRadius: vars.radius.pill,
	background: vars.color.accentSoft,
	color: vars.color.accentStrong,
	fontSize: '0.9rem',
	fontWeight: 700,
	letterSpacing: '0.08em',
	textTransform: 'uppercase',
});

export const heroTitle = style({
	marginTop: vars.space.lg,
	marginBottom: vars.space.lg,
	maxWidth: '12ch',
	fontSize: 'clamp(3rem, 9vw, 5.5rem)',
	lineHeight: 0.95,
	letterSpacing: '-0.05em',
});

export const heroText = style({
	maxWidth: '42rem',
	marginBottom: vars.space.xl,
	fontSize: '1.05rem',
	color: vars.color.textMuted,
});

export const actions = style({
	display: 'flex',
	flexWrap: 'wrap',
	gap: vars.space.md,
	marginBottom: vars.space.xxl,
});

export const primaryAction = style({
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: `${vars.space.md} ${vars.space.xl}`,
	borderRadius: vars.radius.pill,
	background: vars.color.textStrong,
	color: vars.color.surfaceStrong,
	fontWeight: 700,
	selectors: {
		'&:hover': {
			color: vars.color.surfaceStrong,
			transform: 'translateY(-1px)',
		},
		'&:focus-visible': {
			outline: 'none',
			boxShadow: vars.shadow.focus,
		},
	},
});

export const secondaryAction = style({
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: `${vars.space.md} ${vars.space.xl}`,
	borderRadius: vars.radius.pill,
	border: `1px solid ${vars.color.borderStrong}`,
	background: vars.color.surfaceStrong,
	color: vars.color.textStrong,
	fontWeight: 600,
	selectors: {
		'&:hover': {
			color: vars.color.textStrong,
			borderColor: vars.color.accentStrong,
		},
		'&:focus-visible': {
			outline: 'none',
			boxShadow: vars.shadow.focus,
		},
	},
});

export const statGrid = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
	gap: vars.space.md,
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			gridTemplateColumns: '1fr',
		},
	},
});

export const statCard = style({
	padding: `${vars.space.lg} ${vars.space.xl}`,
	borderRadius: vars.radius.lg,
	border: `1px solid ${vars.color.border}`,
	background: vars.color.surfaceStrong,
});

export const statLabel = style({
	display: 'block',
	marginBottom: vars.space.xs,
	fontSize: '0.85rem',
	fontWeight: 700,
	letterSpacing: '0.08em',
	textTransform: 'uppercase',
	color: vars.color.textMeta,
});

export const statValue = style({
	margin: 0,
	fontSize: '1rem',
	color: vars.color.textStrong,
});

export const section = style({
	marginTop: vars.space.xxxxl,
});

export const sectionHeader = style({
	display: 'flex',
	alignItems: 'end',
	justifyContent: 'space-between',
	gap: vars.space.lg,
	marginBottom: vars.space.xl,
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			flexDirection: 'column',
			alignItems: 'start',
		},
	},
});

export const sectionTitle = style({
	margin: 0,
});

export const sectionText = style({
	margin: `${vars.space.sm} 0 0`,
	color: vars.color.textMuted,
});

export const postGrid = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
	gap: vars.space.xl,
	listStyle: 'none',
	margin: 0,
	padding: 0,
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			gridTemplateColumns: '1fr',
		},
	},
});

export const postCard = style({
	display: 'block',
	height: '100%',
	padding: vars.space.xl,
	borderRadius: vars.radius.xl,
	border: `1px solid ${vars.color.border}`,
	background: vars.color.surface,
	boxShadow: vars.shadow.card,
	selectors: {
		'&:hover': {
			transform: 'translateY(-2px)',
			borderColor: vars.color.borderStrong,
		},
		'&:focus-visible': {
			outline: 'none',
			boxShadow: vars.shadow.focus,
		},
	},
});

export const postMeta = style({
	marginBottom: vars.space.sm,
	fontSize: '0.9rem',
	color: vars.color.textMeta,
});

export const postTitle = style({
	margin: 0,
	fontSize: '1.35rem',
	lineHeight: 1.1,
	color: vars.color.textStrong,
});

export const postDescription = style({
	margin: `${vars.space.md} 0 0`,
	color: vars.color.textMuted,
});