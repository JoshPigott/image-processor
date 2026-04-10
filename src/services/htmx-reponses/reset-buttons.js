import { getSliderFilters } from "../../utils/filters-info.js";

// Contains filter default value to allow filter to be reset
export function resetButtonHtml({ filterName, imageId }) {
  return /*html*/ `
    <button  class="filters__reset-button"
    hx-post="filter-reset"
    hx-swap="none"
    hx-vals='{"imageId": "${imageId}", "filterName": "${filterName}"}'
    >RESET</button>
  `;
}

export function getResetButtonsHtml(imageId) {
  const filterNames = getSliderFilters();
  return /*html*/ `
  <div class="image-editor__reset-buttons">
    ${
    filterNames.map((filterName) => resetButtonHtml({ filterName, imageId }))
      .join("")
  }
  </div>`;
}
