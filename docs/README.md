# Docs

这组文档现在按“入口 -> 治理 -> 现状 -> 状态 -> 方案 -> 决策 -> 归档”来维护，而不再只是零散说明文档集合。

## 当前优先入口

### 先看入口和状态

- `onboarding.md`
  新成员上手路径，告诉不同角色先看什么。
- `current-status.md`
  当前正在推进什么、哪些任务刚结项、当前风险是什么。
- `roadmap.md`
  长期任务线和优先级总盘。
- `doc-system.md`
  当前文档治理规则，说明哪些文档是现行入口、哪些只是历史记录。
- `timeline.md`
  项目关键节点的时间流。

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
- `backend-database-design.md`
  后端数据库设计稿。
- `backend-api-design.md`
  后端 API 设计稿。
- `backend-auth-design.md`
  登录、鉴权和访问控制设计稿。
- `community-moderation-design.md`
  评论审核与风控设计稿。
- `backend-state-machine.md`
  导入、发布和评论状态机设计稿。
- `editorial-trip-blueprint.md`
  当前页面信息架构和视觉方向蓝图。
- `amap-app-scheme.md`
  高德 App Scheme 内部参考，记录路径规划、点位打开和项目约定。

## 文件结构

### Index / Governance

- `README.md`
  文档总入口。
- `onboarding.md`
  新成员上手路径。
- `codex/`
  Codex 角色卡与 startup prompts。
- `templates/`
  团队开任务文档和 ADR 的模板区。
- `roadmap.md`
  长期任务线总盘。
- `current-status.md`
  当前执行状态板。
- `timeline.md`
  关键节点时间流。
- `doc-system.md`
  文档治理规则与更新约定。

### Current State

- `architecture.md`
- `content-pipeline.md`
- `source-materials.md`
- `regression-checklist.md`

### Active Planning

- `backend-foundation.md`
- `backend-database-design.md`
- `backend-api-design.md`
- `backend-auth-design.md`
- `community-moderation-design.md`
- `backend-state-machine.md`
- `mobile-first-redesign.md`
- `editorial-trip-blueprint.md`
- `amap-app-scheme.md`

### Decisions

- `adr/`
  高影响架构决策记录。

### Archive / History

- `archive/`
  已结项或已被替代的过程资料归档区。
- `phases/`
  历史分阶段落盘，不作为新任务的默认主入口。

## 使用方式

1. 新成员先看 `onboarding.md`。
2. 开工前先看 `current-status.md`，确认当前任务面。
3. 再看 `roadmap.md`，确认长期上下文。
4. 开发当前代码前，先看 `architecture.md` 和 `content-pipeline.md`。
5. 做专项任务时，看对应专题文档，比如 `backend-foundation.md`。
6. 遇到高影响技术方向变化，补 `adr/`。
7. 大块任务结项时，要同步 `current-status.md` 和 `timeline.md`。
8. 不再作为现行入口的过程资料进入 `archive/`。
9. 如果要把 Codex 切到具体岗位，先看 `docs/codex/README.md`。
