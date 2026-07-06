import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

const borderCardSmall = '12px';
const borderBar = '8px';

export const widget = style({});

export const card = style({
	display: 'flex',
	flexDirection: 'column',
	gap: '0',
	margin: '0 4px',
	padding: '6px 12px 10px',
	borderRadius: borderCardSmall,
	background: vars.color.surface,
	color: vars.color.text,
});

export const row = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: '8px',
	padding: '4px 0',
	fontSize: '13px',
	lineHeight: 1.5,
});

export const rowLabel = style({
	flexShrink: 0,
	color: vars.color.textMuted,
});

export const rowValue = style({
	display: 'inline-flex',
	alignItems: 'center',
	gap: '6px',
	minWidth: 0,
	color: vars.color.textStrong,
	fontWeight: 600,
});

export const platformIcon = style({
	width: '16px',
	height: '16px',
	borderRadius: '4px',
	objectFit: 'cover',
	flexShrink: 0,
});

export const folderIcon = style({
	width: '14px',
	height: '14px',
	color: vars.color.accentStrong,
	flexShrink: 0,
});

export const toggleRow = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: '4px',
	margin: '2px 0 0',
	padding: '4px 0',
	fontSize: '12px',
	color: vars.color.textMeta,
	background: 'transparent',
	border: 0,
	borderTop: `1px dashed ${vars.color.border}`,
	cursor: 'pointer',
	width: '100%',
	transition: 'color 160ms ease',
	selectors: {
		'&:hover': {
			color: vars.color.accentStrong,
		},
	},
});

export const toggleIcon = style({
	width: '12px',
	height: '12px',
	transition: 'transform 200ms ease',
	selectors: {
		[`${widget}.collapse &`]: {
			transform: 'rotate(180deg)',
		},
	},
});

export const detailPanel = style({
	display: 'grid',
	gridTemplateRows: '1fr',
	overflow: 'hidden',
	transition: 'grid-template-rows 0.22s ease',
	selectors: {
		[`${widget}.collapse &`]: {
			gridTemplateRows: '0fr',
		},
	},
});

export const detailInner = style({
	minHeight: 0,
});

export const versionGrid = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
	rowGap: '8px',
	columnGap: '6px',
	paddingTop: '8px',
});

export const versionCard = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	gap: '2px',
	minWidth: 0,
	padding: '8px 6px',
	borderRadius: borderBar,
	background: vars.color.surfaceMuted,
	color: vars.color.text,
});

export const versionLabel = style({
	fontSize: '11px',
	color: vars.color.textMeta,
	fontWeight: 500,
	letterSpacing: '0.02em',
});

export const versionValue = style({
	fontFamily: vars.font.mono,
	fontSize: '12px',
	fontWeight: 700,
	color: vars.color.textStrong,
	letterSpacing: '-0.01em',
	textAlign: 'center',
	wordBreak: 'break-all',
});
