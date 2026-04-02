// I will need to import all the routes
import { dbSetUpDatabase } from "./database/schema.js";
import { expiredSession } from "./services/sessions.js";
import { compiled } from "./routes/index.js";
import { serveStaticFile } from "./middleware/serveStaticFiles.js";
import { json } from "./utils/json.js";

dbSetUpDatabase();
// Makes sure all session expire at the right time
await expiredSession();

// Links request to handlers and servers static files
async function server(req) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const method = req.method;

  const staticFile = await serveStaticFile(req, pathname);
  // Return if there a static file
  if (staticFile !== undefined) return staticFile;

  // Loops over routes to trying find one that matches the request
  for (const r of compiled) {
    if (r.method !== method) continue;
    const matches = r.pattern.exec({ pathname: pathname });
    if (!matches) continue;
    const parmas = matches.pathname.groups;

    const ctx = { method, req, parmas };
    return await r.handler(ctx);
  }

  console.log(`pathname: ${pathname} was not found`);
  return json({ error: "Not found" }, { status: 404 });
}

// Wraps server making sure errors don't leak
async function safeServer(req) {
  try {
    return await server(req);
  } catch (err) {
    console.log(`There was an error of: ${err}`);
    return json({ error: "There is an error" }, { status: 500 });
  }
}

Deno.serve({ port: 8000 }, safeServer);
