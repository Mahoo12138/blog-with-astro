# 我的项目页面

入口为 `/explore/` 的「创造与实践 → 我的项目」，页面地址为 `/projects/`。它沿用博客主题与左侧导航，内容区扩展至原右栏空间。项目桌面双列、窄屏单列，不增加额外右侧挂件；其他页面保持既有阅读宽度。

## 收录口径

初次整理使用 GitHub 公开用户仓库列表，与连接器仓库搜索交叉核对，共 99 个公开仓库；最近 90 天有推送的仓库为 16 个。日期范围与整理时间保存在数据文件中，页面按北京时间显示。`pushed_at` 是 GitHub 仓库推送时间，不是最后一条默认分支提交日期、个人贡献次数或版本发布时间。本地尚未推送的修改不进入这个时间。

候选快照与页面展示名单分开维护。按用户要求，`Mahoo12138/Mahoo12138`（GitHub Profile）与 `Mahoo12138/AI-Interviewer` 不展示；当前候选 16 个，实际展示 14 个。排除规则位于 `src/utils/project-data.mjs` 的 `PROJECT_EXCLUSIONS`，按完整仓库名、不区分大小写匹配，不会误排同名片段的新项目。

`selectProjectRepositories()` 在生成页面列表时应用规则，原始候选快照保持完整，因此再次运行同步不会让这两个项目重新出现。其他 Fork 和已归档项目仍保留对应标注。私有仓库与其他 owner 的仓库不会进入快照。

## 数据与文案

- `src/data/projects.json`：仅公开元数据的本地快照；不含 token、权限、账号资料或完整 README。
- `src/config/projects.ts`：根据公开 README 整理的中文名称、简介、方向、技术栈与必要说明。
- `src/utils/project-data.mjs`：公开范围、日期、URL、快照校验及独立的展示排除规则。
- `scripts/sync-projects.mjs`：显式刷新命令；不在用户访问或普通构建时请求 GitHub。

每条项目保留 GitHub 仓库链接；项目网站取自 GitHub 的公开 homepage 字段，仅接受无凭据的公网 HTTPS URL。网站入口不表示可以匿名使用或已经完成线上联调。TapType 保留其与 qwerty-learner 的关系说明；实验项目不宣称已完成全部研究目标。

刷新元数据：

```sh
pnpm projects:sync
# 可显式调整下一份快照的时间窗口
pnpm projects:sync --days=120
pnpm verify
```

刷新使用无需登录的 GitHub API，逐页读取全部公开仓库。GitHub 不可达、限流、分页未完成或结果为空时，命令退出失败并保留原数据。完整数据校验后以临时文件替换，并检测刷新期间的手动编辑。修改代码与文案后仍需查看 diff 再发布；它不是后台定时任务。

除明确排除的仓库外，新仓库会自动进入列表，尚未填写中文介绍时使用公开 description，方向为「其他项目」（Fork 为「学习与派生」）。后续可在 editorial 中补上介绍；项目方向仍作为静态信息展示，不再提供方向筛选。

## 交互与测试

所有项目服务端静态渲染。搜索、方向筛选、清除及查询参数控制器均已移除，不是通过 CSS 隐藏控件。带旧 `q` / `group` 参数的地址仍展示全部可见项目，不残留过滤状态。禁用 JavaScript 时展示与正常模式一致，源码和网站链接保持原生新窗口跳转。

项目页显式传入 `contentWidth="wide"` 与空右栏。StellarShell 只有在调用方选择宽版且没有右栏内容时才扩展桌面网格，默认的文章、专栏、关于和探索页面不变。项目网格依据内容容器宽度切换，优先保证单项简介的可读宽度；同一行的项目底部链接对齐。

`pnpm test:projects` 使用 Node 内置测试，覆盖公开数据边界、重复仓库、90 天边界、危险 URL、分页、失败保留快照、并发编辑、精确排除规则和重复同步不恢复排除项目。已加入 `pnpm verify`，普通验证不访问外网。

公开数据来源：`https://api.github.com/users/Mahoo12138/repos`。仓库说明来自各项目默认分支的 README；API 文档为 `https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user`。
