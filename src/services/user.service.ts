import { client } from '../config/database.config';
import { User } from '../models/user.model';
import { logger } from '../utils/logger';

export const getAllUsers = async (): Promise<User[]> => {
  try {
    if (!client) {
      logger.warn('Database client is not available');
      return [];
    }

    const database = client.db('crud');
    const collection = database.collection('users');
    
    logger.info('Fetching users from collection');
    const users = await collection.find({}).toArray();
    logger.info(`Found ${users.length} users`);
    
    return users as unknown as User[];
  } catch (error) {
    logger.error('Error fetching users:', error);
    return [];
  }
};