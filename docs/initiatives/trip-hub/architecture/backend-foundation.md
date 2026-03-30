---
doc_id: trip-hub-backend-foundation-v1
title: Trip Hub Backend Foundation v1
doc_type: architecture
initiative: trip-hub
workstream: architecture
owner: tech-lead
reviewers:
  - product-owner
  - backend-content
  - backend-community
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
  - trip-hub-backend-database-design-v1
  - trip-hub-backend-api-design-v1
---

# Backend Foundation

## 目标

后续这个项目的后端要同时解决两类问题：

1. 内容怎么从 Word 稳定生成前端可消费的 JSON
2. 社区互动怎么变成真实、可共享、可累计的数据

这份文档先给出第一版后端总方案，作为后续 API、数据库和任务队列设计的母文档。

下钻文档：

- [backend-database-design.md](./backend-database-design.md)
- [backend-api-design.md](./backend-api-design.md)
- [backend-auth-design.md](./backend-auth-design.md)
- [community-moderation-design.md](./community-moderation-design.md)
- [backend-state-machine.md](./backend-state-machine.md)

## 当前现状

### 运行时

当前后端仍是一个非常轻的 FastAPI 静态壳：

- [app.py](../../../../app.py)
  只负责页面入口、静态资源和 `/healthz`

### 内容链路

当前内容生产仍是本地脚本流水线：

- [extract_docx_bundle.py](../../../../scripts/extract_docx_bundle.py)
- [build_yunnan_day_map.py](../../../../scripts/build_yunnan_day_map.py)
- [build_yunnan_blueprint.py](../../../../scripts/build_yunnan_blueprint.py)
- [build_yunnan_content_bundle.py](../../../../scripts/build_yunnan_content_bundle.py)

### 社区互动

当前评论和反应仍是浏览器本地存储：

- [attraction-community.js](../../../../static/guide/js/services/attraction-community.js)
- [attraction-community.js](../../../../static/guide/js/utils/attraction-community.js)

所以现在的点赞、UP、踩、评论都不是真实全站数据。

## 总体设计

后端拆成两条主线，分别演进：

### A. 内容生产线

`Word -> 解析 -> 豆包结构化 -> JSON 校验 -> 发布版本 -> 前端读取`

### B. 社区互动线

`用户操作 -> API 写入 -> PostgreSQL 持久化 -> 聚合计数 -> 前端读取`

这两条线不要混在一起。

- 内容 JSON 适合版本化、可缓存、可回滚
- 社区互动适合实时 API、数据库聚合、权限控制

## 目标架构

### 服务组件

- `api`
  FastAPI 主服务，承载上传、读取、评论、反应等接口
- `worker`
  负责文档解析、豆包调用、JSON 生成、缩略图或图片处理等异步任务
- `postgres`
  存储导入任务、导入结果、评论、反应、计数、发布版本
- `redis`
  任务队列、短期缓存、限流辅助
- `tos`
  存 Word 原文件、提取图片、评论图片、发布版 JSON

## 内容生产线方案

### 为什么不能只把 Word 直接丢给豆包

如果完全依赖模型自由输出，会出现 3 类问题：

- 图片顺序和原文上下文不稳定
- JSON 字段缺失或格式漂移
- 发布结果不可复盘、不可回滚

所以内容链路必须是：

1. 先用确定性解析器拆 Word
2. 再让豆包做结构化理解
3. 最后用本地 schema 校验和编译

### 第一版任务流

1. 用户上传 `.docx`
2. 后端保存原始文件并创建 `import_job`
3. worker 提取段落、图片、引用顺序
4. 调豆包生成结构化中间结果
5. 本地编译器把中间结果转成前端 JSON
6. validator 校验通过后生成新版本
7. 前端读取最新发布版 JSON

### 推荐产物分层

- `source_bundle`
  原始提取结果，便于排错
- `ai_structured_json`
  豆包返回的结构化中间结果
- `render_json`
  前端正式消费的发布版 JSON

### 前端读取原则

前端只读 `render_json`，不直接依赖豆包原始输出。

## 社区互动线方案

### 核心原则

互动必须按“图文点位”建模，而不是按“整天”建模。

这和当前前端已有的 `pointKey` 逻辑一致，适合延续。

### 第一版能力

- 所有人都能看评论
- 登录用户可以点赞
- 登录用户可以 UP
- 登录用户可以踩
- 登录用户可以发评论
- 评论支持上传图片

### 不在第一版做的能力

- 复杂楼中楼
- 复杂内容推荐
- 复杂排序算法
- 用户主页
- 关注关系

## 数据模型草案

详细表设计请看：

- [backend-database-design.md](./backend-database-design.md)

## API 草案

详细接口设计请看：

- [backend-api-design.md](./backend-api-design.md)

## 鉴权建议

第一版建议：

- 读：匿名可读
- 写：登录后可写

如果一开始完全匿名写，真实计数和风控都很难成立。

## 第一阶段交付范围

### M1 内容生产 MVP

- Word 上传
- 异步解析任务
- 豆包结构化
- JSON 校验
- 发布最新版本
- 前端只读最新 JSON

### M2 社区互动 MVP

- 真实评论
- 真实点赞
- 真实 UP
- 真实踩
- 评论图片上传
- 批量读取计数

## 当前建议

先做内容生产后端化，再做社区互动后端化。

原因是：

1. 内容发布是整站核心能力
2. 前端“只读 JSON”这条边界越早固化越好
3. 评论系统可以在不影响内容链路的情况下后补

## 对接豆包的官方能力参考

- 火山方舟 Responses API
- 结构化输出
- 文件输入 File API

官方文档：

- [常规在线推理](https://www.volcengine.com/docs/82379/2121998?lang=zh)
- [结构化输出(beta)](https://www.volcengine.com/docs/82379/1958523?lang=zh)
- [文件输入(File API)](https://www.volcengine.com/docs/82379/1885708)
- [导入文档](https://www.volcengine.com/docs/82379/1261890?lang=zh)
- [网页解析插件功能说明](https://www.volcengine.com/docs/82379/1284852?lang=zh)
