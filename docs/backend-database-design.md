# Backend Database Design

## 目标

这份文档把 [backend-foundation.md](./backend-foundation.md) 里的后端总方案继续下钻到数据库层。

重点解决两类问题：

1. `Word -> 豆包 -> JSON` 的内容生产数据怎么落库
2. 评论、点赞、UP、踩这些真实互动怎么建模

## 设计原则

1. 内容发布和社区互动分库表思维，不混成一坨。
2. 前端消费的内容以“已发布 JSON 版本”为准，不直接读导入中间态。
3. 社区互动按“图文点位”建模，不按“整天”建模。
4. 计数有独立聚合表，不在读接口里实时全量 `count(*)`。
5. 所有高价值写操作都保留审计字段。

## 数据库选型

- 主库：PostgreSQL
- 缓存 / 队列辅助：Redis

社区互动、导入任务、发布版本都建议先统一在一个 PostgreSQL 实例里，后续再按压力拆分。

## 命名约定

- 主键默认 `uuid`
- 时间字段统一：
  - `created_at`
  - `updated_at`
- 状态字段尽量用枚举值或受控字符串，不用随意文本
- JSON 扩展字段统一以 `jsonb` 保存

## 一、内容生产线表设计

### 1. guide_import_jobs

表示一次 Word 导入任务。

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | uuid | 任务 ID |
| `guide_slug` | text | 目标攻略标识，例如 `yunnan` |
| `status` | text | `uploaded / parsing / structuring / validating / ready / failed / published` |
| `current_step` | text | 当前步骤，便于前端展示 |
| `created_by_user_id` | uuid nullable | 谁发起的导入 |
| `source_filename` | text | 原文件名 |
| `error_code` | text nullable | 失败码 |
| `error_message` | text nullable | 失败原因 |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |
| `started_at` | timestamptz nullable | 开始处理时间 |
| `finished_at` | timestamptz nullable | 完成时间 |

索引建议：

- `idx_guide_import_jobs_slug_created_at`
- `idx_guide_import_jobs_status`

### 2. guide_import_files

表示导入任务相关的文件对象，不管是原始 Word、提取包、结构化 JSON，还是最终 render JSON，都统一挂在这里。

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | uuid | 文件记录 ID |
| `job_id` | uuid | 对应导入任务 |
| `file_role` | text | `original_docx / extracted_bundle / ai_structured_json / render_json / comment_image` 这类角色 |
| `storage_provider` | text | 例如 `tos` |
| `storage_key` | text | 对象存储 key |
| `mime_type` | text | 文件类型 |
| `size_bytes` | bigint | 文件大小 |
| `checksum` | text nullable | 校验值 |
| `metadata_json` | jsonb | 扩展信息 |
| `created_at` | timestamptz | 创建时间 |

索引建议：

- `idx_guide_import_files_job_id`
- `idx_guide_import_files_role`

### 3. guide_source_bundles

保存解析器提取出的确定性中间结果。

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | uuid | bundle ID |
| `job_id` | uuid | 对应任务 |
| `extractor_version` | text | 解析器版本 |
| `paragraph_count` | integer | 段落数 |
| `image_count` | integer | 图片数 |
| `bundle_json` | jsonb | 提取结果 |
| `created_at` | timestamptz | 创建时间 |

### 4. guide_render_versions

这是内容线最核心的表，表示前端真正可读的攻略版本。

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | uuid | render version ID |
| `guide_slug` | text | 攻略标识 |
| `version_no` | integer | 版本号，单攻略内递增 |
| `status` | text | `draft / validated / published / archived` |
| `source_job_id` | uuid | 来源导入任务 |
| `source_bundle_id` | uuid nullable | 来源提取包 |
| `schema_version` | text | 前端 JSON schema 版本 |
| `render_json` | jsonb | 前端最终消费 JSON |
| `checksum` | text nullable | 结果校验值 |
| `created_by_user_id` | uuid nullable | 创建人 |
| `created_at` | timestamptz | 创建时间 |
| `published_at` | timestamptz nullable | 发布时间 |

约束建议：

- `unique(guide_slug, version_no)`

索引建议：

- `idx_guide_render_versions_slug_status`
- `idx_guide_render_versions_slug_created_at`

### 5. guide_publish_records

记录发布、回滚和撤销动作。

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | uuid | 记录 ID |
| `guide_slug` | text | 攻略标识 |
| `version_id` | uuid | 对应 render version |
| `action` | text | `publish / rollback / archive` |
| `operator_user_id` | uuid nullable | 操作人 |
| `note` | text nullable | 备注 |
| `created_at` | timestamptz | 操作时间 |

