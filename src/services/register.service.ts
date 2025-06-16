import { client, mainDb } from '../config/database.config';
import { User, UserRegister } from '../models/user.model';
import { logger } from '../utils/logger';

// export const getAllUsers = async (): Promise<TestUser[]> => {
//   try {
//     if (!client) {
//       logger.warn('Database client is not available');
//       return [];
//     }

//     const database = client.db('crud');
//     const collection = database.collection('users');
    
//     logger.info('Fetching users from collection');
//     const users = await collection.find({}).toArray();
//     logger.info(`Found ${users.length} users`);
    
//     return users as unknown as TestUser[];
//   } catch (error) {
//     logger.error('Error fetching users:', error);
//     return [];
//   }
// };

export const registerUser = async (user: UserRegister): Promise<User> => {
  try {
    if (!client) {
      logger.warn('Database client is not available');
      throw new Error('Database client is not available');
    }

    const collection = mainDb.collection('users');
    logger.info('Mongo collection', collection);

    const newUser: User = {
      ...user,
      status: "",
      background_url: "",
      friends: [],
      invites_get: [],
      invites_sent: [],
      blocked: [],
      visibility: "public",
      badges: [],
      points: 0,
      is_banned: false,
      is_admin: false,
      join_date: new Date()
    };
    logger.info('Registering user:', newUser);

    const result = await collection.insertOne(newUser);

    if (!result.acknowledged) {
        logger.error('Failed to insert user');
        throw new Error('Failed to insert user');
    }
    logger.info(`User registered successfully with ID: ${result.insertedId}`);

    const createdUser = await collection.findOne({ _id: result.insertedId });

    if (!createdUser) {
      throw new Error('User was created but could not be retrieved');
    }
    
    return createdUser as unknown as User;
  } catch (error) {
    logger.error('Error registering user:', error);
    throw error;
  }
};