import { createCanvas } from "@josefabio/deno-canvas";
import { applyFiltersService } from "./apply-filters.js";
import { getImageData } from "./get-image-data.js";
import { dbGetImage } from "../database/image.js";

export async function printImageOnCanvas(imageId) {
  const imageInfo = dbGetImage(imageId);
  const imageData = await getImageData(imageInfo.imagePath);
  const pixels = imageData.pixels;
  const width = imageData.width;
  const height = imageData.height;

  applyFiltersService(imageId, pixels);

  const canvas = createCanvas(width, height);
  const canvasCtx = canvas.getContext("2d");
  const output = canvasCtx.createImageData(width, height);

  // Places each pixel into the canvas data
  for (let i = 0; i < pixels.length; i += 1) {
    output.data[i] = pixels[i];
  }

  canvasCtx.putImageData(output, 0, 0);

  const bytes = canvas.toBuffer();
  await Deno.writeFile(`src/public/assets/${imageInfo.imageName}.png`, bytes);
}
