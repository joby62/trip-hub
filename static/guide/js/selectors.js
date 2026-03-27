import { normalizeSourcePath } from "./utils/source.js";
import { normalizeComparableText, trimText, uniqueBy } from "./utils/text.js";

const EMPTY_EDITORIAL = {
  bookingTimeline: [],
  bookingToolCards: [],
  globalNotes: [],
  heroHighlightCards: [],
  overviewCards: [],
  packingGroups: [],
  phaseOptions: [],
  pitfallCategories: [],
  pitfallTemplates: [],
  riskNotes: [],
  routeSpine: [],
};

function normalizeImageItem(image) {
  return {
    ...image,
    attractionIds: image.attractionIds || image.attraction_ids || [],
    dayId: image.dayId || image.day_id || "",
    linkedParagraphIds: image.linkedParagraphIds || image.linked_paragraph_ids || [],
    paragraphIndex: image.paragraphIndex ?? image.paragraph_index ?? null,
    src: image.src || normalizeSourcePath(image.relative_path),
    themeIds: image.themeIds || image.theme_ids || [],
  };
}

export function createGuideSelectors({ state, sourceStore }) {
  function hydrateDayEntry(day) {
    const normalizedImages = (day.images || []).map(normalizeImageItem);
    return {
      ...day,
      attractionIds: day.attractionIds || day.attraction_ids || [],
      blockCount: day.blockCount ?? day.block_count ?? 0,
      coverImageSequence: day.coverImageSequence ?? day.cover_image_sequence ?? null,
      imageCount: day.imageCount ?? day.image_count ?? normalizedImages.length,
      imageSequences: day.imageSequences || day.image_sequences || normalizedImages.map((image) => image.sequence),
      images: normalizedImages,
      paragraphCount: day.paragraphCount ?? day.paragraph_count ?? 0,
      paragraphItems: day.paragraphItems || day.paragraph_items || [],
      phaseLabel: day.phaseLabel || day.phase_label || "",
      sourceBlocks: day.sourceBlocks || day.source_blocks || [],
      textBlob: day.textBlob || day.text_blob || "",
      themeIds: day.themeIds || day.theme_ids || [],
    };
  }

  function getTripEditorial() {
    return sourceStore.trip?.editorial || EMPTY_EDITORIAL;
  }

  function getDayList() {
    const orderedIds = sourceStore.dayOrder.length ? sourceStore.dayOrder : Object.keys(sourceStore.byDayId);
    return orderedIds
      .map((dayId) => sourceStore.byDayId[dayId])
      .filter(Boolean);
  }

  function getDayById(dayId) {
    return sourceStore.byDayId[dayId] || null;
  }

  function getDayEnhancement(dayId) {
    const day = getDayById(dayId);
    return {
      decision: day?.decision || "",
      images: day?.imageSequences || [],
    };
  }

  function getDaySource(dayId) {
    return getDayById(dayId);
  }

  function getAttractionById(attractionId) {
    return sourceStore.attractionsById[attractionId] || null;
  }

  function getThemeById(themeId) {
    return sourceStore.themesById[themeId] || null;
  }

  function getThemeLabel(themeId) {
    return getThemeById(themeId)?.title || "";
  }

  function getAttractionLabel(attractionId) {
    return getAttractionById(attractionId)?.title || "";
  }

  function getMediaBySequence(sequence) {
    return sourceStore.mediaBySequence[Number(sequence)] || null;
  }

  function getDayImageItems(dayId) {
    return getDaySource(dayId)?.images || [];
  }

  function findImageIndexBySequence(dayId, sequence) {
    const images = getDayImageItems(dayId);
    return images.findIndex((image) => Number(image.sequence) === Number(sequence));
  }

  function includesQuery(value, query) {
    return String(value || "").toLowerCase().includes(String(query || "").toLowerCase());
  }

  function getPhaseDays() {
    return getDayList().filter((day) => state.phase === "all" || day.phase === state.phase);
  }

  function getDayTags(day) {
    return [day.city, `${day.pace}节奏`, day.altitude];
  }

  function getReferenceSnippet(image) {
    return trimText(image.reference_excerpt || image.reference_after || image.reference_before || "", 86);
  }

  function getDaySourceParagraphs(dayId) {
    const daySource = getDaySource(dayId);
    if (!daySource?.sourceBlocks?.length) {
      return [];
    }

    return daySource.sourceBlocks.flatMap((block) => {
      if (block.type !== "text") {
        return [];
      }

      return block.paragraph_items?.length
        ? block.paragraph_items
        : block.paragraphItems?.length
          ? block.paragraphItems
          : [{
              attraction_ids: block.attraction_ids || [],
              block_kind: block.block_kind || "story",
              id: block.id,
              text: block.text,
              theme_ids: block.theme_ids || [],
            }];
    });
  }

  function collectDayParagraphs(dayId, matcher) {
    return uniqueBy(
      getDaySourceParagraphs(dayId)
        .filter((paragraph) => paragraph.text && matcher(paragraph))
        .map((paragraph) => paragraph.text.trim())
        .filter(Boolean),
      (text) => normalizeComparableText(text),
    );
  }

  function getPitfallTemplates() {
    return getTripEditorial().pitfallTemplates || [];
  }

  function resolvePitfallQuote(template) {
    const daySource = getDaySource(template.dayId);
    if (daySource?.paragraphs?.length) {
      const match = daySource.paragraphs.find((paragraph) =>
        template.terms.some((term) => paragraph.includes(term)),
      );
      if (match) {
        return match;
      }
    }
    return template.fallback;
  }

  function getPitfallItems() {
    return uniqueBy(
      getPitfallTemplates()
        .filter((item) => state.pitfallCategory === "all" || item.category === state.pitfallCategory)
        .map((item) => ({
          ...item,
          quote: resolvePitfallQuote(item),
        })),
      (item) => [item.dayId, item.category, item.title, normalizeComparableText(item.quote)].join("::"),
    );
  }

  function getVisibleAttractions(days) {
    const visibleDayIds = new Set(days.map((day) => day.id));
    return sourceStore.attractionOrder
      .map((attractionId) => getAttractionById(attractionId))
      .filter(Boolean)
      .filter((attraction) => attraction.day_ids.some((dayId) => visibleDayIds.has(dayId)));
  }

  function getVisibleAttractionPool(days) {
    return getVisibleAttractions(days);
  }

  function getAttractionCover(attraction) {
    return getMediaBySequence(attraction.cover_image_sequence)
      || getDayImageItems(attraction.primary_day_id || attraction.day_ids[0])[0]
      || null;
  }

  function ensureFocusedAttraction(days) {
    const attractions = getVisibleAttractionPool(days);
    if (!attractions.length) {
      state.attractionId = "";
      return null;
    }

    if (!attractions.some((attraction) => attraction.id === state.attractionId)) {
      state.attractionId = attractions[0].id;
    }

    return getAttractionById(state.attractionId) || attractions[0];
  }

  function collectAttractionParagraphs(attraction) {
    return uniqueBy(
      attraction.day_ids
        .flatMap((dayId) => getDaySource(dayId)?.paragraphItems || getDaySource(dayId)?.paragraph_items || [])
        .filter((paragraph) => (paragraph.attraction_ids || paragraph.attractionIds || []).includes(attraction.id)),
      (paragraph) => [paragraph.block_kind || paragraph.blockKind || "story", normalizeComparableText(paragraph.text)].join("::"),
    );
  }

  function collectAttractionImages(attraction) {
    return uniqueBy(
      attraction.image_sequences
        .map((sequence) => getMediaBySequence(sequence))
        .filter(Boolean),
      (image) => String(image.sequence),
    );
  }

  function matchesAttractionText(attraction, text) {
    const normalized = String(text || "");
    return attraction.aliases.some((alias) => normalized.includes(alias)) || normalized.includes(attraction.title);
  }

  function getAttractionPitfalls(attraction) {
    const exact = uniqueBy(
      getPitfallTemplates()
        .filter((item) => attraction.day_ids.includes(item.dayId))
        .map((item) => ({ ...item, quote: resolvePitfallQuote(item) }))
        .filter((item) => matchesAttractionText(attraction, `${item.title} ${item.quote}`)),
      (item) => [item.dayId, item.category, item.title, normalizeComparableText(item.quote)].join("::"),
    );

    if (exact.length) {
      return exact;
    }

    return uniqueBy(
      getPitfallTemplates()
        .filter((item) => attraction.day_ids.includes(item.dayId))
        .map((item) => ({ ...item, quote: resolvePitfallQuote(item) })),
      (item) => [item.dayId, item.category, item.title, normalizeComparableText(item.quote)].join("::"),
    ).slice(0, 3);
  }

  function getAttractionPriceNotes(attraction) {
    return collectAttractionParagraphs(attraction)
      .filter((paragraph) => /(\d+\s*元|门票|收费|票价|免门票)/.test(paragraph.text))
      .map((paragraph) => paragraph.text)
      .filter((text, index, array) => array.findIndex((candidate) => normalizeComparableText(candidate) === normalizeComparableText(text)) === index)
      .slice(0, 4);
  }

  function getAttractionBookingNotes(attraction) {
    return collectAttractionParagraphs(attraction)
      .filter((paragraph) => (paragraph.block_kind || paragraph.blockKind) === "booking" || (paragraph.theme_ids || paragraph.themeIds || []).includes("booking"))
      .map((paragraph) => paragraph.text)
      .filter((text, index, array) => array.findIndex((candidate) => normalizeComparableText(candidate) === normalizeComparableText(text)) === index)
      .slice(0, 3);
  }

  function getAttractionAdvice(attraction) {
    const paragraphs = collectAttractionParagraphs(attraction);
    const scenicAdvice = paragraphs.find((paragraph) =>
      /(建议|适合|推荐|最好|值|慢慢|提前|窗口|出片|看景|节奏)/.test(paragraph.text),
    );
    return scenicAdvice?.text || attraction.summary;
  }

  function ensureFocusedItineraryDay(days) {
    if (!days.length) {
      state.itineraryDayId = "";
      return null;
    }

    if (!days.some((day) => day.id === state.itineraryDayId)) {
      state.itineraryDayId = days[0].id;
    }

    return getDayById(state.itineraryDayId) || days[0];
  }

  function getDayPitfallEntries(dayId) {
    return uniqueBy(
      getPitfallTemplates()
        .filter((item) => item.dayId === dayId)
        .map((item) => ({
          ...item,
          quote: resolvePitfallQuote(item),
        })),
      (item) => [item.category, item.title, normalizeComparableText(item.quote)].join("::"),
    );
  }

  return {
    collectAttractionImages,
    collectAttractionParagraphs,
    collectDayParagraphs,
    ensureFocusedAttraction,
    ensureFocusedItineraryDay,
    findImageIndexBySequence,
    getAttractionAdvice,
    getAttractionBookingNotes,
    getAttractionById,
    getAttractionCover,
    getAttractionLabel,
    getAttractionPitfalls,
    getAttractionPriceNotes,
    getDayById,
    getDayEnhancement,
    getDayImageItems,
    getDayList,
    getDayPitfallEntries,
    getDaySource,
    getDaySourceParagraphs,
    getDayTags,
    getMediaBySequence,
    getPhaseDays,
    getPitfallItems,
    getReferenceSnippet,
    getThemeById,
    getThemeLabel,
    getTripEditorial,
    getVisibleAttractionPool,
    getVisibleAttractions,
    hydrateDayEntry,
    includesQuery,
    resolvePitfallQuote,
  };
}
