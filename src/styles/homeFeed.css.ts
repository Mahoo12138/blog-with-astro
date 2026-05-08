import { style } from '@vanilla-extract/css';
import { breakpoints, vars } from './theme.css';

export const main = style({
	width: '100%',
	margin: 0,
	padding: 0,
});

export const list = style({
	listStyle: 'none',
	margin: 0,
	padding: 0,
});

export const item = style({
	margin: 0,
});

export const header = style({
	marginBottom: vars.space.xl,
});

export const archiveMain = style({
	width: '100%',
	margin: 0,
	padding: 0,
});

export const archiveSection = style({
	marginTop: vars.space.xl,
	padding: vars.space.xl,
	borderRadius: vars.radius.xl,
	border: `1px solid ${vars.color.border}`,
	background: vars.color.surface,
	boxShadow: vars.shadow.card,
	backdropFilter: 'blur(18px)',
});

export const archiveYear = style({
	margin: `0 0 ${vars.space.lg}`,
	fontSize: '1.3rem',
	fontWeight: 700,
	color: vars.color.textStrong,
});

export const archiveList = style({
	listStyle: 'none',
	margin: 0,
	padding: 0,
	display: 'grid',
	gap: vars.space.sm,
});

export const archiveLink = style({
	display: 'grid',
	gridTemplateColumns: '8rem minmax(0, 1fr)',
	gap: vars.space.lg,
	alignItems: 'baseline',
	padding: `${vars.space.sm} ${vars.space.md}`,
	borderRadius: vars.radius.md,
	color: vars.color.text,
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			gridTemplateColumns: '1fr',
			gap: vars.space.xs,
		},
	},
	selectors: {
		'&:hover': {
			background: vars.color.surfaceStrong,
			color: vars.color.textStrong,
		},
	},
});

export const archiveDate = style({
	fontSize: '0.88rem',
	color: vars.color.textMeta,
});

export const archiveTitle = style({
	minWidth: 0,
	fontSize: '1rem',
	color: 'inherit',
});