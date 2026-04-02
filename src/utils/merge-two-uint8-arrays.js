export function mergeTwoUint8Arrays(currBytes, newBytes) {
  const mergedArray = new Uint8Array(currBytes.length + newBytes.length);
  // Copy in current bytes
  mergedArray.set(currBytes);
  // Copy in new bytes
  mergedArray.set(newBytes, currBytes.length);
  return mergedArray;
}
