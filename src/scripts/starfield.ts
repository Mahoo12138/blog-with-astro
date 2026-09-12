/// <reference types="@webgpu/types" />

/**
 * 星海漂移 / Stellar Drift — 博客首页星空引擎
 *
 * 移植自 starfield-webgpu.html（WebGPU compute 推进星体 → 实例化胶囊光迹 → 程序化星云），
 * 改造为可嵌入首页 Hero 的无 HUD 后台组件：
 *  - 尺寸跟随 canvas 自身盒子（而非 window），DPR 上限 2
 *  - 对外暴露 travel() / settle() / pulse() 驱动「曲速 → 减速进场 → 抵达」首映时间线
 *  - IntersectionObserver + visibilitychange 自动暂停（离开视口 / 标签页后台不再烧 GPU）
 *  - prefers-reduced-motion：只渲染一帧静态星场，不进入 RAF
 *  - WebGPU 不可用时静默回退 Canvas 2D
 */

/* ------------------------------------------------------------------ *
 *  WGSL — 公共库
 * ------------------------------------------------------------------ */
const COMMON = /* wgsl */ `
struct Uni {
  res:    vec2f,
  center: vec2f,
  time:   f32,
  dt:     f32,
  speed:  f32,
  maxZ:   f32,
  focal:  f32,
  nearZ:  f32,
  spread: f32,
  trail:  f32,
  size:   f32,
  warp:   f32,
  flash:  f32,
  frame:  f32,
};

fn hash11(p: f32) -> f32 {
  var p3 = fract(vec3f(p) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
fn hash21(p: vec2f) -> f32 {
  var p3 = fract(vec3f(p.x, p.y, p.x) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
fn hash31(p: vec3f) -> f32 {
  var p3 = fract(p * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}

fn vnoise(p: vec3f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  let a = hash31(i + vec3f(0.0, 0.0, 0.0));
  let b = hash31(i + vec3f(1.0, 0.0, 0.0));
  let c = hash31(i + vec3f(0.0, 1.0, 0.0));
  let d = hash31(i + vec3f(1.0, 1.0, 0.0));
  let e = hash31(i + vec3f(0.0, 0.0, 1.0));
  let g = hash31(i + vec3f(1.0, 0.0, 1.0));
  let h = hash31(i + vec3f(0.0, 1.0, 1.0));
  let k = hash31(i + vec3f(1.0, 1.0, 1.0));
  return mix(mix(mix(a, b, u.x), mix(c, d, u.x), u.y),
             mix(mix(e, g, u.x), mix(h, k, u.x), u.y), u.z);
}

fn fbm(p0: vec3f) -> f32 {
  var p = p0;
  var amp = 0.5;
  var s = 0.0;
  for (var i = 0; i < 5; i = i + 1) {
    s = s + amp * vnoise(p);
    p = p * 2.03 + vec3f(9.7, 3.1, 5.3);
    amp = amp * 0.5;
  }
  return s;
}

fn starColor(t: f32) -> vec3f {
  if (t < 0.55) { return mix(vec3f(0.62, 0.78, 1.00), vec3f(1.00, 0.98, 0.96), t / 0.55); }
  if (t < 0.86) { return mix(vec3f(1.00, 0.98, 0.96), vec3f(1.00, 0.83, 0.62), (t - 0.55) / 0.31); }
  return mix(vec3f(1.00, 0.83, 0.62), vec3f(1.00, 0.60, 0.46), (t - 0.86) / 0.14);
}
`;

/* ------------------------------------------------------------------ *
 *  WGSL — 星云背景（全屏三角）
 * ------------------------------------------------------------------ */
