import { logger } from "../utils/logger.utils";
import { dbFunctions, dbCollections } from "../utils/db.utils";

export const logoutUser = async (
  leave_me_id: string,
  refresh_token: string
): Promise<string> => {
  try {
    dbFunctions.connectionCheck();

    const collection = dbCollections.users;

    await collection.updateOne(
      { leave_me_id: leave_me_id },
      { $pull: { refresh_tokens: refresh_token } }
    );

    return "Success";
  } catch (error) {
    logger.error("Error registering user:", error);
    throw error;
  }
};
