import { globalStyle, style } from '@vanilla-extract/css';

export const root = style({
	position: 'absolute',
	inset: 0,
	display: 'grid',
	gridTemplateRows: '1fr auto',
	minHeight: 0,
});

export const canvas = style({
	width: '100%',
	height: '100%',
	minHeight: 0,
});

export const controls = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
	gap: '6px 14px',
	padding: '10px 12px',
	borderTop: '1px solid rgba(255, 255, 255, 0.08)',
	background: 'rgba(9, 14, 26, 0.55)',
});

export const field = style({
	display: 'flex',
	alignItems: 'center',
	gap: '8px',
	minWidth: 0,
	fontSize: '0.72rem',
	color: 'rgba(226, 232, 240, 0.62)',
});

export const fieldLabel = style({
	flexShrink: 0,
	minWidth: '62px',
});

export const range = style({
	flex: 1,
	minWidth: 0,
	accentColor: '#7ecbff',
});

export const fieldValue = style({
	flexShrink: 0,
	minWidth: '38px',
	textAlign: 'right',
	color: 'rgba(226, 232, 240, 0.86)',
	fontVariantNumeric: 'tabular-nums',
});

export const row = style({
	gridColumn: '1 / -1',
	display: 'flex',
	flexWrap: 'wrap',
	alignItems: 'center',
	gap: '8px',
});

export const button = style({
	padding: '4px 10px',
	border: '1px solid rgba(255, 255, 255, 0.16)',
	borderRadius: '999px',
	background: 'rgba(255, 255, 255, 0.06)',
	color: 'rgba(226, 232, 240, 0.88)',
	fontFamily: 'inherit',
	fontSize: '0.74rem',
	cursor: 'pointer',
	selectors: {
		'&:hover': {
			background: 'rgba(255, 255, 255, 0.16)',
			color: '#fff',
		},
		'&:focus-visible': {
			outline: '2px solid #7ecbff',
			outlineOffset: '2px',
		},
	},
});

export const primary = style({
	borderColor: 'rgba(126, 203, 255, 0.5)',
	background: 'rgba(126, 203, 255, 0.18)',
	color: '#e8f4ff',
});

export const check = style({
	display: 'flex',
	alignItems: 'center',
	gap: '5px',
	fontSize: '0.72rem',
	color: 'rgba(226, 232, 240, 0.72)',
	cursor: 'pointer',
});

// selectors 只能选中自身，子元素用 globalStyle
globalStyle(`${check} input`, {
	accentColor: '#7ecbff',
});

export const readout = style({
	marginLeft: 'auto',
	display: 'flex',
	gap: '10px',
	fontSize: '0.72rem',
	color: 'rgba(226, 232, 240, 0.55)',
	fontVariantNumeric: 'tabular-nums',
	whiteSpace: 'nowrap',
});

export const legend = style({
	display: 'flex',
	gap: '10px',
	fontSize: '0.7rem',
	color: 'rgba(226, 232, 240, 0.5)',
});

export const legendDot = style({
	display: 'inline-block',
	width: '8px',
	height: '8px',
	marginRight: '4px',
	borderRadius: '50%',
	verticalAlign: 'middle',
});
