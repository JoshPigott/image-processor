import { filtersHtml } from "./filters.js";
import { downloadImageHtml } from "./download-image.js";
import { imageOutputHtml } from "./image-output.js";

export function imageEditorHtml(imageId, filterValues, imageName) {
  return /*html*/ `
  ${filtersHtml(imageId, filterValues)}
  ${downloadImageHtml()}
  ${imageOutputHtml({imageId, imageName})}
  `;
}
