/**
 * CountdownCard — React 核心组件
 *
 * 架构：
 * - 客户端从 chinese-days 取今年剩余法定节假日（去重）
 * - 主题由 holidayThemes[name] 决定（颜色/装饰/排版/字体）
 * - 点击切换节日 + 主题（phase 状态机）
 * - 切换循环：节日列表 → 空状态（今年过完）→ 第一个
 * - milestones：默认动态计算（基于当前时间 + 目标日期），theme.milestones 可覆盖
 *
 * 不接收 props（holidays、date 等全部由客户端计算）
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// chinese-days 是 CommonJS 模块，必须用 default import
import chineseDays from 'chinese-days';
import {
	defaultTheme,
	getTheme,
	holidayThemes,
	themeToCssVars,
	type HolidayTheme,
	type MilestoneOverride,
} from '../../config/holidayThemes';
import * as styles from '../../styles/countdownCard.css';
import CountdownCardSkeleton from './CountdownCardSkeleton';

const { getHolidaysInRange, getDayDetail } = chineseDays;

/* ─────────── 类型 ─────────── */
interface HolidayItem {
	date: string; // YYYY-MM-DD
	name: string; // chinese-days 输出
	days: number; // 距离今天的天数
}

type Phase = 'entered' | 'leaving' | 'entering';

/* ─────────── 工具函数 ─────────── */
function daysBetween(target: Date): number {
	const now = new Date();
	const a = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
	const b = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
	return Math.max(0, Math.ceil((b - a) / 86_400_000));
}

function hoursLeftToday(): number {
	const now = new Date();
	const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
	return Math.max(0, Math.round((end.getTime() - now.getTime()) / 3_600_000));
}

function daysLeftThisWeek(target: Date): number {
	const now = new Date();
	const day = now.getDay() || 7; // 周日=7
	const daysToWeekEnd = 8 - day; // 距离本周日（作为周结束）的天数
	const t = new Date(target.getFullYear(), target.getMonth(), target.getDate());
	const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const dayDiff = Math.ceil((t.getTime() - todayZero.getTime()) / 86_400_000);
	if (dayDiff <= 0) return 0;
	if (dayDiff < daysToWeekEnd) return dayDiff;
	return Math.max(0, Math.min(7, daysToWeekEnd));
}

function daysLeftInMonth(target: Date): number {
	const now = new Date();
	const t = new Date(target.getFullYear(), target.getMonth(), target.getDate());
	const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const dayDiff = Math.ceil((t.getTime() - todayZero.getTime()) / 86_400_000);
	if (dayDiff <= 0) return 0;
	const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
	return Math.min(endOfMonth, dayDiff);
}

