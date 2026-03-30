# Document State System Design v1

## Purpose

这套设计只解决一个问题：

- 文档 currentness 不能再靠文件修改时间、聊天记忆和模糊口述来判断

它不试图一次性清理所有历史文档。
历史 backfill 是单独工作，不是这版治理落地的前置条件。

## Core Judgment

时间不是文档真相。

`created_at` 和 `updated_at` 只能回答：

- 它什么时候被写
- 它最近什么时候改过

但回答不了：

- 哪份文档当前还能驱动执行
- 哪份文档只是历史参考
- 哪份文档已经被替代
- 哪份文档当前应出现在 repo 的默认入口

所以这里建立的是 `document state system`，不是时间排序系统。

## Repository Placement Model

这个仓库现在按两套系统维护：

- `docs/workflow/`
  - 治理、协作、startup prompt、handoff、ops、模板
- `docs/initiatives/`
  - 当前项目真相、方案、记录、归档、repo 级 currentness 面

放置规则：

- 如果文件定义“人怎么协作”，放 `docs/workflow/`
- 如果文件定义“项目当前什么是真的”，放 `docs/initiatives/`
- role prompt 不能替代 initiative truth
- assignment 不能替代 product / architecture baseline

## Non-Negotiable Rules

- 文档是 work object，不只是文件
- 每份 governed doc 必须有一个 owner
- 每份 governed live doc 必须有一个显式 status
- 没有 status 的文档不能出现在 currentness 面
- 同一 scope 同一时刻只能有一份 live truth
- supersede 关系必须显式写出来，不能靠聊天补脑

## Scope

这套状态系统适用于：

- adoption 后新建的 formal docs
- adoption 后被实质更新的 existing docs

它不要求对所有旧文档立刻补齐 front matter。

## Document Object Model

formal governed docs 顶部必须有 front matter。

必填字段：

- `doc_id`
- `title`
- `doc_type`
- `initiative`
- `workstream`
- `owner`
- `status`
- `priority`
- `created_at`
- `updated_at`

推荐字段：

- `phase`
- `reviewers`
- `started_at`
- `frozen_at`
- `completed_at`
- `supersedes`
- `superseded_by`
- `related_docs`

## Front Matter Template

```yaml
---
doc_id: trip-hub-backend-foundation-v1
title: Trip Hub Backend Foundation v1
doc_type: architecture
initiative: trip-hub
workstream: architecture
owner: tech-lead
reviewers:
  - product-owner
  - product-designer
status: active
priority: p0
created_at: 2026-03-28
updated_at: 2026-03-30
phase: backend-foundation
started_at: 2026-03-28
frozen_at:
completed_at:
supersedes:
superseded_by:
related_docs:
  - trip-hub-backend-api-design-v1
  - trip-hub-backend-database-design-v1
---
```

## Document Type System

- `strategy`
- `spec`
- `architecture`
- `rollout`
- `assignment`
- `review`
- `runbook`
- `record`
- `archive`

## Workstream System

- `product`
- `experience`
- `architecture`
- `content`
- `community`
- `operations`
- `workflow`

## Status System

- `draft`
- `active`
- `frozen`
- `in_execution`
- `blocked`
- `completed`
- `superseded`
- `archived`

## Status Intent

- `active` 不是已批准真相，只表示它当前在讨论或推进
- `frozen` 才是允许驱动下游实现的稳定真相
- `completed` 不是 `archived`
- `superseded` 必须指向替代文档
- `archived` 表示历史资料，不得作为当前决策依据

## Allowed Status Transitions

默认允许：

- `draft -> active`
- `active -> frozen`
- `active -> blocked`
- `blocked -> active`
- `frozen -> in_execution`
- `in_execution -> completed`
- `active -> superseded`
- `frozen -> superseded`
- `completed -> archived`
- `superseded -> archived`

默认禁止：

- `draft -> in_execution`
- `draft -> completed`
- `archived -> active`
- `superseded -> frozen`

## Currentness Surfaces

repo 级 currentness 统一通过 4 张面：

1. `/Users/lijiabo/AutoBioInterview/docs/initiatives/NOW.md`
   看现在什么是 live working set
2. `/Users/lijiabo/AutoBioInterview/docs/initiatives/ROADMAP.md`
   看长期任务线和优先级
3. `/Users/lijiabo/AutoBioInterview/docs/initiatives/DOC_INDEX.md`
   看 governed docs catalog
4. `/Users/lijiabo/AutoBioInterview/docs/initiatives/TIMELINE.md`
   看 append-only 生命周期记录

## Ownership Rule

- `product` 文档由 `product-owner`
- `experience` 文档由 `product-designer`
- `architecture` / `content` / `community` 技术文档由 `tech-lead`
- `operations` 文档由 `devops-engineer` 或当前 designated deployment owner
- `workflow` 文档由当前 docs governance owner，默认 `product-owner + tech-lead`

worker 可以提议状态变化，但不能自批。

## Bootstrap State

- 这套系统从 `2026-03-30` 起作为 repo 当前治理基线
- 历史 phase 文档已转入 archive 层
- 历史 docs 不做一次性全量 backfill
- 以后新文档和实质更新文档必须遵守此系统
