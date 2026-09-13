import { style } from '@vanilla-extract/css';

/** 铺满舞台：画布吃满剩余空间，工具条固定在底部 */
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
	cursor: 'crosshair',
});

export const toolbar = style({
	display: 'flex',
	flexWrap: 'wrap',
	alignItems: 'center',
	gap: '8px',
	padding: '8px 12px',
	borderTop: '1px solid rgba(255, 255, 255, 0.08)',
	background: 'rgba(9, 14, 26, 0.55)',
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
	transition: 'background 0.15s ease, color 0.15s ease',
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

export const speed = style({
	display: 'flex',
	alignItems: 'center',
	gap: '6px',
	fontSize: '0.72rem',
	color: 'rgba(226, 232, 240, 0.6)',
});

export const range = style({
	width: '96px',
	accentColor: '#7ecbff',
});

export const speedValue = style({
	minWidth: '52px',
	fontVariantNumeric: 'tabular-nums',
});

export const readout = style({
	marginLeft: 'auto',
	fontSize: '0.72rem',
	color: 'rgba(226, 232, 240, 0.55)',
	fontVariantNumeric: 'tabular-nums',
	whiteSpace: 'nowrap',
});
