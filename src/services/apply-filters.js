import { dbGetFilters } from "../database/filters.js";
import {
  applyBrightnessService,
  applyContrastService,
  applyGreyscaleService,
  applyOpacityService,
  applyRotationService,
  applySaturationService,
  applyVibranceService,
  blurService,
  croppingService,
  sharpeningService,
} from "../services/filters.js";

// Apply all the filters in the database in a specific order
export function applyFiltersService(imageId, imageData) {
  // Links filter to order of applying
  const filterOrder = {
    "opacity": 0,
    "brightness": 1,
    "contrast": 2,
    "saturation": 3,
    "vibrance": 4,
    "greyscale": 5,
    "blur": 6,
    "sharpen": 7,
    "crop": 8,
    "rotate": 9,
  };
  // Get all the filters being applied
  const filters = dbGetFilters(imageId);
  // Sort by order of filters
  filters.sort((filterOne, filterTwo) => {
    filterOrder[filterOne.filterName] - filterOrder[filterTwo.filterName];
  });

  filters.forEach((filter) => {
    // Value stored as TEXT so filter value will need to convert back to a number
    if (filter.filterName === "opacity") {
      applyOpacityService(imageData.rgbaValues, Number(filter.value));
    } else if (filter.filterName === "brightness") {
      applyBrightnessService(imageData.rgbaValues, Number(filter.value));
    } else if (filter.filterName === "contrast") {
      applyContrastService(imageData.rgbaValues, Number(filter.value));
    } else if (filter.filterName === "saturation") {
      applySaturationService(imageData.rgbaValues, Number(filter.value));
    } else if (filter.filterName === "vibrance") {
      applyVibranceService(imageData.rgbaValues, Number(filter.value));
    } else if (filter.filterName === "greyscale") {
      applyGreyscaleService(imageData.rgbaValues);
    } else if (filter.filterName === "blur") {
      blurService(imageData, Number(filter.value));
    } else if (filter.filterName === "sharpen") {
      sharpeningService(imageData, Number(filter.value));
    } else if (filter.filterName === "crop") {
      croppingService(imageData, filter.value);
    } else if (filter.filterName === "rotate") {
      applyRotationService(imageData, Number(filter.value));
    }
  });
}
