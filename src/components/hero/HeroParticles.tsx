import { useEffect, useRef } from 'react';

// ── Types ──────────────────────────────────────────────

interface Particle3D {
	x: number;
	y: number;
	z: number;
	vx: number;
	vy: number;
	vz: number;
	colorIdx: number; // 粒子颜色索引（对应 palette.colors）
	baseSize: number; // 个体大小倍率（0.6~1.6），金色粒子更大
	phase: number; // 闪烁相位偏移
	twinkleSpeed: number; // 闪烁频率
}

interface Projected {
	x: number;
	y: number;
	scale: number;
	depth: number;
	colorIdx: number;
	baseSize: number;
	twinkle: number;
}

// ── Constants ──────────────────────────────────────────

const FIELD_SIZE = 400;
const CAMERA_DIST = 600;
const FOCAL_LENGTH = 500;
const CONNECTION_DIST = 130;
const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;
const ROTATION_SPEED = 0.0008;
const MOUSE_RADIUS = 130;
const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;
const MOUSE_FORCE = 35;

// ── Palette ────────────────────────────────────────────
// 四色调色板模拟真实恒星类型：蓝（主序星）、青（巨星）、紫（矮星）、金（亮星）
interface Palette {
	colors: string[];
	goldIdx: number;
}

function getPalette(dark: boolean): Palette {
	return dark
		? {
				colors: ['126, 203, 255', '94, 234, 212', '167, 139, 250', '251, 191, 36'],
				goldIdx: 3,
			}
		: {
				colors: ['33, 150, 243', '14, 165, 233', '139, 92, 246', '245, 158, 11'],
				goldIdx: 3,
			};
}

