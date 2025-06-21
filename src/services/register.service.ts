import { client, mainDb } from "../config/database.config";
import { User, UserRegister } from "../models/user.model";
import { auth } from "../utils/auth.utils";
import { logger } from "../utils/logger.utils";
import { validator } from "../utils/validators.utils";

//TODO Either redirect to login or return JWT

export const registerUser = async (user: UserRegister): Promise<User> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    if (!validator.email(user.email)) {
      logger.warn("Invalid email");
      throw { message: "Invalid email", statusCode: 400 };
    }

    if (!validator.password(user.password)) {
      logger.warn("Invalid password");
      throw { message: "Invalid password", statusCode: 400 };
    }

    if (!validator.nickname(user.nickname)) {
      logger.warn("Invalid nickname");
      throw { message: "Invalid nickname", statusCode: 400 };
    }

    if (!validator.url(user.avatar_url)) {
      logger.warn("Invalid avatar url");
      throw { message: "Invalid avatar url", statusCode: 400 };
    }

    if (!validator.leaveMeId(user.leave_me_id)) {
      logger.warn("Invalid LeaveMeID");
      throw { message: "Invalid LeaveMeID", statusCode: 400 };
    }

    const collection = mainDb.collection("users");

    logger.info("Mongo collection", collection);

    if (await collection.findOne({ email: user.email })) {
      logger.warn("Email already exists");
      throw { message: "Email already exists", statusCode: 409 };
    }

    if (await collection.findOne({ leave_me_id: user.leave_me_id })) {
      logger.warn("LeaveMeID already exists");
      throw { message: "LeaveMeID already exists", statusCode: 409 };
    }

    logger.info("User:", user);

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
    };
    logger.info("Registering user:", newUser);

    const result = await collection.insertOne(newUser);

    if (!result.acknowledged) {
      logger.error("Failed to insert user");
      throw new Error("Failed to insert user");
    }
    logger.success(
      `User registered successfully with ID: ${result.insertedId}`
    );

    const createdUser = await collection.findOne({ _id: result.insertedId });

    if (!createdUser) {
      logger.warn("User was created but could not be retrieved");
      throw new Error("User was created but could not be retrieved");
    }

    return createdUser as unknown as User;
  } catch (error) {
    logger.error("Error registering user:", error);
    throw error;
  }
};
