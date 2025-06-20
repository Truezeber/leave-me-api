import { Request, Response } from "express";
import * as userService from "../services/testuser.service";
import { logger } from "../utils/logger.utils";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("GET /api/users - Fetching all users");
    const users = await userService.getAllUsers();
    logger.info(`Returning ${users.length} users`);
    res.status(200).json(users);
  } catch (error: any) {
    logger.error("Error in getAllUsers controller:", error);
    res.status(500).json({ message: error.message });
  }
};
