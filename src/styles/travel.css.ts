import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { breakpoints, vars } from './theme.css';

const borderCardLarge = '24px';
const borderCardSmall = '12px';
const borderBar = '8px';
const gutter = vars.space.lg;

const pulseAnim = keyframes({
	'0%': { transform: 'scale(0.6)', opacity: 0.65 },
	'100%': { transform: 'scale(1.6)', opacity: 0 },
});

const ringPulse = keyframes({
	'0%': { transform: 'scale(0.7)', opacity: 0.55 },
	'100%': { transform: 'scale(1.55)', opacity: 0 },
});

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

export const banner = style({
	minHeight: '160px',
});

export const bannerImage = style({
	objectPosition: 'center 35%',
});

export const subtitle = style({
	margin: '0.25rem 0 0',
	fontSize: '0.92rem',
	lineHeight: 1.4,
	color: '#fff',
	opacity: 0.92,
});

globalStyle(`${subtitle} strong`, {
	fontFamily: vars.font.mono,
	fontWeight: 800,
	fontSize: '1.05rem',
	margin: '0 2px',
});

export const mapSection = style({
	margin: `${gutter} 0 0`,
	padding: 0,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			margin: `${gutter} 0 0`,
		},
	},
});

export const mapCard = style({
	position: 'relative',
	overflow: 'hidden',
	borderRadius: borderCardLarge,
	background: vars.color.surfaceStrong,
	boxShadow: vars.shadow.card,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			borderRadius: 0,
		},
	},
});

export const map = style({
	width: '100%',
	height: 'clamp(360px, 60vh, 560px)',
	background: vars.color.surfaceMuted,
});

export const legend = style({
	position: 'absolute',
	left: '12px',
	top: '12px',
	zIndex: 500,
	listStyle: 'none',
	margin: 0,
	padding: '8px 12px',
	borderRadius: borderCardSmall,
	background: 'rgba(255, 255, 255, 0.88)',
	boxShadow: '0 6px 16px rgba(15, 23, 42, 0.10)',
	display: 'flex',
	flexDirection: 'column',
	gap: '4px',
	fontSize: '12px',
	color: vars.color.text,
	selectors: {
		':root[data-theme="dark"] &': {
			background: 'rgba(20, 27, 41, 0.78)',
			color: vars.color.text,
		},
	},
});

export const legendItem = style({
	display: 'flex',
	alignItems: 'center',
	gap: '0.45rem',
});

export const legendDotTravel = style({
	width: '10px',
	height: '10px',
	borderRadius: '50%',
	background: vars.color.accent,
	border: '2px solid #fff',
	boxShadow: '0 0 0 1px rgba(15, 23, 42, 0.18)',
});

export const legendDotResidence = style({
	width: '14px',
	height: '14px',
	borderRadius: '50%',
	background: '#FA6400',
	border: '2px solid #fff',
	boxShadow: '0 0 0 1px rgba(15, 23, 42, 0.18)',
});

export const attribution = style({
	position: 'absolute',
	right: '8px',
	bottom: '6px',
	zIndex: 500,
	padding: '2px 8px',
	borderRadius: '4px',
	background: 'rgba(255, 255, 255, 0.78)',
	color: '#4a5568',
	fontSize: '11px',
	lineHeight: 1.4,
	pointerEvents: 'auto',
	selectors: {
		':root[data-theme="dark"] &': {
			background: 'rgba(20, 27, 41, 0.72)',
			color: '#c8d1dc',
		},
	},
});

globalStyle(`${attribution} a`, {
	color: 'inherit',
	textDecoration: 'underline',
	textDecorationStyle: 'dotted',
});

export const sectionTitle = style({
	margin: `${vars.space.lg} 0 ${vars.space.md}`,
	fontSize: '1.05rem',
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

export const lifeline = style({
	margin: `${vars.space.xl} 0 0`,
	padding: 0,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			padding: `0 ${vars.space.md}`,
		},
	},
});

export const lifelineList = style({
	listStyle: 'none',
	margin: 0,
	padding: 0,
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space.md,
});

export const lifelineItem = style({
	position: 'relative',
	display: 'flex',
	alignItems: 'flex-start',
	gap: vars.space.md,
	padding: `${vars.space.md} ${vars.space.lg}`,
	borderRadius: borderCardLarge,
	background: vars.color.surfaceStrong,
	boxShadow: vars.shadow.card,
	transition: 'transform 200ms ease, box-shadow 200ms ease',
	selectors: {
		'&:hover': {
			transform: 'translateY(-2px)',
			boxShadow: vars.shadow.head,
		},
	},
});

export const lifelineGlyph = style({
	width: '40px',
	height: '40px',
	flexShrink: 0,
	display: 'grid',
	placeItems: 'center',
	borderRadius: '50%',
	background: 'var(--residence-accent, #FA6400)',
	color: '#fff',
	fontWeight: 800,
	fontSize: '1rem',
	letterSpacing: 0,
	boxShadow: '0 4px 10px rgba(15, 23, 42, 0.18)',
});

