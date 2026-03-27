from __future__ import annotations

import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
SOURCE_DIR = BASE_DIR / "static" / "guide" / "source" / "yunnan_trip_v4"
DATA_DIR = BASE_DIR / "static" / "guide" / "data"
DAY_MAP_PATH = SOURCE_DIR / "day-map.json"
MANIFEST_PATH = SOURCE_DIR / "manifest.json"
OUTPUT_PATH = DATA_DIR / "yunnan.blueprint.json"
EDITORIAL_EXPORT_PATH = BASE_DIR / "scripts" / "export_yunnan_editorial_json.mjs"

THEMES = [
    {
        "id": "city_walk",
        "title": "城市漫游",
        "summary": "老街、大学、公园和城市街区组成的低强度漫游。",
    },
    {
        "id": "waterfront",
        "title": "湖海水线",
        "summary": "洱海、泸沽湖、滇池与湖边码头、桥和观景台。",
    },
    {
        "id": "ancient_town",
        "title": "古镇古城",
        "summary": "古城、古镇、村落和适合慢住慢逛的街巷。",
    },
    {
        "id": "transit",
        "title": "转场交通",
        "summary": "火车、自驾、导航、路况和跨城移动。",
    },
    {
        "id": "route_plan",
        "title": "行程骨架",
        "summary": "路线顺序、日程截图和整体推进节奏。",
    },
    {
        "id": "dining",
        "title": "餐饮补给",
        "summary": "午餐、晚餐、火锅、团购和路上补给点。",
    },
    {
        "id": "lodging",
        "title": "住宿落脚",
        "summary": "民宿、客栈、酒店和景观型住点。",
    },
    {
        "id": "booking",
        "title": "预约购票",
        "summary": "提前预约、抢票和证件准备。",
    },
    {
        "id": "pricing_alert",
        "title": "收费避坑",
        "summary": "收费不值、景区替代方案和门票提醒。",
    },
    {
        "id": "plateau",
        "title": "高原适应",
        "summary": "高海拔、氧气、富氧酒店和身体状态管理。",
    },
    {
        "id": "scenic_road",
        "title": "公路观景",
        "summary": "观景台、垭口、大拐弯和沿途景观点。",
    },
    {
        "id": "snow_mountain",
        "title": "雪山地貌",
        "summary": "雪山、冰川、蓝月谷和高海拔景区。",
    },
    {
        "id": "photography",
        "title": "摄影出片",
        "summary": "机位、日落、出片点和观景时间窗口。",
    },
]

