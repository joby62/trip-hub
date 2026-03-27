import {
  AMAP_SOURCE_APPLICATION,
  AMAP_TEST_SCENARIOS,
} from "../config.js";

function getMobilePlatform() {
  const userAgent = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return "ios";
  }
  if (/Android/i.test(userAgent)) {
    return "android";
  }
  return "unknown";
}

function buildQueryString(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    query.set(key, String(value));
  });
  return query.toString();
}

function formatPosition(point) {
  return `${point.lon},${point.lat}${point.name ? `,${point.name}` : ""}`;
}

function buildAmapWebNavigationUrl(config) {
  const query = buildQueryString({
    from: config.start ? formatPosition(config.start) : "",
    to: formatPosition(config.destination),
    via: config.via ? formatPosition(config.via) : "",
    mode: config.mode || "car",
    policy: config.mode === "car" ? (config.policy || "0") : "",
    src: AMAP_SOURCE_APPLICATION,
    callnative: "1",
  });

  return `https://uri.amap.com/navigation?${query}`;
}

function buildAmapAppRouteUrl(platform, config) {
  const viaPoints = config.viaPoints || [];
  const query = buildQueryString({
    sourceApplication: AMAP_SOURCE_APPLICATION,
    sid: config.start?.poiId || "",
    slat: config.start?.lat ?? "",
    slon: config.start?.lon ?? "",
    sname: config.start?.name || "",
    did: config.destination?.poiId || "",
    dlat: config.destination.lat,
    dlon: config.destination.lon,
    dname: config.destination.name,
    dev: "0",
    t: config.travelType || "0",
    vian: viaPoints.length || "",
    vialons: viaPoints.length ? viaPoints.map((point) => point.lon).join("|") : "",
    vialats: viaPoints.length ? viaPoints.map((point) => point.lat).join("|") : "",
    vianames: viaPoints.length ? viaPoints.map((point) => point.name || "").join("|") : "",
  });

  if (platform === "ios") {
    return `iosamap://path?${query}`;
  }

  return `amapuri://route/plan/?${query}`;
}

function getAmapTestScenario(testId) {
  return AMAP_TEST_SCENARIOS.find((scenario) => scenario.id === testId) || null;
}

function buildAmapTestUrl(testId, platform = getMobilePlatform()) {
  const scenario = getAmapTestScenario(testId);
  if (!scenario) return "";

  if (scenario.type === "web") {
    return buildAmapWebNavigationUrl(scenario.web);
  }

  if (platform === "unknown") {
    return "";
  }

  return buildAmapAppRouteUrl(platform, scenario.app);
}

function openAmapTestRoute(testId) {
  const scenario = getAmapTestScenario(testId);
  if (!scenario) return;

  const platform = getMobilePlatform();

  if (scenario.type === "app" && platform === "unknown") {
    window.alert("请在手机浏览器里点这个高德测试入口。");
    return;
  }

  const url = buildAmapTestUrl(testId, platform);
  if (!url) {
    window.alert("当前设备环境暂时无法生成这个高德测试链接。");
    return;
  }

  window.location.href = url;
}

export {
  buildAmapAppRouteUrl,
  buildAmapTestUrl,
  buildAmapWebNavigationUrl,
  buildQueryString,
  formatPosition,
  getAmapTestScenario,
  getMobilePlatform,
  openAmapTestRoute,
};
