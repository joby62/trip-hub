import { escapeHtml, trimText } from "../utils/text.js";

export function createOverviewView({
  els,
  state,
  sourceStore,
  selectors,
  syncScrollableSelection,
}) {
  function renderRouteStrip() {}

  function renderHeroHighlights() {
    if (!els.heroHighlights) return;
    const introSteps = [
      {
        eyebrow: "01",
        title: "全文避坑",
        body: "先把所有坑按分类筛一遍，优先抓会影响实际体验的点。",
      },
      {
        eyebrow: "02",
        title: "注意事项 / 关键决定",
        body: "再看高原、路况、吃住和补给逻辑，不要到了现场再临时判断。",
      },
      {
        eyebrow: "03",
        title: "需要留意的 4 件事",
        body: "最后记住最关键的 4 个提醒，再回头按天看细节。",
      },
    ];
    els.heroHighlights.innerHTML = introSteps
      .map(
        (card) => `
          <article class="hero-highlight-card pitfall-intro__step">
            <p class="eyebrow">${escapeHtml(card.eyebrow)}</p>
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.body)}</p>
          </article>
        `,
      )
      .join("");
  }

  function renderOverviewFacts() {}

  function renderHeroMedia() {
    if (!els.heroImage) return;
  }

  function renderOverviewTools() {
    if (!els.overviewTools) return;
    const overviewCards = selectors.getTripEditorial().overviewCards || [];
    els.overviewTools.innerHTML = overviewCards
      .map(
        (card, index) => `
          <article class="overview-card notice-card">
            <div class="notice-card__head">
              <span class="notice-card__index">${escapeHtml(String(index + 1).padStart(2, "0"))}</span>
              <p class="eyebrow">${escapeHtml(card.eyebrow)}</p>
            </div>
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.body)}</p>
          </article>
        `,
      )
      .join("");
  }

  function renderAmapTests() {
    if (!els.amapTestGrid) return;
    const globalNotes = selectors.getTripEditorial().globalNotes || [];

    els.amapTestGrid.innerHTML = `<div class="note-grid attention-note-list">
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
    </div>`;
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
    if (!els.pitfallFilters) return;
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
    if (!els.pitfallList) return;
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
