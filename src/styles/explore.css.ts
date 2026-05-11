import { style } from '@vanilla-extract/css';
import { breakpoints, vars } from './theme.css';

export const pageMain = style({
	width: '100%',
	margin: 0,
	padding: 0,
});

export const grid = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
	gap: vars.space.lg,
	margin: vars.space.lg,
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			gridTemplateColumns: '1fr',
		},
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			margin: `${vars.space.lg} 0`,
		},
	},
});

export const card = style({
	display: 'block',
	height: '80px',
	overflow: 'hidden',
	borderRadius: '24px',
	background: vars.color.surfaceStrong,
	boxShadow: '0 1px 2px rgba(0, 0, 0, 0.10)',
	color: vars.color.text,
	selectors: {
		'&:hover': {
			transform: 'translateY(-2px)',
			boxShadow: vars.shadow.head,
			color: vars.color.textStrong,
		},
		'&:focus-visible': {
			outline: 'none',
			boxShadow: vars.shadow.focus,
		},
	},
});

export const article = style({
	display: 'flex',
	alignItems: 'center',
	boxSizing: 'border-box',
	minWidth: 0,
	height: '80px',
	padding: vars.space.lg,
});

export const preview = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '48px',
	height: '48px',
	marginRight: vars.space.lg,
	flexShrink: 0,
});

export const iconImage = style({
	display: 'block',
	width: '48px',
	height: '48px',
	borderRadius: '14px',
	objectFit: 'cover',
});

export const body = style({
	minWidth: 0,
	flex: 1,
});

export const title = style({
	margin: `0 0 ${vars.space.xs}`,
	fontSize: '16px',
	fontWeight: 700,
	lineHeight: 1.2,
	color: vars.color.textStrong,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

export const description = style({
	margin: 0,
	fontSize: '14px',
	lineHeight: 1.35,
	color: vars.color.text,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
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