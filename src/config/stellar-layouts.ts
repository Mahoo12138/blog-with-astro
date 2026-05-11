export type StellarLayoutKey = 'default' | 'wide' | 'blank';
export type StellarLayoutMotion = 'none' | 'fade-up' | 'slide-left' | 'scale-in';

export interface StellarLayoutSidebarConfig {
	visible?: boolean;
	track?: string;
	width?: string;
	shift?: string;
}

export interface StellarLayoutFooterConfig {
	visible?: boolean;
}

export interface StellarLayoutMainConfig {
	minWidth?: string;
	width?: string;
	wideWidth?: string;
	ultraWidth?: string;
	paddingTop?: string;
	paddingBottom?: string;
}

export interface StellarLayoutAnimationConfig {
	preset?: StellarLayoutMotion;
	duration?: string;
	easing?: string;
	delay?: string;
}

export interface StellarLayoutConfig {
	name?: string;
	columns?: string;
	gap?: string;
	compactGap?: string;
	leftbar?: StellarLayoutSidebarConfig;
	rightbar?: StellarLayoutSidebarConfig;
	main?: StellarLayoutMainConfig;
	footer?: StellarLayoutFooterConfig;
	animation?: StellarLayoutAnimationConfig;
}

export type StellarLayoutInput = StellarLayoutKey | StellarLayoutConfig | undefined;

const layoutPresets: Record<StellarLayoutKey, StellarLayoutConfig> = {
	default: {
		name: 'default',
		gap: '64px',
		compactGap: '32px',
		leftbar: { visible: true, width: '288px' },
		rightbar: { visible: true, width: '288px' },
		main: { minWidth: '200px', width: '720px', wideWidth: '780px', ultraWidth: '860px', paddingTop: '32px', paddingBottom: '32px' },
		footer: { visible: true },
		animation: { preset: 'none', duration: '360ms', easing: 'cubic-bezier(0.22, 1, 0.36, 1)', delay: '0ms' },
	},
	wide: {
		name: 'wide',
		columns: 'minmax(368px, 0.58fr) minmax(240px, var(--stellar-main-width)) minmax(0, 0.42fr)',
		gap: '40px',
		compactGap: '24px',
		leftbar: { visible: true, width: '288px', shift: '-32px' },
		rightbar: { visible: false, width: '288px' },
		main: { minWidth: '240px', width: '960px', wideWidth: '1040px', ultraWidth: '1160px', paddingTop: '32px', paddingBottom: '32px' },
		footer: { visible: true },
		animation: { preset: 'slide-left', duration: '460ms', easing: 'cubic-bezier(0.22, 1, 0.36, 1)', delay: '40ms' },
	},
	blank: {
		name: 'blank',
		columns: 'minmax(0, 1fr)',
		gap: '0px',
		compactGap: '0px',
		leftbar: { visible: false, width: '0px' },
		rightbar: { visible: false, width: '0px' },
		main: { minWidth: '0px', width: '100%', wideWidth: '100%', ultraWidth: '100%', paddingTop: '0px', paddingBottom: '0px' },
		footer: { visible: false },
		animation: { preset: 'scale-in', duration: '380ms', easing: 'cubic-bezier(0.22, 1, 0.36, 1)', delay: '0ms' },
	},
};

function mergeLayout(base: StellarLayoutConfig, override: StellarLayoutConfig): StellarLayoutConfig {
	return {
		...base,
		...override,
		leftbar: { ...base.leftbar, ...override.leftbar },
		rightbar: { ...base.rightbar, ...override.rightbar },
		main: { ...base.main, ...override.main },
		footer: { ...base.footer, ...override.footer },
		animation: { ...base.animation, ...override.animation },
	};
}

export function resolveStellarLayout(layout: StellarLayoutInput = 'default') {
	const resolvedLayout = typeof layout === 'string' ? (layoutPresets[layout] ?? layoutPresets.default) : mergeLayout(layoutPresets.default, layout);
	const main = resolvedLayout.main ?? layoutPresets.default.main;
	const leftbar = resolvedLayout.leftbar ?? layoutPresets.default.leftbar;
	const rightbar = resolvedLayout.rightbar ?? layoutPresets.default.rightbar;
	const animation = resolvedLayout.animation ?? layoutPresets.default.animation;
	const columns = resolvedLayout.columns ?? `1fr minmax(${main?.minWidth ?? '200px'}, var(--stellar-main-width)) 1fr`;

	return {
		...resolvedLayout,
		leftbar,
		rightbar,
		main,
		footer: resolvedLayout.footer ?? layoutPresets.default.footer,
		animation,
		style: [
			`--stellar-layout-columns:${columns}`,
			`--stellar-main-min-width:${main?.minWidth ?? '200px'}`,
			`--stellar-main-width:${main?.width ?? '720px'}`,
			`--stellar-main-wide-width:${main?.wideWidth ?? main?.width ?? '780px'}`,
			`--stellar-main-ultra-width:${main?.ultraWidth ?? main?.wideWidth ?? main?.width ?? '860px'}`,
			`--stellar-shell-gap:${resolvedLayout.gap ?? '64px'}`,
			`--stellar-shell-compact-gap:${resolvedLayout.compactGap ?? '32px'}`,
			`--stellar-sidebar-width:${leftbar?.width ?? '288px'}`,
			`--stellar-rightbar-width:${rightbar?.width ?? leftbar?.width ?? '288px'}`,
			`--stellar-left-shift:${leftbar?.shift ?? '0px'}`,
			`--stellar-right-shift:${rightbar?.shift ?? '0px'}`,
			`--stellar-main-padding-top:${main?.paddingTop ?? '32px'}`,
			`--stellar-main-padding-bottom:${main?.paddingBottom ?? '32px'}`,
			`--stellar-layout-duration:${animation?.duration ?? '360ms'}`,
			`--stellar-layout-easing:${animation?.easing ?? 'ease'}`,
			`--stellar-layout-delay:${animation?.delay ?? '0ms'}`,
		].join(';'),
	};
}