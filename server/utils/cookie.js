
import { SESSION_COOKIE_NAME } from "../middleware/auth/requireAdmin.js";
import { env } from "../config/env.js";

const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "strict",
  path: "/",
};

export function setSessionCookie(res, token) {
  res.cookie(SESSION_COOKIE_NAME, token, {
    ...cookieOptions,
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE_NAME, cookieOptions);
}
