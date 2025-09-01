import { client, mainDb } from "../config/database.config";
import { User } from "../models/user.model";
import { logger } from "../utils/logger.utils";
import { validator } from "../utils/validators.utils";
import { auth } from "../utils/auth.utils";

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
    logger.error("Error changing avatar:", error);
    throw error;
  }
};

export const changeNickname = async (
  leave_me_id: string,
  nickname: string
): Promise<string> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const collection = mainDb.collection<User>("users");
    logger.info("Mongo collection", collection);

    if (!validator.nickname(nickname)) {
      logger.warn("Invalid nickname");
      throw { message: "Invalid nickname", statusCode: 400 };
    }

    await collection.updateOne(
      { leave_me_id: leave_me_id },
      { $set: { nickname: nickname } }
    );

    return "Success";
  } catch (error) {
    logger.error("Error changing nickname:", error);
    throw error;
  }
};


export const changePassword = async (
  leave_me_id: string,
  password: string
): Promise<string> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const collection = mainDb.collection<User>("users");
    logger.info("Mongo collection", collection);

    if (!validator.password(password)) {
      logger.warn("Invalid password");
      throw { message: "Invalid password", statusCode: 400 };
    }

    const newPassword = await auth.hashPassword(password)

    await collection.updateOne(
      { leave_me_id: leave_me_id },
      { $set: { password: newPassword } }
    );

    return "Success";
  } catch (error) {
    logger.error("Error changing password:", error);
    throw error;
  }
};
