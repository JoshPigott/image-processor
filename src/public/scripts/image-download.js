// Makes a request to the server to get the image blob data
async function getBlobData(imageId) {
  try {
    const response = await fetch(`/get-image-blob?imageId=${imageId}`);
    return await response.blob();
  } catch (_error) {
    console.log("There was an error downloading the image");
    return null;
  }
}

// Get the imageId and image name from the image
function getImageMetadata() {
  const image = document.querySelector(".image-editor .image-output");
  const imageId = image.dataset.imageId;
  const imageName = image.dataset.imageName;
  return { imageId, imageName };
}

// Delete up to remove unwant elments and free up browser space
function cleanUp(link, downloadUrl) {
  const fiveSecounds = 5000;
  setTimeout(() => {
    URL.revokeObjectURL(downloadUrl);
    link.remove();
  }, fiveSecounds);
}

// Create a download link and fakes a link on anchor element
function downloadBlob(blobData, imageName) {
  const downloadUrl = URL.createObjectURL(blobData);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = imageName;
  link.click();
  cleanUp(link, downloadUrl);
}

async function downloadImage() {
  const metadata = getImageMetadata();
  const blobData = await getBlobData(metadata.imageId);
  if (!blobData) return;
  downloadBlob(blobData, metadata.imageName);
}

// Setup a lister on download button to download image when click
export function setupDownloadListener() {
  const downloadButton = document.getElementById("image-download__button");
  downloadButton.addEventListener("click", async () => {
    await downloadImage();
  });
}
