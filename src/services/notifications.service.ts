import { logger } from "../utils/logger.utils";
import { ObjectId } from "mongodb";
import { Notifier, Notification } from "../models/notifications.model";
import { dbFunctions, dbCollections } from "../utils/db.utils";

export const markAsSeen = async (
  leave_me_id: string,
  notification_id: ObjectId
): Promise<string> => {
  try {
    dbFunctions.connectionCheck();

    const notifiersCollection = dbCollections.notifications;

    const notifications: Notifier = await notifiersCollection.findOne({ leave_me_id: leave_me_id }) as Notifier;
    const notification = notifications.notifications.find(n => n._id?.equals(notification_id));

    if (!notification) {
      throw { message: "Notification not found", statusCode: 404 };
    }

    await notifiersCollection.updateOne({ leave_me_id: leave_me_id, "notifications._id": notification_id }, { $set: { "notifications.$.isSeen": true } });

    return "Success";
  } catch (error) {
    logger.error("Error unlikeing the post:", error);
    throw error;
  }
};

export const loadNotifications = async (
  leave_me_id: string,
  amount: number,
): Promise<Notification[]> => {
  try {
    dbFunctions.connectionCheck();

    const notifiersCollection = dbCollections.notifications;

    const notifier = await notifiersCollection.findOne({ leave_me_id: leave_me_id }) as Notifier;

    const notifications = notifier.notifications.sort((a, b) => b.created_at.getTime() - a.created_at.getTime()).slice(0, amount);

    return notifications;
  } catch (error) {
    logger.error("Error fetching posts:", error);
    throw error;
  }
}
