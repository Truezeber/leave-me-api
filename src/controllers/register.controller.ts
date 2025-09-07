import { Request, Response } from "express";
import * as registerService from "../services/register.service";
import { logger } from "../utils/logger.utils";
import { validator } from "../utils/validators.utils";

export const postUser = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("POST /api/v1/auth/register - Registering user");

    const user = req.body;

    if (!validator.email(user.email)) {
      throw { message: "Invalid credentials", statusCode: 400 };
    }

    if (!validator.password(user.password)) {
      throw { message: "Invalid credentials", statusCode: 400 };
    }

    if (!validator.nickname(user.nickname)) {
      throw { message: "Invalid credentials", statusCode: 400 };
    }

    if (!validator.url(user.avatar_url)) {
      throw { message: "Invalid credentials", statusCode: 400 };
    }

    if (!validator.leaveMeId(user.leave_me_id)) {
      throw { message: "Invalid credentials", statusCode: 400 };
    }

    if (!user.pp_accepted || !user.tos_accepted) {
      throw { message: "Terms Of Service or Privacy Policy must be accepted", statusCode: 422 }
    }

    const [refreshToken, accessToken] = await registerService.registerUser(req.body);

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
