import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

/**
 * 顶部加载进度条的样式（驱动脚本见 public/js/top-progress.js）。
 *
 * 分工：CSS 只负责「怎么画」，填充宽度（0~100%）由脚本直接写成行内 width。
 * 这里没用 createVar() + var(--x)：脚本放在 public/ 下不经过 Vite，
 * 拿不到 vanilla-extract 混淆后的变量名，只能走行内 style 这条路。
 *
 * 显隐完全由 data-state 控制：
 *   - idle（默认）：不可见。这样即使脚本没跑起来（无 JS、脚本被拦、CSP 拦截），
 *     页面顶端也不会永久留一条卡住的线。
 *   - loading：淡入。
 *   - done：淡出，随后脚本把状态复位回 idle。
 *
 * 进度用 width 而不是 transform: scaleX()：scaleX 会把子元素、渐变和
 * box-shadow 一起横向压扁，进度小的时候头部高光会被挤成一条竖线。
 */
const breathe = keyframes({
	'0%, 100%': { opacity: 0.72 },
	'50%': { opacity: 1 },
});

export const container = style({
	position: 'fixed',
	top: 0,
	left: 0,
	right: 0,
	// 比 SkipLink 的 9999 低一级：键盘用户聚焦「跳到主内容」时必须压在进度条之上
	zIndex: 9998,
	height: '3px',
	overflow: 'hidden',
	pointerEvents: 'none',
	opacity: 0,
	// 多一层 visibility：全透明时不再参与合成，空闲状态下几乎没有开销
	visibility: 'hidden',
	transition: 'opacity 200ms ease-out, visibility 0s linear 200ms',
	selectors: {
		'&[data-state="loading"]': {
			opacity: 1,
			visibility: 'visible',
			transition: 'opacity 120ms ease-out, visibility 0s',
		},
		'&[data-state="done"]': {
			opacity: 0,
			visibility: 'visible',
			transition: 'opacity 220ms ease-out, visibility 0s linear 220ms',
		},
	},
	'@media': {
		'(prefers-reduced-motion: reduce)': {
			transition: 'none',
		},
		print: {
			display: 'none',
		},
	},
});

export const bar = style({
	position: 'absolute',
	top: 0,
	left: 0,
	bottom: 0,
	width: '0%',
	borderRadius: `0 ${vars.radius.pill} ${vars.radius.pill} 0`,
	background: `linear-gradient(90deg, ${vars.color.accent} 0%, ${vars.color.accentStrong} 100%)`,
	boxShadow: `0 0 10px ${vars.color.accentSoft}`,
	// 刻意不加 will-change：条子 3px 高、绝大多数时间是隐藏的，
	// 常驻一个合成层为了这点绘制量不划算
	selectors: {
		// 停在同一进度时轻微呼吸，避免看起来像卡死
		[`${container}[data-state="loading"] &`]: {
			animation: `${breathe} 1.4s ease-in-out infinite`,
		},
	},
	'@media': {
		'(prefers-reduced-motion: reduce)': {
			selectors: {
				[`${container}[data-state="loading"] &`]: {
					animation: 'none',
				},
			},
		},
	},
});

/**
 * 头部高光：贴在已填充区域右端、宽度固定（所以不会被父级宽度变化拉伸）。
 * 刻意写成死值白色而不是主题变量：浅色主题下 accent 是偏深的蓝、深色主题下是亮蓝，
 * 用 surfaceStrong 会让两端的效果一个是「发白」一个是「发黑」，只有半透明白在两个主题下都是高光。
 */
export const headGlow = style({
	position: 'absolute',
	top: 0,
	bottom: 0,
	right: 0,
	width: '56px',
	background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.7) 100%)',
	mixBlendMode: 'screen',
});
