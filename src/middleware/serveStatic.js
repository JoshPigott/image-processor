import { getSessionIdService } from "../services/sessions.js";
import { dbGetImageSessionId } from "../database/image.js";
import { serveFile } from "@std/http/file-server";
import { isFile } from "../utils/file.js";

// Return static if one else undefined
async function serveStaticFile(req, pathname) {
  const path = "./src/public";
  let filePath;

  // Root static file
  if (pathname === "/") {
    filePath = `${path}/index.html`;
    if (await isFile(filePath)) {
      return await serveFile(req, filePath);
    }
  } else {
    filePath = `${path}/${pathname}`;
    if (await isFile(filePath)) {
      return await serveFile(req, filePath);
    }
  }
  return undefined;
}

// Checks if user made the image or not
function isUserImage(req, pathname) {
  // Image pathname is {"output" or "input"}/{imageId}.png
  const splitPathname = pathname.split("/")[2];
  const imageId = splitPathname.split(".")[0];

  const usersSessionId = getSessionIdService(req);
  const imagesSessionId = dbGetImageSessionId(imageId);
  return (usersSessionId === imagesSessionId);
}

// Return image if one and it is theirs image else undefined
async function serveStaticImage(req, pathname) {
  const path = "./data/images";
  const filePath = `${path}${pathname}`;

  if (!(await isFile(filePath))) {
    return undefined;
  }
  if (isUserImage(req, pathname) !== true) {
    return undefined;
  }
  return await serveFile(req, filePath);
}

// Checks if there is static file or image if yes returns it
export async function serveStatic(req, pathname) {
  const staticFile = await serveStaticFile(req, pathname);
  if (staticFile !== undefined) {
    return staticFile;
  }
  const staticImage = await serveStaticImage(req, pathname);
  if (staticImage !== undefined) {
    return staticImage;
  } else {
    return undefined;
  }
}
