---
doc_id: trip-hub-runtime-architecture-v1
title: Trip Hub Runtime Architecture v1
doc_type: architecture
initiative: trip-hub
workstream: architecture
owner: tech-lead
reviewers:
  - product-owner
status: frozen
priority: p0
created_at: 2026-03-28
updated_at: 2026-03-30
phase: runtime-baseline
started_at: 2026-03-28
frozen_at: 2026-03-30
completed_at:
supersedes:
superseded_by:
related_docs:
  - trip-hub-content-pipeline-v1
---

# Architecture

## 当前结构

这个项目现在是一个“轻后端 + 静态前端 + 内容构建脚本”的旅行站：

- `app.py`
  提供 FastAPI 静态壳，把 `/` 重定向到 `/guides/yunnan`，并暴露 `static/` 与 `/healthz`。
- `static/guide/yunnan.html`
  页面骨架和 DOM 挂载点。
- `static/guide/js/`
  前端运行时模块，负责状态、路由、视图渲染、弹层、服务和工具函数。
- `static/guide/css/`
  分层样式入口，按 `tokens / base / layout / views / overlays / responsive` 组织。
- `static/guide/data/yunnan.blueprint.json`
  页面唯一主内容源。
- `scripts/`
  文档提取、day-map、blueprint、校验和统一构建入口。

## 前端模块

### 入口与状态

- `static/guide/js/main.js`
  装配入口。负责初始化、加载 blueprint、绑定事件和连接各模块。
- `static/guide/js/state.js`
  全局 UI 状态与 `sourceStore`。
- `static/guide/js/router.js`
  URL hash 解析与同步。

### 数据与派生

- `static/guide/js/selectors.js`
  统一从 `sourceStore` 和 `trip.editorial` 读取页面数据。
- `static/guide/js/render-helpers.js`
  共享渲染 helper。
- `static/guide/js/config.js`
  只保留 UI / runtime 常量，不再承载业务内容。

### 视图与弹层

- `static/guide/js/views/`
  四个一级视图：`overview / itinerary / attractions / checklist`
- `static/guide/js/overlays/`
  三个弹层：`search / detail / lightbox`

### 服务与工具

- `static/guide/js/services/`
  本地存储与高德地图跳转。
- `docs/initiatives/trip-hub/architecture/amap-app-scheme.md`
  高德 App Scheme 的项目内参考，记录统一参数约定、平台差异与分段导航策略。
- `static/guide/js/utils/`
  文本、素材路径等基础工具。

## 当前维护原则

1. 改页面展示内容：
   优先改 `scripts/yunnan_editorial_source.mjs`，然后重建 blueprint。
2. 改内容结构或字段：
   改 `scripts/build_yunnan_blueprint.py` 和相关脚本。
3. 改交互行为：
   改 `static/guide/js/` 对应模块。
4. 改样式：
   优先改 `static/guide/css/` 对应分层文件，不再向单个大 CSS 回填。
