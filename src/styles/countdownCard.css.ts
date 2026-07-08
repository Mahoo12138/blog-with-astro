import { style, keyframes, globalStyle } from '@vanilla-extract/css';
import { vars, breakpoints } from './theme.css';

/**
 * CountdownCard 样式 — Editorial 票根风
 *
 * 设计原则：
 * 1. 主题色全部通过 CSS variable 注入（--theme-*）
 * 2. 静态布局由 vanilla-extract 管理，主题色由 inline style 注入
 * 3. 切换节日时只需更新 CSS variable，背景/文字色自动 transition
 * 4. 整卡片可点击（cursor: pointer）
 * 5. 切换中（phase !== 'entered'）禁用 pointer events
 */

/* ─────────── 动画 ─────────── */
const sealSlam = keyframes({
	'0%': { transform: 'rotate(var(--theme-decor-rotate)) scale(1.8)', opacity: 0 },
	'60%': { transform: 'rotate(var(--theme-decor-rotate)) scale(0.92)', opacity: 1 },
	'100%': { transform: 'rotate(var(--theme-decor-rotate)) scale(1)', opacity: 1 },
});

const shimmer = keyframes({
	'0%': { backgroundPosition: '-200% 0' },
	'100%': { backgroundPosition: '200% 0' },
});

const fadeUp = keyframes({
	'0%': { opacity: 0, transform: 'translateY(8px)' },
	'100%': { opacity: 1, transform: 'translateY(0)' },
});

/* ─────────── 主卡片 ─────────── */
export const card = style({
	position: 'relative',
	width: '100%',
	height: '100%',
	padding: `${vars.space.lg} ${vars.space.xl}`,
	borderRadius: vars.radius.lg,
	background: 'var(--theme-bg)',
	backgroundImage: `
		radial-gradient(circle at 12% 20%, color-mix(in srgb, var(--theme-primary) 6%, transparent) 0%, transparent 40%),
		radial-gradient(circle at 90% 80%, color-mix(in srgb, var(--theme-accent) 8%, transparent) 0%, transparent 35%),
		repeating-linear-gradient(45deg, transparent 0, transparent 2px, color-mix(in srgb, var(--theme-ink) 2%, transparent) 2px, color-mix(in srgb, var(--theme-ink) 2%, transparent) 3px)
	`,
	border: `1px solid var(--theme-border)`,
	color: 'var(--theme-ink)',
	display: 'grid',
	gridTemplateRows: 'auto auto 1fr auto',
	gap: vars.space.sm,
	overflow: 'hidden',
	cursor: 'pointer',
	fontFamily: 'var(--theme-font)',
	transition: 'background 0.4s ease, color 0.4s ease, border-color 0.4s ease, box-shadow 0.2s ease',
	boxShadow: '0 1px 0 color-mix(in srgb, var(--theme-primary) 6%, transparent), 0 16px 32px color-mix(in srgb, var(--theme-ink) 8%, transparent)',
	// 容器查询：让内部字号使用 cqi 单位跟随卡片宽度
	containerType: 'inline-size',
	containerName: 'countdown',
	selectors: {
		'&:hover': {
			boxShadow: `0 0 0 1px var(--theme-primary), 0 16px 32px color-mix(in srgb, var(--theme-ink) 12%, transparent)`,
		},
	},
});

/* 切换中禁用点击 */
export const cardSwitching = style({
	pointerEvents: 'none',
	cursor: 'default',
});

/* ─────────── 装饰元素（印章/月亮/星星/...） ─────────── */
export const decor = style({
	position: 'absolute',
	top: '0.6rem',
	right: '0.6rem',
	width: '2.6rem',
	height: '2.6rem',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: '50%',
	background: 'var(--theme-primary)',
	color: 'var(--theme-bg)',
	fontFamily: 'var(--theme-font)',
	fontSize: '1.25rem',
	fontWeight: 700,
	boxShadow: `
		0 0 0 2px var(--theme-bg),
		0 0 0 3px var(--theme-primary),
		0 4px 12px color-mix(in srgb, var(--theme-primary) 30%, transparent)
	`,
	transform: 'rotate(var(--theme-decor-rotate))',
	animation: `${sealSlam} 0.6s cubic-bezier(.5,1.6,.5,1) both`,
	animationDelay: '0.3s',
	pointerEvents: 'none',
	transition: 'transform 0.15s ease',
	selectors: {
		[`${card}:hover &`]: {
			transform: 'rotate(var(--theme-decor-rotate)) scale(0.92)',
		},
	},
});

