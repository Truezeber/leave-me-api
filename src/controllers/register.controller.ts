import { Request, Response } from "express";
import * as registerService from "../services/register.service";
import { logger } from "../utils/logger.utils";

export const postUser = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("POST /api/register - Registering user");
    const registerResponse = await registerService.registerUser(req.body);
    const [refreshToken, accessToken] = registerResponse;
    res
      .status(200)
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        //secure: true, //! <- uncomment before deploy
        sameSite: true,
      })
      .cookie("access_token", accessToken, {
        httpOnly: true,
        //secure: true, //! <- uncomment before deploy
        sameSite: true,
        maxAge: 1000 * 60 * 60,
      })
      .json({ success: true });
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    });
  }
};
