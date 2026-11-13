
import { env } from "../../config/env.js";

export function requireSameOrigin(req, res, next) {
  const origin = req.get("origin");
  const requestedWith = req.get("x-requested-with");

  const normalizedOrigin = origin ? origin.trim().replace(/\/+$/, "") : "";
  const isOriginAllowed = Array.isArray(env.allowedOrigins)
    ? env.allowedOrigins.includes(normalizedOrigin)
    : normalizedOrigin === (env.clientOrigin ? env.clientOrigin.trim().replace(/\/+$/, "") : "");

  if (!isOriginAllowed || requestedWith !== "XMLHttpRequest") {
    return res.status(403).json({
      success: false,
      message: "Forbidden request origin.",
    });
  }

  next();
}
