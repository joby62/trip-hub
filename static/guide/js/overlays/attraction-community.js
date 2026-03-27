import { formatCompactCount, renderSocialIcon } from "../utils/attraction-community.js";
import { escapeHtml } from "../utils/text.js";

function renderCommentImages(images = []) {
  if (!images.length) return "";

  return `
    <div class="attraction-community-comment__images">
      ${images
        .map((image) => `<img src="${escapeHtml(image.src)}" alt="评论图片" loading="lazy" />`)
        .join("")}
    </div>
  `;
}

function renderStoryDots(total, current) {
  return Array.from({ length: total })
    .map((_, index) => `<span class="attraction-story-stage__dot ${index === current ? "is-active" : ""}"></span>`)
    .join("");
}

export function createAttractionCommunityOverlay({
  els,
  state,
  selectors,
  getAttractionCommunitySnapshot,
}) {
  function renderAttractionCommunity() {
    if (!els.attractionCommunityShell) return;

    const day = selectors.getDayById(state.itineraryDayId);
    if (!state.attractionCommunityOpen || !day) {
      els.attractionCommunityShell.hidden = true;
      return;
    }

    const snapshot = getAttractionCommunitySnapshot(day);
    const safeIndex = snapshot.images.length
      ? ((state.attractionCommunityImageIndex % snapshot.images.length) + snapshot.images.length) % snapshot.images.length
      : 0;
    const currentImage = snapshot.images[safeIndex] || null;
    const storyBody = currentImage?.bodyLines?.length
      ? currentImage.bodyLines
      : [day.summary || day.decision].filter(Boolean);

    state.attractionCommunityImageIndex = safeIndex;
    els.attractionCommunityShell.hidden = false;
    els.attractionCommunityTitle.textContent = day.title;
    els.attractionCommunityHero.innerHTML = currentImage
      ? `
        <article class="attraction-story-stage">
          <div class="attraction-story-stage__kicker">
            <span>${escapeHtml(`${day.day} · 图 ${safeIndex + 1} / ${snapshot.images.length}`)}</span>
            <div class="attraction-story-stage__dots">${renderStoryDots(snapshot.images.length, safeIndex)}</div>
          </div>
          <div class="attraction-story-stage__frame">
            ${snapshot.images.length > 1 ? `<button class="attraction-story-stage__nav attraction-story-stage__nav--prev" type="button" data-community-image-nav="prev" aria-label="上一张">‹</button>` : ""}
            <img src="${escapeHtml(currentImage.src)}" alt="${escapeHtml(day.title)}" loading="eager" />
            ${snapshot.images.length > 1 ? `<button class="attraction-story-stage__nav attraction-story-stage__nav--next" type="button" data-community-image-nav="next" aria-label="下一张">›</button>` : ""}
          </div>
        </article>
      `
      : `<div class="empty-state">这条笔记暂时还没有图。</div>`;

    els.attractionCommunityGallery.innerHTML = `
      <div class="attraction-story-copy">
        <p class="attraction-story-copy__meta">${escapeHtml(`${day.day} · ${day.date} · ${day.city}`)}</p>
        <h3>${escapeHtml(day.title)}</h3>
        ${currentImage?.headline ? `<p class="attraction-story-copy__lead">${escapeHtml(currentImage.headline)}</p>` : ""}
        ${storyBody.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
      </div>
    `;

    els.attractionCommunityActions.innerHTML = `
      <div class="attraction-community-actions__grid">
        <button class="attraction-community-action ${currentImage?.reactionState?.liked ? "is-active" : ""}" type="button" data-story-reaction="${escapeHtml(currentImage?.pointKey || "")}" data-story-reaction-field="liked">
          ${renderSocialIcon("like", Boolean(currentImage?.reactionState?.liked))}
          <span>${escapeHtml(`点赞 ${formatCompactCount(currentImage?.counts?.likes || 0)}`)}</span>
        </button>
        <button class="attraction-community-action ${currentImage?.reactionState?.upped ? "is-active" : ""}" type="button" data-story-reaction="${escapeHtml(currentImage?.pointKey || "")}" data-story-reaction-field="upped">
          ${renderSocialIcon("up", Boolean(currentImage?.reactionState?.upped))}
          <span>${escapeHtml(`UP ${formatCompactCount(currentImage?.counts?.ups || 0)}`)}</span>
        </button>
        <button class="attraction-community-action" type="button" data-open-community-composer>
          ${renderSocialIcon("comment")}
          <span>${escapeHtml(`评论 ${formatCompactCount(currentImage?.counts?.comments || 0)}`)}</span>
        </button>
        <button class="attraction-community-action is-negative ${currentImage?.reactionState?.downed ? "is-active" : ""}" type="button" data-story-reaction="${escapeHtml(currentImage?.pointKey || "")}" data-story-reaction-field="downed">
          ${renderSocialIcon("down", Boolean(currentImage?.reactionState?.downed))}
          <span>${escapeHtml(`踩 ${formatCompactCount(currentImage?.counts?.downs || 0)}`)}</span>
        </button>
      </div>
    `;

    els.attractionCommunityCommentsHead.innerHTML = `
      <div class="attraction-community-comments-head__row">
        <h3>评论</h3>
        <p>${escapeHtml(`${currentImage?.counts?.comments || 0} 条`)}</p>
      </div>
      <p>${escapeHtml(currentImage?.headline || "这条点位的评论会单独沉淀，不和当天其他图文混在一起。")}</p>
    `;

    els.attractionCommunityComments.innerHTML = currentImage?.comments?.length
      ? currentImage.comments
          .map((comment) => `
            <article class="attraction-community-comment">
              <div class="attraction-community-comment__head">
                <div class="attraction-community-comment__avatar">${escapeHtml(String(comment.author || "我").slice(0, 1) || "我")}</div>
                <div class="attraction-community-comment__meta">
                  <strong>${escapeHtml(comment.author || "我")}</strong>
                  <span>${escapeHtml(comment.createdAtLabel || "刚刚")}</span>
                </div>
              </div>
              <p class="attraction-community-comment__body">${escapeHtml(comment.body)}</p>
              ${renderCommentImages(comment.images)}
            </article>
          `)
          .join("")
      : `<div class="attraction-community-comments__empty">还没有评论，第一条会从这里开始。</div>`;

    if (els.attractionCommunityComposeBar) {
      els.attractionCommunityComposeBar.hidden = state.attractionComposerOpen;
    }
    if (els.attractionCommunityComposer) {
      els.attractionCommunityComposer.hidden = !state.attractionComposerOpen;
    }
    const composerPlaceholder = currentImage?.headline
      ? `对这一点说点什么：${currentImage.headline}`
      : "这张图值不值、堵不堵、坑不坑，直接说。";
    if (els.attractionCommunityTextarea) {
      if (els.attractionCommunityTextarea.value !== state.attractionComposerText) {
        els.attractionCommunityTextarea.value = state.attractionComposerText;
      }
      els.attractionCommunityTextarea.placeholder = composerPlaceholder;
    }
    if (els.attractionCommunityImagePreview) {
      els.attractionCommunityImagePreview.innerHTML = state.attractionComposerImages
        .map((image) => `
          <div class="attraction-community-image-chip">
            <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.name || "待发布图片")}" loading="lazy" />
            <button type="button" data-remove-community-image="${escapeHtml(image.id)}">×</button>
          </div>
        `)
        .join("");
    }
  }

  return {
    renderAttractionCommunity,
  };
}
