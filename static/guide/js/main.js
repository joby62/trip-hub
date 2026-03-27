import {
  BLUEPRINT_PATH,
  CHECKLIST_TOPBAR_ITEMS,
  DETAIL_TABS,
  PACKING_STORAGE_KEY,
  PRIMARY_VIEW_SECTION,
  SEARCH_FILTERS,
  SEARCH_GROUP_LABELS,
  SECTION_TO_VIEW,
  SOURCE_KIND_LABELS,
  VIEW_OPTIONS,
} from "./config.js";
import { createAttractionCommunityOverlay } from "./overlays/attraction-community.js";
import { createDetailOverlay } from "./overlays/detail.js";
import { createLightboxOverlay } from "./overlays/lightbox.js";
import { createSearchOverlay } from "./overlays/search.js";
import { createRenderHelpers } from "./render-helpers.js";
import { createRouter } from "./router.js";
import { createGuideSelectors } from "./selectors.js";
import {
  addAttractionComment,
  loadAttractionCommunityStore,
  saveAttractionCommunityStore,
  toggleAttractionReaction,
} from "./services/attraction-community.js";
import { resetSourceStoreData, sourceStore, state } from "./state.js";
import { openAmapTestRoute } from "./services/amap.js";
import { saveJsonStorage, savePackingGroupState } from "./services/storage.js";
import { buildAttractionCommunitySnapshot, buildStoryPointKey } from "./utils/attraction-community.js";
import { escapeHtml } from "./utils/text.js";
import { createAttractionsView } from "./views/attractions.js";
import { createChecklistView } from "./views/checklist.js";
import { createItineraryView } from "./views/itinerary.js";
import { createOverviewView } from "./views/overview.js";

const els = {
  siteTopbar: document.querySelector(".site-topbar"),
  openViewMenuBtn: document.getElementById("openViewMenuBtn"),
  phasePickerBtn: document.getElementById("phasePickerBtn"),
  phasePickerLabel: document.getElementById("phasePickerLabel"),
  topbarMenuShell: document.getElementById("topbarMenuShell"),
  topbarMenuBackdrop: document.getElementById("topbarMenuBackdrop"),
  viewMenu: document.getElementById("viewMenu"),
  phaseMenu: document.getElementById("phaseMenu"),
  heroImage: document.getElementById("heroImage"),
  heroActions: document.getElementById("heroActions"),
  heroHighlights: document.getElementById("heroHighlights"),
  overviewFacts: document.getElementById("overviewFacts"),
  amapTestGrid: document.getElementById("amapTestGrid"),
  viewPanels: document.querySelectorAll("[data-view-panel]"),
  routeStrip: document.getElementById("routeStrip"),
  overviewTools: document.getElementById("overviewTools"),
  phaseFilter: document.getElementById("phaseFilter"),
  pitfallFilters: document.getElementById("pitfallFilters"),
  pitfallList: document.getElementById("pitfallList"),
  attractionDateRail: document.getElementById("attractionDateRail"),
  featuredGallery: document.getElementById("featuredGallery"),
  attractionFocus: document.getElementById("attractionFocus"),
  dateRail: document.getElementById("dateRail"),
  daysContainer: document.getElementById("daysContainer"),
  bookingTools: document.getElementById("bookingTools"),
  bookingList: document.getElementById("bookingList"),
  globalNotes: document.getElementById("globalNotes"),
  packingActions: document.getElementById("packingActions"),
  packingList: document.getElementById("packingList"),
  packingFloatingProgress: document.getElementById("packingFloatingProgress"),
  searchShell: document.getElementById("searchShell"),
  searchClearBtn: document.getElementById("searchClearBtn"),
  searchInput: document.getElementById("searchInput"),
  searchFilters: document.getElementById("searchFilters"),
  searchSummary: document.getElementById("searchSummary"),
  searchResults: document.getElementById("searchResults"),
  openSearchBtn: document.getElementById("openSearchBtn"),
  detailShell: document.getElementById("detailShell"),
  detailSheet: document.getElementById("detailSheet"),
  detailPhaseBadge: document.getElementById("detailPhaseBadge"),
  detailLeadImage: document.getElementById("detailLeadImage"),
  detailEyebrow: document.getElementById("detailEyebrow"),
  detailTitle: document.getElementById("detailTitle"),
  detailDecision: document.getElementById("detailDecision"),
  detailSummary: document.getElementById("detailSummary"),
  detailBadges: document.getElementById("detailBadges"),
  detailGalleryRail: document.getElementById("detailGalleryRail"),
  detailTabs: document.getElementById("detailTabs"),
  detailBody: document.getElementById("detailBody"),
  lightboxShell: document.getElementById("lightboxShell"),
  lightboxFrame: document.getElementById("lightboxFrame"),
  lightboxImage: document.getElementById("lightboxImage"),
  lightboxCounter: document.getElementById("lightboxCounter"),
  lightboxCaption: document.getElementById("lightboxCaption"),
  lightboxSource: document.getElementById("lightboxSource"),
  lightboxSourceBtn: document.getElementById("lightboxSourceBtn"),
  attractionCommunityShell: document.getElementById("attractionCommunityShell"),
  attractionCommunityScroll: document.getElementById("attractionCommunityScroll"),
  attractionCommunityTitle: document.getElementById("attractionCommunityTitle"),
  attractionCommunityHero: document.getElementById("attractionCommunityHero"),
  attractionCommunityActions: document.getElementById("attractionCommunityActions"),
  attractionCommunityGallery: document.getElementById("attractionCommunityGallery"),
  attractionCommunityCommentsHead: document.getElementById("attractionCommunityCommentsHead"),
  attractionCommunityComments: document.getElementById("attractionCommunityComments"),
  attractionCommunityComposeBar: document.getElementById("attractionCommunityComposeBar"),
  attractionCommunityComposer: document.getElementById("attractionCommunityComposer"),
  attractionCommunityTextarea: document.getElementById("attractionCommunityTextarea"),
  attractionCommunityImagePreview: document.getElementById("attractionCommunityImagePreview"),
  attractionCommunityImageInput: document.getElementById("attractionCommunityImageInput"),
  attractionCommunitySubmit: document.getElementById("attractionCommunitySubmit"),
  scrollProgress: document.getElementById("scrollProgress"),
};
let chromeSyncFrame = 0;
let viewportSyncFrame = 0;
let chromeResizeObserver = null;
let lightboxTouchStartX = 0;
let lightboxTouchStartY = 0;
let attractionCommunityTouchStartX = 0;
let attractionCommunityTouchStartY = 0;
let keyboardOpen = false;
let syncHashFromState = () => {};
let parseHashAndApply = () => {};

