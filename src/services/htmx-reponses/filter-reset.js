import { imageOutputHtml } from "../htmx-reponses/image-output.js";
import { silderFilterHtml } from "../../utils/htmx-reponses.js";

// Returns reset silder and image without filter being appiled
export function filterResetHtml(
  { filterName, filterValues, imageId, imageName },
) {
  // useOob: true is allowing to return html to different targets
  return /*html*/ `
    ${silderFilterHtml({ filterName, filterValues, imageId, useOob: true })}
    ${imageOutputHtml({ imageId, imageName, useOob: true })}
  `;
}
