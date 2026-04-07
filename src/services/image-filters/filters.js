import { clapPixelValue } from "../../utils/pixels.js";

// Updates opacity value
export function applyOpacityService(rgbaValues, opacityValue) {
  const opacityMultiplier = opacityValue / 100;
  for (let i = 3; i < rgbaValues.length; i += 4) {
    rgbaValues[i] = Math.round(rgbaValues[i] * opacityMultiplier);
  }
}

// Adds or decrease rgb values to chagne brightness
export function applyBrightnessService(rgbaValues, brightnessValue) {
  // Skips over opacity
  for (let i = 0; i < rgbaValues.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      rgbaValues[i + j] = clapPixelValue(rgbaValues[i + j] + brightnessValue);
    }
  }
}

// Changes brightness by increase or decreasing distance from midpoint (128)
export function applyContrastService(rgbaValues, contrastMultiplierValue) {
  const midpoint = 128;
  // Skips over opacity
  for (let i = 0; i < rgbaValues.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      const distanceFromMidpoint = rgbaValues[i + j] - midpoint;
      const newDistance = distanceFromMidpoint * contrastMultiplierValue;
      rgbaValues[i + j] = clapPixelValue(118 + newDistance);
    }
  }
}

// Turn each pixel specific amount of greyness
export function applyGreyscaleService(rgbaValues) {
  for (let i = 0; i + 2 < rgbaValues.length; i += 4) {
    const red = rgbaValues[i];
    const green = rgbaValues[i + 1];
    const blue = rgbaValues[i + 2];

    const greyscale = Math.round(0.299 * red + 0.587 * green + 0.114 * blue);

    rgbaValues[i] = greyscale;
    rgbaValues[i + 1] = greyscale;
    rgbaValues[i + 2] = greyscale;
  }
}

// Loops over each rgb value increasing distance from grey average in a linear way
function scaleColorDistanceFromGrey(
  rgbaValues,
  greyAverage,
  i,
  satrationMultiplierValue,
) {
  for (let j = 0; j < 3; j++) {
    const distanceFromGreyAverage = rgbaValues[i + j] - greyAverage;
    const newDistance = distanceFromGreyAverage * satrationMultiplierValue;
    rgbaValues[i + j] = clapPixelValue(greyAverage + newDistance);
  }
}

// Change distance from grey average with a constant multiplier
export function applySaturationService(rgbaValues, satrationMultiplierValue) {
  for (let i = 0; i + 2 < rgbaValues.length; i += 4) {
    const red = rgbaValues[i];
    const green = rgbaValues[i + 1];
    const blue = rgbaValues[i + 2];

    const greyAverage = Math.round((red + green + blue) / 3);
    scaleColorDistanceFromGrey(
      rgbaValues,
      greyAverage,
      i,
      satrationMultiplierValue,
    );
  }
}

// Loops over each rgb value increasing distance from grey average in a non linear way
function enhanceColorDistanceFromGrey(
  rgbaValues,
  greyAverage,
  i,
  vibranceValue,
) {
  for (let j = 0; j < 3; j++) {
    const distanceFromGreyAverage = rgbaValues[i + j] - greyAverage;
    const vibranceMultiplier = 1 +
      vibranceValue * (1 - (distanceFromGreyAverage / 255));
    const newDistance = distanceFromGreyAverage * vibranceMultiplier;
    rgbaValues[i + j] = clapPixelValue(greyAverage + newDistance);
  }
}

// Change distance from grey average depending upon how far it is away from grey average
export function applyVibranceService(rgbaValues, vibranceValue) {
  for (let i = 0; i + 2 < rgbaValues.length; i += 4) {
    const red = rgbaValues[i];
    const green = rgbaValues[i + 1];
    const blue = rgbaValues[i + 2];

    const greyAverage = Math.round((red + green + blue) / 3);
    enhanceColorDistanceFromGrey(rgbaValues, greyAverage, i, vibranceValue);
  }
}

function getCoordinates(i, imageData) {
  const x = i % imageData.width;
  const y = Math.floor(i / imageData.width);
  return { x, y };
}

