import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const widget = style({
	overflow: 'visible',
});

export const body = style({
	padding: '4px 16px 0',
	overflow: 'visible',
});

export const chart = style({
	display: 'flex',
	alignItems: 'flex-start',
	gap: '8px',
	overflow: 'visible',
});

export const weeks = style({
	display: 'flex',
	gap: '3px',
	overflow: 'visible',
});

export const week = style({
	display: 'flex',
	flexDirection: 'column',
	gap: '3px',
	overflow: 'visible',
});

export const weekdays = style({
	display: 'flex',
	flexDirection: 'column',
	gap: '3px',
	flexShrink: 0,
});

export const weekday = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '14px',
	height: '16px',
	fontSize: '11px',
	lineHeight: 1,
	color: vars.color.textMuted,
});

export const cell = style({
	position: 'relative',
	display: 'block',
	width: '16px',
	height: '16px',
	border: `1px solid ${vars.color.border}`,
	borderRadius: '4px',
	outline: 'none',
	overflow: 'visible',
	transition: 'transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease',
	selectors: {
		'&:hover': {
			zIndex: 5,
			transform: 'translateY(-1px)',
			borderColor: vars.color.accentStrong,
			boxShadow: `0 0 0 3px ${vars.color.accentSoft}`,
		},
		'&:focus-visible': {
			zIndex: 5,
			borderColor: vars.color.accentStrong,
			boxShadow: vars.shadow.focus,
		},
	},
});

export const level0 = style({
	background: 'rgba(18, 25, 38, 0.08)',
	selectors: {
		':root[data-theme="light"] &': {
			background: 'rgba(18, 25, 38, 0.08)',
		},
		':root[data-theme="dark"] &': {
			background: 'rgba(148, 163, 184, 0.16)',
		},
	},
	'@media': {
		'(prefers-color-scheme: dark)': {
			background: 'rgba(148, 163, 184, 0.16)',
		},
	},
});

export const level1 = style({
	background: '#bdeccf',
	selectors: {
		':root[data-theme="light"] &': {
			background: '#bdeccf',
		},
		':root[data-theme="dark"] &': {
			background: 'rgba(74, 222, 128, 0.32)',
		},
	},
	'@media': {
		'(prefers-color-scheme: dark)': {
			background: 'rgba(74, 222, 128, 0.32)',
		},
	},
});

export const level2 = style({
	background: '#8cdeb0',
	selectors: {
		':root[data-theme="light"] &': {
			background: '#8cdeb0',
		},
		':root[data-theme="dark"] &': {
			background: 'rgba(34, 197, 94, 0.46)',
		},
	},
	'@media': {
		'(prefers-color-scheme: dark)': {
			background: 'rgba(34, 197, 94, 0.46)',
		},
	},
});

export const level3 = style({
	background: '#4fc783',
	selectors: {
		':root[data-theme="light"] &': {
			background: '#4fc783',
		},
		':root[data-theme="dark"] &': {
			background: 'rgba(22, 163, 74, 0.64)',
		},
	},
	'@media': {
		'(prefers-color-scheme: dark)': {
			background: 'rgba(22, 163, 74, 0.64)',
		},
	},
});

export const level4 = style({
	background: '#14945f',
	selectors: {
		':root[data-theme="light"] &': {
			background: '#14945f',
		},
		':root[data-theme="dark"] &': {
			background: 'rgba(21, 128, 61, 0.82)',
		},
	},
	'@media': {
		'(prefers-color-scheme: dark)': {
			background: 'rgba(21, 128, 61, 0.82)',
		},
	},
});

export const tooltip = style({
	position: 'absolute',
	top: '50%',
	right: 'calc(100% + 10px)',
	zIndex: 20,
	display: 'block',
	width: '190px',
	padding: '12px 14px',
	border: `1px solid ${vars.color.borderStrong}`,
	borderRadius: '8px',
	background: vars.color.surfaceStrong,
	boxShadow: vars.shadow.card,
	color: vars.color.text,
	fontSize: '13px',
	lineHeight: 1.45,
	textAlign: 'left',
	whiteSpace: 'normal',
	opacity: 0,
	pointerEvents: 'none',
	transform: 'translateY(-50%) translateX(4px)',
	transition: 'opacity 140ms ease, transform 140ms ease',
});

export const tooltipDate = style({
	display: 'block',
	marginBottom: '4px',
	color: vars.color.textMuted,
	fontWeight: 700,
});

export const tooltipStats = style({
	display: 'block',
	marginBottom: '6px',
	color: vars.color.textStrong,
	fontSize: '15px',
	fontWeight: 800,
	lineHeight: 1.25,
});

export const tooltipPosts = style({
	display: 'grid',
	gap: '3px',
});

export const tooltipPost = style({
	display: 'block',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	color: vars.color.text,
});

export const summary = style({
	margin: '14px 0 0',
	fontSize: '13px',
	lineHeight: 1.55,
	color: vars.color.textMuted,
});

globalStyle(`${cell}:hover ${tooltip}, ${cell}:focus-visible ${tooltip}`, {
	opacity: 1,
	transform: 'translateY(-50%) translateX(0)',
});

globalStyle(`${tooltip}::after`, {
	content: '',
	position: 'absolute',
	top: '50%',
	right: '-5px',
	width: '10px',
	height: '10px',
	borderTop: `1px solid ${vars.color.borderStrong}`,
	borderRight: `1px solid ${vars.color.borderStrong}`,
	background: vars.color.surfaceStrong,
	transform: 'translateY(-50%) rotate(45deg)',
});