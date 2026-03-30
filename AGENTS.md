# AGENTS

This workspace uses a docs-first collaboration model.

## Default Startup Prompt

Before doing meaningful work in this repo, always build context from the current docs system in this order:

1. `docs/README.md`
2. `docs/workflow/onboarding.md`
3. `docs/initiatives/NOW.md`
4. `docs/initiatives/ROADMAP.md`
5. `docs/initiatives/trip-hub/architecture/architecture.md`
5. the role-specific or task-specific doc that matches the work

## Workspace Rules

- Treat `docs/initiatives/NOW.md` as the current execution board.
- Treat `docs/initiatives/ROADMAP.md` as the long-term task map.
- Treat `docs/initiatives/TIMELINE.md` as the source of major project milestones.
- Treat `docs/workflow/governance/document-state-system-design-v1.md` as the doc governance source of truth.
- When a task changes architecture, delivery flow, or major team process, update docs before closing the task.
- When a task finishes a meaningful phase, update `docs/initiatives/NOW.md` and `docs/initiatives/TIMELINE.md`.

## Role Prompts

If the user asks you to act as a specific project role, load the matching role card and startup prompt from:

- `docs/workflow/teams/role-cards/`
- `docs/workflow/startup-prompts/`

## Current Project Direction

- Mobile-first product experience is the default.
- Content delivery and community interaction are intentionally split:
  - content goes through versioned JSON delivery
  - community goes through real-time API + database

For the rationale, read:

- `docs/initiatives/trip-hub/architecture/backend-foundation.md`
- `docs/initiatives/trip-hub/architecture/adr/adr-001-content-json-and-community-api-split.md`
