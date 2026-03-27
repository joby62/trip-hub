import { escapeHtml, trimText } from "../utils/text.js";

export function createOverviewView({
  els,
  state,
  sourceStore,
  selectors,
  syncScrollableSelection,
}) {
  function renderRouteStrip() {
    const routeSpine = selectors.getTripEditorial().routeSpine || [];
    els.routeStrip.innerHTML = routeSpine
      .map(
        (stop, index) => `
          <article class="route-stop">
            <span class="route-stop__index">${index + 1}</span>
            <strong class="route-stop__name">${escapeHtml(stop.name)}</strong>
            <span class="route-stop__note">${escapeHtml(stop.note)}</span>
          </article>
        `,
      )
      .join("");
  }

  function renderHeroHighlights() {
    const heroHighlightCards = selectors.getTripEditorial().heroHighlightCards || [];
    els.heroHighlights.innerHTML = heroHighlightCards
      .map(
        (card) => `
          <article class="hero-highlight-card">
            <p class="eyebrow">${escapeHtml(card.eyebrow)}</p>
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.body)}</p>
          </article>
        `,
      )
      .join("");
  }

  function countPitfalls(category) {
    const templates = selectors.getTripEditorial().pitfallTemplates || [];
    return templates.filter((item) => item.category === category).length;
  }

  function renderOverviewFacts() {
    const dayCount = sourceStore.dayOrder.length || Object.keys(sourceStore.byDayId).length;
    const totalPitfalls = (selectors.getTripEditorial().pitfallTemplates || []).length;
    const facts = [
      { label: "必须先处理", value: `${countPitfalls("必须先处理")} 件`, detail: "高铁 / 订房 / 抢票 / 证件" },
      { label: "收费别交", value: `${countPitfalls("收费别交")} 处`, detail: "楼顶 / 景区 / 扶梯 / 观光车" },
      { label: "高原提醒", value: `${countPitfalls("高原提醒")} 条`, detail: "Day 7 起别再硬排满" },
      {
        label: "全文避坑",
        value: `${totalPitfalls} 条`,
        detail: `覆盖 ${dayCount} 天原文`,
      },
    ];

    els.overviewFacts.innerHTML = facts
      .map(
        (fact) => `
          <article class="trip-fact-card">
            <p class="trip-fact-card__label">${escapeHtml(fact.label)}</p>
            <strong class="trip-fact-card__value">${escapeHtml(fact.value)}</strong>
            <span class="trip-fact-card__detail">${escapeHtml(fact.detail)}</span>
          </article>
        `,
      )
      .join("");
  }

  function renderHeroMedia() {
    if (!els.heroImage) return;
    const preferred = selectors.getMediaBySequence(45)
      || selectors.getMediaBySequence(40)
      || selectors.getMediaBySequence(20);
    if (!preferred?.src) return;
    els.heroImage.src = preferred.src;
  }

  function renderOverviewTools() {
    const overviewCards = selectors.getTripEditorial().overviewCards || [];
    els.overviewTools.innerHTML = overviewCards
      .map(
        (card) => `
          <article class="overview-card">
            <p class="eyebrow">${escapeHtml(card.eyebrow)}</p>
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.body)}</p>
            <button class="overview-card__action" type="button" data-scroll-target="${escapeHtml(card.target)}">
              ${escapeHtml(card.action)}
            </button>
          </article>
        `,
      )
      .join("");
  }

  function renderAmapTests() {
    if (!els.amapTestGrid) return;
    const bookingToolCards = selectors.getTripEditorial().bookingToolCards || [];
    const globalNotes = selectors.getTripEditorial().globalNotes || [];
    const riskNotes = selectors.getTripEditorial().riskNotes || [];

    els.amapTestGrid.innerHTML = `
      <div class="pitfall-guide-stack">
        <div class="tool-card-grid pitfall-critical-grid">
          ${bookingToolCards
            .map(
              (card) => `
                <article class="tool-card guide-callout-card">
                  <p class="eyebrow">必须先处理</p>
                  <h3>${escapeHtml(card.title)}</h3>
                  <p>${escapeHtml(card.body)}</p>
                  <div class="tool-card__meta">
                    ${(card.meta || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
        <div class="note-grid pitfall-note-grid">
          ${globalNotes
            .map(
              (note) => `
                <article class="note-card pitfall-note-card">
                  <h3>${escapeHtml(note.title)}</h3>
                  <p>${escapeHtml(note.body)}</p>
                </article>
              `,
            )
            .join("")}
        </div>
        <div class="pitfall-risk-strip">
          ${riskNotes
            .map((note) => `<article class="pitfall-risk-item"><p>${escapeHtml(note)}</p></article>`)
            .join("")}
        </div>
      </div>
    `;
  }

  function renderPhaseFilters() {
    if (!els.phaseFilter) return;
    const phaseOptions = selectors.getTripEditorial().phaseOptions || [];
    els.phaseFilter.innerHTML = phaseOptions
      .map(
        (phase) => {
          const isActive = phase.id === state.phase;
          return `
            <button
              class="menu-option ${isActive ? "is-active" : ""}"
              type="button"
              data-phase="${escapeHtml(phase.id)}"
            >
              <span class="menu-option__check" aria-hidden="true">${isActive ? "✓" : ""}</span>
              <span class="menu-option__copy">
                <strong>${escapeHtml(phase.label)}</strong>
                <span>${escapeHtml(phase.hint)}</span>
              </span>
            </button>
          `;
        },
      )
      .join("");
  }

  function renderPitfallFilters() {
    const pitfallCategories = selectors.getTripEditorial().pitfallCategories || [];
    if (!pitfallCategories.includes(state.pitfallCategory)) {
      state.pitfallCategory = "all";
    }
    els.pitfallFilters.innerHTML = pitfallCategories
      .map((category) => {
        const label = category === "all" ? "全部坑位" : category;
        return `
          <button
            class="pitfall-filter ${category === state.pitfallCategory ? "is-active" : ""}"
            type="button"
            data-pitfall-category="${escapeHtml(category)}"
          >
            ${escapeHtml(label)}
          </button>
        `;
      })
      .join("");
    syncScrollableSelection(els.pitfallFilters);
  }

  function renderPitfalls() {
    const pitfallCategories = selectors.getTripEditorial().pitfallCategories || [];
    if (!pitfallCategories.includes(state.pitfallCategory)) {
      state.pitfallCategory = "all";
    }
    const items = selectors.getPitfallItems();
    els.pitfallList.innerHTML = items.length
      ? `
          <div class="pitfall-card-grid">
            ${items
              .map((item) => {
                const day = selectors.getDayById(item.dayId);
                const dayLabel = day ? `${day.day} · ${day.city}` : item.dayId;
                const quote = trimText(item.quote || item.fallback || "", 128);
                const takeaway = item.takeaway || trimText(item.quote || item.fallback || "", 72);
                return `
                  <article class="pitfall-card">
                    <div class="pitfall-card__meta">
                      <span class="pitfall-card__category">${escapeHtml(item.category)}</span>
                      <span>${escapeHtml(dayLabel)}</span>
                    </div>
                    <h3>${escapeHtml(item.title)}</h3>
                    <p class="pitfall-card__takeaway">${escapeHtml(takeaway)}</p>
                    <p class="pitfall-card__quote">${escapeHtml(`原文：${quote}`)}</p>
                    <button
                      class="pitfall-card__action"
                      type="button"
                      data-open-day="${escapeHtml(item.dayId)}"
                      data-open-tab="${escapeHtml(item.openTab || "source")}"
                    >
                      打开原文
                    </button>
                  </article>
                `;
              })
              .join("")}
          </div>
        `
      : `<div class="empty-state">这个分类下暂时没有坑位提醒。</div>`;
  }

  return {
    renderHeroHighlights,
    renderHeroMedia,
    renderOverviewFacts,
    renderAmapTests,
    renderOverviewTools,
    renderPhaseFilters,
    renderPitfallFilters,
    renderPitfalls,
    renderRouteStrip,
  };
}
