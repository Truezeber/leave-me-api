import { Request, Response } from "express";
import { logger } from "../utils/logger.utils";

import * as verifyService from "../services/verify.service";

export const requestSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/auth/request-signup - Sending confirmation e-mail");

    await verifyService.requestSignup(req.body.email);

    res
      .status(200)
      .json({
        message: "Confirmation e-mail sent"
      });

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    })
  }
}

export const requestNewPin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/auth/request-new-pin - Sending new PIN e-mail");

    await verifyService.requestNewPin(req.body.email);

    res
      .status(200)
      .json({
        message: "New PIN e-mail sent"
      });

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    })
  }
}

export const confirmPin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/auth/request-verify - Verifying PIN");

    await verifyService.confirmPin(req.body.email, req.body.pin);

    res
      .status(200)
      .json({
        message: "PIN verified"
      });

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    })
  }
}
