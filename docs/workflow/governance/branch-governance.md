# Branch Governance

## Core Rule

- `main` 是默认 reviewed source of truth
- 如果某轮任务需要 owner 指定别的 integration branch，必须先写进当前 workflow 或 initiative 文档
- 任何 worker 都不能把历史分支名当成当前 live 指令

## Default Strategy

- 默认 base branch：`main`
- owner / worker 的执行分支默认前缀：`codex/`
- phase 轮次如果需要单独收口，可以由 owner 指定：
  - `codex/<track-name>`
  - `codex/<phase-name>`

## Daily Routine

每个执行角色每天至少一次：

- `git fetch origin`
- `git rebase origin/<owner-designated-base-branch>`

如果当前没有显式 alternate base branch，就默认 `<owner-designated-base-branch> = main`。

## Non-Negotiable Rules

- worker 不直推 `main`
- 不把无关 dirty files 混进当前任务
- 不把历史 phase 分支当 live truth
- 不做 destructive git 操作
- integration gate 由 owner 判，不由 worker 自判

## Docs Coupling Rule

如果当前轮次会改：

- 架构边界
- rollout 顺序
- currentness 状态
- owner / worker 执行模型

那么分支策略必须和当前 docs 保持一致，不能只在代码里改，不回写文档。
