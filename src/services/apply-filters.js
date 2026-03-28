import { dbGetFilters } from "../database/filters.js";
import {
  applyBrightnessService,
  applyContrastService,
  applyGreyscaleService,
  applyOpacityService,
  applyRotationService,
  applySaturationService,
  applyVibranceService,
} from "../services/filters.js";

// Apply all the filters in the database in a specific order
export function applyFiltersService(imageId, imageData) {
  // Links filter to order of applying
  const filterOrder = {
    "opacity": 0,
    "brightness": 1,
    "contrast": 2,
    "greyscale": 3,
  };
  // Get all the filters being applied
  const filters = dbGetFilters(imageId);
  // Sort by order of filters
  filters.sort((filterOne, filterTwo) => {
    filterOrder[filterOne.filterName] - filterOrder[filterTwo.filterName];
  });

  const pixels = imageData.pixels;
  filters.forEach((filter) => {
    // Value stored as TEXT so filter value will need to convert back to a number
    if (filter.filterName === "opacity") {
      applyOpacityService(pixels, Number(filter.value));
    } else if (filter.filterName === "brightness") {
      applyBrightnessService(pixels, Number(filter.value));
    } else if (filter.filterName === "contrast") {
      applyContrastService(pixels, Number(filter.value));
    } else if (filter.filterName === "greyscale") {
      applyGreyscaleService(pixels);
    } else if (filter.filterName === "saturation") {
      applySaturationService(pixels, Number(filter.value));
    } else if (filter.filterName === "vibrance") {
      applyVibranceService(pixels, Number(filter.value));
    } else if (filter.filterName === "rotate") {
      applyRotationService(imageData, Number(filter.value));
    }
    console.log("end", pixels);
    // Other filter will be add
  });
}
