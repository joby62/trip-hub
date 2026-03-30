# Owner Worker Dispatch Guide

这不是理念文档，这是 owner 真正派工时的操作说明。

## 当前默认模式

- `Owner` 是 Worker A / B / C 的直接管理者
- 用户默认是 `relay / dispatcher`
- 用户负责把 owner 准备好的文本转发出去
- worker 不自己发明任务边界

## Owner 每轮必须交付什么

1. 当前 phase 或当前轮次的目标
2. Owner / Worker A / Worker B / Worker C 的排期
3. 第一阶段哪些能并行
4. 哪些必须在 truth freeze 后进入第二阶段
5. handoff 路径
6. assignment 路径
7. 如有需要，deploy-dispatch 路径
8. 三段可直接转发给 A / B / C 的完整文本
9. owner gate 规则

## 固定原则

- 固定发送顺序只服务 relay，不等于执行串行
- 默认应是“阶段化并行”
- handoff 定长期边界
- assignment 定本轮范围
- deploy-dispatch 定部署或收口阶段动作
- initiative 真相必须落到 `docs/initiatives/`

## 每次派工前最少检查

1. 对应 worker 的长期 handoff 是否已给
2. 本轮 assignment 是否明确 scope 和禁区
3. 是否写清当前绝对时间
4. 是否写清依赖和阶段切换
5. 如果会改正式文档，是否写清归属目录和目标状态

## 时间格式

所有 owner 派工都用绝对时间：

- `[YYYY-MM-DD HH:mm Asia/Shanghai]`

不要写：

- 现在
- 今天晚点
- 稍后

## Worker 回报后 owner 必做动作

1. 审核 worker 是否仍在 write scope
2. 看代码和文档真相，不只复述 worker 结论
3. 跑 owner 自己的关键验证
4. 给出 `green | yellow | red`
5. 如果这轮关闭，回写：
   - `record`
   - `review`
   - `NOW`
   - `DOC_INDEX`
   - `TIMELINE`
