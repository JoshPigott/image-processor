import { serveFile } from "@std/http/file-server";
import { join } from "@std/path/join";

async function isFile(filePath) {
  try {
    await Deno.stat(filePath);
    return true;
  } catch (_err) {
    return false;
  }
}

// Return static if one else undefined
export async function serveStaticFile(req, pathname) {
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
