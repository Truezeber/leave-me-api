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

export const acceptFriend = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/friends/accept - Accepting friend");

    const [userLid, friendLid] = [
      (req as any).user,
      req.body.friendLid
    ];

    await friendsService.acceptFriend(userLid, friendLid);

    res
      .status(200)
      .json({
        message: "Invite accepted successfully"
      });
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status.json({
      error: error.message || "Something went wrong",
    }))
  }
}

export const rejectFriend = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/friends/reject - Rejecting friend");

    const [userLid, friendLid] = [
      (req as any).user,
      req.body.friendLid
    ];

    await friendsService.rejectFriend(userLid, friendLid);

    res
      .status(200)
      .json({
        message: "Invite rejected successfully"
      });
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status.json({
      error: error.message || "Something went wrong",
    }))
  }
}

export const cancelInvite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/friends/cancel - Canceling invite");

    const [userLid, friendLid] = [
      (req as any).user,
      req.body.friendLid
    ];

    await friendsService.cancelInvite(userLid, friendLid);

    res
      .status(200)
      .json({
        message: "Invite canceled successfully"
      });
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status.json({
      error: error.message || "Something went wrong",
    }))
  }
}

export const deleteFriend = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/friends/delete - Deleting friend");

    const [userLid, friendLid] = [
      (req as any).user,
      req.body.friendLid
    ];

    await friendsService.deleteFriend(userLid, friendLid);

    res
      .status(200)
      .json({
        message: "Friend deleted successfully"
      });
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status.json({
      error: error.message || "Something went wrong",
    }))
  }
}
