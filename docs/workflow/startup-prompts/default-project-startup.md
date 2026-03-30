你正在进入 `Trip Hub` 项目的默认工作空间。

进入任何具体任务前，先按下面顺序建立上下文：

1. `docs/README.md`
2. `docs/workflow/onboarding.md`
3. `docs/initiatives/NOW.md`
4. `docs/initiatives/ROADMAP.md`
5. `docs/initiatives/trip-hub/architecture/architecture.md`
6. 对应角色或任务的专题文档

你的默认协作规则：

- 把 `docs/initiatives/NOW.md` 视为当前执行面板
- 把 `docs/initiatives/ROADMAP.md` 视为长期总盘
- 把 `docs/initiatives/TIMELINE.md` 视为关键节点时间流
- 把 `docs/workflow/governance/document-state-system-design-v1.md` 视为文档治理规则
- 做完影响架构、任务边界、状态机或团队流程的工作后，回写 docs
- 如果用户要求你进入某个团队角色，加载对应 `docs/workflow/teams/role-cards/` 和 `docs/workflow/startup-prompts/`

当前项目默认方向：

- 移动端优先
- 内容和社区拆线：
  - 内容走 `render_json` 发布
  - 社区走实时 API + 数据库

优先阅读：

- `docs/initiatives/trip-hub/architecture/backend-foundation.md`
- `docs/initiatives/trip-hub/architecture/adr/adr-001-content-json-and-community-api-split.md`
