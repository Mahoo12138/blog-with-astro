import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

export const footer = style({
	width: `min(${vars.layout.shell}, calc(100% - 2rem))`,
	margin: '0 auto',
	padding: `${vars.space.xxl} 0 ${vars.space.section}`,
	borderTop: `1px solid ${vars.color.border}`,
	color: vars.color.textMuted,
	textAlign: 'center',
});

export const socialLinks = style({
	display: 'flex',
	justifyContent: 'center',
	gap: vars.space.sm,
	marginTop: vars.space.lg,
});

export const socialLink = style({
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '2.75rem',
	height: '2.75rem',
	borderRadius: vars.radius.pill,
	border: `1px solid ${vars.color.border}`,
	background: vars.color.surface,
	color: vars.color.textMuted,
	selectors: {
		'&:hover': {
			color: vars.color.textStrong,
			borderColor: vars.color.borderStrong,
			background: vars.color.surfaceStrong,
		},
		'&:focus-visible': {
			outline: 'none',
			boxShadow: vars.shadow.focus,
		},
	},
});

globalStyle(`${socialLink} svg`, {
	width: '1.15rem',
	height: '1.15rem',
});