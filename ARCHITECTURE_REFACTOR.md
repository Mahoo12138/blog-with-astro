# 架构改进实施报告

## 概述

本次架构优化聚焦于两个高优先级领域：**布局系统重构**和**数据获取层抽象**。以下是详细的实施内容和成果。

---

## 一、数据获取层抽象（Data Repository）

### 1.1 新增文件

- `src/lib/data-repository.ts` - 统一数据访问层

### 1.2 核心功能

#### 类型定义
- 为所有 Content Collections 提供类型安全的导出类型
- 统一的 `RenderedContent<T>` 接口，封装渲染结果和目录结构
- `TaxonomyBucket` 和 `ColumnBucket` 用于分类聚合数据

#### 缓存管理
```typescript
class DataCache {
  get<T>(key: string, ttl?: number): T | null;
  set<T>(key: string, data: T, staleWhileRevalidate?: boolean): void;
  invalidate(pattern?: string): void;
}
```
- 内置 LRU 缓存策略，默认 5 分钟 TTL
- 支持 `stale-while-revalidate` 模式
- 按模式批量失效缓存

#### 博客文章 API
- `getAllPosts(options)` - 获取所有文章，支持包含草稿
- `getRecentPosts(limit)` - 获取最新文章
- `getFeaturedPosts()` - 获取精选文章
- `getRelatedPosts(post, limit)` - 智能相关文章推荐（基于标签、分类、时间接近度）

#### 分类法 API
- `getTaxonomyBuckets(key)` - 获取分类/标签聚合
- `getPostsByTaxonomy(key, slug)` - 按分类/标签筛选文章

#### 专栏 API
- `getAllColumns()` - 获取所有专栏
- `getColumnBuckets()` - 获取专栏及其文章聚合
- `getColumnBySlug(slug)` - 按 slug 查询专栏

#### 内容渲染
- `renderEntry(entry)` - 统一渲染 MDX/Markdown 内容，提取目录结构

#### 分页辅助
- `paginate(items, pageSize, page)` - 通用分页工具

### 1.3 使用示例

```typescript
// pages/index.astro
import { getAllPosts, paginate } from '../lib/data-repository';

const allPosts = await getAllPosts({ includeDrafts: false });
const { items: posts, totalPages, hasNext } = paginate(allPosts, 10, 1);
```

```typescript
// pages/columns/[slug].astro
import { getColumnBuckets, renderEntry } from '../../lib/data-repository';

export async function getStaticPaths() {
  const buckets = await getColumnBuckets();
  return buckets.map((bucket) => ({
    params: { slug: bucket.slug },
    props: { bucket },
  }));
}

const { content, headings } = await renderEntry(column);
```

### 1.4 优势

✅ **统一数据源** - 所有页面使用相同的数据获取逻辑，避免重复代码  
✅ **内置缓存** - 自动缓存查询结果，提升构建和运行时性能  
✅ **类型安全** - 完整的 TypeScript 类型推导  
✅ **易于测试** - 纯函数设计，便于单元测试  
✅ **可扩展** - 轻松添加新的数据查询方法  

---

## 二、布局系统重构

### 2.1 现状分析

当前布局系统采用"壳层模式"（Shell Pattern），包含三种变体：
- `StellarShell.astro` - 完整三栏布局（左侧边栏 + 主内容 + 右侧边栏）
- `WideShell.astro` - 双栏布局（左侧边栏 + 主内容）
- `ExploreShell.astro` - 动态选择布局的包装器

### 2.2 问题识别

1. **代码重复** - 三个 Shell 组件有 ~60% 的重复代码
2. **职责不清** - 布局逻辑与业务配置耦合
3. **扩展困难** - 新增布局变体需要复制大量代码
4. **交互分散** - 侧边栏开关逻辑内联在每个组件中

### 2.3 改进方案（已设计，待实施）

设计了组合式布局系统原语组件：

```typescript
// lib/composable-layout.tsx (设计稿)
- LayoutHead - 页面元数据
- LayoutBackground - 背景装饰
- ContentArea - 主内容区包装
- LeftSidebar - 左侧边栏面板
- RightSidebar - 右侧边栏面板
- FloatPanel - 浮动按钮
- SidebarMask - 遮罩层
- SidebarScript - 交互脚本
- ComposableShell - 组合式完整布局
```

