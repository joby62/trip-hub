# Phase 15

## 目标

按视图拆渲染层，把总览、行程、景点、清单和弹层从单一渲染文件里分离出来。

这一阶段重点是页面职责边界，方便后续改动时按视图定位。

## 范围

- 拆 `overview / itinerary / attractions / checklist` 四大视图
- 拆 `search / detail / lightbox` 三类弹层
- 建立共享 selector / render helper
- 保持现有 UI 结果基本一致

## Step By Step

1. 拆四大主视图
   把每个 screen-level 视图的 render 函数收拢到独立模块中。

2. 拆弹层
   把搜索层、详情层、灯箱层的渲染和交互从主视图逻辑中拿出来。

3. 建共享 selector
   把“按 phase 过滤、按景点聚合、按图片回查段落”这类读数据逻辑统一出来。

4. 稳定事件边界
   让事件绑定尽量面向模块，而不是继续在一个文件里维护超长 click 分发。

## 交付物

- 视图模块化的渲染层
- 独立的 overlay 模块
- 共享 selector / helper
- 更清晰的事件边界

## 验收

- 改某个视图时不需要先读完整个前端脚本。
- 搜索、详情、灯箱与主视图解耦。
- 页面交互结果与现状一致，不出现明显回归。

## 本轮落地

- 新增 `static/guide/js/selectors.js`，集中 day / attraction / source / pitfall 的读数据逻辑。
- 新增 `static/guide/js/render-helpers.js`，收拢列表、meta pills、搜索高亮等共享渲染 helper。
- 新增四个视图模块：
  - `static/guide/js/views/overview.js`
  - `static/guide/js/views/attractions.js`
  - `static/guide/js/views/itinerary.js`
  - `static/guide/js/views/checklist.js`
- 新增三个 overlay 模块：
  - `static/guide/js/overlays/search.js`
  - `static/guide/js/overlays/detail.js`
  - `static/guide/js/overlays/lightbox.js`
- `static/guide/js/main.js` 现在主要负责装配、状态流、路由同步和事件绑定，不再承载大块视图渲染实现。