export const lifelineBody = style({
	flex: 1,
	minWidth: 0,
	display: 'flex',
	flexDirection: 'column',
	gap: '0.3rem',
});

export const lifelineHead = style({
	display: 'flex',
	flexWrap: 'wrap',
	alignItems: 'baseline',
	gap: '0.5rem',
});

export const lifelineKind = style({
	padding: '0.15rem 0.45rem',
	borderRadius: '6px',
	background: 'var(--residence-accent, #FA6400)',
	color: '#fff',
	fontSize: '0.72rem',
	fontWeight: 700,
	letterSpacing: 0,
});

export const lifelineCity = style({
	fontSize: '1.05rem',
	fontWeight: 700,
	color: vars.color.textStrong,
});

export const lifelineProvince = style({
	fontSize: '0.78rem',
	color: vars.color.textMeta,
	padding: '0.1rem 0.4rem',
	borderRadius: '6px',
	background: vars.color.backgroundElevated,
	fontWeight: 500,
});

export const lifelineRange = style({
	display: 'flex',
	flexWrap: 'wrap',
	alignItems: 'baseline',
	gap: '0.4rem',
	fontFamily: vars.font.mono,
	fontSize: '0.78rem',
	color: vars.color.textMuted,
});

export const lifelineRangeSep = style({
	opacity: 0.55,
});

export const lifelinePresent = style({
	color: vars.color.accentStrong,
	fontWeight: 700,
});

export const lifelineDuration = style({
	marginLeft: '0.25rem',
	padding: '0.1rem 0.4rem',
	borderRadius: '4px',
	background: vars.color.accentSoft,
	color: vars.color.accentStrong,
	fontFamily: vars.font.mono,
	fontSize: '0.72rem',
	fontWeight: 700,
});

export const lifelineNote = style({
	margin: 0,
	fontSize: '0.84rem',
	lineHeight: 1.55,
	color: vars.color.textMuted,
});

export const lifelineConnector = style({
	position: 'absolute',
	left: `calc(${vars.space.lg} + 20px - 1px)`,
	top: '100%',
	width: '2px',
	height: vars.space.md,
	background: `repeating-linear-gradient(to bottom, var(--residence-accent, #FA6400) 0 4px, transparent 4px 8px)`,
	opacity: 0.55,
});

export const timeline = style({
	margin: `${vars.space.xl} 0 ${vars.space.xxl}`,
	padding: 0,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			padding: `0 ${vars.space.md} ${vars.space.xl}`,
		},
	},
});

export const timelineList = style({
	listStyle: 'none',
	margin: 0,
	padding: 0,
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
	gap: vars.space.md,
});

export const timelineItem = style({
	display: 'flex',
	flexDirection: 'column',
	gap: '0.4rem',
	padding: `${vars.space.md} ${vars.space.lg}`,
	borderRadius: borderCardSmall,
	background: vars.color.surface,
	color: vars.color.text,
	transition: 'transform 180ms ease, box-shadow 180ms ease',
	selectors: {
		'&:hover': {
			transform: 'translateY(-2px)',
			boxShadow: vars.shadow.card,
		},
	},
});

export const timelineDate = style({
	fontFamily: vars.font.mono,
	fontSize: '0.78rem',
	color: vars.color.accentStrong,
	fontWeight: 700,
});

export const timelineBody = style({
	display: 'flex',
	flexDirection: 'column',
	gap: '0.35rem',
});

export const timelineHead = style({
	display: 'flex',
	flexWrap: 'wrap',
	alignItems: 'baseline',
	gap: '0.45rem',
});

export const timelineCity = style({
	fontSize: '1.05rem',
	fontWeight: 700,
	color: vars.color.textStrong,
});

export const timelineCityEn = style({
	fontSize: '0.82rem',
	color: vars.color.textMeta,
	fontFamily: vars.font.mono,
	fontWeight: 500,
});

export const timelineCountry = style({
	fontSize: '0.72rem',
	color: vars.color.textMuted,
	padding: '0.1rem 0.4rem',
	borderRadius: '6px',
	background: vars.color.backgroundElevated,
	fontWeight: 600,
});

export const timelineBadge = style({
	fontSize: '0.7rem',
	fontWeight: 800,
	color: vars.color.accentStrong,
	background: vars.color.accentSoft,
	padding: '0.1rem 0.4rem',
	borderRadius: '6px',
	fontFamily: vars.font.mono,
});

export const timelineNote = style({
	margin: 0,
	fontSize: '0.84rem',
	lineHeight: 1.55,
	color: vars.color.textMuted,
});

/* ===== Leaflet marker globals ===== */

globalStyle('.travel-marker', {
	position: 'relative',
	width: '14px',
	height: '14px',
});

