import { auth } from "../utils/auth.utils";
import { logger } from "../utils/logger.utils";
import { dbFunctions, dbCollections } from "../utils/db.utils";

export const refreshToken = async (refreshToken: string): Promise<string> => {
  dbFunctions.connectionCheck();

  const collection = dbCollections.users;
  const user = await collection.findOne({ refresh_tokens: refreshToken });

  if (!user) {
    throw { message: "Refresh token invalid", statusCode: 401 };
  }

  const accessToken = auth.generateJwt({ leave_me_id: user.leave_me_id });

  logger.success("Access token refreshed for user: " + user.leave_me_id);

  return accessToken;
};
