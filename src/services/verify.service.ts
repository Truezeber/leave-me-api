import { client, mainDb } from "../config/database.config";
import { UserConfirmation, User } from "../models/user.model";
import { auth } from "../utils/auth.utils";
import { logger } from "../utils/logger.utils";
import { validator } from "../utils/validators.utils";
import { email } from "../utils/emails.utils";

export const requestSignup = async (userEmail: string): Promise<string> => { //function props should be sexier
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    if (!validator.email(userEmail)) {
      logger.warn("Invalid email");
      throw { message: "Invalid email", statusCode: 400 };
    }

    const confirmationCollection = mainDb.collection<UserConfirmation>("usersConfirmation");
    const usersCollection = mainDb.collection<User>("users");

    if (await confirmationCollection.findOne({ email: userEmail }) || await usersCollection.findOne({ email: userEmail })) {
      logger.warn("Email already exists");
      throw { message: "Email already exists", statusCode: 409 };
    }

    const pin = `${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    const newConfirmation: UserConfirmation = {
      email: userEmail,
      pin: await auth.hashPassword(pin),
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

    const { data, error } = await email.sendPin(userEmail, pin);

    if (error) {
      throw { message: error, statusCode: 400 };
    }

    logger.debug(`Email: ${data}`);

    return "Success";
  } catch (error) {
    logger.error("Error registering user:", error);
    throw error;
  }
};
