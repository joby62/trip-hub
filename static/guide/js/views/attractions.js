import { escapeHtml } from "../utils/text.js";

export function createAttractionsView({
  els,
  sourceStore,
  selectors,
  getAttractionCommunitySnapshot,
}) {
  function renderAttractionDateRail(days) {
    void days;
  }

  function renderFeaturedGallery(days) {
    if (!days.length) {
      els.featuredGallery.innerHTML = `<div class="empty-state">当前阶段还没有可展示的景点笔记。</div>`;
      if (els.attractionFocus) {
        els.attractionFocus.innerHTML = "";
      }
      return;
    }

    if (!sourceStore.ready) {
      els.featuredGallery.innerHTML = `<div class="empty-state">景点内容还在整理中，稍后刷新试试。</div>`;
      if (els.attractionFocus) {
        els.attractionFocus.innerHTML = "";
      }
      return;
    }

    const storyDays = days.filter((day) => selectors.getDayImageItems(day.id).length);
    if (!storyDays.length) {
      els.featuredGallery.innerHTML = `<div class="empty-state">当前阶段还没有景点内容。</div>`;
      if (els.attractionFocus) {
        els.attractionFocus.innerHTML = "";
      }
      return;
    }

    els.featuredGallery.innerHTML = storyDays
      .map((day) => {
        const snapshot = getAttractionCommunitySnapshot(day);
        const cover = snapshot.images[0];
        const meta = [day.day, day.date, `${snapshot.images.length} 图`].filter(Boolean).join(" · ");

        return `
          <article class="gallery-card note-feed-card">
            <button
              class="note-feed-card__frame"
              type="button"
              data-open-attraction-story="${escapeHtml(day.id)}"
            >
              <div class="gallery-card__media note-feed-card__media" style="--story-aspect: ${snapshot.storyRatio};">
                <img src="${escapeHtml(cover?.src || "")}" alt="${escapeHtml(day.title)}" loading="lazy" />
                <div class="note-feed-card__wash" aria-hidden="true"></div>
                <div class="note-feed-card__meta">
                  <span>${escapeHtml(meta)}</span>
                </div>
              </div>
              <div class="gallery-card__copy note-feed-card__copy">
                <p class="note-feed-card__eyebrow">${escapeHtml(day.city)}</p>
                <h3>${escapeHtml(day.title)}</h3>
                <p class="gallery-card__text note-feed-card__summary">${escapeHtml(snapshot.caption || day.summary || "")}</p>
              </div>
            </button>
          </article>
        `;
      })
      .join("");

    if (els.attractionFocus) {
      els.attractionFocus.innerHTML = "";
    }
  }

  return {
    renderAttractionDateRail,
    renderFeaturedGallery,
  };
}
