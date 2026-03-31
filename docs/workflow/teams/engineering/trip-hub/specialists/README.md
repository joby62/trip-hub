# Tech Lead Managed Specialists

这份文档定义的是技术负责人如何像 owner 管理直属下属，以及直属下属如何像 Worker A / B / C 一样回报。

## Scope

当前默认纳入这套协作流的技术直属下属：

- `Frontend Lead`
- `Frontend Engineer`
- `Backend Content`
- `Backend Community`
- `AI Application Engineer`
- `QA / Test Engineer`
- `DevOps / Platform Engineer`

组织关系仍然遵守总组织架构。
但在具体 phase 执行里，`Tech Lead` 可以直接像 owner 一样对这些角色派工和 gate。

## Core Rule

这套模式默认不是：

- 技术负责人随口说一句
- 下属自己理解一下
- 做完再凭记忆口头汇报

而是：

- 技术负责人是直属下属的直接 dispatch owner
- 用户默认仍然是 relay / dispatcher
- 下属只在技术负责人切好的边界内执行
- 派工必须给完整文本，不允许只丢一句方向

## Dispatch Order

每次给直属下属派工，顺序固定：

1. 先让对方进入自己的 startup prompt
2. 再补本轮 assignment
3. 如有 deploy / rollout / review dispatch，再补对应 dispatch
4. 最后给可直接执行的完整文本

不要反过来。
更不要默认对方记得上轮边界。

## Specialist First Reply

直属下属在读完 startup prompt 后，第一条回复不要开始实现，只输出：

1. 对当前项目局面的判断
2. 自己的 owned scope
3. 自己不会擅自改动哪些层
4. 如果本轮触及正式文档，如何区分 `docs/workflow` 和 `docs/initiatives`
5. 当前处于 `waiting for assignment`
6. 当前绝对时间（Asia/Shanghai）

在收到 assignment 前，不允许进入实现。

## Status Rhythm

开工后 30 分钟内，直属下属必须给一次状态：

- `green`
- `yellow`
- `red`

不能只说：

- “我在看”
- “先研究一下”
- “差不多了”

## Final Report Format

直属下属完工后的固定汇报顺序：

1. 改了什么
2. 为什么这么改
3. 验证结果
4. 还剩什么风险或依赖
5. 如果动了正式文档：
   - 放在 `docs/workflow/` 还是 `docs/initiatives/`
   - 目标 `status` 是什么
   - 是否涉及 `supersedes` / `superseded_by`

## Tech Lead Gate

直属下属回报后，技术负责人不能停在“收到”：

1. 审核回报是否仍在 write scope
2. 看代码 / 文档真相
3. 跑 owner 级验证
4. 给出 `green | yellow | red`
5. 如果 phase 关闭，补 `record / review / currentness`

## Principle

固定发送顺序只服务 relay，不等于执行串行。
默认仍然优先采用：

- 第一阶段并行
- freeze owner 先冻结共享真相
- adopter / verifier 在 freeze 前做 preflight，在 freeze 后做收束
