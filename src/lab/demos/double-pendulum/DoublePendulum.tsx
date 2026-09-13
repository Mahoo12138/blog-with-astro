import { useEffect, useRef, useState } from 'react';
import * as styles from './demo.css';

/**
 * 双摆混沌仿真（React island 路线的样板）。
 *
 * 与原生路线的分工：React 只负责「控制面板 + 渲染循环的外壳」，
 * 数值积分和 canvas 绘制仍然是命令式代码放在 ref 里跑，
 * 不让 60fps 的状态更新去惊动 React 的 reconciler。
 * 参数变化会重建 effect（换一组方程），但仿真状态存在 ref 里不会丢。
 */

interface Params {
	m1: number;
	m2: number;
	l1: number;
	l2: number;
	g: number;
	damping: number;
	trail: boolean;
	twin: boolean;
}

interface State {
	a1: number;
	a2: number;
	w1: number;
	w2: number;
}

const INITIAL: State = { a1: Math.PI * 0.75, a2: Math.PI * 0.5, w1: 0, w2: 0 };
/** 孪生摆的初始扰动：一点点就够，剩下的交给指数分离 */
const TWIN_OFFSET = 1e-3;
const SUB_STEP = 1 / 240;
const TRAIL_LIMIT = 900;

function cloneState(state: State): State {
	return { ...state };
}

/** 拉格朗日方程解出的角加速度（质点 + 无质量刚性杆） */
function derivative(s: State, p: Params): State {
	const { m1, m2, l1, l2, g, damping } = p;
	const d = s.a1 - s.a2;
	const den = 2 * m1 + m2 - m2 * Math.cos(2 * d);

	const a1dd =
		(-g * (2 * m1 + m2) * Math.sin(s.a1) -
			m2 * g * Math.sin(s.a1 - 2 * s.a2) -
			2 * Math.sin(d) * m2 * (s.w2 * s.w2 * l2 + s.w1 * s.w1 * l1 * Math.cos(d))) /
		(l1 * den);
	const a2dd =
		(2 *
			Math.sin(d) *
			(s.w1 * s.w1 * l1 * (m1 + m2) +
				g * (m1 + m2) * Math.cos(s.a1) +
				s.w2 * s.w2 * l2 * m2 * Math.cos(d))) /
		(l2 * den);

	return {
		a1: s.w1,
		a2: s.w2,
		w1: a1dd - damping * s.w1,
		w2: a2dd - damping * s.w2,
	};
}

function advance(state: State, delta: State, h: number): State {
	return {
		a1: state.a1 + delta.a1 * h,
		a2: state.a2 + delta.a2 * h,
		w1: state.w1 + delta.w1 * h,
		w2: state.w2 + delta.w2 * h,
	};
}

/** 经典 RK4：双摆对步长敏感，欧拉法跑几秒就飞了 */
function rk4(state: State, p: Params, dt: number): State {
	const k1 = derivative(state, p);
	const k2 = derivative(advance(state, k1, dt / 2), p);
	const k3 = derivative(advance(state, k2, dt / 2), p);
	const k4 = derivative(advance(state, k3, dt), p);

	return {
		a1: state.a1 + (dt / 6) * (k1.a1 + 2 * k2.a1 + 2 * k3.a1 + k4.a1),
		a2: state.a2 + (dt / 6) * (k1.a2 + 2 * k2.a2 + 2 * k3.a2 + k4.a2),
		w1: state.w1 + (dt / 6) * (k1.w1 + 2 * k2.w1 + 2 * k3.w1 + k4.w1),
		w2: state.w2 + (dt / 6) * (k1.w2 + 2 * k2.w2 + 2 * k3.w2 + k4.w2),
	};
}

const DEFAULT_PARAMS: Params = {
	m1: 1,
	m2: 1,
	l1: 1,
	l2: 0.9,
	g: 9.81,
	damping: 0,
	trail: true,
	twin: true,
};

