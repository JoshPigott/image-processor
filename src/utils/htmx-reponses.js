import { getFilterInfo } from "./filters-info.js";

export function renderRequest(imageId, filterName) {
  return `
    hx-post="/filter-add"
    hx-target="#image-output"
    hx-swap="outerHTML"
    hx-trigger="change"
    hx-vals='{"imageId": "${imageId}", "filterName": "${filterName}"}'`;
}

// Contains filter default value to allow filter to be reset
export function resetButtonHtml(imageId, filterName) {
  return /*html*/ `
    <button  class="filters__reset-button"
    hx-post="filter-reset"
    hx-swap="outerHTML"
    hx-vals='{"imageId": "${imageId}", "filterName": "${filterName}"}'
    >RESET</button>
  `;
}

// I will need to write some code for the htmx request
export function filterHtml({ filterName, imageId, useOob = false }) {
  const filterInfo = getFilterInfo(filterName);
  const oobAttribute = useOob ? 'hx-swap-oob="true"' : "";
  return /*html*/ `
    <div id="${filterName}" ${oobAttribute}>
      <input
        ${renderRequest(imageId, filterName)}
        type="range"
        id="${filterName}__input"
        class="${filterName}__input filter__input-silder"
        name="filterValue"
        min="${filterInfo.min}"
        max="${filterInfo.max}"
        value="${filterInfo.defaultValue}"
        step="${filterInfo.step}"
        >
      <label class="${filterName}__label " for="${filterName}__input"
      >${filterName.toUpperCase()}: ${filterInfo.defaultValue}</label>
      ${resetButtonHtml(imageId, filterName)}
    </div>
  `;
}
