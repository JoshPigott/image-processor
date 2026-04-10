export function imageInputHtml() {
  return /*html*/ `
  <div class="upload-image">
    <div>
      <div class="upload-image__text-container">
		    <h2 class="upload-image__title">Free Online Photo Editor</h2>
        <form 
          hx-post="/image-add"
          hx-trigger="input"
          hx-encoding="multipart/form-data"
          hx-target=".upload-image"
          hx-swap="outerHTML"
          class="upload-image__form">      
          <label class="upload-image__input-label" for="upload-image__input">Upload png image</label>
          <input
            type="file"
            id="upload-image__input"
            name="image"
            accept="image/png"
          />
        </form>
        <p class="upload-image__meassage">RGB and RGBA types only supported</p>
      </div>
    </div>
  </div>`;
}