ATTRACTIONS = [
    {
        "id": "kunming_city",
        "title": "昆明城区",
        "region": "昆明",
        "day_ids": ["day1"],
        "aliases": ["昆明老街", "云南大学", "翠湖", "翠湖公园", "讲武堂", "会泽楼", "龙门道"],
        "theme_ids": ["city_walk", "photography", "dining"],
        "summary": "昆明起点段把老街、云大、翠湖和城市节奏串在一起，负责缓冲和热身。",
    },
    {
        "id": "dianchi",
        "title": "滇池 / 海埂",
        "region": "昆明",
        "day_ids": ["day1"],
        "aliases": ["滇池", "海埂", "海埂公园", "海埂大坝"],
        "theme_ids": ["waterfront", "photography", "pricing_alert"],
        "summary": "昆明段真正值得去看的大场面在滇池和海埂，民族村反而不是重点。",
    },
    {
        "id": "erhai_east_route",
        "title": "海东 / 理想邦 / 文笔村",
        "region": "大理",
        "day_ids": ["day2", "day3"],
        "aliases": ["海东", "理想邦", "圣托里尼", "文笔村", "大理港码头", "大理港", "金梭岛", "云想山"],
        "theme_ids": ["waterfront", "photography", "lodging", "pricing_alert"],
        "summary": "从下关到海东、理想邦、文笔村这一线，负责把洱海东线的视野彻底打开。",
    },
    {
        "id": "xiaoputuo",
        "title": "小普陀",
        "region": "大理",
        "day_ids": ["day3"],
        "aliases": ["小普陀"],
        "theme_ids": ["waterfront", "photography", "dining"],
        "summary": "小普陀是洱海东线里最标准的停留点之一，适合吃饭和拍岛上寺庙轮廓。",
    },
    {
        "id": "shuanglang",
        "title": "双廊",
        "region": "大理",
        "day_ids": ["day3"],
        "aliases": ["双廊", "南诏风情岛", "太阳宫"],
        "theme_ids": ["waterfront", "ancient_town", "photography", "pricing_alert"],
        "summary": "双廊负责大理段最成熟的海景古镇气质，上岛与否反而不是重点。",
    },
    {
        "id": "xizhou",
        "title": "喜洲",
        "region": "大理",
        "day_ids": ["day3"],
        "aliases": ["喜洲", "麦田", "扎染", "乳扇"],
        "theme_ids": ["ancient_town", "photography", "dining"],
        "summary": "喜洲把田园、白族古镇和小吃补进洱海段，是典型的慢逛型停留点。",
    },
    {
        "id": "dali_ancient_city",
        "title": "大理古城",
        "region": "大理",
        "day_ids": ["day3", "day4"],
        "aliases": ["大理古城", "南门", "红龙井", "洱海门"],
        "theme_ids": ["ancient_town", "dining", "lodging"],
        "summary": "大理古城更多承担夜游和住宿功能，适合作为串联海东、海西和沙溪的落脚点。",
    },
    {
        "id": "erhai_west_corridor",
        "title": "海西生态长廊",
        "region": "大理",
        "day_ids": ["day4"],
        "aliases": ["海西", "海西生态长廊", "才村", "下波棚", "廊桥", "S弯", "芦苇荡"],
        "theme_ids": ["waterfront", "photography", "pricing_alert"],
        "summary": "海西生态长廊主打慢拍和机位选择，适合把上午留给才村、下波棚和廊桥。",
    },
    {
        "id": "shaxi",
        "title": "沙溪古镇",
        "region": "大理",
        "day_ids": ["day4"],
        "aliases": ["沙溪", "玉津桥", "沙溪古镇"],
        "theme_ids": ["ancient_town", "lodging", "photography", "dining"],
        "summary": "沙溪不是打卡密度型景点，它真正的价值在于落日、桥、牛羊和住一晚的氛围。",
    },
    {
        "id": "luguhu",
        "title": "泸沽湖",
        "region": "泸沽湖",
        "day_ids": ["day5", "day6"],
        "aliases": [
            "泸沽湖",
            "大落水",
            "情人滩",
            "里格",
            "里格半岛",
            "鸟岛",
            "泸源崖",
            "女神湾",
            "五支洛",
            "草海",
            "走婚桥",
            "蒗放",
            "猪槽船",
        ],
        "theme_ids": ["waterfront", "photography", "lodging", "plateau", "dining"],
        "summary": "泸沽湖两天都是慢节奏湖区生活，重点不在项目，而在湾、码头、住点和天光。",
    },
    {
        "id": "napa_sea",
        "title": "纳帕海",
        "region": "香格里拉",
        "day_ids": ["day7"],
        "aliases": ["纳帕海", "环湖路", "哈木古村"],
        "theme_ids": ["plateau", "waterfront", "photography", "pricing_alert"],
        "summary": "纳帕海的关键不在收费门区，而在环湖路和草原边的自由视角。",
    },
    {
        "id": "dukezong",
        "title": "独克宗古城",
        "region": "香格里拉",
        "day_ids": ["day7", "day8"],
        "aliases": ["独克宗", "龟山公园", "转经筒", "大金幡"],
        "theme_ids": ["plateau", "ancient_town", "dining", "lodging", "pricing_alert"],
        "summary": "独克宗承担香格里拉段的适应、住宿、夜游和补给，是后续高原线的基点。",
    },
    {
        "id": "pudacuo",
        "title": "普达措",
        "region": "香格里拉",
        "day_ids": ["day8"],
        "aliases": ["普达措", "属都湖", "碧塔海", "洛茸村"],
        "theme_ids": ["plateau", "photography", "scenic_road"],
        "summary": "普达措是香格里拉段最典型的长时间轻徒步景区，体力安排比打卡更重要。",
    },
    {
        "id": "songzanlin",
        "title": "松赞林寺",
        "region": "香格里拉",
        "day_ids": ["day8"],
        "aliases": ["松赞林寺", "小布达拉宫"],
        "theme_ids": ["plateau", "photography", "booking"],
        "summary": "松赞林寺把香格里拉的宗教和建筑气质补全，是高原段的重要视觉记忆点。",
    },
    {
        "id": "meili_corridor",
        "title": "梅里观景走廊",
        "region": "梅里雪山",
        "day_ids": ["day9"],
        "aliases": ["金沙江大拐弯", "月亮湾", "白马雪山", "垭口", "雾浓顶", "飞来寺", "梅里雪山"],
        "theme_ids": ["plateau", "scenic_road", "photography", "lodging", "pricing_alert"],
        "summary": "梅里这一整天的价值在沿路连续抬升的视野和观景台，而不是单一点位。",
    },
    {
        "id": "tiger_leaping_gorge",
        "title": "虎跳峡",
        "region": "丽江",
        "day_ids": ["day10"],
        "aliases": ["虎跳峡"],
        "theme_ids": ["scenic_road", "pricing_alert", "photography"],
        "summary": "虎跳峡更像返程时的硬朗转场点，是否进景区、是否买扶梯票都应该做减法。",
    },
    {
        "id": "lijiang_old_town",
        "title": "丽江古城",
        "region": "丽江",
        "day_ids": ["day10", "day11"],
        "aliases": ["丽江古城", "古城北门", "大研古城"],
        "theme_ids": ["ancient_town", "lodging", "dining", "pricing_alert"],
        "summary": "丽江古城在这条线里更适合作为住点和返程城市，而不是再把大量体力消耗在商业街里。",
    },
    {
        "id": "yulong_snow_mountain",
        "title": "玉龙雪山",
        "region": "丽江",
        "day_ids": ["day11"],
        "aliases": ["玉龙雪山", "冰川公园", "云杉坪", "牦牛坪", "游客服务中心", "雪川游客港"],
        "theme_ids": ["snow_mountain", "plateau", "booking", "photography"],
        "summary": "玉龙雪山是整条线最需要提前准备的收官段，必须主动做项目减法。",
    },
    {
        "id": "blue_moon_valley",
        "title": "蓝月谷",
        "region": "丽江",
        "day_ids": ["day11"],
        "aliases": ["蓝月谷"],
        "theme_ids": ["snow_mountain", "photography", "pricing_alert"],
        "summary": "蓝月谷适合作为雪山日的轻量补充，步行即可，不值得再为观光车加预算。",
    },
    {
        "id": "baisha",
        "title": "白沙古镇",
        "region": "丽江",
        "day_ids": ["day11"],
        "aliases": ["白沙", "白沙古镇"],
        "theme_ids": ["ancient_town", "photography", "dining"],
        "summary": "白沙把雪山日的尾声拉回到更松弛的镇子尺度，也是远眺雪山的稳妥落点。",
    },
]

