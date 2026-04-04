export function imageOutputView(imageId, imageName) {
  // Note the query param is so image updates and browser see it as a new image
  return /*html*/ `
    <div class="image-output" data-image-id="${imageId}" data-image-name="${imageName}">
      <img
      src="/output/${imageId}.png?t=${Date.now()}"
      alt="image">
    </div>`;
}
