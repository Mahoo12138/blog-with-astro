/**
 * 代码块复制按钮的行为。
 *
 * 放在 public/js/ 作为静态文件引用，而不是用 <script is:inline> 塞进每个页面：
 * 实测内联版 4.86KB × 236 页 = 1.09MB，而全站只有 106 页有代码块，
 * 其余 130 页纯属白付流量。改成外部文件后只下载一次并被浏览器缓存。
 *
 * 两个关键点：
 * 1. 事件委托 + 一次性守卫。站点开了 ClientRouter（视图过渡），
 *    跨页导航时 document 不重建，重复绑定会导致一次点击触发多次。
 * 2. 复制内容在点击时才从 pre > code 读取，不预存到 data 属性 ——
 *    全站 1326 个代码块，把代码文本再存一份会让 HTML 翻倍。
 */
(function () {
	if (window.__codeBlockCopyReady) return;
	window.__codeBlockCopyReady = true;

	/**
	 * 给 <html> 打上 has-js：复制按钮的样式是「默认 display:none，
	 * .has-js 下才显示」。这样无 JS 环境下按钮根本不出现，
	 * 不会留下一个点了没反应的控件。
	 *
	 * 本脚本是 defer 的，执行时机在 DOM 解析完之后，按钮会先以隐藏态
	 * 渲染、随后再出现。这是刻意的取舍：反过来（默认显示、无 JS 再藏）
	 * 在慢网络下会让用户先看到一个失效按钮。
	 */
	document.documentElement.classList.add('has-js');

	// navigator.clipboard 只在安全上下文（HTTPS / localhost）可用，
	// 保留 execCommand 兜底，避免 http 环境下按钮完全失效。
	function writeClipboard(text) {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			return navigator.clipboard.writeText(text);
		}
		return new Promise(function (resolve, reject) {
			var area = document.createElement('textarea');
			area.value = text;
			area.setAttribute('readonly', '');
			area.style.position = 'fixed';
			area.style.opacity = '0';
			document.body.appendChild(area);
			area.select();
			var ok = false;
			try {
				ok = document.execCommand('copy');
			} catch (error) {
				reject(error);
				return;
			} finally {
				area.remove();
			}
			ok ? resolve() : reject(new Error('execCommand copy failed'));
		});
	}

	function reset(block, button) {
		block.classList.remove('is-copied');
		button.textContent = button.dataset.copyLabel || '复制';
		button.setAttribute('aria-label', button.dataset.copyAriaLabel || '复制代码');
	}

	document.addEventListener('click', function (event) {
		var button = event.target.closest('[data-code-copy]');
		if (!button) return;

		var block = button.closest('.code-block');
		if (!block) return;

		// 优先取 <code>，没有就退回 <pre>（Shiki 标准输出是 pre > code）
		var source = block.querySelector('pre > code') || block.querySelector('pre');
		if (!source) return;

		if (!button.dataset.copyLabel) {
			button.dataset.copyLabel = button.textContent.trim();
			button.dataset.copyAriaLabel = button.getAttribute('aria-label');
		}
		if (button.dataset.copyTimer) window.clearTimeout(Number(button.dataset.copyTimer));

		writeClipboard(source.textContent || '').then(
			function () {
				// 先摘掉 class 并强制回流，让连续点击时动画能重新播放
				block.classList.remove('is-copied');
				void block.offsetWidth;
				block.classList.add('is-copied');
				button.textContent = '已复制';
				button.setAttribute('aria-label', '已复制到剪贴板');
				button.dataset.copyTimer = String(
					window.setTimeout(function () {
						reset(block, button);
						button.dataset.copyTimer = '';
					}, 1600),
				);
			},
			function () {
				// 复制失败（权限被拒等）时清掉状态，避免停留在错误的视觉反馈上
				reset(block, button);
			},
		);
	});
})();