function translatePixelRGBA(rgbaNewArray, newIndex, i, imageData) {
  for (let j = 0; j < 4; j++) {
    const rgbaIndex = i * 4 + j;
    const rgbaNewIndex = newIndex * 4 + j;
    rgbaNewArray[rgbaNewIndex] = imageData.rgbaValues[rgbaIndex];
  }
}

function rotateClockwise90degrees(newWidth, rgbaNewArray, imageData) {
  for (let i = 0; i < imageData.rgbaValues.length / 4; i++) {
    const { x, y } = getCoordinates(i, imageData);

    const newX = newWidth - 1 - y;
    const newY = x;

    const newIndex = (newY * newWidth) + newX;
    translatePixelRGBA(rgbaNewArray, newIndex, i, imageData);
  }
}

function rotateAnticlockwise90degrees(
  newWidth,
  newHeight,
  rgbaNewArray,
  imageData,
) {
  for (let i = 0; i < imageData.rgbaValues.length / 4; i++) {
    const { x, y } = getCoordinates(i, imageData);

    const newX = y;
    const newY = newHeight - 1 - x;

    const newIndex = (newY * newWidth) + newX;
    translatePixelRGBA(rgbaNewArray, newIndex, i, imageData);
  }
}

// Calculates pixel roatation with x and y values
function rotateBy90(imageData, rotationValue) {
  const clockwiseRotation = rotationValue === 90 ? true : false;

  // Height and width swap
  const newWidth = imageData.height;
  const newHeight = imageData.width;

  const rgbaNewArray = [];
  if (clockwiseRotation) {
    rotateClockwise90degrees(newWidth, rgbaNewArray, imageData);
  } else {rotateAnticlockwise90degrees(
      newWidth,
      newHeight,
      rgbaNewArray,
      imageData,
    );}

  // Updates image data
  imageData.rgbaValues = rgbaNewArray;
  imageData.width = newWidth;
  imageData.height = newHeight;
}

// Swaps inplace first and last pixels and so on
function rotate180(rgbaValues) {
  for (let i = 0; i < rgbaValues.length / 2; i++) {
    // Keeps pixel order in RGBA (not ABGR)
    const rgbaType = i % 4;
    const endIndex = rgbaValues.length - 4;
    const offset = rgbaType * 2;
    const oppositeIndex = endIndex - i + offset;

    const tempPixel = rgbaValues[i];
    rgbaValues[i] = rgbaValues[oppositeIndex];
    rgbaValues[oppositeIndex] = tempPixel;
  }
}

// Calls the right rotation algorithm
export function applyRotationService(imageData, rotationValue) {
  if (rotationValue == 180) {
    rotate180(imageData.rgbaValues);
  } else if (rotationValue == 90 || rotationValue == 270) {
    rotateBy90(imageData, rotationValue);
  }
}

function getNeighbours(i, imageData){
  const direct = [
    i - imageData.width,
    i + imageData.width,
    i + 1,
    i - 1,
  ];
  const diagonal = [
    i - imageData.width + 1,
    i - imageData.width - 1,
    i + imageData.width + 1,
    i + imageData.width - 1,
  ];
  return { direct, diagonal };
}

function getDirectNeighboursSum(directNeighbours, j, imageData){
  let directNeighboursSum = 0;
    directNeighbours.forEach((index) => {
      directNeighboursSum += imageData.rgbaValues[index * 4 + j];
  });
  return directNeighboursSum;
}

function getDiagonalNeighboursSum(diagonalNeighbours, j, imageData){
  let diagonalNeighboursSum = 0;
  diagonalNeighbours.forEach((index) => {
    diagonalNeighboursSum += imageData.rgbaValues[index * 4 + j];
  });
  return diagonalNeighboursSum;
}


// Increases difference in colour between neighbour pixels
function applySharpening({
  i,
  j,
  rgbaNewArray,
  imageData,
  multiplier,
}) {
  const neighbours = getNeighbours(i, imageData);
  const directNeighboursSum = getDirectNeighboursSum(neighbours.direct, j, imageData);

  const rgbaValue = imageData.rgbaValues[i * 4 + j];
  const neighborWeight = (multiplier - 1) / 4;
  const newValue = multiplier * rgbaValue -
    neighborWeight * directNeighboursSum;
  rgbaNewArray[i * 4 + j] = clapPixelValue(Math.round(newValue));
}

