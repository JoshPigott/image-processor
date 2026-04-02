// Adds opicity into the pixel data
export function rgbToRgba(rgbPixels) {
  const rgbaPixels = [];
  for (let i = 2, j = 3; i < rgbPixels.length; i += 3, j += 4) {
    rgbaPixels[j - 3] = rgbPixels[i - 2]; // Red
    rgbaPixels[j - 2] = rgbPixels[i - 1]; // Green
    rgbaPixels[j - 1] = rgbPixels[i]; // Blue
    rgbaPixels[j] = 255; // alpha (opacity / transparency)
  }
  return rgbaPixels;
}

// Makes sure pixel value within 0 and 255
export function clapPixelValue(rgbaValue) {
  if (rgbaValue < 0) return 0;
  else if (rgbaValue > 255) return 255;
  else return Math.round(rgbaValue);
}
