import express from "express";
import { config } from "./config/app.config";
import { logger } from "./utils/logger.utils";
import { initializeApp } from "./loaders";

if (config.jwtSecret === "NO_JWT") {
  logger.error(
    "\x1b[1m\x1b[31m%s\x1b[0m",
    "JWT_SECRET is NOT set! Killing the app. Set JWT_SECRET in .env and launch again."
  );
  process.exit(1);
}

const startServer = async () => {
  const app = express();
  const PORT = config.port;

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
