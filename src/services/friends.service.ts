import { User } from "../models/user.model";
import { logger } from "../utils/logger.utils";
import { relations } from "../utils/relations.utils";
import { Notification } from "../models/notifications.model";
import { sendNotification } from "../sockets";
import { ObjectId } from "mongodb";
import { dbFunctions, dbCollections } from "../utils/db.utils";

export const inviteFriend = async (
  leave_me_id: string,
  friend_lid: string
): Promise<string> => {
  try {
    dbFunctions.connectionCheck();

    const collection = dbCollections.users;
    const notificationsCollection = dbCollections.notifications;

    const friend: User = (await collection.findOne({
      leave_me_id: friend_lid,
    })) as User;

    if (!friend) {
      throw { message: "Invalid friend ID", statusCode: 404 };
    }

    const alreadyFriends = await relations.areFriends(leave_me_id, friend_lid);
    if (alreadyFriends) {
      throw { message: "Already friends", statusCode: 409 };
    }

    const userBlocked = await relations.isBlocked(friend_lid, leave_me_id);
    if (userBlocked) {
      throw { message: "You are blocked by this user", statusCode: 403 };
    }

    const friendBlocked = await relations.isBlocked(leave_me_id, friend_lid);
    if (friendBlocked) {
      throw { message: "You are blocking this user", statusCode: 403 };
    }

    const isInviting = await relations.isInviting(leave_me_id, friend_lid);
    if (isInviting) {
      throw { message: "Invite already sent", statusCode: 409 };
    }

    const isInvited = await relations.isInvited(leave_me_id, friend_lid);
    if (isInvited) {
      throw { message: "This user already invited you", statusCode: 409 };
    }

    await collection.updateOne(
      { leave_me_id: leave_me_id },
      { $addToSet: { invites_sent: friend_lid } }
    );

    await collection.updateOne(
      { leave_me_id: friend_lid },
      { $addToSet: { invites_get: leave_me_id } }
    );

    const newNotification: Notification = {
      _id: new ObjectId(),
      type: "invite",
      notification_user: leave_me_id,
      clickable_content: leave_me_id,
      content: "Check his profile!",
      created_at: new Date(),
      isSeen: false
    }

    await notificationsCollection.updateOne({ leave_me_id: friend_lid }, { $push: { notifications: newNotification } });
    sendNotification(friend_lid, newNotification);

    return "Success";
  } catch (error) {
    logger.error("Error inviting friend:", error);
    throw error;
  }
};

export const acceptFriend = async (
  leave_me_id: string,
  friend_lid: string
): Promise<string> => {
  try {
    dbFunctions.connectionCheck();

    const collection = dbCollections.users;
    const notificationsCollection = dbCollections.notifications;

    const isInvited = await relations.isInvited(leave_me_id, friend_lid);
    if (!isInvited) {
      throw { message: "This user is not inviting you", statusCode: 404 };
    }

    await collection.updateOne(
      { leave_me_id: leave_me_id },
      {
        $pull: { invites_get: friend_lid },
        $addToSet: { friends: friend_lid }
      }
    );

    await collection.updateOne(
      { leave_me_id: friend_lid },
      {
        $pull: { invites_sent: leave_me_id },
        $addToSet: { friends: leave_me_id }
      }
    );

    const newNotification: Notification = {
      _id: new ObjectId(),
      type: "invite",
      notification_user: leave_me_id,
      clickable_content: leave_me_id,
      content: "Accepted your invite!",
      created_at: new Date(),
      isSeen: false
    }

    await notificationsCollection.updateOne({ leave_me_id: friend_lid }, { $push: { notifications: newNotification } });
    sendNotification(friend_lid, newNotification);

    return "Success";
  } catch (error) {
    logger.error("Error accepting friend:", error);
    throw error;
  }
};

export const rejectFriend = async (
  leave_me_id: string,
  friend_lid: string
): Promise<string> => {
  try {
    dbFunctions.connectionCheck();

    const collection = dbCollections.users;

    const isInvited = await relations.isInvited(leave_me_id, friend_lid);
    if (!isInvited) {
      throw { message: "This user is not inviting you", statusCode: 404 };
    }

    await collection.updateOne(
      { leave_me_id: leave_me_id },
      {
        $pull: { invites_get: friend_lid },
      }
    );

    await collection.updateOne(
      { leave_me_id: friend_lid },
      {
        $pull: { invites_sent: leave_me_id },
      }
    );

    return "Success";
  } catch (error) {
    logger.error("Error rejecting invite:", error);
    throw error;
  }
};

export const cancelInvite = async (
  leave_me_id: string,
  friend_lid: string
): Promise<string> => {
  try {
    dbFunctions.connectionCheck();

    const collection = dbCollections.users;

    const isInviting = await relations.isInviting(leave_me_id, friend_lid);
    if (!isInviting) {
      throw { message: "You are not inviting this user", statusCode: 404 };
    }

    await collection.updateOne(
      { leave_me_id: leave_me_id },
      {
        $pull: { invites_sent: friend_lid },
      }
    );

    await collection.updateOne(
      { leave_me_id: friend_lid },
      {
        $pull: { invites_get: leave_me_id },
      }
    );

    return "Success";
  } catch (error) {
    logger.error("Error canceling invite:", error);
    throw error;
  }
};

export const deleteFriend = async (
  leave_me_id: string,
  friend_lid: string
): Promise<string> => {
  try {
    dbFunctions.connectionCheck();

    const collection = dbCollections.users;

    const areFriends = await relations.areFriends(leave_me_id, friend_lid);
    if (!areFriends) {
      throw { message: "You are not a friend with this user", statusCode: 404 };
    }

    await collection.updateOne(
      { leave_me_id: leave_me_id },
      {
        $pull: { friends: friend_lid },
      }
    );

    await collection.updateOne(
      { leave_me_id: friend_lid },
      {
        $pull: { friends: leave_me_id },
      }
    );

    return "Success";
  } catch (error) {
    logger.error("Error deleting friend:", error);
    throw error;
  }
};

export const getFriendsList = async (
  leave_me_id: string
): Promise<string[]> => {
  try {
    dbFunctions.connectionCheck();

    const collection = dbCollections.users;

    const user = (await collection.findOne(
      { leave_me_id: leave_me_id },
      { projection: { friends: 1 } }
    ));

    return user?.friends || [];
  } catch (error) {
    logger.error("Error fetching friends list:", error);
    throw error;
  }
};

export const getInvitesSentList = async (
  leave_me_id: string
): Promise<string[]> => {
  try {
    dbFunctions.connectionCheck();

    const collection = dbCollections.users;

    const user = (await collection.findOne(
      { leave_me_id: leave_me_id },
      { projection: { invites_sent: 1 } }
    ));

    return user?.invites_sent || [];
  } catch (error) {
    logger.error("Error fetching invites sent list:", error);
    throw error;
  }
};

export const getInvitesGotList = async (
  leave_me_id: string
): Promise<string[]> => {
  try {
    dbFunctions.connectionCheck();

    const collection = dbCollections.users;

    const user = (await collection.findOne(
      { leave_me_id: leave_me_id },
      { projection: { invites_get: 1 } }
    ));

    return user?.invites_get || [];
  } catch (error) {
    logger.error("Error fetching invites got list:", error);
    throw error;
  }
};
