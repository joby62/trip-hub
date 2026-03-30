# Team Collaboration And Decision SOP

## Purpose

这份 SOP 解决 3 个问题：

- 多个角色同时改同一层真相
- worker 在没有 freeze 的情况下反向定义产品或架构
- 用户作为 relay 时，被迫自己二次拆任务

## Org Model

当前推荐团队结构是：

- `Founder / CEO`
- `产品负责人 / Product Owner`
- `产品设计师 / Product Designer`
- `技术负责人 / Tech Lead`
- `前端负责人 / Frontend Lead`
- `前端工程师 / Frontend Engineer`
- `后端工程师-内容生产线 / Backend Content`
- `后端工程师-社区互动线 / Backend Community`
- `AI 应用工程师 / AI Application Engineer`
- `QA / Test Engineer`
- `DevOps / Platform Engineer`

在 Codex 多线程执行模式里，技术线默认再抽象成：

- `Owner`
- `Worker A`
- `Worker B`
- `Worker C`

这里：

- `Owner` 默认由 `Tech Lead` 承担
- `Worker A/B/C` 是 owner 直接管理的执行车道
- 用户默认是 `relay / dispatcher`

## Functional Decision Slots

1. `Business Owner`
   - 负责发布优先级和裁剪权
2. `Product Owner`
   - 负责 scope、用户路径、验收
3. `Experience Owner`
   - 负责页面层级、交互、视觉优先级
4. `Architecture Owner`
   - 负责系统边界、状态机、契约、迁移顺序
5. `Delivery Specialists`
   - 负责在冻结边界内实现

当前映射：

- `Business Owner`: Founder / CEO
- `Product Owner`: 产品负责人
- `Experience Owner`: 产品设计师
- `Architecture Owner`: 技术负责人
- `Delivery Specialists`: 前端、后端、AI、QA、DevOps

## Decision Hierarchy

必须按层决策，不按嗓门决策：

1. 业务目标和上线顺序
2. 产品路径与验收口径
3. 交互结构和视觉层级
4. 技术契约与交付顺序
5. 具体实现

规则：

- 下游可以优化自己的层
- 下游不能静默覆盖上游冻结真相
- `Architecture Owner` 可以因风险拒绝实现方式，但必须给出替代方案

## Final Decision Table

| Topic | Final Owner | Must Consult | Workers Must Not Override |
| --- | --- | --- | --- |
| business target, release sequence | `Business Owner` | `Product Owner`, `Tech Lead` | yes |
| user path, scope, acceptance | `Product Owner` | `Product Designer`, `Tech Lead` | yes |
| information hierarchy, interaction pattern | `Product Designer` | `Product Owner`, `Tech Lead` | yes |
| contracts, state machine, migration order | `Tech Lead` | `Product Owner` | yes |
| assigned implementation | assigned specialist / worker | owner | peers outside scope |

## Required Artifacts Before Multi-Person Build

至少要有：

1. live product / experience doc
2. live architecture / rollout doc
3. 明确 owner
4. 明确 write scope
5. 明确 acceptance 或 review path

缺其中任意一项，都不应进入多 worker 并行实现。

## Owner / Worker Execution Mode

默认执行形态：

- owner 定任务、定顺序、定 gate
- 用户负责转发 owner 准备好的 prompt 包
- worker 只在 owner 切好的边界内执行

固定发送顺序：

- 只服务 relay
- 不等于执行串行

默认应该采用：

- 第一阶段并行
- truth owner 先 freeze 共享真相
- adopter / verifier 在 freeze 前做 inventory 和 preflight
- freeze 后进入第二阶段收束

## Worker A / B / C Default Lanes

默认仅作为起始倾向，不是永久绑定：

- `Worker A`
  - 内容生产线
  - `Word -> 解析 -> 豆包 -> JSON`
- `Worker B`
  - 社区互动线
  - 评论、点赞、UP、踩、审核、鉴权
- `Worker C`
  - 移动端 adoption 与回归线
  - 前端接线、API adoption、集成验证

owner 每轮都可以重组这 3 条 lane。

## Change Control

freeze 后任何改动都要回答：

- 谁提的
- 改哪一层
- 为什么改
- 对排期有什么影响
- 谁批准

批准规则：

- 业务目标变化：`Business Owner`
- 用户路径变化：`Product Owner`
- 交互层变化：`Product Designer`
- 契约 / 状态机 / 迁移顺序变化：`Tech Lead`

## Closure Rule

一轮重要任务关闭时，owner 必须补齐：

- `record`
- `review`（如需要）
- `NOW`
- `DOC_INDEX`
- `TIMELINE`

不能只说“做完了”然后靠聊天历史留痕。
