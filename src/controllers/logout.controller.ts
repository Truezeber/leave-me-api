import { Request, Response } from "express";
import { logger } from "../utils/logger.utils";
import * as logoutService from "../services/logout.service";
import { transformer } from "../utils/transformers.utils";

export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/auth/logout - Logging out user");

    const [refreshToken, leaveMeId] = transformer.toString(req.cookies.refresh_token, (req as any).user);

    logoutService.logoutUser(leaveMeId, refreshToken);

    res
      .status(200)
      .clearCookie("access_token", {
        httpOnly: true,
        //secure: true, //! <- uncomment before deploy
        sameSite: "strict",
      })
      .clearCookie("refresh_token", {
        httpOnly: true,
        //secure: true, //! <- uncomment before deploy
        sameSite: "strict",
      })
      .json({
        message: "Logout done",
        refresh_token: refreshToken,
      });

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    });
  }
};
