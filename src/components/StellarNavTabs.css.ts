import { style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

export const root = style({
	position: 'sticky',
	top: vars.space.xl,
	zIndex: 8,
	marginBottom: vars.space.xl,
});

export const blur = style({
	padding: '1px',
	borderRadius: vars.radius.xl,
	background: 'rgba(255, 255, 255, 0.42)',
	boxShadow: vars.shadow.head,
	backdropFilter: 'blur(18px)',
});

export const inner = style({
	overflowX: 'auto',
	borderRadius: vars.radius.xl,
	scrollbarWidth: 'none',
});

export const nav = style({
	display: 'inline-flex',
	minWidth: '100%',
	padding: vars.space.xs,
	gap: '4px',
});

export const item = style({
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: `${vars.space.xs} ${vars.space.md}`,
	borderRadius: vars.radius.pill,
	whiteSpace: 'nowrap',
	fontSize: '0.88rem',
	fontWeight: 500,
	color: vars.color.textMuted,
	selectors: {
		'&:hover': {
			background: vars.color.surfaceStrong,
			color: vars.color.textStrong,
		},
	},
});

export const active = style({
	background: 'rgba(255, 255, 255, 0.88)',
	color: vars.color.textStrong,
	boxShadow: '0 0 1px rgba(0, 0, 0, 0.04), 0 0 4px rgba(0, 0, 0, 0.08)',
});

export const disabled = style({
	opacity: 0.52,
	cursor: 'default',
	pointerEvents: 'none',
});