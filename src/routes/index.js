// deno-fmt-ignore-file
import { printImage } from "../handlers/image.js";

// Links method, path and handler together
const routes = [
  { method: "POST", path: "/canvas-image", handler: printImage }
];

// Compiled route for speed and cleaness
export const compiled = routes.map((r) => ({
  method: r.method.toUpperCase(),
  pattern: new URLPattern({ pathname: r.path }),
  handler: r.handler,
}));
