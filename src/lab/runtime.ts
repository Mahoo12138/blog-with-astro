/**
 * 原生（非框架）demo 的挂载助手。
 *
 * 之所以要有这一层，是因为这个站开了 ClientRouter（View Transitions），
 * 而 canvas + requestAnimationFrame 是「离开页面还在后台烧 CPU」的重灾区。
 * 下面这些脏活每个 demo 都要做一遍，与其复制粘贴不如收在这里：
 *
 *   - DPR 适配：drawing buffer 按 devicePixelRatio（上限 2）放大，
 *     再用 setTransform 把绘制坐标还原成 CSS 像素，demo 里只用 CSS 像素思考。
 *   - 尺寸跟随：ResizeObserver 监听 canvas 盒子（不是 window），
 *     全屏切换、侧栏折叠引起的尺寸变化都能收到。
 *   - 只在需要时跑：IntersectionObserver 离屏暂停 + visibilitychange
 *     切后台暂停。
 *   - prefers-reduced-motion：不进 rAF，只画一帧静态图。
 *   - 卸载：astro:before-swap 时销毁，避免 View Transition 后残留 rAF
 *     对着已 detached 的 canvas 狂画。
 *
 * 用法：
 *
 *   mountLabDemo(root, ({ canvas, ctx, size, onFrame, onResize, onReset, redraw }) => {
 *     // ...
 *   });
 */

export interface LabDemoSize {
	/** CSS 像素宽 */
	width: number;
	/** CSS 像素高 */
	height: number;
	dpr: number;
}

export interface LabDemoContext {
	root: HTMLElement;
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	/** 当前逻辑尺寸（CSS 像素） */
	size(): LabDemoSize;
	/** 注册每帧回调。dt 单位秒，已 clamp 到 0.05 以内（防止切回标签页时炸掉积分器） */
	onFrame(cb: (dt: number, elapsed: number) => void): void;
	/** 注册尺寸变化回调，挂载时会先同步调用一次（首次绘制就在里面做） */
	onResize(cb: (size: LabDemoSize) => void): void;
	/** 注册「重置」响应：由舞台工具栏的按钮触发 */
	onReset(cb: () => void): void;
	/** 手动请求重绘一帧（暂停状态下的交互反馈用它） */
	redraw(): void;
	/** 用户是否要求减少动效 */
	reducedMotion: boolean;
}

export type LabDemoSetup = (context: LabDemoContext) => void;

/** 同一 DOM 上只挂一次；值为销毁函数 */
const mounted = new WeakMap<HTMLElement, () => void>();

/** demo 内读取 CSS 自定义属性（颜色等），读不到时回退 */
export function readCssVar(element: Element, name: string, fallback: string): string {
	const value = getComputedStyle(element).getPropertyValue(name).trim();
	return value || fallback;
}

export function mountLabDemo(root: HTMLElement, setup: LabDemoSetup): void {
	if (mounted.has(root)) return; // astro:page-load 可能重复进入，忽略

	const canvas = root.querySelector('canvas');
	if (!canvas) {
		console.warn('[lab] demo 容器内没有找到 <canvas>，已跳过挂载');
		return;
	}
	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const frameHandlers: ((dt: number, elapsed: number) => void)[] = [];
	const resizeHandlers: ((size: LabDemoSize) => void)[] = [];
	const resetHandlers: (() => void)[] = [];

	let width = 0;
	let height = 0;
	let dpr = 1;
	let rafId = 0;
	let lastTs = 0;
	let elapsed = 0;
	let running = false;
	let visible = true;

	function size(): LabDemoSize {
		return { width, height, dpr };
	}

	function applySize(): void {
		const rect = canvas!.getBoundingClientRect();
		const nextW = Math.max(1, Math.round(rect.width));
		const nextH = Math.max(1, Math.round(rect.height));
		const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
		if (nextW === width && nextH === height && nextDpr === dpr) return;

		width = nextW;
		height = nextH;
		dpr = nextDpr;
		canvas!.width = Math.round(width * dpr);
		canvas!.height = Math.round(height * dpr);
		// 之后所有绘制都可以用 CSS 像素坐标，无需到处乘 dpr
		ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

		for (const handler of resizeHandlers) handler(size());
	}

	function frame(ts: number): void {
		rafId = requestAnimationFrame(frame);
		const dt = lastTs === 0 ? 1 / 60 : Math.min((ts - lastTs) / 1000, 0.05);
		lastTs = ts;
		elapsed += dt;
		for (const handler of frameHandlers) handler(dt, elapsed);
	}

	function drawOnce(): void {
		for (const handler of frameHandlers) handler(0, elapsed);
	}

	function sync(): void {
		const shouldRun = visible && !document.hidden && !reducedMotion;
		if (shouldRun && !running) {
			running = true;
			lastTs = 0;
			rafId = requestAnimationFrame(frame);
		} else if (!shouldRun && running) {
			running = false;
			cancelAnimationFrame(rafId);
			rafId = 0;
		}
	}

	const context: LabDemoContext = {
		root,
		canvas,
		ctx,
		size,
		onFrame: (cb) => frameHandlers.push(cb),
		onResize: (cb) => {
			resizeHandlers.push(cb);
			cb(size());
		},
		onReset: (cb) => resetHandlers.push(cb),
		redraw: drawOnce,
		reducedMotion,
	};

	setup(context);

	const resizeObserver = new ResizeObserver(() => {
		applySize();
		if (!running) drawOnce(); // 暂停状态下也要跟上新尺寸
	});
	resizeObserver.observe(canvas);

	const intersectionObserver = new IntersectionObserver(
		(entries) => {
			visible = entries.some((entry) => entry.isIntersecting);
			sync();
		},
		{ rootMargin: '128px' },
	);
	intersectionObserver.observe(canvas);

	const onVisibility = () => sync();
	document.addEventListener('visibilitychange', onVisibility);

	// 舞台工具栏的「重置」按钮：LabStage 把事件派发在 [data-lab-stage] 上。
	// 这里必须监听 stage 而不是 root —— 事件只向上冒泡，派发在祖先上的事件
	// 子孙是收不到的。没有 stage 包裹时（裸 demo）退化为监听 root 自己。
	const resetTarget = root.closest<HTMLElement>('[data-lab-stage]') ?? root;
	const onResetEvent = () => {
		for (const handler of resetHandlers) handler();
		if (!running) drawOnce();
	};
	resetTarget.addEventListener('lab:reset', onResetEvent);

	function destroy(): void {
		if (running) cancelAnimationFrame(rafId);
		running = false;
		rafId = 0;
		resizeObserver.disconnect();
		intersectionObserver.disconnect();
		document.removeEventListener('visibilitychange', onVisibility);
		resetTarget.removeEventListener('lab:reset', onResetEvent);
		document.removeEventListener('astro:before-swap', destroy);
		mounted.delete(root);
	}

	// View Transition 换页前销毁；换页后新 DOM 会重新走一遍挂载
	document.addEventListener('astro:before-swap', destroy, { once: true });
	mounted.set(root, destroy);

	applySize();
	sync();
}
