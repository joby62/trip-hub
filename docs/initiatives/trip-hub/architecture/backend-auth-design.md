---
doc_id: trip-hub-backend-auth-design-v1
title: Trip Hub Backend Auth Design v1
doc_type: architecture
initiative: trip-hub
workstream: community
owner: tech-lead
reviewers:
  - backend-community
  - product-owner
status: active
priority: p1
created_at: 2026-03-30
updated_at: 2026-03-30
phase: account-and-moderation
started_at: 2026-03-30
frozen_at:
completed_at:
supersedes:
superseded_by:
related_docs:
  - trip-hub-community-moderation-design-v1
---

# Backend Auth Design

## 目标

这份文档定义后端的登录、鉴权和访问控制边界。

它重点回答 4 个问题：

1. 谁可以匿名访问
2. 谁必须登录后才能操作
3. 登录方式怎么选
4. 前后端用什么会话机制协作

## 设计原则

1. 读尽量放开，写必须可追溯。
2. 优先符合中国移动端用户习惯。
3. 不让前端自己保存高敏感登录凭证。
4. 鉴权和风控分层，先完成最小可信身份，再逐步增强。

## 第一版产品判断

### 读取能力

- 攻略 JSON：匿名可读
- 评论列表：匿名可读
- 点赞 / UP / 踩计数：匿名可读

### 写入能力

以下操作都要求登录：

- 上传 Word
- 发布版本
- 发评论
- 上传评论图片
- 点赞
- UP
- 踩

原因很直接：

- 内容导入和发布需要责任归属
- 社区互动如果长期匿名写，刷量和滥用会非常难控

## 登录方式建议

### Phase 1

优先级建议：

1. 微信登录
2. 手机验证码登录

原因：

- 中国移动端用户最熟悉微信登录
- 但项目不能只依赖微信容器内能力，所以需要手机号兜底

### Phase 2

- 管理员后台账号
- 运营账号

## 推荐身份模型

建议把“用户主实体”和“第三方登录方式”拆开。

### users

表示系统内用户主身份。

### user_identities

表示外部登录方式绑定关系。

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | uuid | 记录 ID |
| `user_id` | uuid | 用户 ID |
| `provider` | text | `wechat / phone / admin` |
| `provider_subject` | text | 外部身份主体 |
| `is_primary` | boolean | 是否主登录方式 |
| `created_at` | timestamptz | 创建时间 |

约束建议：

- `unique(provider, provider_subject)`

## 推荐会话模型

### 第一版建议

使用服务端会话 + HttpOnly Cookie。

不建议第一版就把长期 JWT 暴露给前端自己保管。

原因：

- 当前项目是移动端 H5，服务端会话足够
- HttpOnly Cookie 更适合降低前端误用风险
- 后续如果接微信环境，也更容易统一

### user_sessions

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | uuid | session ID |
| `user_id` | uuid | 用户 ID |
| `session_token_hash` | text | token hash，不存明文 |
| `device_label` | text nullable | 设备标记 |
| `ip_hash` | text nullable | IP 摘要 |
| `user_agent` | text nullable | UA |
| `expires_at` | timestamptz | 过期时间 |
| `created_at` | timestamptz | 创建时间 |
| `revoked_at` | timestamptz nullable | 撤销时间 |

## 角色设计

第一版不搞复杂 RBAC，先用简单角色足够：

- `user`
  普通用户
- `operator`
  内容运营 / 审核人员
- `admin`
  管理员

## 访问控制矩阵

| 能力 | 匿名 | 登录用户 | 运营 / 管理员 |
| --- | --- | --- | --- |
| 读攻略 JSON | yes | yes | yes |
| 读评论 | yes | yes | yes |
| 读计数 | yes | yes | yes |
| 发评论 | no | yes | yes |
| 传评论图片 | no | yes | yes |
| 点赞 / UP / 踩 | no | yes | yes |
| 上传 Word | no | no | yes |
| 发布版本 | no | no | yes |
| 审核评论 | no | no | yes |

## 推荐认证接口

### 1. POST /api/v1/auth/login/wechat

微信登录入口。

### 2. POST /api/v1/auth/login/phone/send-code

发送短信验证码。

### 3. POST /api/v1/auth/login/phone/verify

校验验证码并建立会话。

### 4. GET /api/v1/auth/me

获取当前用户信息和角色。

### 5. POST /api/v1/auth/logout

注销当前会话。

## 推荐响应形态

`GET /api/v1/auth/me`

```json
{
  "authenticated": true,
  "user": {
    "user_id": "5d8bc6fa-c11d-4f8c-8140-62ca1ac4fe34",
    "nickname": "阿圆",
    "avatar_url": "https://...",
    "role": "user"
  }
}
```

## 前端协作方式

### 读接口

- 无需登录态也能读取

### 写接口

- 前端发请求时自动带 Cookie
- 如果未登录，后端返回 `401`
- 前端统一拉起登录弹层

## 安全建议

1. Cookie 必须 `HttpOnly`
2. 生产环境必须 `Secure`
3. Cookie 域和 SameSite 策略要按部署域名收紧
4. session token 只存 hash，不存明文
5. 对写接口加基础频控

## 第一版不做的事

- 多端会话同步管理页
- 第三方账号解绑
- 复杂权限组
- 开放平台 token

## 文档关系

配套阅读：

- [backend-api-design.md](./backend-api-design.md)
- [backend-database-design.md](./backend-database-design.md)
- [community-moderation-design.md](./community-moderation-design.md)
