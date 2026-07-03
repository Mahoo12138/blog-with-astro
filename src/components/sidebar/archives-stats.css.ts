import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

const borderCardSmall = '12px';
const borderBar = '8px';

export const statsWidget = style({});

export const statsGrid = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
	gap: '0.5rem',
	padding: '0 0.25rem',
});

export const statCard = style({
	display: 'flex',
	flexDirection: 'column',
	gap: '4px',
	padding: '0.65rem 0.75rem',
	borderRadius: borderCardSmall,
	background: vars.color.surface,
	color: vars.color.text,
});

export const statValue = style({
	fontSize: '1.35rem',
	fontWeight: 800,
	lineHeight: 1,
	color: vars.color.accentStrong,
	fontFamily: vars.font.mono,
	letterSpacing: '-0.02em',
});

export const statLabel = style({
	fontSize: '0.72rem',
	color: vars.color.textMeta,
	fontWeight: 500,
});

export const sectionTitle = style({
	fontSize: '0.75rem',
	color: vars.color.textMeta,
	fontWeight: 600,
	margin: '1rem 0.25rem 0.35rem',
	textTransform: 'uppercase',
	letterSpacing: '0.04em',
});

export const rankList = style({
	listStyle: 'none',
	margin: 0,
	padding: '0 0.25rem',
});

export const rankItem = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	padding: '0.35rem 0.5rem',
	borderRadius: borderBar,
	fontSize: '0.8rem',
	color: vars.color.text,
	selectors: {
		'& + &': {
			marginTop: '2px',
		},
	},
});

export const rankLabel = style({
	display: 'inline-flex',
	alignItems: 'center',
	gap: '0.4rem',
	minWidth: 0,
	flex: 1,
});

export const rankDot = style({
	width: '6px',
	height: '6px',
	borderRadius: '50%',
	background: vars.color.accent,
	flexShrink: 0,
});

export const rankName = style({
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

export const rankCount = style({
	fontFamily: vars.font.mono,
	fontSize: '0.78rem',
	color: vars.color.textMeta,
	flexShrink: 0,
	marginLeft: '0.5rem',
});
