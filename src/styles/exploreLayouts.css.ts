import { style } from '@vanilla-extract/css';
import { breakpoints, vars } from './theme.css';

export const kicker = style({
	margin: `0 0 ${vars.space.sm}`,
	fontSize: '12px',
	fontWeight: 800,
	lineHeight: 1,
	letterSpacing: 0,
	textTransform: 'uppercase',
	color: vars.color.accent,
});

export const galleryFrame = style({
	display: 'grid',
	gap: vars.space.lg,
	margin: vars.space.lg,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			margin: `${vars.space.lg} 0`,
		},
	},
});

export const galleryHeader = style({
	display: 'grid',
	gridTemplateColumns: 'minmax(0, 1fr) auto',
	alignItems: 'end',
	gap: vars.space.lg,
	padding: vars.space.xl,
	borderRadius: '8px',
	background: vars.color.surfaceStrong,
	boxShadow: '0 1px 2px rgba(0, 0, 0, 0.10)',
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			gridTemplateColumns: '1fr',
		},
	},
});

export const galleryTitle = style({
	margin: 0,
	fontSize: '28px',
	fontWeight: 800,
	lineHeight: 1.2,
	letterSpacing: 0,
	color: vars.color.textStrong,
});

export const galleryDescription = style({
	maxWidth: '38rem',
	margin: `${vars.space.sm} 0 0`,
	fontSize: '15px',
	lineHeight: 1.7,
	color: vars.color.text,
});

export const galleryMeta = style({
	display: 'grid',
	justifyItems: 'end',
	gap: '2px',
	color: vars.color.textMuted,
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			justifyItems: 'start',
		},
	},
});

export const galleryMetaCount = style({
	fontSize: '28px',
	fontWeight: 800,
	lineHeight: 1,
	color: vars.color.textStrong,
});

export const galleryMetaLabel = style({
	fontSize: '12px',
	lineHeight: 1,
	textTransform: 'uppercase',
	letterSpacing: 0,
});

export const galleryGrid = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
	gridAutoRows: '210px',
	gap: vars.space.md,
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
			gridAutoRows: '180px',
		},
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			gridTemplateColumns: '1fr',
			gridAutoRows: '220px',
		},
	},
});

export const galleryTile = style({
	position: 'relative',
	minWidth: 0,
	minHeight: 0,
	margin: 0,
	overflow: 'hidden',
	borderRadius: '8px',
	background: vars.color.surfaceStrong,
	boxShadow: '0 1px 2px rgba(0, 0, 0, 0.10)',
});

export const galleryTileFeature = style({
	gridColumn: 'span 2',
	gridRow: 'span 2',
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			gridColumn: 'span 1',
			gridRow: 'span 1',
		},
	},
});

export const galleryImage = style({
	display: 'block',
	width: '100%',
	height: '100%',
	objectFit: 'cover',
	borderRadius: 0,
});

export const galleryCaption = style({
	position: 'absolute',
	left: 0,
	right: 0,
	bottom: 0,
	display: 'flex',
	alignItems: 'end',
	justifyContent: 'space-between',
	gap: vars.space.md,
	padding: `${vars.space.xl} ${vars.space.lg} ${vars.space.lg}`,
	background: 'linear-gradient(180deg, rgba(10, 15, 24, 0), rgba(10, 15, 24, 0.72))',
	color: '#fff',
});

export const galleryCaptionTitle = style({
	fontSize: '15px',
	lineHeight: 1.2,
	color: '#fff',
});

export const galleryCaptionMeta = style({
	fontSize: '12px',
	lineHeight: 1.2,
	color: 'rgba(255, 255, 255, 0.76)',
});

export const loveScreen = style({
	width: '100%',
	minHeight: '100vh',
	display: 'grid',
	placeItems: 'center',
	padding: 'clamp(24px, 6vw, 80px)',
	background: 'linear-gradient(135deg, #fff8fb 0%, #f7fbff 52%, #eef9f3 100%)',
	'@media': {
		'(prefers-color-scheme: dark)': {
			background: 'linear-gradient(135deg, #17131b 0%, #0c1420 54%, #0d1a18 100%)',
		},
	},
});

export const loveInner = style({
	width: 'min(100%, 960px)',
	display: 'grid',
	gridTemplateColumns: 'minmax(0, 1fr) 260px',
	alignItems: 'center',
	gap: vars.space.xxxl,
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			gridTemplateColumns: '1fr',
			justifyItems: 'center',
			textAlign: 'center',
		},
	},
});

export const loveCopy = style({
	minWidth: 0,
});

export const loveTitle = style({
	maxWidth: '12em',
	margin: 0,
	fontSize: 'clamp(42px, 8vw, 88px)',
	fontWeight: 900,
	lineHeight: 1,
	letterSpacing: 0,
	color: vars.color.textStrong,
});

export const loveDescription = style({
	maxWidth: '34rem',
	margin: `${vars.space.lg} 0 0`,
	fontSize: '18px',
	lineHeight: 1.7,
	color: vars.color.text,
});

export const loveStats = style({
	display: 'flex',
	gap: vars.space.md,
	marginTop: vars.space.xxl,
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			justifyContent: 'center',
		},
	},
});

export const loveStat = style({
	display: 'grid',
	minWidth: '112px',
	gap: '2px',
	padding: `${vars.space.md} ${vars.space.lg}`,
	border: `1px solid ${vars.color.border}`,
	borderRadius: '8px',
	background: vars.color.surface,
});

export const loveStatValue = style({
	fontSize: '24px',
	lineHeight: 1,
	color: vars.color.textStrong,
});

export const loveStatLabel = style({
	fontSize: '12px',
	lineHeight: 1.2,
	textTransform: 'uppercase',
	letterSpacing: 0,
	color: vars.color.textMuted,
});

export const loveMark = style({
	display: 'block',
	width: 'min(56vw, 260px)',
	aspectRatio: '1',
	height: 'auto',
	borderRadius: '28px',
	boxShadow: vars.shadow.card,
});