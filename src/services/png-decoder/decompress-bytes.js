import { mergeTwoUint8Arrays } from "../../utils/merge-two-uint8-arrays.js";

// Convert bytes to a blob and runs them though a deflate algorthm
function createDecompressionStream(imageData) {
  const ds = new DecompressionStream("deflate");
  const blob = new Blob([imageData.bytes]);
  const decompressedStream = blob.stream().pipeThrough(ds);
  return decompressedStream;
}

// Replaces bytes with the uncompressed byte data
async function streamToBytes(imageData, decompressedStream) {
  imageData.bytes = new Uint8Array(0);
  for await (const chunk of decompressedStream) {
    imageData.bytes = mergeTwoUint8Arrays(imageData.bytes, chunk);
  }
}

export async function decompressImageData(imageData) {
  const decompressedStream = createDecompressionStream(imageData);
  await streamToBytes(imageData, decompressedStream);
}
