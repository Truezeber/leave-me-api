import { MongoClient } from 'mongodb';
import { config } from './app.config';
import { logger } from '../utils/logger';

const uri = config.mongoURI.replace('localhost', '127.0.0.1');
export const client = new MongoClient(uri);

export const connectToDatabase = async (): Promise<MongoClient | null> => {
  try {
    await client.connect();
    logger.info('Connected to MongoDB');
    return client;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    logger.warn('Application will continue without database connection');
    return null;
  }
};