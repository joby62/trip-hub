# Documentation System

## 目标

这个项目已经不是一个“单页静态站改改样式”级别的工作量了，后续会同时推进：

- 移动端产品与交互持续迭代
- `Word -> 豆包 -> JSON` 的内容生产后端
- 景点评价的真实评论与互动后端
- 登录、存储、审核、发布与运维

因此文档必须从“说明型文档集合”升级成“治理型文档系统”。

## 当前问题

当前 `docs/` 有不少有效内容，但对“大项目多人协作”来说还缺 5 个关键能力：

1. 缺总盘。
   没有一份文档统一说明“长期任务线和优先级是什么”。
2. 缺状态板。
   没有一份文档说明“这周到底在推什么、哪个大块任务已经结项”。
3. 缺时间流。
   没有一条连续记录项目关键节点的时间线。
4. 缺决策记录层。
   重要判断容易散落在聊天和提交信息里。
5. 缺入职路径和归档规则。
   新成员不知道先看什么，旧资料也缺乏明确归档边界。

## 文档分层

后续 `docs/` 按下面 7 层维护：

### 1. Portal

回答“从哪里开始看”：

- `README.md`
- `onboarding.md`

### 2. Governance

回答“文档该怎么管理”：

- `doc-system.md`
- `templates/`

### 3. Current State

回答“项目现在是什么样”：

- `architecture.md`
- `content-pipeline.md`
- `source-materials.md`
- `regression-checklist.md`

### 4. Execution

回答“现在在做什么、做到哪了、什么时候结项”：

- `roadmap.md`
- `current-status.md`
- `timeline.md`

### 5. Active Planning

回答“某条任务线准备怎么做”：

- `backend-foundation.md`
- `backend-database-design.md`
- `backend-api-design.md`
- 其他专题方案文档

### 6. Decision Records

回答“为什么这么定”：

- `adr/adr-xxx-*.md`

ADR 只记录高影响判断，不记录一般性样式改动。

### 7. Archive / History

回答“旧资料放哪里、过去是怎么演进到今天的”：

- `archive/`
- `phases/`

`phases/` 继续保留，但默认作为历史资料层，而不是当前执行入口。

## 状态定义

路线图、状态板和专项方案统一使用下面 5 个状态：

- `proposed`
  已提出，但还没开始进入实现排期。
- `active`
  已明确进入当前推进队列。
- `blocked`
  方向明确，但受依赖限制暂时不能推进。
- `done`
  当前阶段目标已完成。
- `archived`
  不再推进，或已经被新方案替代。

## 大块任务生命周期

一条大块任务后续统一按下面的生命周期流转：

1. `proposed`
   先进入 `roadmap.md`，表示方向成立但还没进入当前推进面。
2. `active`
   进入 `current-status.md`，开始被持续跟进。
3. `done`
   阶段目标已完成，但结项信息仍需被团队看见。
4. `archived`
   不再作为当前任务线跟进，过程文档移入 `archive/` 或历史层。

也就是说：

- `roadmap.md` 负责长期任务线存在与优先级
- `current-status.md` 负责当前状态和结项可见性
- `timeline.md` 负责时间流与结项记录
- `archive/` 负责旧过程资料归位

## 更新规则

1. 开新任务线：
   先更新 `roadmap.md`，再决定是否需要新专题方案。
2. 任务进入实际推进：
   必须更新 `current-status.md`。
3. 大块任务结项：
   必须更新 `current-status.md` 和 `timeline.md`。
4. 临时执行文档失去现行价值：
   进入 `archive/`。
5. 改当前运行时结构：
   必须同步 `architecture.md`。
6. 改内容生产链路：
   必须同步 `content-pipeline.md` 和对应专项方案。
7. 改高影响技术方向：
   必须新增或更新一条 ADR。
8. 老 `phase` 文档不追求逐条补齐：
   如果和现行方案冲突，以现行方案和 ADR 为准。

## 推荐工作流

1. 先看 `docs/README.md`
2. 新成员先看 `docs/onboarding.md`
3. 先看 `docs/current-status.md`，再看 `docs/roadmap.md`
4. 再看对应专项方案文档
5. 开工前如需新开任务文档，优先复制 `docs/templates/`
6. 开工时确认是否需要补 ADR
7. 完成后更新状态板、时间流和相关专题文档

## 当前最重要的新增任务线

目前最需要进入现行治理层的是两条：

- 内容生产后端化
  目标是把 `Word -> JSON` 从本地脚本升级成正式服务。
- 社区互动后端化
  目标是让评论、点赞、UP、踩从本地存储升级成真实全站数据。
