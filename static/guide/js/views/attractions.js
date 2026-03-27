import { escapeHtml } from "../utils/text.js";

export function createAttractionsView({
  els,
  sourceStore,
  selectors,
  getAttractionCommunitySnapshot,
}) {
  function parseStoryRatio(value) {
    const [widthRaw, heightRaw] = String(value || "")
      .split("/")
      .map((part) => Number.parseFloat(part.trim()));
    if (!widthRaw || !heightRaw) return 1.35;
    return heightRaw / widthRaw;
  }

  function estimateCardWeight(day, snapshot) {
    const textLength = (day.title || "").length + (snapshot.caption || day.summary || "").length;
    return parseStoryRatio(snapshot.storyRatio) + Math.min(textLength / 180, 0.9);
  }

  function renderStoryCard(day, snapshot) {
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
  }

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

    const columns = [[], []];
    const columnWeights = [0, 0];

    storyDays.forEach((day) => {
      const snapshot = getAttractionCommunitySnapshot(day);
      const targetColumn = columnWeights[0] <= columnWeights[1] ? 0 : 1;
      columns[targetColumn].push(renderStoryCard(day, snapshot));
      columnWeights[targetColumn] += estimateCardWeight(day, snapshot);
    });

    els.featuredGallery.innerHTML = columns
      .map((cards) => `
        <div class="featured-gallery__column">
          ${cards.join("")}
        </div>
      `)
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
