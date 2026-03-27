# QA Scripts

这一组脚本用于跑云南站点的真服务 smoke test 和浏览器交互回归。

## 文件

- `run_yunnan_checks.py`
  单入口脚本。默认会：
  1. 启动本地 `uvicorn`
  2. 跑 HTTP smoke check
  3. 跑 Playwright + Chrome 浏览器交互回归
  4. 自动关闭本地服务

## 依赖

推荐先准备本地虚拟环境：

```bash
python -m venv .venv
.venv/bin/python -m pip install -r requirements-dev.txt
```

如果机器里没有默认可探测到的 Chrome / Chromium，可显式传：

```bash
--browser-path /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome
```

也可以设置环境变量：

```bash
export TRIP_HUB_BROWSER_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

## 常用命令

跑完整回归：

```bash
.venv/bin/python scripts/qa/run_yunnan_checks.py
```

只跑 HTTP smoke：

```bash
.venv/bin/python scripts/qa/run_yunnan_checks.py --service-only
```

只跑浏览器交互：

```bash
.venv/bin/python scripts/qa/run_yunnan_checks.py --browser-only --base-url http://127.0.0.1:8001
```

显式指定浏览器路径：

```bash
.venv/bin/python scripts/qa/run_yunnan_checks.py --browser-path "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

## 行为说明

- 默认本地服务地址：`http://127.0.0.1:8001`
- 默认会验证：
  - `/` 的 `302 -> /guides/yunnan`
  - `/guides/yunnan`
  - `/static/guide/css/main.css`
  - `/static/guide/js/main.js`
  - `/static/guide/data/yunnan.blueprint.json`
  - `/healthz`
- 浏览器回归会覆盖：
  - 默认视图装载
  - `overview` / `itinerary` / `attractions` / `checklist`
  - phase 切换
  - 详情层
  - 灯箱
  - 搜索
  - packing 本地持久化

## 失败产物

浏览器回归失败时，会在：

```text
/tmp/trip-hub-qa/yunnan-browser-failure.png
```

落一张全页截图，方便快速回看现场。
