// @ts-check

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { rehypeCodeBlock } from './src/plugins/rehype-code-block.mjs';

// Only run math plugins on posts whose frontmatter sets mathjax: true,
// so plain `$` in code/prose in other posts is left untouched.
function whenMathjax(/** @type {any} */ plugin) {
	return function (/** @type {any[]} */ ...options) {
		const transformer = plugin(...options);
		return function (/** @type {any} */ tree, /** @type {any} */ file) {
			if (file?.data?.astro?.frontmatter?.mathjax === true) {
				return transformer(tree, file);
			}
		};
	};
}

/**
 * 找出属于专栏的文章 id。
 *
 * 这些文章的旧地址 /post/<id>/ 现在只是跳转桩页（见 src/pages/post/[...slug].astro），
 * 不能让它们进 sitemap —— 否则搜索引擎会把跳转页当成正式内容收录，
 * 与页面上已有的 noindex 自相矛盾。
 *
 * 之所以在 config 阶段直接读 frontmatter：sitemap 的 filter 只拿得到 URL，
 * 而 Astro 的内容集合此时还没加载，拿不到 columnId。
 */
function readColumnChapterIds() {
	const dir = new URL('./src/content/posts/', import.meta.url);
	const ids = [];

	for (const name of readdirSync(dir)) {
		if (!/\.mdx?$/.test(name)) {
			continue;
		}
		const source = readFileSync(new URL(name, dir), 'utf8');
		const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
		// 只认 frontmatter 里的 columnId：正文代码块里也可能出现这个字段名
		if (frontmatter && /^columnId:\s*\S/m.test(frontmatter[1])) {
			ids.push(name.replace(/\.mdx?$/, ''));
		}
	}

	return ids;
}

/** @param {string} value */
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const columnChapterIds = readColumnChapterIds();
const columnChapterStubPattern = columnChapterIds.length
	? new RegExp(`^/post/(?:${columnChapterIds.map(escapeRegExp).join('|')})/?$`)
	: null;

// 不参与搜索引擎收录的功能页 / 私人页（与页面上的 robots noindex 保持一致）
const SITEMAP_EXCLUDE = [
	/\/search\/?$/,
	/\/mdx-components\/?$/,
	/\/love\/?$/,
	/\/privacy\/?$/,
	/\/terms\/?$/,
	...(columnChapterStubPattern ? [columnChapterStubPattern] : []),
];

// https://astro.build/config
export default defineConfig({
	output: 'static',
	site: 'https://mahoo12138.cn',
	integrations: [
		mdx(),
		react(),
		sitemap({
			filter: (page) => !SITEMAP_EXCLUDE.some((pattern) => pattern.test(new URL(page).pathname)),
		}),
		pagefind(),
	],
	markdown: {
		remarkPlugins: [whenMathjax(remarkMath)],
		// rehypeCodeBlock 给代码块套外壳（语言标签 + 复制按钮）。
		// 它无条件执行，且依赖 Shiki 已跑完 —— Astro 的管线里 rehypeShiki
		// 本就在用户 rehypePlugins 之前，所以拿到的是带 data-language 的高亮结果。
		// 详见 src/plugins/rehype-code-block.mjs 顶部注释。
		rehypePlugins: [whenMathjax(rehypeKatex), rehypeCodeBlock],
		shikiConfig: {
			// 双主题（light + dark）时 Shiki 会为每个 token 输出
			//   style="color:#xxx;--shiki-dark:#yyy"
			// 即每个 token 内联两份颜色。这是代码块密集页面 HTML 偏大的主因，
			// 但它同时是「零 JS、无闪烁、跟随 data-theme」的最省事方案。
			//
			// 实测过 themes + defaultColor:false（纯 css-variables 模式）：token 变成
			//   style="--shiki-light:#xxx;--shiki-dark:#yyy;--shiki-light-bg:...;--shiki-dark-bg:..."
			// 每个 token 要带 4 个变量名，比双色值更长，页面上反而增大 ~10%（565KB → 619KB）。
			//
			// 真正能显著缩小体积的做法是「按需高亮 + 单主题」，代价是暗色模式代码配色不再独立。
			// 这里选择保留双主题：体积换体验，且 HTML 已在 gzip 后大幅收敛。
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			langAlias: {
				C: 'c',
				Kotlin: 'kotlin',
				ejs: 'html',
				env: 'dotenv',
				error: 'plaintext',
				react: 'jsx',
				ty: 'plaintext',
			},
			wrap: true,
		},
	},
	// 生产构建（build/preview/check）使用短 class identifier 减小 HTML/CSS 体积；
	// 开发（dev）保留 debug identifier 便于在 DOM 里定位样式来源。
	// 注：astro.config 在命令解析前求值，这里通过 argv 区分 dev 与其余命令。
	vite: {
		plugins: [vanillaExtractPlugin({ identifiers: process.argv[2] === 'dev' ? 'debug' : 'short' })],
	},
});
