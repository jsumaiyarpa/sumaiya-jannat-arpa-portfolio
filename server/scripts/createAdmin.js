
import { randomUUID } from "node:crypto";

import { getDatabaseClient, closeDatabaseClient } from "../db/client.js";
import { hashPassword } from "../utils/password.js";

async function createAdmin() {
  const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const fullName = process.env.ADMIN_FULL_NAME?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !email || !fullName || !password) {
    throw new Error(
      "Missing admin details. Set ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_FULL_NAME and ADMIN_PASSWORD."
    );
  }

  if (
    username.length > 50 ||
    email.length > 254 ||
    fullName.length > 150
  ) {
    throw new Error("One or more admin details exceed the allowed length.");
  }

  if (password.length < 12 || Buffer.byteLength(password, "utf8") > 72) {
    throw new Error("Password must be at least 12 characters and no more than 72 bytes.");
  }

  const db = getDatabaseClient();

  const existing = await db.execute({
    sql: `
      SELECT id
      FROM admin_users
      WHERE lower(username) = ?
         OR lower(email) = ?
      LIMIT 1
    `,
    args: [username, email],
  });

  if (existing.rows.length > 0) {
    throw new Error("An admin with this username or email already exists.");
  }

  const passwordHash = await hashPassword(password);

  await db.execute({
    sql: `
      INSERT INTO admin_users (
        id,
        username,
        email,
        full_name,
        password_hash,
        role,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, 'admin', 1)
    `,
    args: [
      randomUUID(),
      username,
      email,
      fullName,
      passwordHash,
    ],
  });

  console.log("Initial admin account created successfully.");
}

try {
  await createAdmin();
} catch (error) {
  console.error("Admin creation failed:", error.message);
  process.exitCode = 1;
} finally {
  await closeDatabaseClient();
}
