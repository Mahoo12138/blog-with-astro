/**
 * 顶部页面加载进度条。
 *
 * 放在 public/js/ 作为静态文件引用，理由同 code-copy.js：本站开了 ClientRouter，
 * 每个页面都要用得上，但内联会重复到 236 页 HTML 里；外部文件全站只下一次并被缓存。
 *
 * 覆盖三种场景：
 *   1. 首次加载（硬导航）：脚本跑起来就开爬，window.load 时补满；
 *   2. 站内跳转（ClientRouter）：before-preparation → after-preparation
 *      → before-swap → page-load，各阶段给一个「至少到这里」的保底进度；
 *   3. 兜底：8 秒还没等到信号就强制补满，免得网络异常时条永远停在 90%。
 *
 * 一次性守卫是必须的：ClientRouter 换页时 document 不重建，
 * 脚本本身虽然不会重跑（同一 src 会被标记已执行），但这里仍然加闸门，
 * 防止将来脚本被挪进 <body> 后重复绑定监听器。
 */
(function () {
	if (window.__topProgressReady) return;
	window.__topProgressReady = true;

	var CONTAINER = '[data-top-progress]';
	var BAR = '[data-top-progress-bar]';

	var START_AT = 0.08; // 起步跳到 8%：从 0 一点点爬会显得迟钝，像没响应
	var EASE = 0.12; // 每帧向目标值靠近的比例，越大越跟手
	var CAP = 0.9; // 没有明确信号时最多爬到这里，剩下的 10% 留给「完成」
	var TRICKLE_STEP = 0.06;
	var TRICKLE_MS = 280; // 滴答间隔：模拟「还在干活」的持续感
	var HOLD_MS = 220; // 补满后停留多久再淡出，太短会看不见满格那一下
	var RESET_MS = 400; // 淡出后再把宽度复位，等下次导航
	var STALL_MS = 8000; // 首屏兜底

	var reduceMotion =
		typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	var container = document.querySelector(CONTAINER);
	var bar = document.querySelector(BAR);
	var current = 0;
	var target = 0;
	var frameId = 0;
	var trickleId = 0;
	var holdId = 0;
	var resetId = 0;
	var stallId = 0;

	function setState(state) {
		if (container) container.dataset.state = state;
	}

	function paint() {
		if (bar) bar.style.width = (current * 100).toFixed(2) + '%';
	}

	function step() {
		frameId = 0;
		// reduced-motion 下不做追赶动画，直接落位，视觉上没有持续位移
		current = reduceMotion ? target : current + (target - current) * EASE;
		if (Math.abs(target - current) < 0.001) current = target;
		paint();
		if (current < target) frameId = requestAnimationFrame(step);
	}

	function schedule() {
		if (!frameId && current < target) frameId = requestAnimationFrame(step);
	}

	/** 只把目标值往上抬：各阶段信号到达顺序不保证单调 */
	function bump(value) {
		if (target < value) {
			target = value;
			schedule();
		}
	}

	function scheduleTrickle() {
		clearTimeout(trickleId);
		trickleId = setTimeout(function () {
			target = Math.min(CAP, target + (CAP - target) * TRICKLE_STEP);
			schedule();
			scheduleTrickle();
		}, TRICKLE_MS);
	}

	/**
	 * 重新抓一次节点引用。正常情况 bar 靠 data-astro-transition-persist 跨页留存、
	 * 引用一直有效；但若某个页面没渲染这个壳（比如将来新增的自写 html 的页面），
	 * 换页后旧引用就成了游离节点，这里兜一下。
	 */
	function refresh() {
		container = document.querySelector(CONTAINER) || container;
		bar = document.querySelector(BAR) || bar;
	}

	/** 立刻收起：用于从 bfcache 恢复这类「没有加载在跑」的场景 */
	function reset() {
		clearTimeout(trickleId);
		clearTimeout(holdId);
		clearTimeout(resetId);
		clearTimeout(stallId);
		current = 0;
		target = 0;
		setState('idle');
		paint();
	}

	function start() {
		refresh();
		clearTimeout(trickleId);
		clearTimeout(holdId);
		clearTimeout(resetId);
		// 首屏兜底计时器必须一起清掉：否则在第 8 秒触发时
		// 会误把一次正在进行的站内跳转判成「已完成」
		clearTimeout(stallId);
		current = 0;
		target = START_AT;
		setState('loading');
		paint();
		schedule();
		scheduleTrickle();
	}

	function finish() {
		clearTimeout(stallId);
		clearTimeout(trickleId);
		target = 1;
		schedule();
		clearTimeout(holdId);
		holdId = setTimeout(function () {
			setState('done');
			clearTimeout(resetId);
			resetId = setTimeout(function () {
				refresh();
				// 期间又发起了一次导航（状态已被 start 改写）就不要复位，
				// 否则会把正在爬的新进度条一把抹回 0
				if (!container || container.dataset.state !== 'done') return;
				setState('idle');
				current = 0;
				target = 0;
				paint();
			}, RESET_MS);
		}, HOLD_MS);
	}

	// 首屏：defer 脚本执行时 DOM 已解析完但 load 还没触发，readyState 仍是 'loading'。
	// 若将来脚本被改成 async 或在换页后重跑，这里会读不到 'loading'，自然跳过，不会误开场。
	if (document.readyState === 'loading') {
		start();
		document.addEventListener('DOMContentLoaded', function () {
			bump(0.5);
		});
		window.addEventListener('load', finish);
		stallId = setTimeout(finish, STALL_MS);
	}

	// 从 bfcache（前进/后退缓存）恢复时页面是原样还原的，
	// 条子可能正好停在加载态，此时没有加载在跑，直接收起
	window.addEventListener('pageshow', function (event) {
		if (event.persisted) reset();
	});

	// ClientRouter 站内跳转
	document.addEventListener('astro:before-preparation', start);
	document.addEventListener('astro:after-preparation', function () {
		bump(0.35);
	});
	document.addEventListener('astro:before-swap', function () {
		bump(0.7);
	});
	document.addEventListener('astro:page-load', finish);
})();
