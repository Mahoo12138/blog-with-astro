import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

const borderCardSmall = '12px';
const borderBar = '8px';

export const infoWidget = style({});

export const infoCard = style({
	display: 'flex',
	flexDirection: 'column',
	gap: '0.75rem',
	padding: '0.85rem 1rem',
	borderRadius: borderCardSmall,
	background: vars.color.surface,
	color: vars.color.text,
});

export const infoHead = style({
	display: 'flex',
	alignItems: 'center',
	gap: '0.75rem',
});

export const infoIcon = style({
	width: '40px',
	height: '40px',
	flexShrink: 0,
	objectFit: 'contain',
	borderRadius: '8px',
});

export const infoFallback = style({
	display: 'grid',
	placeItems: 'center',
	width: '40px',
	height: '40px',
	flexShrink: 0,
	borderRadius: '8px',
	background: vars.color.backgroundElevated,
	color: vars.color.accentStrong,
	fontSize: '1.1rem',
	fontWeight: 800,
});

export const infoMeta = style({
	display: 'flex',
	flexDirection: 'column',
	gap: '2px',
	minWidth: 0,
});

export const infoTitle = style({
	margin: 0,
	fontSize: '0.95rem',
	fontWeight: 600,
	lineHeight: 1.3,
	color: vars.color.textStrong,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

export const infoCount = style({
	fontSize: '0.78rem',
	color: vars.color.textMeta,
	fontFamily: vars.font.mono,
});

export const infoDescription = style({
	margin: 0,
	fontSize: '0.82rem',
	lineHeight: 1.55,
	color: vars.color.textMuted,
});

export const postsWidget = style({});

export const postList = style({
	listStyle: 'none',
	margin: 0,
	padding: 0,
	counterReset: 'column-posts',
});

export const postItem = style({
	margin: 0,
});

export const postLink = style({
	display: 'flex',
	alignItems: 'flex-start',
	gap: '0.55rem',
	padding: '0.45rem 0.75rem',
	borderRadius: borderBar,
	color: vars.color.text,
	fontSize: '0.85rem',
	lineHeight: 1.4,
	selectors: {
		'& + &': {
			marginTop: '2px',
		},
		'&:hover': {
			background: vars.color.surfaceStrong,
			color: vars.color.textStrong,
		},
	},
});

export const postLinkActive = style({
	background: vars.color.accentSoft,
	color: vars.color.accentStrong,
	selectors: {
		'&:hover': {
			background: vars.color.accentSoft,
			color: vars.color.accentStrong,
		},
	},
});

export const postIndex = style({
	flexShrink: 0,
	fontFamily: vars.font.mono,
	fontSize: '0.75rem',
	fontWeight: 700,
	color: vars.color.textMeta,
	paddingTop: '2px',
	selectors: {
		[`${postLinkActive} &`]: {
			color: vars.color.accentStrong,
		},
	},
});

export const postTitle = style({
	minWidth: 0,
	flex: 1,
	display: '-webkit-box',
	WebkitBoxOrient: 'vertical',
	WebkitLineClamp: 2,
	overflow: 'hidden',
});