const NEBULA_WGSL = COMMON + /* wgsl */ `
@group(0) @binding(0) var<uniform> u: Uni;

@vertex fn vs(@builtin(vertex_index) vi: u32) -> @builtin(position) vec4f {
  var p = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
  return vec4f(p[vi], 0.0, 1.0);
}

@fragment fn fs(@builtin(position) fc: vec4f) -> @location(0) vec4f {
  let res = u.res;
  let uv  = (fc.xy - 0.5 * res) / max(min(res.x, res.y), 1.0);
  let par = (u.center - 0.5 * res) / max(res.y, 1.0);

  let q  = vec3f(uv * 1.9 + par * 0.55, u.time * 0.015);
  let n1 = fbm(q);
  let n2 = fbm(q * 2.4 + vec3f(2.7, 1.3, 0.0) + n1 * 0.7);

  var col = vec3f(0.008, 0.013, 0.030);

  let d  = pow(clamp(n1 * 1.35 - 0.22, 0.0, 1.0), 1.8);
  let cA = vec3f(0.060, 0.115, 0.300);
  let cB = vec3f(0.060, 0.360, 0.435);
  let cC = vec3f(0.250, 0.100, 0.310);
  col += mix(cA, cB, clamp(n2 * 1.25, 0.0, 1.0)) * d * 1.30;
  col += cC * pow(clamp(n2 - 0.46, 0.0, 1.0), 2.0) * 1.35;
  col += vec3f(0.09, 0.20, 0.33) * u.warp * d * 1.6;

  // 远景尘埃：3×3 邻域搜索，避免网格簇边缘被裁成方块
  let cell = 30.0;
  let gid  = floor(fc.xy / cell);
  var dust = 0.0;
  for (var oy = -1; oy <= 1; oy = oy + 1) {
    for (var ox = -1; ox <= 1; ox = ox + 1) {
      let c2 = gid + vec2f(f32(ox), f32(oy));
      let hh = hash21(c2);
      if (hh > 0.965) {
        let r1 = fract(hash21(c2 + 7.13) * 57.31);
        let r2 = fract(hash21(c2 + 13.77) * 39.17);
        let sp = (c2 + vec2f(r1, r2)) * cell;
        let dd = length(fc.xy - sp);
        if (dd < 2.6) {
          let tw = 0.50 + 0.50 * sin(u.time * (1.1 + r1 * 3.6) + r1 * 41.0);
          let mg = 0.18 + 0.82 * fract(hh * 91.0);
          dust = max(dust, exp(-dd * dd * 1.55) * mg * tw * 0.80);
        }
      }
    }
  }
  col += vec3f(0.72, 0.85, 1.0) * dust * 0.65;

  // 中心柔晕 + 四角压暗，把视线锚在消失点上
  let rr = length(uv * vec2f(0.82, 1.0));
  col += vec3f(0.16, 0.28, 0.46) * exp(-rr * rr * 3.4) * 0.20;
  col *= clamp(1.0 - 0.62 * pow(rr, 2.6), 0.0, 1.0);

  return vec4f(col, 1.0);
}
`;

/* ------------------------------------------------------------------ *
 *  WGSL — 星体 compute（推进 + 视锥回收）
 * ------------------------------------------------------------------ */
const STAR_COMPUTE_WGSL = COMMON + /* wgsl */ `
struct Star { x: f32, y: f32, z: f32, seed: f32 };

@group(0) @binding(0) var<storage, read_write> stars: array<Star>;
@group(0) @binding(1) var<uniform> u: Uni;

@compute @workgroup_size(64)
fn cs(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= arrayLength(&stars)) { return; }

  var s = stars[i];
  s.z = s.z - u.speed * u.dt;

  var recycle = s.z <= u.nearZ;
  if (!recycle) {
    let k  = u.focal / s.z;
    let px = u.center.x + s.x * k;
    let py = u.center.y + s.y * k;
    let m  = 72.0;
    if (px < -m || px > u.res.x + m || py < -m || py > u.res.y + m) { recycle = true; }
  }

  if (recycle) {
    let seed = hash11(s.seed + u.frame * 0.6180339 + f32(i) * 0.377);
    let ang  = hash11(seed * 1.13) * 6.2831853;
    let rad  = sqrt(hash11(seed * 2.71 + 0.31));
    s.x = cos(ang) * rad * u.spread;
    s.y = sin(ang) * rad * u.spread;
    s.z = u.maxZ * (0.86 + 0.14 * hash11(seed * 3.77));
    s.seed = seed;
  }

  stars[i] = s;
}
`;

/* ------------------------------------------------------------------ *
 *  WGSL — 星体渲染（实例化胶囊光迹）
 * ------------------------------------------------------------------ */
