import { escapeHtml, escapeRegExp } from "./utils/text.js";

export function createRenderHelpers({ detailTabs, getAttractionLabel, getThemeLabel }) {
  function buildList(items) {
    return `<ul class="detail-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function renderMetaPills({ attractionIds = [], themeIds = [], limit = 4 } = {}) {
    const entries = [
      ...attractionIds
        .map((attractionId) => ({ kind: "attraction", label: getAttractionLabel(attractionId) }))
        .filter((item) => item.label),
      ...themeIds
        .map((themeId) => ({ kind: "theme", label: getThemeLabel(themeId) }))
        .filter((item) => item.label),
    ]
      .filter((item, index, array) =>
        array.findIndex((candidate) => candidate.kind === item.kind && candidate.label === item.label) === index,
      )
      .slice(0, limit);

    if (!entries.length) {
      return "";
    }

    return `
      <div class="meta-pills">
        ${entries
          .map(
            (entry) => `
              <span class="meta-pill" data-kind="${escapeHtml(entry.kind)}">${escapeHtml(entry.label)}</span>
            `,
          )
          .join("")}
      </div>
    `;
  }

  function renderDetailNoteCards(items, fallbackText = "") {
    if (!items.length) {
      return fallbackText ? `<p>${escapeHtml(fallbackText)}</p>` : `<p class="chapter-panel__empty">当前没有补充内容。</p>`;
    }

    return `
      <div class="detail-note-stack">
        ${items
          .map(
            (item) => `
              <article class="detail-note-card">
                <p>${escapeHtml(item)}</p>
              </article>
            `,
          )
          .join("")}
      </div>
    `;
  }

  function getSearchResultTags(result) {
    return [
      result.typeLabel || "",
      ...(result.tags || []),
    ].filter(Boolean);
  }

  function highlightMatch(text, query) {
    const safeText = String(text || "");
    const safeQuery = String(query || "").trim();

    if (!safeQuery) {
      return escapeHtml(safeText);
    }

    const matcher = new RegExp(escapeRegExp(safeQuery), "ig");
    let cursor = 0;
    let result = "";

    for (const match of safeText.matchAll(matcher)) {
      const index = match.index ?? 0;
      result += escapeHtml(safeText.slice(cursor, index));
      result += `<mark>${escapeHtml(match[0])}</mark>`;
      cursor = index + match[0].length;
    }

    result += escapeHtml(safeText.slice(cursor));
    return result;
  }

  function getSafeDetailTab(tabId) {
    return detailTabs.some((tab) => tab.id === tabId) ? tabId : "route";
  }

  return {
    buildList,
    getSafeDetailTab,
    getSearchResultTags,
    highlightMatch,
    renderDetailNoteCards,
    renderMetaPills,
  };
}