function syncBodyLock() {
  document.body.classList.toggle(
    "has-modal-open",
    state.searchOpen || state.detailOpen || state.lightboxOpen || state.attractionCommunityOpen,
  );
  scheduleViewportMetricSync();
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 719px)").matches;
}

function syncScrollableSelection(container, selector = ".is-active") {
  if (!container || !isMobileViewport()) return;
  const active = container.querySelector(selector);
  if (!active) return;

  window.requestAnimationFrame(() => {
    active.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  });
}

const selectors = createGuideSelectors({
  state,
  sourceStore,
});
let attractionCommunityStore = loadAttractionCommunityStore();

function getAttractionCommunitySnapshot(day) {
  return buildAttractionCommunitySnapshot({
    day,
    selectors,
    store: attractionCommunityStore,
  });
}

const {
  findImageIndexBySequence,
  getAttractionById,
  getDayById,
  getDayImageItems,
  getDaySource,
  getPhaseDays,
  hydrateDayEntry,
} = selectors;

const {
  buildList,
  getSafeDetailTab,
  getSearchResultTags,
  highlightMatch,
  renderDetailNoteCards,
  renderMetaPills,
} = createRenderHelpers({
  detailTabs: DETAIL_TABS,
  getAttractionLabel: selectors.getAttractionLabel,
  getThemeLabel: selectors.getThemeLabel,
});

const {
  renderHeroHighlights,
  renderHeroMedia,
  renderOverviewFacts,
  renderAmapTests,
  renderOverviewTools,
  renderPhaseFilters,
  renderPitfallFilters,
  renderPitfalls,
  renderRouteStrip,
} = createOverviewView({
  els,
  state,
  sourceStore,
  selectors,
  syncScrollableSelection,
});

const {
  renderAttractionDateRail,
  renderFeaturedGallery,
} = createAttractionsView({
  els,
  state,
  sourceStore,
  selectors,
  getAttractionCommunitySnapshot,
  syncScrollableSelection,
});

const {
  renderDateRail,
  renderItineraryChapter,
} = createItineraryView({
  els,
  selectors,
  buildList,
});

const {
  getPackingProgress,
  renderBooking,
  renderBookingTools,
  renderGlobalNotes,
  renderPacking,
  renderPackingFloatingProgress,
} = createChecklistView({
  els,
  state,
  selectors,
  syncScrollableSelection,
});

const {
  renderSearchResults,
} = createSearchOverlay({
  els,
  state,
  sourceStore,
  searchFilters: SEARCH_FILTERS,
  searchGroupLabels: SEARCH_GROUP_LABELS,
  selectors,
  getSearchResultTags,
  highlightMatch,
  syncScrollableSelection,
});

const {
  renderDetail,
} = createDetailOverlay({
  els,
  state,
  detailTabs: DETAIL_TABS,
  sourceKindLabels: SOURCE_KIND_LABELS,
  selectors,
  buildList,
  getSafeDetailTab,
  renderDetailNoteCards,
  renderMetaPills,
  syncScrollableSelection,
});

const {
  renderLightbox,
} = createLightboxOverlay({
  els,
  state,
  selectors,
});

const {
  renderAttractionCommunity,
} = createAttractionCommunityOverlay({
  els,
  state,
  selectors,
  getAttractionCommunitySnapshot,
});

function syncViewportMetrics() {
  const rootStyle = document.documentElement.style;
  const viewport = window.visualViewport;
  const viewportHeight = Math.round(viewport?.height || window.innerHeight);
  const viewportWidth = Math.round(viewport?.width || window.innerWidth);
  const keyboardOffset = viewport
    ? Math.max(0, Math.round(window.innerHeight - viewport.height - viewport.offsetTop))
    : 0;

  keyboardOpen = isMobileViewport() && keyboardOffset > 120;
  document.body.classList.toggle("is-keyboard-open", keyboardOpen);
  rootStyle.setProperty("--app-height", `${viewportHeight}px`);
  rootStyle.setProperty("--app-width", `${viewportWidth}px`);
}

function syncChromeOffsets() {
  const rootStyle = document.documentElement.style;
  const topbarRect = els.siteTopbar?.getBoundingClientRect();
  const topOffset = topbarRect
    ? Math.max(Math.ceil(topbarRect.bottom + 12), 88)
    : 96;

  rootStyle.setProperty("--chrome-top-offset", `${topOffset}px`);
  rootStyle.setProperty("--chrome-bottom-offset", `${keyboardOpen ? 20 : 28}px`);
}

function scheduleChromeOffsetSync() {
  if (chromeSyncFrame) {
    window.cancelAnimationFrame(chromeSyncFrame);
  }
  chromeSyncFrame = window.requestAnimationFrame(() => {
    chromeSyncFrame = 0;
    syncChromeOffsets();
  });
}

function scheduleViewportMetricSync() {
  if (viewportSyncFrame) {
    window.cancelAnimationFrame(viewportSyncFrame);
  }

  viewportSyncFrame = window.requestAnimationFrame(() => {
    viewportSyncFrame = 0;
    syncViewportMetrics();
    syncChromeOffsets();
  });
}

function bindChromeObservers() {
  if (!("ResizeObserver" in window) || chromeResizeObserver) {
    return;
  }

  chromeResizeObserver = new ResizeObserver(() => {
    scheduleChromeOffsetSync();
  });

  if (els.siteTopbar) {
    chromeResizeObserver.observe(els.siteTopbar);
  }
}

function bindViewportObservers() {
  if (!window.visualViewport) {
    return;
  }

  window.visualViewport.addEventListener("resize", scheduleViewportMetricSync, { passive: true });
  window.visualViewport.addEventListener("scroll", scheduleViewportMetricSync, { passive: true });
}

function getViewLabel(viewId) {
  return VIEW_OPTIONS.find((view) => view.id === viewId)?.label || "行程";
}

function getPhaseConfig(phaseId) {
  const phaseOptions = selectors.getTripEditorial().phaseOptions || [];
  return phaseOptions.find((phase) => phase.id === phaseId) || phaseOptions[0] || { label: "全部日程" };
}

