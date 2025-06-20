import { client } from "../config/database.config";
import { TestUser } from "../models/testuser.model";
import { logger } from "../utils/logger.utils";

export const getAllUsers = async (): Promise<TestUser[]> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      return [];
    }

    const database = client.db("crud");
    const collection = database.collection("users");

    logger.info("Fetching users from collection");
    const users = await collection.find({}).toArray();
    logger.info(`Found ${users.length} users`);

    return users as unknown as TestUser[];
  } catch (error) {
    logger.error("Error fetching users:", error);
    return [];
  }
};
