import { client, mainDb } from "../config/database.config";
import { ReturnUser, ReturnShortUser, User } from "../models/user.model";
import { logger } from "../utils/logger.utils";


export const getUser = async (
  leave_me_id: string,
  target: string,
): Promise<ReturnUser | ReturnShortUser> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const usersCollection = mainDb.collection<User>("users");

    const user = await usersCollection.findOne({ leave_me_id: target });
    let returnUser: ReturnUser | ReturnShortUser;

    if (user) {
      if (target === leave_me_id) {
        returnUser = {
          email: user?.email,
          nickname: user.nickname,
          leave_me_id: user?.leave_me_id,
          avatar_url: user?.avatar_url,
          status: user?.status,
          background_url: user?.background_url,
          badges: user?.badges,
          points: user?.points,
          is_banned: user?.is_banned
        };
      } else {
        returnUser = {
          nickname: user?.nickname,
          leave_me_id: user?.leave_me_id,
          avatar_url: user?.avatar_url,
          status: user?.status,
          background_url: user?.background_url,
          badges: user?.badges,
          points: user?.points,
          is_banned: user?.is_banned
        };
      }
    } else {
      throw { message: "User not found", statusCode: 404 };
    }

    return returnUser;
  } catch (error) {
    logger.error("Error fetching user:", error);
    throw error;
  }
}
