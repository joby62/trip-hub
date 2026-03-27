import { escapeHtml, trimText } from "../utils/text.js";

const TIMED_ROUTE_RE = /^\d{1,2}:\d{2}\s*[—-]\s*\d{1,2}:\d{2}/;
const FOOD_SOURCE_HINT_RE = /(餐厅|火锅|饭店|饭馆|小吃|米线|咖啡|餐饮|乳扇|土菜馆|藏餐|烧烤|鱼|鸡|锅|馆)/;
const STAY_SOURCE_HINT_RE = /(酒店|民宿|客栈|别院|观景房|观景酒店|供氧|富氧|美宿)/;

function uniqueStrings(items) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const value = String(item || "").trim();
    if (!value) continue;
    const key = value.replace(/\s+/g, " ").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function stripTrailingPunctuation(text) {
  return String(text || "").trim().replace(/[。；]+$/g, "");
}

function splitRecommendationItems(text) {
  return String(text || "")
    .split("、")
    .map((item) => stripTrailingPunctuation(item).replace(/^\|+/, "").trim())
    .filter(Boolean);
}

function trimMixedFoodClause(text) {
  return stripTrailingPunctuation(String(text || "").split(/，(?=.*(?:住|住宿|酒店|民宿|客栈|别院))/)[0]);
}

