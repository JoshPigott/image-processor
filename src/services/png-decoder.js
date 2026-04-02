import { filterBytes } from "./png-decoder-filters.js";
import { mergeTwoUint8Arrays } from "../utils/merge-two-uint8-arrays.js";
import { rgbToRgba } from "../utils/pixels.js";

// Goes from 4 bytes to a length as a number
function readLength(bytes, i) {
  let length = 0;
  for (let j = 0; j < 4; j++) {
    const power = 3 - j;
    length += bytes[i + j] * 256 ** power;
  }
  return length;
}

// Read the next 4 bytes to get chuck type
function readChuckType(bytes, i) {
  const chuckTypeBytes = bytes.slice(i, i + 4);
  const chuckType = new TextDecoder().decode(chuckTypeBytes);
  return chuckType;
}

// Gets color type
function imageType(bytes, colorTypeIndex) {
  const numToColorType = {
    0: "grayscale",
    2: "rgb",
    3: "indexed",
    4: "grayscale+alpha",
    6: "rgba",
  };
  const colourTypeNum = bytes[colorTypeIndex];
  return numToColorType[colourTypeNum];
}

function isInvalidImageType(imageData) {
  if (imageData.type !== "rgb" && imageData.type !== "rgba") {
    console.log("fhsdl");
    return false;
  }
}

// Gets width, height and colour from the header
function readHeader(imageData, bytes, i) {
  const heightStart = i + 4;
  const colorTypeIndex = i + 9;
  imageData.width = readLength(bytes, i);
  imageData.height = readLength(bytes, heightStart);
  imageData.type = imageType(bytes, colorTypeIndex);
  imageData.valid = isInvalidImageType(imageData);
}

// Joins compressed bytes sections together
function getCompressedBytes(imageData, bytes, i, length) {
  const newBytes = new Uint8Array(bytes.slice(i, i + length));
  imageData.bytes = mergeTwoUint8Arrays(imageData.bytes, newBytes);
}

// Depending the chuck type read the data in a different way
function readChuckData(chuckType, imageData, bytes, i, length) {
  if (chuckType === "IHDR") {
    readHeader(imageData, bytes, i);
  } else if (chuckType === "IDAT") {
    getCompressedBytes(imageData, bytes, i, length);
  }
}

// Convert bytes to a blob and runs them though a deflate algorthm
async function uncompressBytes(imageData) {
  const ds = new DecompressionStream("deflate");
  const blob = new Blob([imageData.bytes]);
  const decompressedStream = blob.stream().pipeThrough(ds);
  // Replaces bytes with the uncompressed byte data
  imageData.bytes = new Uint8Array(0);
  for await (const chuck of decompressedStream) {
    imageData.bytes = mergeTwoUint8Arrays(imageData.bytes, chuck);
  }
}

// Finds chuck type, chuck data length, chuck data, and CRC
function decode_png_chunks(bytes) {
  const imageData = {
    bytes: new Uint8Array(0),
    height: undefined,
    width: undefined,
    type: undefined,
    valid: true,
  };
  // Possible field types are length, chuck type, data, and crc
  let feildType = "length";
  let chuckType;
  let length;
  const pngSignatureEnd = 8;
  let i = pngSignatureEnd;
  while (i < bytes.length) {
    // No need to keep processing image if going to reject it
    if (imageData.valid === false) {
      console.log("end");
      return imageData;
    } // End of png
    else if (chuckType === "IEND") {
      break;
    } else if (feildType === "length") {
      length = readLength(bytes, i);
      feildType = "chuckType";
      i += 4;
      continue;
    } else if (feildType === "chuckType") {
      chuckType = readChuckType(bytes, i);
      feildType = "data";
      i += 4;
      continue;
    } else if (feildType === "data") {
      readChuckData(chuckType, imageData, bytes, i, length);
      feildType = "crc";
      i += length;
      continue;
    } else if (feildType === "crc") {
      // I am not checking it for the first verion
      i += 4;
      feildType = "length";
      continue;
    }
  }
  return imageData;
}

// Decodes a PNG into RGBA pixel data by inflating and filtering image bytes.
export async function readPngService(imageId) {
  const bytes = await Deno.readFile(`data/images/input/${imageId}.png`);
  const imageData = decode_png_chunks(bytes);
  await uncompressBytes(imageData);
  filterBytes(imageData);
  imageData.rgbaValues = imageData.type === "rgb"
    ? rgbToRgba(imageData.bytes)
    : imageData.bytes;
  return imageData;
}

// Return metadata of width height and pngType
export async function getImageMetadataService(imageId) {
  const bytes = await Deno.readFile(`data/images/input/${imageId}.png`);
  const widthIndex = 16;
  const heightIndex = 20;
  const pngTypeIndex = 25;

  const width = readLength(bytes, widthIndex);
  const height = readLength(bytes, heightIndex);
  const pngType = imageType(bytes, pngTypeIndex);
  return { width, height, pngType };
}
