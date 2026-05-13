import { keyframes, style } from '@vanilla-extract/css';

const scaleIn = keyframes({
	from: { opacity: 0, transform: 'scale(0.985)' },
	to: { opacity: 1, transform: 'scale(1)' },
});

export const body = style({
	minHeight: '100vh',
});

export const main = style({
	width: '100%',
	minHeight: '100vh',
	animation: `${scaleIn} 380ms cubic-bezier(0.22, 1, 0.36, 1) both`,
});
