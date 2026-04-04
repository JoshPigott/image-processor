import { filterValuesService } from "../services/apply-filters.js";
import { addImageService } from "../services/image.js";
import { htmlResponse } from "../utils/html-response.js";
import { imageEditorView } from "../views/image-editor.js";

// Adds and keeps of the filters being applied to image
export async function addImage(ctx) {
  const formData = await ctx.req.formData();
  const image = formData.get("image");

  const upload = await addImageService(ctx.req, image);
  if (upload.successful === false) {
    const html = ``;
    return htmlResponse(html, { status: 400 });
  }
  const filterValues = filterValuesService(upload.imageId);
  const html = imageEditorView(upload.imageId, filterValues);
  return htmlResponse(html, { status: 201 });
}
