/**
 * 只在 frontmatter 标了 `mathjax: true` 的文章里保留数学节点，其余文章把数学节点
 * **还原成原始文本**（连 `$` / `$$` 分隔符一起），使这些文章的输出与「从未启用数学」时一致。
 *
 * ## 为什么必须这样绕一圈
 *
 * `remark-math` 是**处理器级（attacher）插件**：它在 setup 阶段把 `$…$` 语法注册到
 * processor 上，并且**不返回 transformer**。因此它**无法**按文档条件启用 —— 一旦注册，
 * 整个处理器（所有文章）都会解析数学语法。
 *
 * 此前 astro.config.mjs 里的 `whenMathjax()` 包装器正是想「按 frontmatter 条件挂载」，
 * 结果两头都错：
 *
 * 1. 对 `remark-math`：包装器用裸调用 `plugin(...options)` 触发 attacher，
 *    丢失了 unified 传入的 `this`，而 remark-math 内部是 `const self = this; self.data()`
 *    —— 于是抛 `Cannot read properties of undefined (reading 'data')`。
 *    异常被 glob loader 的 try/catch 吞掉、只留一行 `[ERROR] [glob-loader]`，
 *    并且 **remark-math 从未成功注册 → 全站数学渲染静默失效**（`$$…$$` 原样漏进 HTML）。
 * 2. 就算修好 `this`，`remark-math` 返回 `undefined`，包装器仍然拿不到 transformer，
 *    只会换个错（`transformer is not a function`）。**这个包装思路对 attacher 型插件无解。**
 *
 * 所以改为：`remark-math` 无条件挂载（语法始终解析），再由本插件在**解析之后**
 * 按 frontmatter 决定「保留数学节点」还是「还原为原文」。
 *
 * ## 为什么用 position 切片而不是自己拼分隔符
 *
 * mdast 的数学节点只有 `value`，**不记录**原文用的是 `$…$` 还是 `$$…$$`；
 * 而 `inlineMath` / `math` 的分野取决于**是否独占一行**，与分隔符不是一回事
 * （实测行内的 `$$…$$` 也会变成 `inlineMath`）。用 `position` 偏移从 `file.value`
 * 精确切片，才能连分隔符、空白、换行一起还原成作者原本写的样子。
 */

/** 取回该数学节点在原文里的确切文本。 */
function rawOf(node, source) {
	const start = node.position?.start?.offset;
	const end = node.position?.end?.offset;
	if (typeof start === 'number' && typeof end === 'number' && source) {
		return source.slice(start, end);
	}
	// 兜底：拿不到位置信息时按节点类型拼分隔符
	const marker = node.type === 'math' ? '$$' : '$';
	return `${marker}${node.value ?? ''}${marker}`;
}

/**
 * 深度遍历并还原数学节点。
 *
 * 行内数学（`inlineMath`）的父节点是 paragraph，直接换成 text 即可；
 * 块级数学（`math`）的父节点是 root，直接放 text 会让 mdast→hast 拿到不合法的
 * 块级子节点，所以包一层 paragraph。
 */
function restore(node, source) {
	const children = node?.children;
	if (!Array.isArray(children)) {
		return;
	}

	for (let i = 0; i < children.length; i += 1) {
		const child = children[i];
		if (!child || typeof child.type !== 'string') {
			continue;
		}

		if (child.type === 'inlineMath') {
			children[i] = { type: 'text', value: rawOf(child, source) };
			continue;
		}
		if (child.type === 'math') {
			children[i] = {
				type: 'paragraph',
				children: [{ type: 'text', value: rawOf(child, source) }],
			};
			continue;
		}

		restore(child, source);
	}
}

/**
 * remark 插件：非 `mathjax: true` 的文章里，把数学节点还原为原文。
 * 用法：astro.config.mjs → markdown.remarkPlugins: [remarkMath, remarkMathGate]
 */
export function remarkMathGate() {
	return function (tree, file) {
		if (file?.data?.astro?.frontmatter?.mathjax === true) {
			return;
		}
		const source = typeof file?.value === 'string' ? file.value : '';
		restore(tree, source);
	};
}

export default remarkMathGate;
