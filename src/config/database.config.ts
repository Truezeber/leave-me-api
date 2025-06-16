import { MongoClient } from 'mongodb';
import { config } from './app.config';
import { logger } from '../utils/logger';

const uri = config.mongoURI;
export const client = new MongoClient(uri);
export const mainDb = client.db(config.dbName);

export const connectToDatabase = async (): Promise<MongoClient | null> => {
  try {
    await client.connect();
    
    const db = client.db(config.dbName);
    const collections = await db.listCollections().toArray();
    logger.info(`Connected to MongoDB. Available collections: ${collections.map(c => c.name).join(', ')}`);
    
    return client;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    logger.warn('Application will continue without database connection');
    return null;
  }
};