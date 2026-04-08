import { dbIsFilter, dbRemoveFilter } from "../database/filters.js";
import { dbGetImageDimensions, dbGetImageName } from "../database/image.js";
import { getSessionIdService } from "../services/sessions.js";
import { isValidFilterService } from "../services/image-filters/filters-validation.js";
import { chagneFilterService } from "../services/image-filters/apply-filters.js";
import { renderImageService } from "../services/render-image-output.js";
import { imageOutputHtml } from "../services/htmx-reponses/image-output.js";
import { filterResetHtml } from "../services/htmx-reponses/filter-reset.js";
import { resetButtonHtml } from "../utils/htmx-reponses.js";
import { htmlResponse } from "../utils/responses.js";

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
  const imageName = dbGetImageName(imageId);
  const html = imageOutputHtml({ imageId, imageName });
  return htmlResponse(html, { status: 201 });
}

// Removes filter and the defualt silder and imgae with the filter
export async function resetFilter(ctx) {
  const formData = await ctx.req.formData();
  const imageId = formData.get("imageId");
  const filterName = formData.get("filterName");
  const filterApplied = dbIsFilter(imageId, filterName);

  // Filter is being applied
  if (filterApplied !== undefined) {
    dbRemoveFilter(imageId, filterName);
    renderImageService(imageId);
    const imageName = dbGetImageName(imageId);

    const html = filterResetHtml(filterName, imageId, imageName);
    return htmlResponse(html, { status: 200 });
  }
  // Filter was not being applied the first place
  const html = resetButtonHtml(imageId, filterName);
  return htmlResponse(html, { status: 200 });
}
