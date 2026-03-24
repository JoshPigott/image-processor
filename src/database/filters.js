import db from "./connection.js";

export function dbAddFilter(sessionId, imageId, filter, value) {
  db.prepare(`INSERT INTO filters (sessionId, imageId, filter, value)
     VALUES (?,?,?,?)`).run(sessionId, imageId, filter, value);
}

// Update filter values
export function dbUpdateFilter(imageId, filter, value) {
  db.prepare(`UPDATE filters SET value=? WHERE imageId=? AND filter=?`).run(
    value,
    imageId,
    filter,
  );
}

export function dbRemoveFilter(imageId, filter) {
  db.prepare(`DELETE FROM filters WHERE imageId=? AND filter=?`).run(
    imageId,
    filter,
  );
}

// Used when image is deleted
export function dbRemoveAllFilter(imageId) {
  db.prepare(`DELETE FROM filters WHERE imageId=?`).run(imageId);
}

// Used when session is expired
export function dbDeleteAllFilters(sessionId) {
  db.prepare(`DELETE FROM filters WHERE sessionId=?`).run(sessionId);
}

// Check is a filter is in the database or not
export function dbIsFilter(imageId, filter) {
  return db.prepare(`SELECT * FROM filters WHERE imageId=? AND filter=?`).get(
    imageId,
    filter,
  );
}

export function dbGetFilters(imageId) {
  return db.prepare(`SELECT * FROM filters WHERE imageId=?`).all(imageId);
}
