import express from 'express';
import { config } from './config/app.config';
import { logger } from './utils/logger';
import { initializeApp } from './loaders';

const startServer = async () => {
  const app = express();
  const PORT = config.port;
  
  await initializeApp(app);
  
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
};

startServer().catch(err => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});