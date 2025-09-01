import { Request, Response } from "express";
import { logger } from "../utils/logger.utils";

import * as settingsService from "../services/settings.service"

export const changeAvatar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/settings/change-avatar - Changing avatar");

    const [userLid, avatarUrl] = [
      (req as any).user,
      req.body.avatarUrl
    ];

    await settingsService.changeAvatar(userLid, avatarUrl);

    res
      .status(200)
      .json({
        message: "Avatar changed successfully"
      });

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    })
  }
}