export const decorGlyph = style({
	display: 'block',
	lineHeight: 1,
});

/* 非印章类型：浮动装饰 */
export const decorFloat = style({
	position: 'absolute',
	top: '0.5rem',
	right: '0.6rem',
	fontSize: '2.4rem',
	opacity: 0.6,
	filter: `drop-shadow(0 2px 4px color-mix(in srgb, var(--theme-primary) 30%, transparent))`,
	pointerEvents: 'none',
	animation: `${fadeUp} 0.4s ease both`,
});

/* ─────────── 顶部 eyebrow ─────────── */
export const header = style({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	gap: vars.space.md,
});

export const eyebrow = style({
	fontSize: '0.62rem',
	fontWeight: 600,
	letterSpacing: '0.18em',
	color: 'var(--theme-primary)',
	textTransform: 'uppercase',
	fontFamily: 'var(--theme-font)',
	display: 'inline-flex',
	alignItems: 'center',
	gap: '0.4em',
	whiteSpace: 'nowrap',
	'::before': {
		content: '""',
		width: '0.4em',
		height: '0.4em',
		background: 'var(--theme-primary)',
		display: 'inline-block',
	},
});

export const eyebrowMeta = style({
	fontSize: '0.65rem',
	fontWeight: 500,
	letterSpacing: '0.08em',
	color: 'var(--theme-ink-meta)',
	fontFamily: 'var(--theme-font)',
	whiteSpace: 'nowrap',
});

/* 顶部细分隔线 */
export const divider = style({
	border: 0,
	height: 1,
	margin: 0,
	background: 'var(--theme-divider)',
	opacity: 0.6,
});

/* ─────────── 主体 ─────────── */
export const body = style({
	display: 'grid',
	gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
	gap: vars.space.md,
	alignItems: 'center',
	minHeight: 0,
});

/* inline 模式：hero 拉宽（容纳 "距劳动节 79 天" 这类长模板） */
export const bodyInline = style({
	gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)',
});

/* 左侧：大数字块（stacked 模式） */
export const heroBlock = style({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'flex-start',
	gap: '0.1rem',
	position: 'relative',
	minWidth: 0,
	'::before': {
		content: '""',
		position: 'absolute',
		left: '-0.75rem',
		top: '10%',
		bottom: '10%',
		width: 2,
		background: 'linear-gradient(to bottom, transparent, var(--theme-primary), transparent)',
		opacity: 0.6,
	},
});

export const heroLabel = style({
	fontSize: '0.7rem',
	fontWeight: 500,
	letterSpacing: '0.16em',
	color: 'var(--theme-ink-soft)',
	margin: 0,
	textTransform: 'uppercase',
	fontFamily: 'var(--theme-font)',
	whiteSpace: 'nowrap',
});

export const heroNumber = style({
	fontSize: 'clamp(1.8rem, 11cqi, 2.8rem)',
	fontWeight: 700,
	lineHeight: 0.95,
	letterSpacing: '-0.04em',
	fontFamily: 'var(--theme-font)',
	fontVariantNumeric: 'tabular-nums',
	margin: 0,
	minWidth: 0,
	'::after': {
		content: '""',
		display: 'block',
		width: '2.4rem',
		height: 2,
		background: 'var(--theme-accent)',
		marginTop: '0.3rem',
	},
});

export const heroUnit = style({
	display: 'inline-flex',
	alignItems: 'center',
	gap: '0.4em',
	fontSize: '0.62rem',
	fontWeight: 600,
	letterSpacing: '0.18em',
	color: 'var(--theme-primary)',
	margin: 0,
	fontFamily: 'var(--theme-font)',
	textTransform: 'uppercase',
});

export const heroUnitDot = style({
	color: 'var(--theme-accent)',
	fontSize: '0.9em',
});

