import { dbGetSession } from "../database/sessions.js";
import { createSessionService } from "../services/sessions.js";

// Get cookie from request and cookies has an object
function getCookies(req) {
  try {
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
  } // No cookies
  catch (_err) {
    return false;
  }
}

// Gets session data with sessionId
function getSessionId(req) {
  const cookies = getCookies(req);
  if (cookies === false) return undefined;
  const sessionId = cookies?.sessionId;
  const session = dbGetSession(sessionId);
  return session?.sessionId;
}

// Gets the sessionId or sets it up
export function handleSession(server) {
  return async (req) => {
    let sessionId = getSessionId(req);

    if (sessionId === undefined) {
      sessionId = createSessionService();
      const serverResponse = await server(req, sessionId);

      console.log("session has been made:", sessionId);
      serverResponse.headers.set(
        "Set-Cookie",
        `sessionId=${sessionId}; HttpOnly; SameSite=Strict; Path=/`,
      );
      return serverResponse;
    }
    return await server(req, sessionId);
  };
}
