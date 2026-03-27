import {
  formatCompactCount,
  renderSocialIcon,
} from "../utils/attraction-community.js";
import { renderDayRailItems } from "../utils/day-rail.js";
import { escapeHtml } from "../utils/text.js";

export function createAttractionsView({
  els,
  state,
  sourceStore,
  selectors,
  getAttractionCommunitySnapshot,
  syncScrollableSelection,
}) {
  function getAttractionDayFilter(days) {
    const validDayIds = new Set(days.map((day) => day.id));
    if (state.attractionDayFilter !== "all" && !validDayIds.has(state.attractionDayFilter)) {
      state.attractionDayFilter = "all";
    }
    return state.attractionDayFilter;
  }

  function getFocusedAttractionDays(days) {
    const activeFilter = getAttractionDayFilter(days);
    return {
      activeFilter,
      scopedDays: activeFilter === "all"
        ? days
        : days.filter((day) => day.id === activeFilter),
    };
  }

  function renderAttractionDateRail(days) {
    if (!els.attractionDateRail) return;
    if (!days.length) {
      els.attractionDateRail.innerHTML = `<div class="empty-state">当前阶段没有可切换的日期。</div>`;
      return;
    }

    const activeFilter = getAttractionDayFilter(days);
    const allActiveClass = activeFilter === "all" ? "is-active" : "";
    els.attractionDateRail.innerHTML = `
      <button class="date-rail__item date-rail__item--all ${allActiveClass}" type="button" data-attraction-day-filter="all">
        <span class="date-rail__all-kicker">景点</span>
        <strong class="date-rail__all-title">全部</strong>
        <span class="date-rail__all-note">全部景点</span>
      </button>
      ${renderDayRailItems(days, activeFilter === "all" ? "" : activeFilter, "data-attraction-day-filter")}
    `;
    syncScrollableSelection(els.attractionDateRail, ".date-rail__item.is-active");
  }

  function renderFeaturedGallery(days) {
    const { scopedDays } = getFocusedAttractionDays(days);

    if (!days.length) {
      els.featuredGallery.innerHTML = `<div class="empty-state">当前阶段没有可展示的景点内容。</div>`;
      if (els.attractionFocus) {
        els.attractionFocus.innerHTML = "";
      }
      return;
    }

    if (!sourceStore.ready || !sourceStore.attractionOrder.length) {
      els.featuredGallery.innerHTML = `<div class="empty-state">景点内容还在整理中，稍后刷新试试。</div>`;
      if (els.attractionFocus) {
        els.attractionFocus.innerHTML = "";
      }
      return;
    }

    const attractions = selectors.getVisibleAttractionPool(scopedDays);
    if (!attractions.length) {
      els.featuredGallery.innerHTML = `<div class="empty-state">这个日期筛选下还没有景点内容。</div>`;
      if (els.attractionFocus) {
        els.attractionFocus.innerHTML = "";
      }
      return;
    }

    els.featuredGallery.innerHTML = attractions
      .map((attraction) => {
        const cover = selectors.getAttractionCover(attraction);
        const snapshot = getAttractionCommunitySnapshot(attraction);
        const dayLabels = attraction.day_ids
          .map((dayId) => selectors.getDayById(dayId)?.day)
          .filter(Boolean)
          .join(" · ");

        return `
          <article class="gallery-card attraction-story">
            <button
              class="attraction-story__frame"
              type="button"
              data-open-attraction="${escapeHtml(attraction.id)}"
            >
              <div class="gallery-card__media attraction-story__media" style="--story-aspect: ${snapshot.storyRatio};">
                <img src="${escapeHtml(cover?.src || "")}" alt="${escapeHtml(attraction.title)}" loading="lazy" />
                <div class="attraction-story__scrim" aria-hidden="true"></div>
                <div class="attraction-story__headline">
                  <div class="attraction-story__meta">
                    <span>${escapeHtml(attraction.region)}</span>
                    ${dayLabels ? `<span>${escapeHtml(dayLabels)}</span>` : ""}
                  </div>
                  <h3>${escapeHtml(attraction.title)}</h3>
                </div>
              </div>
              <div class="gallery-card__copy attraction-story__copy">
                <p class="gallery-card__text attraction-story__caption">${escapeHtml(snapshot.caption)}</p>
              </div>
            </button>

            <div class="attraction-story__actions">
              <button
                class="attraction-story__action ${snapshot.reactionState.liked ? "is-active" : ""}"
                type="button"
                data-attraction-like="${escapeHtml(attraction.id)}"
              >
                ${renderSocialIcon("like", snapshot.reactionState.liked)}
                <span>${escapeHtml(formatCompactCount(snapshot.counts.likes))}</span>
              </button>
              <button
                class="attraction-story__action"
                type="button"
                data-open-attraction-comments="${escapeHtml(attraction.id)}"
              >
                ${renderSocialIcon("comment")}
                <span>${escapeHtml(formatCompactCount(snapshot.counts.comments))}</span>
              </button>
              <button
                class="attraction-story__action ${snapshot.reactionState.saved ? "is-active" : ""}"
                type="button"
                data-attraction-save="${escapeHtml(attraction.id)}"
              >
                ${renderSocialIcon("save", snapshot.reactionState.saved)}
                <span>${escapeHtml(formatCompactCount(snapshot.counts.saves))}</span>
              </button>
            </div>
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
