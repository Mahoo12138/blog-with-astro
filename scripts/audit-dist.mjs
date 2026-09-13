#!/usr/bin/env node
/**
 * 构建产物体检脚本。
 *
 * 覆盖 optimization-plan.md 第 6 节「验收方式」与 4.4「工程护栏」：
 *   1. 站内链接可达性（扫描 dist HTML 内部 href，断言目标存在）
 *   2. 图片体积预算（单文件不超过 200KB）
 *   3. dist 总量预算
 *   4. 关键隐私/收录断言（love 页不出现在索引与 sitemap）
 *   5. 无障碍断言（每页都存在 skip-link 与 #main-content 落点、有且仅有一个 h1）
 *   6. 代码块增强断言（每个代码块都套了外壳、页面引入了复制脚本）
 *   7. 模板泄漏断言（`{expr}` 不得作为字面文本出现在 HTML 里）
 *
 * 用法: node scripts/audit-dist.mjs [--budget-mb=15] [--image-kb=200]
 * 退出码非 0 表示有断言失败，可直接用于 CI。
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const args = Object.fromEntries(
	process.argv.slice(2).map((arg) => {
		const [k, v] = arg.replace(/^--/, '').split('=');
		return [k, v];
	}),
);
/**
 * 体积预算。
 *
 * dist 总量的主要构成是文章 HTML（239 页 / 约 13MB），
 * 而其中大头是 Shiki 为每个 token 内联的 light+dark 双份色值。
 * 这个量级由「代码块密集的教程文章有多少」决定，不是配置能压下去的，
 * 所以预算按实测基线设成「不许继续恶化」的护栏，而不是理想值。
 *
 * - TOTAL_BUDGET_MB：当前实测约 17.5MB，留少量余量作为回归护栏
 * - IMAGE_BUDGET_KB：单张图片硬上限，这才是真正能靠工程手段守住的线
 */
const BUDGET_MB = Number(args['budget-mb'] ?? 19);
const IMAGE_KB = Number(args['image-kb'] ?? 200);

if (!existsSync(dist)) {
	console.error('✗ dist/ 不存在，请先运行 pnpm build');
	process.exit(1);
}

/** 递归收集文件 */
async function walk(dir) {
	const out = [];
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) out.push(...(await walk(full)));
		else out.push(full);
	}
	return out;
}

const files = await walk(dist);
const failures = [];
const warnings = [];

/* ---------- 1. 体积统计 ---------- */
let totalBytes = 0;
const byExt = new Map();
const oversizedImages = [];

for (const file of files) {
	const info = await stat(file);
	totalBytes += info.size;
	const ext = path.extname(file).toLowerCase();
	const bucket = byExt.get(ext) ?? { count: 0, bytes: 0 };
	bucket.count += 1;
	bucket.bytes += info.size;
	byExt.set(ext, bucket);

	if (['.png', '.jpg', '.jpeg'].includes(ext) && info.size > IMAGE_KB * 1024) {
		oversizedImages.push({ file: path.relative(dist, file), size: info.size });
	}
}

const totalMb = totalBytes / 1024 / 1024;
if (totalMb > BUDGET_MB) {
	failures.push(`dist 总量 ${totalMb.toFixed(1)}MB 超过预算 ${BUDGET_MB}MB`);
}
if (oversizedImages.length) {
	for (const { file, size } of oversizedImages) {
		failures.push(`图片超出预算 ${IMAGE_KB}KB: ${file} (${(size / 1024).toFixed(0)}KB) — 建议走 Astro 图片管线`);
	}
}

/* ---------- 2. 站内链接可达性 ---------- */
const htmlFiles = files.filter((f) => f.endsWith('.html'));
/** 把一个站内 URL 解析为期望存在的 dist 路径集合 */
function candidateTargets(urlPath) {
	const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
	const trimmed = clean.replace(/^\/+/, '');
	if (trimmed === '') return [path.join(dist, 'index.html')];
	const base = path.join(dist, trimmed);
	return [
		path.join(base, 'index.html'), // 目录式路由 /foo/ -> foo/index.html
		base,                          // 精确文件 /rss.xml, /favicon.svg
		`${base}.html`,                // 无扩展名的 page -> page.html
	];
}

/**
 * 剥离 <pre>...</pre>（含内部 <code>）后再扫描链接。
 * 代码块里的 href="..." 是文章正文的代码示例（例如教程里贴的 Hexo 配置片段），
 * 不是真实导航链接，扫描时必须排除，否则会产生大量误报。
 */
function stripCodeBlocks(html) {
	return html.replace(/<pre\b[\s\S]*?<\/pre>/gi, '');
}

const seen = new Set();
const brokenLinks = new Map();

// 只扫描页面自身的内部链接。跳过 pagefind（其内部片段含相对路径噪音）。
const skipDirs = ['pagefind'];

