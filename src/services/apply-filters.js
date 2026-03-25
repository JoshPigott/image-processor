import { dbGetFilters } from "../database/filters.js";
// Updates opacity value
function applyOpacityService(pixels, opacityValue) {
  const opacityMultiplier = opacityValue / 100;
  for (let i = 3; i < pixels.length; i += 4) {
    pixels[i] = Math.round(pixels[i] * opacityMultiplier);
  }
}

export function applyFiltersService(imageId, pixels) {
  // Links filter to order of applying
  const filterOrder = {
    "opacity": 0,
    "brightness": 1,
  };
  // Get all the filters being applied
  const filters = dbGetFilters(imageId);
  // Sort by order of filters
  filters.sort((filterOne, filterTwo) => {
    filterOrder[filterOne.filterName] - filterOrder[filterTwo.filterName];
  });

  filters.forEach((filter) => {
    if (filter.filterName === "opacity") {
      applyOpacityService(pixels, filter.value);
    }
    // Other filter will be add
  });
}