function renderViewMenu() {
  if (!els.viewMenu) return;
  els.viewMenu.innerHTML = `
    <div class="topbar-menu__head">
      <p class="eyebrow">View</p>
      <h2>切换浏览方式</h2>
    </div>
    <div class="topbar-menu__list">
      ${VIEW_OPTIONS
        .map((view) => {
          const isActive = view.id === state.currentView;
          return `
            <button
              class="menu-option ${isActive ? "is-active" : ""}"
              type="button"
              data-view="${escapeHtml(view.id)}"
            >
              <span class="menu-option__check" aria-hidden="true">${isActive ? "✓" : ""}</span>
              <span class="menu-option__copy">
                <strong>${escapeHtml(view.label)}</strong>
                <span>${escapeHtml(view.hint)}</span>
              </span>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderPhasePicker() {
  const isChecklist = state.currentView === "checklist";
  const phaseConfig = getPhaseConfig(state.phase);
  const { doneItems, totalItems } = getPackingProgress();

  if (els.phasePickerLabel) {
    els.phasePickerLabel.textContent = isChecklist ? getViewLabel("checklist") : phaseConfig.label;
  }

  if (els.phaseFilter) {
    if (isChecklist) {
      els.phaseFilter.innerHTML = CHECKLIST_TOPBAR_ITEMS
        .map((item) => {
          const isActive = state.activeSection === item.id;
          const isPacking = item.id === "packingSection";
          const isComplete = isPacking && doneItems === totalItems && totalItems > 0;
          return `
            <button
              class="menu-option ${isActive ? "is-active" : ""}"
              type="button"
              data-checklist-target="${escapeHtml(item.id)}"
            >
              <span class="menu-option__check" aria-hidden="true">${isActive || isComplete ? "✓" : ""}</span>
              <span class="menu-option__copy">
                <strong>${escapeHtml(item.label)}</strong>
                <span>${isPacking ? escapeHtml(`打包进度 ${doneItems}/${totalItems}`) : "点击后跳到对应清单分区"}</span>
              </span>
            </button>
          `;
        })
        .join("");
    } else {
      renderPhaseFilters();
    }
  }

  const menuEyebrow = isChecklist ? "Checklist" : "Phase Filter";
  const menuTitle = isChecklist ? "切换清单分区" : "切换当前范围";

  if (els.phaseMenu) {
    const eyebrow = els.phaseMenu.querySelector(".eyebrow");
    const title = els.phaseMenu.querySelector("h2");
    if (eyebrow) eyebrow.textContent = menuEyebrow;
    if (title) title.textContent = menuTitle;
    els.phaseMenu.hidden = !state.phaseMenuOpen;
  }

  if (els.phasePickerBtn) {
    els.phasePickerBtn.classList.remove("is-disabled");
    els.phasePickerBtn.setAttribute("aria-expanded", state.phaseMenuOpen ? "true" : "false");
  }
}

function syncTopbarMenus() {
  renderViewMenu();
  renderPhasePicker();

  if (els.openViewMenuBtn) {
    els.openViewMenuBtn.setAttribute("aria-expanded", state.viewMenuOpen ? "true" : "false");
  }

  renderPackingFloatingProgress();

  if (els.viewMenu) {
    els.viewMenu.hidden = !state.viewMenuOpen;
  }

  if (els.topbarMenuShell) {
    els.topbarMenuShell.hidden = !(state.viewMenuOpen || state.phaseMenuOpen);
  }
}

function closeTopbarMenus() {
  state.viewMenuOpen = false;
  state.phaseMenuOpen = false;
  syncTopbarMenus();
}

function updateViewNavigation() {
  els.viewPanels.forEach((panel) => {
    panel.hidden = panel.dataset.viewPanel !== state.currentView;
  });

  syncTopbarMenus();
  scheduleChromeOffsetSync();
}

function switchView(viewId, options = {}) {
  if (!VIEW_OPTIONS.some((view) => view.id === viewId)) return;

  state.currentView = viewId;
  state.viewMenuOpen = false;
  state.phaseMenuOpen = false;
  if (!options.preserveSection) {
    state.activeSection = PRIMARY_VIEW_SECTION[viewId];
  }

  updateViewNavigation();

  if (!options.preserveScroll) {
    window.scrollTo({ top: 0, behavior: options.behavior || "auto" });
  }

  if (!options.skipHashSync) {
    syncHashFromState();
  }
}

function scrollToSection(sectionId, options = {}) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  const viewId = SECTION_TO_VIEW[sectionId];
  if (viewId) {
    switchView(viewId, { preserveSection: true, preserveScroll: true, skipHashSync: true });
  }

  window.requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: options.behavior || "smooth", block: "start" });
  });

  if (!options.skipHashSync) {
    state.activeSection = sectionId;
    syncHashFromState();
  }
}

function focusItineraryDay(dayId, options = {}) {
  if (!getDayById(dayId)) return;
  state.itineraryDayId = dayId;
  switchView("itinerary", { skipHashSync: true, preserveScroll: true });
  renderPhaseScopedSections();
  if (!options.skipScroll) {
    scrollToSection("daysSection", { skipHashSync: Boolean(options.skipHashSync) });
  } else if (!options.skipHashSync) {
    syncHashFromState();
  }
}

function focusAttraction(attractionId, options = {}) {
  const attraction = getAttractionById(attractionId);
  if (!attraction) return;
  state.attractionId = attractionId;
  if (state.attractionDayFilter !== "all" && !attraction.day_ids?.includes(state.attractionDayFilter)) {
    state.attractionDayFilter = attraction.primary_day_id || attraction.day_ids?.[0] || "all";
  }
  state.itineraryDayId = attraction.primary_day_id || attraction.day_ids?.[0] || state.itineraryDayId;
  switchView("attractions", { skipHashSync: true, preserveScroll: true });
  renderPhaseScopedSections();
  if (!options.skipScroll) {
    scrollToSection("gallerySection", { skipHashSync: Boolean(options.skipHashSync) });
  } else if (!options.skipHashSync) {
    syncHashFromState();
  }
}

function resetAttractionComposer() {
  state.attractionComposerText = "";
  state.attractionComposerImages = [];
  if (els.attractionCommunityImageInput) {
    els.attractionCommunityImageInput.value = "";
  }
}

