import { escapeHtml } from "./text.js";
import { buildAmapAppRouteUrl, getMobilePlatform } from "../services/amap.js";

const AMAP_ACTION_ICONS = {
  navigate: `
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M16.5 3.5 8.9 11.1"></path>
      <path d="M16.5 3.5 11.7 16.5l-3.4-5-5-3.4z"></path>
    </svg>
  `,
  car: `
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M4 13.5v-2.8l1.8-3.5h8.4l1.8 3.5v2.8"></path>
      <path d="M5.2 13.5h9.6"></path>
      <circle cx="6.6" cy="14.8" r="1.1"></circle>
      <circle cx="13.4" cy="14.8" r="1.1"></circle>
    </svg>
  `,
  walk: `
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <circle cx="10.8" cy="4.3" r="1.7"></circle>
      <path d="M8.7 9.6 10.6 7.4l2.2 2.1-1 3.2 2.2 3.7"></path>
      <path d="M10.5 9.8 8.3 13.4 5.5 15.1"></path>
      <path d="M10.7 12.5 11.5 16.6"></path>
    </svg>
  `,
  transit: `
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <rect x="4.5" y="4.5" width="11" height="10" rx="2.5"></rect>
      <path d="M7.2 16 6.2 18"></path>
      <path d="M12.8 16 13.8 18"></path>
      <path d="M7.4 8.3h5.2"></path>
      <circle cx="7.5" cy="12.2" r="0.9"></circle>
      <circle cx="12.5" cy="12.2" r="0.9"></circle>
    </svg>
  `,
  ride: `
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <circle cx="6" cy="14" r="2.5"></circle>
      <circle cx="14" cy="14" r="2.5"></circle>
      <path d="M8.2 14 10.2 9.4h2.2l1.6 4.6"></path>
      <path d="M9.3 7.4h2"></path>
      <path d="M10.1 9.4 7.6 9.4 6.6 11.2"></path>
    </svg>
  `,
};

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

function getAmapActionKind(travelType = "0") {
  if (travelType === "0") return "car";
  if (travelType === "1") return "transit";
  if (travelType === "2") return "walk";
  if (travelType === "3") return "ride";
  return "navigate";
}

function renderAmapActionLink({
  url = "",
  kind = "navigate",
  className = "",
  ariaLabel = "",
} = {}) {
  if (!url) return "";

  const icon = AMAP_ACTION_ICONS[kind] || AMAP_ACTION_ICONS.navigate;
  const classes = ["amap-action", className, `is-${kind}`].filter(Boolean).join(" ");
  const label = ariaLabel || "在高德中打开导航";

  return `
    <a class="${escapeHtml(classes)}" href="${escapeHtml(url)}" data-amap-route="true" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}">
      ${icon}
      <span class="sr-only">${escapeHtml(label)}</span>
    </a>
  `;
}

export {
  getAmapActionKind,
  buildInlineRouteUrl,
  getAmapRoutePlatform,
  renderAmapActionLink,
};