// Decreases difference in colour between neighbour pixels
function applyBlur({
  i,
  j,
  rgbaNewArray,
  imageData,
  multiplier,
}) {
  const neighbours = getNeighbours(i, imageData);
  const directNeighboursSum = getDirectNeighboursSum(neighbours.direct, j, imageData);
  const diagonalNeighboursSum = getDiagonalNeighboursSum(neighbours.diagonal, j, imageData);

  const rgbaValue = imageData.rgbaValues[i * 4 + j];
  const newValue = (1 - multiplier) * rgbaValue +
    (multiplier * 0.125) * directNeighboursSum +
    (multiplier * 0.0625) * diagonalNeighboursSum;
  rgbaNewArray[i * 4 + j] = clapPixelValue(Math.round(newValue));
}

// Updates pixels rbg values
function applyEffectToPixel({
  i,
  imageData,
  effect,
  multiplier,
  rgbaNewArray,
}) {
  // Loop over each rgba value
  for (let j = 0; j < 4; j++) {
    // Keeps alpha value unchanged
    if (j === 3) {
      rgbaNewArray[i * 4 + j] = imageData.rgbaValues[i * 4 + j];
      continue;
    }
    if (effect === "sharpen") {
      applySharpening({
        i,
        j,
        rgbaNewArray,
        imageData,
        multiplier,
      });
    } else if (effect === "blur") {
      applyBlur({
        i,
        j,
        rgbaNewArray,
        imageData,
        multiplier,
      });
    }
  }
}

// Calculates if pixel is an edge or not
function isEdge(i, imageData) {
  // Top egde
  if (i < imageData.width) return true;
  // Left edge
  else if (i % imageData.width === 0) return true;
  // Right edge
  else if (i % imageData.width === imageData.width - 1) return true;
  // Bottom edge
  else if (i >= (imageData.rgbaValues.length / 4) - imageData.width) {
    return true;
  } else return false;
}

// Pixel value remains unchagned
function kernelEffectEdgeCase(i, rgbaNewArray, imageData){
  for (let j = 0; j < 4; j++) {
    rgbaNewArray[i * 4 + j] = imageData.rgbaValues[i * 4 + j];
  }
}

// Increase rbg values between neighbours and decreases them for blur
function applyKernelEffect(imageData, effect, multiplier) {
  const rgbaNewArray = [];
  // Loops over each pixel finding neighbours
  for (let i = 0; i < imageData.rgbaValues.length / 4; i++) {
    if (isEdge(i, imageData)) {
      kernelEffectEdgeCase(i, rgbaNewArray, imageData);
      continue;
    }
    applyEffectToPixel({
      i,
      imageData,
      effect,
      multiplier,
      rgbaNewArray,
    });
  }
  imageData.rgbaValues = rgbaNewArray;
}

export function sharpeningService(imageData, multiplier) {
  applyKernelEffect(imageData, "sharpen", multiplier);
}

export function blurService(imageData, multiplier) {
  applyKernelEffect(imageData, "blur", multiplier);
}

function plotPixel(i, rgbaNewArray, imageData) {
  for (let j = 0; j < 4; j++) {
    rgbaNewArray.push(imageData.rgbaValues[i * 4 + j]);
  }
}

export function croppingService(imageData, croppingValues) {
  const rgbaNewArray = [];
  // Converts cropping from string into array
  croppingValues = JSON.parse(croppingValues);
  croppingValues.map((croppingValue) => Number(croppingValue));

  const top = croppingValues[0];
  const bottom = croppingValues[1];
  const left = croppingValues[2];
  const right = croppingValues[3];

  const startIndex = imageData.width * top;
  const endIndex = (imageData.rgbaValues.length / 4) -
    (imageData.width * bottom);

  // For loop need to cut pixels on the right and left side
  for (let i = startIndex; i < endIndex; i++) {
    const Xplacment = i % imageData.width;
    if (Xplacment < left) continue;
    // It is <= not < as imageData.width - Xplacment starts at 1
    else if (imageData.width - Xplacment <= right) continue;
    plotPixel(i, rgbaNewArray, imageData);
  }
  imageData.width = imageData.width - left - right;
  imageData.height = imageData.height - top - bottom;
  imageData.rgbaValues = rgbaNewArray;
}
