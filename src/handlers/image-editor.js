import { filterValuesService } from "../services/apply-filters.js";
import { getSessionIdService } from "../services/sessions.js";
import { dbGetLastImageId } from "../database/sessions.js";
import { imageEditorView } from "../views/image-editor.js";
import { imageInputView } from "../views/image-input.js";
import { htmlResponse } from "../utils/html-response.js";


// Return an image input or an image editor depending on if image has uploaded.
export function getImageEditor(ctx){
  const sessionId = getSessionIdService(ctx.req);
  const lastImageId = dbGetLastImageId(sessionId);
  if (!lastImageId){
    const html = imageInputView();
    return htmlResponse(html, {status: 200});
  }
  else{
    const filtersValues = filterValuesService(lastImageId);
    const html = imageEditorView(lastImageId, filtersValues);
    return htmlResponse(html, {status: 200});
  }
}