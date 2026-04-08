import { filterValuesService } from "../services/image-filters/apply-filters.js";
import { dbGetLastImageId } from "../database/sessions.js";
import { dbGetImage } from "../database/image.js";
import { imageEditorHtml } from "../services/htmx-reponses/image-editor.js";
import { imageInputHtml } from "../services/htmx-reponses/image-input.js";
import { htmlResponse } from "../utils/responses.js";

// Return an image input or an image editor depending on if image has uploaded.
export function getImageEditor(ctx) {
  const lastImageId = dbGetLastImageId(ctx.sessionId);
  const image = dbGetImage(lastImageId);
  if (!lastImageId) {
    const html = imageInputHtml();
    return htmlResponse(html, { status: 200 });
  } else {
    const filtersValues = filterValuesService(lastImageId);
    const html = imageEditorHtml(lastImageId, filtersValues, image.imageName);
    return htmlResponse(html, { status: 200 });
  }
}
