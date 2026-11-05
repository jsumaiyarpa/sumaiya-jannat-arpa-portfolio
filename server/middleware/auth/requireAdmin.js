
import { getDatabaseClient } from "../../db/client.js";
import { hashSessionToken } from "../../utils/session.js";

export const SESSION_COOKIE_NAME = "arpa_admin_session";

export async function requireAdmin(req, res, next) {
  try {
    const cookieHeader = req.headers.cookie || "";

    const sessionCookie = cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) =>
        cookie.startsWith(`${SESSION_COOKIE_NAME}=`)
      );

    if (!sessionCookie) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    let sessionToken;

    try {
      sessionToken = decodeURIComponent(
        sessionCookie.slice(SESSION_COOKIE_NAME.length + 1)
      );
    } catch {
      return res.status(401).json({
        success: false,
        message: "Invalid session.",
      });
    }

    if (!sessionToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid session.",
      });
    }

    const db = getDatabaseClient();
    const tokenHash = hashSessionToken(sessionToken);

    const result = await db.execute({
      sql: `
        SELECT
          u.id,
          u.username,
          u.email,
          u.full_name,
          u.role
        FROM admin_sessions AS s
        INNER JOIN admin_users AS u
          ON u.id = s.admin_id
        WHERE s.token_hash = ?
          AND datetime(s.expires_at) > datetime('now')
          AND u.is_active = 1
        LIMIT 1
      `,
      args: [tokenHash],
    });

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session.",
      });
    }

    req.admin = result.rows[0];

    next();
  } catch (error) {
    next(error);
  }
}
