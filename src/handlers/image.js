import { printImageOnCanvas } from "../services/make-canvas.js";
import {
  dbAddFilter,
  dbIsFilter,
  dbRemoveFilter,
  dbUpdateFilter,
} from "../database/filters.js";
import { dbGetImageDimensions } from "../database/image.js";
import { getSessionIdService } from "../services/sessions.js";
import { isValidFilterService } from "../services/filters-validation.js";
import { addImageService } from "../services/image.js";
import { json } from "../utils/json.js";

export async function printImage(ctx) {
  const body = await ctx.req.json();
  const imageId = body.imageId;
  await printImageOnCanvas(imageId);
  return json({ "sucess": "Image has been printed" }, { status: 201 });
}

// Adds and keeps of the filters being applied to image
export async function addImage(ctx) {
  const formData = await ctx.req.formData();
  const image = formData.get("image");

  const upload = await addImageService(ctx.req, image);
  if (!upload) {
    return json({ "error": "Invalid image" }, { status: 201 });
  }
  return json({ "sucess": "Image has been added" }, { status: 201 });
}

// Updates filter value in db and return response
function chagneFilter(
  isFilterValid,
  sessionId,
  imageId,
  filterName,
  value,
) {
  const filterApplied = dbIsFilter(imageId, filterName);
  // Defualt value so no need to track and apply filter
  if (isFilterValid.default === true) {
    dbRemoveFilter(imageId, filterName);
    return json({ "sucess": "Default appiled" }, { status: 201 });
  } // Filter is not being applied
  else if (filterApplied === undefined) {
    dbAddFilter(sessionId, imageId, filterName, value);
  } // Filter is already being applied
  else {
    dbUpdateFilter(imageId, filterName, value);
  }
  return json({ "sucess": "Filter is being applied" }, { status: 201 });
}

// Adds filter to database unless valid
export async function addFilter(ctx) {
  const sessionId = getSessionIdService(ctx.req);
  const formData = await ctx.req.formData();
  const imageId = formData.get("imageId");
  const filterName = formData.get("filterName");
  const value = formData.get("value");
  const imageDimensions = await dbGetImageDimensions(imageId);

  const isFilterValid = isValidFilterService(
    filterName,
    value,
    imageDimensions,
  );

  if (isFilterValid.valid === false) {
    return json({ "error": "Invalid filter" }, { status: 400 });
  }
  return chagneFilter(
    isFilterValid,
    sessionId,
    imageId,
    filterName,
    value,
  );
}

// Removes filter
export async function removeFilter(ctx) {
  const formData = await ctx.req.formData();
  const imageId = formData.get("imageId");
  const filterName = formData.get("filterName");
  const filterApplied = dbIsFilter(imageId, filterName);
  // Filter is being applied
  if (filterApplied !== undefined) {
    dbRemoveFilter(imageId, filterName);
    return json({ "sucess": "Filter was removed" }, { status: 201 });
  } // Invalid filter
  else {
    return json({ "sucess": "Invalid filter" }, { status: 201 });
  }
}