for (const file of htmlFiles) {
	const rel = path.relative(dist, file);
	if (skipDirs.some((d) => rel.startsWith(d))) continue;

	const html = stripCodeBlocks(await readFile(file, 'utf8'));
	const hrefRe = /href="([^"]+)"/g;
	let m;
	while ((m = hrefRe.exec(html))) {
		const href = m[1];
		// 只检查站内绝对路径
		if (!href.startsWith('/') || href.startsWith('//')) continue;
		// 跳过含模板语法 / HTML 残留的伪链接
		if (/\$\{|\{\{|<\/?span/i.test(href)) continue;
		// 跳过静态资源与常见非页面资源
		if (/^\/(_astro|pagefind|fonts)\//.test(href)) continue;
		if (/\.(css|js|mjs|json|xml|xsl|svg|ico|png|jpe?g|webp|avif|woff2?|ttf|mp3|mp4|txt|pdf)$/i.test(href)) {
			// 这些仍然要求存在，但用精确匹配
			const target = path.join(dist, decodeURIComponent(href.split('?')[0].replace(/^\/+/, '')));
			if (!existsSync(target)) {
				const key = `${href}`;
				if (!brokenLinks.has(key)) brokenLinks.set(key, { href, from: rel });
			}
			continue;
		}

		const key = href;
		if (seen.has(`${rel}::${key}`)) continue;
		seen.add(`${rel}::${key}`);

		const ok = candidateTargets(href).some((t) => existsSync(t));
		if (!ok && !brokenLinks.has(key)) {
			brokenLinks.set(key, { href, from: rel });
		}
	}
}

if (brokenLinks.size) {
	failures.push(`发现 ${brokenLinks.size} 条站内死链:`);
	for (const { href, from } of [...brokenLinks.values()].slice(0, 20)) {
		failures.push(`    ${href}  ←  ${from}`);
	}
}

/* ---------- 3. 隐私 / 收录断言 ---------- */
const loveHtml = path.join(dist, 'love', 'index.html');
if (existsSync(loveHtml)) {
	const love = await readFile(loveHtml, 'utf8');
	if (!/name="robots"\s+content="noindex/.test(love)) {
		failures.push('/love/ 缺少 robots noindex');
	}
	if (!/data-pagefind-ignore/.test(love)) {
		failures.push('/love/ 缺少 data-pagefind-ignore（私人内容会被站内搜索检索）');
	}
}

const sitemapFiles = files.filter((f) => /sitemap-\d+\.xml$/.test(f));
if (sitemapFiles.length) {
	const all = (await Promise.all(sitemapFiles.map((f) => readFile(f, 'utf8')))).join('');
	for (const path_ of ['/love/', '/search/', '/mdx-components/', '/privacy/', '/terms/']) {
		if (all.includes(`<loc>https://mahoo12138.cn${path_}</loc>`)) {
			failures.push(`sitemap 仍包含功能页: ${path_}`);
		}
	}
}

/* ---------- 4. 无障碍断言（optimization-plan P2-7） ---------- */
/**
 * skip-link 属于「加了但容易在后续改版里悄悄丢掉」的那类修复：
 * 没有任何视觉反馈，一旦被删掉谁也不会发现。
 * 这里对每个 HTML 页面断言两件事：
 *   a) 存在指向 #main-content 的跳转链接
 *   b) 文档里确实有 id="main-content" 的落点（否则锚点会静默失效）
 * 404 等无 Shell 的页面不在此列，所以只检查同时出现 <main 的页面。
 */
const skipLinkPages = [];
for (const file of htmlFiles) {
	const rel = path.relative(dist, file);
	if (skipDirs.some((d) => rel.startsWith(d))) continue;
	const html = await readFile(file, 'utf8');
	// 只对使用了 Shell（含 <main>）的页面生效
	if (!/<main\b/i.test(html)) continue;
	const hasLink = /href="#main-content"/.test(html);
	const hasAnchor = /id="main-content"/.test(html);
	if (!hasLink || !hasAnchor) {
		skipLinkPages.push(`${rel}${!hasLink ? ' 缺 skip-link' : ''}${!hasAnchor ? ' 缺 #main-content' : ''}`);
	}
}
if (skipLinkPages.length) {
	failures.push(`skip-link 断言失败 ${skipLinkPages.length} 页:`);
	for (const p of skipLinkPages.slice(0, 10)) failures.push(`    ${p}`);
}

/* ---------- 5. 标题大纲断言（optimization-plan P2-7） ---------- */
/**
 * 每个渲染了 <main> 的页面都应有且仅有一个 <h1>。
 * 无 h1 → 读屏无法定位页面主题（axe: page-has-heading-one）；
 * 多个 h1 → 大纲出现多个根节点，同样破坏导航。
 * 多个 h1 通常来自 Markdown 正文里手写的 `# 标题`。
 *
 * 例外：/post/ 是 301 跳转桩页，不含 <main>，天然不参与此断言。
 */
const noH1 = [];
const multiH1 = [];
for (const file of htmlFiles) {
	const rel = path.relative(dist, file);
	if (skipDirs.some((d) => rel.startsWith(d))) continue;
	const html = stripCodeBlocks(await readFile(file, 'utf8'));
	if (!/<main\b/i.test(html)) continue;
	const count = (html.match(/<h1[\s>]/gi) ?? []).length;
	if (count === 0) noH1.push(rel);
	else if (count > 1) multiH1.push(`${rel} (${count} 个)`);
}
if (noH1.length) {
	failures.push(`以下页面缺少 <h1>（共 ${noH1.length} 页）:`);
	for (const p of noH1.slice(0, 10)) failures.push(`    ${p}`);
}
if (multiH1.length) {
	failures.push(`以下页面有多个 <h1>（共 ${multiH1.length} 页，通常是正文手写了 \`# 标题\`）:`);
	for (const p of multiH1.slice(0, 10)) failures.push(`    ${p}`);
}

/* ---------- 6. 代码块增强断言 ---------- */
/**
 * rehype-code-block 插件给每个代码块套外壳（语言标签 + 复制按钮）。
 * 它是靠 astro.config.mjs 的 markdown.rehypePlugins 接进来的，
 * 一旦被误删，页面不会报错、只会「悄悄变回没有语言名的裸代码块」，
 * 所以这里断言两条：
 *   a) 每个 pre.astro-code 都被 .code-block 包住（插件确实跑了）
 *   b) 每个有代码块的页面都引用了复制脚本（否则按钮点了没反应）
 */
const unwrapped = [];
const missingScript = [];
for (const file of htmlFiles) {
	const rel = path.relative(dist, file);
	if (skipDirs.some((d) => rel.startsWith(d))) continue;
	const html = await readFile(file, 'utf8');
	const preCount = (html.match(/<pre class="astro-code/g) ?? []).length;
	if (preCount === 0) continue;

	const wrapperCount = (html.match(/<div class="code-block">/g) ?? []).length;
	if (wrapperCount !== preCount) {
		unwrapped.push(`${rel}（pre ${preCount} 个 / 外壳 ${wrapperCount} 个）`);
	}
	if (!html.includes('/js/code-copy.js')) {
		missingScript.push(rel);
	}
}
if (unwrapped.length) {
	failures.push(`代码块未套外壳（rehype-code-block 可能未被加载）${unwrapped.length} 页:`);
	for (const p of unwrapped.slice(0, 10)) failures.push(`    ${p}`);
}
if (missingScript.length) {
	failures.push(`有代码块但未引入 /js/code-copy.js ${missingScript.length} 页:`);
	for (const p of missingScript.slice(0, 10)) failures.push(`    ${p}`);
}

/* ---------- 7. 模板泄漏断言 ---------- */
/**
 * Astro 模板里的 `{expr && <tag />}` 若被当成字面文本输出，说明
 * 该文件的模板解析被破坏了。这类问题不报错、不警告，只是页面元数据
 * 静默失效（noindex 丢失、og:type 丢失），必须靠断言兜住。
 *
 * 触发过一次真实事故：在 BaseHead.astro 的 <noscript> 里放了
 * 带 is:inline 的 <style>，导致同一文件后续所有 `{...}` 表达式
 * 全部漏成文本，236 个页面全中。
 */
const leaked = [];
for (const file of htmlFiles) {
	const rel = path.relative(dist, file);
	if (skipDirs.some((d) => rel.startsWith(d))) continue;
	const html = await readFile(file, 'utf8');
	// 模板表达式原样出现在 HTML 里就是泄漏。这几个是 BaseHead 里实际用到的。
	if (/\bnoindex && <meta/.test(html) || /type === 'article' && /.test(html)) {
		leaked.push(rel);
	}
}
if (leaked.length) {
	failures.push(`模板表达式泄漏为字面文本（模板解析被破坏）${leaked.length} 页:`);
	for (const p of leaked.slice(0, 10)) failures.push(`    ${p}`);
}

/* ---------- 8. 报告 ---------- */
const fmt = (b) => `${(b / 1024 / 1024).toFixed(2)} MB`;
console.log('📦 构建产物体检');
console.log(`   文件数: ${files.length}`);
console.log(`   总大小: ${fmt(totalBytes)} (预算 ${BUDGET_MB} MB)`);
console.log('   分类型:');
for (const [ext, { count, bytes }] of [...byExt.entries()].sort((a, b) => b[1].bytes - a[1].bytes).slice(0, 8)) {
	console.log(`     ${(ext || '(no ext)').padEnd(8)} ${String(count).padStart(4)} 个  ${fmt(bytes)}`);
}
console.log(`   站内链接: 检查 ${seen.size} 条`);

if (warnings.length) {
	console.log('\n⚠️  警告:');
	warnings.forEach((w) => console.log(`   ${w}`));
}

if (failures.length) {
	console.log('\n✗ 断言失败:');
	failures.forEach((f) => console.log(`   ${f}`));
	process.exit(1);
}

console.log('\n✓ 全部断言通过');
