
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import {
  getDatabaseClient,
  closeDatabaseClient,
} from "../db/client.js";

const seedPath = new URL(
  "../../turso/02_turso_seed.sql",
  import.meta.url
);

async function runSeed() {
  const sql = await readFile(fileURLToPath(seedPath), "utf8");
  const db = getDatabaseClient();

  console.log("Checking Turso connection...");
  await db.execute("SELECT 1");

  console.log("Executing portfolio seed...");
  await db.executeMultiple(sql);

  console.log("Portfolio seed completed successfully.");
}

try {
  await runSeed();
} catch (error) {
  console.error("Portfolio seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await closeDatabaseClient();
}
