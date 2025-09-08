import { User } from "../models/user.model";
import { Post } from "../models/posts.models";
import { logger } from "../utils/logger.utils";
import { ObjectId } from "mongodb";
import { Notification } from "../models/notifications.model";
import { sendNotification } from "../sockets";
import { dbCollections, dbFunctions } from "../utils/db.utils";

export const banUser = async (
  leave_me_id: string,
  target_id: string
): Promise<string> => {
  try {
    dbFunctions.connectionCheck();

    const usersCollection = dbCollections.users;
    const notificationsCollection = dbCollections.notifications;

    const adminUser = await usersCollection.findOne({ leave_me_id: leave_me_id }) as User;

    if (!adminUser.is_admin) {
      throw { message: "You can't do that", statusCode: 403 };
    }

    const targetUser = await usersCollection.findOne({ leave_me_id: target_id }) as User;

    if (!targetUser) {
      throw { message: "User not found", statusCode: 404 };
    }

    if (targetUser.is_banned) {
      throw { message: "User is banned", statusCode: 409 };
    }

    await usersCollection.updateOne({ leave_me_id: target_id }, { $set: { is_banned: true } });

    const newNotification: Notification = {
      _id: new ObjectId(),
      type: "ban",
      notification_user: target_id,
      clickable_content: "url",
      content: "You can ask for unban.",
      created_at: new Date(),
      isSeen: false
    }

    await notificationsCollection.updateOne({ leave_me_id: target_id }, { $push: { notifications: newNotification } });
    sendNotification(target_id, newNotification);

    return "Success";
  } catch (error) {
    logger.error("Error banning a user:", error);
    throw error;
  }
};

export const unbanUser = async (
  leave_me_id: string,
  target_id: string
): Promise<string> => {
  try {
    dbFunctions.connectionCheck()

    const usersCollection = dbCollections.users;

    const adminUser = await usersCollection.findOne({ leave_me_id: leave_me_id }) as User;

    if (!adminUser.is_admin) {
      throw { message: "You can't do that", statusCode: 403 };
    }

    const targetUser = await usersCollection.findOne({ leave_me_id: target_id }) as User;

    if (!targetUser) {
      throw { message: "User not found", statusCode: 404 };
    }

    if (!targetUser.is_banned) {
      throw { message: "User is not banned", statusCode: 409 };
    }

    await usersCollection.updateOne({ leave_me_id: target_id }, { $set: { is_banned: false } });
    return "Success";
  } catch (error) {
    logger.error("Error unbanning a user:", error);
    throw error;
  }
};

export const deletePost = async (
  leave_me_id: string,
  post_id: ObjectId
): Promise<string> => {
  try {
    dbFunctions.connectionCheck();

    const usersCollection = dbCollections.users;
    const postsCollection = dbCollections.posts;

    const adminUser = await usersCollection.findOne({ leave_me_id: leave_me_id }) as User;

    if (!adminUser.is_admin) {
      throw { message: "You can't do that", statusCode: 403 };
    }

    const targetPost = await postsCollection.findOne({ _id: post_id }) as Post;

    if (!targetPost) {
      throw { message: "Post not found", statusCode: 404 };
    }

    await postsCollection.deleteOne({ _id: post_id });
    return "Success";
  } catch (error) {
    logger.error("Error deleting a post:", error);
    throw error;
  }
}

export const grantBadge = async (
  leave_me_id: string,
  target_id: string,
  badge: string
): Promise<string> => {
  try {
    dbFunctions.connectionCheck();

    const usersColection = dbCollections.users;

    const adminUser = await usersColection.findOne({ leave_me_id: leave_me_id }) as User;

    if (!adminUser.is_admin) {
      throw { message: "You can't do that", statusCode: 403 };
    }

    const user = await usersColection.findOne({ leave_me_id: target_id }) as User;

    if (!user) {
      throw { message: "User not found", statusCode: 404 }
    }

    if (user.badges.includes(badge)) {
      throw { message: "User already have this badge", statusCode: 409 };
    }

    await usersColection.updateOne({ leave_me_id: target_id }, { $push: { badges: badge } });
    return "Success";
  } catch (error) {
    logger.error("Error granting a badge:", error);
    throw error;
  }
}

export const revokeBadge = async (
  leave_me_id: string,
  target_id: string,
  badge: string
): Promise<string> => {
  try {
    dbFunctions.connectionCheck();

    const usersColection = dbCollections.users;

    const adminUser = await usersColection.findOne({ leave_me_id: leave_me_id }) as User;

    if (!adminUser.is_admin) {
      throw { message: "You can't do that", statusCode: 403 };
    }

    const user = await usersColection.findOne({ leave_me_id: target_id }) as User;

    if (!user) {
      throw { message: "User not found", statusCode: 404 };
    }

    if (!user.badges.includes(badge)) {
      throw { message: "User doesn't have this badge", statusCode: 409 };
    }

    await usersColection.updateOne({ leave_me_id: target_id }, { $pull: { badges: badge } });
    return "Success";
  } catch (error) {
    logger.error("Error revoking a badge:", error);
    throw error;
  }
}
