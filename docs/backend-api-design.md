# Backend API Design

## 目标

这份文档把 [backend-foundation.md](./backend-foundation.md) 和 [backend-database-design.md](./backend-database-design.md) 继续下钻到接口层。

目标是先固定：

1. 前端读什么
2. 后端写什么
3. 哪些接口属于内容生产
4. 哪些接口属于社区互动

## 设计原则

1. 版本统一走 `/api/v1`
2. 内容读取和互动写入分组设计
3. 所有列表接口默认支持分页
4. 所有写接口都返回可直接刷新当前 UI 的结果
5. 文件上传和业务写入分两步，不混成一个大请求

## 接口分组

### A. 内容生产

- Word 上传
- 导入任务状态
- 版本发布
- 前端 JSON 读取

### B. 社区互动

- 点位批量快照
- 评论列表
- 评论提交
- 反应写入
- 评论图片上传

### C. 鉴权

- 微信登录
- 手机验证码登录
- 当前用户信息
- 注销

## 一、内容生产接口

### 1. POST /api/v1/imports

上传 Word，创建一次导入任务。

请求：

- `multipart/form-data`
- 字段：
  - `file`
  - `guide_slug`

响应示例：

```json
{
  "job_id": "6e5e69fb-7f5d-4f6e-a9f1-16a0f7b6cb59",
  "guide_slug": "yunnan",
  "status": "uploaded",
  "current_step": "uploaded"
}
```

### 2. GET /api/v1/imports/{job_id}

查看导入任务状态。

响应示例：

```json
{
  "job_id": "6e5e69fb-7f5d-4f6e-a9f1-16a0f7b6cb59",
  "guide_slug": "yunnan",
  "status": "structuring",
  "current_step": "doubao_structuring",
  "error_code": null,
  "error_message": null,
  "artifacts": {
    "original_docx": true,
    "source_bundle": true,
    "ai_structured_json": false,
    "render_json": false
  }
}
```

### 3. GET /api/v1/imports/{job_id}/artifacts

给运营或后台使用，用于查看任务产物地址和版本。

### 4. POST /api/v1/guides/{slug}/versions/{version_id}/publish

把一个已校验通过的版本发布为当前线上版本。

请求示例：

```json
{
  "note": "publish after validation"
}
```

响应示例：

```json
{
  "guide_slug": "yunnan",
  "version_id": "3f4f9c85-2f16-4d3f-9ad7-4e3eb5ce3b8e",
  "status": "published",
  "published_at": "2026-03-29T11:40:00+08:00"
}
```

### 5. GET /api/v1/guides/{slug}/latest

前端核心读取接口，直接返回当前最新发布版 JSON。

这是前端后续的主读取入口。

响应：

- 直接返回 render JSON
- 也可以包一层元信息：

```json
{
  "guide_slug": "yunnan",
  "version_id": "3f4f9c85-2f16-4d3f-9ad7-4e3eb5ce3b8e",
  "version_no": 12,
  "published_at": "2026-03-29T11:40:00+08:00",
  "render_json": {}
}
```

## 二、社区互动接口

### 1. GET /api/v1/story-points/batch

批量读取多个点位的互动快照。

请求示例：

```text
/api/v1/story-points/batch?keys=day1::1,day1::2,day3::14
```

响应示例：

```json
{
  "items": [
    {
      "point_key": "day3::14",
      "counts": {
        "likes": 18,
        "ups": 7,
        "downs": 1,
        "comments": 5
      },
      "viewer": {
        "liked": true,
        "vote_state": "up"
      }
    }
  ]
}
```

说明：

- 这个接口优先给列表页、瀑布流和详情页首屏用
- 不要让前端一个点一个点去单独请求

### 2. GET /api/v1/story-points/{point_key}/comments

读取一个点位下的评论列表。

请求参数：

- `cursor`
- `limit`

响应示例：

