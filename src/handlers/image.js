import { filterValuesService } from "../services/apply-filters.js";
import { addImageService } from "../services/image.js";
import { imageEditorView } from "../views/image-editor.js";
import { blobResponse, htmlResponse } from "../utils/responses.js";

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
  const html = imageEditorView(upload.imageId, filterValues, image.name);
  return htmlResponse(html, { status: 201 });
}

export async function getBlob(ctx) {
  const searchParmas = new URLSearchParams(ctx.url.search);
  const imageId = searchParmas.get("imageId");
  const bytes = await Deno.readFile(`data/images/output/${imageId}.png`);
  const blob = new Blob([bytes]);
  return blobResponse(blob, { status: 200 });
}
