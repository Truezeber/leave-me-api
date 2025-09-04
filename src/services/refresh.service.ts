import { client, mainDb } from "../config/database.config";
import { User } from "../models/user.model";
import { auth } from "../utils/auth.utils";
import { logger } from "../utils/logger.utils";

export const refreshToken = async (refreshToken: string): Promise<string> => {
  if (!client) {
    logger.warn("Database client is not available");
    throw { message: "Database client is not available", statusCode: 503 };
  }

  const collection = mainDb.collection<User>("users");
  const user = await collection.findOne({ refresh_tokens: refreshToken });

  if (!user) {
    logger.warn("Refresh token not found in database");
    throw { message: "Refresh token invalid", statusCode: 401 };
  }

  const accessToken = auth.generateJwt({ leave_me_id: user.leave_me_id });

  logger.success("Access token refreshed for user: " + user.leave_me_id);

  return accessToken;
};
