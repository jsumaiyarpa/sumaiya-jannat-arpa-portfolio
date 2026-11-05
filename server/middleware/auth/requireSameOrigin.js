
import { env } from "../../config/env.js";

export function requireSameOrigin(req, res, next) {
  const origin = req.get("origin");
  const requestedWith = req.get("x-requested-with");

  if (origin !== env.clientOrigin || requestedWith !== "XMLHttpRequest") {
    return res.status(403).json({
      success: false,
      message: "Forbidden request origin.",
    });
  }

  next();
}
