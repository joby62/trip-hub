# Content Pipeline

## 输入与产物

- 原始输入：云南路线 docx
- 素材包目录：`static/guide/source/yunnan_trip_v4`
- 最终产物：`static/guide/data/yunnan.blueprint.json`

## 流水线

1. `scripts/extract_docx_bundle.py`
   从 docx 提取 `document.md / document.txt / manifest.json / images/`。
2. `scripts/build_yunnan_day_map.py`
   按 `Day 1 - Day 11` 生成 `day-map.json`。
3. `scripts/yunnan_editorial_source.mjs`
   维护总览、预订、清单、避坑和单日摘要这类 editorial 内容。
4. `scripts/build_yunnan_blueprint.py`
   合并 `day-map + manifest + editorial source`，并输出 blueprint。
5. `scripts/validate_yunnan_blueprint.py`
   校验天数、图片、段落和孤儿素材。
6. `scripts/build_yunnan_content_bundle.py`
   串起 `day-map -> blueprint -> validate`。

## 内容归属

### 该改哪里

- 改单日摘要、预订卡、清单、避坑：
  `scripts/yunnan_editorial_source.mjs`
- 改图片 / 段落映射规则、主题、景点归属：
  `scripts/build_yunnan_blueprint.py`
- 改原始素材：
  回到 docx，然后重新提取素材包

### 不再建议

- 不要把业务内容重新写回 `static/guide/js/config.js`
- 不要在前端运行时里维护第二套 day summary / packing / booking 数据

## 常用命令

```bash
python scripts/build_yunnan_content_bundle.py
python scripts/validate_yunnan_blueprint.py
```

如果只改了前端结构或样式，不需要重跑内容流水线。
