import { Request, Response } from "express";
import { logger } from "../utils/logger.utils";
import { transformer } from "../utils/transformers.utils";

import * as usersService from "../services/users.service";

export const getUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("GET /api/v1/users/get - getting a user");

    const [userLid, target] = transformer.toString((req as any).user, req.query.target);

    const response = await usersService.getUser(userLid, target);

    res.status(200).json(response);

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    })
  }
}
