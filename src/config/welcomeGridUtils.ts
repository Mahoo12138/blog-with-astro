/**
 * welcomeGrid 配置工具
 *
 * 仅保留 SSR 渲染和未来工具脚本所需的核心函数。
 * 实时编辑/导入导出 UI 已被移除，配置通过修改 src/config/welcomeGridConfig.ts 完成。
 */

import type {
	WelcomeGridConfig,
	CardSpan,
	AnyCardItem,
} from './welcomeGrid';
import { welcomeGridConfig } from './welcomeGridConfig';

/**
 * 校验配置对象，发现错误抛出带路径的异常。
 * 只校验骨架 + 唯一性 + 行列合法性，不强制 props 内容。
 */
export function validateWelcomeGridConfig(input: unknown): WelcomeGridConfig {
	const errors: string[] = [];
	const config = input as Partial<WelcomeGridConfig>;

	if (!config || typeof config !== 'object') {
		throw new Error('配置必须是一个对象');
	}
	if (config.version !== 1) {
		errors.push(`不支持的 version: ${config.version}（仅支持 1）`);
	}
	if (!config.grid || typeof config.grid.columns !== 'number' || config.grid.columns < 1) {
		errors.push('grid.columns 必须是正整数');
	}
	if (!Array.isArray(config.items)) {
		errors.push('items 必须是数组');
		throw new Error(errors.join('；'));
	}

	const seenIds = new Set<string>();
	const validTypes = ['navigation', 'contact', 'poetry', 'countdown', 'sidebar'];

	config.items.forEach((item, index) => {
		const path = `items[${index}]`;
		if (!item || typeof item !== 'object') {
			errors.push(`${path}: 不是对象`);
			return;
		}
		if (!item.id || typeof item.id !== 'string') {
			errors.push(`${path}: 缺少 id`);
		} else if (seenIds.has(item.id)) {
			errors.push(`${path}: id 重复 (${item.id})`);
		} else {
			seenIds.add(item.id);
		}
		if (!validTypes.includes(item.type as string)) {
			errors.push(`${path}: 未知 type "${item.type}"`);
		}
		const span = item.span;
		if (!span || typeof span.col !== 'number' || typeof span.row !== 'number') {
			errors.push(`${path}: span 必须含 col 和 row`);
		} else {
			if (span.col < 1 || !Number.isInteger(span.col)) errors.push(`${path}.span.col 必须正整数`);
			if (span.row < 1 || !Number.isInteger(span.row)) errors.push(`${path}.span.row 必须正整数`);
			if (config.grid?.columns && span.col > config.grid.columns) {
				errors.push(`${path}.span.col 超过 grid.columns`);
			}
		}
	});

	if (errors.length) throw new Error(`配置校验失败：\n  ${errors.join('\n  ')}`);
	return config as WelcomeGridConfig;
}

/** 解析 JSON 字符串 → 校验 → 返回强类型配置（供脚本/测试使用） */
export function parseWelcomeGridJson(json: string): WelcomeGridConfig {
	return validateWelcomeGridConfig(JSON.parse(json));
}

/** 序列化为格式化 JSON（便于人工 diff 现有配置） */
export function stringifyWelcomeGridConfig(config: WelcomeGridConfig = welcomeGridConfig): string {
	return JSON.stringify(config, null, 2);
}

/** 过滤掉 hidden 项 */
export function visibleItems<T extends { hidden?: boolean }>(items: T[]): T[] {
	return items.filter((i) => !i.hidden);
}

/**
 * 解析窄屏 span：优先用 narrow 字段，否则用响应式覆盖，否则用桌面 span 转置（col/row 互换）。
 */
export function resolveNarrowSpan(item: AnyCardItem): CardSpan {
	const fromNarrow = item.narrow ?? item.responsive?.narrow;
	if (fromNarrow?.col !== undefined || fromNarrow?.row !== undefined) {
		return {
			col: fromNarrow.col ?? item.span.col,
			row: fromNarrow.row ?? item.span.row,
		};
	}
	// 默认转置：宽屏 8×4 → 窄屏 4×8
	return { col: item.span.row, row: item.span.col };
}

/**
 * 把卡片 span 序列化为 grid-area 内联 CSS 字符串，
 * 包含窄屏断点（<= 768px）的 @media 覆写。
 */
export function buildGridAreaStyle(item: AnyCardItem, gridColumns = 8): string {
	const wide = `grid-column: span ${Math.min(item.span.col, gridColumns)}; grid-row: span ${item.span.row};`;
	const narrow = resolveNarrowSpan(item);
	// 窄屏列数 = 宽屏行数（4 列固定）；窄屏行数取转置值
	const narrowCol = Math.min(narrow.col, item.span.row);
	return `${wide} @media (max-width: 768px) { grid-column: span ${narrowCol}; grid-row: span ${narrow.row}; }`;
}

/** 卡片渲染时使用的 span：根据当前断点（仅供组件内部判断使用） */
export function effectiveSpan(item: AnyCardItem, isNarrow: boolean): CardSpan {
	return isNarrow ? resolveNarrowSpan(item) : item.span;
}
