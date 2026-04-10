import { renderRequest, silderFilterHtml } from "../../utils/htmx-reponses.js";
import { getSliderFilters } from "../../utils/filters-info.js";

function silderFiltersHtml(imageId, filterValues) {
  const filterNames = getSliderFilters();
  return filterNames.map((filterName) =>
    silderFilterHtml({ filterName, filterValues, imageId })
  ).join("");
}

// Depending if grey is select or not returns different selected option
function greyscaleOptions(value) {
  if (value === "true") {
    return /*html*/ `
      <option value="false">OFF</option>
      <option value="true" selected>ON</option>`;
  } else {
    return /*html*/ `
      <option value="false" selected>OFF</option>
      <option value="true">ON</option>`;
  }
}

// Makes sure value is always selected even if stite reloads
function rotateOptions(value) {
  const options = ["0", "180"];
  return options.map((angle) => /*html*/ `
    <option value=${angle} ${
    angle === value ? "selected" : ""
  }>${angle} degrees</option>
  `);
}

// All the html and htmx for each filter except for cropping
export function filtersHtml(imageId, filterValues) {
  return /*html*/ `
    <div class="filters">
      ${silderFiltersHtml(imageId, filterValues)}

      <div class="greyscale">
        <label for="greyscale__input">GREYSCALE</label>
        <select
          name="filterValue"
          id="greyscale__input"
          class="greyscale__input"
          ${renderRequest(imageId, "greyscale")}>
          ${greyscaleOptions(filterValues.greyscale)}
        </select>
      </div>
      <div class="rotate">
        <label for="rotate__input">ROTATE IMAGE</label>
        <select
          name="filterValue"
          id="rotate__input"
          class="rotate__input"
          ${renderRequest(imageId, "rotate")}>
          ${rotateOptions(filterValues.rotate)}
        </select>
      </div>
    </div>`;
}
