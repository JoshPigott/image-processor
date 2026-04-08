// Define supported filters with defaults and constraints to ensure valid input and drive UI rendering
export function getFilterInfo(filterName) {
  const filtersInfo = {
    "opacity": {
      "type": "range",
      "defaultValue": 100,
      "min": 0,
      "max": 100,
      "step": 1,
    },
    "brightness": {
      "type": "range",
      "defaultValue": 0,
      "min": -50,
      "max": 50,
      "step": 1,
    },
    "contrast": {
      "type": "range",
      "defaultValue": 1,
      "min": 0.5,
      "max": 1.5,
      "step": 0.01,
    },
    "greyscale": {
      "type": "boolean",
      "defaultValue": "false",
      "values": ["true"],
    },
    "saturation": {
      "type": "range",
      "defaultValue": 1,
      "min": 0.5,
      "max": 2.0,
      "step": 0.02,
    },
    "vibrance": {
      "type": "range",
      "defaultValue": 1,
      "min": 0,
      "max": 2,
      "step": 0.02,
    },
    "rotate": {
      "type": "specific",
      "defaultValue": 0,
      "values": [90, 180, 270],
    },
    "sharpen": {
      "type": "range",
      "defaultValue": 0,
      "min": 0,
      "max": 10,
      "step": 0.1,
    },
    "blur": {
      "type": "range",
      "defaultValue": 0,
      "min": 0,
      "max": 1.5,
      "step": 0.02,
    },
    "crop": {
      "type": "cropping",
    },
  };
  return filtersInfo[filterName];
}
