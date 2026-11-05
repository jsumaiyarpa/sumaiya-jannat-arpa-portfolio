import { Router } from "express";

import { getDatabaseClient } from "../../db/client.js";
import { requireAdmin, SESSION_COOKIE_NAME } from "../../middleware/auth/requireAdmin.js";
import { requireSameOrigin } from "../../middleware/auth/requireSameOrigin.js";
import { hashSessionToken } from "../../utils/session.js";
import { clearSessionCookie } from "../../utils/cookie.js";

const router = Router();

// Get currently authenticated admin
router.get("/me", requireAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    admin: {
      id: req.admin.id,
      username: req.admin.username,
      email: req.admin.email,
      fullName: req.admin.full_name,
      role: req.admin.role,
    },
  });
});

// Logout and revoke current session
router.post("/logout", requireSameOrigin, async (req, res, next) => {
  try {
    const cookieHeader = req.headers.cookie || "";

    const sessionCookie = cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) =>
        cookie.startsWith(`${SESSION_COOKIE_NAME}=`)
      );

    if (sessionCookie) {
      try {
        const token = decodeURIComponent(
          sessionCookie.slice(SESSION_COOKIE_NAME.length + 1)
        );

        if (token) {
          const db = getDatabaseClient();

          await db.execute({
            sql: "DELETE FROM admin_sessions WHERE token_hash = ?",
            args: [hashSessionToken(token)],
          });
        }
      } catch {
        // Clear an invalid or malformed session cookie as well.
      }
    }

    clearSessionCookie(res);

    res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;