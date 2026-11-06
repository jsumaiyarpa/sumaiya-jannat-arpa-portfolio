import express from "express";
import helmet from "helmet";
import cors from "cors";
import loginRouter from "./routes/auth/login.js";
import { env } from "./config/env.js";
import sessionRouter from "./routes/auth/session.js";
import adminRouter from "./routes/admin.js";
import publicProjectsRouter from "./routes/publicProjects.js";
import publicContentRouter from "./routes/publicContent.js";
import {
  notFoundHandler,
  errorHandler,
} from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Arpa Portfolio API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/projects", publicProjectsRouter);
app.use("/api", publicContentRouter);
app.use("/api/auth/login", loginRouter);
app.use("/api/auth", sessionRouter);
app.use("/api/admin", adminRouter);
app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(env.port, () => {
  console.log(`Backend server running at http://localhost:${env.port}`);
});

server.on("error", (error) => {
  console.error("Backend server startup failed:", error.message);
  process.exit(1);
});

function shutdown(signal) {
  console.log(`${signal} received. Shutting down backend server...`);

  server.close((error) => {
    if (error) {
      console.error("Server shutdown failed:", error.message);
      process.exit(1);
    }

    console.log("Backend server closed successfully.");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
