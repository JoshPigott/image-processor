import { getRowAbove } from "../utils/png-rows.js";

// No filter is applied just filter type is removed
function filterNone({
  row,
  _pixelsPerRow,
  _bytesPerPixel,
  _imageData,
  _index,
}) {
  return row.slice(1, row.length);
}

// Adds left value to the current value for the row
function filterSub({
  row,
  pixelsPerRow,
  bytesPerPixel,
  _imageData,
  _index,
}) {
  const newRow = new Uint8Array(row.length - 1);
  // Left most pixel values unchanged
  for (let j = 0; j < bytesPerPixel; j++) {
    newRow[j] = row[j + 1];
  }
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

// Adds the above value to the current value for the row
function filterUp({
  row,
  pixelsPerRow,
  bytesPerPixel,
  imageData,
  index,
}) {
  const rowAbove = getRowAbove(index, pixelsPerRow, bytesPerPixel, imageData);
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

// Adds average the of the left and above value to current value for the row
function filterAverage({
  row,
  pixelsPerRow,
  bytesPerPixel,
  imageData,
  index,
}) {
  const rowAbove = getRowAbove(index, pixelsPerRow, bytesPerPixel, imageData);
  const newRow = new Uint8Array(row.length - 1);

  // Left most pixel values (average only with above value)
  for (let j = 0; j < bytesPerPixel; j++) {
    const valueAbove = rowAbove[j];
    const value = row[j + 1] + (valueAbove / 2);
    newRow[j] = value;
  }
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

// Adds on the closest value to a prediction to the current value for a row
function filterPaeth({
  row,
  pixelsPerRow,
  bytesPerPixel,
  imageData,
  index,
}) {
  const rowAbove = getRowAbove(index, pixelsPerRow, bytesPerPixel, imageData);
  const newRow = new Uint8Array(row.length - 1);

  // Left most pixel values (averages only with above value)
  for (let j = 0; j < bytesPerPixel; j++) {
    const valueAbove = rowAbove[j];
    const value = row[j + 1] + valueAbove;
    newRow[j] = value;
  }

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
function filterRow(row, pixelsPerRow, bytesPerPixel, imageData, index) {
  const filterType = row[0];
  const filters = [filterNone, filterSub, filterUp, filterAverage, filterPaeth];
  return filters[filterType]({
    row,
    pixelsPerRow,
    bytesPerPixel,
    imageData,
    index,
  });
}

// Slices bytes in row correct to be filtered and collects filtered rows
export function filterBytes(imageData) {
  const unfilteredBytes = imageData.bytes;
  const bytesPerPixel = imageData.type === "rgb" ? 3 : 4;
  // Replaces bytes with the filted byte data
  imageData.bytes = new Uint8Array(unfilteredBytes.length - imageData.height);
  const pixelsPerRow = imageData.width;
  const filteredRowSize = pixelsPerRow * bytesPerPixel;
  const unfilteredRowSize = filteredRowSize + 1;

  for (let i = 0; i < imageData.height; i++) {
    const startIndex = i * unfilteredRowSize;
    const endIndex = i * unfilteredRowSize + unfilteredRowSize;
    const unfilteredRow = unfilteredBytes.slice(startIndex, endIndex);
    const filteredRow = filterRow(
      unfilteredRow,
      pixelsPerRow,
      bytesPerPixel,
      imageData,
      i,
    );
    const offset = i * filteredRowSize;
    imageData.bytes.set(filteredRow, offset);
  }
}
