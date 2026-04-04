export function imageInputView(){
	return /*html*/`
  <div class="upload-image">
		<h2>To begin please upload an image<h2>
		<p>RGB and RGBA types only supported</p>
    <form 
      hx-post="/image-add"
      hx-trigger="input"
      hx-encoding="multipart/form-data"
      hx-target=".image-editor">      
      <label>Upload png image</label>
      <input
        type="file"
        id="upload-image__input"
        name="image"
        accept="image/png"
      />
    </form>
  </div>`;
}