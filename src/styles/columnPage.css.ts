import { style } from '@vanilla-extract/css';
import { breakpoints, vars } from './theme.css';

export const main = style({
	width: '100%',
	maxWidth: '100%',
	margin: '0 auto',
	padding: 0,
});

export const article = style({
	display: 'grid',
	gridTemplateColumns: 'minmax(0, 1fr)',
	gap: 0,
	minWidth: 0,
});

export const bannerFallback = style({
	position: 'absolute',
	inset: 0,
	zIndex: 0,
	display: 'grid',
	placeItems: 'center',
	background: `linear-gradient(135deg, ${vars.color.accent}, ${vars.color.accentStrong})`,
	overflow: 'hidden',
});

export const bannerFallbackInitial = style({
	fontSize: 'clamp(6rem, 16vw, 10rem)',
	fontWeight: 900,
	color: 'rgba(255, 255, 255, 0.16)',
	lineHeight: 1,
	letterSpacing: '-0.04em',
	userSelect: 'none',
});

export const noBanner = style({
	background: vars.color.surfaceMuted,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			borderRadius: 0,
		},
	},
	vars: {
		'--text-banner': vars.color.text,
		'--button-hover-bg': 'rgba(0, 0, 0, 0.05)',
	},
});

export const bannerFallbackWithIcon = style({
	background: vars.color.surfaceStrong,
});

export const bannerFallbackIcon = style({
	width: '160px',
	height: '160px',
	objectFit: 'contain',
	opacity: 0.3,
});

export const bannerImageShift = style({
	objectPosition: '75% center',
});
