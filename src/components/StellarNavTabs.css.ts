import { style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

export const root = style({
	position: 'sticky',
	top: vars.space.xxl,
	zIndex: 8,
});

export const blur = style({
	margin: `0 ${vars.space.lg}`,
	borderRadius: '64px',
	position: 'relative',
	background: vars.color.surface,
	boxShadow: vars.shadow.head,
	backdropFilter: 'saturate(300%) blur(18px)',
	WebkitBackdropFilter: 'saturate(300%) blur(18px)',
});

export const inner = style({
	maxWidth: '100%',
	margin: '1px',
	overflow: 'scroll visible',
	borderRadius: '64px',
	scrollbarWidth: 'none',
});

export const nav = style({
	display: 'inline-flex',
	minWidth: 0,
	fontSize: '0.875rem',
});

export const item = style({
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: `0.25rem ${vars.space.md}`,
	margin: '0.25rem',
	lineHeight: 2,
	borderRadius: '32px',
	whiteSpace: 'nowrap',
	fontWeight: 500,
	color: vars.color.text,
	position: 'relative',
	zIndex: 1,
	selectors: {
		'&:hover': {
			background: vars.color.surfaceMuted,
			color: vars.color.textStrong,
		},
		'& + &': {
			marginLeft: '4px',
		},
	},
});

export const active = style({
	background: vars.color.surfaceStrong,
	color: vars.color.textStrong,
	boxShadow: '0 0 1px rgba(0, 0, 0, 0.04), 0 0 2px rgba(0, 0, 0, 0.04), 0 0 4px rgba(0, 0, 0, 0.08)',
	cursor: 'default',
	pointerEvents: 'none',
	backdropFilter: 'saturate(300%)',
	WebkitBackdropFilter: 'saturate(300%)',
});

export const disabled = style({
	opacity: 0.52,
	cursor: 'default',
	pointerEvents: 'none',
});