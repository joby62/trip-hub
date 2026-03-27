import { trimText, uniqueBy } from "./text.js";

const COMMUNITY_NAMES = [
  "阿禾",
  "小满",
  "Momo",
  "星野",
  "阿喵",
  "南风",
  "木木",
  "Rita",
  "小野",
  "晨溪",
];

const STORY_RATIOS = [
  "4 / 5.6",
  "4 / 4.9",
  "4 / 6.1",
  "4 / 5.2",
];

function hashValue(value) {
  return Array.from(String(value || "")).reduce((total, char, index) => (
    (total * 33 + char.charCodeAt(0) + index) % 1000003
  ), 17);
}

function formatCompactCount(value) {
  const count = Number(value) || 0;
  if (count >= 10000) {
    const wan = count / 10000;
    return `${wan >= 10 ? wan.toFixed(0) : wan.toFixed(1).replace(/\.0$/, "")}万`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(count);
}

function getAttractionStoryRatio(attraction) {
  return STORY_RATIOS[hashValue(attraction.id) % STORY_RATIOS.length];
}

function renderSocialIcon(kind, active = false) {
  if (kind === "like") {
    return active
      ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.4 4.9 13.8a4.9 4.9 0 0 1 6.9-7l.2.2.2-.2a4.9 4.9 0 0 1 6.9 7L12 20.4Z" fill="currentColor"/></svg>`
      : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.4 4.9 13.8a4.9 4.9 0 0 1 6.9-7l.2.2.2-.2a4.9 4.9 0 0 1 6.9 7L12 20.4Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
  }

  if (kind === "save") {
    return active
      ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.8h12a1 1 0 0 1 1 1v15.9l-7-4-7 4V4.8a1 1 0 0 1 1-1Z" fill="currentColor"/></svg>`
      : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.8h12a1 1 0 0 1 1 1v15.9l-7-4-7 4V4.8a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
  }

  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6.2a2.2 2.2 0 0 1 2.2-2.2h9.6A2.2 2.2 0 0 1 19 6.2v7.6A2.2 2.2 0 0 1 16.8 16H10l-4.2 3V6.2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
}

function getThemeCommentLines(attraction) {
  const themeIds = new Set(attraction.theme_ids || []);
  const lines = [];

  if (themeIds.has("photography")) {
    lines.push("天气在线的时候真的很出片，别只拍一张就走。");
  }
  if (themeIds.has("waterfront")) {
    lines.push("建议往更靠水的位置多走几步，现场层次会比入口更舒服。");
  }
  if (themeIds.has("ancient_town")) {
    lines.push("更适合慢慢逛，不太适合十分钟冲刺式打卡。");
  }
  if (themeIds.has("plateau")) {
    lines.push("高原段最好把节奏放慢一点，别在这里硬赶强度。");
  }
  if (themeIds.has("pricing_alert")) {
    lines.push("现场有些额外付费项可以先别急着买，把主景看完再决定。");
  }
  if (themeIds.has("booking")) {
    lines.push("旺季来之前先把预约看一眼，会省掉很多临场焦虑。");
  }

  return lines;
}

function buildAttractionCaption(attraction, selectors) {
  const pitfall = selectors.getAttractionPitfalls(attraction)[0];
  const advice = trimText(selectors.getAttractionAdvice(attraction), 28);
  if (pitfall?.title) {
    return trimText(`${advice || attraction.summary}，${pitfall.title}要提前想清楚。`, 34);
  }
  return trimText(advice || attraction.summary, 34);
}

function buildSeedComments(attraction, selectors) {
  const images = selectors.collectAttractionImages(attraction).slice(0, 3);
  const pitfall = selectors.getAttractionPitfalls(attraction)[0];
  const themeLines = getThemeCommentLines(attraction);
  const summary = trimText(attraction.summary, 58);
  const dayLabel = attraction.day_ids
    .map((dayId) => selectors.getDayById(dayId)?.day)
    .filter(Boolean)
    .join(" · ");

  const seeds = [
    {
      id: `${attraction.id}-seed-1`,
      author: COMMUNITY_NAMES[hashValue(`${attraction.id}:1`) % COMMUNITY_NAMES.length],
      body: themeLines[0] || summary,
      createdAtLabel: "刚刚看完回来",
      likes: 26 + (hashValue(`${attraction.id}:like1`) % 54),
      images: images[0] ? [{ src: images[0].src, dayId: images[0].day_id, sequence: images[0].sequence }] : [],
    },
    {
      id: `${attraction.id}-seed-2`,
      author: COMMUNITY_NAMES[hashValue(`${attraction.id}:2`) % COMMUNITY_NAMES.length],
      body: pitfall?.quote
        ? trimText(`如果是高峰时段来，${pitfall.quote}`, 64)
        : themeLines[1] || trimText(`${summary}，我自己会愿意再留半小时。`, 64),
      createdAtLabel: dayLabel ? `${dayLabel} 同行反馈` : "同行反馈",
      likes: 18 + (hashValue(`${attraction.id}:like2`) % 42),
      images: images[1] ? [{ src: images[1].src, dayId: images[1].day_id, sequence: images[1].sequence }] : [],
    },
    {
      id: `${attraction.id}-seed-3`,
      author: COMMUNITY_NAMES[hashValue(`${attraction.id}:3`) % COMMUNITY_NAMES.length],
      body: trimText(`${summary}。如果你是顺路过来，不用把期待拉成“必须单独跑一趟”的级别。`, 64),
      createdAtLabel: "路线沉淀",
      likes: 8 + (hashValue(`${attraction.id}:like3`) % 26),
      images: [],
    },
  ];

  return uniqueBy(
    seeds.filter((item) => item.body),
    (item) => item.body,
  );
}

function formatRelativeTime(value) {
  const target = Number.isFinite(value) ? value : Date.parse(value || "");
  if (!target) return "刚刚";
  const delta = Date.now() - target;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (delta < minute) return "刚刚";
  if (delta < hour) return `${Math.max(1, Math.round(delta / minute))}分钟前`;
  if (delta < day) return `${Math.max(1, Math.round(delta / hour))}小时前`;
  return `${Math.max(1, Math.round(delta / day))}天前`;
}

function buildAttractionCommunitySnapshot({ attraction, selectors, store }) {
  const seedComments = buildSeedComments(attraction, selectors);
  const customComments = (store.comments?.[attraction.id] || []).map((comment) => ({
    ...comment,
    createdAtLabel: formatRelativeTime(comment.createdAt),
  }));
  const reactionState = store.reactions?.[attraction.id] || { liked: false, saved: false };
  const baseLikes = 120 + (hashValue(`${attraction.id}:likes`) % 1800);
  const baseSaves = 36 + (hashValue(`${attraction.id}:saves`) % 520);
  const galleryImages = uniqueBy(
    [
      ...customComments.flatMap((comment) => (comment.images || []).map((image, index) => ({
        id: `${comment.id}:upload:${index}`,
        src: image.src,
        source: "comment",
      }))),
      ...selectors.collectAttractionImages(attraction).map((image) => ({
        id: `${attraction.id}:seed:${image.sequence}`,
        src: image.src,
        dayId: image.day_id,
        sequence: image.sequence,
        source: "guide",
      })),
    ],
    (item) => item.id,
  ).slice(0, 8);

  return {
    caption: buildAttractionCaption(attraction, selectors),
    comments: [...customComments, ...seedComments],
    counts: {
      comments: seedComments.length + customComments.length,
      likes: baseLikes + (reactionState.liked ? 1 : 0),
      saves: baseSaves + (reactionState.saved ? 1 : 0),
    },
    galleryImages,
    reactionState,
    storyRatio: getAttractionStoryRatio(attraction),
  };
}

export {
  buildAttractionCommunitySnapshot,
  buildAttractionCaption,
  formatCompactCount,
  getAttractionStoryRatio,
  renderSocialIcon,
};
