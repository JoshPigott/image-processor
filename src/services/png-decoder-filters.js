// Fine
// No filter is applied just filter type is removed
function filterNone({
  row,
  _pixelsPerRow,
  _bytesPerPixel,
  _imageData,
  _rowNum,
}) {
  return row.slice(1, row.length);
}

// Get the row of pixels above current row
export function getRowAbove(rowNum, pixelsPerRow, bytesPerPixel, imageData) {
  const filteredRowSize = pixelsPerRow * bytesPerPixel;
  // There is no row above
  if (rowNum === 0){
    return new Uint8Array(filteredRowSize);
  }
  const aboveStartIndex = (rowNum - 1) * filteredRowSize;
  const aboveEndIndex = rowNum * filteredRowSize;
  return imageData.bytes.slice(aboveStartIndex, aboveEndIndex);
}


// Pixel value at start of row unchanged
function subEdgeCase(newRow, row, bytesPerPixel){
  for (let j = 0; j < bytesPerPixel; j++) {
    newRow[j] = row[j + 1];
  }
}

// Okay but some repeat logic
// Adds left value to the current value for the row
function filterSub({
  row,
  pixelsPerRow,
  bytesPerPixel,
  _imageData,
  _index,
}) {
  const newRow = new Uint8Array(row.length - 1);
  subEdgeCase(newRow, row, bytesPerPixel);
  
  for (let i = 1; i < pixelsPerRow; i++) {
    const pixelIndex = i * bytesPerPixel;

    for (let j = 0; j < bytesPerPixel; j++) {
      const valueLeft = newRow[pixelIndex - bytesPerPixel + j];
      const value = valueLeft + row[pixelIndex + j + 1];

      newRow[i * bytesPerPixel + j] = value;
    }
  }
  return newRow;
}

// Okay but some repeat logic
// Adds the above value to the current value for the row
function filterUp({
  row,
  pixelsPerRow,
  bytesPerPixel,
  imageData,
  rowNum,
}) {
  const rowAbove = getRowAbove(rowNum, pixelsPerRow, bytesPerPixel, imageData);
  const newRow = new Uint8Array(row.length - 1);
  for (let i = 0; i < pixelsPerRow; i++) {
    const pixelIndex = i * bytesPerPixel;

    for (let j = 0; j < bytesPerPixel; j++) {
      const valueAbove = rowAbove[pixelIndex + j];
      const value = valueAbove + row[pixelIndex + j + 1];

      newRow[pixelIndex + j] = value;
    }
  }
  return newRow;
}

// Left most pixel values (only using value above)
function averageEdgeCase(newRow, row, rowAbove, bytesPerPixel){
  for (let j = 0; j < bytesPerPixel; j++) {
    const valueAbove = rowAbove[j];
    const value = row[j + 1] + (valueAbove / 2);
    newRow[j] = value;
  }
}

// Okay but some repeat logic
// Adds average the of the left and above value to current value for the row
function filterAverage({
  row,
  pixelsPerRow,
  bytesPerPixel,
  imageData,
  rowNum,
}) {
  const rowAbove = getRowAbove(rowNum, pixelsPerRow, bytesPerPixel, imageData);
  const newRow = new Uint8Array(row.length - 1);

  averageEdgeCase(newRow, row, rowAbove, bytesPerPixel);
  
  // For rest of row
  for (let i = 1; i < pixelsPerRow; i++) {
    const pixelIndex = i * bytesPerPixel;
    for (let j = 0; j < bytesPerPixel; j++) {
      const valueLeft = newRow[pixelIndex - bytesPerPixel + j];
      const valueAbove = rowAbove[pixelIndex + j];
      const average = Math.floor((valueAbove + valueLeft) / 2);

      const value = average + row[pixelIndex + j + 1];

      newRow[pixelIndex + j] = value;
    }
  }
  return newRow;
}

// Fine
// Return the closest value to the prediction
function closestValue(prediction, valueLeft, valueAbove, valueLeftAbove) {
  const left = { value: valueLeft, distance: Math.abs(prediction - valueLeft) };
  const above = {
    value: valueAbove,
    distance: Math.abs(prediction - valueAbove),
  };
  const leftAbove = {
    value: valueLeftAbove,
    distance: Math.abs(prediction - valueLeftAbove),
  };

  let smallest = left;
  if (smallest.distance > above.distance) {
    smallest = above;
  }
  if (smallest.distance > leftAbove.distance) {
    smallest = leftAbove;
  }
  return smallest.value;
}

// Pixel at start of row closest value is up
function paethEdgeCase(newRow, row, rowAbove, bytesPerPixel){
  for (let j = 0; j < bytesPerPixel; j++) {
    const valueAbove = rowAbove[j];
    const value = row[j + 1] + valueAbove;
    newRow[j] = value;
  }
}

// Not great needs work too long, too many things
// Adds on the closest value to a prediction to the current value for a row
function filterPaeth({
  row,
  pixelsPerRow,
  bytesPerPixel,
  imageData,
  rowNum,
}) {
  const rowAbove = getRowAbove(rowNum, pixelsPerRow, bytesPerPixel, imageData);
  const newRow = new Uint8Array(row.length - 1);
  paethEdgeCase(newRow, row, rowAbove, bytesPerPixel)

  for (let i = 1; i < pixelsPerRow; i++) {
    const pixelIndex = i * bytesPerPixel;

    for (let j = 0; j < bytesPerPixel; j++) {
      const valueLeft = newRow[pixelIndex - bytesPerPixel + j];
      const valueAbove = rowAbove[pixelIndex + j];
      const valueLeftAbove = rowAbove[pixelIndex - bytesPerPixel + j];

      const prediction = valueLeft + valueAbove - valueLeftAbove;
      const value = row[pixelIndex + j + 1] +
        closestValue(prediction, valueLeft, valueAbove, valueLeftAbove);
      newRow[pixelIndex + j] = value;
    }
  }
  return newRow;
}

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
function getUnfilteredRow(rowNum, unfilteredBytes, unfilteredRowSize){
  const startIndex = rowNum * unfilteredRowSize;
  const endIndex = rowNum * unfilteredRowSize + unfilteredRowSize;
  const unfilteredRow = unfilteredBytes.slice(startIndex, endIndex);
  return unfilteredRow;
}

// Allows filted bytes to be add now
function resetImageBytes(imageData, unfilteredBytes){
  imageData.bytes = new Uint8Array(unfilteredBytes.length - imageData.height);
}

function getRowSizes(imageData, bytesPerPixel){
  const pixelsPerRow = imageData.width;
  const filteredRowSize = pixelsPerRow * bytesPerPixel;
  const unfilteredRowSize = filteredRowSize + 1;
  return [pixelsPerRow, filteredRowSize, unfilteredRowSize];
}

function addFilteredBytes(imageData, filteredRow, rowNum, filteredRowSize){
  const offset = rowNum * filteredRowSize;
  imageData.bytes.set(filteredRow, offset);
}

// Slices bytes in row correct to be filtered and collects filtered rows
export function filterBytes(imageData) {
  const unfilteredBytes = imageData.bytes;
  const bytesPerPixel = (imageData.type === "rgb" ? 3 : 4);
  resetImageBytes(imageData, unfilteredBytes);
  const [pixelsPerRow, filteredRowSize, unfilteredRowSize] = getRowSizes(imageData, bytesPerPixel);

  for (let rowNum = 0; rowNum < imageData.height; rowNum++) {
    const unfilteredRow = getUnfilteredRow(rowNum, unfilteredBytes, unfilteredRowSize);
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
