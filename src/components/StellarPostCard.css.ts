import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

export const wrap = style({
	margin: `${vars.space.lg} 0`,
});

export const card = style({
	display: 'block',
	overflow: 'hidden',
	borderRadius: vars.radius.xl,
	background: vars.color.surface,
	border: `1px solid ${vars.color.border}`,
	boxShadow: vars.shadow.card,
	backdropFilter: 'blur(18px)',
	selectors: {
		'&:hover': {
			transform: 'translateY(-2px)',
			borderColor: vars.color.borderStrong,
			boxShadow: vars.shadow.head,
		},
		'&:focus-visible': {
			outline: 'none',
			boxShadow: vars.shadow.focus,
		},
		'&:visited': {
			color: 'inherit',
		},
	},
});

export const cardVariant = styleVariants({
	default: {},
	photo: {
		position: 'relative',
		minHeight: '18rem',
		color: '#ffffff',
		selectors: {
			'&:visited': {
				color: '#ffffff',
			},
		},
	},
});

export const textBody = style({
	padding: vars.space.xl,
});

export const title = style({
	margin: `0 0 ${vars.space.md}`,
	fontSize: '1.8rem',
	fontWeight: 600,
	lineHeight: 1.15,
	color: vars.color.textStrong,
	selectors: {
		[`${card}:hover &`]: {
			color: vars.color.accentStrong,
		},
	},
});

export const excerpt = style({
	margin: `0 0 ${vars.space.lg}`,
	fontSize: '1rem',
	lineHeight: 1.6,
	color: vars.color.textMuted,
});

export const meta = style({
	display: 'flex',
	alignItems: 'center',
	gap: vars.space.xs,
	fontSize: '0.9rem',
	color: vars.color.textMeta,
});

export const metaIcon = style({
	width: '1rem',
	height: '1rem',
	flexShrink: 0,
});

export const photoMedia = style({
	position: 'absolute',
	inset: 0,
	width: '100%',
	height: '100%',
	objectFit: 'cover',
	borderRadius: 0,
});

export const photoOverlay = style({
	position: 'absolute',
	inset: 0,
	background: 'linear-gradient(180deg, rgba(5, 12, 24, 0.16), rgba(5, 12, 24, 0.72))',
});

export const photoBody = style({
	position: 'relative',
	minHeight: '18rem',
	display: 'flex',
	alignItems: 'end',
	padding: vars.space.xl,
	zIndex: 1,
});

export const photoTitle = style({
	margin: 0,
	fontSize: '2rem',
	fontWeight: 600,
	lineHeight: 1.12,
	color: '#ffffff',
	textShadow: '0 6px 18px rgba(0, 0, 0, 0.28)',
});