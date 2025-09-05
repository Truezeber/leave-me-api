import express from "express";
import { config } from "./config/app.config";
import { logger } from "./utils/logger.utils";
import { initializeApp } from "./loaders";
import cookieParser from "cookie-parser";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";

let io: SocketIOServer;

if (config.jwtSecret === "NO_JWT") {
  logger.error(
    "\x1b[1m\x1b[31m%s\x1b[0m",
    "JWT_SECRET is NOT set! Killing the app. Set JWT_SECRET in .env and launch again."
  );
  process.exit(1);
}

if (config.resendKey === "NO_RESEND") {
  logger.error(
    "\x1b[1m\x1b[31m%s\x1b[0m",
    "RESEND_KEY is NOT set! Killing the app. Set RESEND_KEY in .env and launch again."
  );
  process.exit(1);
}

const startServer = async () => {
  const app = express();
  const PORT = config.port;
  const server = http.createServer(app);
  io = new SocketIOServer(server, {
    cors: { origin: "*", credentials: true },
  });

  app.use(cookieParser());
  app.use(cors({
    origin: ["http://localhost:3000", "https://leavemeanote.site"],
    credentials: true
  }));

  await initializeApp(app);

  app.listen(PORT, () => {
    logger.success("Server started succesfully");
    logger.info(`Server running on http://localhost:${PORT}`);
    logger.info("API docs: http://localhost:3000/api-docs/#/");
  });
};

startServer().catch((err) => {
  logger.error("Failed to start server:", err);
  process.exit(1);
});

export { io };

import "./sockets";
