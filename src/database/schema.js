import db from "./connection.js";

// Creates database tables
export function dbSetUpDatabase() {
  // ExpiryTime is a string to safely store large numbers without overflow
  db.prepare(
    `CREATE TABLE IF NOT EXISTS sessions (sessionId TEXT NOT NULL PRIMARY KEY, expiryTime TEXT NOT NULL)`,
  ).run();

  // Images
  db.prepare(
    `CREATE TABLE IF NOT EXISTS images (sessionId TEXT, imageId TEXT PRIMARY KEY,
     imageName TEXT, width INTEGER, height INTEGER,
     FOREIGN KEY (sessionId) REFERENCES sessions(sessionId))`,
  ).run();

  // Filters
  db.prepare(`CREATE TABLE IF NOT EXISTS filters (
     sessionId TEXT, imageId TEXT, filterName TEXT, value TEXT, 
     FOREIGN KEY (sessionId) REFERENCES sessions(sessionId),
     FOREIGN KEY (imageId) REFERENCES images(imageId))`).run();
}
