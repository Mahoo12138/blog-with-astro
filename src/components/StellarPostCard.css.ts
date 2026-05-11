import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

export const wrap = style({
	margin: `${vars.space.lg} 0`,
});

export const card = style({
	display: 'block',
	overflow: 'hidden',
	borderRadius: '24px',
	background: vars.color.surfaceStrong,
	border: 'none',
	boxShadow: vars.shadow.card,
	position: 'relative',
	zIndex: 0,
	vars: {
		'--stellar-img-br': '100%',
		'--stellar-img-sat': '100%',
		'--stellar-blur-sat': '120%',
		'--stellar-blur-px': '1em',
		'--stellar-blur-height': '128px',
	},
	selectors: {
		'&:hover': {
			vars: {
				'--stellar-img-br': '75%',
				'--stellar-img-sat': '120%',
				'--stellar-blur-sat': '200%',
			},
			transform: 'translateY(-1px)',
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
		minHeight: 0,
		color: '#ffffff',
		selectors: {
			'&:visited': {
				color: '#ffffff',
			},
		},
	},
});

export const textBody = style({
	padding: vars.space.lg,
});

export const cap = style({
	display: 'inline-flex',
	alignItems: 'center',
	gap: '0.35rem',
	maxWidth: '100%',
	marginBottom: vars.space.sm,
	padding: '0.2rem 0.48rem',
	borderRadius: '8px',
	background: vars.color.accentSoft,
	color: vars.color.accentStrong,
	fontSize: '0.72rem',
	fontWeight: 700,
	lineHeight: 1.4,
});

export const capIcon = style({
	width: '0.9rem',
	height: '0.9rem',
	flexShrink: 0,
});

export const title = style({
	margin: `0 auto ${vars.space.md} 0`,
	fontSize: 'calc(1rem + 4px)',
	fontWeight: 500,
	lineHeight: 1.2,
	color: vars.color.textStrong,
	selectors: {
		[`${card}:hover &`]: {
			color: vars.color.accentStrong,
		},
	},
});

export const excerpt = style({
	margin: `${vars.space.lg} 0`,
	fontSize: '0.875rem',
	lineHeight: 1.5,
	color: vars.color.text,
});

export const meta = style({
	display: 'flex',
	alignItems: 'center',
	flexWrap: 'wrap',
	gap: '8px',
	lineHeight: 2,
	fontSize: 'calc(1rem - 1px)',
	color: vars.color.textMeta,
});

export const metaIcon = style({
	width: '1em',
	height: '1em',
	flexShrink: 0,
	transform: 'scale(1.2)',
});

export const tag = style({
	display: 'inline-flex',
	alignItems: 'center',
	minHeight: '1.65rem',
	padding: '0 0.5rem',
	borderRadius: '999px',
	background: 'rgba(148, 163, 184, 0.12)',
	fontSize: '0.78rem',
	color: vars.color.textMuted,
});

export const photoMedia = style({
	width: '100%',
	aspectRatio: '2 / 1',
	objectFit: 'cover',
	borderRadius: 0,
	filter: 'brightness(var(--stellar-img-br)) saturate(var(--stellar-img-sat))',
});

export const photoOverlay = style({
	position: 'absolute',
	left: 0,
	right: 0,
	bottom: 0,
	height: 'var(--stellar-blur-height)',
	background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.2))',
	backdropFilter: 'saturate(var(--stellar-blur-sat)) blur(var(--stellar-blur-px))',
	WebkitBackdropFilter: 'saturate(var(--stellar-blur-sat)) blur(var(--stellar-blur-px))',
	mask: 'linear-gradient(transparent, rgba(0, 0, 0, 0.75), black)',
	WebkitMask: 'linear-gradient(transparent, rgba(0, 0, 0, 0.75), black)',
});

export const photoBody = style({
	position: 'absolute',
	left: 0,
	right: 0,
	bottom: 0,
	padding: `${vars.space.xl} ${vars.space.lg}`,
	zIndex: 1,
});

export const photoTitle = style({
	margin: 0,
	fontSize: 'calc(1rem + 4px)',
	fontWeight: 500,
	lineHeight: 1.2,
	color: '#ffffff',
	textShadow: '0 6px 18px rgba(0, 0, 0, 0.28)',
});