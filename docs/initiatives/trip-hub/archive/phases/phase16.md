# Phase 16

## 目标

统一内容数据源和素材生成链路，消灭“前端硬编码摘要 + blueprint 数据”双轨并存的维护方式。

这一阶段重点是内容架构，不是页面排版。

## 范围

- 把前端摘要数据回收到 blueprint 生成链路
- 统一 day / attraction / theme / notes / booking / packing 等内容来源
- 整理 `scripts/` 为更清晰的内容流水线入口
- 保证前端最终只消费一个主数据源

## Step By Step

1. 清点重复数据
   明确 `dayData`、`dayEnhancements`、`bookingTimeline`、`globalNotes` 等哪些仍然是前端硬编码。

2. 设计统一 blueprint 扩展字段
   把页面真正依赖的摘要字段和工具字段纳入内容产物，而不是散落在前端常量中。

3. 整理脚本入口
   给素材提取、day-map 构建、blueprint 构建、校验增加统一执行入口。

4. 切前端到单一数据源
   让前端运行时优先只读 blueprint，不再同时维护同一业务事实的两套表达。

## 交付物

- 单一主数据源的前端消费方式
- 更清晰的内容构建脚本链路
- 更少的前端硬编码业务内容

## 验收

- 同一份业务内容不再需要前端和脚本各改一次。
- Blueprint 能独立支撑页面主要展示与交互。
- 内容改动路径更短、更可预期。

## 本轮落地

- 把原来堆在 `static/guide/js/config.js` 里的行程摘要、预订、清单、避坑等内容迁到 `scripts/yunnan_editorial_source.mjs`，前端 `config.js` 只保留 UI / runtime 常量。
- `scripts/build_yunnan_blueprint.py` 现在会把 editorial 内容并入 blueprint：`trip.editorial` 挂载总览 / 预订 / 清单 / 避坑等配置，`days[*]` 挂载 `city / phase / summary / route / food / tips / decision` 等页面字段。
- 新增 `scripts/build_yunnan_content_bundle.py`，串起 `day-map -> blueprint -> validate`。
- 前端运行时改为以 blueprint 作为主数据源：
  - `selectors.js` 改为基于 `sourceStore` 读取 day / trip / pitfall / packing 数据
  - `overview / checklist / search` 等模块改为读取 `trip.editorial`
  - `main.js` 在首屏渲染前先加载 blueprint，不再依赖旧的前端硬编码摘要常量
