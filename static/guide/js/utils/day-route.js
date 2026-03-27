import { buildAmapAppRouteUrl, getMobilePlatform } from "../services/amap.js";

function getAmapRoutePlatform() {
  return getMobilePlatform() === "ios" ? "ios" : "android";
}

function buildInlineRouteUrl({ start = null, destination = null, viaPoints = [], travelType = "0" } = {}) {
  if (!destination?.name) return "";

  return buildAmapAppRouteUrl(getAmapRoutePlatform(), {
    start,
    destination,
    viaPoints,
    travelType,
  });
}

export {
  buildInlineRouteUrl,
  getAmapRoutePlatform,
};
