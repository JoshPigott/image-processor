import {
  filterAverage,
  filterNone,
  filterPaeth,
  filterSub,
  filterUp,
} from "./png-filters.js";

// Calls the correct filter type function
function filterRow(row, pixelsPerRow, bytesPerPixel, imageData, rowNum) {
  const filterType = row[0];
  const filters = [filterNone, filterSub, filterUp, filterAverage, filterPaeth];
  return filters[filterType]({
    row,
    pixelsPerRow,
    bytesPerPixel,
    imageData,
    rowNum,
  });
}

// Slices the to get a spefic row with the filter type
function getUnfilteredRow(rowNum, unfilteredBytes, unfilteredRowSize) {
  const startIndex = rowNum * unfilteredRowSize;
  const endIndex = rowNum * unfilteredRowSize + unfilteredRowSize;
  const unfilteredRow = unfilteredBytes.slice(startIndex, endIndex);
  return unfilteredRow;
}

// Allows filted bytes to be add now
function resetImageBytes(imageData, unfilteredBytes) {
  imageData.bytes = new Uint8Array(unfilteredBytes.length - imageData.height);
}

function getRowSizes(imageData, bytesPerPixel) {
  const pixelsPerRow = imageData.width;
  const filteredRowSize = pixelsPerRow * bytesPerPixel;
  const unfilteredRowSize = filteredRowSize + 1;
  return { pixelsPerRow, filteredRowSize, unfilteredRowSize };
}

function addFilteredBytes(imageData, filteredRow, rowNum, filteredRowSize) {
  const offset = rowNum * filteredRowSize;
  imageData.bytes.set(filteredRow, offset);
}

// Slices bytes in row correct to be filtered and collects filtered rows
export function filterBytes(imageData) {
  const unfilteredBytes = imageData.bytes;
  const bytesPerPixel = imageData.type === "rgb" ? 3 : 4;
  resetImageBytes(imageData, unfilteredBytes);
  const { pixelsPerRow, filteredRowSize, unfilteredRowSize } = getRowSizes(
    imageData,
    bytesPerPixel,
  );

  for (let rowNum = 0; rowNum < imageData.height; rowNum++) {
    const unfilteredRow = getUnfilteredRow(
      rowNum,
      unfilteredBytes,
      unfilteredRowSize,
    );
    const filteredRow = filterRow(
      unfilteredRow,
      pixelsPerRow,
      bytesPerPixel,
      imageData,
      rowNum,
    );
    addFilteredBytes(imageData, filteredRow, rowNum, filteredRowSize);
  }
}
