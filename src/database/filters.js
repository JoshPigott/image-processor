import db from "./connection.js";

export function dbAddFilter(sessionId, imageId, filterName, value) {
  db.prepare(`INSERT INTO filters (sessionId, imageId, filterName, value)
     VALUES (?,?,?,?)`).run(sessionId, imageId, filterName, value);
}

// Update filter values
export function dbUpdateFilter(imageId, filterName, value) {
  db.prepare(`UPDATE filters SET value=? WHERE imageId=? AND filterName=?`).run(
    value,
    imageId,
    filterName,
  );
}

export function dbRemoveFilter(imageId, filterName) {
  db.prepare(`DELETE FROM filters WHERE imageId=? AND filterName=?`).run(
    imageId,
    filterName,
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
export function dbIsFilter(imageId, filterName) {
  return db.prepare(`SELECT * FROM filters WHERE imageId=? AND filterName=?`)
    .get(
      imageId,
      filterName,
    );
}

export function dbGetFilters(imageId) {
  return db.prepare(`SELECT * FROM filters WHERE imageId=?`).all(imageId);
}
