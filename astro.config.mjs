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

// https://astro.build/config
export default defineConfig({
	output: 'static',
	site: 'https://mahoo12138.cn',
	integrations: [mdx(), react(), sitemap(), pagefind()],
	markdown: {
		remarkPlugins: [whenMathjax(remarkMath)],
		rehypePlugins: [whenMathjax(rehypeKatex)],
		shikiConfig: {
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
