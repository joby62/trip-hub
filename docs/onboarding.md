# Onboarding

## 目标

这份文档解决两个问题：

1. 新成员第一天应该先看什么
2. 前端、后端、产品分别应该优先进入哪组文档

## 所有人第一天都先看

按这个顺序：

1. `docs/README.md`
   先知道文档系统怎么分层。
2. `docs/current-status.md`
   先知道项目现在到底在做什么，而不是先读历史。
3. `docs/roadmap.md`
   再理解长期任务线和优先级。
4. `docs/architecture.md`
   理解当前工程的真实结构。

## 前端同学第一轮阅读

在上面的基础上继续看：

1. `docs/editorial-trip-blueprint.md`
   理解当前页面目标信息架构。
2. `docs/mobile-first-redesign.md`
   理解移动端优先的交互原则。
3. `docs/regression-checklist.md`
   理解改动后最小回归范围。
4. `docs/amap-app-scheme.md`
   如果会碰地图链路，再看这份。

## 后端同学第一轮阅读

在通用阅读之后继续看：

1. `docs/content-pipeline.md`
   先理解现在的本地内容生产链路。
2. `docs/source-materials.md`
   理解原始 docx 与提取素材结构。
3. `docs/backend-foundation.md`
   理解未来后端的总方向。
4. `docs/adr/adr-001-content-json-and-community-api-split.md`
   理解为什么内容发布和社区互动要拆线。

## 产品 / 设计同学第一轮阅读

1. `docs/current-status.md`
2. `docs/roadmap.md`
3. `docs/editorial-trip-blueprint.md`
4. `docs/backend-foundation.md`

## 新成员在开始写代码前必须确认

1. 自己当前接的是哪条任务线
2. 这条任务线的主方案文档是哪一份
3. 最近一次状态更新写在了哪里
4. 有没有相关 ADR
5. 改完后要同步哪些文档

## 推荐的入手顺序

### 第 1 小时

- 读 `README -> current-status -> roadmap`

### 第 1 个半天

- 读与自己岗位相关的“第一轮阅读”
- 本地把项目跑起来

### 第 1 天结束前

- 明确自己接下来所属的任务线
- 明确该任务线对应的方案文档
- 明确回归范围和文档更新范围