DAY_THEME_DEFAULTS = {
    "day1": ["city_walk", "waterfront"],
    "day2": ["waterfront", "transit"],
    "day3": ["waterfront", "ancient_town"],
    "day4": ["waterfront", "ancient_town"],
    "day5": ["waterfront", "lodging"],
    "day6": ["waterfront", "photography"],
    "day7": ["plateau", "transit"],
    "day8": ["plateau", "photography"],
    "day9": ["plateau", "scenic_road"],
    "day10": ["transit", "scenic_road"],
    "day11": ["snow_mountain", "booking"],
}

IMAGE_ASSIGNMENTS = {
    1: {"attraction_ids": ["kunming_city"], "theme_ids": ["city_walk", "photography"]},
    2: {"attraction_ids": ["kunming_city"], "theme_ids": ["city_walk", "photography"]},
    3: {"attraction_ids": ["kunming_city"], "theme_ids": ["dining", "city_walk"]},
    4: {"attraction_ids": ["dianchi"], "theme_ids": ["waterfront", "photography"]},
    5: {"attraction_ids": ["kunming_city"], "theme_ids": ["route_plan", "city_walk"]},
    6: {"attraction_ids": [], "theme_ids": ["transit", "booking"]},
    7: {"attraction_ids": ["erhai_east_route"], "theme_ids": ["waterfront", "photography"]},
    8: {"attraction_ids": ["erhai_east_route"], "theme_ids": ["dining"]},
    9: {"attraction_ids": ["erhai_east_route"], "theme_ids": ["waterfront", "photography"]},
    10: {"attraction_ids": ["erhai_east_route"], "theme_ids": ["waterfront", "lodging", "photography"]},
    11: {"attraction_ids": ["xiaoputuo"], "theme_ids": ["waterfront", "photography"]},
    12: {"attraction_ids": ["xiaoputuo"], "theme_ids": ["dining"]},
    13: {"attraction_ids": ["shuanglang"], "theme_ids": ["waterfront", "photography"]},
    14: {"attraction_ids": ["xizhou"], "theme_ids": ["ancient_town", "photography"]},
    15: {"attraction_ids": ["dali_ancient_city"], "theme_ids": ["route_plan", "ancient_town"]},
    16: {"attraction_ids": ["erhai_west_corridor"], "theme_ids": ["waterfront", "photography"]},
    17: {"attraction_ids": ["erhai_west_corridor"], "theme_ids": ["waterfront", "photography"]},
    18: {"attraction_ids": ["erhai_west_corridor"], "theme_ids": ["waterfront", "photography"]},
    19: {"attraction_ids": ["shaxi"], "theme_ids": ["ancient_town", "photography"]},
    20: {"attraction_ids": ["luguhu"], "theme_ids": ["waterfront", "photography"]},
    21: {"attraction_ids": ["luguhu"], "theme_ids": ["waterfront", "photography"]},
    22: {"attraction_ids": ["luguhu"], "theme_ids": ["waterfront", "photography"]},
    23: {"attraction_ids": ["luguhu"], "theme_ids": ["waterfront", "photography"]},
    24: {"attraction_ids": ["luguhu"], "theme_ids": ["dining", "waterfront"]},
    25: {"attraction_ids": ["luguhu"], "theme_ids": ["waterfront", "photography"]},
    26: {"attraction_ids": ["luguhu"], "theme_ids": ["waterfront", "photography"]},
    27: {"attraction_ids": ["luguhu"], "theme_ids": ["waterfront", "pricing_alert"]},
    28: {"attraction_ids": ["luguhu"], "theme_ids": ["waterfront", "photography"]},
    29: {"attraction_ids": ["luguhu"], "theme_ids": ["dining"]},
    30: {"attraction_ids": ["luguhu"], "theme_ids": ["waterfront", "photography"]},
    31: {"attraction_ids": ["luguhu"], "theme_ids": ["lodging", "waterfront"]},
    32: {"attraction_ids": [], "theme_ids": ["transit", "plateau"]},
    33: {"attraction_ids": ["napa_sea", "dukezong"], "theme_ids": ["plateau", "waterfront", "photography"]},
    34: {"attraction_ids": ["pudacuo"], "theme_ids": ["plateau", "photography"]},
    35: {"attraction_ids": ["pudacuo"], "theme_ids": ["dining", "plateau"]},
    36: {"attraction_ids": ["songzanlin"], "theme_ids": ["plateau", "photography", "booking"]},
    37: {"attraction_ids": ["dukezong"], "theme_ids": ["dining"]},
    38: {"attraction_ids": ["dukezong"], "theme_ids": ["dining"]},
    39: {"attraction_ids": ["dukezong"], "theme_ids": ["plateau", "photography", "pricing_alert"]},
    40: {"attraction_ids": ["meili_corridor"], "theme_ids": ["scenic_road", "photography"]},
    41: {"attraction_ids": ["meili_corridor"], "theme_ids": ["scenic_road", "photography"]},
    42: {"attraction_ids": ["meili_corridor"], "theme_ids": ["plateau", "lodging", "photography"]},
    43: {"attraction_ids": ["meili_corridor"], "theme_ids": ["pricing_alert", "dining"]},
    44: {"attraction_ids": ["tiger_leaping_gorge"], "theme_ids": ["scenic_road", "pricing_alert"]},
    45: {"attraction_ids": ["yulong_snow_mountain"], "theme_ids": ["snow_mountain", "photography", "booking"]},
    46: {"attraction_ids": ["blue_moon_valley"], "theme_ids": ["snow_mountain", "photography", "pricing_alert"]},
    47: {"attraction_ids": ["baisha"], "theme_ids": ["ancient_town", "dining", "photography"]},
    48: {"attraction_ids": ["lijiang_old_town"], "theme_ids": ["ancient_town", "pricing_alert"]},
}

