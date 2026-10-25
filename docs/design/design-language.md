# 基础设计语言 · Base Design Language

> 真源：`src/styles/theme.css.ts`（token）· `src/styles/sidebarRows.css.ts`（行排版）·
> `src/styles/tools.css.ts`（控件审美约定）· `docs/design/article-banner-philosophy.md`（视觉哲学）。
> 本文是四者的提炼与成文；实现以代码真源为准，冲突时改本文。
> 活文档展示：站内 `/kit`（组件与范式实时对照）。

---

## 一 · Token 总表

所有 token 以 CSS 自定义属性发布（`vars.*`），明暗两套值随 `[data-theme]` / `prefers-color-scheme` 切换；
`[data-color-scheme="…"]` 色样轴另行派生（tone/motion 不随色样变化 —— 语义色保持恒定）。

### color

| token | light | dark | 用途 |
| --- | --- | --- | --- |
| `accent` | `#476b92` | `#9ab5d3` | 主色：链接 hover、强调 |
| `accentStrong` | `#365b81` | `#b7cde6` | 主色高亮：链接默认、选中文字 |
| `accentSoft` | `rgba(71,107,146,.08)` | `rgba(154,181,211,.12)` | **反馈 halo**：hover / active / 选中底衬 |
| `background` | `#fafafa` | `#151719` | 页面底色 |
| `backgroundElevated` | `#f4f4f5` | `#202326` | 抬升底（工具条、输入槽） |
| `surface` / `surfaceStrong` | `#ffffff` | `#1c1f22` | 卡片面 |
| `surfaceMuted` | `#fafafa` | `#202326` | 弱面（blockquote、折叠） |
| `textStrong` | `#202327` | `rgba(241,245,249,.96)` | 标题、强调文字 |
| `text` | `#373b41` | `rgba(241,245,249,.82)` | 正文 |
| `textMuted` | `#606770` | `#b0b6be` | 次级说明 |
| `textMeta` | `#69717b` | `#a1a8b2` | meta 小字 |
| `border` / `borderStrong` | `#e8e9eb` / `#d7dadd` | 低透明白灰 | **克制使用**（见 Do/Don't） |
| `codeBackground` / `codeText` | 蓝调浅晕 / 深蓝 | 蓝调深晕 / 浅蓝 | 行内代码 |

### tone（语义色调）

`fg` 为前景/边条，`bg` 一律低透明度 halo（`color-mix` 10%–14%），**禁止近白底上叠近白填充**。

| tone | fg (light / dark) | 用途 |
| --- | --- | --- |
| `info` | `#2457d6` / `#8fb3f0` | 提示、教学强调（对应参考教学页的蓝） |
| `success` | `#0d7f76` / `#5fc4b4` | 成功、构建期（teal 系） |
| `warning` | `#b4690e` / `#e0b070` | 注意、边界情况（amber 系） |
| `danger` | `#c23a4b` / `#e8949f` | 危险、错误路径（red 系） |

### space / radius / shadow / layout

```
space   xs .25 | sm .5 | md .75 | lg 1 | xl 1.5 | xxl 2 | xxxl 3 | xxxxl 4 | section 6   (rem)
radius  sm 6px | md 10px | lg 14px | xl 20px | pill 999px
shadow  head  0 2px 12px rgba(0,0,0,.035)      顶栏
        card  0 1px 3px rgba(0,0,0,.025)       卡片（几乎不可见的悬浮）
        focus 0 0 0 4px rgba(33,150,243,.18)   焦点晕
        float 0 18px 55px rgba(27,44,69,.08)   悬浮件/hero 深阴影（dark 加深至 .45）
layout  content 46rem | listing 60rem | shell 72rem | header 4.5rem
```

### motion

```
ease          cubic-bezier(0.16, 1, 0.3, 1)    唯一缓动曲线，不回弹
durationFast  150ms     hover 反馈、小状态切换
durationBase  200ms     常规过渡
durationSlow  240ms     入场、展开
```

---

## 二 · 排版

字体栈（`src/config/fonts.ts`）：body **Noto Sans SC** · heading **Noto Sans SC**（标题无衬线，2026-10 定调；/love 子站按自己的设计语言另用衬线）· mono **JetBrains Mono**。

| 层级 | 规格 |
| --- | --- |
| 正文 | 18px / 1.8（≤768px 降 17px），`text` |
| h1 | `clamp(2.75rem, 6vw, 4.5rem)`，无衬线，`letter-spacing: -0.025em`，`line-height: 1.1` |
| h2 | `clamp(2rem, 4vw, 3.1rem)`，同上 |
| h3 | `clamp(1.45rem, 3vw, 2rem)`，同上 |
| h4 / h5 | 1.25rem / 1.1rem |
| UI 组标题 | 12–13px / 600 / `textStrong` |
| UI 行 | 13px / 1.55 |
| UI meta | 0.7rem / `textMeta` / 不换行 |
| 数值 | `font-variant-numeric: tabular-nums`；工具页行内 `<code>` 数值只借等宽字形（`padding:0; background:transparent`） |

---

## 三 · 间距节奏

`space` 阶梯以 4px 为呼吸单位（与「深空显影」一致）：组件内聚用 xs–md，卡片内用 lg–xl，
区块之间用 xxl–xxxxl，页面大分节用 `section`。**版式的秩序靠每个元素落在该在的位置，不靠分割线画出来。**

---

## 四 · 范式四件套

### 1. Card

`surface` 底 + `radius.lg` + `shadow.card`（或无影），需要边界时用 `border` **单线**。
卡片之间/与结构之间靠留白分隔。交互卡片 hover 可上浮 2–3px + `accent` 描边 + `accentSoft` 外晕（参考 `welcomeGrid.css.ts` 的 `cardInteractive`）。

