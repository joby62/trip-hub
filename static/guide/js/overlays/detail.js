import { escapeHtml } from "../utils/text.js";
import { getAmapDayRouteGuide } from "../data/amap-routes.js";
import {
  buildInlineRouteUrl,
  getAmapActionKind,
  renderAmapActionLink,
} from "../utils/day-route.js";

const TIMED_ROUTE_RE = /^\d{1,2}:\d{2}\s*[—-]\s*\d{1,2}:\d{2}/;
const FOOD_SOURCE_HINT_RE = /(餐厅|火锅|饭店|饭馆|小吃|米线|咖啡|餐饮|乳扇|土菜馆|藏餐|烧烤|鱼|鸡|锅|馆)/;
const STAY_SOURCE_HINT_RE = /(酒店|民宿|客栈|别院|观景房|观景酒店|供氧|富氧|美宿)/;
const SOURCE_DOC_SECTION_RE = /^(早餐推荐|午餐|晚餐|附近美食|推荐美食|推荐酒店|推荐民宿|当天住宿|预约方式|如何买票|关于门票|其他注意事项|其它|其他|游玩路线|拍照点|推荐美食|推荐酒店|推荐民宿|Tips|注：|注：|注)/;
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

function buildSourceNote(text, { navigable = false, city = "" } = {}) {
  const cleanedText = stripTrailingPunctuation(text);
  if (!navigable) {
    return { text: cleanedText, routeUrl: "" };
  }

  const destinationName = extractDestinationName(cleanedText);
  if (!isNavigableDestinationName(destinationName)) {
    return { text: cleanedText, routeUrl: "" };
  }

  const routeName = city && !destinationName.includes(city)
    ? `${city}${destinationName}`
    : destinationName;

  return {
    text: cleanedText,
    routeUrl: buildInlineRouteUrl({
      destination: {
        name: routeName,
        city,
      },
      travelType: "0",
    }),
  };
}

function normalizeSourceLine(text) {
  return String(text || "").replace(/\u00a0/g, " ").trim();
}

function flattenSourceTextLines(paragraphItems = []) {
  return paragraphItems
    .flatMap((paragraph) => String(paragraph.text || "").split("\n"))
    .map((line) => normalizeSourceLine(line))
    .filter(Boolean);
}

function findNextMeaningfulLine(lines, startIndex) {
  for (let index = startIndex; index < lines.length; index += 1) {
    if (lines[index] && lines[index] !== "~") return lines[index];
  }
  return "";
}

function getSourceHeadingLevel(line, nextLine = "") {
  if (!line || line === "~") return null;
  if (TIMED_ROUTE_RE.test(line)) return 2;
  if (SOURCE_DOC_SECTION_RE.test(line)) return 3;
  if (!/[。！？；：:]/.test(line) && line.length <= 16 && nextLine) return 4;
  return null;
}

function buildSourceDocument(day, daySource) {
  const nodes = [];
  const outline = [];
  let anchorIndex = 0;

  daySource.source_blocks.forEach((block) => {
    if (block.type === "image") {
      const imageIndex = daySource.images.findIndex((image) => image.sequence === block.image_sequence);
      const image = daySource.images[imageIndex];
      if (!image) return;

      nodes.push({
        type: "image",
        image,
        imageIndex,
      });
      return;
    }

    const paragraphItems = block.paragraph_items?.length
      ? block.paragraph_items
      : [{
          id: block.id,
          text: block.text,
          block_kind: block.block_kind || "story",
        }];
    const lines = flattenSourceTextLines(paragraphItems);

    lines.forEach((line, index) => {
      if (!line || line === "~") return;

      const nextLine = findNextMeaningfulLine(lines, index + 1);
      const headingLevel = getSourceHeadingLevel(line, nextLine);
      if (headingLevel) {
        anchorIndex += 1;
        const anchorId = `source-anchor-${day.id}-${anchorIndex}`;
        nodes.push({
          type: "heading",
          level: headingLevel,
          text: line,
          anchorId,
        });
        outline.push({
          anchorId,
          label: line,
          level: headingLevel,
        });
        return;
      }

      nodes.push({
        type: "paragraph",
        text: line,
      });
    });
  });

  return { nodes, outline };
}

