# Timeline

## 目标

这份文档负责补上项目的时间流。

它不记录每一个细小 UI 改动，而是记录值得被团队回看的节点：

- 任务线启动
- 任务线结项
- 架构方向变化
- 文档系统升级
- 大的发布节点

## 维护规则

1. 只记大节点，不记零碎改动。
2. 每条记录必须能回答“发生了什么、影响是什么、下一步在哪里看”。
3. 某个大块任务结项时，必须在这里留下结项记录。

## 记录

### 2026-03-28

- 建立文档治理第二版。
  新增 `roadmap.md`、`doc-system.md`、`backend-foundation.md` 和首条 ADR，项目从“说明文档集合”升级为“带总盘、方案层和决策记录的治理系统”。

### 2026-03-28

- 补齐多人协作所需的执行层文档。
  新增 `current-status.md`、`timeline.md`、`archive/README.md` 和 `onboarding.md`，开始正式维护任务结项状态、时间流、归档规则和新人上手路径。

### 2026-03-29

- 把后端方案继续下钻到执行级文档。
  新增 `backend-database-design.md`、`backend-api-design.md` 和 `templates/` 模板区，开始为数据库实现、接口实现和多人协作文档提供统一底稿。

### 2026-03-30

- 把后端治理继续下钻到鉴权、审核和状态机层。
  新增 `backend-auth-design.md`、`community-moderation-design.md` 和 `backend-state-machine.md`，并把前一轮后端文档里的状态边界收正，避免后端实现时出现任务状态、发布状态和评论状态各写一套。

### 2026-03-30

- 建立 Codex 角色卡和 startup prompts。
  新增仓库级 `AGENTS.md` 作为默认 workspace startup prompt，并在 `docs/codex/` 下补齐 10 个岗位的角色卡与启动提示，方便后续直接按岗位拉起 Codex 协作线程。

## 历史补充说明

在这套时间流建立之前，项目更早的阶段性记录主要分散在：

- `phases/`
- 代码提交历史

后续不再把阶段演进主要记录在聊天里，而是回写到这里和对应专项文档。
