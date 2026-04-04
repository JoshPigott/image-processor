import { dbIsFilter, dbRemoveFilter } from "../database/filters.js";
import { dbGetImageDimensions } from "../database/image.js";
import { getSessionIdService } from "../services/sessions.js";
import { isValidFilterService } from "../services/filters-validation.js";
import { imageOutputView } from "../views/image-output.js";
import { htmlResponse } from "../utils/html-response.js";
import { json } from "../utils/json.js";
import { chagneFilterService } from "../services/apply-filters.js";

// Adds filter to database unless valid
export async function addFilter(ctx) {
  const sessionId = getSessionIdService(ctx.req);
  const formData = await ctx.req.formData();
  const imageId = formData.get("imageId");
  const filterName = formData.get("filterName");
  const value = formData.get("filterValue");
  const imageDimensions = await dbGetImageDimensions(imageId);

  const isFilterValid = isValidFilterService(
    filterName,
    value,
    imageDimensions,
  );
  if (isFilterValid.valid === false) {
    const html = ``;
    return htmlResponse(html, { status: 400 });
  }
  await chagneFilterService(
    isFilterValid,
    sessionId,
    imageId,
    filterName,
    value,
  );
  const html = imageOutputView(imageId)
  return htmlResponse(html, { status: 201 });
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