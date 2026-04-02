// Get the row of pixels above current row
export function getRowAbove(index, pixelsPerRow, bytesPerPixel, imageData) {
  const filteredRowSize = pixelsPerRow * bytesPerPixel;
  const aboveStartIndex = (index - 1) * filteredRowSize;
  const aboveEndIndex = index * filteredRowSize;
  return imageData.bytes.slice(aboveStartIndex, aboveEndIndex);
}
