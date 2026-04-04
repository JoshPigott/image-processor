export function imageOutputView(imageId){
  return /*html*/`
    <div class="image-output">
      <img
      src="/output/${imageId}.png?t=${Date.now()}"
      alt="image">
    </div>`;
}