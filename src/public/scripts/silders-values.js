// Makes sure the number of decimal places is always the same
function getLabelText(slider, sliderContainer) {
  const silderName = sliderContainer.id;
  const numOfDecimalPlaces = slider.step.split(".")[1]?.length ?? 0;
  const value = Number(slider.value);
  return `${silderName.toUpperCase()}: ${value.toFixed(numOfDecimalPlaces)}`;
}

// Updates label element text with the current inputs value
function showSilderValue(slider) {
  const sliderContainer = slider.closest("div");
  const label = sliderContainer.querySelector("label");
  label.textContent = getLabelText(slider, sliderContainer);
}

// If the slider value changed update it shwon value
function sliderFilterListener(event) {
  // Check if was the silder that changed not button
  if (event.target.matches(".filter__input-slider")) {
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
  const filterSliders = document.querySelectorAll(".filter__input-slider");
  filterSliders.forEach((slider) => {
    showSilderValue(slider);
  });
  setupListerOnFilters();
}
