import { filtersView } from "./filters.js";
import { imageOutputView } from "./image-output.js"
export function imageEditorView(imageId, filterValues){
  return /*html*/`
  ${filtersView(imageId, filterValues)}
  ${imageOutputView(imageId)}
  `;
}