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

// Turn each pixel specific amount of greyness
function applyGreyscaleService(pixels) {
  for (let i = 0; i + 2 < pixels.length; i += 4) {
    const red = pixels[i];
    const green = pixels[i + 1];
    const blue = pixels[i + 2];

    const greyscale = Math.round(0.299 * red + 0.587 * green + 0.114 * blue);

    pixels[i] = greyscale;
    pixels[i + 1] = greyscale;
    pixels[i + 2] = greyscale;
  }
}

// Change distance from grey average with a constant multiplier
function applySaturationService(pixels, satrationMultiplierValue) {
  for (let i = 0; i + 2 < pixels.length; i += 4) {
    const red = pixels[i];
    const green = pixels[i + 1];
    const blue = pixels[i + 2];

    const greyAverage = Math.round((red + green + blue) / 3);

    // Increases distance from the grey average
    for (let j = 0; j < 3; j++) {
      const distanceFromGreyAverage = pixels[i + j] - greyAverage;
      const newDistance = distanceFromGreyAverage * satrationMultiplierValue;
      pixels[i + j] = clapPixel(greyAverage + newDistance);
    }
  }
}

// Change distance from grey average depending upon how far it is away from grey average
function applyVibranceService(pixels, vibranceValue) {
  for (let i = 0; i + 2 < pixels.length; i += 4) {
    const red = pixels[i];
    const green = pixels[i + 1];
    const blue = pixels[i + 2];

    const greyAverage = Math.round((red + green + blue) / 3);

    // Increases distance from the grey average
    for (let j = 0; j < 3; j++) {
      const distanceFromGreyAverage = pixels[i + j] - greyAverage;
      const vibranceMultiplier = 1 +
        vibranceValue * (1 - (distanceFromGreyAverage / 255));
      const newDistance = distanceFromGreyAverage * vibranceMultiplier;
      pixels[i + j] = clapPixel(greyAverage + newDistance);
    }
  }
}

export function applyFiltersService(imageId, pixels) {
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
    }
    // Other filter will be add
  });
}
