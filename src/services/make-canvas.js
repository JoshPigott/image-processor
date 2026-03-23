import { createCanvas } from "@josefabio/deno-canvas";
import { getImageData } from "./get-image-data.js";

// export async function makeCanvas(){
//   const canvas = createCanvas(200, 200);
//   const ctx = canvas.getContext("2d");

//   ctx.fillStyle = "blue";
//   ctx.fillRect(0, 0, 500, 500);

//   await Deno.writeFile("the-image.png", canvas.toBuffer());
// }

export async function printImageOnCanvas() {
  const imageData = await getImageData();
  const pixels = imageData.pixels;
  const width = imageData.width;
  const height = imageData.height;

  const canvas = createCanvas(width, height);
  const canvasCtx = canvas.getContext("2d");

  const output = canvasCtx.createImageData(width, height);

  // Connverts from RGB to RGBA
  for (let i = 2, j = 3; i < pixels.length; i += 3, j += 4) {
    output.data[j - 3] = pixels[i - 2]; // Red
    output.data[j - 2] = pixels[i - 1]; // Green
    output.data[j - 1] = pixels[i]; // Blue
    output.data[j] = 255; // alpha (opacity / transparency)
  }

  canvasCtx.putImageData(output, 0, 0);

  const bytes = canvas.toBuffer();
  await Deno.writeFile("dog.png", bytes);
}