function isDarkTheme(): boolean {
	const theme = document.documentElement.getAttribute('data-theme');
	if (theme === 'dark') return true;
	if (theme === 'light') return false;
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// 加权取色：45% 蓝、25% 青、20% 紫、10% 金（金色为罕见亮星）
function pickColorIdx(): number {
	const r = Math.random();
	if (r < 0.45) return 0;
	if (r < 0.70) return 1;
	if (r < 0.90) return 2;
	return 3;
}

// ── Component ──────────────────────────────────────────

export default function HeroParticles() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// reduced-motion：完全停掉粒子，不进入 RAF 循环
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) return;

		// 移动端降级：粒子数量减半，降低 CPU/GPU 压力
		const isMobile = window.matchMedia('(max-width: 768px)').matches;
		const particleCount = isMobile ? 36 : 80;

		let raf = 0;
		let angle = 0;
		let mouseX = 0;
		let mouseY = 0;
		let targetMouseX = 0;
		let targetMouseY = 0;
		// 鼠标在 canvas 内的屏幕坐标，用于粒子排斥力场
		let mouseScreenX = -9999;
		let mouseScreenY = -9999;
		let W = 0;
		let H = 0;
		let cx = 0;
		let cy = 0;
		let dpr = 1;
		let visible = true;
		let pageVisible = !document.hidden;
		let lastDark = isDarkTheme();
		let palette = getPalette(lastDark);
		let frameCount = 0;

		function resize() {
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();
			// 限制 DPR，避免高 DPI 屏幕上 canvas 像素量翻倍带来的绘制开销
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			W = rect.width;
			H = rect.height;
			canvas.width = W * dpr;
			canvas.height = H * dpr;
			if (ctx) {
				ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			}
			cx = W / 2;
			cy = H / 2;
		}

		// 初始化粒子 — 每颗粒子有独立的颜色、大小、闪烁参数
		const particles: Particle3D[] = [];
		for (let i = 0; i < particleCount; i++) {
			const colorIdx = pickColorIdx();
			const isGold = colorIdx === palette.goldIdx;
			particles.push({
				x: (Math.random() - 0.5) * FIELD_SIZE * 2,
				y: (Math.random() - 0.5) * FIELD_SIZE * 2,
				z: (Math.random() - 0.5) * FIELD_SIZE * 2,
				vx: (Math.random() - 0.5) * 0.3,
				vy: (Math.random() - 0.5) * 0.3,
				vz: (Math.random() - 0.5) * 0.3,
				colorIdx,
				// 金色粒子更大更亮（亮星），其余有自然变化
				baseSize: isGold ? 1.2 + Math.random() * 0.4 : 0.6 + Math.random() * 0.6,
				phase: Math.random() * Math.PI * 2,
				twinkleSpeed: 0.5 + Math.random() * 1.5,
			});
		}

		function onMouseMove(e: MouseEvent) {
			// 视差偏移（整体平移）
			targetMouseX = (e.clientX / window.innerWidth - 0.5) * 40;
			targetMouseY = (e.clientY / window.innerHeight - 0.5) * 40;
			// 排斥力场坐标（相对于 canvas）
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();
			mouseScreenX = e.clientX - rect.left;
			mouseScreenY = e.clientY - rect.top;
		}

		function onMouseOut(e: MouseEvent) {
			// 鼠标离开窗口时重置排斥点
			if (!e.relatedTarget) {
				mouseScreenX = -9999;
				mouseScreenY = -9999;
			}
		}

		function onThemeChange() {
			lastDark = isDarkTheme();
			palette = getPalette(lastDark);
		}

		function loop() {
			if (!ctx) return;

			// 每 30 帧检查一次主题切换（约 0.5s 延迟，无感知）
			frameCount++;
			if (frameCount % 30 === 0) {
				const dark = isDarkTheme();
				if (dark !== lastDark) {
					onThemeChange();
				}
			}

			const time = performance.now() / 1000;

			mouseX += (targetMouseX - mouseX) * 0.05;
			mouseY += (targetMouseY - mouseY) * 0.05;
			angle += ROTATION_SPEED;

			const cos = Math.cos(angle);
			const sin = Math.sin(angle);

			ctx.clearRect(0, 0, W, H);

			// ── 更新 3D 位置（缓慢漂移 + 边界反弹）──
			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;
				p.z += p.vz;
				if (Math.abs(p.x) > FIELD_SIZE) p.vx *= -1;
				if (Math.abs(p.y) > FIELD_SIZE) p.vy *= -1;
				if (Math.abs(p.z) > FIELD_SIZE) p.vz *= -1;
			}

			// ── 3D→2D 投影 + 鼠标排斥力 ──
			const projected: Projected[] = [];
			for (const p of particles) {
				const rx = p.x * cos + p.z * sin;
				const rz = -p.x * sin + p.z * cos;
				const dx = rx + mouseX;
				const dy = p.y + mouseY;
				const dz = rz + CAMERA_DIST;
				if (dz <= 1) continue;
				const scale = FOCAL_LENGTH / dz;
				let px = dx * scale + cx;
				let py = dy * scale + cy;

				// 鼠标排斥力（仅视觉位移，不影响 3D 位置）
				const rdx = px - mouseScreenX;
				const rdy = py - mouseScreenY;
				const rdistSq = rdx * rdx + rdy * rdy;
				if (rdistSq < MOUSE_RADIUS_SQ && rdistSq > 1) {
					const rdist = Math.sqrt(rdistSq);
					// 二次衰减：边缘轻柔、中心强烈
					const force = (1 - rdist / MOUSE_RADIUS) ** 2 * MOUSE_FORCE;
					px += (rdx / rdist) * force;
					py += (rdy / rdist) * force;
				}

				// 闪烁：0.65~1.0 的正弦波
				const twinkle = 0.65 + 0.35 * Math.sin(time * p.twinkleSpeed + p.phase);

				projected.push({
					x: px,
					y: py,
					scale,
					depth: dz,
					colorIdx: p.colorIdx,
					baseSize: p.baseSize,
					twinkle,
				});
			}

			projected.sort((a, b) => b.depth - a.depth);

			// ── 星座连线（颜色混合 + 深度感知 + 平方距离优化）──
			for (let i = 0; i < projected.length; i++) {
				for (let j = i + 1; j < projected.length; j++) {
					const ddx = projected[i].x - projected[j].x;
					const ddy = projected[i].y - projected[j].y;
					const distSq = ddx * ddx + ddy * ddy;
					if (distSq >= CONNECTION_DIST_SQ) continue;
					const dist = Math.sqrt(distSq);

					// 连线透明度 = 距离衰减 × 深度因子
					const avgScale = (projected[i].scale + projected[j].scale) / 2;
					const distOpacity = 1 - dist / CONNECTION_DIST;
					const opacity = distOpacity * 0.22 * Math.min(1, avgScale * 1.5);

					// 使用较亮（较近）粒子的颜色
					const colorIdx =
						projected[i].scale > projected[j].scale
							? projected[i].colorIdx
							: projected[j].colorIdx;

					ctx.strokeStyle = `rgba(${palette.colors[colorIdx]}, ${opacity})`;
					ctx.lineWidth = 0.4 + avgScale * 0.4;
					ctx.beginPath();
					ctx.moveTo(projected[i].x, projected[i].y);
					ctx.lineTo(projected[j].x, projected[j].y);
					ctx.stroke();
				}
			}

			// ── 粒子绘制（闪烁 + 变星大小 + 深度光晕）──
			for (const p of projected) {
				const colorRGB = palette.colors[p.colorIdx];
				const isGold = p.colorIdx === palette.goldIdx;
				const size = Math.max(0.5, p.scale * 2.5 * p.baseSize);
				const opacity = Math.min(1, p.scale * 1.5 * p.twinkle);

				// 光晕：仅近处亮星绘制（性能优化）
				if (p.scale > 0.55 && (p.baseSize > 1.0 || isGold)) {
					const glowSize = Math.max(1, size * (isGold ? 4 : 3));
					const glowOpacity = opacity * (isGold ? 0.4 : 0.25);
					const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
					gradient.addColorStop(0, `rgba(${colorRGB}, ${glowOpacity})`);
					gradient.addColorStop(0.5, `rgba(${colorRGB}, ${glowOpacity * 0.3})`);
					gradient.addColorStop(1, `rgba(${colorRGB}, 0)`);
					ctx.fillStyle = gradient;
					ctx.beginPath();
					ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
					ctx.fill();
				}

				ctx.fillStyle = `rgba(${colorRGB}, ${opacity})`;
				ctx.beginPath();
				ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
				ctx.fill();
			}

			raf = requestAnimationFrame(loop);
		}

		// 事件驱动：Hero 离开视口或标签页进入后台时暂停 RAF，回到视口再恢复
		function start() {
			if (raf || !visible || !pageVisible) return;
			raf = requestAnimationFrame(loop);
		}
		function stop() {
			if (raf) cancelAnimationFrame(raf);
			raf = 0;
		}

		const io = new IntersectionObserver(
			(entries) => {
				visible = entries[0]?.isIntersecting ?? false;
				if (visible && pageVisible) start();
				else stop();
			},
			{ threshold: 0 },
		);
		io.observe(canvas);

		const onVisibility = () => {
			pageVisible = !document.hidden;
			if (pageVisible && visible) start();
			else stop();
		};
		document.addEventListener('visibilitychange', onVisibility);

		// 主题切换监听：MutationObserver 监听 data-theme 属性变化
		const themeObserver = new MutationObserver(onThemeChange);
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme'],
		});

		// 系统色彩方案变化监听
		const darkMQ = window.matchMedia('(prefers-color-scheme: dark)');
		darkMQ.addEventListener('change', onThemeChange);

		resize();
		window.addEventListener('resize', resize);
		window.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseout', onMouseOut);
		start();

		return () => {
			stop();
			io.disconnect();
			themeObserver.disconnect();
			darkMQ.removeEventListener('change', onThemeChange);
			window.removeEventListener('resize', resize);
			window.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseout', onMouseOut);
			document.removeEventListener('visibilitychange', onVisibility);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			aria-hidden="true"
			style={{ width: '100%', height: '100%', display: 'block' }}
		/>
	);
}
