# Docs Index

`docs/` 现在正式拆成两套系统：

- `docs/workflow/`
  回答“团队应该怎么协作、怎么派工、怎么治理文档和分支”
- `docs/initiatives/`
  回答“项目当前什么是真的、正在推进什么、哪些资料已经归档”

这次重构保留了原来文档系统里最有价值的几层：

- 入口层
- 治理层
- currentness 面
- 团队角色与 startup prompts
- initiative 真相与归档

## Top-Level Split

### `docs/workflow/`

放这些：

- 文档治理规则
- 协作决策 SOP
- 分支治理
- onboarding
- startup prompts
- 团队组织与 owner / worker handoff
- operations 与模板

### `docs/initiatives/`

放这些：

- repo 级 currentness 面：
  - `NOW.md`
  - `ROADMAP.md`
  - `DOC_INDEX.md`
  - `TIMELINE.md`
- initiative 当前真相
- product / architecture 文档
- review / record / archive

## Current High-Value Entry Points

- workflow index:
  - `/Users/lijiabo/AutoBioInterview/docs/workflow/README.md`
- initiatives index:
  - `/Users/lijiabo/AutoBioInterview/docs/initiatives/README.md`
- onboarding:
  - `/Users/lijiabo/AutoBioInterview/docs/workflow/onboarding.md`
- currentness:
  - `/Users/lijiabo/AutoBioInterview/docs/initiatives/NOW.md`
  - `/Users/lijiabo/AutoBioInterview/docs/initiatives/ROADMAP.md`
  - `/Users/lijiabo/AutoBioInterview/docs/initiatives/DOC_INDEX.md`
  - `/Users/lijiabo/AutoBioInterview/docs/initiatives/TIMELINE.md`
- governance:
  - `/Users/lijiabo/AutoBioInterview/docs/workflow/governance/document-state-system-design-v1.md`
  - `/Users/lijiabo/AutoBioInterview/docs/workflow/governance/team-collaboration-decision-sop.md`
  - `/Users/lijiabo/AutoBioInterview/docs/workflow/governance/branch-governance.md`
- startup prompts:
  - `/Users/lijiabo/AutoBioInterview/docs/workflow/startup-prompts/README.md`
- team structure:
  - `/Users/lijiabo/AutoBioInterview/docs/workflow/teams/README.md`
- current initiative:
  - `/Users/lijiabo/AutoBioInterview/docs/initiatives/trip-hub/README.md`

## Placement Rule

- 如果文件回答“团队怎么协作、怎么启动角色、怎么派工、怎么做治理”，放进 `docs/workflow/`
- 如果文件回答“当前项目什么是真的、什么在推进、什么已经归档”，放进 `docs/initiatives/`
- startup prompt 不是 initiative 真相
- phase assignment 不是 product spec
- archive 不再和现行入口混放

## Current Directory Map

- `docs/workflow/governance/`
- `docs/workflow/startup-prompts/`
- `docs/workflow/teams/`
- `docs/workflow/operations/`
- `docs/workflow/templates/`
- `docs/initiatives/trip-hub/product/`
- `docs/initiatives/trip-hub/architecture/`
- `docs/initiatives/trip-hub/reviews/`
- `docs/initiatives/trip-hub/records/`
- `docs/initiatives/trip-hub/archive/`

## How To Read

1. 新成员先看 `/Users/lijiabo/AutoBioInterview/docs/workflow/onboarding.md`
2. 开工前先看 `/Users/lijiabo/AutoBioInterview/docs/initiatives/NOW.md`
3. 再看 `/Users/lijiabo/AutoBioInterview/docs/initiatives/ROADMAP.md`
4. 再进当前 initiative 的 `README` 和 live docs
5. 如果要开新角色线程，去 `/Users/lijiabo/AutoBioInterview/docs/workflow/startup-prompts/README.md`
