export function imageOutputHtml({ imageId, imageName, useOob = false }) {
  // oob is used to allow mul
  const oobAttribute = useOob ? 'hx-swap-oob="true"' : "";
  // Note the query param is so image updates and browser see it as a new image
  return /*html*/ `
    <div id="image-output" data-image-id="${imageId}" data-image-name="${imageName}" ${oobAttribute}>
      <img
      src="/output/${imageId}.png?t=${Date.now()}"
      alt="image" class="image-output__image">
    </div>`;
}
