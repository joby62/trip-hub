# NOW

这是 repo 级 currentness surface。

## Rule

- 这里只列当前 live working set
- 只收录 `active`、`frozen`、`in_execution`、`blocked`
- 排序按 priority，不按修改时间
- 不靠猜测补历史

## Bootstrap State

- surface 启用于 `2026-03-30`
- 历史 backfill 暂不强求
- 先让当前 live docs 可见，再逐步扩大治理范围

## Current Working Set

| Initiative | Title | Workstream | Owner | Status | Priority | Last Meaningful Update | Path |
| --- | --- | --- | --- | --- | --- | --- | --- |
| trip-hub | Trip Hub Editorial Trip Blueprint v1 | product | product-owner | active | p0 | 2026-03-28 | `/Users/lijiabo/AutoBioInterview/docs/initiatives/trip-hub/product/editorial-trip-blueprint.md` |
| trip-hub | Trip Hub Mobile First Redesign v1 | experience | product-designer | active | p0 | 2026-03-28 | `/Users/lijiabo/AutoBioInterview/docs/initiatives/trip-hub/product/mobile-first-redesign.md` |
| trip-hub | Trip Hub Runtime Architecture v1 | architecture | tech-lead | frozen | p0 | 2026-03-28 | `/Users/lijiabo/AutoBioInterview/docs/initiatives/trip-hub/architecture/architecture.md` |
| trip-hub | Trip Hub Content Pipeline v1 | content | tech-lead | frozen | p0 | 2026-03-28 | `/Users/lijiabo/AutoBioInterview/docs/initiatives/trip-hub/architecture/content-pipeline.md` |
| trip-hub | Trip Hub Backend Foundation v1 | architecture | tech-lead | active | p0 | 2026-03-30 | `/Users/lijiabo/AutoBioInterview/docs/initiatives/trip-hub/architecture/backend-foundation.md` |
| trip-hub | Trip Hub Backend State Machine v1 | architecture | tech-lead | active | p0 | 2026-03-30 | `/Users/lijiabo/AutoBioInterview/docs/initiatives/trip-hub/architecture/backend-state-machine.md` |
| trip-hub | Trip Hub Backend Auth Design v1 | community | tech-lead | active | p1 | 2026-03-30 | `/Users/lijiabo/AutoBioInterview/docs/initiatives/trip-hub/architecture/backend-auth-design.md` |
| trip-hub | Trip Hub Community Moderation Design v1 | community | tech-lead | active | p1 | 2026-03-30 | `/Users/lijiabo/AutoBioInterview/docs/initiatives/trip-hub/architecture/community-moderation-design.md` |

## Current Track Summary

- `T1 移动端产品收口`
  - 细节页、景点内容流、地图链路继续收口
- `T2 内容生产后端化`
  - `Word -> 豆包 -> JSON -> 发布`
- `T3 社区互动后端化`
  - 评论、点赞、UP、踩、真实计数
- `T4 账号与风控`
  - 登录、审核、限流、可追溯
- `T5 发布与运维`
  - DB、Redis、对象存储、worker、部署形态

## Risks

1. 当前后端仍然主要是静态壳，真实服务能力还没落地
2. 部署、监控、worker 落地层仍然偏文档状态
3. 移动端页面还在快速变化，必须靠 currentness 面压住协作发散
