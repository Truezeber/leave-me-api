import { Request, Response } from "express";
import { logger } from "../utils/logger.utils";

import * as friendsService from "../services/friends.service";

export const inviteFriend = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/friends/invite - Inviting friend");

    const [userLid, friendLid] = [
      (req as any).user,
      req.body.friendLid
    ];

    await friendsService.inviteFriend(userLid, friendLid);

    res
      .status(200)
      .json({
        message: "Invite sent successfully"
      });

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    })
  }
}
