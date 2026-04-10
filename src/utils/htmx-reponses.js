import { getFilterInfo } from "./filters-info.js";

export function renderRequest(imageId, filterName) {
  return `
    hx-post="/filter-add"
    hx-target="#image-output"
    hx-swap="outerHTML"
    hx-trigger="change"
    hx-vals='{"imageId": "${imageId}", "filterName": "${filterName}"}'`;
}

// Makes sure the number of decimal places is always the same
function getLabelText(filterName, filterValues, filterInfo) {
  const stepSting = filterInfo.step.toString();
  const numOfDecimalPlaces = stepSting.split(".")[1]?.length ?? 0;
  return `${filterName.toUpperCase()}: ${
    Number(filterValues[filterName]).toFixed(numOfDecimalPlaces)
  }`;
}

// I will need to write some code for the htmx request
export function silderFilterHtml(
  { filterName, filterValues, imageId, useOob = false },
) {
  const filterInfo = getFilterInfo(filterName);
  const oobAttribute = useOob ? 'hx-swap-oob="true"' : "";
  return /*html*/ `
    <div id="${filterName}" ${oobAttribute}>
      <input
        ${renderRequest(imageId, filterName)}
        type="range"
        id="${filterName}__input"
        class="${filterName}__input filter__input-slider"
        name="filterValue"
        min="${filterInfo.min}"
        max="${filterInfo.max}"
        value="${filterValues[filterName]}"
        step="${filterInfo.step}"
        >
      <label class="${filterName}__label filter__input-label" for="${filterName}__input"
      >${getLabelText(filterName, filterValues, filterInfo)}</label>
    </div>
  `;
}
