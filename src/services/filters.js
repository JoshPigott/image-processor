// Makes sure pixel value within 0 and 255
function clapPixel(pixel) {
  if (pixel < 0) return 0;
  else if (pixel > 255) return 255;
  else return Math.round(pixel);
}

// Updates opacity value
export function applyOpacityService(pixels, opacityValue) {
  const opacityMultiplier = opacityValue / 100;
  for (let i = 3; i < pixels.length; i += 4) {
    pixels[i] = Math.round(pixels[i] * opacityMultiplier);
  }
}

// Adds or decrease pixel rgb values to chagne brightness
export function applyBrightnessService(pixels, brightnessValue) {
  // Skips over opacity
  for (let i = 0; i < pixels.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      pixels[i + j] = clapPixel(pixels[i + j] + brightnessValue);
    }
  }
}

// Changes brightness by increase or decreasing distance from midpoint (128)
export function applyContrastService(pixels, contrastMultiplierValue) {
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
export function applyGreyscaleService(pixels) {
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
export function applySaturationService(pixels, satrationMultiplierValue) {
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
export function applyVibranceService(pixels, vibranceValue) {
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

// Calculates pixel roatation with x and y values
function rotate90(imageData) {
  // Height and width swap
  const newWidth = imageData.height;
  const newHeight = imageData.width;
  const rgbaNewArray = new Uint8ClampedArray(newWidth * newHeight * 4);

  for (let i = 0; i < imageData.pixels.length / 4; i++) {
    const x = i % imageData.width;
    const y = Math.floor(i / imageData.width);

    const newX = y;
    const newY = newHeight - 1 - x;

    const newIndex = (newY * newWidth) + newX;
    for (let j = 0; j < 4; j++) {
      const rgbaIndex = i * 4 + j;
      const rgbaNewIndex = newIndex * 4 + j;
      rgbaNewArray[rgbaNewIndex] = imageData.pixels[rgbaIndex];
    }
  }
  // Updates image data
  imageData.pixels = rgbaNewArray;
  imageData.width = newWidth;
  imageData.height = newHeight;
}

// Swaps inplace first and last pixels and so on
function rotate180(pixels) {
  for (let i = 0; i < pixels.length / 2; i++) {
    // Keeps pixel order in RGBA (not ABGR)
    const pixelType = i % 4;
    const endIndex = pixels.length - 4;
    const offset = pixelType * 2;
    const oppositeIndex = endIndex - i + offset;

    const tempPixel = pixels[i];
    pixels[i] = pixels[oppositeIndex];
    pixels[oppositeIndex] = tempPixel;
  }
}

// Calls the right rotation algorithm
export function applyRotationService(imageData, rotationValue) {
  //const pixelsArray2d = getArray2d(pixels, width, height);
  if (rotationValue == 180) {
    rotate180(imageData.pixels);
  } else if (rotationValue == 90) {
    rotate90(imageData);
  }
}
