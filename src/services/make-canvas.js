import { createCanvas } from "@josefabio/deno-canvas";
import { applyFiltersService } from "./apply-filters.js";
import { readPngService } from "./png-decoder.js";

export async function printImageOnCanvas(imageId) {
  const imageData = await readPngService(imageId);

  applyFiltersService(imageId, imageData);
  const canvas = createCanvas(imageData.width, imageData.height);
  const canvasCtx = canvas.getContext("2d");
  const output = canvasCtx.createImageData(imageData.width, imageData.height);

  // Places each pixel into the canvas data
  for (let i = 0; i < imageData.rgbaValues.length; i += 1) {
    output.data[i] = imageData.rgbaValues[i];
  }

  canvasCtx.putImageData(output, 0, 0);

  const bytes = canvas.toBuffer();
  await Deno.writeFile(`data/images/output/${imageId}.png`, bytes);
}