const STAR_RENDER_WGSL = COMMON + /* wgsl */ `
struct Star { x: f32, y: f32, z: f32, seed: f32 };

@group(0) @binding(0) var<storage, read> stars: array<Star>;
@group(0) @binding(1) var<uniform> u: Uni;

struct VOut {
  @builtin(position) pos: vec4f,
  @location(0) a:      vec2f,
  @location(1) b:      vec2f,
  @location(2) rad:    f32,
  @location(3) col:    vec3f,
  @location(4) bright: f32,
};

@vertex fn vs(@builtin(vertex_index) vi: u32,
              @builtin(instance_index) ii: u32) -> VOut {
  let s  = stars[ii];
  let zc = max(s.z, u.nearZ);
  let dz = u.speed * u.dt * u.trail;

  let k  = u.focal / zc;
  let kp = u.focal / (zc + dz);

  let A = u.center + vec2f(s.x, s.y) * k;    // 头（当前位置）
  let B = u.center + vec2f(s.x, s.y) * kp;   // 尾（dt 之前的位置）

  let dv = A - B;
  let dl = length(dv);
  var dir = vec2f(0.0, 1.0);
  if (dl > 1e-4) { dir = dv / dl; }
  let nrm = vec2f(-dir.y, dir.x);

  let rPix = clamp(u.size * k, 0.42, 2.6);
  let glow = rPix * 2.8 + min(dl * 0.30, 4.0);

  var order = array<u32, 6>(0u, 1u, 2u, 2u, 1u, 3u);
  let c      = order[vi];
  let isHead = c >= 2u;
  let base   = select(B, A, isHead);
  let side   = select(-1.0, 1.0, (c % 2u) == 1u);
  let ext    = select(-1.0, 1.0, isHead);
  let p      = base + nrm * (side * glow) + dir * (ext * (rPix * 0.9 + glow * 0.4));

  let clip = vec2f(p.x / u.res.x * 2.0 - 1.0, 1.0 - p.y / u.res.y * 2.0);

  let zf     = 1.0 - zc / u.maxZ;
  let fadeIn = smoothstep(0.0, 0.16, zf);
  let mag    = 0.35 + 0.65 * fract(s.seed * 13.77);
  var bright = mag * (0.20 + 0.80 * pow(clamp(zf, 0.0, 1.0), 0.62)) * fadeIn;
  bright *= 0.86 + 0.14 * sin(u.time * 2.6 + s.seed * 43.0);
  bright *= 1.0 + u.warp * 0.30;
  bright *= 0.45 + 0.55 * smoothstep(1.0, 3.2, rPix);   // 能量守恒：摊薄后补偿亮度

  var o: VOut;
  o.pos    = vec4f(clip, 0.0, 1.0);
  o.a      = A;
  o.b      = B;
  o.rad    = rPix;
  o.col    = starColor(fract(s.seed * 7.31));
  o.bright = bright;
  return o;
}

@fragment fn fs(v: VOut) -> @location(0) vec4f {
  let p  = v.pos.xy;
  let pa = p - v.a;
  let ba = v.b - v.a;
  let h  = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);

  let d          = max(length(pa - ba * h), 0.5);
  let r          = max(v.rad, 0.5);
  let core       = exp(-pow(d / r, 2.0) * 1.7);
  let glow       = exp(-d / (r * 3.2)) * 0.34;
  let aa         = smoothstep(0.12, 0.85, d);        // 亚像素抗锯齿
  let a          = (core + glow) * v.bright * aa;

  return vec4f(v.col * a, a);
}
`;

/* ------------------------------------------------------------------ *
 *  WGSL — 流星（compute + 光迹渲染）
 * ------------------------------------------------------------------ */
const METEOR_STRUCT = /* wgsl */ `
struct Meteor { x: f32, y: f32, vx: f32, vy: f32, life: f32, dur: f32, seed: f32, pad: f32 };
`;

const METEOR_COMPUTE_WGSL = COMMON + METEOR_STRUCT + /* wgsl */ `
@group(0) @binding(0) var<storage, read_write> meteors: array<Meteor>;
@group(0) @binding(1) var<uniform> u: Uni;

@compute @workgroup_size(64)
fn cs(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= arrayLength(&meteors)) { return; }

  var m = meteors[i];

  if (m.life > 0.0) {
    m.x += m.vx * u.dt;
    m.y += m.vy * u.dt;
    m.life -= u.dt / max(m.dur, 0.05);
    if (m.x < -400.0 || m.x > u.res.x + 400.0 || m.y < -400.0 || m.y > u.res.y + 400.0) {
      m.life = 0.0;
    }
  } else {
    let bucket = floor(u.time * 10.0);
    let h = hash31(vec3f(f32(i) * 0.731 + m.seed * 3.1, bucket, 4.2));
    if (h > 0.9972) {
      let s1 = hash31(vec3f(f32(i) * 1.7, bucket, 8.7));
      let s2 = hash31(vec3f(f32(i) * 2.3, bucket, 15.3));
      let s3 = hash31(vec3f(f32(i) * 3.9, bucket, 22.9));

      m.x = mix(-0.08, 1.08, s1) * u.res.x;
      m.y = mix(-0.06, 0.55, s2) * u.res.y;

      let ang  = 1.95 + s3 * 0.60;
      let flip = select(1.0, -1.0, s2 > 0.5);
      let spd  = 850.0 + s1 * 1500.0;

      m.vx   = cos(ang) * spd * flip;
      m.vy   = sin(ang) * spd;
      m.dur  = 0.75 + s3 * 0.85;
      m.life = 1.0;
      m.seed = fract(s1 * 97.3 + s2 * 31.7);
    }
  }

  meteors[i] = m;
}
`;

