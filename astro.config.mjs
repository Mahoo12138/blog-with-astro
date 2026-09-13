// @ts-check

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { defineConfig } from 'astro/config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

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

// 不参与搜索引擎收录的功能页 / 私人页（与页面上的 robots noindex 保持一致）
const SITEMAP_EXCLUDE = [
	/\/search\/?$/,
	/\/mdx-components\/?$/,
	/\/love\/?$/,
	/\/privacy\/?$/,
	/\/terms\/?$/,
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
		rehypePlugins: [whenMathjax(rehypeKatex)],
		shikiConfig: {
			// 双主题走 css-variables 模式：Shiki 只内联一份共享 CSS 变量表，
			// 每个 token 输出 style="--shiki-light:...;--shiki-dark:..."，
			// 而不是把 light/dark 两套完整配色的具体色值各内联一遍。
			// 此前 themes:{light,dark} 模式会让代码块密集的页面 HTML 飙到 565KB。
			// 具体切换由 src/styles/theme.css.ts 的 [data-theme] 选择器负责。
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			defaultColor: false,
			cssVariablePrefix: '--shiki-',
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