KEYWORD_THEME_RULES = [
    ("booking", ["预约", "抢票", "放票", "门票", "购票", "身份证", "公众号"]),
    ("dining", ["午餐", "晚餐", "推荐餐馆", "美食", "火锅", "饭店", "团购", "餐厅", "小吃", "咖啡", "饵丝"]),
    ("lodging", ["酒店", "民宿", "客栈", "住宿", "住", "富氧", "观景房"]),
    ("pricing_alert", ["收费", "门票", "不值", "没必要", "免门票", "补80元", "建议不去", "完全不用进", "不用进"]),
    ("plateau", ["高海拔", "高原", "氧气", "富氧", "晕车", "雪山", "香格里拉", "飞来寺"]),
    ("transit", ["打车", "自驾", "火车", "高铁", "导航", "公交", "滴滴", "分钟", "小时", "路", "码头"]),
    ("photography", ["拍照", "出片", "日落", "观景", "机位", "大片", "日照金山", "随手一拍"]),
    ("ancient_town", ["古城", "古镇", "老街", "村", "街巷"]),
    ("waterfront", ["海", "湖", "码头", "桥", "岛", "滩", "湾"]),
    ("snow_mountain", ["雪山", "冰川", "蓝月谷", "云杉坪", "牦牛坪"]),
    ("scenic_road", ["观景台", "垭口", "大拐弯", "环湖", "公路", "月亮湾"]),
    ("city_walk", ["大学", "公园", "老街", "街道", "城区"]),
]

