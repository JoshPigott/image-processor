import { printImageOnCanvas } from "../services/make-canvas.js";
import { json } from "../utils/json.js";

export async function printImage(_ctx) {
  await printImageOnCanvas();
  return json({ "sucess": "Image has been printed" }, { status: 201 });
}
