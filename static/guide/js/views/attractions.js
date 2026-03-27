import { escapeHtml, trimText, uniqueBy } from "../utils/text.js";

export function createAttractionsView({
  els,
  sourceStore,
  selectors,
  buildList,
  renderMetaPills,
  sourceKindLabels,
  syncScrollableSelection,
}) {
  function renderFeaturedGallery(days) {
    if (!days.length) {
      els.featuredGallery.innerHTML = `<div class="empty-state">当前阶段没有可展示的图片入口。</div>`;
      if (els.attractionFocus) {
        els.attractionFocus.innerHTML = "";
      }
      return;
    }

    if (sourceStore.ready && sourceStore.attractionOrder.length) {
      const attractions = selectors.getVisibleAttractionPool(days);
      const activeAttraction = selectors.ensureFocusedAttraction(days);
      if (!attractions.length) {
        els.featuredGallery.innerHTML = `<div class="empty-state">当前阶段还没有整理出景点入口。</div>`;
        if (els.attractionFocus) {
          els.attractionFocus.innerHTML = "";
        }
        return;
      }

      els.featuredGallery.innerHTML = attractions
        .map((attraction) => {
          const cover = selectors.getAttractionCover(attraction);
          const dayLabels = attraction.day_ids
            .map((dayId) => selectors.getDayById(dayId)?.day)
            .filter(Boolean);
          const isActive = activeAttraction?.id === attraction.id;

          return `
            <button
              class="gallery-card attraction-card ${isActive ? "is-active" : ""}"
              type="button"
              data-focus-attraction="${escapeHtml(attraction.id)}"
            >
              <div class="gallery-card__media">
                <img src="${escapeHtml(cover?.src || "")}" alt="${escapeHtml(attraction.title)}" loading="lazy" />
              </div>
              <div class="gallery-card__copy">
                <div class="gallery-card__topline">
                  <span>${escapeHtml(attraction.region)}</span>
                  <span>${escapeHtml(dayLabels.join(" · "))}</span>
                </div>
                <h3>${escapeHtml(attraction.title)}</h3>
                <p class="gallery-card__text">${escapeHtml(attraction.summary)}</p>
                ${renderMetaPills({ attractionIds: [attraction.id], themeIds: attraction.theme_ids, limit: 4 })}
                <p class="gallery-card__footer">
                  ${escapeHtml(`${attraction.image_count} 张图片 · ${attraction.paragraph_count} 段原文`)}
                </p>
              </div>
            </button>
          `;
        })
        .join("");

      syncScrollableSelection(els.featuredGallery, ".attraction-card.is-active");
      renderAttractionFocus(days);
      return;
    }

    els.featuredGallery.innerHTML = days
      .map((day) => {
        const enhancement = selectors.getDayEnhancement(day.id);
        const [cover] = selectors.getDayImageItems(day.id);

        return `
          <button class="gallery-card" type="button" data-open-day="${escapeHtml(day.id)}">
            <div class="gallery-card__media">
              <img src="${escapeHtml(cover.src)}" alt="${escapeHtml(day.title)}" loading="lazy" />
            </div>
            <div class="gallery-card__copy">
              <div class="gallery-card__topline">
                <span>${escapeHtml(day.day)}</span>
                <span>${escapeHtml(day.city)}</span>
              </div>
              <h3>${escapeHtml(day.title)}</h3>
              <p class="gallery-card__text">${escapeHtml(selectors.getReferenceSnippet(cover) || enhancement.decision)}</p>
            </div>
          </button>
        `;
      })
      .join("");
    if (els.attractionFocus) {
      els.attractionFocus.innerHTML = "";
    }
  }

  function renderAttractionFocus(days) {
    if (!els.attractionFocus) return;
    const attraction = selectors.ensureFocusedAttraction(days);
    if (!attraction) {
      els.attractionFocus.innerHTML = "";
      return;
    }

    const cover = selectors.getAttractionCover(attraction);
    const relatedDays = uniqueBy(
      attraction.day_ids
        .map((dayId) => selectors.getDayById(dayId))
        .filter(Boolean),
      (day) => day.id,
    );
    const images = selectors.collectAttractionImages(attraction).slice(0, 6);
    const paragraphs = selectors.collectAttractionParagraphs(attraction).slice(0, 6);
    const pitfallItems = selectors.getAttractionPitfalls(attraction);
    const priceNotes = selectors.getAttractionPriceNotes(attraction);
    const bookingNotes = selectors.getAttractionBookingNotes(attraction);
    const advice = selectors.getAttractionAdvice(attraction);

    els.attractionFocus.innerHTML = `
      <article class="attraction-focus__hero">
        <div class="attraction-focus__media">
          <img src="${escapeHtml(cover?.src || "")}" alt="${escapeHtml(attraction.title)}" loading="lazy" />
          <div class="attraction-focus__wash" aria-hidden="true"></div>
        </div>
        <div class="attraction-focus__copy">
          <p class="eyebrow">Attraction Detail</p>
          <h3>${escapeHtml(attraction.title)}</h3>
          <p class="attraction-focus__region">${escapeHtml(attraction.region)}</p>
          <p class="attraction-focus__summary">${escapeHtml(attraction.summary)}</p>
          ${renderMetaPills({ attractionIds: [attraction.id], themeIds: attraction.theme_ids, limit: 5 })}
          <div class="chapter-inline-actions">
            <button type="button" data-open-day="${escapeHtml(attraction.primary_day_id || relatedDays[0]?.id || "")}" data-open-tab="route">
              从当天进入
            </button>
            <button type="button" data-view-switch="itinerary" data-focus-day="${escapeHtml(attraction.primary_day_id || relatedDays[0]?.id || "")}">
              跳到行程
            </button>
            <button type="button" data-view-switch="checklist" data-scroll-target="toolsSection">
              看预订
            </button>
          </div>
        </div>
      </article>

      <div class="attraction-facts">
        <article class="attraction-fact-card">
          <p class="eyebrow">Days</p>
          <strong>${escapeHtml(`${relatedDays.length} 天关联`)}</strong>
          <span>${escapeHtml(relatedDays.map((day) => day.day).join(" · "))}</span>
        </article>
        <article class="attraction-fact-card">
          <p class="eyebrow">Media</p>
          <strong>${escapeHtml(`${attraction.image_count} 张图`)}</strong>
          <span>${escapeHtml(`${attraction.paragraph_count} 段原文`)}</span>
        </article>
        <article class="attraction-fact-card">
          <p class="eyebrow">Advice</p>
          <strong>${escapeHtml(attraction.theme_ids.includes("booking") ? "先预约" : "先看天气")}</strong>
          <span>${escapeHtml(trimText(advice, 56))}</span>
        </article>
      </div>

      <div class="attraction-sections">
        <section class="attraction-panel">
          <div class="section-head section-head-compact">
            <div>
              <p class="eyebrow">Costs & Booking</p>
              <h2>费用与预约</h2>
            </div>
          </div>
          <div class="attraction-panel__split">
            <div>
              <h4>费用线索</h4>
              ${priceNotes.length ? buildList(priceNotes) : `<p class="chapter-panel__empty">当前没有单独抽出的费用段落，但景点相关原文仍完整保留。</p>`}
            </div>
            <div>
              <h4>预约提醒</h4>
              ${bookingNotes.length ? buildList(bookingNotes) : `<p class="chapter-panel__empty">这个景点没有额外预约要求，重点放在关联天数和现场节奏上。</p>`}
            </div>
          </div>
        </section>

        <section class="attraction-panel">
          <div class="section-head section-head-compact">
            <div>
              <p class="eyebrow">Related Days</p>
              <h2>关联天数</h2>
            </div>
          </div>
          <div class="attraction-day-grid">
            ${relatedDays
              .map(
                (day) => `
                  <button class="attraction-day-card" type="button" data-view-switch="itinerary" data-focus-day="${escapeHtml(day.id)}">
                    <span>${escapeHtml(day.day)}</span>
                    <strong>${escapeHtml(day.city)}</strong>
                    <p>${escapeHtml(trimText(day.title, 48))}</p>
                  </button>
                `,
              )
              .join("")}
          </div>
        </section>

        <section class="attraction-panel">
          <div class="section-head section-head-compact">
            <div>
              <p class="eyebrow">Gallery</p>
              <h2>相关图片</h2>
            </div>
          </div>
          <div class="attraction-image-grid">
            ${images
              .map(
                (image) => `
                  <article class="attraction-image-card">
                    <img src="${escapeHtml(image.src)}" alt="${escapeHtml(`${attraction.title} · 图 ${image.sequence}`)}" loading="lazy" />
                    <div class="attraction-image-card__copy">
                      <p>${escapeHtml(trimText(image.reference_excerpt || image.reference_after || image.reference_before, 80))}</p>
                      <div class="chapter-inline-actions">
                        <button type="button" data-inline-lightbox-day="${escapeHtml(image.day_id)}" data-inline-lightbox-seq="${image.sequence}">看大图</button>
                        <button type="button" data-open-day="${escapeHtml(image.day_id)}" data-open-tab="source" data-open-source-seq="${image.sequence}">看原文</button>
                      </div>
                    </div>
                  </article>
                `,
              )
              .join("")}
          </div>
        </section>

        <section class="attraction-panel">
          <div class="section-head section-head-compact">
            <div>
              <p class="eyebrow">Source</p>
              <h2>原文摘录</h2>
            </div>
          </div>
          <div class="attraction-source-list">
            ${paragraphs
              .map(
                (paragraph) => `
                  <article class="attraction-source-card">
                    <div class="chapter-paragraph__meta">
                      <p class="eyebrow">${escapeHtml(sourceKindLabels[paragraph.block_kind] || "原文段落")}</p>
                      ${renderMetaPills({ attractionIds: paragraph.attraction_ids || [], themeIds: paragraph.theme_ids || [], limit: 4 })}
                    </div>
                    <p>${escapeHtml(paragraph.text)}</p>
                    <button type="button" data-open-day="${escapeHtml(paragraph.day_id)}" data-open-tab="source">
                      回到当天原文
                    </button>
                  </article>
                `,
              )
              .join("")}
          </div>
        </section>

        <section class="attraction-panel">
          <div class="section-head section-head-compact">
            <div>
              <p class="eyebrow">Pitfalls</p>
              <h2>避坑提醒</h2>
            </div>
          </div>
          <div class="pitfall-rail">
            ${pitfallItems.length
              ? pitfallItems
                  .map(
                    (item) => `
                      <button class="pitfall-chip" type="button" data-open-day="${escapeHtml(item.dayId)}" data-open-tab="source">
                        <strong>${escapeHtml(`${item.category} · ${item.title}`)}</strong>
                        <span>${escapeHtml(trimText(item.quote, 104))}</span>
                      </button>
                    `,
                  )
                  .join("")
              : `<div class="empty-state">这个景点暂时没有单独抽出的坑位提醒。</div>`}
          </div>
        </section>
      </div>
    `;
  }

  return {
    renderAttractionFocus,
    renderFeaturedGallery,
  };
}
