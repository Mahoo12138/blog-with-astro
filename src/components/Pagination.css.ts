import { style } from '@vanilla-extract/css';
import { breakpoints, vars } from '../styles/theme.css';

export const root = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: vars.space.md,
	margin: `${vars.space.lg} ${vars.space.lg} ${vars.space.xl}`,
	padding: `${vars.space.sm} ${vars.space.md}`,
	borderRadius: '16px',
	background: vars.color.surfaceStrong,
	boxShadow: vars.shadow.card,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			margin: `${vars.space.lg} 0`,
			borderRadius: 0,
		},
	},
});

export const button = style({
	display: 'inline-flex',
	alignItems: 'center',
	gap: '0.4rem',
	padding: `0.5rem 0.9rem`,
	borderRadius: '8px',
	color: vars.color.text,
	fontSize: '0.88rem',
	fontWeight: 500,
	lineHeight: 1.2,
	whiteSpace: 'nowrap',
	transition: 'background 160ms ease, color 160ms ease',
	selectors: {
		'&:hover': {
			background: vars.color.backgroundElevated,
			color: vars.color.accentStrong,
		},
	},
});

export const disabled = style({
	pointerEvents: 'none',
	opacity: 0.35,
	cursor: 'not-allowed',
});

export const indicator = style({
	color: vars.color.textMuted,
	fontFamily: vars.font.mono,
	fontSize: '0.82rem',
	whiteSpace: 'nowrap',
});
