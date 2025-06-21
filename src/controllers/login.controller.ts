import { Request, Response } from "express";
import * as loginService from "../services/login.service";
import { logger } from "../utils/logger.utils";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("POST /api/login - Logging in user");
    //const registerResponse = await registerService.registerUser(req.body);
    //const [refreshToken, accessToken] = registerResponse;

    const loginResponse = await loginService.loginUser(
      req.body.leave_me_id,
      req.body.password,
      req.body.remember_me
    );
    res.status(200).json({ message: loginResponse[0], success: true });
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    });
  }
};
