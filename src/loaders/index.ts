import { Application } from "express";
import { connectToDatabase } from "../config/database.config";
import { setupSwagger } from "./swagger";
import { setupMiddlewares } from "./middlewares";
import { setupRoutes } from "./routes";
import { logger } from "../utils/logger.utils";

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

  setupSwagger(app);

  setupMiddlewares(app);

  setupRoutes(app);

  logger.info("Application initialized successfully");
};
