import { client, mainDb } from "../config/database.config";
import { User } from "../models/user.model";
import { logger } from "../utils/logger.utils";

export const banUser = async (
  leave_me_id: string,
  target_id: string
): Promise<string> => { //function props should be sexier
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const usersCollection = mainDb.collection<User>("users");

    const adminUser = await usersCollection.findOne({ leave_me_id: leave_me_id }) as User;

    if (!adminUser.is_admin) {
      throw { message: "You can't do that", statusCode: 403 };
    }

    const targetUser = await usersCollection.findOne({ leave_me_id: target_id }) as User;

    if (!targetUser) {
      throw { message: "User not found", statusCode: 404 };
    }

    if (targetUser.is_banned) {
      throw { message: "User is banned", statusCode: 409 };
    }

    await usersCollection.updateOne({ leave_me_id: target_id }, { $set: { is_banned: true } });
    return "Success";
  } catch (error) {
    logger.error("Error banning a user:", error);
    throw error;
  }
};


