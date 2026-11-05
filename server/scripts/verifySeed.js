
import {
  getDatabaseClient,
  closeDatabaseClient,
} from "../db/client.js";

const expectedCounts = {
  site_settings: 1,
  profile_about: 1,
  education: 3,
  experience: 4,
  experience_roles: 6,
  skill_categories: 4,
  skills: 38,
  project_categories: 4,
  projects: 20,
  reviews: 4,
  certificates: 14,
  faqs: 5,
  social_links: 4,
  gallery_items: 8,
};

async function verifySeed() {
  const db = getDatabaseClient();
  let hasErrors = false;
  let totalRecords = 0;

  console.log("Checking seeded portfolio records...\n");

  for (const [table, expected] of Object.entries(expectedCounts)) {
    const result = await db.execute(
      `SELECT COUNT(*) AS total FROM ${table}`
    );

    const actual = Number(result.rows[0].total);
    totalRecords += actual;

    const passed = actual === expected;

    console.log(
      `${passed ? "PASS" : "FAIL"} ${table}: ${actual}/${expected}`
    );

    if (!passed) hasErrors = true;
  }

  console.log(`\nTotal records: ${totalRecords}/116`);

  const foreignKeyCheck = await db.execute(
    "PRAGMA foreign_key_check"
  );

  console.log(
    `Foreign key violations: ${foreignKeyCheck.rows.length}`
  );

  if (foreignKeyCheck.rows.length > 0) {
    hasErrors = true;
    console.table(foreignKeyCheck.rows);
  }

  const adminCheck = await db.execute(`
    SELECT
      (SELECT COUNT(*) FROM admin_users) AS admins,
      (SELECT COUNT(*) FROM admin_sessions) AS sessions
  `);

  console.log(
    `Admin accounts: ${adminCheck.rows[0].admins}`
  );
  console.log(
    `Admin sessions: ${adminCheck.rows[0].sessions}`
  );

  if (
    totalRecords !== 116 ||
    foreignKeyCheck.rows.length !== 0
  ) {
    hasErrors = true;
  }

  if (hasErrors) {
    throw new Error("Seed verification failed. Review the results.");
  }

  console.log("\nSeed verification passed.");
}

try {
  await verifySeed();
} catch (error) {
  console.error("Verification error:", error.message);
  process.exitCode = 1;
} finally {
  await closeDatabaseClient();
}