export default function DoublePendulum() {
	const [params, setParams] = useState<Params>(DEFAULT_PARAMS);
	const [running, setRunning] = useState(true);
	const [readout, setReadout] = useState({ time: 0, delta: 0 });

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
	const stateRef = useRef<State>(cloneState(INITIAL));
	const twinRef = useRef<State>({ ...INITIAL, a1: INITIAL.a1 + TWIN_OFFSET });
	const trailRef = useRef<{ x: number; y: number }[]>([]);
	const timeRef = useRef(0);
	const accRef = useRef(0);
	const drawRef = useRef<() => void>(() => {});

	const reset = (next: State = INITIAL) => {
		stateRef.current = cloneState(next);
		twinRef.current = { ...next, a1: next.a1 + TWIN_OFFSET };
		trailRef.current = [];
		timeRef.current = 0;
		accRef.current = 0;
		setReadout({ time: 0, delta: 0 });
		drawRef.current();
	};

	// reduced-motion：首次进入就停住（服务端渲染时拿不到 matchMedia，只能放到 effect 里）
	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setRunning(false);
	}, []);

	// 尺寸 / DPR：ResizeObserver 监听 canvas 盒子，全屏切换也能跟上
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const apply = () => {
			const rect = canvas.getBoundingClientRect();
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const width = Math.max(1, Math.round(rect.width));
			const height = Math.max(1, Math.round(rect.height));
			if (width === sizeRef.current.width && height === sizeRef.current.height && dpr === sizeRef.current.dpr) return;

			sizeRef.current = { width, height, dpr };
			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(height * dpr);
			canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
			drawRef.current();
		};

		apply();
		const observer = new ResizeObserver(apply);
		observer.observe(canvas);
		return () => observer.disconnect();
	}, []);

	// 渲染 + 积分循环
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const draw = () => {
			const { width, height } = sizeRef.current;
			if (!width || !height) return;

			ctx.fillStyle = '#0b1220';
			ctx.fillRect(0, 0, width, height);

			const originX = width / 2;
			const originY = height * 0.34;
			const scale = (Math.min(width, height) * 0.3) / (params.l1 + params.l2);

			// 轨迹：整条一次描完，不做逐段渐变（900 段 stroke 太贵）
			if (params.trail && trailRef.current.length > 1) {
				ctx.save();
				ctx.globalAlpha = 0.4;
				ctx.strokeStyle = '#7ecbff';
				ctx.lineWidth = 1.2;
				ctx.beginPath();
				trailRef.current.forEach((point, index) => {
					const x = originX + point.x * scale;
					const y = originY + point.y * scale;
					if (index === 0) ctx.moveTo(x, y);
					else ctx.lineTo(x, y);
				});
				ctx.stroke();
				ctx.restore();
			}

			const drawPendulum = (s: State, color: string, lineWidth: number, bobRadius: number) => {
				const x1 = originX + Math.sin(s.a1) * params.l1 * scale;
				const y1 = originY + Math.cos(s.a1) * params.l1 * scale;
				const x2 = x1 + Math.sin(s.a2) * params.l2 * scale;
				const y2 = y1 + Math.cos(s.a2) * params.l2 * scale;

				ctx.strokeStyle = color;
				ctx.lineWidth = lineWidth;
				ctx.lineCap = 'round';
				ctx.beginPath();
				ctx.moveTo(originX, originY);
				ctx.lineTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.stroke();

				ctx.fillStyle = color;
				ctx.beginPath();
				ctx.arc(x1, y1, bobRadius, 0, Math.PI * 2);
				ctx.fill();
				ctx.beginPath();
				ctx.arc(x2, y2, bobRadius * 1.2, 0, Math.PI * 2);
				ctx.fill();
			};

			if (params.twin) drawPendulum(twinRef.current, '#ffb86b', 1.6, 4.5);
			drawPendulum(stateRef.current, '#7ecbff', 2.4, 6);

			// 支点
			ctx.fillStyle = 'rgba(226, 232, 240, 0.7)';
			ctx.beginPath();
			ctx.arc(originX, originY, 3, 0, Math.PI * 2);
			ctx.fill();
		};

		drawRef.current = draw;

		let raf = 0;
		let last = 0;
		let uiAcc = 0;

		const loop = (now: number) => {
			raf = requestAnimationFrame(loop);
			if (!last) last = now;
			const dt = Math.min((now - last) / 1000, 0.05);
			last = now;

			if (running) {
				accRef.current += dt;
				let budget = 40;
				while (accRef.current >= SUB_STEP && budget > 0) {
					stateRef.current = rk4(stateRef.current, params, SUB_STEP);
					twinRef.current = rk4(twinRef.current, params, SUB_STEP);
					accRef.current -= SUB_STEP;
					budget -= 1;
					timeRef.current += SUB_STEP;

					const s = stateRef.current;
					const point = {
						x: Math.sin(s.a1) * params.l1 + Math.sin(s.a2) * params.l2,
						y: Math.cos(s.a1) * params.l1 + Math.cos(s.a2) * params.l2,
					};
					trailRef.current.push(point);
					if (trailRef.current.length > TRAIL_LIMIT) trailRef.current.shift();
				}
				if (accRef.current > 0.25) accRef.current = 0; // 落后太多就丢帧，别雪崩
			}

			draw();

			uiAcc += dt;
			if (uiAcc > 0.2) {
				uiAcc = 0;
				setReadout({
					time: timeRef.current,
					delta: Math.abs(stateRef.current.a1 - twinRef.current.a1),
				});
			}
		};

		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, [params, running]);

	// 舞台工具栏的「重置」按钮：LabStage 把事件派发在 [data-lab-stage] 上
	useEffect(() => {
		const stage = canvasRef.current?.closest('[data-lab-stage]');
		if (!stage) return;
		const onReset = () => reset();
		stage.addEventListener('lab:reset', onReset);
		return () => stage.removeEventListener('lab:reset', onReset);
	}, []);

	const update = <K extends keyof Params>(key: K, value: Params[K]) => {
		setParams((prev) => ({ ...prev, [key]: value }));
	};

	const randomize = () => {
		reset({
			a1: (Math.random() * 2 - 1) * Math.PI,
			a2: (Math.random() * 2 - 1) * Math.PI,
			w1: 0,
			w2: 0,
		});
		setRunning(true);
	};

	return (
		<div className={styles.root}>
			<canvas ref={canvasRef} className={styles.canvas} role="img" aria-label="双摆运动仿真，橙色为相差千分之一弧度的孪生摆" />
			<div className={styles.controls} data-pagefind-ignore>
				<label className={styles.field}>
					<span className={styles.fieldLabel}>m₁ 质量</span>
					<input
						className={styles.range}
						type="range"
						min={0.2}
						max={3}
						step={0.1}
						value={params.m1}
						onChange={(event) => update('m1', Number(event.target.value))}
					/>
					<span className={styles.fieldValue}>{params.m1.toFixed(1)}</span>
				</label>
				<label className={styles.field}>
					<span className={styles.fieldLabel}>m₂ 质量</span>
					<input
						className={styles.range}
						type="range"
						min={0.2}
						max={3}
						step={0.1}
						value={params.m2}
						onChange={(event) => update('m2', Number(event.target.value))}
					/>
					<span className={styles.fieldValue}>{params.m2.toFixed(1)}</span>
				</label>
				<label className={styles.field}>
					<span className={styles.fieldLabel}>l₁ 摆长</span>
					<input
						className={styles.range}
						type="range"
						min={0.3}
						max={1.5}
						step={0.05}
						value={params.l1}
						onChange={(event) => update('l1', Number(event.target.value))}
					/>
					<span className={styles.fieldValue}>{params.l1.toFixed(2)}</span>
				</label>
				<label className={styles.field}>
					<span className={styles.fieldLabel}>l₂ 摆长</span>
					<input
						className={styles.range}
						type="range"
						min={0.3}
						max={1.5}
						step={0.05}
						value={params.l2}
						onChange={(event) => update('l2', Number(event.target.value))}
					/>
					<span className={styles.fieldValue}>{params.l2.toFixed(2)}</span>
				</label>
				<label className={styles.field}>
					<span className={styles.fieldLabel}>重力 g</span>
					<input
						className={styles.range}
						type="range"
						min={1}
						max={25}
						step={0.1}
						value={params.g}
						onChange={(event) => update('g', Number(event.target.value))}
					/>
					<span className={styles.fieldValue}>{params.g.toFixed(1)}</span>
				</label>
				<label className={styles.field}>
					<span className={styles.fieldLabel}>阻尼</span>
					<input
						className={styles.range}
						type="range"
						min={0}
						max={0.5}
						step={0.005}
						value={params.damping}
						onChange={(event) => update('damping', Number(event.target.value))}
					/>
					<span className={styles.fieldValue}>{params.damping.toFixed(3)}</span>
				</label>

				<div className={styles.row}>
					<button
						className={[styles.button, styles.primary].join(' ')}
						type="button"
						onClick={() => setRunning((value) => !value)}
						aria-pressed={running}
					>
						{running ? '暂停' : '继续'}
					</button>
					<button className={styles.button} type="button" onClick={() => reset()}>
						重置
					</button>
					<button className={styles.button} type="button" onClick={randomize}>
						随机初始角
					</button>
					<label className={styles.check}>
						<input type="checkbox" checked={params.trail} onChange={(event) => update('trail', event.target.checked)} />
						轨迹
					</label>
					<label className={styles.check}>
						<input type="checkbox" checked={params.twin} onChange={(event) => update('twin', event.target.checked)} />
						孪生摆
					</label>
					<span className={styles.legend}>
						<span>
							<i className={styles.legendDot} style={{ background: '#7ecbff' }} />
							主摆
						</span>
						{params.twin && (
							<span>
								<i className={styles.legendDot} style={{ background: '#ffb86b' }} />
								孪生（Δθ₀ = 1e-3）
							</span>
						)}
					</span>
					<span className={styles.readout}>
						<span>t = {readout.time.toFixed(1)}s</span>
						{params.twin && <span>|Δθ₁| = {readout.delta.toExponential(2)} rad</span>}
					</span>
				</div>
			</div>
		</div>
	);
}