## 二、社区互动线表设计

### 1. users

第一版只要满足最小身份体系即可。

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | uuid | 用户 ID |
| `auth_provider` | text | `wechat / phone / admin` |
| `provider_subject` | text | 第三方主体 ID |
| `nickname` | text | 昵称 |
| `avatar_url` | text nullable | 头像 |
| `status` | text | `active / banned / deleted` |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

约束建议：

- `unique(auth_provider, provider_subject)`

### 2. story_points

表示一个可互动的图文点位。

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | uuid | 点位 ID |
| `point_key` | text | 全局唯一点位标识，例如 `day3::14` |
| `guide_slug` | text | 所属攻略 |
| `guide_version_id` | uuid nullable | 来源攻略版本 |
| `day_id` | text | 所属 day |
| `image_sequence` | integer | 图序号 |
| `title` | text nullable | 点位标题 |
| `cover_image_url` | text nullable | 预览图 |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

约束建议：

- `unique(point_key)`

索引建议：

- `idx_story_points_slug_day_id`

### 3. story_point_reactions

一行表示“一个用户对一个点位的当前反应状态”。

这里不建议把点赞 / UP / 踩拆成三张表。第一版直接单表最稳。

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | uuid | 记录 ID |
| `story_point_id` | uuid | 点位 ID |
| `user_id` | uuid | 用户 ID |
| `liked` | boolean | 是否点赞 |
| `vote_state` | text | `none / up / down` |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

约束建议：

- `unique(story_point_id, user_id)`

说明：

- `liked` 独立存在
- `vote_state` 只允许 `none / up / down`
- `up` 和 `down` 互斥

### 4. story_point_counters

这是读接口的核心聚合表。

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `story_point_id` | uuid | 点位 ID |
| `likes_count` | integer | 点赞数 |
| `ups_count` | integer | UP 数 |
| `downs_count` | integer | 踩数 |
| `comments_count` | integer | 评论数 |
| `updated_at` | timestamptz | 更新时间 |

说明：

- 这个表建议由写接口同步更新
- 不建议每次读评论都现场实时重算

### 5. story_point_comments

评论主体表。

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | uuid | 评论 ID |
| `story_point_id` | uuid | 点位 ID |
| `user_id` | uuid | 用户 ID |
| `body` | text | 评论正文 |
| `status` | text | `visible / hidden / deleted / pending_review` |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |
| `deleted_at` | timestamptz nullable | 删除时间 |

索引建议：

- `idx_story_point_comments_point_created_at`
- `idx_story_point_comments_status`

### 6. story_point_comment_images

评论图片表。

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | uuid | 图片记录 ID |
| `comment_id` | uuid | 所属评论 |
| `storage_provider` | text | 存储服务 |
| `storage_key` | text | 对象 key |
| `image_url` | text | 访问地址 |
| `sort_order` | integer | 排序 |
| `width` | integer nullable | 宽 |
| `height` | integer nullable | 高 |
| `created_at` | timestamptz | 创建时间 |

## 三、推荐的表关系

```text
guide_import_jobs
  ├─ guide_import_files
  ├─ guide_source_bundles
  └─ guide_render_versions
        └─ guide_publish_records

users
  ├─ story_point_reactions
  └─ story_point_comments

story_points
  ├─ story_point_reactions
  ├─ story_point_counters
  └─ story_point_comments
        └─ story_point_comment_images
```

## 四、第一版不建的表

先明确不做，避免过度设计：

- 评论回复表
- 关注关系表
- 用户收藏清单表
- 内容推荐打分表
- 审核工作流全量引擎表

如果后续真要做楼中楼，再在 `story_point_comments` 基础上补 `parent_comment_id`。

## 五、推荐实现顺序

### Step 1

- `users`
- `story_points`
- `story_point_reactions`
- `story_point_counters`
- `story_point_comments`

先把真实评论和真实计数跑通。

### Step 2

- `story_point_comment_images`
- `guide_import_jobs`
- `guide_import_files`

### Step 3

- `guide_source_bundles`
- `guide_render_versions`
- `guide_publish_records`

## 六、和现有前端的映射

当前前端已经有 `pointKey` 概念，这很好，后端直接对齐：

- 前端 `pointKey`
  对应后端 `story_points.point_key`
- 前端评论列表
  对应 `story_point_comments`
- 前端点赞 / UP / 踩
  对应 `story_point_reactions`
- 前端计数展示
  对应 `story_point_counters`

## 七、后续要补的文档

在这份数据库文档基础上，下一步还要继续细化：

- `backend-api-design.md`
- 登录 / 鉴权设计文档
- 评论审核与风控文档
