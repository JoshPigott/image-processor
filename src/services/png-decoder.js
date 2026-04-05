import { filterBytes } from "./png-decoder/apply-png-filters.js";
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

// Read the next 4 bytes to get chunk type
function readChunkType(bytes, i) {
  const chunkTypeBytes = bytes.slice(i, i + 4);
  const chunkType = new TextDecoder().decode(chunkTypeBytes);
  return chunkType;
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
    return false;
  }
  return true;
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

// Depending the chunk type read the data in a different way
function readChunkData(chunkType, imageData, bytes, i, length) {
  if (chunkType === "IHDR") {
    readHeader(imageData, bytes, i);
  } else if (chunkType === "IDAT") {
    getCompressedBytes(imageData, bytes, i, length);
  }
}

// Convert bytes to a blob and runs them though a deflate algorthm
function createDecompressionStream(imageData){
  const ds = new DecompressionStream("deflate");
  const blob = new Blob([imageData.bytes]);
  const decompressedStream = blob.stream().pipeThrough(ds);
  return decompressedStream;
}

// Replaces bytes with the uncompressed byte data
async function streamToBytes(imageData, decompressedStream){
  imageData.bytes = new Uint8Array(0);
  for await (const chunk of decompressedStream) {
    imageData.bytes = mergeTwoUint8Arrays(imageData.bytes, chunk);
  }
}

function initImageData(){
  return {
    bytes: new Uint8Array(0),
    height: undefined,
    width: undefined,
    type: undefined,
    valid: true,
  }
}

function _readCrc(){
  // This is coming later to come
}

function readChunk(bytes, offset){
  const chunkTypeOffset = offset + 4;
  const dataOffset = offset + 8;

  const dataLength = readLength(bytes, offset);
  const chunkType = readChunkType(bytes, chunkTypeOffset);

  const totalLength = dataLength + 12;
  return { dataLength, chunkType, dataOffset, totalLength };
}

function processChunk(chunk, imageData, bytes){
  readChunkData(
    chunk.chunkType,
    imageData,
    bytes,
    chunk.dataOffset,
    chunk.dataLength);
}

// Finds chunk type, chunk data length, chunk data, and CRC
function decodePngChunks(bytes) {
  const imageData = initImageData();
  // Possible field types are length, chunk type, data, and crc

  const pngSignatureEnd = 8;
  let i = pngSignatureEnd;
  while (i < bytes.length && imageData.valid) {
    const chunk = readChunk(bytes, i);
    if (chunk.chunkType === "IEND") {
      break;
    } 
    processChunk(chunk, imageData, bytes);
    i += chunk.totalLength;
  }
  return imageData;
}



// Decodes a PNG into RGBA pixel data by inflating and filtering image bytes.
export async function readPngService(imageId) {
  const bytes = await Deno.readFile(`data/images/input/${imageId}.png`);
  const imageData = decodePngChunks(bytes);
  const decompressedStream = createDecompressionStream(imageData);
  await streamToBytes(imageData, decompressedStream);
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
