import { filterHtml, renderRequest } from "../../utils/htmx-reponses.js";

// Depending if grey is select or not returns different selected option
function greyscaleOptions(value) {
  if (value === "true") {
    return /*html*/ `
      <option value="false">OFF</option>
      <option value="true" selected>ON</option>`;
  } else {
    return /*html*/ `
      <option value="false" selected>OFF</option>
      <option value="true">ON</option>`;
  }
}

// Makes sure value is always selected even if stite reloads
function rotateOptions(value) {
  const options = ["0", "90", "180", "270"];
  return options.map((angle) => /*html*/ `
    <option value=${angle} ${
    angle === value ? "selected" : ""
  }>${angle} degrees</option>
  `);
}

// All the html and htmx for each filter except for cropping
export function filtersHtml(imageId, filterValues) {
  return /*html*/ `
    <div class="filters">
      ${filterHtml({ filterName: "opacity", imageId })}
      ${filterHtml({ filterName: "brightness", imageId })}
      ${filterHtml({ filterName: "contrast", imageId })}
      ${filterHtml({ filterName: "saturation", imageId })}
      ${filterHtml({ filterName: "vibrance", imageId })}
      ${filterHtml({ filterName: "sharpen", imageId })}
      ${filterHtml({ filterName: "blur", imageId })}

      <div class="greyscale">
        <label for="greyscale__input">GREYSCALE</label>
        <select
          name="filterValue"
          id="greyscale__input"
          class="greyscale__input"
          ${renderRequest(imageId, "greyscale")}>
          ${greyscaleOptions(filterValues.greyscale)}
        </select>
      </div>
      <div class="rotate">
        <label for="rotate__input">ROTATE IMAGE</label>
        <select
          name="filterValue"
          id="rotate__input"
          class="rotate__input"
          ${renderRequest(imageId, "rotate")}>
          ${rotateOptions(filterValues.rotate)}
        </select>
      </div>
    </div>`;
}
