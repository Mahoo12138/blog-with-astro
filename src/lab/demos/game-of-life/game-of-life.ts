import { mountLabDemo, readCssVar } from '../../runtime';

/**
 * Conway 生命游戏（原生 Canvas 2D，零依赖）。
 *
 * 规则 B3/S23：
 *   - 死细胞恰好 3 个活邻居 → 出生
 *   - 活细胞有 2 或 3 个活邻居 → 存活
 *   - 其余情况 → 死亡
 * 邻居统计走 Moore 邻域（8 邻），网格上下左右环绕（环面），
 * 这样滑翔机能一路飞出屏幕再从另一侧飞回来，不会在边界处「撞死」。
 */

const TARGET_CELL = 14;
const MIN_COLS = 24;
const MAX_COLS = 160;
const MIN_ROWS = 16;
const MAX_ROWS = 100;

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

export function setupGameOfLife(root: HTMLElement): void {
	mountLabDemo(root, ({ canvas, ctx, size, onFrame, onResize, onReset, redraw, reducedMotion }) => {
		let cols = 0;
		let rows = 0;
		let cell = TARGET_CELL;
		let grid = new Uint8Array(0);
		let next = new Uint8Array(0);
		let age = new Uint16Array(0);

		let running = !reducedMotion;
		let dirty = true;
		let acc = 0;
		let stepsPerSecond = 8;
		let generation = 0;
		let population = 0;

		// 取色：从舞台上读 CSS 变量，跟着 stage 的配色走（见 styles/lab.css.ts）。
		// getComputedStyle 每帧调用太贵，只在尺寸变化时刷新。
		let colorBg = '#0b1220';
		let colorLine = 'rgba(226, 232, 240, 0.06)';
		let colorYoung = '#ffb86b';
		let colorOld = '#7ecbff';

		function refreshColors(): void {
			colorBg = readCssVar(canvas, '--lab-stage-bg', '#0b1220');
			colorLine = readCssVar(canvas, '--lab-stage-muted', 'rgba(226, 232, 240, 0.42)');
			colorYoung = readCssVar(canvas, '--lab-stage-accent-2', '#ffb86b');
			colorOld = readCssVar(canvas, '--lab-stage-accent', '#7ecbff');
		}

		const index = (x: number, y: number) => y * cols + x;

		function allocate(): void {
			const { width, height } = size();
			const nextCols = clamp(Math.floor(width / TARGET_CELL), MIN_COLS, MAX_COLS);
			const nextRows = clamp(Math.floor(height / TARGET_CELL), MIN_ROWS, MAX_ROWS);
			if (nextCols === cols && nextRows === rows) {
				cell = width / nextCols;
				return;
			}

			const oldGrid = grid;
			const oldAge = age;
			const oldCols = cols;
			const oldRows = rows;

			cols = nextCols;
			rows = nextRows;
			cell = width / cols;
			grid = new Uint8Array(cols * rows);
			next = new Uint8Array(cols * rows);
			age = new Uint16Array(cols * rows);

			// 旧状态按左上角对齐搬运，缩放窗口不至于把图案清空
			const copyCols = Math.min(oldCols, cols);
			const copyRows = Math.min(oldRows, rows);
			for (let y = 0; y < copyRows; y += 1) {
				for (let x = 0; x < copyCols; x += 1) {
					grid[y * cols + x] = oldGrid[y * oldCols + x] ?? 0;
					age[y * cols + x] = oldAge[y * oldCols + x] ?? 0;
				}
			}
			dirty = true;
		}

		function randomize(density = 0.28): void {
			for (let i = 0; i < grid.length; i += 1) {
				grid[i] = Math.random() < density ? 1 : 0;
				age[i] = 0;
			}
			generation = 0;
			dirty = true;
		}

		function clear(): void {
			grid.fill(0);
			age.fill(0);
			generation = 0;
			dirty = true;
		}

		/** 铺一排滑翔机枪：每 12 格一台，斜向掠过整个网格 */
		function seedGliders(): void {
			clear();
			const pattern: [number, number][] = [
				[1, 0],
				[2, 1],
				[0, 2],
				[1, 2],
				[2, 2],
			];
			for (let gy = 0; gy < rows; gy += 8) {
				for (let gx = 0; gx < cols; gx += 12) {
					for (const [dx, dy] of pattern) {
						const x = (gx + dx) % cols;
						const y = (gy + dy) % rows;
						grid[index(x, y)] = 1;
					}
				}
			}
			dirty = true;
		}

		function step(): void {
			let alive = 0;
			for (let y = 0; y < rows; y += 1) {
				const up = ((y - 1 + rows) % rows) * cols;
				const mid = y * cols;
				const down = ((y + 1) % rows) * cols;
				for (let x = 0; x < cols; x += 1) {
					const left = (x - 1 + cols) % cols;
					const right = (x + 1) % cols;
					const neighbors =
						grid[up + left] +
						grid[up + x] +
						grid[up + right] +
						grid[mid + left] +
						grid[mid + right] +
						grid[down + left] +
						grid[down + x] +
						grid[down + right];

					const i = mid + x;
					const wasAlive = grid[i] === 1;
					const isAlive = wasAlive ? neighbors === 2 || neighbors === 3 : neighbors === 3;
					next[i] = isAlive ? 1 : 0;
					if (isAlive) {
						alive += 1;
						age[i] = wasAlive ? Math.min(age[i] + 1, 65535) : 0;
					} else {
						age[i] = 0;
					}
				}
			}
			// 双缓冲互换，避免演化时读到本轮已写入的值
			const swap = grid;
			grid = next;
			next = swap;
			generation += 1;
			population = alive;
			dirty = true;
		}

		function draw(): void {
			const { width, height } = size();
			ctx.fillStyle = colorBg;
			ctx.fillRect(0, 0, width, height);

			if (cell >= 9) {
				ctx.strokeStyle = colorLine;
				ctx.globalAlpha = 0.16;
				ctx.lineWidth = 1;
				ctx.beginPath();
				for (let x = 0; x <= cols; x += 1) {
					const px = Math.round(x * cell) + 0.5;
					ctx.moveTo(px, 0);
					ctx.lineTo(px, rows * cell);
				}
				for (let y = 0; y <= rows; y += 1) {
					const py = Math.round(y * cell) + 0.5;
					ctx.moveTo(0, py);
					ctx.lineTo(cols * cell, py);
				}
				ctx.stroke();
				ctx.globalAlpha = 1;
			}

			const size2 = Math.max(1, cell - (cell >= 9 ? 1 : 0));
			for (let y = 0; y < rows; y += 1) {
				for (let x = 0; x < cols; x += 1) {
					const i = y * cols + x;
					if (grid[i] !== 1) continue;
					// 刚出生的细胞用暖色，稳定下来的用冷色，一眼能看出「活跃带」
					ctx.fillStyle = age[i] <= 2 ? colorYoung : colorOld;
					ctx.fillRect(x * cell, y * cell, size2, size2);
				}
			}
		}

		/* ---------------- 控件 ---------------- */

		const toggleButton = root.querySelector<HTMLButtonElement>('[data-gol-toggle]');
		const readout = root.querySelector<HTMLElement>('[data-gol-readout]');

		function updateToggle(): void {
			if (toggleButton) {
				toggleButton.textContent = running ? '暂停' : '继续';
				toggleButton.setAttribute('aria-pressed', String(running));
			}
			if (readout) {
				readout.textContent = `第 ${generation} 代 · 存活 ${population} · ${cols}×${rows}`;
			}
		}

		toggleButton?.addEventListener('click', () => {
			running = !running;
			dirty = true;
			updateToggle();
		});
		root.querySelector('[data-gol-step]')?.addEventListener('click', () => {
			running = false;
			step();
			updateToggle();
			redraw();
		});
		root.querySelector('[data-gol-random]')?.addEventListener('click', () => {
			randomize();
			updateToggle();
			redraw();
		});
		root.querySelector('[data-gol-gliders]')?.addEventListener('click', () => {
			seedGliders();
			running = true;
			updateToggle();
			redraw();
		});
		root.querySelector('[data-gol-clear]')?.addEventListener('click', () => {
			clear();
			running = false;
			updateToggle();
			redraw();
		});

		const speedInput = root.querySelector<HTMLInputElement>('[data-gol-speed]');
		const speedValue = root.querySelector<HTMLElement>('[data-gol-speed-value]');
		speedInput?.addEventListener('input', () => {
			stepsPerSecond = Number(speedInput.value) || 8;
			if (speedValue) speedValue.textContent = `${stepsPerSecond} 代/秒`;
		});

		/* ---------------- 鼠标 / 触摸作画 ---------------- */

		let painting = false;
		let paintValue = 1;

		function paintAt(event: PointerEvent): void {
			const rect = canvas.getBoundingClientRect();
			const x = Math.floor(((event.clientX - rect.left) / rect.width) * cols);
			const y = Math.floor(((event.clientY - rect.top) / rect.height) * rows);
			if (x < 0 || y < 0 || x >= cols || y >= rows) return;
			const i = index(x, y);
			if (grid[i] === paintValue) return;
			grid[i] = paintValue;
			age[i] = 0;
			dirty = true;
			redraw();
		}

		canvas.addEventListener('pointerdown', (event) => {
			const rect = canvas.getBoundingClientRect();
			const x = Math.floor(((event.clientX - rect.left) / rect.width) * cols);
			const y = Math.floor(((event.clientY - rect.top) / rect.height) * rows);
			if (x < 0 || y < 0 || x >= cols || y >= rows) return;
			painting = true;
			paintValue = grid[index(x, y)] ? 0 : 1; // 起点决定这一笔是画还是擦
			canvas.setPointerCapture(event.pointerId);
			paintAt(event);
		});
		canvas.addEventListener('pointermove', (event) => {
			if (painting) paintAt(event);
		});
		const stopPainting = () => {
			painting = false;
		};
		canvas.addEventListener('pointerup', stopPainting);
		canvas.addEventListener('pointercancel', stopPainting);

		/* ---------------- 生命周期 ---------------- */

		// 注意别把参数命名成 next：外层已经有一个叫 next 的双缓冲数组
		onResize(() => {
			refreshColors();
			allocate();
			draw();
			updateToggle();
		});

		onFrame((dt) => {
			if (running) {
				acc += dt * stepsPerSecond;
				// 单帧最多推进 4 代：防止速度拉满时一帧算出几十代卡住主线程
				let budget = 4;
				while (acc >= 1 && budget > 0) {
					step();
					acc -= 1;
					budget -= 1;
				}
				if (acc > 1) acc = 0;
				updateToggle();
				draw();
				return;
			}
			if (dirty) {
				dirty = false;
				draw();
			}
		});

		onReset(() => {
			randomize();
			running = !reducedMotion;
			acc = 0;
			updateToggle();
			redraw();
		});

		randomize();
		updateToggle();
	});
}
