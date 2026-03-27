const PACKING_STORAGE_KEY = "yunnan_guide_packing_v1";
const PACKING_GROUP_STORAGE_KEY = "yunnan_guide_packing_groups_v1";
const ATTRACTION_COMMUNITY_STORAGE_KEY = "yunnan_guide_attraction_community_v1";
const BLUEPRINT_PATH = "/static/guide/data/yunnan.blueprint.json";

const DETAIL_TABS = [
  { id: "route", label: "路线" },
  { id: "stay", label: "吃住" },
  { id: "source", label: "原文" },
];

const SEARCH_FILTERS = [
  { id: "all", label: "全部" },
  { id: "days", label: "天数" },
  { id: "attractions", label: "景点" },
  { id: "tools", label: "工具" },
  { id: "source", label: "原文" },
  { id: "images", label: "图片" },
];

const SEARCH_GROUP_LABELS = {
  days: "天数与路线",
  attractions: "景点与目的地",
  tools: "工具与备忘",
  source: "原文段落",
  images: "图片引用",
};

const VIEW_OPTIONS = [
  { id: "overview", label: "总览", hint: "路线骨架、重点入口与避坑" },
  { id: "itinerary", label: "行程", hint: "按天展开完整图文章节" },
  { id: "attractions", label: "景点", hint: "按目的地查看图片与原文" },
  { id: "checklist", label: "清单", hint: "预订、备忘与打包工具" },
];

const CHECKLIST_TOPBAR_ITEMS = [
  { id: "packingSection", label: "出发前勾一下" },
  { id: "toolsSection", label: "关键预订" },
  { id: "notesSection", label: "统一备忘" },
];

const AMAP_SOURCE_APPLICATION = "AutoBioInterview";
const AMAP_TEST_POINTS = {
  startA: {
    name: "官方起点 A",
    lon: 116.39560823,
    lat: 39.92848272,
  },
  endB: {
    name: "官方终点 B",
    lon: 116.47560823,
    lat: 39.98848272,
  },
  via1: {
    name: "途径点 1",
    lon: 116.402796,
    lat: 39.936915,
  },
  via2: {
    name: "途径点 2",
    lon: 116.438,
    lat: 39.965,
  },
};
const AMAP_TEST_SCENARIOS = [
  {
    id: "destination",
    title: "目的地测试",
    summary: "当前位置 -> 官方终点 B",
    body: "省略起点，验证高德是否以“我的位置”发起路线规划。",
    tags: ["当前位置", "目的地", "URI Web"],
    actionLabel: "测试当前位置去终点",
    hint: "移动端会尝试拉起高德 App；未装 App 时回退网页。",
    type: "web",
    web: {
      destination: AMAP_TEST_POINTS.endB,
      mode: "car",
    },
  },
  {
    id: "single-via",
    title: "单途径点测试",
    summary: "当前位置 -> 途径点 1 -> 官方终点 B",
    body: "验证 URI Web 的单途径点能力。高德官方文档限定该能力只对驾车模式有效。",
    tags: ["当前位置", "单途径点", "驾车"],
    actionLabel: "测试单途径点",
    hint: "这条链路仍然省略起点，应该从“我的位置”出发。",
    type: "web",
    web: {
      destination: AMAP_TEST_POINTS.endB,
      via: AMAP_TEST_POINTS.via1,
      mode: "car",
    },
  },
  {
    id: "multi-via",
    title: "多途径点测试",
    summary: "当前位置 -> 途径点 1 -> 途径点 2 -> 官方终点 B",
    body: "验证 App Scheme 的多途径点能力。这里故意省略起点，测试高德是否仍以“我的位置”发起驾车规划。",
    tags: ["当前位置", "多途径点", "App Scheme"],
    actionLabel: "测试多途径点",
    hint: "需要手机已安装高德 App；多途径点不走普通 URI Web。",
    type: "app",
    app: {
      travelType: "0",
      destination: AMAP_TEST_POINTS.endB,
      viaPoints: [AMAP_TEST_POINTS.via1, AMAP_TEST_POINTS.via2],
    },
  },
  {
    id: "fixed-start",
    title: "指定起点测试",
    summary: "官方起点 A -> 途径点 1 -> 官方终点 B",
    body: "验证显式起点会覆盖“我的位置”，同时保留途径点。这个场景对应你说的“只要指定起点，就一定会有途径点”。",
    tags: ["指定起点", "单途径点", "App Scheme"],
    actionLabel: "测试指定起点",
    hint: "需要手机已安装高德 App；这条链路应直接显示固定起点。",
    type: "app",
    app: {
      travelType: "0",
      start: AMAP_TEST_POINTS.startA,
      destination: AMAP_TEST_POINTS.endB,
      viaPoints: [AMAP_TEST_POINTS.via1],
    },
  },
];

const PRIMARY_VIEW_SECTION = {
  overview: "overviewSection",
  itinerary: "daysSection",
  attractions: "gallerySection",
  checklist: "packingSection",
};

const SECTION_TO_VIEW = {
  overviewSection: "overview",
  daysSection: "itinerary",
  gallerySection: "attractions",
  toolsSection: "checklist",
  notesSection: "checklist",
  packingSection: "checklist",
};

const SOURCE_KIND_LABELS = {
  story: "行程正文",
  transit: "转场交通",
  food: "餐饮补给",
  stay: "住宿落脚",
  booking: "预约提醒",
  tip: "避坑提示",
};

export {
  ATTRACTION_COMMUNITY_STORAGE_KEY,
  AMAP_SOURCE_APPLICATION,
  AMAP_TEST_SCENARIOS,
  BLUEPRINT_PATH,
  CHECKLIST_TOPBAR_ITEMS,
  DETAIL_TABS,
  PACKING_GROUP_STORAGE_KEY,
  PACKING_STORAGE_KEY,
  PRIMARY_VIEW_SECTION,
  SEARCH_FILTERS,
  SEARCH_GROUP_LABELS,
  SECTION_TO_VIEW,
  SOURCE_KIND_LABELS,
  VIEW_OPTIONS,
};
