# Docs

这组文档用于说明项目当前有效结构，以及云南攻略页的历史重构过程。

## 当前优先入口

- `architecture.md`
  当前运行时结构、模块职责和日常维护入口。
- `content-pipeline.md`
  当前内容流水线、产物和改动归属。
- `source-materials.md`
  原始 docx 素材包、提取结果和注意事项。
- `regression-checklist.md`
  每轮结构改动后的自动检查与页面回归清单。
- `editorial-trip-blueprint.md`
  当前页面信息架构和视觉方向蓝图。
- `amap-app-scheme.md`
  高德 App Scheme 内部参考，记录路径规划、途径点和分段导航的项目约定。

## 文件结构

- `architecture.md`
  当前工程结构、模块分层和维护原则。
- `content-pipeline.md`
  当前 docx 到 blueprint 的内容链路。
- `source-materials.md`
  说明当前已经抽取到本地的文档、图片和引用清单。
- `regression-checklist.md`
  当前推荐的回归检查清单。
- `mobile-first-redesign.md`
  说明页面为什么要转成移动端优先，以及目标布局和交互骨架。
- `editorial-trip-blueprint.md`
  当前主蓝图文档。说明如何参考 `stitch 2` 的视觉布局重组页面，同时保留全部功能、原文和图片。
- `amap-app-scheme.md`
  高德 App Scheme 的项目内调用参考，统一记录 Android / iOS 路径规划参数、平台差异和推荐封装。
- `phases/phase1.md`
  第一阶段，先改移动端骨架和导航。
- `phases/phase2.md`
  第二阶段，把图片和原文素材真正接进页面。
- `phases/phase3.md`
  第三阶段，补搜索、工具区和收尾体验。
- `phases/phase4.md`
  第四阶段，先把单页长卷改成 `总览 / 行程 / 景点 / 清单` 四个一级视图的站点壳。
- `phases/phase5.md`
  第五阶段，重做数据与素材组织，建立统一数据层和图文双归属映射。
- `phases/phase6.md`
  第六阶段，重做总览页和行程页，进入 stitch 2 的 editorial 方向。
- `phases/phase7.md`
  第七阶段，补齐景点页和清单页，让用户既能按天看，也能按景点和工具看。
- `phases/phase8.md`
  第八阶段，做全站整合、搜索/深链升级、桌面增强和最终精修。
- `phases/phase9.md`
  第九阶段，回到移动端基础壳，修正重复导航、固定头部和底部 Dock 对正文的压制。
- `phases/phase10.md`
  第十阶段，重做移动端 Hero、卡片流和图片比例，让页面真正适合手机阅读。
- `phases/phase11.md`
  第十一阶段，重做移动端搜索、详情、灯箱、筛选和清单交互。
- `phases/phase12.md`
  第十二阶段，做移动端最终整合、真机断点验收和上线收口。
- `phases/phase13.md`
  第十三阶段，拆前端入口与配置层，建立模块化骨架。
- `phases/phase14.md`
  第十四阶段，拆状态层、路由层与服务层。
- `phases/phase15.md`
  第十五阶段，拆四大主视图与三类弹层。
- `phases/phase16.md`
  第十六阶段，统一内容数据源与素材生成链路。
- `phases/phase17.md`
  第十七阶段，收 CSS、文档与回归验证。

## 使用方式

1. 先看 `architecture.md` 和 `content-pipeline.md`，确认当前真实结构和内容入口。
2. 再看 `source-materials.md`，确认素材来源与提取结果。
3. 如果要改高德唤起逻辑，先看 `amap-app-scheme.md`，不要重新翻官方文档。
4. 然后看 `editorial-trip-blueprint.md`，确认信息架构、视觉参考和内容保留规则。
5. 开发前后用 `regression-checklist.md` 做最小回归。
6. `phases/` 目录主要作为历史决策记录和分阶段落盘，不是日常开发的第一入口。
7. 如与新蓝图冲突，以蓝图和当前架构文档为准，再回头更新 phase 文档。
8. 如果中途范围变化，再回到这里同步文档，不直接在代码里临时发散。
