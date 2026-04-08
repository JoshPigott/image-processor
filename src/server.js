import { dbSetUpDatabase } from "./database/schema.js";
import { expiredSession } from "./services/sessions.js";
import { compiled } from "./routes/index.js";
import { serveStatic } from "./middleware/serveStatic.js";
import { handleSession } from "./middleware/handle-session.js";
import { json } from "./utils/responses.js";

dbSetUpDatabase();
// Makes sure all session expire at the right time
await expiredSession();

// Links request to handlers and servers static files
async function server(req, sessionId) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const method = req.method;

  const staticAsset = await serveStatic(req, pathname, sessionId);
  if (staticAsset !== undefined) return staticAsset;

  // Loops over routes to trying find one that matches the request
  for (const r of compiled) {
    if (r.method !== method) continue;
    const matches = r.pattern.exec({ pathname: pathname });
    if (!matches) continue;
    const parmas = matches.pathname.groups;

    const ctx = { method, req, parmas, url, sessionId };

    return await r.handler(ctx);
  }

  console.log(`pathname: ${pathname} was not found`);
  return json({ error: "Not found" }, { status: 404 });
}

// Wraps server making sure errors don't leak
async function safeServer(req) {
  try {
    const sessionWrappedServer = await handleSession(server);
    return await sessionWrappedServer(req);
  } catch (err) {
    console.log(`There was an error of: ${err}`);
    return json({ error: "There is an error" }, { status: 500 });
  }
}

Deno.serve({ port: 8000 }, safeServer);
