import { style } from '@vanilla-extract/css';
import { breakpoints, vars } from './theme.css';

export const main = style({
	width: '100%',
	margin: 0,
	padding: 0,
});

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space.xl,
	margin: `${vars.space.lg} ${vars.space.lg} ${vars.space.xxxl}`,
	color: vars.color.text,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			margin: `${vars.space.lg} 0 ${vars.space.xxxl}`,
		},
	},
});

export const header = style({
	padding: `${vars.space.sm} 0 ${vars.space.lg}`,
	borderBottom: `1px solid ${vars.color.border}`,
});

export const kicker = style({
	display: 'inline-flex',
	alignItems: 'baseline',
	gap: '0.4rem',
	margin: '0 0 0.5rem',
	fontSize: '0.78rem',
	fontWeight: 700,
	letterSpacing: '0.08em',
	textTransform: 'uppercase',
	color: vars.color.textMeta,
});

export const title = style({
	margin: '0 0 0.5rem',
	fontSize: 'clamp(1.6rem, 2.4vw, 2.2rem)',
	fontWeight: 800,
	letterSpacing: 0,
	color: vars.color.textStrong,
});

export const meta = style({
	margin: 0,
	fontSize: '0.85rem',
	color: vars.color.textMuted,
	fontFamily: vars.font.mono,
});

export const article = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space.xl,
	padding: `${vars.space.md} ${vars.space.md}`,
	borderRadius: '24px',
	// background: vars.color.surfaceStrong,
	// boxShadow: vars.shadow.card,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			padding: vars.space.lg,
			borderRadius: 0,
		},
	},
});

export const intro = style({
	margin: 0,
	fontSize: '0.95rem',
	lineHeight: 1.75,
	color: vars.color.textMuted,
});

export const section = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space.md,
});

export const sectionTitle = style({
	margin: 0,
	fontSize: '1.1rem',
	fontWeight: 700,
	color: vars.color.textStrong,
	display: 'flex',
	alignItems: 'center',
	gap: '0.5rem',
	selectors: {
		'&::before': {
			content: '',
			width: '4px',
			height: '1.05em',
			borderRadius: '2px',
			background: vars.color.accent,
		},
	},
});

export const sectionBody = style({
	display: 'flex',
	flexDirection: 'column',
	gap: '0.5rem',
	margin: 0,
	fontSize: '0.92rem',
	lineHeight: 1.75,
	color: vars.color.text,
});

export const list = style({
	margin: 0,
	paddingLeft: '1.25rem',
	display: 'flex',
	flexDirection: 'column',
	gap: '0.35rem',
	color: vars.color.text,
	fontSize: '0.92rem',
	lineHeight: 1.7,
});

export const contact = style({
	// marginTop: vars.space.md,
	padding: `${vars.space.md} ${vars.space.lg}`,
	borderRadius: '14px',
	background: vars.color.accentSoft,
	color: vars.color.text,
	fontSize: '0.9rem',
	lineHeight: 1.7,
});