const METEOR_RENDER_WGSL = COMMON + METEOR_STRUCT + /* wgsl */ `
@group(0) @binding(0) var<storage, read> meteors: array<Meteor>;
@group(0) @binding(1) var<uniform> u: Uni;

struct VOut {
  @builtin(position) pos: vec4f,
  @location(0) a:      vec2f,
  @location(1) b:      vec2f,
  @location(2) rad:    f32,
  @location(3) bright: f32,
};

@vertex fn vs(@builtin(vertex_index) vi: u32,
              @builtin(instance_index) ii: u32) -> VOut {
  let m = meteors[ii];

  let vel = vec2f(m.vx, m.vy);
  let sp  = length(vel);
  var dir = vec2f(0.0, 1.0);
  if (sp > 1e-3) { dir = vel / sp; }

  let A = vec2f(m.x, m.y);
  let L = clamp(sp * 0.085, 26.0, 340.0);
  let B = A - dir * L;

  let nrm  = vec2f(-dir.y, dir.x);
  let rPix = 1.7;
  let glow = 8.0;

  var order = array<u32, 6>(0u, 1u, 2u, 2u, 1u, 3u);
  let c      = order[vi];
  let isHead = c >= 2u;
  let base   = select(B, A, isHead);
  let side   = select(-1.0, 1.0, (c % 2u) == 1u);
  let ext    = select(-1.0, 1.0, isHead);
  let p      = base + nrm * (side * glow) + dir * (ext * (rPix + glow * 0.5));

  let clip = vec2f(p.x / u.res.x * 2.0 - 1.0, 1.0 - p.y / u.res.y * 2.0);

  let life = clamp(m.life, 0.0, 1.0);
  let env  = smoothstep(0.0, 0.06, 1.0 - life) * smoothstep(0.0, 0.35, life);

  var o: VOut;
  o.pos    = vec4f(clip, 0.0, 1.0);
  o.a      = A;
  o.b      = B;
  o.rad    = rPix;
  o.bright = env * (0.55 + 0.45 * fract(m.seed * 29.3));
  return o;
}

@fragment fn fs(v: VOut) -> @location(0) vec4f {
  let p  = v.pos.xy;
  let pa = p - v.a;
  let ba = v.b - v.a;
  let h  = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);

  let d     = max(length(pa - ba * h), 0.30);
  let r     = max(v.rad, 0.5);
  let taper = pow(1.0 - h, 1.4);
  let col   = mix(vec3f(1.0, 1.0, 1.0), vec3f(0.45, 0.75, 1.0), clamp(h * 1.3, 0.0, 1.0));

  let core = exp(-pow(d / r, 2.0) * 2.2);
  let glow = exp(-d / (r * 5.0)) * 0.35;
  let aa   = smoothstep(0.08, 0.70, max(d, 0.30));
  var a    = (core * taper + glow * taper * 0.8) * v.bright * aa;
  a += exp(-length(p - v.a) / (r * 7.0)) * 0.55 * v.bright * aa;

  return vec4f(col * a, a);
}
`;

/* ------------------------------------------------------------------ *
 *  WGSL — 跃迁闪白
 * ------------------------------------------------------------------ */
const FLASH_WGSL = COMMON + /* wgsl */ `
@group(0) @binding(0) var<uniform> u: Uni;

@vertex fn vs(@builtin(vertex_index) vi: u32) -> @builtin(position) vec4f {
  var p = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
  return vec4f(p[vi], 0.0, 1.0);
}

@fragment fn fs() -> @location(0) vec4f {
  let a = clamp(u.flash, 0.0, 1.0) * 0.85;
  return vec4f(vec3f(0.55, 0.80, 1.0) * a, a);
}
`;

/* ------------------------------------------------------------------ *
 *  引擎
 * ------------------------------------------------------------------ */

export interface StarfieldOptions {
	/** 星体数量，默认按设备自动选择 */
	stars?: number;
	/** 抵达后的环境巡航速度（单位/秒） */
	cruise?: number;
	/** 曲速速度（单位/秒） */
	warpSpeed?: number;
	/** prefers-reduced-motion：只渲染一帧静态星场 */
	reducedMotion?: boolean;
}

export interface StarfieldHandle {
	/** 进入曲速漂移 */
	travel(): void;
	/** 减速退回环境巡航 */
	settle(): void;
	/** 跃迁到位的闪白脉冲（0~1） */
	pulse(strength?: number): void;
	/** 销毁引擎，释放 GPU 资源与监听 */
	destroy(): void;
}

const ADD = {
	color: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
	alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
} as const;

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