/* inline 模式：横排 "距{name} {n} 天" */
export const heroInline = style({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'flex-start',
	gap: vars.space.xs,
	position: 'relative',
	minWidth: 0,
	'::before': {
		content: '""',
		position: 'absolute',
		left: '-0.75rem',
		top: '10%',
		bottom: '10%',
		width: 2,
		background: 'linear-gradient(to bottom, transparent, var(--theme-primary), transparent)',
		opacity: 0.6,
	},
});

export const heroInlineLabel = style({
	fontSize: '0.78rem',
	fontWeight: 500,
	letterSpacing: '0.04em',
	color: 'var(--theme-ink-soft)',
	fontFamily: 'var(--theme-font)',
	margin: 0,
	whiteSpace: 'nowrap',
});

export const heroInlineNumber = style({
	fontSize: 'clamp(1.1rem, 12cqi, 2rem)',
	fontWeight: 700,
	lineHeight: 1.05,
	letterSpacing: '-0.02em',
	fontFamily: 'var(--theme-font)',
	fontVariantNumeric: 'tabular-nums',
	margin: 0,
	minWidth: 0,
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	maxWidth: '100%',
});

/* ─────────── 进度条列表 ─────────── */
export const list = style({
	display: 'flex',
	flexDirection: 'column',
	gap: '0.45rem',
	margin: 0,
	padding: 0,
	listStyle: 'none',
	justifyContent: 'center',
});

export const row = style({
	display: 'grid',
	gridTemplateColumns: '2.6rem 1fr',
	alignItems: 'center',
	gap: vars.space.sm,
	fontSize: '0.78rem',
});

export const label = style({
	color: 'var(--theme-ink)',
	fontSize: '0.72rem',
	fontWeight: 600,
	letterSpacing: '0.04em',
	display: 'flex',
	alignItems: 'center',
	height: '1.4rem',
	lineHeight: 1.2,
	fontFamily: 'var(--theme-font)',
});

export const track = style({
	position: 'relative',
	height: '1.4rem',
	borderRadius: 2,
	background: 'var(--theme-bg-warm)',
	overflow: 'hidden',
	border: '1px solid var(--theme-border)',
});

export const fill = style({
	position: 'absolute',
	left: 0,
	top: 0,
	bottom: 0,
	background: 'linear-gradient(90deg, var(--theme-primary-dark) 0%, var(--theme-primary) 50%, var(--theme-accent) 100%)',
	transition: 'width 0.4s cubic-bezier(.2,.8,.2,1)',
});

/* 文字层（mix-blend-mode 自动反转颜色） */
export const textLayer = style({
	position: 'absolute',
	inset: 0,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	fontVariantNumeric: 'tabular-nums',
	fontWeight: 700,
	fontSize: '0.7rem',
	letterSpacing: '0.02em',
	pointerEvents: 'none',
	fontFamily: 'var(--theme-font)',
	mixBlendMode: 'difference',
});

export const percent = style({
	transition: 'opacity 0.25s ease',
	color: 'white',
});

export const remaining = style({
	position: 'absolute',
	inset: 0,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	opacity: 0,
	transition: 'opacity 0.25s ease',
	pointerEvents: 'none',
	whiteSpace: 'nowrap',
	padding: '0 0.5rem',
	boxSizing: 'border-box',
	color: 'white',
});

/* hover 整卡片切换文字 */
globalStyle(`${card}:hover .${percent}`, { opacity: 0 });
globalStyle(`${card}:hover .${remaining}`, { opacity: 1 });

/* ─────────── 底部 footer ─────────── */
export const footer = style({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	gap: vars.space.md,
	paddingTop: vars.space.xs,
	borderTop: '1px dashed var(--theme-border)',
	fontFamily: 'var(--theme-font)',
});

export const footerDate = style({
	fontSize: '0.78rem',
	fontWeight: 700,
	color: 'var(--theme-ink)',
	fontVariantNumeric: 'tabular-nums',
	letterSpacing: '0.04em',
});

export const footerMeta = style({
	fontSize: '0.62rem',
	fontWeight: 500,
	letterSpacing: '0.18em',
	color: 'var(--theme-ink-meta)',
	textTransform: 'uppercase',
	flex: 1,
	textAlign: 'center',
});

export const footerDot = style({
	width: '0.4rem',
	height: '0.4rem',
	borderRadius: '50%',
	background: 'var(--theme-accent)',
	flexShrink: 0,
});

