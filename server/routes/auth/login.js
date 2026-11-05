
import { Router } from "express";
import { randomUUID } from "node:crypto";
import { rateLimit } from "express-rate-limit";

import { getDatabaseClient } from "../../db/client.js";
import { verifyPassword } from "../../utils/password.js";
import { generateSessionToken, hashSessionToken } from "../../utils/session.js";
import { setSessionCookie } from "../../utils/cookie.js";
import { requireSameOrigin } from "../../middleware/auth/requireSameOrigin.js";

const router = Router();

const SESSION_DURATION_DAYS = 7;

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});
router.post("/", loginLimiter, requireSameOrigin, async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password ||
      username.length > 254 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const db = getDatabaseClient();

    const normalizedUsername = username.trim().toLowerCase();

    const result = await db.execute({
      sql: `
        SELECT
          id,
          username,
          email,
          full_name,
          role,
          password_hash,
          is_active
        FROM admin_users
        WHERE lower(username) = ?
           OR lower(email) = ?
        LIMIT 1
      `,
      args: [normalizedUsername, normalizedUsername],
    });

    const admin = result.rows[0];

    if (!admin || Number(admin.is_active) !== 1) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const passwordMatches = await verifyPassword(
      password,
      admin.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const sessionToken = generateSessionToken();
    const tokenHash = hashSessionToken(sessionToken);
    const sessionId = randomUUID();

    const expiresAt = new Date(
      Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();

    const tx = await db.transaction("write");

    try {
      await tx.execute({
        sql: `
          INSERT INTO admin_sessions (
            id,
            admin_id,
            token_hash,
            ip_address,
            user_agent,
            expires_at
          )
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        args: [
          sessionId,
          admin.id,
          tokenHash,
          req.ip || null,
          req.get("user-agent") || null,
          expiresAt,
        ],
      });

      await tx.execute({
        sql: `
          UPDATE admin_users
          SET last_login = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        args: [admin.id],
      });

      await tx.commit();
    } catch (error) {
      await tx.rollback();
      throw error;
    }

    setSessionCookie(res, sessionToken);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        fullName: admin.full_name,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