export function createStarfield(canvas: HTMLCanvasElement, opts: StarfieldOptions = {}): Promise<StarfieldHandle> {
	const isMobile = window.matchMedia('(max-width: 768px)').matches;

	const CFG = {
		meteors: isMobile ? 10 : 16,
		maxZ: 1800,
		nearZ: 8,
		cruise: opts.cruise ?? 14,
		warpSpeed: opts.warpSpeed ?? 1100,
		size: 0.62,
		dprCap: 2,
		// 消失点相对画面中心的最大偏移比例（越小跟随越克制）
		pointerParallax: 0.055,
		idleDriftX: 0.035,
		idleDriftY: 0.03,
	};
	const starCount = opts.stars ?? (isMobile ? 6000 : 12000);
	const reduced = opts.reducedMotion === true;

	const S = {
		warpOn: false,
		warp: 0,
		speed: 30,
		targetSpeed: 30,
		flash: 0,
		frame: 0,
		time: 0,
		cx: 0,
		cy: 0,
		tx: 0,
		ty: 0,
		lastPointer: -1e9,
		ready: false, // WebGPU/2D 初始化完成前不进入渲染循环（避免 webgpu/2d 上下文争抢）
		running: false,
		rafId: 0,
		inView: true,
		pageVisible: !document.hidden,
		usesGPU: false,
		destroyed: false,
	};

	const U = new Float32Array(16);

	// —— WebGPU 资源 ——
	let device: GPUDevice | null = null;
	let context: GPUCanvasContext | null = null;
	let format: GPUTextureFormat = 'bgra8unorm';
	let uniBuf: GPUBuffer | null = null;
	let starBuf: GPUBuffer | null = null;
	let meteorBuf: GPUBuffer | null = null;
	let starCBPipe: GPUComputePipeline | null = null;
	let starRndPipe: GPURenderPipeline | null = null;
	let nebulaPipe: GPURenderPipeline | null = null;
	let meteorCPipe: GPUComputePipeline | null = null;
	let meteorRPipe: GPURenderPipeline | null = null;
	let flashPipe: GPURenderPipeline | null = null;
	let starCBG: GPUBindGroup | null = null;
	let starRBG: GPUBindGroup | null = null;
	let nebulaBG: GPUBindGroup | null = null;
	let meteorCBG: GPUBindGroup | null = null;
	let meteorRBG: GPUBindGroup | null = null;
	let flashBG: GPUBindGroup | null = null;

	// —— Canvas 2D 回退资源 ——
	let c2d: CanvasRenderingContext2D | null = null;
	let stars2d: { x: number; y: number; z: number; o: number; c: number }[] = [];

	async function makeModule(label: string, code: string) {
		const mod = device!.createShaderModule({ label, code });
		const info = await mod.getCompilationInfo();
		const errs = info.messages.filter((m) => m.type === 'error');
		if (errs.length) {
			console.error(`[WGSL ${label}]`, errs.map((e) => `line ${e.lineNum}:${e.linePos} ${e.message}`).join('\n'));
		}
		return mod;
	}

	function makeStarData(n: number) {
		const data = new Float32Array(n * 4);
		const spread = CFG.maxZ * 0.62;
		for (let i = 0; i < n; i++) {
			const a = Math.random() * Math.PI * 2;
			const r = Math.sqrt(Math.random());
			data[i * 4 + 0] = Math.cos(a) * r * spread;
			data[i * 4 + 1] = Math.sin(a) * r * spread;
			data[i * 4 + 2] = CFG.nearZ + Math.random() * (CFG.maxZ - CFG.nearZ);
			data[i * 4 + 3] = Math.random();
		}
		return data;
	}

	function buildStars(n: number) {
		if (!device || !starCBPipe || !starRndPipe || !uniBuf) return;
		starBuf?.destroy();
		starBuf = device.createBuffer({
			label: 'stars',
			size: n * 16,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
		});
		device.queue.writeBuffer(starBuf, 0, makeStarData(n));

		starCBG = device.createBindGroup({
			layout: starCBPipe.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: { buffer: starBuf } },
				{ binding: 1, resource: { buffer: uniBuf } },
			],
		});
		starRBG = device.createBindGroup({
			layout: starRndPipe.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: { buffer: starBuf } },
				{ binding: 1, resource: { buffer: uniBuf } },
			],
		});
	}

	async function initWebGPU(): Promise<void> {
		if (!navigator.gpu) throw new Error('navigator.gpu 不可用');
		const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
		if (!adapter) throw new Error('无可用 GPU 适配器');

		device = await adapter.requestDevice();
		device.lost.then((info) => {
			console.warn('[starfield] WebGPU device lost:', info.message);
		});

		context = canvas.getContext('webgpu');
		if (!context) throw new Error('无法获取 webgpu 上下文');

		format = navigator.gpu.getPreferredCanvasFormat();
		context.configure({ device, format, alphaMode: 'opaque' });
		S.usesGPU = true;

		uniBuf = device.createBuffer({
			label: 'uniforms',
			size: 64,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});

		const [nebulaMod, starCMod, starRMod, meteorCMod, meteorRMod, flashMod] = await Promise.all([
			makeModule('nebula', NEBULA_WGSL),
			makeModule('star-compute', STAR_COMPUTE_WGSL),
			makeModule('star-render', STAR_RENDER_WGSL),
			makeModule('meteor-compute', METEOR_COMPUTE_WGSL),
			makeModule('meteor-render', METEOR_RENDER_WGSL),
			makeModule('flash', FLASH_WGSL),
		]);

		nebulaPipe = device.createRenderPipeline({
			label: 'nebula',
			layout: 'auto',
			vertex: { module: nebulaMod, entryPoint: 'vs' },
			fragment: { module: nebulaMod, entryPoint: 'fs', targets: [{ format }] },
			primitive: { topology: 'triangle-list' },
		});

		starCBPipe = device.createComputePipeline({
			label: 'star-compute',
			layout: 'auto',
			compute: { module: starCMod, entryPoint: 'cs' },
		});

		starRndPipe = device.createRenderPipeline({
			label: 'star-render',
			layout: 'auto',
			vertex: { module: starRMod, entryPoint: 'vs' },
			fragment: { module: starRMod, entryPoint: 'fs', targets: [{ format, blend: ADD }] },
			primitive: { topology: 'triangle-list' },
		});

		meteorCPipe = device.createComputePipeline({
			label: 'meteor-compute',
			layout: 'auto',
			compute: { module: meteorCMod, entryPoint: 'cs' },
		});
		meteorRPipe = device.createRenderPipeline({
			label: 'meteor-render',
			layout: 'auto',
			vertex: { module: meteorRMod, entryPoint: 'vs' },
			fragment: { module: meteorRMod, entryPoint: 'fs', targets: [{ format, blend: ADD }] },
			primitive: { topology: 'triangle-list' },
		});

		flashPipe = device.createRenderPipeline({
			label: 'flash',
			layout: 'auto',
			vertex: { module: flashMod, entryPoint: 'vs' },
			fragment: { module: flashMod, entryPoint: 'fs', targets: [{ format, blend: ADD }] },
			primitive: { topology: 'triangle-list' },
		});

		nebulaBG = device.createBindGroup({
			layout: nebulaPipe.getBindGroupLayout(0),
			entries: [{ binding: 0, resource: { buffer: uniBuf } }],
		});
		flashBG = device.createBindGroup({
			layout: flashPipe.getBindGroupLayout(0),
			entries: [{ binding: 0, resource: { buffer: uniBuf } }],
		});

		meteorBuf = device.createBuffer({
			label: 'meteors',
			size: CFG.meteors * 32,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
		});
		{
			const init = new Float32Array(CFG.meteors * 8);
			for (let i = 0; i < CFG.meteors; i++) init[i * 8 + 6] = Math.random();
			device.queue.writeBuffer(meteorBuf, 0, init);
		}
		meteorCBG = device.createBindGroup({
			layout: meteorCPipe.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: { buffer: meteorBuf } },
				{ binding: 1, resource: { buffer: uniBuf } },
			],
		});
		meteorRBG = device.createBindGroup({
			layout: meteorRPipe.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: { buffer: meteorBuf } },
				{ binding: 1, resource: { buffer: uniBuf } },
			],
		});

		buildStars(starCount);
		resize();
	}

	/* ---------------- 尺寸 ---------------- */

	function resize() {
		if (S.destroyed) return;
		const dpr = Math.min(window.devicePixelRatio || 1, CFG.dprCap);
		const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
		const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
		if (canvas.width !== w || canvas.height !== h) {
			canvas.width = w;
			canvas.height = h;
		}
		if (S.cx === 0 && S.cy === 0) {
			S.cx = S.tx = w * 0.5;
			S.cy = S.ty = h * 0.5;
		}
	}

	/* ---------------- 交互（悬停转向，画布本身 pointer-events:none） ---------------- */

	function pointerTo(e: PointerEvent) {
		if (S.destroyed || !S.inView) return;
		// 用「相对画布中心的归一化偏移」而不是鼠标绝对坐标，
		// 否则消失点会跟着指针跑遍整个视口，转向幅度过大。
		const rect = canvas.getBoundingClientRect();
		const rw = Math.max(rect.width, 1);
		const rh = Math.max(rect.height, 1);
		const nx = clamp((e.clientX - rect.left) / rw - 0.5, -0.5, 0.5);
		const ny = clamp((e.clientY - rect.top) / rh - 0.5, -0.5, 0.5);
		S.tx = canvas.width * (0.5 + nx * 2 * CFG.pointerParallax);
		S.ty = canvas.height * (0.5 + ny * 2 * CFG.pointerParallax);
		S.lastPointer = performance.now();
	}

	/* ---------------- Canvas 2D 回退 ---------------- */

	function init2D() {
		c2d = canvas.getContext('2d');
		stars2d = [];
		const n = isMobile ? 700 : 1400;
		for (let i = 0; i < n; i++) {
			stars2d.push({
				x: Math.random() * canvas.width - canvas.width / 2,
				y: Math.random() * canvas.height - canvas.height / 2,
				z: Math.random() * canvas.width,
				o: 0.3 + Math.random() * 0.7,
				c: Math.random(),
			});
		}
	}

	function star2dColor(t: number, a: number) {
		// 与 GPU 版 starColor 同族：蓝白 → 暖白 → 橙
		if (t < 0.7) return `rgba(190, 214, 255, ${a})`;
		if (t < 0.9) return `rgba(255, 248, 240, ${a})`;
		return `rgba(255, 200, 150, ${a})`;
	}

	function draw2D(dt: number) {
		if (!c2d) init2D();
		if (!c2d) return;
		const w = canvas.width;
		const h = canvas.height;
		const cxp = S.cx || w / 2;
		const cyp = S.cy || h / 2;
		const focal = w * 1.6;
		const sp = S.speed;

		// 深空底色 + 轻微星云晕
		c2d.fillStyle = 'rgb(3, 7, 16)';
		c2d.fillRect(0, 0, w, h);
		const neb = c2d.createRadialGradient(cxp, cyp, 0, cxp, cyp, Math.max(w, h) * 0.6);
		neb.addColorStop(0, 'rgba(30, 58, 110, 0.20)');
		neb.addColorStop(0.5, 'rgba(18, 34, 72, 0.10)');
		neb.addColorStop(1, 'rgba(3, 7, 16, 0)');
		c2d.fillStyle = neb;
		c2d.fillRect(0, 0, w, h);

		for (const s of stars2d) {
			s.z -= sp * dt;
			if (s.z <= CFG.nearZ) {
				s.z = w;
				s.x = Math.random() * w - cxp;
				s.y = Math.random() * h - cyp;
			}
			const k = focal / s.z;
			const px = cxp + s.x * k;
			const py = cyp + s.y * k;
			if (px < -8 || px > w + 8 || py < -8 || py > h + 8) continue;
			const zf = 1 - s.z / w;
			const r = Math.min(2.4, 0.8 * k);
			c2d.fillStyle = star2dColor(s.c, Math.min(1, s.o * (0.25 + 0.75 * zf)));
			c2d.beginPath();
			c2d.arc(px, py, r, 0, Math.PI * 2);
			c2d.fill();
		}

		if (S.flash > 0.004) {
			c2d.fillStyle = `rgba(140, 204, 255, ${Math.min(1, S.flash) * 0.6})`;
			c2d.fillRect(0, 0, w, h);
		}
	}

	/* ---------------- 主循环 ---------------- */

	let last = performance.now();

	function writeUniforms(w: number, h: number, sdt: number) {
		const focal = 0.9 * Math.hypot(w, h);
		U[0] = w;
		U[1] = h;
		U[2] = S.cx;
		U[3] = S.cy;
		U[4] = S.time;
		U[5] = sdt;
		U[6] = S.speed;
		U[7] = CFG.maxZ;
		U[8] = focal;
		U[9] = CFG.nearZ;
		U[10] = CFG.maxZ * 0.62;
		U[11] = 1.0 + S.warp * 1.1;
		U[12] = CFG.size;
		U[13] = S.warp;
		U[14] = S.flash;
		U[15] = S.frame % 100000;
	}

	function encodeFrame() {
		if (!device) return;
		device.queue.writeBuffer(uniBuf!, 0, U);

		const enc = device.createCommandEncoder();

		{
			const cp = enc.beginComputePass();
			cp.setPipeline(starCBPipe!);
			cp.setBindGroup(0, starCBG!);
			cp.dispatchWorkgroups(Math.ceil(starCount / 64));

			cp.setPipeline(meteorCPipe!);
			cp.setBindGroup(0, meteorCBG!);
			cp.dispatchWorkgroups(Math.ceil(CFG.meteors / 64));
			cp.end();
		}

		{
			const rp = enc.beginRenderPass({
				colorAttachments: [
					{
						view: context!.getCurrentTexture().createView(),
						clearValue: { r: 0.008, g: 0.012, b: 0.028, a: 1 },
						loadOp: 'clear',
						storeOp: 'store',
					},
				],
			});

			rp.setPipeline(nebulaPipe!);
			rp.setBindGroup(0, nebulaBG!);
			rp.draw(3);

			rp.setPipeline(starRndPipe!);
			rp.setBindGroup(0, starRBG!);
			rp.draw(6, starCount);

			rp.setPipeline(meteorRPipe!);
			rp.setBindGroup(0, meteorRBG!);
			rp.draw(6, CFG.meteors);

			if (S.flash > 0.002) {
				rp.setPipeline(flashPipe!);
				rp.setBindGroup(0, flashBG!);
				rp.draw(3);
			}

			rp.end();
		}

		device.queue.submit([enc.finish()]);
	}

	function stepPhysics(dt: number) {
		S.time += dt;
		S.frame++;

		// 空闲自动巡航（消失点缓慢游移）
		const w = canvas.width;
		const h = canvas.height;
		if (performance.now() - S.lastPointer > 3500) {
			S.tx = w * 0.5 + Math.sin(S.time * 0.13) * w * CFG.idleDriftX;
			S.ty = h * 0.5 + Math.cos(S.time * 0.097) * h * CFG.idleDriftY;
		}
		const ease = 1 - Math.exp(-dt * 2.0);
		S.cx += (S.tx - S.cx) * ease;
		S.cy += (S.ty - S.cy) * ease;

		S.warp += ((S.warpOn ? 1 : 0) - S.warp) * (1 - Math.exp(-dt * 2.6));
		S.speed += (S.targetSpeed - S.speed) * (1 - Math.exp(-dt * 1.8));
		S.flash *= Math.exp(-dt * 3.2);
		if (S.flash < 0.002) S.flash = 0;
	}

	function tick(now: number) {
		if (S.destroyed) return;
		S.rafId = requestAnimationFrame(tick);

		const raw = (now - last) / 1000;
		last = now;
		const dt = Math.min(Math.max(raw, 0.0005), 0.05);

		resize();
		stepPhysics(dt);

		const sdt = dt;
		writeUniforms(canvas.width, canvas.height, sdt);

		if (S.usesGPU && device) {
			encodeFrame();
		} else {
			draw2D(sdt);
		}
	}

	/* ---------------- 启停控制 ---------------- */

	function start() {
		if (S.destroyed || !S.ready || reduced || S.running || !S.inView || !S.pageVisible) return;
		S.running = true;
		last = performance.now();
		S.rafId = requestAnimationFrame(tick);
	}

	function stop() {
		if (S.rafId) cancelAnimationFrame(S.rafId);
		S.rafId = 0;
		S.running = false;
	}

	/** reduced-motion：只渲染一帧静态星场 */
	function renderStaticFrame() {
		if (S.destroyed) return;
		resize();
		S.time = 4; // 给星云一个固定相位的采样点
		writeUniforms(canvas.width, canvas.height, 0);
		if (S.usesGPU && device) {
			encodeFrame();
		} else {
			draw2D(0);
		}
	}

	/* ---------------- 公开 API ---------------- */

	const handle: StarfieldHandle = {
		travel() {
			S.warpOn = true;
			S.targetSpeed = CFG.warpSpeed;
			S.flash = Math.max(S.flash, 0.5);
		},
		settle() {
			S.warpOn = false;
			S.targetSpeed = CFG.cruise;
		},
		pulse(strength = 0.7) {
			S.flash = Math.min(1, Math.max(0.2, strength));
		},
		destroy() {
			if (S.destroyed) return;
			S.destroyed = true;
			stop();
			window.removeEventListener('pointermove', pointerTo);
			window.removeEventListener('resize', onWinResize);
			document.removeEventListener('visibilitychange', onVisibility);
			io.disconnect();
			ro.disconnect();
			starBuf?.destroy();
			meteorBuf?.destroy();
			uniBuf?.destroy();
			try {
				device?.destroy();
			} catch {
				/* 忽略 */
			}
			device = null;
			c2d = null;
			stars2d = [];
		},
	};

	/* ---------------- 监听 ---------------- */

	const onWinResize = () => {
		resize();
		if (reduced) renderStaticFrame();
	};

	const onVisibility = () => {
		S.pageVisible = !document.hidden;
		if (S.pageVisible && S.inView) start();
		else stop();
	};

	const io = new IntersectionObserver(
		(entries) => {
			S.inView = entries[0]?.isIntersecting ?? false;
			if (S.inView && S.pageVisible) start();
			else stop();
		},
		{ threshold: 0 },
	);
	io.observe(canvas);

	const ro = new ResizeObserver(() => {
		resize();
		if (reduced) renderStaticFrame();
	});
	ro.observe(canvas);

	document.addEventListener('visibilitychange', onVisibility);
	window.addEventListener('resize', onWinResize);
	window.addEventListener('pointermove', pointerTo, { passive: true });

	/* ---------------- 初始化 ---------------- */

	async function init() {
		if (reduced) {
			// reduced-motion：不进入 RAF，只画一帧
			try {
				await initWebGPU();
			} catch {
				S.usesGPU = false;
			}
			renderStaticFrame();
			// 静态模式下不再需要指针交互
			window.removeEventListener('pointermove', pointerTo);
			return handle;
		}

		try {
			await initWebGPU();
		} catch (err) {
			console.info('[starfield] WebGPU 不可用，回退 Canvas 2D：', err);
			S.usesGPU = false;
			c2d = null;
			resize();
		}
		S.ready = true;
		start();
		return handle;
	}

	return init();
}
