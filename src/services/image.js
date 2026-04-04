import { dbUpdateLastImageId } from "../database/sessions.js";
import { dbAddImage } from "../database/image.js";
import { getImageMetadataService } from "./png-decoder.js";
import { getSessionIdService } from "./sessions.js";
import { printImageOnCanvas } from "./make-canvas.js";

// Write image file to data (later on this may just be writing the pixel data)
async function addImageFile(image, imageId) {
  const bytes = new Uint8Array(await image.arrayBuffer());
  await Deno.writeFile(`data/images/input/${imageId}.png`, bytes);
}

// Remove the file
async function removeImageFile(imageId) {
  await Deno.remove(`data/images/input/${imageId}.png`);
}

// Get first bytes for if it is a png
async function getFirst8Bytes(file) {
  const lenght = 8;
  const buffer = await file.slice(0, lenght).arrayBuffer();
  return new Uint8Array(buffer);
}

// Check if the image contains bytes saying it a png
function checkMagicBytes(bytes) {
  return (bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4E &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0D &&
    bytes[5] === 0x0A &&
    bytes[6] === 0x1A &&
    bytes[7] === 0x0A);
}

// Avoids file traversal
function sanitizeFileName(fileName) {
  return fileName
    .replace(/[^a-zA-Z0-9.\-_]/g, "_")
    .replace(/\.+/g, ".");
}

// Checks if image is valid with file size, type and first bytes of image
export async function isValidImage(image) {
  // maxSize ~5MB
  const maxSize = 5 * 1024 * 1024;
  if (!(image instanceof File)) {
    return false;
  } else if (image.type !== "image/png") {
    return false;
  } // Makes sure big images don't crash of slow down the server
  else if (image.size > maxSize) {
    return false;
  }
  const first8Bytes = await getFirst8Bytes(image);
  if (!checkMagicBytes(first8Bytes)) return false;
  return true;
}

// Adds image if valid and type supported
export async function addImageService(req, image) {
  if (await isValidImage(image) === false) {
    return { successful: false };
  }
  const sessionId = getSessionIdService(req);
  const imageId = crypto.randomUUID();
  const imageName = sanitizeFileName(image.name);

  await addImageFile(image, imageId);
  const imageMetadata = await getImageMetadataService(imageId);

  // If png type not supported
  if (imageMetadata.pngType !== "rgb" && imageMetadata.pngType !== "rgba") {
    await removeImageFile(imageId);
    return { successful: false };
  }
  printImageOnCanvas(imageId);
  dbUpdateLastImageId(sessionId, imageId);
  dbAddImage({
    sessionId,
    imageId,
    imageName,
    width: imageMetadata.width,
    height: imageMetadata.height,
  });
  console.log("image id:", imageId);
  return { successful: true, imageId };
}
