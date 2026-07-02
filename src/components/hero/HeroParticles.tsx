import { useEffect, useRef } from 'react';

interface Particle3D {
	x: number;
	y: number;
	z: number;
	vx: number;
	vy: number;
	vz: number;
}

interface Projected {
	x: number;
	y: number;
	scale: number;
	depth: number;
}

const PARTICLE_COUNT = 80;
const FIELD_SIZE = 400;
const CAMERA_DIST = 600;
const FOCAL_LENGTH = 500;
const CONNECTION_DIST = 130;
const ROTATION_SPEED = 0.0008;

function isDarkTheme(): boolean {
	const theme = document.documentElement.getAttribute('data-theme');
	if (theme === 'dark') return true;
	if (theme === 'light') return false;
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function HeroParticles() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let raf = 0;
		let angle = 0;
		let mouseX = 0;
		let mouseY = 0;
		let targetMouseX = 0;
		let targetMouseY = 0;
		let W = 0;
		let H = 0;
		let cx = 0;
		let cy = 0;
		let dpr = 1;

		function resize() {
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();
			dpr = window.devicePixelRatio || 1;
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

		resize();
		window.addEventListener('resize', resize);

		const particles: Particle3D[] = [];
		for (let i = 0; i < PARTICLE_COUNT; i++) {
			particles.push({
				x: (Math.random() - 0.5) * FIELD_SIZE * 2,
				y: (Math.random() - 0.5) * FIELD_SIZE * 2,
				z: (Math.random() - 0.5) * FIELD_SIZE * 2,
				vx: (Math.random() - 0.5) * 0.3,
				vy: (Math.random() - 0.5) * 0.3,
				vz: (Math.random() - 0.5) * 0.3,
			});
		}

		function onMouseMove(e: MouseEvent) {
			targetMouseX = (e.clientX / window.innerWidth - 0.5) * 40;
			targetMouseY = (e.clientY / window.innerHeight - 0.5) * 40;
		}
		window.addEventListener('mousemove', onMouseMove);

		function loop() {
			if (!ctx) return;

			mouseX += (targetMouseX - mouseX) * 0.05;
			mouseY += (targetMouseY - mouseY) * 0.05;
			angle += ROTATION_SPEED;

			const cos = Math.cos(angle);
			const sin = Math.sin(angle);
			const dark = isDarkTheme();
			const colorRGB = dark ? '126, 203, 255' : '33, 150, 243';

			ctx.clearRect(0, 0, W, H);

			// Update particle positions (gentle drift)
			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;
				p.z += p.vz;
				if (Math.abs(p.x) > FIELD_SIZE) p.vx *= -1;
				if (Math.abs(p.y) > FIELD_SIZE) p.vy *= -1;
				if (Math.abs(p.z) > FIELD_SIZE) p.vz *= -1;
			}

			// Project to 2D
			const projected: Projected[] = [];
			for (const p of particles) {
				const rx = p.x * cos + p.z * sin;
				const rz = -p.x * sin + p.z * cos;
				const dx = rx + mouseX;
				const dy = p.y + mouseY;
				const dz = rz + CAMERA_DIST;
				if (dz <= 1) continue;
				const scale = FOCAL_LENGTH / dz;
				projected.push({
					x: dx * scale + cx,
					y: dy * scale + cy,
					scale,
					depth: dz,
				});
			}

			projected.sort((a, b) => b.depth - a.depth);

			// Connection lines
			for (let i = 0; i < projected.length; i++) {
				for (let j = i + 1; j < projected.length; j++) {
					const ddx = projected[i].x - projected[j].x;
					const ddy = projected[i].y - projected[j].y;
					const dist = Math.sqrt(ddx * ddx + ddy * ddy);
					if (dist < CONNECTION_DIST) {
						const opacity = (1 - dist / CONNECTION_DIST) * 0.25;
						ctx.strokeStyle = `rgba(${colorRGB}, ${opacity})`;
						ctx.lineWidth = 0.6;
						ctx.beginPath();
						ctx.moveTo(projected[i].x, projected[i].y);
						ctx.lineTo(projected[j].x, projected[j].y);
						ctx.stroke();
					}
				}
			}

			// Particles
			for (const p of projected) {
				const size = Math.max(0.5, p.scale * 3);
				const opacity = Math.min(1, p.scale * 1.5);

				// Glow halo for closer particles
				if (p.scale > 0.6) {
					const glowSize = size * 3;
					const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
					gradient.addColorStop(0, `rgba(${colorRGB}, ${opacity * 0.3})`);
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

		loop();

		return () => {
			window.removeEventListener('resize', resize);
			window.removeEventListener('mousemove', onMouseMove);
			cancelAnimationFrame(raf);
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
