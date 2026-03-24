import { Database } from "@db/sqlite";

const db = new Database("data/database");

Deno.addSignalListener("SIGINT", () => {
  db.close();
  Deno.exit();
});

export default db;
