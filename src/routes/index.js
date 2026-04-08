// deno-fmt-ignore-file
import { getImageEditor } from "../handlers/image-editor.js"
import { addImage, getBlob } from "../handlers/image.js";
import { addFilter, resetFilter } from "../handlers/filters.js";
import { createSession, getSession } from "../handlers/sessions.js";

// Links method, path and handler together
const routes = [
  { method: "GET",  path: "/get-image-editor", handler: getImageEditor},
  { method: "GET",  path: "/get-image-blob",   handler: getBlob },
  { method: "POST", path: "/session-create",   handler: createSession},
  { method: "GET",  path: "/session-get",      handler: getSession },
  { method: "POST", path: "/image-add",        handler: addImage},
  { method: "POST", path: "/filter-add",       handler: addFilter},
  { method: "POST", path: "/filter-reset",     handler: resetFilter},
];

// Compiled route for speed and cleaness
export const compiled = routes.map((r) => ({
  method: r.method.toUpperCase(),
  pattern: new URLPattern({ pathname: r.path }),
  handler: r.handler,
}));
