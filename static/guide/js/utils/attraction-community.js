import { normalizeComparableText, trimText, uniqueBy } from "./text.js";

const STORY_RATIOS = [
  "4 / 5.6",
  "4 / 4.9",
  "4 / 6.2",
  "4 / 5.15",
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

function getAttractionStoryRatio(entity) {
  const storyId = entity?.id || entity?.dayId || entity;
  return STORY_RATIOS[hashValue(storyId) % STORY_RATIOS.length];
}

function renderSocialIcon(kind, active = false) {
  if (kind === "like") {
    return active
      ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.4 4.9 13.8a4.9 4.9 0 0 1 6.9-7l.2.2.2-.2a4.9 4.9 0 0 1 6.9 7L12 20.4Z" fill="currentColor"/></svg>`
      : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.4 4.9 13.8a4.9 4.9 0 0 1 6.9-7l.2.2.2-.2a4.9 4.9 0 0 1 6.9 7L12 20.4Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
  }

  if (kind === "save") {
    return active
      ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3.8 2.47 5 5.53.8-4 3.9.94 5.5L12 16.5 7.06 19l.94-5.5-4-3.9 5.53-.8Z" fill="currentColor"/></svg>`
      : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3.8 2.47 5 5.53.8-4 3.9.94 5.5L12 16.5 7.06 19l.94-5.5-4-3.9 5.53-.8Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
  }

  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6.2a2.2 2.2 0 0 1 2.2-2.2h9.6A2.2 2.2 0 0 1 19 6.2v7.6A2.2 2.2 0 0 1 16.8 16H10l-4.2 3V6.2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
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

function buildAttractionCaption(day) {
  return trimText(day.decision || day.summary || day.logistics || "", 44);
}

function buildStoryBodyLines(day, image) {
  const headline = trimText(
    image?.reference_excerpt
      || image?.caption
      || day.decision
      || day.summary
      || `${day.day} 图文`,
    72,
  );

  const bodyLines = uniqueBy(
    [
      image?.reference_before,
      image?.reference_after,
      image?.caption,
      day.summary,
      day.decision,
    ]
      .map((line) => String(line || "").replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .filter((line) => normalizeComparableText(line) !== normalizeComparableText(headline)),
    (line) => normalizeComparableText(line),
  ).slice(0, 3);

  return {
    bodyLines,
    headline,
  };
}

function buildAttractionCommunitySnapshot({ day, selectors, store }) {
  const comments = (store.comments?.[day.id] || []).map((comment) => ({
    ...comment,
    createdAtLabel: formatRelativeTime(comment.createdAt),
  }));
  const reactionState = store.reactions?.[day.id] || { liked: false, saved: false };
  const images = selectors.getDayImageItems(day.id).map((image, index) => {
    const { headline, bodyLines } = buildStoryBodyLines(day, image);
    return {
      ...image,
      bodyLines,
      headline,
      index,
    };
  });

  return {
    caption: buildAttractionCaption(day),
    comments,
    counts: {
      comments: comments.length,
      likes: reactionState.liked ? 1 : 0,
      saves: reactionState.saved ? 1 : 0,
    },
    images,
    reactionState,
    storyRatio: getAttractionStoryRatio(day),
  };
}

export {
  buildAttractionCommunitySnapshot,
  buildAttractionCaption,
  formatCompactCount,
  getAttractionStoryRatio,
  renderSocialIcon,
};