export function createDetailOverlay({
  els,
  state,
  detailTabs,
  sourceKindLabels,
  selectors,
  buildList,
  getSafeDetailTab,
  renderDetailNoteCards,
  renderMetaPills,
  syncScrollableSelection,
}) {
  function renderDetailHero(day) {
    const images = selectors.getDayImageItems(day.id);
    const safeIndex = Math.min(state.detailImageIndex, Math.max(images.length - 1, 0));

    state.detailImageIndex = safeIndex;
    els.detailPhaseBadge.textContent = day.phaseLabel;
    els.detailPhaseBadge.dataset.phase = day.phase;
    els.detailLeadImage.src = images[safeIndex]?.src || "";
    els.detailLeadImage.alt = day.title;
    els.detailEyebrow.textContent = `${day.day} · ${day.date} · ${day.city}`;
    els.detailTitle.textContent = day.title;
    els.detailDecision.textContent = "";
    els.detailSummary.textContent = "";
    els.detailBadges.innerHTML = "";
    els.detailDecision.hidden = true;
    els.detailSummary.hidden = true;
    els.detailBadges.hidden = true;
  }

  function renderDetailGalleryRail(day) {
    const images = selectors.getDayImageItems(day.id);
    if (!images.length) {
      els.detailGalleryRail.innerHTML = "";
      return;
    }

    els.detailGalleryRail.innerHTML = images
      .map(
        (image, index) => `
          <button
            class="detail-gallery-rail__item ${index === state.detailImageIndex ? "is-active" : ""}"
            type="button"
            data-open-lightbox-index="${index}"
          >
            <img src="${escapeHtml(image.src)}" alt="${escapeHtml(`${day.title} · 图 ${index + 1}`)}" loading="lazy" />
            <div class="detail-gallery-rail__copy">
              <strong>${escapeHtml(`图 ${index + 1}`)}</strong>
            </div>
          </button>
        `,
      )
      .join("");
    syncScrollableSelection(els.detailGalleryRail, ".detail-gallery-rail__item.is-active");
  }

  function renderDetailTabs() {
    els.detailTabs.innerHTML = detailTabs
      .map(
        (tab) => `
          <button
            class="detail-tab ${tab.id === state.detailTab ? "is-active" : ""}"
            type="button"
            role="tab"
            aria-selected="${tab.id === state.detailTab ? "true" : "false"}"
            data-tab="${escapeHtml(tab.id)}"
          >
            ${escapeHtml(tab.label)}
          </button>
        `,
      )
      .join("");
    syncScrollableSelection(els.detailTabs, ".detail-tab.is-active");
  }

  function renderSourceTab(day) {
    const daySource = selectors.getDaySource(day.id);
    if (!daySource?.source_blocks?.length) {
      return `
        <section class="detail-block">
          <h3>原文模式尚未就绪</h3>
          <p>这一天的原文段落还没有接入成功。</p>
        </section>
      `;
    }

    const blocksHtml = daySource.source_blocks
      .map((block) => {
        if (block.type === "text") {
          const paragraphItems = block.paragraph_items?.length
            ? block.paragraph_items
            : [{
                id: block.id,
                text: block.text,
                block_kind: block.block_kind || "story",
                attraction_ids: block.attraction_ids || [],
                theme_ids: block.theme_ids || [],
              }];

          return `
            <article class="source-paragraph-group">
              ${paragraphItems
                .map(
                  (paragraph) => `
                    <div class="source-paragraph">
                      <div class="source-paragraph__meta">
                        <p class="eyebrow source-paragraph__eyebrow">
                          ${escapeHtml(sourceKindLabels[paragraph.block_kind] || "原文段落")}
                        </p>
                        ${renderMetaPills({
                          attractionIds: paragraph.attraction_ids || [],
                          themeIds: paragraph.theme_ids || [],
                          limit: 4,
                        })}
                      </div>
                      <p>${escapeHtml(paragraph.text)}</p>
                    </div>
                  `,
                )
                .join("")}
            </article>
          `;
        }

        const imageIndex = daySource.images.findIndex((image) => image.sequence === block.image_sequence);
        const image = daySource.images[imageIndex];
        if (!image) return "";

        const isFocused = state.sourceFocusSequence === image.sequence;
        const metaLines = [image.reference_before, image.reference_after]
          .filter(Boolean)
          .filter((line, index, array) => array.indexOf(line) === index)
          .map((line) => `<p>${escapeHtml(trimText(line, 180))}</p>`)
          .join("");

        return `
          <article class="source-image ${isFocused ? "is-focused" : ""}" data-source-seq="${image.sequence}">
            <img class="source-image__media" src="${escapeHtml(image.src)}" alt="${escapeHtml(`${day.title} · 图 ${imageIndex + 1}`)}" loading="lazy" />
            <div class="source-image__meta">
              <p class="eyebrow source-image__eyebrow">${escapeHtml(`图 ${imageIndex + 1} · 段落 ${image.paragraph_index || "-"}`)}</p>
              ${renderMetaPills({ attractionIds: image.attraction_ids || [], themeIds: image.theme_ids || [], limit: 4 })}
              ${metaLines}
              <div class="source-image__actions">
                <button type="button" data-open-lightbox-index="${imageIndex}">看大图</button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    return `
      <section class="detail-block">
        <h3>原文模式</h3>
        <p>这里按文档原始阅读顺序，把文本段落和图片引用重新挂回来了。图和文可以相互跳转。</p>
      </section>
      <div class="source-flow">${blocksHtml}</div>
    `;
  }

  function collectSourceLines(day, matcher) {
    return selectors.collectDayParagraphs(day.id, (paragraph) => {
      const text = String(paragraph.text || "").trim();
      if (!text || TIMED_ROUTE_RE.test(text)) return false;
      return matcher(text, paragraph);
    });
  }

  function buildFoodSourceNotes(day) {
    const rawNotes = collectSourceLines(day, (text) =>
      /^早餐(?:推荐)?[：:]/.test(text)
        || /^午餐(?:推荐)?[：:]/.test(text)
        || /^晚餐(?:推荐)?[：:]/.test(text)
        || /^附近美食[：:]/.test(text)
        || /^推荐美食[：:]/.test(text)
        || /^关于晚餐/.test(text)
        || (/^推荐[：:]/.test(text) && FOOD_SOURCE_HINT_RE.test(text)),
    );

    return uniqueStrings(
      rawNotes.flatMap((text) => {
        if (/^早餐(?:推荐)?[：:]/.test(text) || /^午餐(?:推荐)?[：:]/.test(text) || /^晚餐(?:推荐)?[：:]/.test(text)) {
          return [trimMixedFoodClause(text.replace(/^(早餐|午餐|晚餐)(?:推荐)?[：:]/, ""))];
        }
        if (/^附近美食[：:]/.test(text) || /^推荐美食[：:]/.test(text)) {
          return splitRecommendationItems(text.replace(/^(附近美食|推荐美食)[：:]/, ""));
        }
        if (/^推荐[：:]/.test(text) && FOOD_SOURCE_HINT_RE.test(text)) {
          return [stripTrailingPunctuation(text.replace(/^推荐[：:]/, ""))];
        }
        return [stripTrailingPunctuation(text)];
      }),
    );
  }

  function buildStaySourceNotes(day) {
    const rawNotes = collectSourceLines(day, (text) =>
      /^当天住宿[：:]/.test(text)
        || /^推荐酒店[：:]/.test(text)
        || /^推荐民宿[：:]/.test(text)
        || (/^住/.test(text) && STAY_SOURCE_HINT_RE.test(text)),
    );

    return uniqueStrings(
      rawNotes.flatMap((text) => {
        if (/^推荐酒店[：:]/.test(text) || /^推荐民宿[：:]/.test(text)) {
          return splitRecommendationItems(text.replace(/^(推荐酒店|推荐民宿)[：:]/, ""));
        }
        return [stripTrailingPunctuation(text)];
      }),
    );
  }

  function renderSourceNoteGroup(title, items) {
    const safeItems = items.filter(Boolean);
    if (!safeItems.length) return "";
    return `
      <p class="eyebrow detail-block__subhead">${escapeHtml(title)}</p>
      ${renderDetailNoteCards(safeItems)}
    `;
  }

  function renderStayTab(day) {
    const foodNotes = Array.isArray(day.food) ? day.food.filter(Boolean) : [];
    const foodSourceNotes = buildFoodSourceNotes(day);
    const stayNotes = day.stay ? [day.stay] : [];
    const staySourceNotes = buildStaySourceNotes(day);
    const reminderNotes = Array.isArray(day.tips) ? day.tips.filter(Boolean) : [];
    const foodFallback = foodNotes.join(" ");
    const reminderFallback = reminderNotes.join(" ");

    return `
      <section class="detail-block">
        <h3>吃什么</h3>
        ${renderSourceNoteGroup("整理建议", foodNotes.length ? foodNotes : [foodFallback])}
        ${renderSourceNoteGroup("原文细项", foodSourceNotes)}
      </section>
      <section class="detail-block">
        <h3>住哪里</h3>
        ${renderSourceNoteGroup("整理建议", stayNotes.length ? stayNotes : [day.stay])}
        ${renderSourceNoteGroup("原文细项", staySourceNotes)}
      </section>
      <section class="detail-block">
        <h3>当天提醒</h3>
        ${renderDetailNoteCards(reminderNotes, reminderFallback)}
      </section>
    `;
  }

  function renderDetailBody(day) {
    if (state.detailTab === "stay") {
      els.detailBody.innerHTML = renderStayTab(day);
      return;
    }

    if (state.detailTab === "source") {
      els.detailBody.innerHTML = renderSourceTab(day);
      return;
    }

    els.detailBody.innerHTML = `
      <section class="detail-block">
        <h3>当天路线</h3>
        <p>${escapeHtml(day.route)}</p>
      </section>
      <section class="detail-block">
        <h3>交通与节奏</h3>
        <p>${escapeHtml(day.logistics)}</p>
      </section>
      <section class="detail-block">
        <h3>今日亮点</h3>
        ${buildList(day.highlights)}
      </section>
      <section class="detail-block">
        <h3>避坑提醒</h3>
        ${buildList(day.tips)}
      </section>
    `;
  }

  function focusSourceReferenceIfNeeded() {
    if (state.detailTab !== "source" || !state.sourceFocusSequence) return;
    const target = els.detailBody.querySelector(`[data-source-seq="${state.sourceFocusSequence}"]`);
    if (!target) return;
    window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  }

  function renderDetail() {
    const day = selectors.getDayById(state.detailDayId);
    if (!day) return;
    state.detailTab = getSafeDetailTab(state.detailTab);
    renderDetailHero(day);
    renderDetailGalleryRail(day);
    renderDetailTabs();
    renderDetailBody(day);
    focusSourceReferenceIfNeeded();
  }

  return {
    renderDetail,
  };
}
