// Gets corresponding digit from decimal
function asciiToDecimal(byte) {
  return byte - 48;
}

// Checks if bytes is a whitespace character or not
function isWhitespaceByte(byte) {
  const whitespace = [9, 10, 13, 32];
  // byte is a whitespace
  return whitespace.includes(byte);
}

// In the bytes find the start of the pixels data
function getPixelStart(bytes, indexStart) {
  const ASCII_2 = 50;
  const ASCII_5 = 53;
  let isWhitespace;
  let endHeaderFound = false;

  for (let i = indexStart + 2; i < bytes.length; i += 1) {
    isWhitespace = isWhitespaceByte(bytes[i]);
    // Start of pixel data
    if (endHeaderFound && isWhitespace) {
      return i + 1;
    }
    // End of header has been found (max value found 255 (50, 53, 53))
    if (
      bytes[i - 2] === ASCII_2 &&
      bytes[i - 1] === ASCII_5 &&
      bytes[i] === ASCII_5
    ) {
      endHeaderFound = true;
    }
  }
}

// concatenates bytes demical values together to get length
function readNumber(i, bytes) {
  // Length is a string as it appends to end when adding strings to it
  let number = "";
  // When there is a white space reading length ends
  while (isWhitespaceByte(bytes[i]) === false) {
    const digit = asciiToDecimal(bytes[i]);
    number = number + digit;
    i += 1;
  }
  number = Number(number);
  return { number, nextIndex: i };
}

// Return width and height of image
function getSize(bytes) {
  let magicBytesFound = false;
  let width;
  let height;

  let i = 0;
  // Loop ends when width and height found
  while (i < bytes.length) {
    const isWhitespace = isWhitespaceByte(bytes[i]);

    if (!magicBytesFound && isWhitespace) {
      magicBytesFound = true;
    }
    // Starts recording the width
    if (magicBytesFound && width === undefined && !isWhitespace) {
      const parsedNumber = readNumber(i, bytes);
      width = parsedNumber.number;
      i = parsedNumber.nextIndex;
    } // Starts recording the height
    else if (magicBytesFound && height === undefined && !isWhitespace) {
      const parsedNumber = readNumber(i, bytes);
      height = parsedNumber.number;
      i = parsedNumber.nextIndex;
      return { width, height, index: (i + 1) };
    }
    i++;
  }
}

// Adds opicity into the pixel data
function rgbToRgba(rgbPixels) {
  const rgbaPixels = new Uint8ClampedArray(rgbPixels.length / 3 * 4);
  for (let i = 2, j = 3; i < rgbPixels.length; i += 3, j += 4) {
    rgbaPixels[j - 3] = rgbPixels[i - 2]; // Red
    rgbaPixels[j - 2] = rgbPixels[i - 1]; // Green
    rgbaPixels[j - 1] = rgbPixels[i]; // Blue
    rgbaPixels[j] = 255; // alpha (opacity / transparency)
  }
  return rgbaPixels;
}

// Gets bytes then finds the start of the pixels
export async function getImageData(imagePath) {
  const bytes = await Deno.readFile(imagePath);

  const header = getSize(bytes);
  const width = header.width;
  const height = header.height;

  const pixelStartIndex = getPixelStart(bytes, header.index);
  let pixels = bytes.slice(pixelStartIndex);
  pixels = rgbToRgba(pixels);

  return { pixels, width, height };
}
