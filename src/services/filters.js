// Checks if filter value is valid and is default value or not
function isValidFilterValueService(filterValueInfo, value) {
  // Checks if value is in a ragne of allowed values
  if (filterValueInfo.type === "range") {
    value = Number(value);
    if (value === filterValueInfo.defaultValue) {
      console.log(value);
      return { "valid": true, "default": true };
    } else if (filterValueInfo.min <= value && filterValueInfo.max >= value) {
      return { "valid": true, "default": false };
    } else {
      return { "valid": false };
    }
  } // Checks if value is in a arrary of possble values
  else if (filterValueInfo.type === "boolean") {
    console.log("value:", value);
    console.log("filterValueInfo.defaultValue:", filterValueInfo.defaultValue);
    if (value === filterValueInfo.defaultValue) {
      return { "valid": true, "default": true };
    }
    return {
      "valid": filterValueInfo.values.includes(value),
      "default": false,
    };
  } // Checks if value is in a arrary of possble values
  else if (filterValueInfo.type === "specific") {
    value = Number(value);
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
      "type": "range",
      "defaultValue": 100,
      "min": 0,
      "max": 100,
    },
    "brightness": {
      "type": "range",
      "defaultValue": 0,
      "min": -50,
      "max": 50,
    },
    "contrast": {
      "type": "range",
      "defaultValue": 1,
      "min": 0.5,
      "max": 1.5,
    },
    "greyscale": {
      "type": "boolean",
      "defaultValue": "false",
      "values": ["true"],
    },
    "flip": {
      "type": "specific",
      "defaultValue": 0,
      "values": [90, 180, 270],
    },
  };
  const filterValueInfo = validFilters?.[filterName];

  // Filter does not exist
  if (!filterValueInfo) return { "valid": false };

  // Checks values
  return isValidFilterValueService(filterValueInfo, value);
}
