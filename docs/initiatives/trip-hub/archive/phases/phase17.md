# Phase 17

## 目标

收 CSS、文档和验证体系，把前面的结构性重构整理成可长期维护的仓库状态。

这一阶段是收口，不再引入新的大范围结构变化。

## 范围

- 拆分前端样式文件
- 更新 README、架构说明与内容流水线说明
- 做关键功能回归检查
- 清理不再使用的历史入口和命名

## Step By Step

1. 拆样式层
   把 `yunnan.css` 按 tokens / base / layout / views / overlays 分层。

2. 收文档
   保留“当前有效”的项目入口说明，弱化历史过程文档对日常开发入口的干扰。

3. 做回归清单
   检查总览、行程、景点、清单、搜索、详情、灯箱、深链和本地存储。

4. 清旧路径
   删除已废弃的历史脚本入口和不再使用的结构残留。

## 交付物

- 分层后的样式结构
- 更新后的项目与架构文档
- 一套可复用的回归检查清单
- 收口后的仓库目录

## 验收

- 样式不再依赖单个超大文件。
- 新同学能从 README 和 docs 快速定位当前真实入口。
- 关键功能经回归后保持可用。

## 本轮落地

- 把原来的 `static/guide/yunnan.css` 机械拆到 `static/guide/css/`：按 `tokens / base / layout / views / overlays / responsive` 分层，并新增 `main.css` 作为主入口。
- `static/guide/yunnan.css` 收成兼容层，页面入口切到 `static/guide/css/main.css`。
- 新增 `docs/initiatives/trip-hub/architecture/architecture.md`、`docs/initiatives/trip-hub/architecture/content-pipeline.md`、`docs/workflow/operations/regression-checklist.md`，把“当前有效入口”从历史 phase 文档里抽出来。
- `docs/README.md` 和仓库 `readme.md` 改为优先指向当前架构、内容流水线和回归清单。
