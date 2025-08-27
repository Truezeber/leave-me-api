import { client, mainDb } from "../config/database.config";
import { User } from "../models/user.model";
import { logger } from "./logger.utils";

export const relations = {
  //! Every data needs to be validated before using any of these functions
  //? It can be made by one function
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
  },

  async isBlocked(firstUserId: string, secondUserId: string): Promise<boolean> {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const collection = mainDb.collection<User>("users");

    const exists = await collection.findOne({
      leave_me_id: firstUserId,
      blocked: secondUserId
    });

    return !!exists;
  },

  async isInvited(firstUserId: string, secondUserId: string): Promise<boolean> {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const collection = mainDb.collection<User>("users");

    const exists = await collection.findOne({
      leave_me_id: firstUserId,
      invites_get: secondUserId
    });

    return !!exists;
  },

  async isInviting(firstUserId: string, secondUserId: string): Promise<boolean> {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const collection = mainDb.collection<User>("users");

    const exists = await collection.findOne({
      leave_me_id: firstUserId,
      invites_sent: secondUserId
    });

    return !!exists;
  }
}
