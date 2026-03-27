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

## 内容链路

当前站点已经切到 `blueprint` 单一数据源，内容维护路径是：

1. `scripts/extract_docx_bundle.py`
   从 docx 提取 `document.md / document.txt / manifest.json / images/`。
2. `scripts/build_yunnan_day_map.py`
   把原文切成 `Day 1 - Day 11` 的日程映射。
3. `scripts/yunnan_editorial_source.mjs`
   维护总览、预订、清单、避坑和每日摘要等 editorial 内容。
4. `scripts/build_yunnan_blueprint.py`
   把 day map、图片归属和 editorial 内容统一生成到 `static/guide/data/yunnan.blueprint.json`。
5. `static/guide/js/`
   前端运行时只消费 blueprint，不再同时维护一套硬编码摘要数据。

如果只想重建内容产物，可以直接运行：

```bash
python scripts/build_yunnan_content_bundle.py
```

## QA 脚本

真服务 smoke test 和浏览器交互回归已经落到：

```text
scripts/qa/run_yunnan_checks.py
scripts/qa/README.md
```

推荐命令：

```bash
python -m venv .venv
.venv/bin/python -m pip install -r requirements-dev.txt
.venv/bin/python scripts/qa/run_yunnan_checks.py
```

## 当前文档入口

- `docs/architecture.md`
  看当前运行时结构和模块职责。
- `docs/content-pipeline.md`
  看内容改动应该落在哪个脚本和产物。
- `docs/regression-checklist.md`
  看结构改动后的回归清单。

## 关键文件

```text
app.py
static/
  index.html
  guide/
    yunnan.html
    data/
    css/
    js/
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
