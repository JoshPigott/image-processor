import { imageOutputHtml } from "../htmx-reponses/image-output.js";
import { filterHtml } from "../../utils/htmx-reponses.js";

// Returns reset silder and image without filter being appiled
export function filterResetHtml(filterName, imageId, imageName){
  // useOob: true is allowing to return html to different targets
  return /*html*/`
    ${filterHtml({filterName, imageId, useOob: true})}
    ${imageOutputHtml({imageId, imageName, useOob: true})}
  `;
}