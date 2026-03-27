# Phase 14

## 目标

拆状态层、路由层与服务层，把运行时职责从 `main.js` 继续剥离出来。

这一阶段重点是运行时结构，而不是页面视觉。

## 范围

- 抽离 `state` 与 `sourceStore`
- 抽离 hash deep link / view switch / section scroll 相关逻辑
- 抽离 `localStorage`、高德路由、文本工具等 service / util
- 保持现有页面输出与交互结果不变

## Step By Step

1. 抽状态对象
   把全局 `state` 与 `sourceStore` 移到独立模块，避免主文件里同时定义和消费。

2. 抽路由同步
   把 `buildHash`、`setHash`、`parseHashAndApply`、view/day/image/tool 同步逻辑放进 router 模块。

3. 抽 service / util
   把 `storage`、`amap`、文本处理、DOM 小工具独立出来，减少横向依赖。

4. 清理主文件职责
   让 `main.js` 只负责组装模块、启动应用和串联初始化流程。

## 交付物

- 独立的 `state` 模块
- 独立的 `router` 模块
- 独立的 `services / utils` 模块
- 更短、更清晰的应用入口

## 验收

- URL 深链能力保持不变。
- 本地存储、Amap 测试入口、滚动跳转都不回退。
- `main.js` 不再承担底层工具与状态定义工作。
