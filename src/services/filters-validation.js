// Whitelist all valid filter with a default value, type and allow values
function defineValidFilterService() {
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
    "saturation": {
      "type": "range",
      "defaultValue": 1,
      "min": 0.5,
      "max": 2.0,
    },
    "vibrance": {
      "type": "range",
      "defaultValue": 1,
      "min": 0,
      "max": 2,
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
    },
    "blur": {
      "type": "range",
      "defaultValue": 0,
      "min": 0,
      "max": 1.5,
    },
    "crop": {
      "type": "cropping",
    },
  };
  return validFilters;
}

// Checks if value is in a ragne of allowed values
function validateRange(value, filterValueInfo) {
  value = Number(value);
  if (value === filterValueInfo.defaultValue) {
    return { "valid": true, "default": true };
  } else if (filterValueInfo.min <= value && filterValueInfo.max >= value) {
    return { "valid": true, "default": false };
  } else {
    return { "valid": false };
  }
}

// Checks if value is in a arrary of possble values
function validateBoolean(value, filterValueInfo) {
  if (value === filterValueInfo.defaultValue) {
    return { "valid": true, "default": true };
  }
  return {
    "valid": filterValueInfo.values.includes(value),
    "default": false,
  };
}

// Checks if value is in a arrary of possble values
function validateSpecific(value, filterValueInfo) {
  value = Number(value);
  if (value === filterValueInfo.defaultValue) {
    return { "valid": true, "default": true };
  }
  return {
    "valid": filterValueInfo.values.includes(value),
    "default": false,
  };
}

// Refactor need
// Check that cropping values are postive and not big then image
function validateCropping(value, imageDimensions) {
  try {
    // Converts cropping from string into array
    const croppingValues = JSON.parse(value);
    croppingValues.map((croppingValue) => Number(croppingValue));

    const top = croppingValues[0];
    const bottom = croppingValues[1];
    const left = croppingValues[2];
    const right = croppingValues[3];

    if (croppingValues === [0, 0, 0, 0]) {
      return { "valid": true, "default": true };
    } else if (top + bottom >= imageDimensions.height) {
      return { "valid": false };
    } else if (left + right >= imageDimensions.width) return { "valid": false };
    else if (top < 0 || bottom < 0 || left < 0 || right < 0) {
      return { "valid": false };
    } else return { "valid": true, "default": false };
  } catch (_err) {
    return { "valid": false };
  }
}

// Checks if filter value is valid and is default value or not
function isValidFilterValueService(filterValueInfo, value, imageDimensions) {
  if (filterValueInfo.type === "range") {
    return validateRange(value, filterValueInfo);
  } else if (filterValueInfo.type === "boolean") {
    return validateBoolean(value, filterValueInfo);
  } else if (filterValueInfo.type === "specific") {
    return validateSpecific(value, filterValueInfo);
  } else if (filterValueInfo.type === "cropping") {
    return validateCropping(value, imageDimensions);
  }
  return { "valid": false };
}

// Whitelists filters and filter values
export function isValidFilterService(filterName, value, imageDimensions) {
  const validFilters = defineValidFilterService();
  const filterValueInfo = validFilters?.[filterName];

  // Filter does not exist
  if (!filterValueInfo) return { "valid": false };
  // No filter value
  else if (value === undefined || value === null) return { "valid": false };

  // Checks values
  return isValidFilterValueService(filterValueInfo, value, imageDimensions);
}
