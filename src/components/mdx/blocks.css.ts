import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

const tonePalette = {
	info: {
		accent: vars.color.accentStrong,
		soft: vars.color.accentSoft,
		text: vars.color.textStrong,
	},
	success: {
		accent: '#2f855a',
		soft: 'rgba(47, 133, 90, 0.14)',
		text: vars.color.textStrong,
	},
	warning: {
		accent: '#b7791f',
		soft: 'rgba(183, 121, 31, 0.14)',
		text: vars.color.textStrong,
	},
	danger: {
		accent: '#c53030',
		soft: 'rgba(197, 48, 48, 0.14)',
		text: vars.color.textStrong,
	},
} as const;

export const note = style({
	margin: `${vars.space.xl} 0`,
	padding: `${vars.space.lg} ${vars.space.xl}`,
	border: '1px solid transparent',
	borderLeftWidth: '4px',
	borderRadius: vars.radius.lg,
	boxShadow: vars.shadow.card,
});

export const noteTone = styleVariants(
	tonePalette,
	({ accent, soft, text }) => ({
		borderColor: soft,
		borderLeftColor: accent,
		background: `linear-gradient(135deg, ${soft}, ${vars.color.surfaceStrong})`,
		color: text,
	}),
);

export const noteTitle = style({
	display: 'block',
	marginBottom: vars.space.sm,
	fontSize: '0.9rem',
	fontWeight: 700,
	letterSpacing: '0.06em',
	textTransform: 'uppercase',
	color: vars.color.textMeta,
});

export const noteBody = style({
	color: vars.color.text,
});

export const fold = style({
	margin: `${vars.space.xl} 0`,
	border: `1px solid ${vars.color.border}`,
	borderRadius: vars.radius.lg,
	background: vars.color.surface,
	boxShadow: vars.shadow.card,
	overflow: 'hidden',
});

export const foldTone = styleVariants(
	tonePalette,
	({ accent, soft }) => ({
		borderColor: soft,
		background: `linear-gradient(180deg, ${soft}, ${vars.color.surfaceStrong})`,
		boxShadow: `0 0 0 1px ${soft} inset, ${vars.shadow.card}`,
	}),
);

export const foldSummary = style({
	position: 'relative',
	padding: `${vars.space.lg} ${vars.space.xl} ${vars.space.lg} calc(${vars.space.xl} + ${vars.space.md})`,
	fontWeight: 700,
	color: vars.color.textStrong,
	cursor: 'pointer',
	listStyle: 'none',
	borderBottom: '1px solid transparent',
	selectors: {
		'&::-webkit-details-marker': {
			display: 'none',
		},
		'&::before': {
			content: '',
			position: 'absolute',
			left: vars.space.lg,
			top: '50%',
			width: '0.45rem',
			height: '0.45rem',
			borderRadius: vars.radius.pill,
			transform: 'translateY(-50%)',
		},
		'&:focus-visible': {
			outline: 'none',
			boxShadow: vars.shadow.focus,
		},
	},
});

export const foldSummaryTone = styleVariants(
	tonePalette,
	({ accent }) => ({
		selectors: {
			'&::before': {
				background: accent,
			},
		},
	}),
);

export const foldBody = style({
	padding: `${vars.space.lg} ${vars.space.xl} ${vars.space.xl}`,
	color: vars.color.text,
});

export const label = style({
	display: 'inline-flex',
	alignItems: 'center',
	gap: vars.space.xs,
	padding: `${vars.space.xs} ${vars.space.sm}`,
	borderRadius: vars.radius.pill,
	fontSize: '0.85rem',
	fontWeight: 700,
	letterSpacing: '0.04em',
	textTransform: 'uppercase',
	verticalAlign: 'middle',
});

export const labelTone = styleVariants(
	tonePalette,
	({ accent, soft }) => ({
		background: soft,
		color: accent,
		boxShadow: `inset 0 0 0 1px ${soft}`,
	}),
);

globalStyle(`${noteBody} > :last-child`, {
	marginBottom: 0,
});

globalStyle(`${foldBody} > :last-child`, {
	marginBottom: 0,
});

globalStyle(`${foldTone.info}[open] ${foldSummary}`, {
	borderBottomColor: tonePalette.info.soft,
});

globalStyle(`${foldTone.success}[open] ${foldSummary}`, {
	borderBottomColor: tonePalette.success.soft,
});

globalStyle(`${foldTone.warning}[open] ${foldSummary}`, {
	borderBottomColor: tonePalette.warning.soft,
});

globalStyle(`${foldTone.danger}[open] ${foldSummary}`, {
	borderBottomColor: tonePalette.danger.soft,
});