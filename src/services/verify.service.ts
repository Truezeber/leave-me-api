import { UserConfirmation } from "../models/user.model";
import { auth } from "../utils/auth.utils";
import { logger } from "../utils/logger.utils";
import { email } from "../utils/emails.utils";
import { dbFunctions, dbCollections } from "../utils/db.utils";

export const requestSignup = async (userEmail: string): Promise<string> => {
  try {
    dbFunctions.connectionCheck();

    const confirmationCollection = dbCollections.confirmations;
    const usersCollection = dbCollections.users;

    if (await confirmationCollection.findOne({ email: userEmail }) || await usersCollection.findOne({ email: userEmail })) {
      throw { message: "Email already exists", statusCode: 409 };
    }

    const pin = `${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    const newConfirmation: UserConfirmation = {
      email: userEmail,
      pin: await auth.hashPassword(pin),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      verified: false
    };

    const result = await confirmationCollection.insertOne(newConfirmation);

    if (!result.acknowledged) {
      logger.error("Failed to request new PIN");
      throw new Error("Undefined database problem");
    }

    const { error } = await email.sendPin(userEmail, pin);

    if (error) {
      throw { message: error, statusCode: 400 };
    }

    return "Success";
  } catch (error) {
    logger.error("Error registering user:", error);
    throw error;
  }
};

export const requestNewPin = async (userEmail: string): Promise<string> => {
  try {
    dbFunctions.connectionCheck();

    const confirmationCollection = dbCollections.confirmations;
    const usersCollection = dbCollections.users;

    if (await usersCollection.findOne({ email: userEmail })) {
      throw { message: "Email already verified", statusCode: 409 };
    }

    const user = await confirmationCollection.findOne({ email: userEmail });

    if (!user) {
      throw { message: "Email not registered yet", statusCode: 404 };
    }

    if (Date.now() < user.expiresAt.getTime()) {
      throw { message: "Old PIN still valid", statusCode: 409 };
    }

    const pin = `${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    const newConfirmation: UserConfirmation = {
      email: userEmail,
      pin: await auth.hashPassword(pin),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      verified: false
    };

    const result = await confirmationCollection.updateOne({ email: userEmail }, { $set: newConfirmation });

    if (!result.acknowledged) {
      logger.error("Failed to insert new PIN");
      throw new Error("Undefined database problem");
    }

    const { error } = await email.sendPin(userEmail, pin);

    if (error) {
      throw { message: error, statusCode: 400 };
    }

    return "Success";
  } catch (error) {
    logger.error("Error sending PIN:", error);
    throw error;
  }
};

export const confirmPin = async (userEmail: string, confirmPin: string): Promise<string> => { //function props should be sexier
  try {
    dbFunctions.connectionCheck();

    const confirmationCollection = dbCollections.confirmations;

    const user = await confirmationCollection.findOne({ email: userEmail });

    if (!user) {
      throw { message: "Email not registered yet", statusCode: 404 };
    }

    if (user.verified) {
      throw { message: "User already verified", statusCode: 409 };
    }

    if (Date.now() > user.expiresAt.getTime() || !await auth.comparePassword(confirmPin, user.pin)) {
      throw { message: "PIN is invalid or outdated", statusCode: 409 };
    }

    const result = await confirmationCollection.updateOne({ email: userEmail }, { $set: { verified: true } });

    if (!result.acknowledged) {
      logger.error("Failed to confirm PIN");
      throw new Error("Undefined database problem");
    }

    return "Success";
  } catch (error) {
    logger.error("Error verifying PIN:", error);
    throw error;
  }
};
