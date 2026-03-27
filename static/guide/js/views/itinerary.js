import { escapeHtml } from "../utils/text.js";
import { getAmapDayRouteGuide } from "../data/amap-routes.js";
import { buildInlineRouteUrl } from "../utils/day-route.js";
import { renderDayRailItems } from "../utils/day-rail.js";

export function createItineraryView({ els, selectors }) {
  function renderDateRail(days) {
    const activeDay = selectors.ensureFocusedItineraryDay(days);
    if (!days.length) {
      els.dateRail.innerHTML = `<div class="empty-state">当前阶段没有可切换的日期。</div>`;
      return;
    }

    els.dateRail.innerHTML = renderDayRailItems(days, activeDay?.id);
  }

  function renderRouteBrief(day) {
    const guide = getAmapDayRouteGuide(day.id);
    const overviewUrl = guide?.overview?.destination
      ? buildInlineRouteUrl({
        start: guide.overview.start,
        viaPoints: guide.overview.via || [],
        destination: guide.overview.destination,
        travelType: "0",
      })
      : "";
    const routeLabel = guide?.overview?.routeLabel || day.route;
    const routeBody = guide?.overview?.body || day.logistics;
    const routeTail = guide?.overview?.tail || "";
    const stops = (guide?.stops || [])
      .filter((stop) => stop.place?.name)
      .map((stop, index) => ({
        ...stop,
        index,
        routeUrl: buildInlineRouteUrl({
          destination: stop.place,
          travelType: stop.modeMeta.id,
        }),
      }));

    return `
      <section class="chapter-brief">
        <div class="section-head section-head-compact">
          <div>
            <p class="eyebrow">Brief</p>
            <h2>简况</h2>
          </div>
          <p class="section-note chapter-brief__note">这里只放今天主线和逐点高德入口，细节再进详情页。</p>
        </div>
        <div class="chapter-route-brief">
          <article class="chapter-route-brief__overview">
            <p class="eyebrow">Route</p>
            <h4>今天路线</h4>
            <p class="chapter-route-brief__route">${escapeHtml(routeLabel)}</p>
            <p class="chapter-route-brief__body">${escapeHtml(routeBody)}</p>
            ${routeTail ? `<p class="chapter-route-brief__tail">${escapeHtml(routeTail)}</p>` : ""}
            ${overviewUrl
              ? `<a class="chapter-route-brief__cta" href="${escapeHtml(overviewUrl)}" data-amap-route="true" aria-label="${escapeHtml(`高德查看 ${day.day} 主线`)}">高德看主线</a>`
              : ""}
          </article>
          <article class="chapter-route-brief__stops">
            <div class="chapter-route-brief__stops-head">
              <div>
                <p class="eyebrow">Navigation</p>
                <h4>逐点导航</h4>
              </div>
              <span>当前位置</span>
            </div>
            ${stops.length
              ? `
                <div class="chapter-route-stop-list">
                  ${stops
                    .map((stop) => `
                      <article class="chapter-route-stop">
                        <div class="chapter-route-stop__main">
                          <span class="chapter-route-stop__index">${escapeHtml(String(stop.index + 1).padStart(2, "0"))}</span>
                          <div class="chapter-route-stop__copy">
                            <div class="chapter-route-stop__title">
                              <h5>${escapeHtml(stop.place.title || stop.place.name)}</h5>
                              <span class="chapter-route-stop__mode">${escapeHtml(stop.modeMeta.shortLabel)}</span>
                            </div>
                            <p>${escapeHtml(stop.note || stop.modeMeta.tagline)}</p>
                          </div>
                        </div>
                        ${stop.routeUrl
                          ? `<a class="chapter-route-stop__action" href="${escapeHtml(stop.routeUrl)}" data-amap-route="true" aria-label="${escapeHtml(`高德前往 ${stop.place.title || stop.place.name}`)}">高德</a>`
                          : ""}
                      </article>
                    `)
                    .join("")}
                </div>
              `
              : `<p class="chapter-route-brief__empty">这一天暂时没有拆好的逐点入口，先用主线熟悉路线。</p>`}
          </article>
        </div>
      </section>
    `;
  }

  function renderItineraryChapter(days) {
    const day = selectors.ensureFocusedItineraryDay(days);
    if (!day) {
      els.daysContainer.innerHTML = `<div class="empty-state">这个阶段还没有可展开的章节。切回“全部日程”或换一个阶段试试。</div>`;
      return;
    }

    const enhancement = selectors.getDayEnhancement(day.id);
    const images = selectors.getDayImageItems(day.id);
    const [cover] = images;
    const dayIndex = days.findIndex((candidate) => candidate.id === day.id);
    const previousDay = dayIndex > 0 ? days[dayIndex - 1] : null;
    const nextDay = dayIndex < days.length - 1 ? days[dayIndex + 1] : null;

    els.daysContainer.innerHTML = `
      <article class="chapter-card" data-phase="${escapeHtml(day.phase)}">
        <div class="chapter-hero">
          <div class="chapter-hero__media">
            <img src="${escapeHtml(cover?.src || "")}" alt="${escapeHtml(day.title)}" loading="lazy" />
          </div>
          <div class="chapter-hero__copy">
            <div class="chapter-hero__topline">
              <span class="status-chip">${escapeHtml(day.day)}</span>
              <span class="status-chip">${escapeHtml(day.city)}</span>
            </div>
            <p class="hero-kicker">${escapeHtml(`${day.date} · ${day.phaseLabel}`)}</p>
            <h3>${escapeHtml(day.title)}</h3>
            <p class="chapter-hero__decision">${escapeHtml(enhancement.decision)}</p>
            <p class="chapter-hero__summary">${escapeHtml(day.summary)}</p>
            <div class="detail-badges">
              ${selectors.getDayTags(day).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
              <span>${escapeHtml(`${images.length} 张图文`)}</span>
            </div>
            <button class="chapter-detail-button" type="button" data-open-day="${escapeHtml(day.id)}" data-open-tab="route">
              查看详情
            </button>
          </div>
        </div>

        ${renderRouteBrief(day)}

        <div class="chapter-pagination">
          <button type="button" ${previousDay ? `data-focus-day="${escapeHtml(previousDay.id)}"` : "disabled"}>
            ${escapeHtml(previousDay ? `上一天 · ${previousDay.day}` : "已经是第一天")}
          </button>
          <button type="button" ${nextDay ? `data-focus-day="${escapeHtml(nextDay.id)}"` : "disabled"}>
            ${escapeHtml(nextDay ? `下一天 · ${nextDay.day}` : "已经是最后一天")}
          </button>
        </div>
      </article>
    `;
  }

  return {
    renderDateRail,
    renderItineraryChapter,
  };
}
