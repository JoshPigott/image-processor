import { getFilterInfo } from "../../utils/filters-info.js";

// Checks if value is in a ragne of allowed values
function validateRange(value, filterInfo) {
  value = Number(value);
  if (value === filterInfo.defaultValue) {
    return { "valid": true, "default": true };
  } else if (filterInfo.min <= value && filterInfo.max >= value) {
    return { "valid": true, "default": false };
  } else {
    return { "valid": false };
  }
}

// Checks if value is in a arrary of possble values
function validateBoolean(value, filterInfo) {
  if (value === filterInfo.defaultValue) {
    return { "valid": true, "default": true };
  }
  return {
    "valid": filterInfo.values.includes(value),
    "default": false,
  };
}

// Checks if value is in a arrary of possble values
function validateSpecific(value, filterInfo) {
  value = Number(value);
  if (value === filterInfo.defaultValue) {
    return { "valid": true, "default": true };
  }
  return {
    "valid": filterInfo.values.includes(value),
    "default": false,
  };
}

function isDefaultCroppingValues(croppingValues) {
  return croppingValues === [0, 0, 0, 0];
}

function validateCropPositiveValues(top, bottom, left, right) {
  return top >= 0 && bottom >= 0 && left >= 0 && right >= 0;
}

function isVerticalCropValid(top, bottom, imageDimensions) {
  return top + bottom < imageDimensions.height;
}

function isHorizontalCropValid(left, right, imageDimensions) {
  return left + right < imageDimensions.width;
}

// Check that cropping values are postive and not big then image
function isvalidCrop(croppingValues, imageDimensions) {
  const top = croppingValues[0];
  const bottom = croppingValues[1];
  const left = croppingValues[2];
  const right = croppingValues[3];

  if (!validateCropPositiveValues(top, bottom, left, right)) return false;
  if (!isVerticalCropValid(top, bottom, imageDimensions)) return false;
  if (!isHorizontalCropValid(left, right, imageDimensions)) return false;
}

// Checks if crop are default and valid
function validateCropping(value, imageDimensions) {
  try {
    // Converts cropping from string into array
    const croppingValues = JSON.parse(value);
    croppingValues.map((croppingValue) => Number(croppingValue));
    if (isDefaultCroppingValues(croppingValues)) {
      return { "valid": true, "default": true };
    } else if (isvalidCrop(croppingValues, imageDimensions) === false) {
      return { "valid": false };
    } else return { "valid": true, "default": false };
  } catch (_err) {
    return { "valid": false };
  }
}

// Checks if filter value is valid and is default value or not
function isValidFilterValueService(filterInfo, value, imageDimensions) {
  if (filterInfo.type === "range") {
    return validateRange(value, filterInfo);
  } else if (filterInfo.type === "boolean") {
    return validateBoolean(value, filterInfo);
  } else if (filterInfo.type === "specific") {
    return validateSpecific(value, filterInfo);
  } else if (filterInfo.type === "cropping") {
    return validateCropping(value, imageDimensions);
  }
  return { "valid": false };
}

// Whitelists filters and filter values
export function isValidFilterService(filterName, value, imageDimensions) {
  const filterInfo = getFilterInfo(filterName);

  // Filter does not exist
  if (!filterInfo) return { "valid": false };
  // No filter value
  else if (value === undefined || value === null) return { "valid": false };

  // Checks values
  return isValidFilterValueService(filterInfo, value, imageDimensions);
}
