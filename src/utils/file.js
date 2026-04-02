export async function isFile(filePath) {
  try {
    await Deno.stat(filePath);
    return true;
  } catch (_err) {
    return false;
  }
}
