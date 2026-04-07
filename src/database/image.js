import db from "./connection.js";

export function dbAddImage({
  sessionId,
  imageId,
  imageName,
  width,
  height,
}) {
  db.prepare(
    `INSERT INTO images (sessionId, imageId, imageName, width, height)
     VALUES(?,?,?,?,?)`,
  ).run(sessionId, imageId, imageName, width, height);
}

// When user deletes image
export function dbDeleteImage(imageId) {
  db.prepare(`DELETE FROM images WHERE imageId=?`).run(imageId);
}

// When session expires
export function dbDeleteUsersImages(sessionId) {
  db.prepare(`DELETE FROM images WHERE sessionId=?`).run(sessionId);
}

export function dbGetAllUsersImages(sessionId) {
  return db.prepare(`SELECT * FROM images WHERE sessionId=?`).all(sessionId);
}

export function dbGetImage(imageId) {
  return db.prepare(`SELECT * FROM images WHERE imageId=?`).get(imageId);
}

export function dbGetImageName(imageId) {
  const res = db.prepare(`SELECT imageName FROM images WHERE imageId=?`).get(
    imageId,
  );
  return res.imageName;
}

export function dbGetImageSessionId(imageId) {
  const res = db.prepare(`SELECT sessionId FROM images WHERE imageId=?`).get(
    imageId,
  );
  return res?.sessionId;
}

export function dbGetImageDimensions(imageId) {
  return db.prepare(`SELECT width, height FROM images WHERE imageId=?`).get(
    imageId,
  );
}
