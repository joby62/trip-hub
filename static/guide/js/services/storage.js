import {
  PACKING_GROUP_STORAGE_KEY,
} from "../config.js";

function loadJsonStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJsonStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures.
  }
}

function loadPackingGroupState(groups = []) {
  const stored = loadJsonStorage(PACKING_GROUP_STORAGE_KEY, null);
  if (stored) {
    return stored;
  }

  return Object.fromEntries(groups.map((group) => [group.id, true]));
}

function savePackingGroupState(value) {
  saveJsonStorage(PACKING_GROUP_STORAGE_KEY, value);
}

export {
  loadJsonStorage,
  loadPackingGroupState,
  saveJsonStorage,
  savePackingGroupState,
};
