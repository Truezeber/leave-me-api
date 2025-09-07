import { Request, Response } from "express";
import { logger } from "../utils/logger.utils";
import { transformer } from "../utils/transformers.utils";
import { validator } from "../utils/validators.utils";

import * as settingsService from "../services/settings.service"

export const changeAvatar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/settings/change-avatar - Changing avatar");

    const [userLid, avatarUrl] = transformer.toString((req as any).user, req.body.avatar_url);

    if (!validator.url(avatarUrl)) {
      throw { message: "Invalid url", statusCode: 400 };
    }

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

export const changeBackground = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/settings/change-background - Changing background");

    const [userLid, backgroundUrl] = transformer.toString((req as any).user, req.body.background_url);

    if (!validator.url(backgroundUrl)) {
      throw { message: "Invalid url", statusCode: 400 };
    }

    await settingsService.changeBackground(userLid, backgroundUrl);

    res
      .status(200)
      .json({
        message: "Background changed successfully"
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

    const [userLid, nickname] = transformer.toString((req as any).user, req.body.nickname);

    if (!validator.nickname(nickname)) {
      throw { message: "Invalid nickname", statusCode: 400 };
    }

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

export const changeStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/settings/change-status - Changing status");

    const [userLid, status] = transformer.toString((req as any).user, req.body.status);

    if (status.length > 120) {
      throw { message: "Status is too long", statusCode: 400 };
    }

    await settingsService.changeStatus(userLid, status);

    res
      .status(200)
      .json({
        message: "Status changed successfully"
      });

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    })
  }
}


export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/settings/change-password - Changing password");

    const [userLid, password, newPassword] = transformer.toString((req as any).user, req.body.password, req.body.new_password);

    if (!validator.password(newPassword)) {
      throw { message: "Invalid nickname", statusCode: 400 };
    }

    await settingsService.changePassword(userLid, password, newPassword);

    res
      .status(200)
      .json({
        message: "Password changed successfully"
      });

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    })
  }
}
