import { Request, Response } from "express";
import * as refreshService from "../services/refresh.service";
import { logger } from "../utils/logger.utils";
import { transformer } from "../utils/transformers.utils";

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("POST /api/v1/auth/refresh-token - Refreshing token");

    const [refreshToken] = transformer.toString(req.cookies.refresh_token);

    if (!refreshToken) {
      logger.warn("No refresh token provided");
      res.status(401).json({ error: "No refresh token provided" });
      return;
    }

    const result = await refreshService.refreshToken(refreshToken);

    res
      .status(200)
      .cookie("access_token", result, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60,
        // secure: true, //! uncomment for prod
      })
      .json({ success: true });

  } catch (error: any) {
    logger.error("Error refreshing token:", error);
    res.status(error.statusCode || 401).json({
      error: error.message || "Unauthorized",
    });
  }
};
