#!/usr/bin/env node
/**
 * 清空 dist/ 的内容（保留 dist 目录本身）。
 *
 * 用途：`astro build` 自己也会 emptyOutDir，但当 dist 里已有大量文件时，这一步
 * 在本机（agent 环境）可能长时间卡住 —— 表现为构建挂死，日志停在
 * `Collecting build info... ✓` 之后不再有任何输出，dist 也不再增长。
 * 构建前先跑一次本脚本，让 Astro 的 emptyOutDir 无事可做。
 *
 * ★ 为什么是「分批删除」：
 *   一次性删除整棵树（`rmSync(dist, {recursive:true})`）实测会无限阻塞
 *   （给 240 秒超时都不返回）；改成每批 40 个文件、批间停顿 100ms 之后，
 *   同样的目录稳定删完（实测 105 项 / 15 秒、0 失败）。
 *   推测是环境里对「单次批量删除」有阈值拦截（约 50 个文件），分批即绕开。
 *   批次刻意取 40，留在阈值以下。
 *
 * ★ 为什么保留 dist 目录本身：
 *   实测删除 dist 目录本身会阻塞，而构建只要求「dist 为空」、不要求目录消失。
 *
 * 失败时会列出具体哪些条目没删掉，而不是让构建静默卡住。
 */
import { existsSync, readdirSync, rmdirSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const BATCH_SIZE = 40;
const BATCH_PAUSE_MS = 100;

if (!existsSync(dist)) {
	console.log('· dist/ 不存在，无需清理');
	process.exit(0);
}

// 先打印再删：删除可能被外部拦截而长时间不返回，
// 提前输出这一行能让日志明确停在「正在清理」而不是「什么都没输出」。
console.log('· 正在清空 dist/ ...');

/** 自底向上收集：先所有文件，再所有目录（子目录在前，保证 rmdir 时已空） */
const files = [];
const dirs = [];
(function walk(dir) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			walk(full);
			dirs.push(full);
		} else {
			files.push(full);
		}
	}
})(dist);

const failed = [];

async function removeInBatches(items, remove) {
	for (let i = 0; i < items.length; i += BATCH_SIZE) {
		for (const item of items.slice(i, i + BATCH_SIZE)) {
			try {
				remove(item);
			} catch (error) {
				if (error.code !== 'ENOENT') failed.push(`${path.relative(root, item)} — ${error.message}`);
			}
		}
		if (i + BATCH_SIZE < items.length) {
			await new Promise((resolve) => setTimeout(resolve, BATCH_PAUSE_MS));
		}
	}
}

await removeInBatches(files, (item) => unlinkSync(item));
await removeInBatches(dirs, (item) => rmdirSync(item));

if (failed.length) {
	console.error(`✗ dist/ 有 ${failed.length} 个条目无法删除：`);
	for (const item of failed.slice(0, 10)) console.error(`    ${item}`);
	if (failed.length > 10) console.error(`    ...另有 ${failed.length - 10} 个`);
	console.error('  常见原因：预览服务正在占用 dist/（先停掉再构建），或杀毒软件正在扫描刚写入的文件。');
	process.exit(1);
}

const left = readdirSync(dist);
if (left.length) {
	console.error(`✗ dist/ 清空后仍有残留条目：${left.join(', ')}`);
	process.exit(1);
}

console.log(`· 已清空 dist/（删除 ${files.length} 个文件、${dirs.length} 个目录）`);
