import { escapeHtml, normalizeComparableText, uniqueBy } from "../utils/text.js";

export function createSearchOverlay({
  els,
  state,
  sourceStore,
  searchFilters,
  searchGroupLabels,
  selectors,
  getSearchResultTags,
  highlightMatch,
  syncScrollableSelection,
}) {
  function buildSearchResults() {
    const dayData = selectors.getDayList();
    const editorial = selectors.getTripEditorial();
    const globalNotes = editorial.globalNotes || [];
    const overviewCards = editorial.overviewCards || [];
    const packingGroups = editorial.packingGroups || [];
    const pitfallTemplates = editorial.pitfallTemplates || [];
    const query = state.searchQuery.trim().toLowerCase();
    const groups = {
      attractions: [],
      days: [],
      images: [],
      source: [],
      tools: [],
    };

    if (!query) {
      dayData.forEach((day) => {
        groups.days.push({
          group: "days",
          typeLabel: "天数",
          dayId: day.id,
          targetKind: "day",
          title: day.title,
          excerpt: day.summary,
          tags: [day.day, day.city],
        });
      });

      (sourceStore.attractionOrder || []).slice(0, 6).forEach((attractionId) => {
        const attraction = selectors.getAttractionById(attractionId);
        if (!attraction) return;
        groups.attractions.push({
          group: "attractions",
          typeLabel: "景点",
          targetKind: "attraction",
          attractionId: attraction.id,
          title: attraction.title,
          excerpt: attraction.summary,
          tags: attraction.day_ids.map((dayId) => selectors.getDayById(dayId)?.day).filter(Boolean),
        });
      });

      return groups;
    }

    dayData.forEach((day) => {
      const daySource = selectors.getDaySource(day.id);

      if ((state.searchMode === "all" || state.searchMode === "days")
        && [day.day, day.date, day.city, day.title, day.summary, day.phaseLabel].some((value) => selectors.includesQuery(value, query))) {
        groups.days.push({
          group: "days",
          typeLabel: "天数",
          dayId: day.id,
          targetKind: "day",
          title: day.title,
          excerpt: day.summary,
          tags: [day.day, day.city],
        });
      }

      if (state.searchMode === "all" || state.searchMode === "source") {
        const paragraphMatch = (daySource?.paragraphs || []).find((value) => selectors.includesQuery(value, query));
        if (paragraphMatch) {
          groups.source.push({
            group: "source",
            typeLabel: "原文",
            dayId: day.id,
            targetKind: "source",
            tab: "source",
            title: `${day.day} · ${day.title}`,
            excerpt: paragraphMatch,
            tags: [day.day, day.city],
          });
        }
      }

      if (state.searchMode === "all" || state.searchMode === "images") {
        const imageMatch = (daySource?.images || []).find((image) =>
          [image.reference_excerpt, image.reference_before, image.reference_after].some((value) => selectors.includesQuery(value, query)),
        );
        if (imageMatch) {
          groups.images.push({
            group: "images",
            typeLabel: "图片",
            dayId: day.id,
            targetKind: "image",
            tab: "gallery",
            title: `${day.day} · ${day.title}`,
            excerpt: imageMatch.reference_excerpt || imageMatch.reference_after || imageMatch.reference_before,
            imageSequence: imageMatch.sequence,
            attractionId: imageMatch.attraction_ids?.[0] || "",
            tags: [day.day, day.city],
          });
        }
      }
    });

    if (state.searchMode === "all" || state.searchMode === "attractions") {
      (sourceStore.attractionOrder || []).forEach((attractionId) => {
        const attraction = selectors.getAttractionById(attractionId);
        if (!attraction) return;
        const searchBlob = [
          attraction.title,
          attraction.region,
          attraction.summary,
          ...(attraction.aliases || []),
          ...(attraction.theme_ids || []).map((themeId) => selectors.getThemeLabel(themeId)),
          ...selectors.collectAttractionParagraphs(attraction).slice(0, 8).map((paragraph) => paragraph.text),
        ].join(" ");

        if (!selectors.includesQuery(searchBlob, query)) return;

        groups.attractions.push({
          group: "attractions",
          typeLabel: "景点",
          targetKind: "attraction",
          attractionId: attraction.id,
          title: attraction.title,
          excerpt: attraction.summary,
          tags: [
            attraction.region,
            ...attraction.day_ids.map((dayId) => selectors.getDayById(dayId)?.day).filter(Boolean).slice(0, 2),
          ],
        });
      });
    }

    if (state.searchMode === "all" || state.searchMode === "tools") {
      globalNotes.forEach((note) => {
        const searchBlob = `${note.title} ${note.body}`;
        if (!selectors.includesQuery(searchBlob, query)) return;
        groups.tools.push({
          group: "tools",
          typeLabel: "注意事项",
          targetKind: "tool",
          toolTarget: "attentionSection",
          title: note.title,
          excerpt: note.body,
          tags: ["注意事项"],
        });
      });

      overviewCards.forEach((card) => {
        const searchBlob = `${card.eyebrow || ""} ${card.title} ${card.body}`;
        if (!selectors.includesQuery(searchBlob, query)) return;
        groups.tools.push({
          group: "tools",
          typeLabel: "留意",
          targetKind: "tool",
          toolTarget: "urgentSection",
          title: card.title,
          excerpt: card.body,
          tags: [card.eyebrow || "留意四件事"].filter(Boolean),
        });
      });

      packingGroups.forEach((group) => {
        const matchedItem = group.items.find((item) => selectors.includesQuery(item, query));
        if (!matchedItem && !selectors.includesQuery(group.title, query)) return;
        groups.tools.push({
          group: "tools",
          typeLabel: "打包",
          targetKind: "tool",
          toolTarget: "packingSection",
          title: group.title,
          excerpt: matchedItem || `${group.title} 分组清单`,
          tags: [`${group.items.length} 项`],
        });
      });

      pitfallTemplates.forEach((item) => {
        const quote = selectors.resolvePitfallQuote(item);
        const searchBlob = `${item.title} ${item.category} ${quote}`;
        if (!selectors.includesQuery(searchBlob, query)) return;
        groups.tools.push({
          group: "tools",
          typeLabel: "避坑",
          targetKind: "tool",
          toolTarget: "overviewSection",
          pitfallCategory: item.category,
          title: item.title,
          excerpt: quote,
          tags: [item.category, item.dayId],
        });
      });

      dayData.forEach((day) => {
        const toolMatch = [...day.food, day.stay].find((value) => selectors.includesQuery(value, query));
        if (!toolMatch) return;
        groups.tools.push({
          group: "tools",
          typeLabel: "吃住",
          targetKind: "day",
          dayId: day.id,
          tab: "stay",
          title: `${day.day} · ${day.city}`,
          excerpt: toolMatch,
          tags: [day.day, day.city],
        });
      });
    }

    return {
      days: uniqueBy(groups.days, (item) => item.dayId || item.title),
      attractions: uniqueBy(groups.attractions, (item) => item.attractionId || item.title),
      tools: uniqueBy(
        groups.tools,
        (item) => [
          item.targetKind || "",
          item.toolTarget || "",
          item.dayId || "",
          item.tab || "",
          item.pitfallCategory || "",
          normalizeComparableText(item.title),
          normalizeComparableText(item.excerpt),
        ].join("::"),
      ),
      source: uniqueBy(
        groups.source,
        (item) => [
          item.dayId || "",
          item.tab || "",
          normalizeComparableText(item.excerpt),
        ].join("::"),
      ),
      images: uniqueBy(
        groups.images,
        (item) => [
          item.dayId || "",
          item.imageSequence || "",
          normalizeComparableText(item.excerpt),
        ].join("::"),
      ),
    };
  }

  function renderSearchFilters() {
    els.searchFilters.innerHTML = searchFilters
      .map(
        (filter) => `
          <button
            class="search-filter ${filter.id === state.searchMode ? "is-active" : ""}"
            type="button"
            data-search-mode="${escapeHtml(filter.id)}"
          >
            ${escapeHtml(filter.label)}
          </button>
        `,
      )
      .join("");
    syncScrollableSelection(els.searchFilters, ".search-filter.is-active");
  }

  function renderSearchResults() {
    renderSearchFilters();
    if (els.searchResults) {
      els.searchResults.scrollTop = 0;
    }
    const groups = buildSearchResults();
    const groupOrder = state.searchMode === "all"
      ? searchFilters.filter((item) => item.id !== "all").map((item) => item.id)
      : [state.searchMode];
    const visibleGroups = groupOrder.filter((groupId) => (groups[groupId] || []).length);
    const total = visibleGroups.reduce((sum, groupId) => sum + groups[groupId].length, 0);

    if (!visibleGroups.length) {
      els.searchSummary.textContent = "没有搜到匹配结果。试试“泸沽湖”“独克宗”“蓝月谷”或“飞来寺”。";
      els.searchResults.innerHTML = `<div class="empty-state">没有搜到匹配结果。换个关键词，或者切到别的搜索类型试试。</div>`;
      return;
    }

    els.searchSummary.textContent = state.searchQuery.trim()
      ? `共找到 ${total} 条结果，覆盖 ${visibleGroups.length} 个分组。`
      : "未输入关键词时，先给你天数和景点作为快速入口。";

    els.searchResults.innerHTML = visibleGroups
      .map((groupId) => `
        <section class="search-group">
          <div class="search-group__head">
            <h3>${escapeHtml(searchGroupLabels[groupId])}</h3>
            <span>${escapeHtml(`${groups[groupId].length} 条`)}</span>
          </div>
          ${groups[groupId]
            .map((result) => {
              const detailTags = getSearchResultTags(result);
              return `
                <button
                  class="search-result"
                  type="button"
                  data-result-kind="${escapeHtml(result.targetKind || "")}"
                  data-result-day="${escapeHtml(result.dayId || "")}"
                  data-result-tab="${escapeHtml(result.tab || "route")}"
                  data-result-image="${escapeHtml(result.imageSequence || "")}"
                  data-result-attraction="${escapeHtml(result.attractionId || "")}"
                  data-result-tool="${escapeHtml(result.toolTarget || "")}"
                  data-result-pitfall="${escapeHtml(result.pitfallCategory || "")}"
                >
                  <div class="detail-tags">
                    <span class="search-result__type">${escapeHtml(result.typeLabel)}</span>
                    ${detailTags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
                  </div>
                  <h3>${highlightMatch(result.title, state.searchQuery.trim())}</h3>
                  <p>${highlightMatch(result.excerpt || "", state.searchQuery.trim())}</p>
                </button>
              `;
            })
            .join("")}
        </section>
      `)
      .join("");
  }

  return {
    renderSearchFilters,
    renderSearchResults,
  };
}
