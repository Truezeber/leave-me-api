import { Application } from "express";
import { connectToDatabase } from "../config/database.config";
import { setupSwagger } from "./swagger";
import { setupMiddlewares } from "./middlewares";
import { setupRoutes } from "./routes";
import { logger } from "../utils/logger.utils";
import { config } from "../config/app.config";

export const initializeApp = async (app: Application): Promise<void> => {
  try {
    const dbClient = await connectToDatabase();
    if (dbClient) {
      logger.info("Database connection established");
    } else {
      logger.warn("Running without database connection");
    }
  } catch (error) {
    logger.error(
      "Failed to connect to database, continuing without DB:",
      error
    );
  }

  if (config.environment! === "production") {
    setupSwagger(app);
  }
  setupMiddlewares(app);

  setupRoutes(app);

  logger.info("Application initialized successfully");
};
