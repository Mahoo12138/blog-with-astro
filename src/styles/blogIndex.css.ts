import { style } from '@vanilla-extract/css';
import { breakpoints, vars } from './theme.css';

export const main = style({
	width: `min(${vars.layout.listing}, calc(100% - 2rem))`,
	margin: '0 auto',
	padding: `${vars.space.xxxl} 0 ${vars.space.section}`,
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			padding: `${vars.space.xxl} 0 ${vars.space.xxxxl}`,
		},
	},
});

export const list = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
	gap: vars.space.xl,
	listStyle: 'none',
	margin: 0,
	padding: 0,
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			gridTemplateColumns: '1fr',
			gap: vars.space.lg,
		},
	},
});

export const item = style({
	minWidth: 0,
});

export const featuredItem = style({
	gridColumn: '1 / -1',
	textAlign: 'center',
});

export const cardLink = style({
	display: 'block',
	height: '100%',
	padding: vars.space.xl,
	borderRadius: vars.radius.xl,
	border: `1px solid ${vars.color.border}`,
	background: vars.color.surface,
	boxShadow: vars.shadow.card,
	backdropFilter: 'blur(18px)',
	selectors: {
		'&:hover': {
			transform: 'translateY(-2px)',
			borderColor: vars.color.borderStrong,
			boxShadow: vars.shadow.head,
		},
		'&:focus-visible': {
			outline: 'none',
			boxShadow: vars.shadow.focus,
		},
	},
});

export const featuredCardLink = style({
	padding: vars.space.xxl,
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			padding: vars.space.xl,
		},
	},
});

export const coverImage = style({
	width: '100%',
	marginBottom: vars.space.md,
	borderRadius: vars.radius.lg,
	border: `1px solid ${vars.color.border}`,
	boxShadow: vars.shadow.card,
	transition: 'transform 160ms ease, box-shadow 160ms ease',
	selectors: {
		[`${cardLink}:hover &`]: {
			transform: 'translateY(-2px)',
			boxShadow: vars.shadow.head,
		},
		[`${cardLink}:focus-visible &`]: {
			transform: 'translateY(-2px)',
		},
		[`${featuredItem} &`]: {
			aspectRatio: '2 / 1',
			objectFit: 'cover',
		},
	},
});

export const title = style({
	margin: 0,
	color: vars.color.textStrong,
	fontSize: '1.25rem',
	lineHeight: 1.15,
	transition: 'color 160ms ease',
	selectors: {
		[`${featuredItem} &`]: {
			fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
		},
		[`${cardLink}:hover &`]: {
			color: vars.color.accentStrong,
		},
		[`${cardLink}:focus-visible &`]: {
			color: vars.color.accentStrong,
		},
		[`${cardLink}:visited &`]: {
			color: vars.color.textStrong,
		},
		[`${cardLink}:visited:hover &`]: {
			color: vars.color.accentStrong,
		},
	},
});

export const date = style({
	margin: `${vars.space.sm} 0 0`,
	color: vars.color.textMuted,
	fontSize: '0.95rem',
	transition: 'color 160ms ease',
	selectors: {
		[`${cardLink}:hover &`]: {
			color: vars.color.accentStrong,
		},
		[`${cardLink}:focus-visible &`]: {
			color: vars.color.accentStrong,
		},
	},
});