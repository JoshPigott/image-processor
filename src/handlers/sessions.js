import {
  createSessionService,
  getSessionService,
} from "../services/sessions.js";
import { json } from "../utils/json.js";

export function createSession(_ctx) {
  const sessionId = createSessionService();
  console.log("New sesion created:", sessionId);
  return new Response(null, {
    status: 204,
    headers: {
      "Set-Cookie": `sessionId=${sessionId}; HttpOnly; samesite=strict; Path=/`,
    },
  });
}

export function getSession(ctx) {
  getSessionService(ctx.req);
  return json({ sessionId: "Great question" }, { status: 200 });
}
