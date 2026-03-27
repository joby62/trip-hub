export function createLightboxOverlay({ els, state, selectors }) {
  function renderLightbox() {
    const day = selectors.getDayById(state.lightboxDayId);
    if (!day) return;

    const images = selectors.getDayImageItems(day.id);
    if (!images.length) return;

    const safeIndex = ((state.lightboxIndex % images.length) + images.length) % images.length;
    const image = images[safeIndex];
    state.lightboxIndex = safeIndex;
    state.detailImageIndex = safeIndex;

    els.lightboxImage.src = image.src;
    els.lightboxImage.alt = `${day.title} · 图 ${safeIndex + 1}`;
    els.lightboxCounter.textContent = `${day.day} · 图 ${safeIndex + 1} / ${images.length}`;
    els.lightboxCaption.textContent = image.reference_excerpt || `${day.title} · 图 ${safeIndex + 1}`;
    els.lightboxSource.textContent = [image.reference_before, image.reference_after]
      .filter(Boolean)
      .filter((line, index, array) => array.indexOf(line) === index)
      .join("\n");
  }

  return {
    renderLightbox,
  };
}
