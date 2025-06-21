import { client, mainDb } from "../config/database.config";
import { User } from "../models/user.model";
import { auth } from "../utils/auth.utils";
import { logger } from "../utils/logger.utils";

export const loginUser = async (
  leave_me_id: string,
  password: string,
  remember_me: boolean
): Promise<string[]> => {
  try {
    if (!client) {
      logger.warn("Database client is not available");
      throw { message: "Database client is not available", statusCode: 503 };
    }

    const collection = mainDb.collection("users");
    logger.info("Mongo collection", collection);

    const user: User = (await collection.findOne({
      leave_me_id: leave_me_id,
    })) as User;
    logger.info("User:", user);

    logger.debug("password: ", password);
    const hashedPassword = await auth.hashPassword(password);
    logger.debug("Hashed password:", hashedPassword);
    let response: string = "";

    if (
      user &&
      (await auth.comparePassword(password, user.password)) === true
    ) {
      logger.success("All good");
      response = "Jest i zgodne";
    } else if (user) {
      logger.warn("Wrong password");
      response = "Złe hasło";
    } else {
      logger.warn("User does not exist");
      response = "Nie ma takiego użytkownika";
    }
    return [response];
  } catch (error) {
    logger.error("Error registering user:", error);
    throw error;
  }
};
