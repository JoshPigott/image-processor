function renderRequest(imageId, filterName){
  return `
    hx-post="/filter-add"
    hx-target=".image-output"
    hx-swap="outerHTML"
    hx-trigger="change"
    hx-vals='{"imageId": "${imageId}", "filterName": "${filterName}"}'`;
}

// Depending if grey is select or not returns different selected option
function greyscaleOptions(value){
  if (value === "true"){
    return /*html*/`
      <option value="false">OFF</option>
      <option value="true" selected>ON</option>`;
  }
  else{
    return /*html*/`
      <option value="false" selected>OFF</option>
      <option value="true">ON</option>`;
  }
}

// Makes sure value is always selected even if stite reloads
function rotateOptions(value){
  const options = ["0", "90", "180", "270"];
  return options.map((angle) => /*html*/`
    <option value=${angle} ${angle === value ? "selected": ""}>${angle} degrees</option>
  `) ;
}

// All the html and htmx for each filter except for cropping
export function filtersView(imageId, filterValues){
  return /*html*/`
    <div class="filters">
      <div class="opacity">
        <input
          ${renderRequest(imageId, "opacity")}
          type="range"
          id="opacity__input"
          name="filterValue"
          class="opacity__input"
          min="0"
          max="100"
          value="${filterValues.opacity}"
          step="1"
          >
        <label class="opacity__label" for="opacity__input">Opacity</label>
      </div>
      <div class="brightness">
        <input
          ${renderRequest(imageId, "brightness")} 
          type="range"
          id="brightness__input"
          name="filterValue"
          class="brightness__input"
          min="-50"
          max="50"
          value="${filterValues.brightness}"
          step="1"
        >
        <label class="brightness__label" for="brightness__input"
        >Brightness</label>
      </div>
      <div class="contrast">
        <input
          ${renderRequest(imageId, "contrast")} 
          type="range"
          id="contrast__input"
          name="filterValue"
          class="contrast__input"
          min="0.5"
          max="1.5"
          value="${filterValues.contrast}"
          step="0.01"
        >
        <label class="contrast__label" for="contrast__input">Contrast </label>
      </div>
      <div class="saturation">
        <input
          ${renderRequest(imageId, "saturation")}
          type="range"
          id="saturation__input"
          name="filterValue"
          class="saturation__input"
          min="0.5"
          max="2.0"
          value="${filterValues.saturation}"
          step="0.02"
        >
        <label class="saturation__label" for="saturation__input">Saturation
        </label>
      </div>
      <div class="vibrance">
        <input
          ${renderRequest(imageId, "vibrance")}  
          type="range"
          id="vibrance__input"
          name="filterValue"
          class="vibrance__input"
          min="0"
          max="2.0"
          value="${filterValues.vibrance}"
          step="0.02"
        >
        <label class="vibrance__label" for="vibrance__input">Vibrance </label>
      </div>
      <div class="sharpen">
        <input
          ${renderRequest(imageId, "sharpen")}
          type="range"
          id="sharpen__input"
          name="filterValue"
          class="sharpen__input"
          min="0"
          max="10"
          value="${filterValues.sharpen}"
          step="0.1"
        >
        <label class="sharpen__label" for="sharpen__input">Sharpen</label>
      </div>
      <div class="blur">
        <input
          ${renderRequest(imageId, "blur")}  
          type="range"
          id="blur__input"
          name="filterValue"
          class="blur__input"
          min="0"
          max="1.5"
          value="${filterValues.blur}"
          step="0.02"
        >
        <label class="blur__label" for="blur__input">Blur</label>
      </div>
      <div class="greyscale">
        <label for="greyscale__input">Greyscale</label>
        <select
          name="filterValue"
          id="greyscale__input"
          class="greyscale__input"
          ${renderRequest(imageId, "greyscale")}>
          ${greyscaleOptions(filterValues.greyscale)}
        </select>
      </div>
      <div class="rotate">
        <label for="rotate__input">Rotate Image</label>
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