import { client, mainDb } from "../config/database.config";
import { Notifier } from "../models/notifications.model";
import { Post } from "../models/posts.models";
import { Ticket } from "../models/tickets.model";
import { User, UserConfirmation } from "../models/user.model";
import { logger } from "./logger.utils";


export const dbFunctions = {
  connectionCheck: (): void => {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }
  }
}

export const dbCollections = {
  notifications: mainDb.collection<Notifier>("notifications"),
  posts: mainDb.collection<Post>("posts"),
  tickets: mainDb.collection<Ticket>("tickets"),
  users: mainDb.collection<User>("users"),
  confirmations: mainDb.collection<UserConfirmation>("confirmations"),
}
