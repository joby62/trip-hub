import { PRIMARY_VIEW_SECTION } from "./config.js";

function buildHash(paramsObject = {}) {
  const params = new URLSearchParams();
  Object.entries(paramsObject).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    params.set(key, String(value));
  });
  return params.toString();
}

function createRouter({
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
}) {
  let hashSyncSuspended = false;

  function setHash(paramsObject = {}) {
    const hash = buildHash(paramsObject);
    const nextUrl = `${window.location.pathname}${window.location.search}${hash ? `#${hash}` : ""}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (currentUrl === nextUrl) return;

    hashSyncSuspended = true;
    history.replaceState(null, "", nextUrl);
    window.setTimeout(() => {
      hashSyncSuspended = false;
    }, 0);
  }

  function syncHashFromState() {
    if (state.lightboxOpen && state.lightboxDayId) {
      const images = getDayImageItems(state.lightboxDayId);
      const image = images[state.lightboxIndex];
      setHash({
        view: state.currentView,
        image: image ? `${state.lightboxDayId}:${image.sequence}` : state.lightboxDayId,
        tab: "gallery",
      });
      return;
    }

    if (state.detailOpen && state.detailDayId) {
      setHash({
        view: state.currentView,
        day: state.detailDayId,
        tab: state.detailTab,
        attraction: state.attractionId && state.currentView === "attractions" ? state.attractionId : "",
        source: state.detailTab === "source" && state.sourceFocusSequence ? state.sourceFocusSequence : "",
      });
      return;
    }

    const params = { view: state.currentView };
    if (state.currentView === "itinerary" && state.itineraryDayId) {
      params.day = state.itineraryDayId;
    }
    if (state.currentView === "attractions" && state.attractionId) {
      params.attraction = state.attractionId;
    }
    if (state.pitfallCategory !== "all") {
      params.tool = `pitfalls:${state.pitfallCategory}`;
    } else if (state.activeSection && state.activeSection !== PRIMARY_VIEW_SECTION[state.currentView]) {
      params.tool = state.activeSection;
    }
    setHash(params);
  }

  function parseHashAndApply() {
    if (hashSyncSuspended) return;

    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const params = new URLSearchParams(hash);
    const viewParam = params.get("view");

    if (viewParam) {
      switchView(viewParam, { skipHashSync: true, preserveScroll: true });
    }

    const attractionParam = params.get("attraction");
    if (attractionParam) {
      focusAttraction(attractionParam, { skipScroll: true, skipHashSync: true });
    }

    const imageParam = params.get("image");
    if (imageParam) {
      const [dayId, sequence] = imageParam.split(":");
      const imageIndex = sequence ? findImageIndexBySequence(dayId, Number(sequence)) : 0;
      switchView(viewParam || "attractions", { skipHashSync: true, preserveScroll: true });
      openDayDetail(dayId, { tab: "route", imageIndex: Math.max(imageIndex, 0), skipHashSync: true });
      openLightbox(dayId, Math.max(imageIndex, 0), { skipHashSync: true });
      return;
    }

    const dayParam = params.get("day");
    if (dayParam) {
      const requestedTab = params.get("tab") || "";
      const sourceSeq = params.get("source") ? Number(params.get("source")) : null;
      if (!requestedTab && !sourceSeq) {
        focusItineraryDay(dayParam, { skipScroll: true, skipHashSync: true });
        return;
      }

      switchView(viewParam || "itinerary", { skipHashSync: true, preserveScroll: true });
      openDayDetail(dayParam, {
        tab: requestedTab || "route",
        sourceSeq,
        skipHashSync: true,
      });
      return;
    }

    const toolParam = params.get("tool");
    if (toolParam?.startsWith("pitfalls:")) {
      state.pitfallCategory = toolParam.split(":")[1] || "all";
      renderPhaseScopedSections();
      switchView("overview", { skipHashSync: true, preserveScroll: true });
      scrollToSection("overviewSection", { skipHashSync: true });
      return;
    }

    if (toolParam) {
      scrollToSection(toolParam, { skipHashSync: true });
    }
  }

  return {
    buildHash,
    parseHashAndApply,
    setHash,
    syncHashFromState,
  };
}

export {
  buildHash,
  createRouter,
};
