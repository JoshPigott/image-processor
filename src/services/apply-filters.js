import { dbGetFilters } from "../database/filters.js";

// Makes sure pixel value within 0 and 255
function clapPixel(pixel) {
  if (pixel < 0) return 0;
  else if (pixel > 255) return 255;
  else return Math.round(pixel);
}

// Updates opacity value
function applyOpacityService(pixels, opacityValue) {
  const opacityMultiplier = opacityValue / 100;
  for (let i = 3; i < pixels.length; i += 4) {
    pixels[i] = Math.round(pixels[i] * opacityMultiplier);
  }
}

// Adds or decrease pixel rgb values to chagne brightness
function applyBrightnessService(pixels, brightnessValue) {
  // Skips over opacity
  for (let i = 0; i < pixels.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      pixels[i + j] = clapPixel(pixels[i + j] + brightnessValue);
    }
  }
}

// Changes brightness by increase or decreasing distance from midpoint (128)
function applyContrastService(pixels, contrastMultiplierValue) {
  const midpoint = 128;
  // Skips over opacity
  for (let i = 0; i < pixels.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      const distanceFromMidpoint = pixels[i + j] - midpoint;
      const newDistance = distanceFromMidpoint * contrastMultiplierValue;
      pixels[i + j] = clapPixel(118 + newDistance);
    }
  }
}

export function applyFiltersService(imageId, pixels) {
  // Links filter to order of applying
  const filterOrder = {
    "opacity": 0,
    "brightness": 1,
    "contrast": 2,
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
      applyOpacityService(pixels, Number(filter.value));
    } else if (filter.filterName === "brightness") {
      applyBrightnessService(pixels, Number(filter.value));
    } else if (filter.filterName === "contrast") {
      applyContrastService(pixels, Number(filter.value));
    }
    // Other filter will be add
  });
}
