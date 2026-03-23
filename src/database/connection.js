import { Database } from "@db/sqlite";

const db = new Database("src/data/database");

Deno.addSignalListener("SIGINT", () => {
  db.close();
  Deno.exit();
});

export default db;
