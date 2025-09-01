import { client, mainDb } from "../config/database.config";
import { User, UserConfirmation, UserRegister } from "../models/user.model";
import { auth } from "../utils/auth.utils";
import { logger } from "../utils/logger.utils";
import { validator } from "../utils/validators.utils";

export const registerUser = async (user: UserRegister): Promise<string[]> => {
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

    if (!user.pp_accepted || !user.tos_accepted) {
      logger.warn("PP or TOS unaccepted");
      throw { message: "Terms Of Service or Privacy Policy must be accepted", statusCode: 422 }
    }

    const collection = mainDb.collection<User>("users");
    const confirmationCollection = mainDb.collection<UserConfirmation>("usersConfirmation");
    const confirmedUser = await confirmationCollection.findOne({ email: user.email });

    logger.info("Mongo collection", collection);
    logger.debug("ConfirmedUser: ", confirmedUser);

    if (await collection.findOne({ email: user.email })) {
      logger.warn("Email already exists");
      throw { message: "Email already exists", statusCode: 409 };
    }

    if (await collection.findOne({ leave_me_id: user.leave_me_id })) {
      logger.warn("LeaveMeID already exists");
      throw { message: "LeaveMeID already exists", statusCode: 409 };
    }

    if (!confirmedUser || !confirmedUser.verified) {
      logger.warn("Email not verified");
      throw { message: "Email not verified", statusCode: 409 };
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
      refresh_tokens: [auth.generateRefreshToken()],
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

    const refreshToken = newUser.refresh_tokens[0];
    const accessToken = auth.generateJwt({ leave_me_id: newUser.leave_me_id });

    return [refreshToken, accessToken];
  } catch (error) {
    logger.error("Error registering user:", error);
    throw error;
  }
};