export function createDetailOverlay({
  els,
  state,
  detailTabs,
  selectors,
  buildList,
  getSafeDetailTab,
  renderDetailNoteCards,
  syncScrollableSelection,
}) {
  let detailTouchStartX = 0;
  let detailTouchStartY = 0;
  let detailSwipeTriggered = false;
  let detailInteractionsBound = false;

  function formatDetailDate(value) {
    const match = String(value || "").match(/^\s*(\d{1,2})[./-](\d{1,2})\s*$/);
    if (!match) return String(value || "").trim();
    return `${Number(match[1])}月${Number(match[2])}号`;
  }

  function navigateDetailImage(delta) {
    if (!state.detailOpen || !state.detailDayId) return;
    const images = selectors.getDayImageItems(state.detailDayId);
    if (images.length < 2) return;

    state.detailImageIndex = (state.detailImageIndex + delta + images.length) % images.length;
    renderDetail();
  }

  function bindDetailInteractions() {
    if (detailInteractionsBound) return;
    detailInteractionsBound = true;

    els.detailGalleryRail?.addEventListener("click", (event) => {
      const detailIndex = event.target.closest("[data-detail-image-index]")?.dataset.detailImageIndex;
      if (detailIndex === undefined) return;
      state.detailImageIndex = Number(detailIndex) || 0;
      renderDetail();
    });

    els.detailLeadImage?.addEventListener("click", (event) => {
      if (!detailSwipeTriggered) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      detailSwipeTriggered = false;
    }, { capture: true });

    els.detailLeadImage?.addEventListener("touchstart", (event) => {
      if (event.touches.length !== 1) return;
      detailTouchStartX = event.touches[0].clientX;
      detailTouchStartY = event.touches[0].clientY;
    }, { passive: true });

    els.detailLeadImage?.addEventListener("touchend", (event) => {
      if (!detailTouchStartX || !detailTouchStartY || event.changedTouches.length !== 1) return;
      const deltaX = event.changedTouches[0].clientX - detailTouchStartX;
      const deltaY = event.changedTouches[0].clientY - detailTouchStartY;
      detailTouchStartX = 0;
      detailTouchStartY = 0;

      if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;
      detailSwipeTriggered = true;
      navigateDetailImage(deltaX < 0 ? 1 : -1);
      window.setTimeout(() => {
        detailSwipeTriggered = false;
      }, 220);
    }, { passive: true });
  }

  function renderDetailHero(day) {
    const images = selectors.getDayImageItems(day.id);
    const safeIndex = Math.min(state.detailImageIndex, Math.max(images.length - 1, 0));
    const currentImage = images[safeIndex];

    state.detailImageIndex = safeIndex;
    els.detailPhaseBadge.textContent = day.phaseLabel;
    els.detailPhaseBadge.dataset.phase = day.phase;
    els.detailLeadImage.src = currentImage?.src || "";
    els.detailLeadImage.alt = `${day.title} · 图 ${safeIndex + 1}`;
    els.detailEyebrow.textContent = `${day.day} · ${formatDetailDate(day.date)} · ${day.city}`;
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
    if (images.length <= 1) {
      els.detailGalleryRail.innerHTML = "";
      return;
    }

    els.detailGalleryRail.innerHTML = `
      <div class="detail-gallery-dots" role="tablist" aria-label="切换当天图片">
        ${images
      .map(
        (_, index) => `
          <button
            class="detail-gallery-rail__item ${index === state.detailImageIndex ? "is-active" : ""}"
            type="button"
            role="tab"
            aria-selected="${index === state.detailImageIndex ? "true" : "false"}"
            aria-label="${escapeHtml(`切换到图 ${index + 1}`)}"
            data-detail-image-index="${index}"
          ></button>
        `,
      )
      .join("")}
      </div>
    `;
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

    const sourceDocument = buildSourceDocument(day, daySource);
    const outlineHtml = sourceDocument.outline.length
      ? `
          <details class="source-outline">
            <summary class="source-outline__summary">原文目录</summary>
            <div class="source-outline__list">
              ${sourceDocument.outline
                .map(
                  (item) => `
                    <button
                      class="source-outline__item is-level-${item.level}"
                      type="button"
                      data-source-anchor="${escapeHtml(item.anchorId)}"
                    >
                      ${escapeHtml(item.label)}
                    </button>
                  `,
                )
                .join("")}
            </div>
          </details>
        `
      : "";
    const blocksHtml = sourceDocument.nodes
      .map((node) => {
        if (node.type === "heading") {
          return `
            <h4
              class="source-doc-heading is-level-${node.level}"
              id="${escapeHtml(node.anchorId)}"
              data-source-anchor-target="${escapeHtml(node.anchorId)}"
            >
              ${escapeHtml(node.text)}
            </h4>
          `;
        }

        if (node.type === "paragraph") {
          return `<p class="source-doc-paragraph">${escapeHtml(node.text)}</p>`;
        }

        if (node.type === "image") {
          const isFocused = state.sourceFocusSequence === node.image.sequence;
          return `
            <figure class="source-doc-image ${isFocused ? "is-focused" : ""}" data-source-seq="${node.image.sequence}">
              <img class="source-doc-image__media" src="${escapeHtml(node.image.src)}" alt="${escapeHtml(`${day.title} · 图 ${node.imageIndex + 1}`)}" loading="lazy" />
              <figcaption class="source-doc-image__caption">
                <span>${escapeHtml(`图 ${node.imageIndex + 1}`)}</span>
                <button type="button" data-open-lightbox-index="${node.imageIndex}">看大图</button>
              </figcaption>
            </figure>
          `;
        }

        return "";
      })
      .join("");

    return `
      <section class="detail-block source-doc-intro">
        <h3>原文</h3>
        <p>这里不再给你二次标签，直接按文档原顺序阅读。目录默认收起，点开后可以一键跳到对应章节。</p>
        ${outlineHtml}
      </section>
      <article class="source-doc">${blocksHtml}</article>
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
          return [buildSourceNote(trimMixedFoodClause(text.replace(/^(早餐|午餐|晚餐)(?:推荐)?[：:]/, "")), { navigable: true, city: day.city })];
        }
        if (/^附近美食[：:]/.test(text) || /^推荐美食[：:]/.test(text)) {
          return splitRecommendationItems(text.replace(/^(附近美食|推荐美食)[：:]/, "")).map((item) =>
            buildSourceNote(item, { navigable: true, city: day.city }),
          );
        }
        if (/^推荐[：:]/.test(text) && FOOD_SOURCE_HINT_RE.test(text)) {
          return [buildSourceNote(stripTrailingPunctuation(text.replace(/^推荐[：:]/, "")), { navigable: true, city: day.city })];
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
            buildSourceNote(item, { navigable: true, city: day.city }),
          );
        }
        return [buildSourceNote(text, { navigable: true, city: day.city })];
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
                ${renderAmapActionLink({
                  url: item.routeUrl,
                  kind: "navigate",
                  className: "detail-note-card__nav",
                  ariaLabel: `在高德中导航去 ${item.text}`,
                })}
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

  function renderRouteOverview(day, guide) {
    if (!guide?.overview?.destination) {
      return `
        <section class="detail-block">
          <h3>当天路线</h3>
          <p>${escapeHtml(day.route)}</p>
        </section>
      `;
    }

    const routeUrl = buildInlineRouteUrl({
      start: guide.overview.start,
      viaPoints: guide.overview.via || [],
      destination: guide.overview.destination,
      travelType: "0",
    });

    const tags = ["固定起点", "全天主线", "App Scheme", "驾车"];

    return `
      <section class="detail-block route-overview">
        <h3>当天路线</h3>
        <p class="route-overview__route">${escapeHtml(guide.overview.routeLabel || day.route)}</p>
        <p class="route-overview__body">${escapeHtml(guide.overview.body || day.logistics)}</p>
        <div class="meta-pills route-overview__tags">
          ${tags.map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`).join("")}
        </div>
        ${guide.overview.tail ? `<p class="detail-source-note">${escapeHtml(guide.overview.tail)}</p>` : ""}
        ${routeUrl
          ? renderAmapActionLink({
            url: routeUrl,
            kind: getAmapActionKind("0"),
            className: "route-cta",
            ariaLabel: `在高德中按驾车熟悉 ${day.day} 主线`,
          })
          : `<p class="detail-source-note">这一天暂时还没有稳定的高德主线入口。</p>`}
      </section>
    `;
  }

  function renderRouteStops(guide) {
    const stops = guide?.stops?.filter((stop) => stop.place?.name) || [];
    if (!stops.length) return "";

    return `
      <section class="detail-block route-stop-block">
        <h3>逐点导航</h3>
        <p>这里全部按“当前位置 → 目的地”打开，高德交通方式已经按当天节奏预判好了，不再给你二次选项。</p>
        <div class="route-stop-list">
          ${stops
            .map((stop) => {
              const routeUrl = buildInlineRouteUrl({
                destination: stop.place,
                travelType: stop.modeMeta.id,
              });

              return `
                <article class="route-stop-item">
                  <div class="route-stop-item__head">
                    <div>
                      <p class="eyebrow route-stop-item__eyebrow">Amap Spot</p>
                      <h4>${escapeHtml(stop.place.title || stop.place.name)}</h4>
                    </div>
                    <span class="route-stop-item__mode">${escapeHtml(stop.modeMeta.shortLabel)}</span>
                  </div>
                  <p class="route-stop-item__note">${escapeHtml(stop.note || stop.modeMeta.tagline)}</p>
                  ${routeUrl
                    ? renderAmapActionLink({
                      url: routeUrl,
                      kind: getAmapActionKind(stop.modeMeta.id),
                      className: "route-stop-item__action",
                      ariaLabel: `在高德中按${stop.modeMeta.label}去 ${stop.place.title || stop.place.name}`,
                    })
                    : `<p class="detail-source-note">这个点暂时还没有可用的高德入口。</p>`}
                </article>
              `;
            })
            .join("")}
        </div>
      </section>
    `;
  }

  function renderRouteTab(day) {
    const guide = getAmapDayRouteGuide(day.id);

    return `
      ${renderRouteOverview(day, guide)}
      ${renderRouteStops(guide)}
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

  function renderDetailBody(day) {
    if (state.detailTab === "stay") {
      els.detailBody.innerHTML = renderStayTab(day);
      return;
    }

    if (state.detailTab === "source") {
      els.detailBody.innerHTML = renderSourceTab(day);
      return;
    }

    els.detailBody.innerHTML = renderRouteTab(day);
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
    bindDetailInteractions();
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
