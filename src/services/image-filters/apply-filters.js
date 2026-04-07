import {
  dbAddFilter,
  dbGetFilters,
  dbIsFilter,
  dbRemoveFilter,
  dbUpdateFilter,
} from "../../database/filters.js";
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
} from "./filters.js";
import { renderImageOutput } from "../make-canvas.js";

// Links filter to order of applying
function getFilterOrder() {
  return {
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
}

// Links filter and there handler together
function getFilterHandlers() {
  // Value stored as TEXT so filter value will need to convert back to a number
  return {
    opacity: (imageData, filter) =>
      applyOpacityService(imageData.rgbaValues, Number(filter.value)),
    brightness: (imageData, filter) =>
      applyBrightnessService(imageData.rgbaValues, Number(filter.value)),
    contrast: (imageData, filter) =>
      applyContrastService(imageData.rgbaValues, Number(filter.value)),
    saturation: (imageData, filter) =>
      applySaturationService(imageData.rgbaValues, Number(filter.value)),
    vibrance: (imageData, filter) =>
      applyVibranceService(imageData.rgbaValues, Number(filter.value)),
    greyscale: (imageData) => applyGreyscaleService(imageData.rgbaValues),
    blur: (imageData, filter) => blurService(imageData, Number(filter.value)),
    sharpen: (imageData, filter) =>
      sharpeningService(imageData, Number(filter.value)),
    crop: (imageData, filter) => croppingService(imageData, filter.value),
    rotate: (imageData, filter) =>
      applyRotationService(imageData, Number(filter.value)),
  };
}

// Loops each filter and if in filter handler runs handler
function runFilterHandlers(imageData, filters) {
  const filterHandlers = getFilterHandlers();
  filters.forEach((filter) => {
    const handler = filterHandlers[filter.filterName];
    if (handler) {
      handler(imageData, filter);
    }
  });
}

// Apply all the filters in the database in a specific order
export function applyFiltersService(imageId, imageData) {
  const filterOrder = getFilterOrder();
  // Get all the filters being applied
  const filters = dbGetFilters(imageId);
  // Sort by order of filters
  filters.sort((filterOne, filterTwo) => {
    filterOrder[filterOne.filterName] - filterOrder[filterTwo.filterName];
  });
  runFilterHandlers(imageData, filters);
}

// Adds, updates, or removes filters based on value.
export async function chagneFilterService(
  isFilterValid,
  sessionId,
  imageId,
  filterName,
  value,
) {
  const filterApplied = dbIsFilter(imageId, filterName);
  // Default value, remove filter
  if (isFilterValid.default === true) {
    dbRemoveFilter(imageId, filterName);
  } // Filter is not being applied
  else if (filterApplied === undefined) {
    dbAddFilter(sessionId, imageId, filterName, value);
  } // Filter is already being applied
  else {
    dbUpdateFilter(imageId, filterName, value);
  }
  await renderImageOutput(imageId);
}

// Gets current filters values for when stite reloads
export function filterValuesService(imageId) {
  // Default values
  const filterValues = {
    "opacity": 100,
    "brightness": 0,
    "contrast": 1,
    "greyscale": "false",
    "saturation": 1,
    "vibrance": 1,
    "rotate": 0,
    "sharpen": 0,
    "blur": 0,
    "crop": [0, 0, 0, 0],
  };
  // For each filter up the value
  const filters = dbGetFilters(imageId);
  filters.forEach((filter) => {
    filterValues[filter.filterName] = filter.value;
  });
  return filterValues;
}
