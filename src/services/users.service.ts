import { ReturnUser, ReturnShortUser } from "../models/user.model";
import { logger } from "../utils/logger.utils";
import { dbFunctions, dbCollections } from "../utils/db.utils";


export const getUser = async (
  leave_me_id: string,
  target: string,
): Promise<ReturnUser | ReturnShortUser> => {
  try {
    dbFunctions.connectionCheck();

    const usersCollection = dbCollections.users;

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