function daysLeftInYear(target: Date): number {
	const now = new Date();
	const t = new Date(target.getFullYear(), target.getMonth(), target.getDate());
	const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const dayDiff = Math.ceil((t.getTime() - todayZero.getTime()) / 86_400_000);
	if (dayDiff <= 0) return 0;
	const endOfYear = new Date(now.getFullYear(), 11, 31);
	const totalYearDays = Math.ceil((endOfYear.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86_400_000) + 1;
	return Math.min(totalYearDays, dayDiff);
}

function buildDefaultMilestones(target: Date): MilestoneOverride[] {
	return [
		{ label: '今日', total: 24, remaining: hoursLeftToday(), unit: '小时' },
		{ label: '本周', total: 7, remaining: daysLeftThisWeek(target), unit: '天' },
		{ label: '本月', total: new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate(), remaining: daysLeftInMonth(target), unit: '天' },
		{ label: '本年', total: 366, remaining: daysLeftInYear(target), unit: '天' },
	];
}

function fillPercent(total: number, remaining: number): number {
	if (total <= 0) return 0;
	return Math.max(0, Math.min(100, ((total - remaining) / total) * 100));
}

function formatDateZh(dateStr: string): string {
	return dateStr.replace(/-/g, '.');
}

/** 切换 state 后的真实时间间隔（避免 setTimeout 不准） */
const SWITCH_LEAVE_MS = 220;
const SWITCH_ENTER_MS = 280;

/* ─────────── 主组件 ─────────── */
export default function CountdownCard() {
	const [holidays, setHolidays] = useState<HolidayItem[]>([]);
	const [index, setIndex] = useState(0);
	const [phase, setPhase] = useState<Phase>('entered');
	const [ready, setReady] = useState(false);
	const enterTimer = useRef<number | null>(null);

	// 客户端加载 chinese-days 并取今年剩余法定节假日
	useEffect(() => {
		try {
			const now = new Date();
			const yearStart = new Date(now.getFullYear(), 0, 1);
			const yearEnd = new Date(now.getFullYear(), 11, 31);
			// includeWeekends=false: 仅取法定节假日（多天共享 name 时需要去重）
			const dates = getHolidaysInRange(yearStart, yearEnd, false);
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			const map = new Map<string, HolidayItem>();
			dates.forEach((d) => {
				const detail = getDayDetail(d);
				if (!detail || detail.work) return;
				// chinese-days 返回的 name 形如 "National Day,国庆节,3"，取中文段
				const cnName = (detail.name || '').split(',')[1]?.trim() || detail.name;
				if (!cnName) return;
				if (map.has(cnName)) return; // 去重（春节多天共享 name）
				const target = new Date(d);
				if (target.getTime() < today.getTime()) return; // 过滤已过
				map.set(cnName, { date: d, name: cnName, days: daysBetween(target) });
			});
			const list = Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
			setHolidays(list);
		} catch (err) {
			console.warn('[CountdownCard] failed to load chinese-days', err);
		} finally {
			setReady(true);
		}
	}, []);

	// items 包含空状态（最后一项）→ 循环切换
	const items = useMemo(() => holidays, [holidays]);
	const total = items.length + 1; // 包含空状态
	const isEmpty = ready && holidays.length > 0 && index === holidays.length;
	const current = !ready ? null : isEmpty ? null : items[index];
	const currentTheme: HolidayTheme = useMemo(() => {
		if (!current) return defaultTheme;
		return getTheme(current.name);
	}, [current]);

	// 切换中切换 phase
	const switchTo = useCallback((nextIndex: number) => {
		setPhase('leaving');
		if (enterTimer.current) window.clearTimeout(enterTimer.current);
		enterTimer.current = window.setTimeout(() => {
			setIndex(nextIndex);
			setPhase('entering');
			// 下一帧切到 entered（触发 enter 动画）
			requestAnimationFrame(() => {
				enterTimer.current = window.setTimeout(() => {
					setPhase('entered');
				}, SWITCH_ENTER_MS);
			});
		}, SWITCH_LEAVE_MS);
	}, []);

	const handleClick = useCallback(() => {
		if (phase !== 'entered' || !ready) return;
		switchTo((index + 1) % total);
	}, [phase, ready, index, total, switchTo]);

	useEffect(() => {
		return () => {
			if (enterTimer.current) window.clearTimeout(enterTimer.current);
		};
	}, []);

	// 计算大数字显示文本
	const heroText = useMemo(() => {
		if (!current) return { label: '', number: '' };
		const t = currentTheme.typography;
		const name = current.name;
		const n = current.days;
		if (t.layout === 'inline' && t.template) {
			return {
				label: '',
				number: t.template.replace('{name}', name).replace('{n}', String(n)),
			};
		}
		// stacked
		return { label: name, number: String(n) };
	}, [current, currentTheme]);

	// milestones
	const milestones = useMemo<MilestoneOverride[]>(() => {
		if (!current) return [];
		if (currentTheme.milestones) return currentTheme.milestones;
		return buildDefaultMilestones(new Date(current.date));
	}, [current, currentTheme]);

	// 大数字颜色
	const heroNumberStyle = useMemo(() => {
		const c = currentTheme.bigNumberColor;
		if (c === 'primary') return { color: 'var(--theme-primary)' };
		if (c === 'ink') return { color: 'var(--theme-ink)' };
		// 必须用 longhand backgroundImage，React 会把 background 简写拆成多个 longhand 导致 linear-gradient 丢失
		return {
			backgroundImage: 'linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-accent) 100%)',
			WebkitBackgroundClip: 'text' as const,
			WebkitTextFillColor: 'transparent' as const,
			backgroundClip: 'text' as const,
		};
	}, [currentTheme]);

	const cardClassName = `${styles.card} ${styles.cardResponsive} ${phase !== 'entered' ? styles.cardSwitching : ''}`;

	/* ─────────── 渲染：未就绪 → 渲染 SSR 同款骨架，避免 hydrate 后空白 ─────────── */
	if (!ready) {
		return <CountdownCardSkeleton />;
	}

	/* ─────────── 渲染：空状态 ─────────── */
	if (isEmpty) {
		return (
			<div
				className={cardClassName}
				role="button"
				tabIndex={0}
				aria-label="今年所有节假日都过完啦，点击查看明年"
				onClick={handleClick}
				style={themeToCssVars(defaultTheme)}
			>
				<div className={styles.empty}>
					<div className={styles.emptyDecor} aria-hidden="true">
						🌸
					</div>
					<p className={styles.emptyTitle}>今年所有节假日都过完啦</p>
					<p className={styles.emptySubtitle}>明年再会 · 期待新的假期</p>
					<p className={styles.emptyHint}>点击查看明年的第一个节日</p>
				</div>
			</div>
		);
	}

	if (!current) return null;

	/* ─────────── 渲染：正常节日卡片 ─────────── */
	const inline = currentTheme.typography.layout === 'inline';
	const isSeal = currentTheme.decor.type === 'seal';

	return (
		<div
			className={cardClassName}
			role="button"
			tabIndex={0}
			aria-label={`距离${current.name} ${current.days} 天`}
			onClick={handleClick}
			style={themeToCssVars(currentTheme)}
			data-welcome-card="countdown"
			data-holiday-name={current.name}
		>
			{isSeal ? (
				<div className={styles.decor} aria-hidden="true">
					<span className={styles.decorGlyph}>{currentTheme.decor.glyph}</span>
				</div>
			) : (
				<div className={styles.decorFloat} aria-hidden="true">
					{currentTheme.decor.glyph}
				</div>
			)}

			<header className={styles.header}>
				<span className={styles.eyebrow}>
					{currentTheme.decor.type === 'seal'
						? `${current.name} · ${holidayThemes[current.name] ? 'CN' : '假期'}`
						: `${current.name} · ${new Date().getFullYear()}`}
				</span>
				<span className={styles.eyebrowMeta}>
					{inline ? `${current.days} DAYS` : `距 ${new Date(current.date).getFullYear()}`}
				</span>
			</header>
			<hr className={styles.divider} />

			<div className={`${styles.body} ${inline ? styles.bodyInline : ''}`} key={`${current.date}-${phase}`}>
				{inline ? (
					<div className={styles.heroInline}>
						<p className={styles.heroInlineLabel}>距离下一个节日</p>
						<p className={styles.heroInlineNumber} style={heroNumberStyle}>
							{heroText.number}
						</p>
					</div>
				) : (
					<div className={styles.heroBlock}>
						<p className={styles.heroLabel}>距离{heroText.label}</p>
						<p className={styles.heroNumber} style={heroNumberStyle}>
							{heroText.number}
						</p>
						{currentTheme.typography.unit && (
							<p className={styles.heroUnit}>
								{currentTheme.typography.unit.split('·').map((part, i, arr) => (
									<span key={i}>
										{part.trim()}
										{i < arr.length - 1 && <span className={styles.heroUnitDot}> · </span>}
									</span>
								))}
							</p>
						)}
					</div>
				)}

				<ul className={styles.list}>
					{milestones.map((m, i) => {
						const pct = fillPercent(m.total, m.remaining);
						return (
							<li className={styles.row} key={`${current.date}-${i}-${m.label}`}>
								<span className={styles.label}>{m.label}</span>
								<div
									className={styles.track}
									role="progressbar"
									aria-valuemin={0}
									aria-valuemax={m.total}
									aria-valuenow={m.total - m.remaining}
									aria-label={`${m.label} 还剩 ${m.remaining} ${m.unit}`}
								>
									<div className={styles.fill} style={{ width: `${pct.toFixed(2)}%` }} />
									<span className={styles.textLayer}>
										<span className={styles.percent}>{pct.toFixed(2)}%</span>
										<span className={styles.remaining}>
											还剩 {m.remaining} {m.unit}
										</span>
									</span>
								</div>
							</li>
						);
					})}
				</ul>
			</div>

			<footer className={styles.footer}>
				<span className={styles.footerDate}>{formatDateZh(current.date)}</span>
				<span className={styles.footerMeta}>CST · {new Date().getFullYear()}</span>
				<span className={styles.footerDot} aria-hidden="true" />
			</footer>
		</div>
	);
}
