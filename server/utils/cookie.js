
import { SESSION_COOKIE_NAME } from "../middleware/auth/requireAdmin.js";
import { env } from "../config/env.js";

const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const isProduction =
  env.nodeEnv === "production" || process.env.RENDER === "true";

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

export function getCookieOptions() {
  const isProd =
    process.env.NODE_ENV === "production" ||
    process.env.RENDER === "true" ||
    env.nodeEnv === "production";

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  };
}

export function setSessionCookie(res, token) {
  res.cookie(SESSION_COOKIE_NAME, token, {
    ...getCookieOptions(),
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE_NAME, getCookieOptions());
}
