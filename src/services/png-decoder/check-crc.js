// If last bit is 1 return 1 else 0
function getCrcLastBit(crc) {
  return crc & 1;
}

// Shift CRC to the right and fills in left most bit with a zero
function shiftCrcToRight(crc) {
  return crc >>> 1;
}

function xorCrcWithByte(byte, crc) {
  return crc ^ byte;
}

function xorCrc(crc) {
  const crc32Polynomial = 0xEDB88320;
  return crc ^ crc32Polynomial;
}

function finialCrcXor(crc) {
  const crc32Final = 0xFFFFFFFF;
  return crc ^ crc32Final;
}

// Shift CRC right 8 times; if dropped bit = 1, XOR.
function applyShifts(crc) {
  for (let _ = 0; _ < 8; _++) {
    const lastBit = getCrcLastBit(crc);
    crc = shiftCrcToRight(crc);
    if (lastBit === 1) {
      crc = xorCrc(crc);
    }
  }
  return crc;
}

// Calculates CRC, applying shifts and XOR
function computeCrc(bytes) {
  let crc = 0xFFFFFFFF;
  for (const byte of bytes) {
    crc = xorCrcWithByte(byte, crc);
    crc = applyShifts(crc);
  }
  crc = finialCrcXor(crc);
  return crc;
}

// Turns crc bytes into one big number
function crcBytesToCrcOuput(crcBytes) {
  const firstShift = 24;
  const secoundShift = 16;
  const thirdShift = 8;
  const crcOutput = (crcBytes[0] << firstShift) +
    (crcBytes[1] << secoundShift) + (crcBytes[2] << thirdShift) + crcBytes[3];
  return crcOutput;
}

function getCrcOuput(bytes, chunk) {
  const crcLength = 4;
  const crcEndIndex = chunk.crcOutputOffset + crcLength;
  const crcBytes = bytes.slice(chunk.crcOutputOffset, crcEndIndex);
  const crcOutput = crcBytesToCrcOuput(crcBytes);
  return crcOutput;
}

function getCrcInput(bytes, chunk) {
  const crcInputLength = chunk.dataLength + 4;
  const crcInputEndIndex = crcInputLength + chunk.chunkTypeOffset;
  const crcInput = bytes.slice(chunk.chunkTypeOffset, crcInputEndIndex);
  return crcInput;
}

// Validates image CRC to detect corruption
export function crcChecker(bytes, chunk) {
  const crcInput = getCrcInput(bytes, chunk);
  const crcOutput = getCrcOuput(bytes, chunk);
  const computedCrc = computeCrc(crcInput);

  return crcOutput === computedCrc;
}
