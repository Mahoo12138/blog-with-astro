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
	// 底色**跟随 Shiki 主题**，而不是自己挑一个 surface 色。
	// Shiki 把主题底色放在 pre 的行内 style 里，同时暴露成
	// --shiki-dark-bg 变量；这里直接复用，明暗切换时外壳与代码区
	// 永远是同一个色，不会出现「上下两块颜色对不上」。
	// 浅色回退值 #fff 对应 github-light；深色分支见下方 [data-theme] 规则。
	background: 'var(--shiki-dark-bg, #fff)',
	boxShadow: vars.shadow.card,
});

/**
 * 浅色模式下外壳底色。
 * Shiki 输出的行内 style 是「浅色为 background-color、深色为 --shiki-dark-bg」，
 * 而 --shiki-dark-bg 在浅色下并不存在，所以上面的 var() 会回退到 #fff。
 * 但用户显式切到 light 主题时，系统可能是 dark，需要把 Shiki 的浅色值取回来 ——
 * 它同时也以 css 变量形式出现在 pre 的 style 里不可靠，因此这里
 * 统一用 github-light 的 #fff 兜底；若某篇文章用了别的主题，回退到 surface。
 */
globalStyle(':root[data-theme="light"] .code-block', {
	background: '#fff',
});

globalStyle(':root[data-theme="dark"] .code-block', {
	background: 'var(--shiki-dark-bg, #24292e)',
});

globalStyle(':root:not([data-theme]) .code-block', {
	'@media': {
		'(prefers-color-scheme: light)': {
			background: '#fff',
		},
	},
});

/* 复制按钮默认隐藏，等 JS 给 <html> 打上 .has-js 才显示。
 * 见文件末尾的说明。 */
globalStyle('.code-block__copy', {
	display: 'none',
});

/**
 * 让 pre 彻底「融进」外壳：去掉自己那份边框、圆角、外边距和底色。
 *
 * ⚠️ 三个属性都要 `!important`，因为 Shiki 把主题底色写成了行内 style
 * （`style="background-color:#fff;--shiki-dark-bg:#24292e"`），
 * 行内样式的优先级高于任何外部选择器 —— 不加 !important 就会在
 * 外壳内部再出现一块自己的底色和圆角，正是「块里套块」的成因。
 * 底色统一由外壳的 background-color 承担。
 *
 * padding 保留在 pre 上（而非移到外壳）：代码要贴着顶部栏往下留白，
 * 而顶部栏自己已有 padding，两者分开处理更直观。
 */
globalStyle('.code-block > pre', {
	margin: '0 !important',
	border: 'none !important',
	borderRadius: '0 !important',
	// 用 transparent 而不是 inherit 之类：外壳的底色已经画好了，
	// 这里只要「什么都不画」，深浅两套主题都不用额外处理。
	backgroundColor: 'transparent !important',
});

/* ── 顶部栏 ── */
/**
 * 顶部栏不用页面色板里的 backgroundElevated，而是给代码区底色叠一层
 * 半透明黑/白。原因：代码区底色来自 Shiki 主题（github-light/dark），
 * 和站点自己的 surface/background 是两套色系；用站点色会显得「贴上去的
 * 一块」，转换主题时尤其突兀。用 rgba 叠加则任何主题下都能自然分出层次。
 */
globalStyle('.code-block__bar', {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: vars.space.md,
	padding: `0.35rem 0.5rem 0.35rem ${vars.space.lg}`,
	// 浅色代码底(#fff)上叠 4% 黑 → 极淡的灰；深色底上叠 22% 白 → 提亮一档
	backgroundColor: 'rgba(0, 0, 0, 0.04)',
	borderBottom: '1px solid rgba(127, 127, 127, 0.18)',
	// 代码块本身是可选中的，但工具栏不该被一起选走（否则复制文本会混入语言名）
	userSelect: 'none',
});

globalStyle(':root[data-theme="dark"] .code-block__bar', {
	backgroundColor: 'rgba(255, 255, 255, 0.06)',
});

globalStyle(':root:not([data-theme]) .code-block__bar', {
	'@media': {
		'(prefers-color-scheme: dark)': {
			backgroundColor: 'rgba(255, 255, 255, 0.06)',
		},
	},
});

/**
 * 顶部栏里的文字同理：不用站点的 textMuted（深色下偏蓝灰，压在 GitHub
 * 深色底上发闷），改用跟随 Shiki 前景色的半透明版本。
 */
globalStyle('.code-block__lang', {
	fontFamily: vars.font.mono,
	fontSize: '0.72rem',
	fontWeight: 600,
	letterSpacing: '0.08em',
	textTransform: 'uppercase',
	color: 'rgba(60, 70, 85, 0.62)',
});

globalStyle(':root[data-theme="dark"] .code-block__lang', {
	color: 'rgba(225, 228, 232, 0.58)',
});

globalStyle(':root:not([data-theme]) .code-block__lang', {
	'@media': {
		'(prefers-color-scheme: dark)': {
			color: 'rgba(225, 228, 232, 0.58)',
		},
	},
});

/* ── 复制按钮 ── */
/* 文字色跟随顶部栏（与语言名同一档），所以和 lang 一样按主题分别给值。
 * display 由文件末尾「默认隐藏 / .has-js 显示」两条规则管理，这里不写。 */
globalStyle('.code-block__copy', {
	alignItems: 'center',
	gap: '0.35rem',
	padding: '0.3rem 0.6rem',
	border: 'none',
	borderRadius: vars.radius.sm,
	background: 'transparent',
	color: 'rgba(60, 70, 85, 0.62)',
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

globalStyle(':root[data-theme="dark"] .code-block__copy', {
	color: 'rgba(225, 228, 232, 0.58)',
});

globalStyle(':root:not([data-theme]) .code-block__copy', {
	'@media': {
		'(prefers-color-scheme: dark)': {
			color: 'rgba(225, 228, 232, 0.58)',
		},
	},
});

/* hover/focus 用中性灰白叠加，不用站点的 accent 蓝 —— 压在两套 Shiki
 * 主题色上都更稳，且不会在深色代码底上显得刺眼。 */
globalStyle('.code-block__copy:hover', {
	backgroundColor: 'rgba(127, 127, 127, 0.16)',
	color: 'inherit',
});

globalStyle('.code-block__copy:focus-visible', {
	outline: 'none',
	boxShadow: vars.shadow.focus,
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

/**
 * 复制成功：换对勾 + 弹一下。
 *
 * 这里**不用**站点的 accent 蓝：顶部栏整体已经改成跟随 Shiki 主题的中性色，
 * 单独一个蓝字压在与站点色系无关的 GitHub 底上会显得突兀（尤其深色下）。
 * 改成把当前主题的前景色提到接近不透明 —— 对比度够，也不破坏色系一致性。
 */
globalStyle('.code-block.is-copied .code-block__copy', {
	color: 'rgba(36, 41, 46, 0.92)',
});

globalStyle(':root[data-theme="dark"] .code-block.is-copied .code-block__copy', {
	color: 'rgba(225, 228, 232, 0.92)',
});

globalStyle(':root:not([data-theme]) .code-block.is-copied .code-block__copy', {
	'@media': {
		'(prefers-color-scheme: dark)': {
			color: 'rgba(225, 228, 232, 0.92)',
		},
	},
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
