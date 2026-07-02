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
function whenMathjax(plugin) {
	return function (...options) {
		const transformer = plugin(...options);
		return function (tree, file) {
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
	vite: {
		plugins: [vanillaExtractPlugin({ identifiers: 'debug' })],
	},
});
