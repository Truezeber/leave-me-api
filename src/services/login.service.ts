import { client, mainDb } from "../config/database.config";
import { User } from "../models/user.model";
import { auth } from "../utils/auth.utils";
import { logger } from "../utils/logger.utils";

export const loginUser = async (
  leave_me_id: string,
  password: string,
  remember_me: boolean
): Promise<string[]> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const collection = mainDb.collection<User>("users");

    const user: User = (await collection.findOne({
      leave_me_id: leave_me_id,
    })) as User;

    let response: string[] = ["", ""];

    if (user && await auth.comparePassword(password, user.password) === true) {
      response[1] = auth.generateJwt({ leave_me_id: leave_me_id });

      if (remember_me) {
        response[0] = auth.generateRefreshToken();
        await collection.updateOne(
          { leave_me_id: leave_me_id },
          { $push: { refresh_tokens: response[0] } }
        );
      }
    } else {
      throw { message: "Invalid credentials", statusCode: 401 };
    }
    return response;
  } catch (error) {
    logger.error("Error registering user:", error);
    throw error;
  }
};
