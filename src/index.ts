import express from "express";
import { config } from "./config/app.config";
import { logger } from "./utils/logger.utils";
import { initializeApp } from "./loaders";

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
