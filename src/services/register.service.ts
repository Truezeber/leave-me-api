import { client, mainDb } from "../config/database.config";
import { User, UserRegister } from "../models/user.model";
import { logger } from "../utils/logger";
import { validator } from "../utils/validators";

export const registerUser = async (user: UserRegister): Promise<User> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw new Error("Database client is not available");
    }

    if (!validator.email(user.email)) {
      logger.warn("Invalid email");
      throw new Error("Invalid email");
    }

    if (!validator.password(user.password)) {
      logger.warn("Invalid password");
      throw new Error("Invalid password");
    }

    if (!validator.nickname(user.nickname)) {
      logger.warn("Invalid nickname");
      throw new Error("Invalid nickname");
    }

    if (!validator.url(user.avatar_url)) {
      logger.warn("Invalid avatar url");
      throw new Error("Invalid avatar url");
    }

    if (!validator.leaveMeId(user.leave_me_id)) {
      logger.warn("Invalid LeaveMeId");
      throw new Error("Invalid LeaveMeId");
    }

    const collection = mainDb.collection("users");
    logger.info("Mongo collection", collection);

    logger.info("User:", user);

    const newUser: User = {
      email: user.email,
      password: user.password,
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
    };
    logger.info("Registering user:", newUser);

    const result = await collection.insertOne(newUser);

    if (!result.acknowledged) {
      logger.error("Failed to insert user");
      throw new Error("Failed to insert user");
    }
    logger.info(`User registered successfully with ID: ${result.insertedId}`);

    const createdUser = await collection.findOne({ _id: result.insertedId });

    if (!createdUser) {
      throw new Error("User was created but could not be retrieved");
    }

    return createdUser as unknown as User;
  } catch (error) {
    logger.error("Error registering user:", error);
    throw error;
  }
};
