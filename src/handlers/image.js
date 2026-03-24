import { printImageOnCanvas } from "../services/make-canvas.js";
import {
  dbAddFilter,
  dbIsFilter,
  dbRemoveFilter,
  dbUpdateFilter,
} from "../database/filters.js";
import { dbAddImage } from "../database/image.js";
import { getSessionIdService } from "../services/session.js";
import { isValidFilterService } from "../services/filters.js";
import { json } from "../utils/json.js";

export async function printImage(_ctx) {
  await printImageOnCanvas();
  return json({ "sucess": "Image has been printed" }, { status: 201 });
}

// Adds and keeps of the filters being applied to image
export async function addImage(ctx) {
  const sessionId = getSessionIdService(ctx.req);
  const formData = await ctx.req.formData();
  const imageName = formData.get("imageName");
  const imageId = crypto.randomUUID();

  // Later this come with the file image file
  const imagePath = "./src/public/assets/dog.ppm";

  dbAddImage(sessionId, imageId, imageName, imagePath);
  console.log("image id:", imageId);
  return json({ "sucess": "Image has been added" }, { status: 201 });
}

// Updates filter value in db and return response
function chagneFilter(
  isFilterValid,
  filterApplied,
  sessionId,
  imageId,
  filter,
  value,
) {
  // Defualt value so no need to track and apply filter
  if (isFilterValid.default === true) {
    dbRemoveFilter(imageId, filter);
    return json({ "sucess": "Default appiled" }, { status: 201 });
  } // Filter is not being applied
  else if (filterApplied === undefined) {
    dbAddFilter(sessionId, imageId, filter, value);
  } // Filter is already being applied
  else {
    dbUpdateFilter(imageId, filter, value);
  }
  return json({ "sucess": "Filter is being applied" }, { status: 201 });
}

// Adds filter to database unless valid
export async function addFilter(ctx) {
  const formData = await ctx.req.formData();
  // I may need to loop tought this later one and
  // as there maybe many filters being applied
  const sessionId = getSessionIdService(ctx.req);
  const imageId = formData.get("imageId");
  const filter = formData.get("filter");
  // This will need to chagne later on when value is not a number
  const value = Number(formData.get("value"));
  const filterApplied = dbIsFilter(imageId, filter);

  // Here I need to if valid filter and valid value
  const isFilterValid = isValidFilterService(filter, value);
  console.log(isFilterValid);

  if (isFilterValid.valid === false) {
    return json({ "error": "Invalid filter" }, { status: 400 });
  }
  return chagneFilter(
    isFilterValid,
    filterApplied,
    sessionId,
    imageId,
    filter,
    value,
  );
}

// Removes filter
export async function removeFilter(ctx) {
  const formData = await ctx.req.formData();
  const imageId = formData.get("imageId");
  const filter = formData.get("filter");
  const filterApplied = dbIsFilter(imageId, filter);
  // Filter is being applied
  if (filterApplied !== undefined) {
    dbRemoveFilter(imageId, filter);
    return json({ "sucess": "Filter was removed" }, { status: 201 });
  } // Invalid filter
  else {
    return json({ "sucess": "Invalid filter" }, { status: 201 });
  }
}
