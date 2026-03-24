// deno-fmt-ignore-file
import { printImage, addImage, addFilter, removeFilter } from "../handlers/image.js";
import { createSession, getSession } from "../handlers/sessions.js";

// Links method, path and handler together
const routes = [
  { method: "POST", path: "/canvas-image",   handler: printImage },
  { method: "POST", path: "/session-create", handler: createSession},
  { method: "GET",  path: "/session-get",    handler: getSession },
  { method: "POST", path: "/image-add",      handler: addImage},
  { method: "POST", path: "/filter-add",     handler: addFilter},
  { method: "POST", path: "/filter-remove",  handler: removeFilter},
];

// Compiled route for speed and cleaness
export const compiled = routes.map((r) => ({
  method: r.method.toUpperCase(),
  pattern: new URLPattern({ pathname: r.path }),
  handler: r.handler,
}));
