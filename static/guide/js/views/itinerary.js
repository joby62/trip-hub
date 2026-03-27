import { escapeHtml, normalizeComparableText, uniqueBy } from "../utils/text.js";

export function createItineraryView({ els, selectors, buildList }) {
  function getDateParts(dateText) {
    const [month = "", date = ""] = String(dateText || "").split(".");
    return {
      monthLabel: month ? `${month}月` : String(dateText || ""),
      dateLabel: date || String(dateText || ""),
    };
  }

  function renderDateRail(days) {
    const activeDay = selectors.ensureFocusedItineraryDay(days);
    if (!days.length) {
      els.dateRail.innerHTML = `<div class="empty-state">当前阶段没有可切换的日期。</div>`;
      return;
    }

    els.dateRail.innerHTML = days
      .map((day) => {
        const isActive = activeDay?.id === day.id;
        const { monthLabel, dateLabel } = getDateParts(day.date);
        return `
          <button
            class="date-rail__item ${isActive ? "is-active" : ""}"
            type="button"
            data-focus-day="${escapeHtml(day.id)}"
          >
            <span class="date-rail__month">${escapeHtml(monthLabel)}</span>
            <strong class="date-rail__date">${escapeHtml(dateLabel)}</strong>
            <span class="date-rail__day">${escapeHtml(day.day)}</span>
            <span class="date-rail__city">${escapeHtml(day.city)}</span>
          </button>
        `;
      })
      .join("");
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
    const pitfallEntries = selectors.getDayPitfallEntries(day.id);
    const summaryNotes = uniqueBy(
      [
        ...day.tips,
        ...pitfallEntries.map((entry) => `${entry.category} · ${entry.title}`),
      ],
      (item) => normalizeComparableText(item),
    ).slice(0, 4);

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

        <section class="chapter-brief">
          <div class="section-head section-head-compact">
            <div>
              <p class="eyebrow">Brief</p>
              <h2>简况</h2>
            </div>
          </div>
          <div class="chapter-summary-grid">
            <section class="chapter-panel">
              <p class="eyebrow">Route</p>
              <h4>今天怎么走</h4>
              <p>${escapeHtml(day.route)}</p>
            </section>
            <section class="chapter-panel">
              <p class="eyebrow">Logistics</p>
              <h4>交通与节奏</h4>
              <p>${escapeHtml(day.logistics)}</p>
            </section>
            <section class="chapter-panel">
              <p class="eyebrow">Highlights</p>
              <h4>值得留下来的点</h4>
              ${buildList(day.highlights)}
            </section>
            <section class="chapter-panel">
              <p class="eyebrow">Food & Stay</p>
              <h4>吃住安排</h4>
              ${buildList([...day.food.slice(0, 2), day.stay])}
            </section>
            <section class="chapter-panel">
              <p class="eyebrow">Notes</p>
              <h4>提醒</h4>
              ${buildList(summaryNotes.length ? summaryNotes : day.tips)}
            </section>
          </div>
        </section>

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
