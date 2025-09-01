import { client, mainDb } from "../config/database.config";
import { User } from "../models/user.model";
import { logger } from "../utils/logger.utils";
import { validator } from "../utils/validators.utils";

export const changeAvatar = async (
  leave_me_id: string,
  avatarUrl: string
): Promise<string> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const collection = mainDb.collection<User>("users");
    logger.info("Mongo collection", collection);

    if (!validator.url(avatarUrl)) {
      logger.warn("Invalid avatar url");
      throw { message: "Invalid avatar url", statusCode: 400 };
    }

    await collection.updateOne(
      { leave_me_id: leave_me_id },
      { $set: { avatar_url: avatarUrl } }
    );

    return "Success";
  } catch (error) {
    logger.error("Error inviting friend:", error);
    throw error;
  }
};