```json
{
  "items": [
    {
      "comment_id": "728b0fe0-1132-438b-97b8-3a9235678cbb",
      "author": {
        "user_id": "2cb18a35-2f9c-4fdf-a4fc-3fd11e56f1a9",
        "nickname": "阿圆",
        "avatar_url": "https://..."
      },
      "body": "这段真的比预期更出片。",
      "images": [
        {
          "image_id": "4b9b1b78-00a8-4989-9503-6c4af567f1b0",
          "url": "https://..."
        }
      ],
      "status": "visible",
      "created_at": "2026-03-29T12:00:00+08:00"
    }
  ],
  "next_cursor": "..."
}
```

### 3. POST /api/v1/story-points/{point_key}/comments

提交评论。

请求示例：

```json
{
  "body": "这段真的比预期更出片。",
  "image_ids": [
    "4b9b1b78-00a8-4989-9503-6c4af567f1b0"
  ]
}
```

响应建议：

- 返回评论对象
- 同时返回最新计数，方便前端立即刷新

```json
{
  "comment": {
    "comment_id": "728b0fe0-1132-438b-97b8-3a9235678cbb",
    "body": "这段真的比预期更出片。",
    "images": [],
    "created_at": "2026-03-29T12:00:00+08:00"
  },
  "counts": {
    "likes": 18,
    "ups": 7,
    "downs": 1,
    "comments": 6
  }
}
```

### 4. POST /api/v1/story-points/{point_key}/reactions

写入点赞 / UP / 踩。

请求示例：

```json
{
  "action": "like",
  "value": true
}
```

或：

```json
{
  "action": "vote",
  "value": "up"
}
```

约束：

- `like` 独立
- `vote` 只允许 `none / up / down`

响应示例：

```json
{
  "point_key": "day3::14",
  "viewer": {
    "liked": true,
    "vote_state": "up"
  },
  "counts": {
    "likes": 18,
    "ups": 7,
    "downs": 1,
    "comments": 6
  }
}
```

### 5. POST /api/v1/uploads/comment-images

上传评论图片。

建议和评论提交分开。

请求：

- `multipart/form-data`
- 字段：
  - `file`

响应示例：

```json
{
  "image_id": "4b9b1b78-00a8-4989-9503-6c4af567f1b0",
  "url": "https://...",
  "width": 1080,
  "height": 1440
}
```

## 三、鉴权接口

### 1. POST /api/v1/auth/login/wechat

微信登录入口。

### 2. POST /api/v1/auth/login/phone/send-code

发送短信验证码。

### 3. POST /api/v1/auth/login/phone/verify

校验验证码并建立会话。

### 4. GET /api/v1/auth/me

获取当前登录用户信息。

### 5. POST /api/v1/auth/logout

注销当前会话。

## 四、认证建议

### 读接口

- 可匿名访问

### 写接口

- 需要登录

涉及：

- `POST /comments`
- `POST /reactions`
- `POST /uploads/comment-images`
- `POST /imports`
- `POST /publish`

## 五、错误码建议

建议统一返回：

```json
{
  "error": {
    "code": "POINT_NOT_FOUND",
    "message": "story point not found"
  }
}
```

推荐首批错误码：

- `UNAUTHORIZED`
- `FORBIDDEN`
- `VALIDATION_ERROR`
- `POINT_NOT_FOUND`
- `IMPORT_JOB_NOT_FOUND`
- `VERSION_NOT_FOUND`
- `UPLOAD_TOO_LARGE`
- `UNSUPPORTED_FILE_TYPE`
- `RATE_LIMITED`

## 六、前端接入建议

### 列表页 / 瀑布流

- 先读攻略 JSON
- 再批量请求 `story-points/batch`

### 详情页

- 进入时先批量拿当前点位快照
- 评论区展开后再请求评论列表

### 评论提交流程

1. 先上传图片
2. 拿到 `image_id`
3. 再提交评论正文和 `image_ids`

## 七、第一版不做的接口

先明确不做，避免扩散：

- 评论回复接口
- 用户关注接口
- 举报接口
- 推荐流接口
- 评论点赞接口

## 八、文档关系

这份文档配套阅读：

- [backend-foundation.md](./backend-foundation.md)
- [backend-database-design.md](./backend-database-design.md)
- [backend-auth-design.md](./backend-auth-design.md)
- [community-moderation-design.md](./community-moderation-design.md)
- [backend-state-machine.md](./backend-state-machine.md)
