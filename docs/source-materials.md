# Source Materials

## 原始来源

- 源文件：`/Users/lijiabo/Desktop/云南十天（昆明大理泸沽湖丽江香格里拉）(4).docx`
- 当前站点：`static/guide/yunnan.html`
- 当前前端入口：`static/guide/js/main.js`
- 当前 editorial 源：`scripts/yunnan_editorial_source.mjs`
- 当前 blueprint 产物：`static/guide/data/yunnan.blueprint.json`

## 已提取素材包

- 目录：`static/guide/source/yunnan_trip_v4`
- 生成脚本：`scripts/extract_docx_bundle.py`

## 当前内容流水线

- `scripts/extract_docx_bundle.py`
  从 docx 提取素材包。
- `scripts/build_yunnan_day_map.py`
  把素材包按天切成 `day-map.json`。
- `scripts/yunnan_editorial_source.mjs`
  维护页面实际消费的摘要、预订、清单、避坑和阶段配置。
- `scripts/build_yunnan_blueprint.py`
  把 `day-map + 图片映射 + editorial source` 合并成 blueprint。
- `scripts/build_yunnan_content_bundle.py`
  串起 `day-map -> blueprint -> validate` 的统一构建入口。

## 素材包内容

- `document.md`
  按阅读顺序穿插了正文和图片引用，适合人工通读。
- `document.txt`
  纯文本版本，图片位置会显示占位引用。
- `manifest.json`
  机器可读的引用清单，包含图片顺序、原始文件名、所在段落、前后文。
- `images/`
  从 docx 中提取出的图片文件，目前共 48 张，文件名已按文档出现顺序重命名。

## 当前提取结果

- 段落数：376
- 图片引用数：48
- 图片命名方式：`image-001` 到 `image-048`

## 后续页面使用建议

- `document.md` 用于人工整理每一天的图文节奏。
- `manifest.json` 用于前端建立 “图片 -> 段落 -> 天数” 的引用关系。
- `images/` 用于做每天封面图、图廊图和灯箱图。
- `document.txt` 用于搜索兜底或生成关键词索引。

## 注意点

- 很多图片在原文中是单独占一段，因此页面里不应该只把它们当装饰图。
- 同一天经常有多张图，适合做图廊而不是只放一张示意图。
- 前端已经改为优先消费 `yunnan.blueprint.json`，如果要改总览摘要、清单、预订和单日文案，应优先改 `scripts/yunnan_editorial_source.mjs` 并重新构建内容产物。
