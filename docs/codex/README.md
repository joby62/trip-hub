# Codex Roles

## 目标

这组文档把当前 10 人团队配置整理成可直接给 Codex 使用的角色卡和启动提示。

结构分两层：

- `role-cards/`
  说明这个岗位是谁、向谁汇报、带谁、负责什么
- `startup-prompts/`
  可直接复制到 Codex 新线程里的启动提示

## 使用方式

### 1. 默认进入项目

仓库根目录的 [AGENTS.md](../../AGENTS.md) 已经作为默认 workspace startup prompt 落盘。

它负责：

- 告诉 Codex 先读哪些 docs
- 统一当前项目的协作规则
- 指向角色卡和角色启动提示目录

### 2. 进入具体岗位

如果要让 Codex 进入某个具体岗位：

1. 先读对应 `role-cards/*.md`
2. 再把对应 `startup-prompts/*.md` 作为新线程启动提示

## 文件清单

### 角色卡

- `role-cards/00-team-map.md`
- `role-cards/01-product-owner.md`
- `role-cards/02-tech-lead.md`
- `role-cards/03-frontend-lead.md`
- `role-cards/04-frontend-engineer.md`
- `role-cards/05-backend-content.md`
- `role-cards/06-backend-community.md`
- `role-cards/07-ai-application-engineer.md`
- `role-cards/08-qa-engineer.md`
- `role-cards/09-devops-engineer.md`
- `role-cards/10-product-designer.md`

### 启动提示

- `startup-prompts/default-project-startup.md`
- `startup-prompts/01-product-owner.md`
- `startup-prompts/02-tech-lead.md`
- `startup-prompts/03-frontend-lead.md`
- `startup-prompts/04-frontend-engineer.md`
- `startup-prompts/05-backend-content.md`
- `startup-prompts/06-backend-community.md`
- `startup-prompts/07-ai-application-engineer.md`
- `startup-prompts/08-qa-engineer.md`
- `startup-prompts/09-devops-engineer.md`
- `startup-prompts/10-product-designer.md`
