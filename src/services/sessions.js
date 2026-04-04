import {
  dbCreateSession,
  dbDeleteSession,
  dbGetAllSession,
  dbGetSession,
} from "../database/sessions.js";
import { dbDeleteAllFilters } from "../database/filters.js";
import { dbDeleteUsersImages, dbGetAllUsersImages } from "../database/image.js";

// Removes users data from database and remove users images
async function cleanUp(sessionId) {
  const images = dbGetAllUsersImages(sessionId);
  for (const image of images) {
    try {
      await Deno.remove(`data/images/input/${image.imageId}.png`);
      await Deno.remove(`data/images/output/${image.imageId}.png`);
    } catch (_err) {
      // File images were deleted or not made
    }
  }
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
  setTimeout(async () => {
    await cleanUp(sessionId);
  }, sixHours);

  // ExpiryTime is a string to safely store large numbers without overflow
  dbCreateSession(sessionId, expiryTime.toString());
  return sessionId;
}

// Runs when server start up to sure only valid sessions
export async function expiredSession() {
  const timeNow = Date.now();
  let sessions = dbGetAllSession();
  // Converts expiryTime back to a number
  sessions = sessions.map((session) => ({
    sessionId: session.sessionId,
    expiryTime: session.expiryTime,
  }));

  for (const session of sessions) {
    if (session.expiryTime <= timeNow) {
      await cleanUp(session.sessionId);
    } else {
      // Deletes session when it expiries
      const timeTillExpiry = session.expiryTime - timeNow;
      setTimeout(async () => {
        await cleanUp(session.sessionId);
      }, timeTillExpiry);
    }
  }
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
