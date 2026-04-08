import {
  dbCreateSession,
  dbDeleteSession,
  dbGetAllSession,
} from "../database/sessions.js";
import { dbDeleteAllFilters } from "../database/filters.js";
import { dbDeleteUsersImages, dbGetAllUsersImages } from "../database/image.js";

async function deleteImageFile(imageId) {
  try {
    await Deno.remove(`data/images/input/${imageId}.png`);
    await Deno.remove(`data/images/output/${imageId}.png`);
  } catch (_err) {
    // File images were deleted or not made
  }
}

// Deletes all users image file so images don't build up
async function deleteImageFiles(sessionId) {
  const images = dbGetAllUsersImages(sessionId);
  for (const image of images) {
    await deleteImageFile(image.imageId);
  }
}

// Removes users data from database and remove users images
async function cleanUp(sessionId) {
  await deleteImageFiles(sessionId);
  dbDeleteAllFilters(sessionId);
  dbDeleteUsersImages(sessionId);
  dbDeleteSession(sessionId);
  console.log(`Session ${sessionId} was deleted`);
}

function getExpiryTime(sixHours) {
  const timeNow = Date.now();
  return timeNow + sixHours;
}

// Create a session with a expiry time
export function createSessionService() {
  const sixHours = 1000 * 60 * 60 * 6;
  const expiryTime = getExpiryTime(sixHours);
  const sessionId = crypto.randomUUID();

  // Deletes session when it expiries
  setTimeout(async () => {
    await cleanUp(sessionId);
  }, sixHours);

  // ExpiryTime is a string to safely store large numbers without overflow
  dbCreateSession(sessionId, expiryTime.toString());
  return sessionId;
}

// Deletes session when it expiries
function scheduleSessionCleanup(session, timeNow) {
  const timeTillExpiry = session.expiryTime - timeNow;
  setTimeout(async () => {
    await cleanUp(session.sessionId);
  }, timeTillExpiry);
}

// Runs when server start up to sure only valid sessions
export async function expiredSession() {
  const timeNow = Date.now();
  let sessions = dbGetAllSession();
  // Converts expiryTime back to a number
  sessions = sessions.map((session) => ({
    sessionId: session.sessionId,
    expiryTime: Number(session.expiryTime),
  }));

  for (const session of sessions) {
    if (session.expiryTime <= timeNow) {
      await cleanUp(session.sessionId);
    } else {
      scheduleSessionCleanup(session, timeNow);
    }
  }
}