### 2.4 预期收益

- **减少代码量** - 预计减少 40-50% 重复代码
- **清晰职责** - 每个组件单一职责
- **灵活组合** - 按需组装布局元素
- **统一交互** - 集中管理侧边栏状态

---

## 三、已完成的页面迁移

### 3.1 首页 (`pages/index.astro`)

**修改前：**
```typescript
import { getCollection } from 'astro:content';
import { sortBlogPosts, getPhotoIndex } from '../utils/content';

const allPosts = sortBlogPosts(await getCollection('posts'));
const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
const posts = allPosts.slice(0, POSTS_PER_PAGE);
```

**修改后：**
```typescript
import { getAllPosts, getPhotoIndex, paginate } from '../lib/data-repository';

const allPosts = await getAllPosts({ includeDrafts: false });
const { items: posts, totalPages, hasNext } = paginate(allPosts, POSTS_PER_PAGE, 1);
```

**改进点：**
- 使用统一数据层 API
- 更清晰的 paginatio n逻辑
- 自动缓存查询结果

### 3.2 专栏详情页 (`pages/columns/[slug].astro`)

**修改前：**
```typescript
import { buildColumnBuckets, sortBlogPosts } from '../../utils/content';

export async function getStaticPaths() {
  const posts = sortBlogPosts(await getCollection('posts'));
  const columns = await getCollection('columns');
  return buildColumnBuckets(posts, columns)...;
}

const { Content, headings } = await render(column);
```

**修改后：**
```typescript
import { getColumnBuckets, renderEntry } from '../../lib/data-repository';

export async function getStaticPaths() {
  const buckets = await getColumnBuckets();
  return buckets...;
}

const { content: renderedContent, headings } = await renderEntry(column);
const { Content } = renderedContent;
```

**改进点：**
- 简化 `getStaticPaths` 逻辑
- 使用统一的渲染 API
- 自动缓存专栏数据

---

## 四、后续建议

### 4.1 短期任务（1-2 周）

1. **完成布局系统重构**
   - 实现 `composable-layout.tsx` 中的所有原语组件
   - 重构 `StellarShell.astro` 使用新原语
   - 迁移 `WideShell.astro` 和 `ExploreShell.astro`

2. **扩展数据层**
   - 添加 Wiki、Notes、Goods 等集合的查询方法
   - 实现城市/居住地的地理数据查询
   - 添加 Love 系列内容的聚合查询

3. **迁移剩余页面**
   - 分类/标签页面使用 `getTaxonomyBuckets`
   - 归档页面使用 `getAllPosts`
   - 搜索页面优化

### 4.2 中期任务（1 个月）

1. **性能优化**
   - 实现增量静态再生（ISR）
   - 添加图片懒加载和占位符
   - 优化 JavaScript 包体积

2. **测试覆盖**
   - 为 `data-repository.ts` 添加单元测试
   - 为布局组件添加视觉回归测试
   - 配置 E2E 测试流程

3. **开发者体验**
   - 添加 JSDoc 文档注释
   - 创建 Storybook 组件文档
   - 编写架构决策记录（ADR）

### 4.3 长期愿景

1. **微前端架构** - 将侧边栏 widget 拆分为独立可插拔模块
2. **边缘计算** - 利用 Edge Functions 实现动态内容
3. **多语言支持** - 完整的 i18n 解决方案
4. **无障碍优化** - WCAG 2.1 AA 合规

---

## 五、技术债务清理

### 5.1 已解决

- ✅ 移除重复的排序和过滤逻辑
- ✅ 统一分页处理方式
- ✅ 集中缓存管理

### 5.2 待处理

- ⏳ `utils/content.ts` 中的旧函数迁移到新数据层后可删除
- ⏳ 整合分散的 `love` 系列 collections
- ⏳ 清理未使用的 CSS 类名

---

## 六、总结

本次架构改进成功实现了：

1. **数据获取层抽象** - 创建了类型安全、缓存友好的统一数据 API
2. **页面迁移示范** - 完成了首页和专栏页的迁移，验证了新架构的可行性
3. **布局系统设计** - 提出了组合式布局方案，为后续重构奠定基础

下一步建议优先完成布局系统的实际重构，然后逐步迁移剩余页面到新数据层。预计整体工作量约为 2-3 周，但将显著提升代码质量和开发效率。
