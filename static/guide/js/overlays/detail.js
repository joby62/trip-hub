import { escapeHtml, trimText } from "../utils/text.js";
import { buildAmapAppRouteUrl, getMobilePlatform } from "../services/amap.js";

const TIMED_ROUTE_RE = /^\d{1,2}:\d{2}\s*[—-]\s*\d{1,2}:\d{2}/;
const FOOD_SOURCE_HINT_RE = /(餐厅|火锅|饭店|饭馆|小吃|米线|咖啡|餐饮|乳扇|土菜馆|藏餐|烧烤|鱼|鸡|锅|馆)/;
const STAY_SOURCE_HINT_RE = /(酒店|民宿|客栈|别院|观景房|观景酒店|供氧|富氧|美宿)/;
const DESTINATION_META_HINT_RE = /(\d|\+|人均|团购|标间|单间|独栋|别墅|可住|连住|宿前一晚|前一晚|网红|观景餐厅|特色炒菜|炒菜|烤肉|纳西菜|藏餐|火锅|馆子虽小|当地特色|环境还行|就在)/;
const DESTINATION_BLOCKED_RE = /^(前一晚酒店|宿前一晚酒店|酒店早餐|自带路餐|简餐)$/;

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

function getAmapRoutePlatform() {
  return getMobilePlatform() === "ios" ? "ios" : "android";
}

function stripDestinationMeta(text) {
  return String(text || "").replace(/[（(]([^()（）]*)[）)]/g, (match, inner) =>
    DESTINATION_META_HINT_RE.test(inner) ? "" : match,
  );
}

function extractDestinationName(text) {
  const normalized = stripTrailingPunctuation(stripDestinationMeta(String(text || "")
    .replace(/^(当天住宿|推荐酒店|推荐民宿|早餐|午餐|晚餐)(?:推荐)?[：:]/, "")
    .replace(/^(附近美食|推荐美食|推荐)[：:]/, "")))
    .split(/[，。；]/)[0]
    .trim();
  return normalized;
}

function isNavigableDestinationName(name) {
  const value = stripTrailingPunctuation(name).replace(/\s+/g, " ").trim();
  if (!value || value.length < 2 || value.length > 48) return false;
  if (/[。；]/.test(value)) return false;
  if (DESTINATION_BLOCKED_RE.test(value)) return false;
  if (/(建议|不要|最好|如果|提前|吃饭巨坑)/.test(value)) return false;
  return true;
}

function buildSourceNote(text, { navigable = false } = {}) {
  const cleanedText = stripTrailingPunctuation(text);
  if (!navigable) {
    return { text: cleanedText, routeUrl: "" };
  }

  const destinationName = extractDestinationName(cleanedText);
  if (!isNavigableDestinationName(destinationName)) {
    return { text: cleanedText, routeUrl: "" };
  }

  return {
    text: cleanedText,
    routeUrl: buildAmapAppRouteUrl(getAmapRoutePlatform(), {
      start: null,
      destination: { name: destinationName },
      travelType: "0",
    }),
  };
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
          return [buildSourceNote(trimMixedFoodClause(text.replace(/^(早餐|午餐|晚餐)(?:推荐)?[：:]/, "")), { navigable: true })];
        }
        if (/^附近美食[：:]/.test(text) || /^推荐美食[：:]/.test(text)) {
          return splitRecommendationItems(text.replace(/^(附近美食|推荐美食)[：:]/, "")).map((item) =>
            buildSourceNote(item, { navigable: true }),
          );
        }
        if (/^推荐[：:]/.test(text) && FOOD_SOURCE_HINT_RE.test(text)) {
          return [buildSourceNote(stripTrailingPunctuation(text.replace(/^推荐[：:]/, "")), { navigable: true })];
        }
        return [buildSourceNote(text)];
      }).map((item) => `${item.text}|||${item.routeUrl}`),
    ).map((item) => {
      const [text, routeUrl] = item.split("|||");
      return { text, routeUrl };
    });
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
          return splitRecommendationItems(text.replace(/^(推荐酒店|推荐民宿)[：:]/, "")).map((item) =>
            buildSourceNote(item, { navigable: true }),
          );
        }
        return [buildSourceNote(text, { navigable: true })];
      }).map((item) => `${item.text}|||${item.routeUrl}`),
    ).map((item) => {
      const [text, routeUrl] = item.split("|||");
      return { text, routeUrl };
    });
  }

  function renderTextNoteGroup(title, items) {
    const safeItems = items.filter(Boolean);
    if (!safeItems.length) return "";
    return `
      <p class="eyebrow detail-block__subhead">${escapeHtml(title)}</p>
      ${renderDetailNoteCards(safeItems)}
    `;
  }

  function renderSourceNoteGroup(title, items) {
    const safeItems = items.filter((item) => item?.text);
    if (!safeItems.length) return "";
    return `
      <p class="eyebrow detail-block__subhead">${escapeHtml(title)}</p>
      <div class="detail-note-stack">
        ${safeItems
          .map(
            (item) => `
              <article class="detail-note-card">
                <p>${escapeHtml(item.text)}</p>
                ${item.routeUrl
                  ? `<a class="detail-note-card__nav" href="${escapeHtml(item.routeUrl)}" data-amap-route="true" aria-label="${escapeHtml(`高德驾车前往 ${item.text}`)}">高德驾车</a>`
                  : ""}
              </article>
            `,
          )
          .join("")}
      </div>
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
        ${renderTextNoteGroup("整理建议", foodNotes.length ? foodNotes : [foodFallback])}
        ${renderSourceNoteGroup("原文细项", foodSourceNotes)}
      </section>
      <section class="detail-block">
        <h3>住哪里</h3>
        ${renderTextNoteGroup("整理建议", stayNotes.length ? stayNotes : [day.stay])}
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
