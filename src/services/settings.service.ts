import { client, mainDb } from "../config/database.config";
import { User } from "../models/user.model";
import { logger } from "../utils/logger.utils";
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
  previousPassword: string,
  newPassword: string
): Promise<string> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const collection = mainDb.collection<User>("users");

    const user: User = (await collection.findOne({
      leave_me_id: leave_me_id,
    })) as User;

    if (user && await auth.comparePassword(previousPassword, user.password) === true) {
      const hashedPassword = await auth.hashPassword(newPassword);
      await collection.updateOne(
        { leave_me_id: leave_me_id },
        { $set: { password: hashedPassword } }
      );
    } else {
      throw { message: "Invalid credentials", statusCode: 401 };
    }

    return "Success";
  } catch (error) {
    logger.error("Error changing password:", error);
    throw error;
  }
};

export const changeBackground = async (
  leave_me_id: string,
  url: string
): Promise<string> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const collection = mainDb.collection<User>("users");

    await collection.updateOne(
      { leave_me_id: leave_me_id },
      { $set: { background_url: url } }
    );

    return "Success";
  } catch (error) {
    logger.error("Error changing background:", error);
    throw error;
  }
}

export const changeStatus = async (
  leave_me_id: string,
  status: string
): Promise<string> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const collection = mainDb.collection<User>("users");

    await collection.updateOne(
      { leave_me_id: leave_me_id },
      { $set: { status: status } }
    );

    return "Success";
  } catch (error) {
    logger.error("Error changing status:", error);
    throw error;
  }
}
