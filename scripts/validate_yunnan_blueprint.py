from __future__ import annotations

import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
BLUEPRINT_PATH = BASE_DIR / "static" / "guide" / "data" / "yunnan.blueprint.json"


def load_blueprint() -> dict:
    return json.loads(BLUEPRINT_PATH.read_text(encoding="utf-8"))


def assert_condition(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> None:
    blueprint = load_blueprint()
    days = blueprint.get("days", [])
    attractions = blueprint.get("attractions", [])
    media = blueprint.get("media", [])
    stats = blueprint.get("stats", {})

    media_sequences = {item["sequence"] for item in media}
    day_ids = {day["id"] for day in days}
    attraction_ids = {attraction["id"] for attraction in attractions}
    paragraph_ids = {
        paragraph["id"]
        for day in days
        for paragraph in day.get("paragraph_items", [])
    }

    assert_condition(stats.get("orphan_media_count") == 0, "存在孤立图片")
    assert_condition(stats.get("orphan_paragraph_count") == 0, "存在孤立原文段落")
    assert_condition(len(media) == stats.get("image_count"), "图片统计与数据不一致")
    assert_condition(len(days) == stats.get("day_count"), "天数统计与数据不一致")

    for day in days:
        assert_condition(day.get("image_count", 0) > 0, f"{day['id']} 没有图片")
        assert_condition(day.get("paragraph_count", 0) > 0, f"{day['id']} 没有原文段落")
        for image in day.get("images", []):
            image_path = BASE_DIR / "static" / "guide" / "source" / "yunnan_trip_v4" / image["relative_path"].removeprefix("./")
            assert_condition(image_path.exists(), f"图片文件不存在: {image_path}")

    for attraction in attractions:
        assert_condition(attraction.get("image_count", 0) > 0, f"{attraction['id']} 没有归属图片")
        assert_condition(attraction.get("paragraph_count", 0) > 0, f"{attraction['id']} 没有归属原文")
        assert_condition(
            all(day_id in day_ids for day_id in attraction.get("day_ids", [])),
            f"{attraction['id']} 存在无效 day_id",
        )
        assert_condition(
            all(sequence in media_sequences for sequence in attraction.get("image_sequences", [])),
            f"{attraction['id']} 存在无效 image_sequence",
        )
        assert_condition(
            all(paragraph_id in paragraph_ids for paragraph_id in attraction.get("paragraph_ids", [])),
            f"{attraction['id']} 存在无效 paragraph_id",
        )

    for image in media:
        assert_condition(image.get("day_id") in day_ids, f"图片 {image['sequence']} 缺少有效 day_id")
        assert_condition(image.get("theme_ids"), f"图片 {image['sequence']} 缺少 theme_ids")
        assert_condition(
            all(attraction_id in attraction_ids for attraction_id in image.get("attraction_ids", [])),
            f"图片 {image['sequence']} 存在无效 attraction_id",
        )
        assert_condition(
            all(paragraph_id in paragraph_ids for paragraph_id in image.get("linked_paragraph_ids", [])),
            f"图片 {image['sequence']} 存在无效 linked_paragraph_id",
        )

    print(
        json.dumps(
            {
                "day_count": len(days),
                "attraction_count": len(attractions),
                "image_count": len(media),
                "paragraph_count": len(paragraph_ids),
                "status": "ok",
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
