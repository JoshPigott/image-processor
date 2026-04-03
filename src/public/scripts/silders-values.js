// Gets input a label elements updates labels text with the current inputs value
function inputSilderValue(inputType) {
  const input = document.querySelector(`.${inputType}__input`);
  const label = document.querySelector(`.${inputType}__label`);
  const text = `${inputType.toUpperCase()}: ${input.value}`;
  label.textContent = text;
  input.addEventListener("input", (event) => {
    const text = `${inputType.toUpperCase()}: ${event.target.value}`;
    label.textContent = text;
  });
}

// Adds input silder to each input with the input range
function addSilderValues() {
  const inputTypes = [
    "opacity",
    "brightness",
    "contrast",
    "saturation",
    "vibrance",
    "sharpen",
    "blur",
  ];
  inputTypes.forEach((inputType) => {
    inputSilderValue(inputType);
  });
}

addSilderValues();
