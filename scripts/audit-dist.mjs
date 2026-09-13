#!/usr/bin/env node
/**
 * 构建产物体检脚本。
 *
 * 覆盖 optimization-plan.md 第 6 节「验收方式」与 4.4「工程护栏」：
 *   1. 站内链接可达性（扫描 dist HTML 内部 href，断言目标存在）
 *   2. 图片体积预算（单文件不超过 200KB）
 *   3. dist 总量预算
 *   4. 关键隐私/收录断言（love 页不出现在索引与 sitemap）
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

/* ---------- 4. 报告 ---------- */
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
