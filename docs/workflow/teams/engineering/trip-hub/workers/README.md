# Trip Hub Workers

这里放的是长期 worker handoff，不是每轮 assignment。

- `worker-a/`
  - 默认偏内容生产线和 JSON 发布线
- `worker-b/`
  - 默认偏社区互动、审核和鉴权线
- `worker-c/`
  - 默认偏移动端 adoption、集成和回归线

原则：

- handoff 定长期边界
- assignment 定本轮范围
- worker 不得把 assignment 误当成唯一真相
