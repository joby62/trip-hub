import {
  PACKING_STORAGE_KEY,
} from "./config.js";
import {
  loadJsonStorage,
  loadPackingGroupState,
} from "./services/storage.js";

const sourceStore = {
  ready: false,
  mode: "",
  trip: null,
  dayOrder: [],
  stats: null,
  byDayId: {},
  themesById: {},
  attractionsById: {},
  attractionOrder: [],
  mediaBySequence: {},
  loadError: "",
};

const state = {
  currentView: "itinerary",
  phase: "all",
  itineraryDayId: "day1",
  attractionDayFilter: "all",
  attractionId: "",
  searchQuery: "",
  searchMode: "all",
  searchOpen: false,
  detailOpen: false,
  detailDayId: "",
  detailTab: "route",
  detailImageIndex: 0,
  sourceFocusSequence: null,
  lightboxOpen: false,
  lightboxDayId: "",
  lightboxIndex: 0,
  pitfallCategory: "all",
  activeSection: "daysSection",
  viewMenuOpen: false,
  phaseMenuOpen: false,
  packing: loadJsonStorage(PACKING_STORAGE_KEY, {}),
  packingOpenGroups: loadPackingGroupState([]),
};

function resetSourceStoreData() {
  sourceStore.ready = false;
  sourceStore.mode = "";
  sourceStore.trip = null;
  sourceStore.dayOrder = [];
  sourceStore.stats = null;
  sourceStore.byDayId = {};
  sourceStore.themesById = {};
  sourceStore.attractionsById = {};
  sourceStore.attractionOrder = [];
  sourceStore.mediaBySequence = {};
  sourceStore.loadError = "";
}

export {
  resetSourceStoreData,
  sourceStore,
  state,
};
