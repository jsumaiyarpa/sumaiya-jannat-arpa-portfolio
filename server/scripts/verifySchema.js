
import {
  getDatabaseClient,
  closeDatabaseClient,
} from "../db/client.js";

try {
  const db = getDatabaseClient();

  const result = await db.execute(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
      AND name NOT LIKE 'sqlite_%'
    ORDER BY name;
  `);

  console.table(result.rows);
  console.log(`Total tables: ${result.rows.length}`);

  if (result.rows.length !== 16) {
    console.error("WARNING: Expected 16 tables.");
    process.exitCode = 1;
  } else {
    console.log("Schema table count verified.");
  }
} catch (error) {
  console.error("Schema verification failed:", error.message);
  process.exitCode = 1;
} finally {
  await closeDatabaseClient();
}
