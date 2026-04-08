import { createCanvas } from "@josefabio/deno-canvas";
import { applyFiltersService } from "./image-filters/apply-filters.js";
import { readPngService } from "./png-decoder/chunk-parser.js";

function getCanvas(imageData) {
  const canvas = createCanvas(imageData.width, imageData.height);
  const canvasCtx = canvas.getContext("2d");
  const output = canvasCtx.createImageData(imageData.width, imageData.height);
  return { canvas, output, canvasCtx };
}

function updateCanvasOutput(output, imageData) {
  // Places each pixel into the canvas data
  for (let i = 0; i < imageData.rgbaValues.length; i += 1) {
    output.data[i] = imageData.rgbaValues[i];
  }
}

// Makes new canvas and pots each pixel on canvas then get the images bytes
function getImageBytes(imageData) {
  const { canvas, output, canvasCtx } = getCanvas(imageData);
  updateCanvasOutput(output, imageData);
  canvasCtx.putImageData(output, 0, 0);
  const bytes = canvas.toBuffer();
  return bytes;
}

// If valid makes image out of the image pixels
export async function renderImageService(imageId) {
  const imageData = await readPngService(imageId);
  if (imageData === undefined) {
    console.log(
      "An error has occurred when reading the png. Unable to print image.",
    );
    return;
  }
  applyFiltersService(imageId, imageData);
  const bytes = getImageBytes(imageData);
  await Deno.writeFile(`data/images/output/${imageId}.png`, bytes);
}
