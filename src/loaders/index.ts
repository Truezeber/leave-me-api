import { Application } from 'express';
import { connectToDatabase } from '../config/database.config';
import { setupSwagger } from './swagger';
import { setupMiddlewares } from './middlewares';
import { setupRoutes } from './routes';
import { logger } from '../utils/logger';

export const initializeApp = async (app: Application): Promise<void> => {
  try {
    // Połącz z bazą danych
    const dbClient = await connectToDatabase();
    if (dbClient) {
      logger.info('Database connection established');
    } else {
      logger.warn('Running without database connection');
    }
  } catch (error) {
    logger.error('Failed to connect to database, continuing without DB:', error);
  }
  
  // Skonfiguruj Swagger
  setupSwagger(app);
  
  // Skonfiguruj middleware
  setupMiddlewares(app);
  
  // Skonfiguruj trasy
  setupRoutes(app);
  
  logger.info('Application initialized successfully');
};