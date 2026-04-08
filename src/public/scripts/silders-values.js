// Updates label element text with the current inputs value
function showSilderValue(slider) {
  const sliderContainer = slider.closest("div");
  const silderName = sliderContainer.id;
  const label = sliderContainer.querySelector("label");

  const text = `${silderName.toUpperCase()}: ${slider.value}`;
  label.textContent = text;
}

// If the slider value changed update it shwon value
function sliderFilterListener(event) {
  // Check if was the silder that changed not button
  if (event.target.matches(".filter__input-silder")) {
    showSilderValue(event.target);
  }
}
// Sets up lister on filters (parent element) listing for input
function setupListerOnFilters() {
  const filters = document.querySelector(".filters");
  filters.addEventListener("input", sliderFilterListener);
}

// Adds input silder to each input with the input range
export function addSilderValues() {
  const filterSliders = document.querySelectorAll(".filter__input-silder");
  filterSliders.forEach((slider) => {
    showSilderValue(slider);
  });
  setupListerOnFilters();
}