### 2. Ghost 控件（按钮 / 输入）

常态**零装饰**（无边框盒、无填充底），图标 + 占位文字；hover / 聚焦时浮现 `accentSoft` 圆角淡晕。
按下可 `scale(0.96)`。聚焦可见性用 `accentStrong` 轮廓（2px / offset 3px）。
**近白底上的反馈元素必须与底色拉开明度差** —— 白底叠白填充等于没有反馈。

### 3. Sidebar Row（唯一真源 `sidebarRows.css.ts`）

```
padding 6px 16px | borderRadius 6px | fontSize 13px | 行距 gap 2px
hover  → accentSoft 底 + accentStrong 字（150ms ease）
active → accentSoft 底 + accentStrong + 600
meta   → 0.7rem 右对齐、贴容器右缘 −16px
```

左基线 16px（挂件容器起）；新挂件的列表行一律复用 `rows.*`，不要各写一套 padding。

### 4. Tone Callout

两形态：**左边条**（`tone.*.fg` 3–4px + `tone.*.bg` 底）或 **halo 块**（`tone.*.bg` 底 + `tone.*.fg` 标签文字）。
同一页最多一层分割线语义 —— callout 的左边条是色彩不是结构分割。

---

## 五 · 动效规则

1. 缓动只用 `motion.ease`；时长只用 150 / 200 / 240ms 三档；**禁止回弹、禁止弹性 overshoot**。
2. `prefers-reduced-motion` 必须降级：全局有兜底，但 **shadow DOM 内部不吃全局规则** ——
   每个 Web Component 的构造式样式表必须自带 reduced-motion 媒体查询；canvas/RAF 类组件 JS 侧 `matchMedia` 单帧降级。
3. 滚动入场 = IntersectionObserver；滚动跟随 = scroll 事件 + lerp；RAF 用完即停。
4. View Transitions 在 reduced-motion 下禁用（全局已处理）。

---

## 六 · Do / Don't

| ✅ Do | ❌ Don't |
| --- | --- |
| 反馈元素用 `accentSoft` 淡晕 | 近白底上再叠近白填充（隐形反馈） |
| 主结构用留白分隔 | 用发丝分割线切区块 |
| 一行（同排控件）最多一条分隔线 | tab 行已有 border 再给搜索框垫底线 |
| ghost 输入框（无边框，聚焦出淡晕） | 带边框的填充输入盒 |
| 工具页行内数值 mono + 透明底 | 蓝色 code 色块包 13 位毫秒数导致折行 |
| tone.bg 用低透明度 color-mix | 饱和色块直接铺底 |
| 动效 150–240ms、ease、不弹跳 | 各写各的缓动曲线（gallery/love 漂移是历史债） |

---

## 七 · Web Components 约定（kl- 套件）

- 前缀 `kl-`；Shadow DOM + 构造式样式表；token 经 CSS 变量穿透（`vars.*` 即 `var(--hash)`）。
- **教学文字一律写在光 DOM**（pagefind 索引、无 JS 可读）；shadow 内动态面板是补充材料。
- 数据装载三选一：光 DOM 子标记（散文）/ `<script type="application/json">` 子节点（结构化数据）/ 属性（标量）。
- 对外通信 `kl:*` 前缀 `CustomEvent(bubbles)`；注册幂等；`disconnectedCallback` 拆干净。
- 静态排版（card / tile / grid / 表格 / 编号徽章）**不做组件** —— 用 `src/styles/lesson.css.ts` 类。
- 代码块复用全站 `rehype-code-block` + `code-copy.js`；tabs / callout 复用 MDX shortcode。

---

## 八 · 示意图标准（Diagram v1）

真源：`src/components/mdx/diagram.css.ts`（视觉与几何）· `src/components/mdx/Diagram.astro`（声明式 API）。
课时里所有示意图一律用它，不再手写内联 SVG。

- **骨架**：单一 SVG `viewBox` = 设计尺寸；节点用 `<foreignObject>` 装 HTML（可换行、吃 token），随画布等比缩放。
- **语义角色 → 色**：`instr`（info 蓝）/ `gap`（warning 琥珀）/ `target`（success 青绿）/ `formula`（中性强调）/ `neutral`。全部走 `tone.*`，明暗自动切换；**MDX 里禁止写死 hex**。
- **盒子**：`radius.md` + 1px 边（fg 34%）+ fg 10% 淡底；标题 11px/700、副题 10px，居中。
- **箭头**：1.7px + 6×7 实心三角；只写 `from / at / to / fromX / toX / dir / len`，端点由节点几何计算 —— **禁止手写箭头坐标**。
- **字节布局**：`pxPerByte + x0` 配合 `span:[start,end]`，盒宽与边界成正比，`P / P+4` 等锚点天然落在字节边界。
- **可读性**：`max-width = 1.3× 设计宽`、`min-width = 0.88× 设计宽`；不足则横向滚动 + 右缘渐隐。

```mdx
<Diagram label="…" width={510} height={266} pxPerByte={60} x0={238}
  nodes={[
    { id: 'instr', span: [-3, 0], y: 10, h: 50, role: 'instr', title: '…', sub: '…' },
    { id: 'gap', span: [0, 4], y: 10, h: 50, role: 'gap', title: '…', sub: '…' },
  ]}
  arrows={[
    { from: 'gap', at: 'left', len: 16, label: 'P', labelAlign: 'middle' },
    { from: 'gap', at: 'right', len: 16, label: 'P + 4', labelAlign: 'end' },
  ]}
/>
```

---

*修订约定：新范式先进 `/kit` 与本文，再进页面；漂移的旧样式记为历史债，不扩散。*
