import { createGlobalTheme, globalStyle } from '@vanilla-extract/css';

export const breakpoints = {
	mobile: '667px',
	tablet: '768px',
	laptop: '1180px',
} as const;

export const vars = createGlobalTheme(':root', {
	color: {
		accent: '#2196f3',
		accentStrong: '#3367d6',
		accentSoft: 'rgba(33, 150, 243, 0.12)',
		background: '#f4f7fb',
		backgroundElevated: '#edf3fb',
		surface: 'rgba(255, 255, 255, 0.82)',
		surfaceStrong: '#ffffff',
		surfaceMuted: 'rgba(255, 255, 255, 0.62)',
		textStrong: 'rgba(18, 25, 38, 0.96)',
		text: 'rgba(18, 25, 38, 0.82)',
		textMuted: 'rgba(18, 25, 38, 0.58)',
		textMeta: 'rgba(18, 25, 38, 0.32)',
		border: 'rgba(18, 25, 38, 0.10)',
		borderStrong: 'rgba(18, 25, 38, 0.16)',
		codeBackground: 'rgba(33, 150, 243, 0.10)',
		codeText: 'rgba(13, 35, 64, 0.92)',
	},
	space: {
		xs: '0.25rem',
		sm: '0.5rem',
		md: '0.75rem',
		lg: '1rem',
		xl: '1.5rem',
		xxl: '2rem',
		xxxl: '3rem',
		xxxxl: '4rem',
		section: '6rem',
	},
	radius: {
		sm: '10px',
		md: '16px',
		lg: '24px',
		xl: '32px',
		pill: '999px',
	},
	shadow: {
		head: '0 16px 40px rgba(15, 23, 42, 0.08)',
		card: '0 22px 48px rgba(15, 23, 42, 0.10)',
		focus: '0 0 0 4px rgba(33, 150, 243, 0.18)',
	},
	layout: {
		content: '46rem',
		listing: '60rem',
		shell: '72rem',
		header: '4.5rem',
	},
	font: {
		body: 'var(--font-atkinson), "Segoe UI", sans-serif',
		mono: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
	},
});

const darkThemeVars = {
	[vars.color.accent]: '#7ecbff',
	[vars.color.accentStrong]: '#a8ddff',
	[vars.color.accentSoft]: 'rgba(126, 203, 255, 0.16)',
	[vars.color.background]: '#0b1118',
	[vars.color.backgroundElevated]: '#111925',
	[vars.color.surface]: 'rgba(18, 27, 40, 0.86)',
	[vars.color.surfaceStrong]: '#151e2b',
	[vars.color.surfaceMuted]: 'rgba(18, 27, 40, 0.72)',
	[vars.color.textStrong]: 'rgba(241, 245, 249, 0.96)',
	[vars.color.text]: 'rgba(241, 245, 249, 0.82)',
	[vars.color.textMuted]: 'rgba(241, 245, 249, 0.62)',
	[vars.color.textMeta]: 'rgba(241, 245, 249, 0.34)',
	[vars.color.border]: 'rgba(148, 163, 184, 0.16)',
	[vars.color.borderStrong]: 'rgba(148, 163, 184, 0.24)',
	[vars.color.codeBackground]: 'rgba(126, 203, 255, 0.12)',
	[vars.color.codeText]: 'rgba(224, 242, 254, 0.96)',
	[vars.shadow.head]: '0 18px 48px rgba(2, 6, 23, 0.42)',
	[vars.shadow.card]: '0 26px 56px rgba(2, 6, 23, 0.48)',
	[vars.shadow.focus]: '0 0 0 4px rgba(126, 203, 255, 0.22)',
};

globalStyle(':root', {
	colorScheme: 'light dark',
	'@media': {
		'(prefers-color-scheme: dark)': {
			vars: darkThemeVars,
		},
	},
});

globalStyle('*', {
	boxSizing: 'border-box',
});

globalStyle('html', {
	backgroundColor: vars.color.background,
	scrollBehavior: 'smooth',
	// @ts-expect-error — scrollbar-gutter not yet in TS CSS types
	scrollbarGutter: 'stable',
	scrollbarWidth: 'thin',
	scrollbarColor: `${vars.color.borderStrong} transparent`,
});

