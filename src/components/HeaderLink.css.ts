import { style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

export const link = style({
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: `${vars.space.sm} ${vars.space.md}`,
	borderRadius: vars.radius.pill,
	border: `1px solid transparent`,
	color: vars.color.text,
	fontSize: '0.95rem',
	fontWeight: 500,
	selectors: {
		'&:hover': {
			color: vars.color.textStrong,
			background: vars.color.surfaceStrong,
			borderColor: vars.color.border,
		},
		'&:focus-visible': {
			outline: 'none',
			boxShadow: vars.shadow.focus,
		},
		'&:visited': {
			color: vars.color.text,
		},
	},
});

export const active = style({
	color: vars.color.accentStrong,
	fontWeight: 700,
	background: vars.color.accentSoft,
	borderColor: vars.color.accentSoft,
	selectors: {
		'&:visited': {
			color: vars.color.accentStrong,
		},
	},
});