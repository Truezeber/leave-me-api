import { Request, Response } from "express";
import * as registerService from "../services/register.service";
import { logger } from "../utils/logger.utils";

export const postUser = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("POST /api/register - Registering user");
    const user = await registerService.registerUser(req.body);
    res.status(200).json(user);
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    });
  }
};