globalStyle('.travel-marker .dot', {
	position: 'absolute',
	inset: 0,
	width: '14px',
	height: '14px',
	borderRadius: '50%',
	background: vars.color.accent,
	border: '2px solid #fff',
	boxShadow: '0 0 0 1px rgba(15, 23, 42, 0.18), 0 4px 10px rgba(33, 150, 243, 0.35)',
	transition: 'transform 200ms ease',
});

globalStyle('.travel-marker .pulse', {
	position: 'absolute',
	left: '50%',
	top: '50%',
	width: '36px',
	height: '36px',
	marginLeft: '-18px',
	marginTop: '-18px',
	borderRadius: '50%',
	background: 'rgba(33, 150, 243, 0.18)',
	animation: `${pulseAnim} 2s ease-out infinite`,
	pointerEvents: 'none',
});

globalStyle('.travel-marker:hover .dot', {
	transform: 'scale(1.18)',
});

globalStyle('.residence-marker', {
	position: 'relative',
	width: '34px',
	height: '34px',
});

globalStyle('.residence-marker .residence-dot', {
	position: 'absolute',
	inset: 0,
	display: 'grid',
	placeItems: 'center',
	width: '34px',
	height: '34px',
	borderRadius: '50%',
	background: 'var(--accent, #FA6400)',
	color: '#fff',
	border: '3px solid #fff',
	fontSize: '14px',
	fontWeight: 800,
	letterSpacing: 0,
	boxShadow: '0 0 0 1px rgba(15, 23, 42, 0.20), 0 8px 16px rgba(250, 100, 0, 0.35)',
	transition: 'transform 200ms ease',
});

globalStyle('.residence-marker .residence-ring', {
	position: 'absolute',
	left: '50%',
	top: '50%',
	width: '54px',
	height: '54px',
	marginLeft: '-27px',
	marginTop: '-27px',
	borderRadius: '50%',
	background: 'var(--ring, rgba(250, 100, 0, 0.28))',
	opacity: 0.32,
	animation: `${ringPulse} 2.4s ease-out infinite`,
	pointerEvents: 'none',
});

globalStyle('.residence-marker:hover .residence-dot', {
	transform: 'scale(1.1)',
});

globalStyle('.leaflet-container', {
	fontFamily: vars.font.body,
	fontSize: '13px',
	background: vars.color.surfaceMuted,
});

globalStyle('.leaflet-popup-content-wrapper', {
	borderRadius: borderCardSmall,
	boxShadow: '0 14px 28px rgba(15, 23, 42, 0.18)',
	padding: 0,
	overflow: 'hidden',
	background: vars.color.surfaceStrong,
});

globalStyle('.leaflet-popup-content', {
	margin: 0,
	padding: '0.7rem 0.9rem',
	color: vars.color.text,
	lineHeight: 1.45,
	minWidth: '200px',
});

globalStyle('.leaflet-popup-tip', {
	background: vars.color.surfaceStrong,
});

globalStyle('.leaflet-popup-content .pop-head', {
	display: 'flex',
	flexWrap: 'wrap',
	alignItems: 'baseline',
	gap: '0.4rem',
	marginBottom: '0.35rem',
});

globalStyle('.leaflet-popup-content .pop-tag', {
	padding: '0.1rem 0.4rem',
	borderRadius: '6px',
	fontSize: '0.7rem',
	fontWeight: 700,
});

globalStyle('.leaflet-popup-content .pop-city', {
	fontSize: '1rem',
	fontWeight: 700,
	color: vars.color.textStrong,
});

globalStyle('.leaflet-popup-content .pop-en', {
	fontSize: '0.78rem',
	color: vars.color.textMeta,
	fontFamily: vars.font.mono,
});

globalStyle('.leaflet-popup-content .pop-row', {
	display: 'flex',
	alignItems: 'center',
	gap: '0.4rem',
	fontSize: '0.8rem',
	color: vars.color.textMuted,
	marginTop: '2px',
});

globalStyle('.leaflet-popup-content .pop-row strong', {
	fontFamily: vars.font.mono,
	color: vars.color.accentStrong,
	fontWeight: 700,
});

globalStyle('.leaflet-popup-content .pop-note', {
	marginTop: '0.45rem',
	fontSize: '0.82rem',
	lineHeight: 1.45,
	color: vars.color.text,
});

globalStyle('.leaflet-control-zoom a', {
	background: vars.color.surfaceStrong,
	color: vars.color.text,
	border: `1px solid ${vars.color.border}`,
});

globalStyle('.leaflet-control-zoom a:hover', {
	background: vars.color.backgroundElevated,
	color: vars.color.accentStrong,
});

globalStyle('.leaflet-bar', {
	borderRadius: '8px',
	overflow: 'hidden',
	boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)',
});

globalStyle('.leaflet-control-attribution', {
	display: 'none',
});
