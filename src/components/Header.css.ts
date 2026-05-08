import { globalStyle, style } from '@vanilla-extract/css';
import { breakpoints, vars } from '../styles/theme.css';

export const header = style({
	padding: `${vars.space.lg} 1rem 0`,
});

export const nav = style({
	width: `min(${vars.layout.shell}, 100%)`,
	margin: '0 auto',
	padding: `0 ${vars.space.xl}`,
	minHeight: vars.layout.header,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: vars.space.lg,
	background: vars.color.surface,
	border: `1px solid ${vars.color.border}`,
	borderRadius: vars.radius.xl,
	boxShadow: vars.shadow.head,
	backdropFilter: 'blur(20px)',
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			padding: `0 ${vars.space.lg}`,
		},
	},
});

export const brand = style({
	margin: 0,
	fontSize: '1rem',
	letterSpacing: '0.08em',
	textTransform: 'uppercase',
	whiteSpace: 'nowrap',
});

export const brandLink = style({
	color: vars.color.textStrong,
});

export const internalLinks = style({
	marginLeft: 'auto',
	display: 'flex',
	alignItems: 'center',
	gap: vars.space.xs,
	flexWrap: 'wrap',
});

export const socialLinks = style({
	display: 'flex',
	alignItems: 'center',
	gap: vars.space.sm,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			display: 'none',
		},
	},
});

export const socialLink = style({
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '2.5rem',
	height: '2.5rem',
	borderRadius: vars.radius.pill,
	border: `1px solid ${vars.color.border}`,
	background: vars.color.surfaceStrong,
	color: vars.color.textMuted,
	selectors: {
		'&:hover': {
			color: vars.color.textStrong,
			borderColor: vars.color.borderStrong,
			transform: 'translateY(-1px)',
		},
		'&:focus-visible': {
			outline: 'none',
			boxShadow: vars.shadow.focus,
		},
	},
});

globalStyle(`${socialLink} svg`, {
	width: '1.1rem',
	height: '1.1rem',
});