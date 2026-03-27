import { ATTRACTION_COMMUNITY_STORAGE_KEY } from "../config.js";
import { loadJsonStorage, saveJsonStorage } from "./storage.js";

function normalizeCommunityStore(store) {
  return {
    comments: store?.comments || {},
    reactions: store?.reactions || {},
  };
}

function loadAttractionCommunityStore() {
  return normalizeCommunityStore(loadJsonStorage(ATTRACTION_COMMUNITY_STORAGE_KEY, null));
}

function saveAttractionCommunityStore(store) {
  saveJsonStorage(ATTRACTION_COMMUNITY_STORAGE_KEY, normalizeCommunityStore(store));
}

function toggleAttractionReaction(store, attractionId, field) {
  const nextStore = normalizeCommunityStore(store);
  const previous = nextStore.reactions[attractionId] || { liked: false, saved: false };
  nextStore.reactions = {
    ...nextStore.reactions,
    [attractionId]: {
      ...previous,
      [field]: !previous[field],
    },
  };
  return nextStore;
}

function addAttractionComment(store, attractionId, comment) {
  const nextStore = normalizeCommunityStore(store);
  const comments = nextStore.comments[attractionId] || [];
  nextStore.comments = {
    ...nextStore.comments,
    [attractionId]: [comment, ...comments],
  };
  return nextStore;
}

export {
  addAttractionComment,
  loadAttractionCommunityStore,
  saveAttractionCommunityStore,
  toggleAttractionReaction,
};
