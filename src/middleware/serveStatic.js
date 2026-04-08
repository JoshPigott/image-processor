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
function isUserImage(pathname, usersSessionId) {
  // Image pathname is {"output" or "input"}/{imageId}.png
  const splitPathname = pathname.split("/")[2];
  const imageId = splitPathname.split(".")[0];

  const imagesSessionId = dbGetImageSessionId(imageId);
  return (usersSessionId === imagesSessionId);
}

// Return image if one and it is theirs image else undefined
async function serveStaticImage(req, pathname, sessionId) {
  const path = "./data/images";
  const filePath = `${path}${pathname}`;

  if (!(await isFile(filePath))) {
    return undefined;
  }
  if (isUserImage(pathname, sessionId) !== true) {
    return undefined;
  }
  return await serveFile(req, filePath);
}

// Checks if there is static file or image if yes returns it
export async function serveStatic(req, pathname, sessionId) {
  const staticFile = await serveStaticFile(req, pathname);
  if (staticFile !== undefined) {
    return staticFile;
  }
  const staticImage = await serveStaticImage(req, pathname, sessionId);
  if (staticImage !== undefined) {
    return staticImage;
  } else {
    return undefined;
  }
}
