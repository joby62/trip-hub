# Templates

## 目标

这组模板用于统一团队后续的文档写法，减少“每个人各写一套”的情况。

当前提供：

- `task-track-template.md`
  用于新开一条任务线或专项执行文档
- `adr-template.md`
  用于记录高影响技术决策

## 使用规则

1. 新开任务线前，优先复制 `task-track-template.md`
2. 高影响架构判断，优先复制 `adr-template.md`
3. 模板复制出来后，落到对应目录，不直接在 `templates/` 里改

## 推荐落点

- 任务线文档：
  放在 `docs/` 当前方案层
- ADR：
  放在 `docs/adr/`
