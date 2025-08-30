import { client, mainDb } from "../config/database.config";
import { UserConfirmation, User } from "../models/user.model";
import { auth } from "../utils/auth.utils";
import { logger } from "../utils/logger.utils";
import { validator } from "../utils/validators.utils";

export const requestSignup = async (user: UserConfirmation): Promise<string> => { //function props should be sexier
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    if (!validator.email(user.email)) {
      logger.warn("Invalid email");
      throw { message: "Invalid email", statusCode: 400 };
    }

    const confirmationCollection = mainDb.collection<UserConfirmation>("usersConfirmation");
    const usersCollection = mainDb.collection<User>("users");

    if (await confirmationCollection.findOne({ email: user.email }) || await usersCollection.findOne({ email: user.email })) {
      logger.warn("Email already exists");
      throw { message: "Email already exists", statusCode: 409 };
    }

    const newConfirmation: UserConfirmation = {
      email: user.email,
      pin: await auth.hashPassword(`${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      verified: false
    };
    logger.info("New confirmation user:", newConfirmation);

    const result = await confirmationCollection.insertOne(newConfirmation);

    if (!result.acknowledged) {
      logger.error("Failed to insert confirmation");
      throw new Error("Failed to insert confirmation"); //TODO normal http error should be there
    }
    logger.success(
      `User confirmation registered ${result}`
    );
    return "Success";
  } catch (error) {
    logger.error("Error registering user:", error);
    throw error;
  }
};
