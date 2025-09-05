import { Request, Response } from "express";
import { logger } from "../utils/logger.utils";

import * as adminService from "../services/admin.service";

export const banUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/admin/ban-user - Banning user");

    const [userLid, secondUserLid] = [
      (req as any).user,
      req.body.ban_lid
    ];

    await adminService.banUser(userLid, secondUserLid);

    res
      .status(200)
      .json({
        message: "User banned succesfully"
      });

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    })
  }
}


