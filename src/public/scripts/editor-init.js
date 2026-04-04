import { addSilderValues } from "./silders-values.js";
import { setupDownloadListener } from "./image-download.js";

// Enable front js for the editor
function initEditor() {
  addSilderValues();
  setupDownloadListener();
}

function checkIfImageEditor() {
  // Checks if the image editor has swap in.
  document.body.addEventListener("htmx:afterSwap", () => {
    const filter = document.querySelector(".image-editor .filters");
    if (!filter) return;
    // Silders have already been set up
    if (filter.dataset.init === "true") return;
    initEditor();
    filter.dataset.init = "true";
  });

  // Check there is the image editor when the page reloads
  document.body.addEventListener("htmx:load", () => {
    const filter = document.querySelector(".image-editor .filters");
    if (!filter) return;
    // Silders have already been set up
    if (filter.dataset.init === "true") return;
    initEditor();
    filter.dataset.init = "true";
  });
}
checkIfImageEditor();
