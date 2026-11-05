
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  getDatabaseClient,
  closeDatabaseClient,
} from "../db/client.js";

const schemaPath = new URL(
  "../../turso/01_turso_schema.sql",
  import.meta.url
);

async function runSchema() {
  const sql = await readFile(fileURLToPath(schemaPath), "utf8");

  const db = getDatabaseClient();

  console.log("Connecting to the configured Turso database...");
  await db.execute("SELECT 1");

  console.log("Executing schema migration...");

  await db.executeMultiple(sql);

  console.log("Schema migration completed successfully.");
}

try {
  await runSchema();
} catch (error) {
  console.error("Schema migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await closeDatabaseClient();
}
