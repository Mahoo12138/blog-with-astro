import { globalStyle, keyframes } from '@vanilla-extract/css';
import { breakpoints, vars } from './theme.css';

/**
 * 代码块外壳样式（配合 src/plugins/rehype-code-block.mjs）。
 *
 * 结构：
 *   .code-block
 *     .code-block__bar      顶部栏（语言名 + 复制按钮）
 *       .code-block__lang
 *       .code-block__copy
 *     pre.astro-code        原来的高亮块
 *
 * 主题色一律走 vars，深色模式自动跟随。
 */

/**
 * 复制图标用 CSS mask + data-URI 画，而不是每个按钮内联一个 <svg>：
 * 全站 1324 个代码块，内联 SVG 会凭空多出上百 KB 且内容完全重复；
 * 放到样式表里只需定义一次，按钮里 0 字节。
 */
const COPY_ICON =
	"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='9' y='9' width='11' height='11' rx='2'/%3E%3Cpath d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'/%3E%3C/svg%3E\")";

const CHECK_ICON =
	"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E\")";

const copiedPop = keyframes({
	'0%': { transform: 'scale(1)' },
	'45%': { transform: 'scale(1.18)' },
	'100%': { transform: 'scale(1)' },
});

/* ── 外壳 ── */
globalStyle('.code-block', {
	position: 'relative',
	margin: `0 0 ${vars.space.xl}`,
	borderRadius: vars.radius.md,
	border: `1px solid ${vars.color.border}`,
	// 顶部栏要盖住 pre 的圆角，否则会露出一条缝
	overflow: 'hidden',
	backgroundColor: vars.color.surfaceStrong,
	boxShadow: vars.shadow.card,
});

/* 复制按钮默认隐藏，等 JS 给 <html> 打上 .has-js 才显示。
 * 见文件末尾的说明。 */
globalStyle('.code-block__copy', {
	display: 'none',
});

/* 外壳接手边框与圆角后，里面的 pre 不再各画一份，否则会出现双边框 */
globalStyle('.code-block > pre', {
	margin: 0,
	border: 'none',
	borderRadius: 0,
	boxShadow: 'none',
});

/* ── 顶部栏 ── */
globalStyle('.code-block__bar', {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: vars.space.md,
	padding: `0.35rem 0.5rem 0.35rem ${vars.space.lg}`,
	backgroundColor: vars.color.backgroundElevated,
	borderBottom: `1px solid ${vars.color.border}`,
	// 代码块本身是可选中的，但工具栏不该被一起选走（否则复制文本会混入语言名）
	userSelect: 'none',
});

globalStyle('.code-block__lang', {
	fontFamily: vars.font.mono,
	fontSize: '0.72rem',
	fontWeight: 600,
	letterSpacing: '0.08em',
	textTransform: 'uppercase',
	color: vars.color.textMuted,
});

/* ── 复制按钮 ── */
/* display 由下方「默认隐藏 / .has-js 显示」两条规则管理，这里不写 */
globalStyle('.code-block__copy', {
	alignItems: 'center',
	gap: '0.35rem',
	padding: '0.3rem 0.6rem',
	border: 'none',
	borderRadius: vars.radius.sm,
	background: 'transparent',
	color: vars.color.textMuted,
	fontFamily: vars.font.body,
	fontSize: '0.78rem',
	lineHeight: 1.4,
	cursor: 'pointer',
	transition: 'background-color 160ms ease, color 160ms ease',
	'@media': {
		// 小屏只留图标，省出横向空间给代码
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			fontSize: 0,
			gap: 0,
			padding: '0.3rem 0.45rem',
		},
	},
});

globalStyle('.code-block__copy:hover', {
	backgroundColor: vars.color.accentSoft,
	color: vars.color.accentStrong,
});

globalStyle('.code-block__copy:focus-visible', {
	outline: 'none',
	boxShadow: vars.shadow.focus,
	color: vars.color.accentStrong,
});

/* 图标用 mask 上色：currentColor 让它跟随按钮文字色，明暗主题都不用改 */
globalStyle('.code-block__copy::before', {
	content: '',
	width: '0.85rem',
	height: '0.85rem',
	flexShrink: 0,
	backgroundColor: 'currentColor',
	WebkitMask: `${COPY_ICON} center / contain no-repeat`,
	mask: `${COPY_ICON} center / contain no-repeat`,
	'@media': {
		[`screen and (max-width: ${breakpoints.mobile})`]: {
			width: '0.95rem',
			height: '0.95rem',
		},
	},
});

/* 复制成功：换对勾 + 弹一下 + 变强调色 */
globalStyle('.code-block.is-copied .code-block__copy', {
	color: vars.color.accent,
});

globalStyle('.code-block.is-copied .code-block__copy::before', {
	WebkitMaskImage: CHECK_ICON,
	maskImage: CHECK_ICON,
	animation: `${copiedPop} 320ms ease`,
	'@media': {
		// 尊重系统的减少动态偏好
		'(prefers-reduced-motion: reduce)': {
			animation: 'none',
		},
	},
});

/**
 * JS 就绪后才显示复制按钮（code-copy.js 会给 <html> 加 .has-js）。
 *
 * 为什么不用 <noscript><style>：实测在 BaseHead 的 <noscript> 里放
 * 带 is:inline 的 <style>，会破坏 Astro 的模板解析 —— 后续
 * `{noindex && <meta …>}` 会整段变成字面文本漏进 HTML（236 页全中）。
 *
 * 这个方向还比「无 JS 时藏起来」更好：按钮只在确实能点的时候出现，
 * 不会出现「看得见但点了没反应」的状态。
 */
globalStyle('html.has-js .code-block__copy', {
	display: 'inline-flex',
});
