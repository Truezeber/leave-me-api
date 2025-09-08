import { User, UserRegister } from "../models/user.model";
import { auth } from "../utils/auth.utils";
import { logger } from "../utils/logger.utils";
import { Notifier } from "../models/notifications.model";
import { dbFunctions, dbCollections } from "../utils/db.utils";

export const registerUser = async (user: UserRegister): Promise<string[]> => {
  try {
    dbFunctions.connectionCheck();

    const collection = dbCollections.users;
    const confirmationCollection = dbCollections.confirmations;
    const notificationsCollection = dbCollections.notifications;

    const confirmedUser = await confirmationCollection.findOne({ email: user.email });

    if (await collection.findOne({ email: user.email })) {
      throw { message: "Existing data problem", statusCode: 409 };
    }

    if (await collection.findOne({ leave_me_id: user.leave_me_id })) {
      throw { message: "Existing data problem", statusCode: 409 };
    }

    if (!confirmedUser || !confirmedUser.verified) {
      throw { message: "Existing data problem", statusCode: 409 };
    }


    const newUser: User = {
      email: user.email,
      password: await auth.hashPassword(user.password),
      nickname: user.nickname,
      leave_me_id: user.leave_me_id,
      avatar_url: user.avatar_url,
      tos_accepted: user.tos_accepted,
      pp_accepted: user.pp_accepted,
      status: "",
      background_url: "",
      friends: [],
      invites_get: [],
      invites_sent: [],
      blocked: [],
      visibility: "public",
      badges: [],
      points: 0,
      is_banned: false,
      is_admin: false,
      join_date: new Date(),
      refresh_tokens: [auth.generateRefreshToken()],
    };

    const newNotifier: Notifier = {
      leave_me_id: user.leave_me_id,
      notifications: []
    }

    const result = await collection.insertOne(newUser);

    if (!result.acknowledged) {
      throw new Error("Undefined database problem");
    }

    await notificationsCollection.insertOne(newNotifier);

    const refreshToken = newUser.refresh_tokens[0];
    const accessToken = auth.generateJwt({ leave_me_id: newUser.leave_me_id });

    return [refreshToken, accessToken];
  } catch (error) {
    logger.error("Error registering user:", error);
    throw error;
  }
};