function openAttractionCommunity(dayId, options = {}) {
  if (!getDayById(dayId)) return;
  const shouldResetComposer = state.itineraryDayId !== dayId || !state.attractionCommunityOpen;
  if (shouldResetComposer) {
    resetAttractionComposer();
  }
  closeTopbarMenus();
  state.itineraryDayId = dayId;
  state.attractionId = "";
  if (state.attractionDayFilter !== "all") {
    state.attractionDayFilter = dayId;
  }
  state.attractionCommunityImageIndex = Math.max(0, options.imageIndex || 0);
  switchView("attractions", { skipHashSync: true, preserveScroll: true });
  renderPhaseScopedSections();
  state.attractionCommunityOpen = true;
  state.attractionComposerOpen = Boolean(options.openComposer);
  els.attractionCommunityShell.hidden = false;
  renderAttractionCommunity();
  syncBodyLock();
  if (els.attractionCommunityScroll) {
    els.attractionCommunityScroll.scrollTo({ top: 0, behavior: "auto" });
  }
  if (options.openComposer) {
    window.setTimeout(() => {
      openAttractionComposer();
    }, 30);
  }
  if (!options.skipHashSync) {
    syncHashFromState();
  }
}

function closeAttractionCommunity(options = {}) {
  state.attractionCommunityOpen = false;
  state.attractionCommunityImageIndex = 0;
  state.attractionComposerOpen = false;
  resetAttractionComposer();
  renderAttractionCommunity();
  syncBodyLock();
  if (!options.skipHashSync) {
    syncHashFromState();
  }
}

function openAttractionComposer() {
  if (!state.attractionCommunityOpen) return;
  state.attractionComposerOpen = false;
  window.setTimeout(() => {
    const input = els.attractionCommunityComposeBar?.querySelector("[data-compose-input]");
    if (input instanceof HTMLInputElement) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, 30);
}

function closeAttractionComposer() {
  state.attractionComposerOpen = false;
  const input = els.attractionCommunityComposeBar?.querySelector("[data-compose-input]");
  if (input instanceof HTMLInputElement) {
    input.blur();
  }
}

function persistAttractionCommunityStore() {
  saveAttractionCommunityStore(attractionCommunityStore);
}

function getActiveAttractionStoryPoint() {
  const dayId = state.itineraryDayId;
  const images = getDayImageItems(dayId);
  if (!dayId || !images.length) return null;
  const safeIndex = ((state.attractionCommunityImageIndex % images.length) + images.length) % images.length;
  const image = images[safeIndex];
  if (!image) return null;

  return {
    dayId,
    image,
    pointKey: buildStoryPointKey(dayId, image, safeIndex),
    safeIndex,
  };
}

function updateAttractionReaction(pointKey, field) {
  attractionCommunityStore = toggleAttractionReaction(attractionCommunityStore, pointKey, field);
  persistAttractionCommunityStore();
  renderPhaseScopedSections();
  if (state.attractionCommunityOpen) {
    renderAttractionCommunity();
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function resizeImageDataUrl(dataUrl, maxEdge = 1400, quality = 0.82) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight, 1));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        resolve(dataUrl);
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    image.onerror = () => resolve(dataUrl);
    image.src = dataUrl;
  });
}

async function appendAttractionComposerImages(fileList) {
  const files = Array.from(fileList || []);
  const availableSlots = Math.max(0, 6 - state.attractionComposerImages.length);
  if (!availableSlots || !files.length) return;

  const prepared = await Promise.all(
    files.slice(0, availableSlots).map(async (file, index) => {
      const rawDataUrl = await readFileAsDataUrl(file);
      const src = await resizeImageDataUrl(rawDataUrl);
      return {
        id: `${Date.now()}-${index}-${file.name}`,
        name: file.name,
        src,
      };
    }),
  );

  state.attractionComposerImages = [...state.attractionComposerImages, ...prepared];
  renderAttractionCommunity();
}

function removeAttractionComposerImage(imageId) {
  state.attractionComposerImages = state.attractionComposerImages.filter((image) => image.id !== imageId);
  renderAttractionCommunity();
}

function navigateAttractionCommunityImage(delta) {
  if (!state.attractionCommunityOpen) return;
  const images = getDayImageItems(state.itineraryDayId);
  if (images.length < 2) return;
  state.attractionCommunityImageIndex = (
    state.attractionCommunityImageIndex + delta + images.length
  ) % images.length;
  renderAttractionCommunity();
}

function submitAttractionComment() {
  const activePoint = getActiveAttractionStoryPoint();
  const text = String(state.attractionComposerText || "").trim();
  if (!activePoint || (!text && !state.attractionComposerImages.length)) return;

  attractionCommunityStore = addAttractionComment(attractionCommunityStore, activePoint.pointKey, {
    id: `${Date.now()}`,
    author: "我",
    body: text || "发张现场图留个脚印。",
    createdAt: new Date().toISOString(),
    images: state.attractionComposerImages.map((image) => ({
      src: image.src,
    })),
    likes: 0,
  });
  persistAttractionCommunityStore();
  state.attractionComposerOpen = false;
  resetAttractionComposer();
  renderPhaseScopedSections();
  renderAttractionCommunity();
}

function setFocusedDay(dayId, options = {}) {
  if (!getDayById(dayId) || dayId === state.itineraryDayId) return false;
  state.itineraryDayId = dayId;
  renderPhaseScopedSections();
  if (!options.skipHashSync) {
    syncHashFromState();
  }
  return true;
}

function setAttractionDayFilter(dayFilter, options = {}) {
  if (!dayFilter || dayFilter === state.attractionDayFilter) return false;
  state.attractionDayFilter = dayFilter;
  if (dayFilter !== "all" && getDayById(dayFilter)) {
    state.itineraryDayId = dayFilter;
  }
  renderPhaseScopedSections();
  if (!options.skipHashSync) {
    syncHashFromState();
  }
  return true;
}

function openSearch() {
  closeTopbarMenus();
  state.searchOpen = true;
  els.searchShell.hidden = false;
  syncBodyLock();
  renderSearchResults();
  window.setTimeout(() => {
    els.searchInput.focus();
    els.searchInput.select();
  }, 30);
}

function clearSearch() {
  state.searchQuery = "";
  state.searchMode = "all";
  if (els.searchInput) {
    els.searchInput.value = "";
    els.searchInput.focus();
  }
  renderSearchResults();
}