/* ─────────── 内容层（切换时淡入） ─────────── */
export const content = style({
	animation: `${fadeUp} 0.35s ease both`,
	display: 'contents',
});

/* ─────────── 空状态（今年所有节假日过完） ─────────── */
export const empty = style({
	position: 'absolute',
	inset: 0,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	gap: vars.space.sm,
	padding: vars.space.xl,
	background: 'var(--theme-bg)',
	animation: `${fadeUp} 0.35s ease both`,
});

export const emptyDecor = style({
	fontSize: '3.5rem',
	opacity: 0.7,
	animation: `${fadeUp} 0.5s ease both`,
	filter: `drop-shadow(0 4px 12px color-mix(in srgb, var(--theme-primary) 30%, transparent))`,
});

export const emptyTitle = style({
	fontSize: '1.1rem',
	fontWeight: 600,
	color: 'var(--theme-ink)',
	margin: 0,
	fontFamily: 'var(--theme-font)',
	textAlign: 'center',
});

export const emptySubtitle = style({
	fontSize: '0.85rem',
	color: 'var(--theme-ink-soft)',
	margin: 0,
	fontFamily: 'var(--theme-font)',
	textAlign: 'center',
});

export const emptyHint = style({
	fontSize: '0.7rem',
	color: 'var(--theme-ink-meta)',
	marginTop: vars.space.sm,
	fontFamily: 'var(--theme-font)',
	letterSpacing: '0.05em',
});

/* ─────────── Skeleton（SSR 骨架） ─────────── */
export const skeleton = style({
	position: 'relative',
	width: '100%',
	height: '100%',
	padding: `${vars.space.lg} ${vars.space.xl}`,
	borderRadius: '4px',
	background: vars.color.surfaceMuted,
	border: `1px solid ${vars.color.border}`,
	display: 'grid',
	gridTemplateRows: 'auto auto 1fr auto',
	gap: vars.space.sm,
	overflow: 'hidden',
});

const shimmerBase = {
	backgroundImage: `linear-gradient(90deg, transparent 0%, color-mix(in srgb, ${vars.color.text} 6%, transparent) 50%, transparent 100%)`,
	backgroundSize: '200% 100%',
	animation: `${shimmer} 1.5s ease-in-out infinite`,
};

export const skeletonHeader = style({
	display: 'flex',
	justifyContent: 'space-between',
	gap: vars.space.md,
	...shimmerBase,
});

export const skeletonDivider = style({
	height: 1,
	opacity: 0.4,
	background: vars.color.border,
});

export const skeletonBody = style({
	display: 'grid',
	gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)',
	gap: vars.space.lg,
	alignItems: 'center',
});

export const skeletonHero = style({
	display: 'flex',
	flexDirection: 'column',
	gap: '0.4rem',
	...shimmerBase,
});

export const skeletonHeroNumber = style({
	height: '3.6rem',
	width: '60%',
	borderRadius: 4,
	background: vars.color.border,
	...shimmerBase,
});

export const skeletonHeroUnit = style({
	height: '0.6rem',
	width: '40%',
	borderRadius: 2,
	background: vars.color.border,
	...shimmerBase,
});

export const skeletonList = style({
	display: 'flex',
	flexDirection: 'column',
	gap: '0.45rem',
});

export const skeletonRow = style({
	display: 'grid',
	gridTemplateColumns: '2.6rem 1fr',
	gap: vars.space.sm,
	alignItems: 'center',
});

export const skeletonRowLabel = style({
	height: '0.6rem',
	borderRadius: 2,
	background: vars.color.border,
	...shimmerBase,
});

export const skeletonRowTrack = style({
	height: '1.4rem',
	borderRadius: 2,
	background: vars.color.border,
	...shimmerBase,
});

export const skeletonFooter = style({
	display: 'flex',
	justifyContent: 'space-between',
	gap: vars.space.md,
	paddingTop: vars.space.xs,
	borderTop: `1px dashed ${vars.color.border}`,
	...shimmerBase,
});

/* ─────────── 响应式：窄屏 ─────────── */
export const cardResponsive = style({
	'@media': {
		[`screen and (max-width: ${breakpoints.tablet})`]: {
			padding: `${vars.space.md} ${vars.space.lg}`,
			gridTemplateRows: 'auto auto 1fr auto',
		},
	},
});
