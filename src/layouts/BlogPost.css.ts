import { globalStyle, style } from '@vanilla-extract/css';
import { breakpoints, vars } from '../styles/theme.css';

export const main = style({
	width: `min(${vars.layout.shell}, calc(100% - 2rem))`,
	maxWidth: '100%',
	margin: '0 auto',
	padding: `${vars.space.xxxl} 0 ${vars.space.section}`,
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			padding: `${vars.space.xxl} 0 ${vars.space.xxxxl}`,
		},
	},
});

export const article = style({
	display: 'grid',
	gap: vars.space.xxl,
});

export const heroWrap = style({
	width: `min(${vars.layout.listing}, 100%)`,
	margin: '0 auto',
});

export const heroImage = style({
	width: '100%',
	borderRadius: vars.radius.xl,
	border: `1px solid ${vars.color.border}`,
	boxShadow: vars.shadow.card,
});

export const prose = style({
	width: `min(${vars.layout.content}, 100%)`,
	margin: '0 auto',
	padding: `${vars.space.xxl} ${vars.space.xl} ${vars.space.xxxl}`,
	background: vars.color.surface,
	border: `1px solid ${vars.color.border}`,
	borderRadius: vars.radius.xl,
	boxShadow: vars.shadow.card,
	backdropFilter: 'blur(18px)',
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			padding: `${vars.space.xl} ${vars.space.lg} ${vars.space.xxl}`,
		},
	},
});

export const titleBlock = style({
	marginBottom: vars.space.xxl,
	paddingBottom: vars.space.sm,
	textAlign: 'center',
});

export const meta = style({
	marginBottom: vars.space.md,
	color: vars.color.textMuted,
	fontSize: '0.95rem',
});

export const updated = style({
	marginTop: vars.space.xs,
	fontStyle: 'italic',
});

export const title = style({
	marginBottom: vars.space.lg,
	fontSize: 'clamp(2.4rem, 6vw, 4.75rem)',
	lineHeight: 1,
});

globalStyle(`${prose} > :last-child`, {
	marginBottom: 0,
});

globalStyle(`${prose} img`, {
	margin: `${vars.space.xl} auto`,
	borderRadius: vars.radius.lg,
	border: `1px solid ${vars.color.border}`,
	boxShadow: vars.shadow.card,
});