// Checks if filter value is valid and is default value or not
function isValidFilterValueService(filterValueInfo, value) {
  // Checks if value is in a ragne of allowed values
  if (filterValueInfo.type === "range") {
    if (value === filterValueInfo.defaultValue) {
      return { "valid": true, "default": true };
    } else if (filterValueInfo.min <= value && filterValueInfo.max >= value) {
      return { "valid": true, "default": false };
    } else {
      return { "valid": false };
    }
  } // Checks if value is in a arrary of possble values
  else if (filterValueInfo.type === "specific") {
    if (value === filterValueInfo.defaultValue) {
      return { "valid": true, "default": true };
    }
    return {
      "valid": filterValueInfo.values.includes(value),
      "default": false,
    };
  }
  return { "valid": false };
}

// Whitelists filters and filter values
export function isValidFilterService(filterName, value) {
  // All filters not built
  const validFilters = {
    "opacity": {
      "defaultValue": 100,
      "type": "range",
      "min": 0,
      "max": 100,
    },
    "brightness": {
      "defaultValue": 0,
      "type": "range",
      "min": -50,
      "max": 50,
    },
    "contrast": {
      "defaultValue": 1,
      "type": "range",
      "min": 0.5,
      "max": 1.5,
    },
    "flip": {
      "defaultValue": 0,
      "type": "specific",
      "values": [90, 180, 270],
    },
  };
  const filterValueInfo = validFilters?.[filterName];

  // Filter does not exist
  if (!filterValueInfo) return { "valid": false };

  // Checks values
  return isValidFilterValueService(filterValueInfo, value);
}
