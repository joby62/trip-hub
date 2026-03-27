import { escapeHtml } from "./text.js";

function getDateParts(dateText) {
  const [month = "", date = ""] = String(dateText || "").split(".");
  return {
    monthLabel: month ? `${month}月` : String(dateText || ""),
    dateLabel: date || String(dateText || ""),
  };
}

function renderDayRailItems(days, activeDayId) {
  return days
    .map((day) => {
      const isActive = activeDayId === day.id;
      const { monthLabel, dateLabel } = getDateParts(day.date);
      return `
        <button
          class="date-rail__item ${isActive ? "is-active" : ""}"
          type="button"
          data-focus-day="${escapeHtml(day.id)}"
        >
          <span class="date-rail__month">${escapeHtml(monthLabel)}</span>
          <strong class="date-rail__date">${escapeHtml(dateLabel)}</strong>
          <span class="date-rail__day">${escapeHtml(day.day)}</span>
          <span class="date-rail__city">${escapeHtml(day.city)}</span>
        </button>
      `;
    })
    .join("");
}

export {
  renderDayRailItems,
};
