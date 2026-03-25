import db from "./connection.js";

export function dbAddImage(sessionId, imageId, imageName, imagePath) {
  db.prepare(`INSERT INTO images (sessionId, imageId, imageName, imagePath)
     VALUES(?,?,?,?)`).run(sessionId, imageId, imageName, imagePath);
}

// When user deletes image
export function dbDeleteImage(imageId) {
  db.prepare(`DELETE FROM images WHERE imageId=?`).run(imageId);
}

// When session expires
export function dbDeleteUsersImages(sessionId) {
  db.prepare(`DELETE FROM images WHERE sessionId=?`).run(sessionId);
}

export function dbGetImage(imageId) {
  return db.prepare(`SELECT * FROM images WHERE imageId=?`).get(imageId);
}
