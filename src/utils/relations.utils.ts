import { client, mainDb } from "../config/database.config";
import { User } from "../models/user.model";
import { logger } from "./logger.utils";

export const relations = {
  //! Every data needs to be validated before using any of these functions
  async areFriends(firstUserId: string, secondUserId: string): Promise<boolean> {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const collection = mainDb.collection<User>("users");

    const exists = await collection.findOne({
      leave_me_id: firstUserId,
      friends: secondUserId
    });

    return !!exists;
  }
}
