import { Request, Response } from "express";
import * as loginService from "../services/login.service";
import { logger } from "../utils/logger.utils";
import { transformer } from "../utils/transformers.utils";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("POST /api/v1/auth/login - Logging in user");

    const [leave_me_id, password] = transformer.toString(req.body.leave_me_id, req.body.password);

    const [refreshToken, accessToken] = await loginService.loginUser(
      leave_me_id,
      password,
      req.body.remember_me
    );

    res
      .status(200)
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        //secure: true, //! <- uncomment before deploy
        sameSite: 'lax',
        maxAge: 10 * 365 * 24 * 60 * 60 * 1000, //! <- security vulnerability, add refresh_token rotation in the future -_-
      })
      .cookie("access_token", accessToken, {
        httpOnly: true,
        //secure: true, //! <- uncomment before deploy
        sameSite: 'lax',
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
