# AGENTS

This workspace uses a docs-first collaboration model.

## Default Startup Prompt

Before doing meaningful work in this repo, always build context from the current docs system in this order:

1. `docs/onboarding.md`
2. `docs/current-status.md`
3. `docs/roadmap.md`
4. `docs/architecture.md`
5. the role-specific or task-specific doc that matches the work

## Workspace Rules

- Treat `docs/current-status.md` as the current execution board.
- Treat `docs/roadmap.md` as the long-term task map.
- Treat `docs/timeline.md` as the source of major project milestones.
- Treat `docs/doc-system.md` as the doc governance source of truth.
- When a task changes architecture, delivery flow, or major team process, update docs before closing the task.
- When a task finishes a meaningful phase, update `docs/current-status.md` and `docs/timeline.md`.

## Role Prompts

If the user asks you to act as a specific project role, load the matching role card and startup prompt from:

- `docs/codex/role-cards/`
- `docs/codex/startup-prompts/`

## Current Project Direction

- Mobile-first product experience is the default.
- Content delivery and community interaction are intentionally split:
  - content goes through versioned JSON delivery
  - community goes through real-time API + database

For the rationale, read:

- `docs/backend-foundation.md`
- `docs/adr/adr-001-content-json-and-community-api-split.md`
