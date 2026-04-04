import { filtersView } from "./filters.js";
import { downloadImageVeiw } from "./download-image.js";
import { imageOutputView } from "./image-output.js";

export function imageEditorView(imageId, filterValues, imageName) {
  return /*html*/ `
  ${filtersView(imageId, filterValues)}
  ${downloadImageVeiw()}
  ${imageOutputView(imageId, imageName)}
  `;
}
