export const namedColors = {
	accent: '#2196f3',
	blue: '#3b82f6',
	cyan: '#06b6d4',
	green: '#22c55e',
	orange: '#f97316',
	yellow: '#eab308',
	red: '#ef4444',
	pink: '#ec4899',
	purple: '#a855f7',
	gray: '#64748b',
} as const;

export type NamedColor = keyof typeof namedColors;

export const tonePresets = {
	info: {
		name: 'info',
		label: 'Info',
		color: namedColors.blue,
		symbol: 'i',
	},
	tip: {
		name: 'tip',
		label: 'Tip',
		color: namedColors.green,
		symbol: '!',
	},
	success: {
		name: 'success',
		label: 'Success',
		color: namedColors.green,
		symbol: '✓',
	},
	warn: {
		name: 'warn',
		label: 'Warning',
		color: '#f59e0b',
		symbol: '!',
	},
	danger: {
		name: 'danger',
		label: 'Danger',
		color: namedColors.red,
		symbol: 'x',
	},
	purple: {
		name: 'purple',
		label: 'Note',
		color: namedColors.purple,
		symbol: '*',
	},
} as const;

export type ToneName = keyof typeof tonePresets | 'warning';

export function resolveColor(color: string | undefined, fallback: string = namedColors.accent) {
	if (!color) return fallback;
	return namedColors[color as NamedColor] ?? color;
}

export function resolveTone(tone: ToneName | undefined) {
	const normalizedTone = tone === 'warning' ? 'warn' : tone ?? 'info';
	return tonePresets[normalizedTone] ?? tonePresets.info;
}

export function translucent(color: string, amount = 14) {
	if (/^#[0-9a-f]{6}$/i.test(color)) {
		const alpha = Math.round((amount / 100) * 255).toString(16).padStart(2, '0');
		return `${color}${alpha}`;
	}

	if (/^#[0-9a-f]{3}$/i.test(color)) {
		const expanded = color
			.slice(1)
			.split('')
			.map((part) => part + part)
			.join('');
		const alpha = Math.round((amount / 100) * 255).toString(16).padStart(2, '0');
		return `#${expanded}${alpha}`;
	}

	return `color-mix(in srgb, ${color} ${amount}%, transparent)`;
}

export function styleVars(values: Record<string, string | number | undefined | false>) {
	return Object.entries(values)
		.filter((entry): entry is [string, string | number] => entry[1] !== undefined && entry[1] !== false)
		.map(([key, value]) => `${key}:${value};`)
		.join('');
}

export function linkAttrs(href: string, external?: boolean) {
	const isExternal = external ?? /^(https?:)?\/\//i.test(href);
	return {
		isExternal,
		target: isExternal ? '_blank' : undefined,
		rel: isExternal ? 'external nofollow noopener noreferrer' : undefined,
	};
}

export function slugifyId(value: string) {
	return value
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9\u4e00-\u9fa5_-]/g, '');
}