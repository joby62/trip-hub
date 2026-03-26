# Trip Hub

这个仓库现在是一个纯旅行站项目，只保留云南路线攻略的运行骨架、静态页面和素材处理脚本。

## 当前路由

- `/`：302 跳转到 `/guides/yunnan`
- `/guides/yunnan`：云南路线主页面
- `/static/...`：页面样式、脚本与图片素材
- `/healthz`：基础健康检查

## 页面内容

主页面基于 `云南十天（昆明大理泸沽湖丽江香格里拉）` 的 docx 内容重构，当前已经包括：

- 移动端优先的 11 天路线长卷
- 分阶段筛选、全屏搜索和避坑标签
- 每天详情层、图片灯箱和原文引用
- 关键预订工具卡与订票时间线
- 本地持久化打包清单

## 关键文件

```text
app.py
static/
  index.html
  guide/
    yunnan.html
    yunnan.css
    yunnan.js
    source/
scripts/
docs/
deploy/
```

## 本地运行

```bash
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 5000 --reload
```

打开：

- `http://127.0.0.1:5000/guides/yunnan`
- `http://127.0.0.1:5000/healthz`

## Docker

开发环境：

```bash
docker compose -f docker-compose.dev.yml up --build
```

生产环境：

```bash
cp .env.example .env
docker compose -f docker-compose.prod.yml up -d --build
```

生产默认通过 Caddy 提供 HTTPS 反向代理，域名由 `.env` 里的 `APP_DOMAIN` 控制。
