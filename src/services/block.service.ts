import { client, mainDb } from "../config/database.config";
import { User } from "../models/user.model";
import { logger } from "../utils/logger.utils";
import { relations } from "../utils/relations.utils";

export const blockUser = async (
  leave_me_id: string,
  user_lid: string
): Promise<string> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    //TODO this part should be deleted everywhere. Useless db call
    const collection = mainDb.collection<User>("users");
    logger.info("Mongo collection", collection);

    const user: User = (await collection.findOne({
      leave_me_id: leave_me_id,
    })) as User;
    logger.info("User:", user);

    //? DDOSing database, great idea
    const areFriends = await relations.areFriends(leave_me_id, user_lid);
    if (areFriends) {
      throw { message: "Unfriend first", statusCode: 409 };
    }

    const userBlocked = await relations.isBlocked(leave_me_id, user_lid);
    if (userBlocked) {
      throw { message: "User already blocked", statusCode: 409 };
    }

    const isInviting = await relations.isInviting(leave_me_id, user_lid);
    if (isInviting) {
      throw { message: "Cancel invite first", statusCode: 409 };
    }

    const isInvited = await relations.isInvited(leave_me_id, user_lid);
    if (isInvited) {
      throw { message: "Reject invite first", statusCode: 409 };
    }

    await collection.updateOne(
      { leave_me_id: leave_me_id },
      { $addToSet: { blocked: user_lid } }
    );

    return "Success";
  } catch (error) {
    logger.error("Error blocking user:", error);
    throw error;
  }
}

export const unblockUser = async (
  leave_me_id: string,
  user_lid: string
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

    const userBlocked = await relations.isBlocked(leave_me_id, user_lid);
    if (!userBlocked) {
      throw { message: "User not blocked", statusCode: 409 };
    }

    await collection.updateOne(
      { leave_me_id: leave_me_id },
      { $pull: { blocked: user_lid } }
    );

    return "Success";
  } catch (error) {
    logger.error("Error unblocking user:", error);
    throw error;
  }
}

export const getBlocks = async (
  leave_me_id: string,
): Promise<string[]> => {
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

    return user.blocked;
  } catch (error) {
    logger.error("Error unblocking user:", error);
    throw error;
  }
}


