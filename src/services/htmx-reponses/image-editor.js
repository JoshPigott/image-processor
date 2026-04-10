import { filtersHtml } from "./filters.js";
import { downloadImageHtml } from "./download-image.js";
import { imageOutputHtml } from "./image-output.js";
import { getResetButtonsHtml } from "./reset-buttons.js";

export function imageEditorHtml(imageId, filterValues, imageName) {
  return /*html*/ `
  <div class="image-editor">
    <div class="image-editor-inputs">
      ${filtersHtml(imageId, filterValues)}
      ${downloadImageHtml()}
    </div>
    ${getResetButtonsHtml(imageId)}
    ${imageOutputHtml({ imageId, imageName })}
  </div>
  `;
}
