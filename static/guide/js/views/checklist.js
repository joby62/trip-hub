import { escapeHtml } from "../utils/text.js";

export function createChecklistView({
  els,
  state,
  selectors,
  syncScrollableSelection,
}) {
  function getPackingGroups() {
    return selectors.getTripEditorial().packingGroups || [];
  }

  function getPackingProgress() {
    const packingGroups = getPackingGroups();
    const totalItems = packingGroups.reduce((sum, group) => sum + group.items.length, 0);
    const doneItems = Object.values(state.packing).filter(Boolean).length;
    return { doneItems, totalItems };
  }

  function renderBookingTools() {
    const bookingToolCards = selectors.getTripEditorial().bookingToolCards || [];
    els.bookingTools.innerHTML = bookingToolCards
      .map(
        (card) => `
          <article class="tool-card">
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.body)}</p>
            <div class="tool-card__meta">
              ${card.meta.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
            </div>
            <div class="tool-card__actions">
              ${card.actions
                .map(
                  (action) => `
                    <button
                      type="button"
                      data-tool-kind="${escapeHtml(action.kind)}"
                      data-tool-target="${escapeHtml(action.target || "")}"
                      data-tool-day="${escapeHtml(action.dayId || "")}"
                      data-tool-tab="${escapeHtml(action.tab || "")}"
                      data-tool-phase="${escapeHtml(action.phase || "")}"
                      data-tool-category="${escapeHtml(action.category || "")}"
                    >
                      ${escapeHtml(action.label)}
                    </button>
                  `,
                )
                .join("")}
            </div>
          </article>
        `,
      )
      .join("");
    syncScrollableSelection(els.dateRail, ".date-rail__item.is-active");
  }

  function renderBooking() {
    const bookingTimeline = selectors.getTripEditorial().bookingTimeline || [];
    els.bookingList.innerHTML = bookingTimeline
      .map(
        (item) => `
          <article class="timeline-item">
            <div class="timeline-item__dot">${escapeHtml(item.step)}</div>
            <div class="timeline-item__body">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.detail)}</p>
            </div>
          </article>
        `,
      )
      .join("");
  }

  function renderGlobalNotes() {
    const globalNotes = selectors.getTripEditorial().globalNotes || [];
    els.globalNotes.innerHTML = globalNotes
      .map(
        (note) => `
          <article class="note-card">
            <h3>${escapeHtml(note.title)}</h3>
            <p>${escapeHtml(note.body)}</p>
          </article>
        `,
      )
      .join("");
  }

  function renderPackingActions() {
    els.packingActions.innerHTML = `
      <button type="button" data-pack-action="expand">全部展开</button>
      <button type="button" data-pack-action="collapse">全部收起</button>
      <button type="button" data-pack-action="reset">清空全部</button>
    `;
  }

  function renderPackingFloatingProgress() {
    if (!els.packingFloatingProgress) return;

    const { doneItems, totalItems } = getPackingProgress();
    const shouldShow = state.currentView === "checklist";
    els.packingFloatingProgress.hidden = !shouldShow;
    if (!shouldShow) return;

    els.packingFloatingProgress.textContent = `打包进度 ${doneItems}/${totalItems}`;
  }

  function renderPacking() {
    const packingGroups = getPackingGroups();
    renderPackingActions();
    renderPackingFloatingProgress();
    els.packingList.innerHTML = packingGroups
      .map((group) => {
        const completeCount = group.items.filter((_, index) => state.packing[`${group.id}-${index}`]).length;
        const isOpen = state.packingOpenGroups[group.id] !== false;

        return `
          <section class="packing-card ${isOpen ? "" : "is-collapsed"}">
            <div class="packing-card__head">
              <h3>${escapeHtml(group.title)}</h3>
              <button type="button" data-toggle-pack-group="${escapeHtml(group.id)}">${isOpen ? "收起" : "展开"}</button>
            </div>
            <p class="packing-summary">已勾选 ${completeCount} / ${group.items.length}</p>
            <div class="packing-card__items">
              ${group.items
                .map((item, index) => {
                  const key = `${group.id}-${index}`;
                  const checked = Boolean(state.packing[key]);
                  return `
                    <div class="packing-item">
                      <input id="${escapeHtml(key)}" type="checkbox" data-pack-key="${escapeHtml(key)}" ${checked ? "checked" : ""} />
                      <label for="${escapeHtml(key)}">
                        <span class="packing-item__box">✓</span>
                        <span class="packing-item__text">${escapeHtml(item)}</span>
                      </label>
                    </div>
                  `;
                })
                .join("")}
            </div>
          </section>
        `;
      })
      .join("");
  }

  return {
    getPackingProgress,
    renderBooking,
    renderBookingTools,
    renderGlobalNotes,
    renderPacking,
    renderPackingActions,
    renderPackingFloatingProgress,
  };
}
