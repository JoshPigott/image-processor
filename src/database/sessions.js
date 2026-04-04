import db from "./connection.js";

// Create a new session in the database
export function dbCreateSession(sessionId, expiryTime) {
  db.prepare(`INSERT INTO sessions (sessionId, expiryTime) VALUES (?, ?)`).run(
    sessionId,
    expiryTime,
  );
}

// Gets session with sessionId
export function dbGetSession(sessionId) {
  return db.prepare(`SELECT * FROM sessions WHERE sessionId=?`).get(sessionId);
}

// Gets session with sessionId
export function dbGetAllSession() {
  return db.prepare(`SELECT * FROM sessions`).all();
}

export function dbDeleteSession(sessionId) {
  db.prepare(`DELETE FROM sessions WHERE sessionId=?`).run(sessionId);
}

export function dbUpdateLastImageId(sessionId, lastImageId) {
  db.prepare(`UPDATE sessions SET lastImageId=? WHERE sessionId=?`).run(
    lastImageId,
    sessionId,
  );
}

export function dbGetLastImageId(sessionId) {
  const res = db.prepare(`SELECT lastImageId FROM sessions WHERE sessionId=?`)
    .get(sessionId);
  return res.lastImageId;
}
