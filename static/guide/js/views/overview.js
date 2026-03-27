import { AMAP_TEST_SCENARIOS } from "../config.js";
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

  function renderOverviewFacts() {
    const stats = sourceStore.stats;
    const routeStops = sourceStore.trip?.routeStops || [];
    const facts = [
      { label: "行程长度", value: "11 天", detail: "昆明 → 丽江闭环" },
      { label: "路线跨度", value: `${routeStops.length} 站`, detail: routeStops.join(" · ") },
      { label: "高原起点", value: "Day 7", detail: "纳帕海与独克宗起步" },
      {
        label: "素材归档",
        value: stats ? `${stats.image_count} 图` : "48 图",
        detail: stats ? `${stats.paragraph_count} 段原文` : "原文已接入",
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
    els.amapTestGrid.innerHTML = AMAP_TEST_SCENARIOS
      .map(
        (scenario) => `
          <article class="tool-card amap-test-card">
            <p class="eyebrow">Amap Test</p>
            <h3>${escapeHtml(scenario.title)}</h3>
            <p class="amap-test-card__route">${escapeHtml(scenario.summary)}</p>
            <p>${escapeHtml(scenario.body)}</p>
            <div class="tool-card__meta">
              ${scenario.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
            </div>
            <p class="amap-test-card__hint">${escapeHtml(scenario.hint)}</p>
            <div class="tool-card__actions">
              <button type="button" data-amap-test="${escapeHtml(scenario.id)}">
                ${escapeHtml(scenario.actionLabel)}
              </button>
            </div>
          </article>
        `,
      )
      .join("");
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
    const items = selectors.getPitfallItems();
    els.pitfallList.innerHTML = items.length
      ? items
          .map(
            (item) => `
              <button class="pitfall-chip" type="button" data-open-day="${escapeHtml(item.dayId)}" data-open-tab="source">
                <strong>${escapeHtml(`${item.category} · ${item.title}`)}</strong>
                <span>${escapeHtml(trimText(item.quote, 104))}</span>
              </button>
            `,
          )
          .join("")
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
