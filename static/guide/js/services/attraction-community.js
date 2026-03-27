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

function toggleAttractionReaction(store, pointKey, field) {
  const nextStore = normalizeCommunityStore(store);
  const previous = nextStore.reactions[pointKey] || {
    downed: false,
    liked: false,
    upped: false,
  };
  const nextValue = !previous[field];
  const mutualExclusiveReset = field === "upped" || field === "downed"
    ? {
        downed: false,
        upped: false,
      }
    : {};
  nextStore.reactions = {
    ...nextStore.reactions,
    [pointKey]: {
      ...previous,
      ...mutualExclusiveReset,
      [field]: nextValue,
    },
  };
  return nextStore;
}

function addAttractionComment(store, pointKey, comment) {
  const nextStore = normalizeCommunityStore(store);
  const comments = nextStore.comments[pointKey] || [];
  nextStore.comments = {
    ...nextStore.comments,
    [pointKey]: [comment, ...comments],
  };
  return nextStore;
}

export {
  addAttractionComment,
  loadAttractionCommunityStore,
  saveAttractionCommunityStore,
  toggleAttractionReaction,
};
