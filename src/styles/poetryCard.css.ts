import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from './theme.css';

const cardBase = style({
	position: 'relative',
	width: '100%',
	height: '100%',
	padding: vars.space.xl,
	borderRadius: vars.radius.lg,
	overflow: 'hidden',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	gap: vars.space.md,
	border: `1px solid ${vars.color.border}`,
	boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
	fontFamily: vars.font.heading,
});

export const cardStarry = style([
	cardBase,
	{
		background: 'linear-gradient(135deg, #1a1f2e 0%, #2a1f3d 100%)',
		color: 'rgba(241, 245, 249, 0.92)',
	},
]);

export const cardPaper = style([
	cardBase,
	{
		background: 'linear-gradient(135deg, #f5efe2 0%, #ebe1cb 100%)',
		color: vars.color.textStrong,
	},
]);

export const cardPlain = style([
	cardBase,
	{
		background: vars.color.surfaceStrong,
		color: vars.color.textStrong,
	},
]);

export const content = style({
	fontSize: 'clamp(1.05rem, 1.5vw, 1.35rem)',
	fontWeight: 600,
	lineHeight: 1.5,
	letterSpacing: '0.02em',
	margin: 0,
});

export const meta = style({
	display: 'flex',
	alignItems: 'center',
	gap: vars.space.sm,
	fontSize: '0.78rem',
	opacity: 0.85,
});

export const dynasty = style({
	padding: '1px 8px',
	borderRadius: vars.radius.sm,
	background: 'currentColor',
	color: vars.color.surfaceStrong,
	opacity: 0.95,
	fontWeight: 700,
});

globalStyle(`${dynasty} { color: #fff; }`, {});

export const author = style({ fontWeight: 600 });
export const quote = style({ opacity: 0.7, fontSize: '0.74rem' });

export const starLayer = style({
	position: 'absolute',
	inset: 0,
	pointerEvents: 'none',
	opacity: 0.5,
});
