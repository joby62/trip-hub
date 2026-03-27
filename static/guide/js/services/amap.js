import {
  AMAP_SOURCE_APPLICATION,
  AMAP_TEST_SCENARIOS,
} from "../config.js";

const PI = Math.PI;
const AXIS = 6378245.0;
const EE = 0.00669342162296594323;

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

function isFiniteCoordinate(value) {
  return Number.isFinite(Number(value));
}

function outOfChina(lon, lat) {
  return lon < 72.004 || lon > 137.8347 || lat < 0.8293 || lat > 55.8271;
}

function transformLat(lon, lat) {
  let ret = -100.0 + 2.0 * lon + 3.0 * lat + 0.2 * lat * lat + 0.1 * lon * lat + 0.2 * Math.sqrt(Math.abs(lon));
  ret += (20.0 * Math.sin(6.0 * lon * PI) + 20.0 * Math.sin(2.0 * lon * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
  return ret;
}

function transformLon(lon, lat) {
  let ret = 300.0 + lon + 2.0 * lat + 0.1 * lon * lon + 0.1 * lon * lat + 0.1 * Math.sqrt(Math.abs(lon));
  ret += (20.0 * Math.sin(6.0 * lon * PI) + 20.0 * Math.sin(2.0 * lon * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lon * PI) + 40.0 * Math.sin(lon / 3.0 * PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(lon / 12.0 * PI) + 300.0 * Math.sin(lon / 30.0 * PI)) * 2.0 / 3.0;
  return ret;
}

function convertWgs84ToGcj02(lon, lat) {
  if (outOfChina(lon, lat)) {
    return { lon, lat };
  }

  let dLat = transformLat(lon - 105.0, lat - 35.0);
  let dLon = transformLon(lon - 105.0, lat - 35.0);
  const radLat = lat / 180.0 * PI;
  let magic = Math.sin(radLat);
  magic = 1 - EE * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((AXIS * (1 - EE)) / (magic * sqrtMagic) * PI);
  dLon = (dLon * 180.0) / (AXIS / sqrtMagic * Math.cos(radLat) * PI);

  return {
    lon: lon + dLon,
    lat: lat + dLat,
  };
}

function normalizeAmapPoint(point) {
  if (!point) return null;

  const hasCoords = isFiniteCoordinate(point.lon) && isFiniteCoordinate(point.lat);
  if (!hasCoords) {
    return {
      ...point,
      lon: undefined,
      lat: undefined,
    };
  }

  const lon = Number(point.lon);
  const lat = Number(point.lat);
  if ((point.coordType || "gcj02") === "wgs84") {
    const converted = convertWgs84ToGcj02(lon, lat);
    return {
      ...point,
      lon: converted.lon,
      lat: converted.lat,
      coordType: "gcj02",
    };
  }

  return {
    ...point,
    lon,
    lat,
  };
}

function getPointIdentity(point) {
  if (!point) return "";
  if (isFiniteCoordinate(point.lon) && isFiniteCoordinate(point.lat)) {
    return `${Number(point.lon).toFixed(6)}:${Number(point.lat).toFixed(6)}`;
  }
  return point.name || "";
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
  const start = normalizeAmapPoint(config.start);
  const destination = normalizeAmapPoint(config.destination);
  const viaPoints = (config.viaPoints || [])
    .map(normalizeAmapPoint)
    .filter((point) => point && isFiniteCoordinate(point.lon) && isFiniteCoordinate(point.lat))
    .filter((point, index, array) => array.findIndex((candidate) => getPointIdentity(candidate) === getPointIdentity(point)) === index)
    .filter((point) => getPointIdentity(point) !== getPointIdentity(start) && getPointIdentity(point) !== getPointIdentity(destination));

  const query = buildQueryString({
    sourceApplication: AMAP_SOURCE_APPLICATION,
    sid: start?.poiId || "",
    slat: start?.lat ?? "",
    slon: start?.lon ?? "",
    sname: start?.name || "",
    did: destination?.poiId || "",
    dlat: destination?.lat ?? "",
    dlon: destination?.lon ?? "",
    dname: destination?.name || "",
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
  convertWgs84ToGcj02,
  formatPosition,
  getAmapTestScenario,
  getMobilePlatform,
  normalizeAmapPoint,
  openAmapTestRoute,
};
