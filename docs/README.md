# Docs

这组文档用于把云南攻略页的整改思路先固定下来，后续开发按 `phase` 推进。

## 文件结构

- `source-materials.md`
  说明当前已经抽取到本地的文档、图片和引用清单。
- `mobile-first-redesign.md`
  说明页面为什么要转成移动端优先，以及目标布局和交互骨架。
- `editorial-trip-blueprint.md`
  当前主蓝图文档。说明如何参考 `stitch 2` 的视觉布局重组页面，同时保留全部功能、原文和图片。
- `phases/phase1.md`
  第一阶段，先改移动端骨架和导航。
- `phases/phase2.md`
  第二阶段，把图片和原文素材真正接进页面。
- `phases/phase3.md`
  第三阶段，补搜索、工具区和收尾体验。
- `phases/phase4.md`
  第四阶段，在保留现有功能的前提下，重做一级信息架构、总览视图和行程视图。
- `phases/phase5.md`
  第五阶段，补齐景点视图、清单视图、素材双归属和全站整合。

## 使用方式

1. 先看 `source-materials.md`，确认素材入口和引用关系。
2. 再看 `mobile-first-redesign.md`，确认移动端基础方向。
3. 然后看 `editorial-trip-blueprint.md`，确认新的信息架构、视觉参考和内容保留规则。
4. 开发时先以 `phases/phase1.md` 到 `phases/phase3.md` 作为已完成基础，再按 `phases/phase4.md` 和 `phases/phase5.md` 推进新的站点重构。
5. 如与新蓝图冲突，以蓝图为准，再回头更新各 phase 文档。
6. 如果中途范围变化，再回到这里同步文档，不直接在代码里临时发散。