function closeSearch() {
  state.searchOpen = false;
  els.searchShell.hidden = true;
  syncBodyLock();
}

function openDayDetail(dayId, options = {}) {
  const day = getDayById(dayId);
  if (!day) return;

  closeTopbarMenus();
  state.itineraryDayId = day.id;
  state.detailDayId = day.id;
  state.detailTab = getSafeDetailTab(options.tab || "route");
  state.detailImageIndex = options.imageIndex ?? 0;
  state.sourceFocusSequence = options.sourceSeq ?? null;
  state.detailOpen = true;
  els.detailShell.hidden = false;
  if (els.detailSheet) {
    els.detailSheet.scrollTo({ top: 0, behavior: "auto" });
  }
  if (!options.preserveSearch) {
    closeSearch();
  }
  syncBodyLock();
  renderDetail();
  if (!options.skipHashSync) {
    syncHashFromState();
  }
}

function closeDetail(options = {}) {
  state.detailOpen = false;
  els.detailShell.hidden = true;
  if (!options.keepLightbox) {
    closeLightbox({ skipHashSync: true });
  }
  syncBodyLock();
  if (!options.skipHashSync) {
    syncHashFromState();
  }
}

function openLightbox(dayId, index, options = {}) {
  const images = getDayImageItems(dayId);
  if (!images.length) return;

  closeTopbarMenus();
  state.lightboxDayId = dayId;
  state.lightboxIndex = index;
  state.lightboxOpen = true;
  els.lightboxShell.hidden = false;
  lightboxTouchStartX = 0;
  lightboxTouchStartY = 0;
  syncBodyLock();
  renderLightbox();
  if (state.detailOpen) {
    renderDetail();
  }
  if (!options.skipHashSync) {
    syncHashFromState();
  }
}

function closeLightbox(options = {}) {
  state.lightboxOpen = false;
  els.lightboxShell.hidden = true;
  syncBodyLock();
  if (!options.skipHashSync) {
    syncHashFromState();
  }
}

function navigateLightbox(delta) {
  if (!state.lightboxOpen) return;
  const images = getDayImageItems(state.lightboxDayId);
  if (!images.length) return;

  state.lightboxIndex = (state.lightboxIndex + delta + images.length) % images.length;
  renderLightbox();
  if (state.detailOpen) {
    renderDetail();
  }
  syncHashFromState();
}

function jumpToSource(sequence, options = {}) {
  state.detailTab = "source";
  state.sourceFocusSequence = sequence;
  closeLightbox({ skipHashSync: true });
  renderDetail();
  if (!options.skipHashSync) {
    syncHashFromState();
  }
}

function renderPhaseScopedSections() {
  const days = getPhaseDays();
  renderPhasePicker();
  renderPitfallFilters();
  renderPitfalls();
  renderAttractionDateRail(days);
  renderFeaturedGallery(days);
  renderDateRail(days);
  renderItineraryChapter(days);
  if (state.attractionCommunityOpen) {
    renderAttractionCommunity();
  }
  if (state.detailOpen) {
    renderDetail();
  }
}

function updateScrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
  els.scrollProgress.style.width = `${progress * 100}%`;
  syncChecklistSectionFromViewport();
}

function syncChecklistSectionFromViewport() {
  if (state.currentView !== "checklist") return;

  const anchor = Number.parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--chrome-top-offset"),
    10,
  ) || 88;

  let nextSectionId = CHECKLIST_TOPBAR_ITEMS[0]?.id || "packingSection";
  CHECKLIST_TOPBAR_ITEMS.forEach((item) => {
    const section = document.getElementById(item.id);
    if (!section) return;
    if (section.getBoundingClientRect().top - anchor <= 28) {
      nextSectionId = item.id;
    }
  });

  if (state.activeSection !== nextSectionId) {
    state.activeSection = nextSectionId;
  }
}

function handlePackingChange(input) {
  const key = input.dataset.packKey;
  if (!key) return;
  state.packing[key] = input.checked;
  saveJsonStorage(PACKING_STORAGE_KEY, state.packing);
  renderPacking();
}

function resetPackingGroup(groupId) {
  Object.keys(state.packing)
    .filter((key) => key.startsWith(`${groupId}-`))
    .forEach((key) => {
      delete state.packing[key];
    });
  saveJsonStorage(PACKING_STORAGE_KEY, state.packing);
  renderPacking();
}

function togglePackingGroup(groupId) {
  state.packingOpenGroups[groupId] = !state.packingOpenGroups[groupId];
  savePackingGroupState(state.packingOpenGroups);
  renderPacking();
}

function setAllPackingGroups(open) {
  const packingGroups = selectors.getTripEditorial().packingGroups || [];
  packingGroups.forEach((group) => {
    state.packingOpenGroups[group.id] = open;
  });
  savePackingGroupState(state.packingOpenGroups);
  renderPacking();
}

function resetAllPacking() {
  state.packing = {};
  saveJsonStorage(PACKING_STORAGE_KEY, state.packing);
  renderPacking();
}

function normalizeTripData(trip = {}) {
  const editorial = trip.editorial || {};
  return {
    ...trip,
    attractionIds: trip.attractionIds || trip.attraction_ids || [],
    dayIds: trip.dayIds || trip.day_ids || [],
    editorial: {
      bookingTimeline: editorial.bookingTimeline || [],
      bookingToolCards: editorial.bookingToolCards || [],
      globalNotes: editorial.globalNotes || [],
      heroHighlightCards: editorial.heroHighlightCards || [],
      overviewCards: editorial.overviewCards || [],
      packingGroups: editorial.packingGroups || [],
      phaseOptions: editorial.phaseOptions || [],
      pitfallCategories: editorial.pitfallCategories || [],
      pitfallTemplates: editorial.pitfallTemplates || [],
      riskNotes: editorial.riskNotes || [],
      routeSpine: editorial.routeSpine || [],
    },
    routeStops: trip.routeStops || trip.route_stops || [],
    themeIds: trip.themeIds || trip.theme_ids || [],
  };
}

function syncPackingGroupStateFromBlueprint() {
  const packingGroups = selectors.getTripEditorial().packingGroups || [];
  if (!packingGroups.length) return;

  const nextState = { ...state.packingOpenGroups };
  let changed = false;
  packingGroups.forEach((group) => {
    if (group.id in nextState) return;
    nextState[group.id] = true;
    changed = true;
  });

  if (!changed) return;
  state.packingOpenGroups = nextState;
  savePackingGroupState(nextState);
}