globalStyle('body', {
	margin: 0,
	minHeight: '100vh',
	fontFamily: vars.font.body,
	fontSize: '18px',
	lineHeight: 1.8,
	color: vars.color.text,
	textAlign: 'left',
	textRendering: 'optimizeLegibility',
	wordBreak: 'normal',
	overflowWrap: 'break-word',
	background:
		'radial-gradient(circle at top left, rgba(33, 150, 243, 0.18), transparent 24rem), radial-gradient(circle at top right, rgba(70, 136, 241, 0.10), transparent 18rem), linear-gradient(180deg, #fbfdff 0%, #f4f7fb 42%, #eef3f9 100%)',
	'@media': {
		'(prefers-color-scheme: dark)': {
			background:
				'radial-gradient(circle at top left, rgba(126, 203, 255, 0.12), transparent 22rem), radial-gradient(circle at top right, rgba(51, 103, 214, 0.12), transparent 18rem), linear-gradient(180deg, #0b1118 0%, #0f1722 46%, #111b29 100%)',
		},
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			fontSize: '17px',
		},
	},
});


globalStyle('h1, h2, h3, h4, h5, h6', {
	margin: `0 0 ${vars.space.md}`,
	color: vars.color.textStrong,
	lineHeight: 1.1,
	letterSpacing: '-0.025em',
});

globalStyle('h1', {
	fontSize: 'clamp(2.75rem, 6vw, 4.5rem)',
});

globalStyle('h2', {
	fontSize: 'clamp(2rem, 4vw, 3.1rem)',
});

globalStyle('h3', {
	fontSize: 'clamp(1.45rem, 3vw, 2rem)',
});

globalStyle('h4', {
	fontSize: '1.25rem',
});

globalStyle('h5', {
	fontSize: '1.1rem',
});

globalStyle('strong, b', {
	fontWeight: 700,
	color: vars.color.textStrong,
});

globalStyle('a', {
	color: vars.color.accentStrong,
	textDecoration: 'none',
	textUnderlineOffset: '0.18em',
	transition: 'color 160ms ease, border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
});

globalStyle('a:hover', {
	color: vars.color.accent,
});

globalStyle('p, ul, ol, blockquote, pre, table', {
	margin: `0 0 ${vars.space.xl}`,
});

globalStyle('ul, ol', {
	paddingInlineStart: vars.space.xl,
});

globalStyle('textarea, input, button', {
	font: 'inherit',
});

globalStyle('table', {
	width: '100%',
	borderCollapse: 'collapse',
	fontSize: '0.95rem',
});

globalStyle('th, td', {
	padding: `${vars.space.sm} ${vars.space.md}`,
	borderBottom: `1px solid ${vars.color.border}`,
	textAlign: 'left',
});

globalStyle('img', {
	maxWidth: '100%',
	height: 'auto',
	display: 'block',
	borderRadius: vars.radius.md,
});

globalStyle('code', {
	padding: '0.15em 0.4em',
	borderRadius: vars.radius.sm,
	backgroundColor: vars.color.codeBackground,
	color: vars.color.codeText,
	fontFamily: vars.font.mono,
	fontSize: '0.875em',
});

globalStyle('pre', {
	padding: vars.space.xl,
	borderRadius: vars.radius.lg,
	overflowX: 'auto',
	backgroundColor: 'rgba(15, 23, 42, 0.94)',
	boxShadow: vars.shadow.card,
	'@media': {
		'(prefers-color-scheme: dark)': {
			backgroundColor: 'rgba(2, 6, 23, 0.92)',
		},
	},
});

globalStyle('pre > code', {
	all: 'unset',
	fontFamily: vars.font.mono,
	color: '#e2e8f0',
});

globalStyle('blockquote', {
	margin: `0 0 ${vars.space.xxl}`,
	padding: `${vars.space.sm} ${vars.space.lg}`,
	borderLeft: `4px solid ${vars.color.accent}`,
	borderRadius: `0 ${vars.radius.lg} ${vars.radius.lg} 0`,
	backgroundColor: vars.color.surfaceMuted,
	color: vars.color.text,
});

globalStyle('hr', {
	border: 'none',
	borderTop: `1px solid ${vars.color.border}`,
	margin: `${vars.space.xxl} 0`,
});

globalStyle('::selection', {
	backgroundColor: vars.color.accentSoft,
	color: vars.color.textStrong,
});

/* ── 滚动条 (Webkit) ── */
globalStyle('::-webkit-scrollbar', {
	width: '6px',
	height: '6px',
});

globalStyle('::-webkit-scrollbar-track', {
	background: 'transparent',
});

globalStyle('::-webkit-scrollbar-thumb', {
	background: vars.color.borderStrong,
	borderRadius: vars.radius.pill,
});

globalStyle('::-webkit-scrollbar-thumb:hover', {
	background: vars.color.textMeta,
});

globalStyle('.sr-only', {
	border: 0,
	padding: 0,
	margin: 0,
	position: 'absolute',
	height: '1px',
	width: '1px',
	overflow: 'hidden',
	clip: 'rect(1px, 1px, 1px, 1px)',
	clipPath: 'inset(50%)',
	whiteSpace: 'nowrap',
});