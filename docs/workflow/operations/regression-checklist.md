# Regression Checklist

## 自动检查

每次做结构性改动后，至少跑：

```bash
python scripts/build_yunnan_content_bundle.py
node --experimental-default-type=module --check static/guide/js/main.js
```

如果要跑真服务 smoke 和浏览器交互回归，直接用：

```bash
.venv/bin/python scripts/qa/run_yunnan_checks.py
```

如果改了 Python 脚本，再补：

```bash
python -m py_compile scripts/build_yunnan_blueprint.py scripts/build_yunnan_content_bundle.py scripts/validate_yunnan_blueprint.py
```

## 页面回归

### 总览

- Hero 能正常加载主图、亮点卡和事实卡
- 路线骨架、工具卡、避坑筛选能正常展示
- 切换 phase 后总览内容同步变化

### 行程

- `Day 1 - Day 11` rail 可以切换
- 每天章节能正常展示标题、决策、摘要、图片和按钮
- 打开详情层时日程数据与当前天一致

### 景点

- 景点列表和焦点区能正常联动
- 景点页图片、关联天数、原文来源可用
- 从景点跳详情或跳搜索不报错

### 清单

- 预订卡、时间线、全局注意事项正常显示
- 打包清单分组能展开、折叠、勾选和重置
- 浮动进度按钮状态正确

### 弹层

- 搜索能返回 day / attraction / tool / pitfall 等结果
- 详情层 tab 切换正常
- 灯箱能切图、关掉、回跳来源

### 深链与本地存储

- hash 深链能恢复当前视图和弹层状态
- packing 勾选状态刷新后仍保留
- packing group 展开状态刷新后仍保留

## 服务级 smoke check

- `/` 会跳到 `/guides/yunnan`
- `/guides/yunnan` 返回页面
- `/static/guide/css/main.css`、`/static/guide/js/main.js`、`/static/guide/data/yunnan.blueprint.json` 可访问
- `/healthz` 返回 `ok`

脚本说明见：

- `scripts/qa/README.md`
