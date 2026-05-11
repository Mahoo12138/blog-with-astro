import { style } from '@vanilla-extract/css';
import { breakpoints, vars } from './theme.css';

export const frame = style({
	display: 'grid',
	gap: vars.space.lg,
	margin: vars.space.lg,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			margin: `${vars.space.lg} 0`,
		},
	},
});

export const header = style({
	position: 'relative',
	padding: vars.space.xl,
	borderRadius: '24px',
	background: vars.color.surfaceStrong,
	boxShadow: '0 1px 2px rgba(0, 0, 0, 0.10)',
	overflow: 'hidden',
	selectors: {
		'&::before': {
			content: '""',
			position: 'absolute',
			inset: '0 auto 0 0',
			width: '6px',
			background: vars.color.accent,
		},
	},
});

export const kicker = style({
	margin: `0 0 ${vars.space.sm}`,
	fontSize: '12px',
	fontWeight: 700,
	lineHeight: 1,
	color: vars.color.accent,
	textTransform: 'uppercase',
	letterSpacing: 0,
});

export const title = style({
	margin: 0,
	fontSize: '28px',
	fontWeight: 800,
	lineHeight: 1.2,
	color: vars.color.textStrong,
});

export const description = style({
	maxWidth: '34rem',
	margin: `${vars.space.sm} 0 0`,
	fontSize: '15px',
	lineHeight: 1.7,
	color: vars.color.text,
});

export const panel = style({
	padding: vars.space.xl,
	borderRadius: '24px',
	background: vars.color.surfaceStrong,
	boxShadow: '0 1px 2px rgba(0, 0, 0, 0.10)',
});

export const empty = style({
	margin: 0,
	fontSize: '14px',
	lineHeight: 1.7,
	color: vars.color.text,
});