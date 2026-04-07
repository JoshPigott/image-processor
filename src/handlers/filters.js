import { dbIsFilter, dbRemoveFilter } from "../database/filters.js";
import { dbGetImageDimensions } from "../database/image.js";
import { getSessionIdService } from "../services/sessions.js";
import { isValidFilterService } from "../services/image-filters/filters-validation.js";
import { chagneFilterService } from "../services/image-filters/apply-filters.js";
import { imageOutputView } from "../views/image-output.js";
import { htmlResponse, json } from "../utils/responses.js";

// The info need to add a filter
async function getFilterInfo(formData, req) {
  const sessionId = getSessionIdService(req);
  const imageId = formData.get("imageId");
  const filterName = formData.get("filterName");
  const value = formData.get("filterValue");
  const imageDimensions = await dbGetImageDimensions(imageId);
  return { sessionId, imageId, filterName, value, imageDimensions };
}

// Adds filter to database unless valid
export async function addFilter(ctx) {
  const formData = await ctx.req.formData();
  const { sessionId, imageId, filterName, value, imageDimensions } =
    await getFilterInfo(formData, ctx.req);

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
  const html = imageOutputView(imageId);
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
