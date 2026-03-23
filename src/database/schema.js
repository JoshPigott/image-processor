import db from "./connection.js";

// Creates database tables
export function dbSetUpDatabase() {
  // ExpiryTime is a string to safely store large numbers without overflow
  db.prepare(
    `CREATE TABLE IF NOT EXISTS sessions (sessionId PRIMARY KEY, expiryTime TEXT)`,
  ).run();
}
