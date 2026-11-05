
import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT || 5000);

export const env = {
  port: Number.isInteger(port) && port > 0 && port <= 65535 ? port : 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  tursoDatabaseUrl: process.env.TURSO_DATABASE_URL || "",
  tursoAuthToken: process.env.TURSO_AUTH_TOKEN || "",
};

export function validateTursoConfig() {
  if (!env.tursoDatabaseUrl || !env.tursoAuthToken) {
    throw new Error(
      "Turso configuration is incomplete. Check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN."
    );
  }

  if (!env.tursoDatabaseUrl.startsWith("libsql://") &&
      !env.tursoDatabaseUrl.startsWith("https://")) {
    throw new Error("Invalid Turso database URL.");
  }
}
