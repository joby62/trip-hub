import { formatCompactCount, renderSocialIcon } from "../utils/attraction-community.js";
import { escapeHtml, trimText } from "../utils/text.js";

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

export function createAttractionCommunityOverlay({
  els,
  state,
  selectors,
  getAttractionCommunitySnapshot,
}) {
  function renderAttractionCommunity() {
    if (!els.attractionCommunityShell) return;

    const attraction = selectors.getAttractionById(state.attractionId);
    if (!state.attractionCommunityOpen || !attraction) {
      els.attractionCommunityShell.hidden = true;
      return;
    }

    const snapshot = getAttractionCommunitySnapshot(attraction);
    const cover = selectors.getAttractionCover(attraction);
    const relatedDays = attraction.day_ids
      .map((dayId) => selectors.getDayById(dayId)?.day)
      .filter(Boolean)
      .join(" · ");

    els.attractionCommunityShell.hidden = false;
    els.attractionCommunityTitle.textContent = attraction.title;
    els.attractionCommunityHero.innerHTML = `
      <article class="attraction-community-hero__media">
        <img src="${escapeHtml(cover?.src || snapshot.galleryImages[0]?.src || "")}" alt="${escapeHtml(attraction.title)}" loading="eager" />
        <div class="attraction-community-hero__wash" aria-hidden="true"></div>
        <div class="attraction-community-hero__copy">
          <div class="attraction-community-hero__meta">
            <span>${escapeHtml(attraction.region)}</span>
            ${relatedDays ? `<span>${escapeHtml(relatedDays)}</span>` : ""}
          </div>
          <h3>${escapeHtml(attraction.title)}</h3>
          <p>${escapeHtml(trimText(snapshot.caption || attraction.summary, 70))}</p>
        </div>
      </article>
    `;

    els.attractionCommunityActions.innerHTML = `
      <div class="attraction-community-actions__grid">
        <button class="attraction-community-action ${snapshot.reactionState.liked ? "is-active" : ""}" type="button" data-attraction-like="${escapeHtml(attraction.id)}">
          ${renderSocialIcon("like", snapshot.reactionState.liked)}
          <span>${escapeHtml(formatCompactCount(snapshot.counts.likes))}</span>
        </button>
        <button class="attraction-community-action" type="button" data-open-community-composer>
          ${renderSocialIcon("comment")}
          <span>${escapeHtml(formatCompactCount(snapshot.counts.comments))}</span>
        </button>
        <button class="attraction-community-action ${snapshot.reactionState.saved ? "is-active" : ""}" type="button" data-attraction-save="${escapeHtml(attraction.id)}">
          ${renderSocialIcon("save", snapshot.reactionState.saved)}
          <span>${escapeHtml(formatCompactCount(snapshot.counts.saves))}</span>
        </button>
      </div>
    `;

    els.attractionCommunityGallery.innerHTML = snapshot.galleryImages.length
      ? `
        <div class="attraction-community-comments-head__row">
          <h3>现场图</h3>
          <p>${escapeHtml(`${snapshot.galleryImages.length} 张`)}</p>
        </div>
        <div class="attraction-community-gallery__track">
          ${snapshot.galleryImages
            .map((image) => `
              <button
                class="attraction-community-gallery__item"
                type="button"
                ${image.dayId && image.sequence ? `data-community-guide-image-day="${escapeHtml(image.dayId)}" data-community-guide-image-seq="${image.sequence}"` : ""}
              >
                <img src="${escapeHtml(image.src)}" alt="${escapeHtml(attraction.title)}" loading="lazy" />
                <span class="attraction-community-gallery__badge">${escapeHtml(image.source === "comment" ? "评论图" : "攻略图")}</span>
              </button>
            `)
            .join("")}
        </div>
      `
      : "";

    els.attractionCommunityCommentsHead.innerHTML = `
      <div class="attraction-community-comments-head__row">
        <h3>最新评论</h3>
        <p>${escapeHtml(`${snapshot.counts.comments} 条`)}</p>
      </div>
      <p>只保留最直观的点赞、收藏、评论。想补图，直接在评论里发。</p>
    `;

    els.attractionCommunityComments.innerHTML = snapshot.comments.length
      ? snapshot.comments
          .map((comment) => `
            <article class="attraction-community-comment">
              <div class="attraction-community-comment__head">
                <div class="attraction-community-comment__avatar">${escapeHtml(comment.author.slice(0, 1) || "游")}</div>
                <div class="attraction-community-comment__meta">
                  <strong>${escapeHtml(comment.author)}</strong>
                  <span>${escapeHtml(comment.createdAtLabel || "刚刚")}</span>
                </div>
              </div>
              <p class="attraction-community-comment__body">${escapeHtml(comment.body)}</p>
              ${renderCommentImages(comment.images)}
              <div class="attraction-community-comment__foot">
                <span>${escapeHtml(comment.author === "我" ? "我的评论" : "同行实拍")}</span>
                <span>${escapeHtml(`${comment.likes || 0} 个赞`)}</span>
              </div>
            </article>
          `)
          .join("")
      : `<div class="empty-state">还没有评论，做第一个留下现场感受的人。</div>`;

    if (els.attractionCommunityComposeBar) {
      els.attractionCommunityComposeBar.hidden = state.attractionComposerOpen;
    }
    if (els.attractionCommunityComposer) {
      els.attractionCommunityComposer.hidden = !state.attractionComposerOpen;
    }
    if (els.attractionCommunityTextarea && els.attractionCommunityTextarea.value !== state.attractionComposerText) {
      els.attractionCommunityTextarea.value = state.attractionComposerText;
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
