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
      req.body.avatar_url
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

export const changeNickname = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/settings/change-nickname - Changing nickname");

    const [userLid, nickname] = [
      (req as any).user,
      req.body.nickname
    ];

    await settingsService.changeNickname(userLid, nickname);

    res
      .status(200)
      .json({
        message: "Nickname changed successfully"
      });

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    })
  }
}
