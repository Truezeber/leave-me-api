import express from "express";
import { createServer } from "node:http";
import { config } from "./config/app.config";
import { corsConfig } from "./config/cors.config";
import { logger } from "./utils/logger.utils";
import { initializeApp } from "./loaders";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from 'socket.io';

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

  app.use(cookieParser());
  app.use(cors(corsConfig));

  await initializeApp(app);

  const server = createServer(app);
  const io = new Server(server, { cors: corsConfig });

  io.on('connection', (socket) => {
    logger.info('User connected');
  });

  server.listen(PORT, () => {
    logger.success("Server started succesfully");
    logger.info(`Server running on http://localhost:${PORT}`);
    logger.info("API docs: http://localhost:3000/api-docs/#/");
  });
};

startServer().catch((err) => {
  logger.error("Failed to start server:", err);
  process.exit(1);
});
