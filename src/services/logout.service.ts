import { client, mainDb } from "../config/database.config";
import { User } from "../models/user.model";
import { logger } from "../utils/logger.utils";

export const logoutUser = async (
  leave_me_id: string,
  refresh_token: string
): Promise<string> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const collection = mainDb.collection<User>("users");
    logger.info("Mongo collection", collection);

    const user: User = (await collection.findOne({
      leave_me_id: leave_me_id,
    })) as User;
    logger.info("User:", user);

    await collection.updateOne(
      { leave_me_id: leave_me_id },
      { $pull: { refresh_tokens: refresh_token } }
    );

    return "Success";
  } catch (error) {
    logger.error("Error registering user:", error);
    throw error;
  }
};
