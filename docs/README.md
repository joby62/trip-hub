# Docs

这组文档现在按“总盘 -> 现状 -> 方案 -> 决策 -> 历史”来维护，而不再只是零散说明文档集合。

## 当前优先入口

### 先看总盘

- `roadmap.md`
  当前任务线、优先级和推进状态总盘。
- `doc-system.md`
  当前文档治理规则，说明哪些文档是现行入口、哪些只是历史记录。

### 再看现状

- `architecture.md`
  当前运行时结构、模块职责和日常维护入口。
- `content-pipeline.md`
  当前内容流水线、产物和改动归属。
- `source-materials.md`
  原始 docx 素材包、提取结果和注意事项。
- `regression-checklist.md`
  每轮结构改动后的自动检查与页面回归清单。

### 再看当前方案

- `backend-foundation.md`
  后端第一版总方案，覆盖 `Word -> 豆包 -> JSON` 与真实社区互动。
- `editorial-trip-blueprint.md`
  当前页面信息架构和视觉方向蓝图。
- `amap-app-scheme.md`
  高德 App Scheme 内部参考，记录路径规划、点位打开和项目约定。

## 文件结构

### Index / Governance

- `README.md`
  文档总入口。
- `roadmap.md`
  任务线总盘和状态追踪入口。
- `doc-system.md`
  文档治理规则与更新约定。

### Current State

- `architecture.md`
- `content-pipeline.md`
- `source-materials.md`
- `regression-checklist.md`

### Active Planning

- `backend-foundation.md`
- `mobile-first-redesign.md`
- `editorial-trip-blueprint.md`
- `amap-app-scheme.md`

### Decisions

- `adr/`
  高影响架构决策记录。

### History

- `phases/`
  历史分阶段落盘，不作为新任务的默认主入口。

## 使用方式

1. 先看 `roadmap.md`，确认当前在推进哪条任务线。
2. 再看 `doc-system.md`，确认应该更新哪类文档。
3. 开发当前代码前，先看 `architecture.md` 和 `content-pipeline.md`。
4. 做专项方案时，看对应专题文档，比如 `backend-foundation.md`。
5. 遇到高影响技术方向变化，补 `adr/`。
6. 开发前后用 `regression-checklist.md` 做最小回归。
7. `phases/` 目录主要用于追溯历史，不再承担当前主方案角色。
