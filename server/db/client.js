
import { createClient } from "@libsql/client";
import { env, validateTursoConfig } from "../config/env.js";

let dbClient = null;

export function getDatabaseClient() {
  if (dbClient) {
    return dbClient;
  }

  validateTursoConfig();

  dbClient = createClient({
    url: env.tursoDatabaseUrl,
    authToken: env.tursoAuthToken,
    intMode: "number",
  });

  return dbClient;
}

export async function closeDatabaseClient() {
  if (!dbClient) {
    return;
  }

  const client = dbClient;
  dbClient = null;

  await client.close();
}
