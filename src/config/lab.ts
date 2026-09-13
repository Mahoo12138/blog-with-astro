/**
 * 实验室（/lab）注册表。
 *
 * 设计约定（加新 demo 只看这一节就够了）：
 *
 *   1. 一个 demo = `src/lab/demos/<id>/` 一个目录，`id` 同时是 URL slug。
 *   2. 目录里必须有 `index.astro` —— 它是 demo 的入口组件，由详情页
 *      `src/pages/lab/[slug].astro` 用 import.meta.glob 自动发现。
 *      缺文件会在构建期直接抛错（见 [slug].astro），不会静默出空页。
 *   3. `index.astro` 内部用什么框架没人管：原生 <script>、React island、
 *      Vue island、WebGL……随便。这也是「技术栈无关」的落点 ——
 *      hydration 指令（client:*）写在 demo 自己的 index.astro 里，
 *      Astro 才静态分析得到；详情页只做一次不带指令的 <Component />。
 *
 *      原生 demo 的脚本写法有个坑（见 game-of-life/index.astro）：
 *      不要给 <script> 加 data-astro-rerun —— 带属性的脚本会被 Astro 按
 *      is:inline 处理、不再打包，TS 的 import 会原样漏进 HTML。
 *      正确姿势是「模块脚本自执行一次 + 再挂 astro:page-load」，
 *      mountLabDemo 内部有守卫，重复调用不会重复挂载。
 *   4. 目录里可以有可选的 `preview.astro`：列表页卡片的缩略预览。
 *      没有就用 CSS 生成的占位块。
 *   5. 最后在这里 `labDemos` 数组里登记一条元数据。
 */

/** demo 的实现方式，仅用于列表页打标签，不参与构建逻辑 */
export type LabRuntime = 'vanilla' | 'react' | 'vue' | 'webgl' | 'wasm';

export const LAB_RUNTIME_LABEL: Record<LabRuntime, string> = {
	vanilla: '原生',
	react: 'React',
	vue: 'Vue',
	webgl: 'WebGL',
	wasm: 'Wasm',
};

export interface LabDemo {
	/** URL slug，必须与 src/lab/demos/ 下的目录名一致 */
	id: string;
	title: string;
	description: string;
	tags: string[];
	runtime: LabRuntime;
	/** YYYY-MM-DD，列表页按此倒序 */
	updatedAt: string;
	status?: 'stable' | 'wip';
	/** 舞台宽高比，默认 16 / 9 */
	aspect?: string;
	/** 详情页「实验说明」要点，可省 */
	notes?: string[];
}

export const labPageConfig = {
	title: '实验室',
	description: '用代码做的小实验：可视化、物理仿真、交互式 toy。',
};

export const labDemos: LabDemo[] = [
	{
		id: 'game-of-life',
		title: '生命游戏',
		description: 'Conway 元胞自动机：四条规则演化出滑翔机、脉冲星与永不落幕的混沌汤。',
		tags: ['元胞自动机', 'Canvas', '原生'],
		runtime: 'vanilla',
		updatedAt: '2026-09-13',
		status: 'stable',
		aspect: '16 / 9',
		notes: [
			'网格上下左右环绕（环面拓扑），边界不会出现「撞墙」的假象。',
			'B3/S23：死细胞恰好 3 个邻居则出生，活细胞 2~3 个邻居则存活，其余死亡。',
			'鼠标（或手指）按住可以直接在网格上作画，画完按空格继续演化。',
		],
	},
	{
		id: 'double-pendulum',
		title: '双摆混沌',
		description: '两段摆臂、四条方程。给第二个摆 0.001 弧度的初始误差，看它何时彻底跑偏。',
		tags: ['物理仿真', '混沌', 'React'],
		runtime: 'react',
		updatedAt: '2026-09-13',
		status: 'stable',
		aspect: '16 / 9',
		notes: [
			'拉格朗日方程解析出角加速度，RK4 定步长积分（1/240 s 子步）。',
			'孪生摆只差 1e-3 rad 初始角，用于直观展示对初值的敏感依赖。',
			'阻尼为 0 时系统能量守恒，可以盯着它跑到天荒地老。',
		],
	},
];

export function getLabDemo(id: string): LabDemo | undefined {
	return labDemos.find((demo) => demo.id === id);
}

export function labDemoUrl(id: string): string {
	return `/lab/${id}/`;
}

/** 列表页展示顺序：新的在前 */
export function getSortedLabDemos(): LabDemo[] {
	return [...labDemos].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
