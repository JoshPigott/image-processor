import {
  dbCreateSession,
  dbDeleteSession,
  dbGetAllSession,
  dbGetSession,
} from "../database/sessions.js";
import { dbDeleteAllFilters } from "../database/filters.js";
import { dbDeleteUsersImages } from "../database/image.js";

// Removes users data from database
function cleanUp(sessionId) {
  dbDeleteAllFilters(sessionId);
  dbDeleteUsersImages(sessionId);
  dbDeleteSession(sessionId);
  console.log(`Session ${sessionId} was deleted`);
}

// Create a session with a expiry time
export function createSessionService() {
  const sixHours = 1000 * 60 * 60 * 6;
  const timeNow = Date.now();
  const expiryTime = timeNow + sixHours;
  const sessionId = crypto.randomUUID();

  // Deletes session when it expiries
  setTimeout(() => {
    cleanUp(sessionId);
  }, sixHours);

  // ExpiryTime is a string to safely store large numbers without overflow
  dbCreateSession(sessionId, expiryTime.toString());
  return sessionId;
}

// Runs when server start up to sure only valid sessions
export function expiredSession() {
  const timeNow = Date.now();
  let sessions = dbGetAllSession();
  // Converts expiryTime back to a number
  sessions = sessions.map((session) => ({
    sessionId: session.sessionId,
    expiryTime: session.expiryTime,
  }));

  sessions.forEach((session) => {
    if (session.expiryTime <= timeNow) {
      cleanUp(session.sessionId);
    } else {
      // Deletes session when it expiries
      const timeTillExpiry = session.expiryTime - timeNow;
      setTimeout(() => {
        cleanUp(session.sessionId);
      }, timeTillExpiry);
    }
  });
}

// Get cookie from request and cookies has an object
function getCookies(req) {
  const cookieString = req.headers.get("cookie");
  // Spilts cookies up
  let splitCookies = cookieString.split(";");
  // Remove white space
  splitCookies = splitCookies.map((spiltCookie) =>
    spiltCookie.trim().replaceAll('"', "")
  );
  // Creates a key value subarrays
  const keyValueCookies = splitCookies.map((splitCookie) =>
    splitCookie.split("=")
  );
  // Returns as an obect
  return Object.fromEntries(keyValueCookies);
}

// Gets session data with sessionId
export function getSessionService(req) {
  const cookies = getCookies(req);
  const sessionId = cookies.sessionId;
  const session = dbGetSession(sessionId);
  return session;
}

// Returns session Id
export function getSessionIdService(req) {
  const session = getSessionService(req);
  return session.sessionId;
}
