import { style, keyframes } from '@vanilla-extract/css';
import { breakpoints, vars } from './theme.css';

const fadeInUp = keyframes({
	'0%': { opacity: '0', transform: 'translateY(24px)' },
	'100%': { opacity: '1', transform: 'translateY(0)' },
});

const float = keyframes({
	'0%, 100%': { transform: 'translateY(0)' },
	'50%': { transform: 'translateY(-10px)' },
});

const bounce = keyframes({
	'0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
	'50%': { transform: 'translateX(-50%) translateY(8px)' },
});

export const hero = style({
	position: 'relative',
	width: '100%',
	minHeight: '100vh',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	overflow: 'hidden',
	zIndex: 1,
});

export const heroCanvas = style({
	position: 'absolute',
	inset: 0,
	width: '100%',
	height: '100%',
	zIndex: 0,
	pointerEvents: 'none',
});

export const heroContent = style({
	position: 'relative',
	zIndex: 2,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: vars.space.xl,
	padding: `${vars.space.xxxl} ${vars.space.xl}`,
	textAlign: 'center',
	animation: `${fadeInUp} 0.8s ease-out both`,
});

export const heroAvatar = style({
	width: '120px',
	height: '120px',
	borderRadius: '50%',
	objectFit: 'cover',
	border: `3px solid ${vars.color.surfaceStrong}`,
	boxShadow: `0 0 0 4px ${vars.color.accentSoft}, 0 8px 32px rgba(33, 150, 243, 0.2)`,
	animation: `${float} 3.5s ease-in-out 0.8s infinite`,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			width: '96px',
			height: '96px',
		},
	},
});

export const heroTitle = style({
	fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
	fontWeight: 800,
	margin: 0,
	lineHeight: 1.1,
	letterSpacing: '-0.03em',
	background: `linear-gradient(135deg, ${vars.color.textStrong} 0%, ${vars.color.accent} 100%)`,
	WebkitBackgroundClip: 'text',
	WebkitTextFillColor: 'transparent',
	backgroundClip: 'text',
});

export const heroTagline = style({
	fontSize: 'clamp(1rem, 2vw, 1.25rem)',
	color: vars.color.textMuted,
	margin: 0,
	maxWidth: '32rem',
	lineHeight: 1.6,
});

export const scrollIndicator = style({
	position: 'absolute',
	bottom: '2rem',
	left: '50%',
	transform: 'translateX(-50%)',
	zIndex: 2,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: vars.space.sm,
	background: 'none',
	border: 'none',
	cursor: 'pointer',
	color: vars.color.textMuted,
	font: 'inherit',
	fontSize: '0.875rem',
	animation: `${bounce} 2s ease-in-out 1.2s infinite`,
	transition: 'color 200ms ease',
	selectors: {
		'&:hover': {
			color: vars.color.accent,
		},
	},
});

export const scrollArrow = style({
	width: '24px',
	height: '24px',
});