async function loadGuideBlueprint() {
  resetSourceStoreData();
  const response = await fetch(BLUEPRINT_PATH, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load blueprint: ${response.status}`);
  }

  const payload = await response.json();
  sourceStore.trip = normalizeTripData(payload.trip || {});
  sourceStore.dayOrder = sourceStore.trip.dayIds || (payload.days || []).map((day) => day.id);
  sourceStore.stats = payload.stats || null;
  sourceStore.themesById = Object.fromEntries((payload.themes || []).map((theme) => [theme.id, theme]));
  sourceStore.attractionsById = Object.fromEntries(
    (payload.attractions || []).map((attraction) => [attraction.id, attraction]),
  );
  sourceStore.attractionOrder = (payload.attractions || []).map((attraction) => attraction.id);
  const rawMediaBySequence = Object.fromEntries(
    (payload.media || []).map((image) => [Number(image.sequence), image]),
  );
  sourceStore.byDayId = Object.fromEntries(
    (payload.days || []).map((day) => {
      const hydratedDay = hydrateDayEntry({
        ...day,
        images: (day.images || []).map((image) => ({
          ...(rawMediaBySequence[Number(image.sequence)] || image),
          ...image,
        })),
      });

      return [hydratedDay.id, hydratedDay];
    }),
  );
  sourceStore.mediaBySequence = Object.fromEntries(
    (payload.media || []).map((image) => {
      const normalizedImage = {
        ...(sourceStore.byDayId[image.day_id || image.dayId]?.images || []).find(
          (candidate) => Number(candidate.sequence) === Number(image.sequence),
        ) || image,
      };
      return [Number(image.sequence), normalizedImage];
    }),
  );
  sourceStore.ready = true;
  sourceStore.mode = "blueprint";
  sourceStore.loadError = "";
  syncPackingGroupStateFromBlueprint();
}

function applyToolAction({ kind, target = "", dayId = "", tab = "", phase = "", category = "" }, options = {}) {
  if (kind === "scroll" && target) {
    scrollToSection(target === "toolsSection" ? "toolsSection" : target, options);
    return;
  }

  if (kind === "phase" && phase) {
    state.phase = phase;
    renderPhaseScopedSections();
    scrollToSection("daysSection", options);
    return;
  }

  if (kind === "pitfall" && category) {
    state.pitfallCategory = category;
    renderPitfallFilters();
    renderPitfalls();
    scrollToSection("overviewSection", options);
    if (!options.skipHashSync) {
      syncHashFromState();
    }
    return;
  }

  if (kind === "day" && dayId) {
    openDayDetail(dayId, { tab: tab || "route", skipHashSync: options.skipHashSync });
  }
}

function handleSearchResult(button) {
  const kind = button.dataset.resultKind || "";
  const dayId = button.dataset.resultDay;
  const tab = button.dataset.resultTab || "route";
  const imageSequence = button.dataset.resultImage;
  const attractionId = button.dataset.resultAttraction;
  const toolTarget = button.dataset.resultTool;
  const pitfallCategory = button.dataset.resultPitfall;

  if (kind === "attraction" && attractionId) {
    const attraction = getAttractionById(attractionId);
    const targetDayId = attraction?.primary_day_id || attraction?.day_ids?.[0] || "";
    if (targetDayId) {
      openAttractionCommunity(targetDayId);
    }
    closeSearch();
    return;
  }

  if (kind === "tool" && toolTarget) {
    if (pitfallCategory) {
      state.pitfallCategory = pitfallCategory;
      renderPitfallFilters();
      renderPitfalls();
    }
    switchView(toolTarget === "overviewSection" ? "overview" : "checklist", { skipHashSync: true, preserveScroll: true });
    closeSearch();
    scrollToSection(toolTarget);
    return;
  }

  if (!dayId) return;

  if (imageSequence) {
    if (attractionId) {
      focusAttraction(attractionId, { skipScroll: true, skipHashSync: true });
    } else {
      switchView("attractions", { skipHashSync: true, preserveScroll: true });
    }
    const imageIndex = findImageIndexBySequence(dayId, Number(imageSequence));
    openDayDetail(dayId, { tab: "route", imageIndex, skipHashSync: true });
    openLightbox(dayId, Math.max(imageIndex, 0));
    closeSearch();
    return;
  }

  if (kind === "source") {
    focusItineraryDay(dayId, { skipScroll: true, skipHashSync: true });
    openDayDetail(dayId, { tab });
    return;
  }

  if (kind === "day") {
    focusItineraryDay(dayId);
    closeSearch();
    return;
  }

  focusItineraryDay(dayId, { skipScroll: true, skipHashSync: true });
  openDayDetail(dayId, { tab });
}

const router = createRouter({
  state,
  getDayImageItems,
  findImageIndexBySequence,
  switchView,
  openDayDetail,
  openLightbox,
  focusItineraryDay,
  focusAttraction,
  renderPhaseScopedSections,
  scrollToSection,
});

syncHashFromState = router.syncHashFromState;
parseHashAndApply = router.parseHashAndApply;

function bindEvents() {
  els.openSearchBtn?.addEventListener("click", openSearch);

  els.openViewMenuBtn?.addEventListener("click", () => {
    state.viewMenuOpen = !state.viewMenuOpen;
    state.phaseMenuOpen = false;
    syncTopbarMenus();
  });

  els.phasePickerBtn?.addEventListener("click", () => {
    state.phaseMenuOpen = !state.phaseMenuOpen;
    state.viewMenuOpen = false;
    syncTopbarMenus();
  });

  els.topbarMenuBackdrop?.addEventListener("click", closeTopbarMenus);

  els.viewMenu?.addEventListener("click", (event) => {
    const viewId = event.target.closest("[data-view]")?.dataset.view;
    if (!viewId) return;
    switchView(viewId);
  });

  els.heroActions.addEventListener("click", (event) => {
    const amapTest = event.target.closest("[data-amap-test]")?.dataset.amapTest;
    if (amapTest) {
      openAmapTestRoute(amapTest);
      return;
    }

    const button = event.target.closest("[data-view-switch]");
    if (!button) return;
    const viewId = button.dataset.viewSwitch;
    const target = button.dataset.scrollTarget;
    if (!viewId) return;
    switchView(viewId, { skipHashSync: Boolean(target) });
    if (target) {
      scrollToSection(target);
    }
  });

  els.searchInput.addEventListener("input", (event) => {
    state.searchQuery = event.target.value || "";
    renderSearchResults();
  });

  els.searchClearBtn?.addEventListener("click", clearSearch);

  els.searchFilters.addEventListener("click", (event) => {
    const mode = event.target.closest("[data-search-mode]")?.dataset.searchMode;
    if (!mode || mode === state.searchMode) return;
    state.searchMode = mode;
    renderSearchResults();
  });

  els.searchShell.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-search]")) {
      closeSearch();
    }
  });

  els.detailShell.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-detail]")) {
      closeDetail();
    }
  });

  els.overviewTools.addEventListener("click", (event) => {
    const target = event.target.closest("[data-scroll-target]")?.dataset.scrollTarget;
    if (!target) return;
    scrollToSection(target);
  });

  els.amapTestGrid?.addEventListener("click", (event) => {
    const amapTest = event.target.closest("[data-amap-test]")?.dataset.amapTest;
    if (!amapTest) return;
    openAmapTestRoute(amapTest);
  });

  els.phaseFilter?.addEventListener("click", (event) => {
    const nextPhase = event.target.closest("[data-phase]")?.dataset.phase;
    const checklistTarget = event.target.closest("[data-checklist-target]")?.dataset.checklistTarget;
    if (checklistTarget) {
      closeTopbarMenus();
      scrollToSection(checklistTarget);
      return;
    }
    if (!nextPhase || nextPhase === state.phase) return;
    state.phase = nextPhase;
    closeTopbarMenus();
    renderPhaseScopedSections();
  });

  els.dateRail.addEventListener("click", (event) => {
    const nextDayId = event.target.closest("[data-focus-day]")?.dataset.focusDay;
    if (!nextDayId) return;
    setFocusedDay(nextDayId);
  });

  els.attractionDateRail?.addEventListener("click", (event) => {
    const nextFilter = event.target.closest("[data-attraction-day-filter]")?.dataset.attractionDayFilter;
    if (!nextFilter) return;
    setAttractionDayFilter(nextFilter);
  });

  els.pitfallFilters.addEventListener("click", (event) => {
    const category = event.target.closest("[data-pitfall-category]")?.dataset.pitfallCategory;
    if (!category || category === state.pitfallCategory) return;
    state.pitfallCategory = category;
    renderPitfallFilters();
    renderPitfalls();
    syncHashFromState();
  });

  els.pitfallList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-day]");
    const dayId = button?.dataset.openDay;
    if (!dayId) return;
    openDayDetail(dayId, { tab: button.dataset.openTab || "route" });
  });

  els.featuredGallery.addEventListener("click", (event) => {
    const storyDayId = event.target.closest("[data-open-attraction-story]")?.dataset.openAttractionStory;
    if (!storyDayId) return;
    openAttractionCommunity(storyDayId);
  });

  els.daysContainer.addEventListener("click", (event) => {
    const focusDay = event.target.closest("[data-focus-day]")?.dataset.focusDay;
    if (focusDay) {
      setFocusedDay(focusDay);
      return;
    }

    const inlineLightboxSequence = event.target.closest("[data-inline-lightbox-seq]")?.dataset.inlineLightboxSeq;
    if (inlineLightboxSequence && state.itineraryDayId) {
      const imageIndex = Math.max(findImageIndexBySequence(state.itineraryDayId, Number(inlineLightboxSequence)), 0);
      openLightbox(state.itineraryDayId, imageIndex);
      return;
    }

    const switchButton = event.target.closest("[data-view-switch]");
    if (switchButton) {
      const viewId = switchButton.dataset.viewSwitch;
      const target = switchButton.dataset.scrollTarget;
      if (!viewId) return;
      switchView(viewId, { skipHashSync: Boolean(target) });
      if (target) {
        scrollToSection(target);
      }
      return;
    }

    const attractionId = event.target.closest("[data-open-attraction]")?.dataset.openAttraction;
    if (attractionId) {
      focusAttraction(attractionId);
      return;
    }

    const button = event.target.closest("[data-open-day]");
    const dayId = button?.dataset.openDay;
    if (!dayId) return;
    const tab = button.dataset.openTab || "route";
    const sourceSeq = button.dataset.openSourceSeq ? Number(button.dataset.openSourceSeq) : null;
    openDayDetail(dayId, { tab, sourceSeq });
  });

  els.bookingTools.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tool-kind]");
    if (!button) return;
    applyToolAction({
      kind: button.dataset.toolKind || "",
      target: button.dataset.toolTarget || "",
      dayId: button.dataset.toolDay || "",
      tab: button.dataset.toolTab || "",
      phase: button.dataset.toolPhase || "",
      category: button.dataset.toolCategory || "",
    });
  });

  els.searchResults.addEventListener("click", (event) => {
    const button = event.target.closest("[data-result-kind]");
    if (!button) return;
    handleSearchResult(button);
  });

  els.detailLeadImage.addEventListener("click", () => {
    if (!state.detailDayId) return;
    openLightbox(state.detailDayId, state.detailImageIndex);
  });

  els.detailGalleryRail.addEventListener("click", (event) => {
    const index = event.target.closest("[data-open-lightbox-index]")?.dataset.openLightboxIndex;
    if (index === undefined || !state.detailDayId) return;
    openLightbox(state.detailDayId, Number(index) || 0);
  });

  els.detailTabs.addEventListener("click", (event) => {
    const nextTab = event.target.closest("[data-tab]")?.dataset.tab;
    if (!nextTab || nextTab === state.detailTab) return;
    state.detailTab = getSafeDetailTab(nextTab);
    state.sourceFocusSequence = null;
    renderDetail();
    if (els.detailSheet) {
      els.detailSheet.scrollTo({ top: 0, behavior: "smooth" });
    }
    syncHashFromState();
  });

  els.detailBody.addEventListener("click", (event) => {
    const lightboxIndex = event.target.closest("[data-open-lightbox-index]")?.dataset.openLightboxIndex;
    if (lightboxIndex !== undefined) {
      openLightbox(state.detailDayId, Number(lightboxIndex) || 0);
      return;
    }

    const sourceSeq = event.target.closest("[data-jump-source-seq]")?.dataset.jumpSourceSeq;
    if (sourceSeq) {
      jumpToSource(Number(sourceSeq));
    }
  });

  els.lightboxShell.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-lightbox]")) {
      closeLightbox();
      return;
    }

    const direction = event.target.closest("[data-lightbox-nav]")?.dataset.lightboxNav;
    if (direction === "prev") {
      navigateLightbox(-1);
    } else if (direction === "next") {
      navigateLightbox(1);
    }
  });

  els.lightboxFrame?.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1) return;
    lightboxTouchStartX = event.touches[0].clientX;
    lightboxTouchStartY = event.touches[0].clientY;
  }, { passive: true });

  els.lightboxFrame?.addEventListener("touchend", (event) => {
    if (!lightboxTouchStartX || !lightboxTouchStartY || event.changedTouches.length !== 1) return;
    const deltaX = event.changedTouches[0].clientX - lightboxTouchStartX;
    const deltaY = event.changedTouches[0].clientY - lightboxTouchStartY;
    lightboxTouchStartX = 0;
    lightboxTouchStartY = 0;

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    navigateLightbox(deltaX < 0 ? 1 : -1);
  }, { passive: true });

  els.lightboxSourceBtn.addEventListener("click", () => {
    const daySource = getDaySource(state.lightboxDayId);
    const image = daySource?.images?.[state.lightboxIndex];
    if (!image) return;
    jumpToSource(image.sequence);
  });

  els.attractionCommunityShell?.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-attraction-community]")) {
      closeAttractionCommunity();
      return;
    }

    const reactionButton = event.target.closest("[data-story-reaction]");
    if (reactionButton instanceof HTMLElement) {
      const pointKey = reactionButton.dataset.storyReaction;
      const field = reactionButton.dataset.storyReactionField;
      if (pointKey && field) {
        updateAttractionReaction(pointKey, field);
      }
      return;
    }

    if (event.target.closest("[data-open-community-composer]")) {
      openAttractionComposer();
      return;
    }

    const imageDirection = event.target.closest("[data-community-image-nav]")?.dataset.communityImageNav;
    if (imageDirection === "prev") {
      navigateAttractionCommunityImage(-1);
      return;
    }
    if (imageDirection === "next") {
      navigateAttractionCommunityImage(1);
      return;
    }

  });

  els.attractionCommunityHero?.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1) return;
    attractionCommunityTouchStartX = event.touches[0].clientX;
    attractionCommunityTouchStartY = event.touches[0].clientY;
  }, { passive: true });

  els.attractionCommunityHero?.addEventListener("touchend", (event) => {
    if (!attractionCommunityTouchStartX || !attractionCommunityTouchStartY || event.changedTouches.length !== 1) return;
    const deltaX = event.changedTouches[0].clientX - attractionCommunityTouchStartX;
    const deltaY = event.changedTouches[0].clientY - attractionCommunityTouchStartY;
    attractionCommunityTouchStartX = 0;
    attractionCommunityTouchStartY = 0;

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    navigateAttractionCommunityImage(deltaX < 0 ? 1 : -1);
  }, { passive: true });

  els.attractionCommunityComposeBar?.addEventListener("input", (event) => {
    const input = event.target.closest("[data-compose-input]");
    if (!(input instanceof HTMLInputElement)) return;
    state.attractionComposerText = input.value;
  });

  els.attractionCommunityComposeBar?.addEventListener("keydown", (event) => {
    const input = event.target.closest("[data-compose-input]");
    if (!(input instanceof HTMLInputElement)) return;
    if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    submitAttractionComment();
  });

  els.attractionCommunityImageInput?.addEventListener("change", async (event) => {
    await appendAttractionComposerImages(event.target.files);
    event.target.value = "";
  });

  els.attractionCommunitySubmit?.addEventListener("click", () => {
    submitAttractionComment();
  });

  els.packingActions.addEventListener("click", (event) => {
    const action = event.target.closest("[data-pack-action]")?.dataset.packAction;
    if (!action) return;
    if (action === "expand") setAllPackingGroups(true);
    if (action === "collapse") setAllPackingGroups(false);
    if (action === "reset") resetAllPacking();
  });

  els.packingList.addEventListener("change", (event) => {
    const input = event.target.closest("[data-pack-key]");
    if (!(input instanceof HTMLInputElement)) return;
    handlePackingChange(input);
  });

  els.packingList.addEventListener("click", (event) => {
    const groupToggle = event.target.closest("[data-toggle-pack-group]")?.dataset.togglePackGroup;
    if (groupToggle) {
      togglePackingGroup(groupToggle);
      return;
    }

    const groupReset = event.target.closest("[data-reset-pack]")?.dataset.resetPack;
    if (groupReset) {
      resetPackingGroup(groupReset);
    }
  });

  els.packingFloatingProgress?.addEventListener("click", () => {
    scrollToSection("packingSection");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (state.viewMenuOpen || state.phaseMenuOpen) {
        closeTopbarMenus();
        return;
      }
      if (state.lightboxOpen) {
        closeLightbox();
        return;
      }
      if (state.attractionCommunityOpen) {
        closeAttractionCommunity();
        return;
      }
      if (state.detailOpen) {
        closeDetail();
        return;
      }
      if (state.searchOpen) {
        closeSearch();
      }
      return;
    }

    if (state.lightboxOpen && event.key === "ArrowLeft") {
      navigateLightbox(-1);
    }

    if (state.lightboxOpen && event.key === "ArrowRight") {
      navigateLightbox(1);
    }
  });

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", scheduleViewportMetricSync, { passive: true });
  window.addEventListener("orientationchange", scheduleViewportMetricSync, { passive: true });
  window.addEventListener("hashchange", parseHashAndApply);
}

async function init() {
  try {
    await loadGuideBlueprint();
  } catch (error) {
    sourceStore.loadError = error instanceof Error ? error.message : "unknown error";
    console.error(error);
  }

  renderHeroHighlights();
  renderRouteStrip();
  renderOverviewFacts();
  renderAmapTests();
  renderOverviewTools();
  renderBookingTools();
  renderBooking();
  renderGlobalNotes();
  renderPacking();
  renderPhaseScopedSections();
  renderHeroMedia();
  renderSearchResults();
  updateViewNavigation();
  bindEvents();
  bindChromeObservers();
  bindViewportObservers();
  scheduleViewportMetricSync();
  updateScrollProgress();
  if (state.detailOpen) {
    renderDetail();
  }
  parseHashAndApply();
}

void init();