BLOCK_KIND_RULES = [
    ("booking", ["预约", "抢票", "放票", "门票", "购票", "身份证"]),
    ("food", ["午餐", "晚餐", "推荐餐馆", "美食", "火锅", "餐厅", "小吃", "饵丝", "咖啡"]),
    ("stay", ["酒店", "民宿", "客栈", "住宿", "住", "富氧"]),
    ("tip", ["注：", "建议", "不值", "没必要", "免门票", "完全不用进", "最好", "提醒", "切记"]),
    ("transit", ["打车", "自驾", "火车", "高铁", "导航", "公交", "滴滴", "分钟", "小时", "路", "车"]),
]


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def load_editorial_source() -> dict:
    result = subprocess.run(
        ["node", str(EDITORIAL_EXPORT_PATH)],
        cwd=BASE_DIR,
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


def unique_list(items: list[str]) -> list[str]:
    seen: set[str] = set()
    ordered: list[str] = []
    for item in items:
        if item in seen:
            continue
        seen.add(item)
        ordered.append(item)
    return ordered


def build_theme_lookup() -> dict[str, dict]:
    return {theme["id"]: theme for theme in THEMES}


def build_attraction_lookup() -> dict[str, dict]:
    return {attraction["id"]: attraction for attraction in ATTRACTIONS}


THEME_LOOKUP = build_theme_lookup()
ATTRACTION_LOOKUP = build_attraction_lookup()


def classify_block_kind(text: str) -> str:
    for kind, keywords in BLOCK_KIND_RULES:
        if any(keyword in text for keyword in keywords):
            return kind
    return "story"


def infer_theme_ids(text: str, attraction_ids: list[str], day_id: str) -> list[str]:
    theme_ids: list[str] = []
    for theme_id, keywords in KEYWORD_THEME_RULES:
        if any(keyword in text for keyword in keywords):
            theme_ids.append(theme_id)

    for attraction_id in attraction_ids:
        theme_ids.extend(ATTRACTION_LOOKUP[attraction_id]["theme_ids"])

    if not theme_ids:
        theme_ids.extend(DAY_THEME_DEFAULTS.get(day_id, ["transit"]))

    return unique_list(theme_ids)


def match_attractions(text: str, day_id: str) -> list[str]:
    matched: list[str] = []
    for attraction in ATTRACTIONS:
        if day_id not in attraction["day_ids"]:
            continue
        if any(alias in text for alias in attraction["aliases"]):
            matched.append(attraction["id"])
    return unique_list(matched)


def build_paragraph_item(
    *,
    day_id: str,
    paragraph_id: str,
    block_id: str,
    order: int,
    text: str,
    inherited_attraction_ids: list[str],
) -> dict:
    attraction_ids = match_attractions(text, day_id) or inherited_attraction_ids
    theme_ids = infer_theme_ids(text, attraction_ids, day_id)
    return {
        "id": paragraph_id,
        "day_id": day_id,
        "source_block_id": block_id,
        "order": order,
        "text": text,
        "block_kind": classify_block_kind(text),
        "attraction_ids": unique_list(attraction_ids),
        "theme_ids": theme_ids,
    }


def pick_linked_paragraph_ids(paragraph_items: list[dict], image_item: dict) -> list[str]:
    attraction_ids = set(image_item.get("attraction_ids", []))
    theme_ids = set(image_item.get("theme_ids", []))

    exact = [
        paragraph["id"]
        for paragraph in paragraph_items
        if attraction_ids and attraction_ids.intersection(paragraph.get("attraction_ids", []))
    ]
    if exact:
        return exact[:4]

    thematic = [
        paragraph["id"]
        for paragraph in paragraph_items
        if theme_ids.intersection(paragraph.get("theme_ids", []))
    ]
    if thematic:
        return thematic[:4]

    return [paragraph["id"] for paragraph in paragraph_items[-2:]]


def build_image_item(day_id: str, raw_image: dict) -> dict:
    sequence = raw_image["sequence"]
    explicit = IMAGE_ASSIGNMENTS.get(sequence, {})
    context_blob = " ".join(
        [
            raw_image.get("reference_excerpt", ""),
            raw_image.get("reference_before", ""),
            raw_image.get("reference_after", ""),
        ]
    )
    attraction_ids = explicit.get("attraction_ids") or match_attractions(context_blob, day_id)
    theme_ids = explicit.get("theme_ids") or infer_theme_ids(context_blob, attraction_ids, day_id)

    return {
        "sequence": sequence,
        "day_id": day_id,
        "relative_path": raw_image["relative_path"],
        "paragraph_index": raw_image.get("paragraph_index"),
        "reference_excerpt": raw_image.get("reference_excerpt", ""),
        "reference_before": raw_image.get("reference_before", ""),
        "reference_after": raw_image.get("reference_after", ""),
        "original_name": raw_image.get("original_name", ""),
        "extracted_name": raw_image.get("extracted_name", ""),
        "attraction_ids": unique_list(attraction_ids),
        "theme_ids": unique_list(theme_ids),
        "caption": raw_image.get("reference_excerpt") or raw_image.get("reference_after") or raw_image.get("reference_before") or f"图 {sequence}",
        "linked_paragraph_ids": [],
    }


def build_blueprint() -> dict:
    editorial = load_editorial_source()
    day_map = load_json(DAY_MAP_PATH)
    manifest = load_json(MANIFEST_PATH)
    manifest_by_sequence = {
        reference["image_sequence"]: reference for reference in manifest.get("references", [])
    }
    theme_ids = [theme["id"] for theme in THEMES]
    day_editorial_by_id = {day["id"]: day for day in editorial.get("dayData", [])}
    day_enhancements = editorial.get("dayEnhancements", {})

    days: list[dict] = []
    media_registry: list[dict] = []
    paragraphs_registry: list[dict] = []
    source_block_registry: list[dict] = []
    attraction_groups: dict[str, dict] = {
        attraction["id"]: {
            **attraction,
            "day_ids": [],
            "image_sequences": [],
            "paragraph_ids": [],
            "cover_image_sequence": None,
            "primary_day_id": None,
        }
        for attraction in ATTRACTIONS
    }

    for day_index, raw_day in enumerate(day_map.get("days", []), start=1):
        day_id = raw_day["id"]
        day_editorial = day_editorial_by_id.get(day_id, {})
        day_enhancement = day_enhancements.get(day_id, {})
        paragraph_items: list[dict] = []
        source_blocks: list[dict] = []
        inherited_attraction_ids: list[str] = []
        paragraph_counter = 0

        raw_images = [build_image_item(day_id, image) for image in raw_day.get("images", [])]
        images_by_sequence = {image["sequence"]: image for image in raw_images}

        for block_index, raw_block in enumerate(raw_day.get("source_blocks", []), start=1):
            block_id = f"{day_id}-b{block_index:02d}"
            if raw_block["type"] == "text":
                lines = [line.strip() for line in raw_block["text"].splitlines() if line.strip()]
                block_paragraph_items: list[dict] = []
                for line in lines:
                    paragraph_counter += 1
                    paragraph_id = f"{day_id}-p{paragraph_counter:02d}"
                    paragraph = build_paragraph_item(
                        day_id=day_id,
                        paragraph_id=paragraph_id,
                        block_id=block_id,
                        order=paragraph_counter,
                        text=line,
                        inherited_attraction_ids=inherited_attraction_ids,
                    )
                    if paragraph["attraction_ids"]:
                        inherited_attraction_ids = paragraph["attraction_ids"]
                    block_paragraph_items.append(paragraph)
                    paragraph_items.append(paragraph)

                block_attraction_ids = unique_list(
                    [attraction_id for paragraph in block_paragraph_items for attraction_id in paragraph["attraction_ids"]]
                )
                block_theme_ids = unique_list(
                    [theme_id for paragraph in block_paragraph_items for theme_id in paragraph["theme_ids"]]
                ) or DAY_THEME_DEFAULTS.get(day_id, ["transit"])

                block = {
                    "id": block_id,
                    "day_id": day_id,
                    "type": "text",
                    "order": block_index,
                    "text": raw_block["text"],
                    "block_kind": classify_block_kind(raw_block["text"]),
                    "paragraph_ids": [paragraph["id"] for paragraph in block_paragraph_items],
                    "paragraph_items": block_paragraph_items,
                    "attraction_ids": block_attraction_ids,
                    "theme_ids": block_theme_ids,
                }
                source_blocks.append(block)
                source_block_registry.append(block)
                continue

            sequence = raw_block["image_sequence"]
            image_item = images_by_sequence[sequence]
            linked_paragraph_ids = pick_linked_paragraph_ids(paragraph_items, image_item)
            image_item["linked_paragraph_ids"] = linked_paragraph_ids
            block = {
                "id": block_id,
                "day_id": day_id,
                "type": "image",
                "order": block_index,
                "image_sequence": sequence,
                "relative_path": image_item["relative_path"],
                "linked_paragraph_ids": linked_paragraph_ids,
                "attraction_ids": image_item["attraction_ids"],
                "theme_ids": image_item["theme_ids"],
                "caption": image_item["caption"],
            }
            source_blocks.append(block)
            source_block_registry.append(block)

        day_attraction_ids = unique_list(
            [attraction_id for image in raw_images for attraction_id in image["attraction_ids"]]
            + [attraction_id for paragraph in paragraph_items for attraction_id in paragraph["attraction_ids"]]
        )
        day_theme_ids = unique_list(
            [theme_id for image in raw_images for theme_id in image["theme_ids"]]
            + [theme_id for paragraph in paragraph_items for theme_id in paragraph["theme_ids"]]
        )

        day_record = {
            **raw_day,
            **day_editorial,
            "decision": day_enhancement.get("decision", ""),
            "sequence": day_index,
            "theme_ids": day_theme_ids or DAY_THEME_DEFAULTS.get(day_id, ["transit"]),
            "attraction_ids": day_attraction_ids,
            "paragraph_items": paragraph_items,
            "paragraph_count": len(paragraph_items),
            "source_blocks": source_blocks,
            "block_count": len(source_blocks),
            "images": raw_images,
            "image_count": len(raw_images),
        }

        days.append(day_record)
        paragraphs_registry.extend(paragraph_items)
        media_registry.extend(raw_images)

        for attraction_id in day_attraction_ids:
            group = attraction_groups[attraction_id]
            group["day_ids"].append(day_id)
            if not group["primary_day_id"]:
                group["primary_day_id"] = day_id

        for paragraph in paragraph_items:
            for attraction_id in paragraph["attraction_ids"]:
                attraction_groups[attraction_id]["paragraph_ids"].append(paragraph["id"])

        for image in raw_images:
            for attraction_id in image["attraction_ids"]:
                group = attraction_groups[attraction_id]
                group["image_sequences"].append(image["sequence"])
                if group["cover_image_sequence"] is None:
                    group["cover_image_sequence"] = image["sequence"]

    for attraction_id, group in attraction_groups.items():
        group["day_ids"] = unique_list(ATTRACTION_LOOKUP[attraction_id]["day_ids"] + group["day_ids"])
        group["image_sequences"] = unique_list(group["image_sequences"])
        group["paragraph_ids"] = unique_list(group["paragraph_ids"])
        if group["cover_image_sequence"] is None and group["day_ids"]:
            fallback_day = next(day for day in days if day["id"] == group["day_ids"][0])
            group["cover_image_sequence"] = fallback_day.get("cover_image_sequence")
        if group["primary_day_id"] is None and group["day_ids"]:
            group["primary_day_id"] = group["day_ids"][0]

    for image in media_registry:
        if not image["linked_paragraph_ids"]:
            image["linked_paragraph_ids"] = pick_linked_paragraph_ids(
                [paragraph for paragraph in paragraphs_registry if paragraph["day_id"] == image["day_id"]],
                image,
            )

        reference = manifest_by_sequence.get(image["sequence"], {})
        image["context_paragraph_text"] = (reference.get("paragraph_text") or "").strip()

    attractions = []
    for attraction in ATTRACTIONS:
        group = attraction_groups[attraction["id"]]
        attractions.append(
            {
                **attraction,
                "day_ids": group["day_ids"],
                "image_sequences": group["image_sequences"],
                "paragraph_ids": group["paragraph_ids"],
                "cover_image_sequence": group["cover_image_sequence"],
                "primary_day_id": group["primary_day_id"],
                "image_count": len(group["image_sequences"]),
                "paragraph_count": len(group["paragraph_ids"]),
            }
        )

    orphan_media = [image["sequence"] for image in media_registry if not image["theme_ids"]]
    orphan_paragraphs = [paragraph["id"] for paragraph in paragraphs_registry if not paragraph["theme_ids"]]

    return {
        "schema_version": 2,
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "source_docx": manifest.get("source_docx"),
        "source_files": {
            "day_map": str(DAY_MAP_PATH.relative_to(BASE_DIR)),
            "manifest": str(MANIFEST_PATH.relative_to(BASE_DIR)),
        },
        "trip": {
            "id": "yunnan_loop",
            "title": "云南 11 天游路线册",
            "route_stops": editorial.get("routeStops", []),
            "day_ids": [day["id"] for day in days],
            "theme_ids": theme_ids,
            "attraction_ids": [attraction["id"] for attraction in attractions],
            "editorial": {
                "phaseOptions": editorial.get("phaseOptions", []),
                "routeSpine": editorial.get("routeSpine", []),
                "heroHighlightCards": editorial.get("heroHighlightCards", []),
                "overviewCards": editorial.get("overviewCards", []),
                "bookingTimeline": editorial.get("bookingTimeline", []),
                "bookingToolCards": editorial.get("bookingToolCards", []),
                "globalNotes": editorial.get("globalNotes", []),
                "packingGroups": editorial.get("packingGroups", []),
                "pitfallCategories": editorial.get("pitfallCategories", []),
                "pitfallTemplates": editorial.get("pitfallTemplates", []),
                "riskNotes": editorial.get("riskNotes", []),
            },
        },
        "stats": {
            "day_count": len(days),
            "theme_count": len(THEMES),
            "attraction_count": len(attractions),
            "image_count": len(media_registry),
            "paragraph_count": len(paragraphs_registry),
            "source_block_count": len(source_block_registry),
            "orphan_media_count": len(orphan_media),
            "orphan_paragraph_count": len(orphan_paragraphs),
            "orphan_media_sequences": orphan_media,
            "orphan_paragraph_ids": orphan_paragraphs,
        },
        "themes": THEMES,
        "attractions": attractions,
        "days": days,
        "media": media_registry,
    }


def main() -> None:
    blueprint = build_blueprint()
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(
        json.dumps(blueprint, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUTPUT_PATH}")
    print(json.dumps(blueprint["stats"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
