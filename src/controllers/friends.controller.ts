import { Request, Response } from "express";
import { logger } from "../utils/logger.utils";
import { transformer } from "../utils/transformers.utils";

import * as friendsService from "../services/friends.service";

export const inviteFriend = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/friends/invite - Inviting friend");

    const [userLid, friendLid] = transformer.toString((req as any).user, req.body.friendLid);

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
    logger.info("POST /api/v1/friends/accept - Accepting friend");

    const [userLid, friendLid] = transformer.toString((req as any).user, req.body.friendLid);

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
    logger.info("POST /api/v1/friends/reject - Rejecting friend");

    const [userLid, friendLid] = transformer.toString((req as any).user, req.body.friendLid);

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
    logger.info("POST /api/v1/friends/cancel - Canceling invite");

    const [userLid, friendLid] = transformer.toString((req as any).user, req.body.friendLid);

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
    logger.info("POST /api/v1/friends/delete - Deleting friend");

    const [userLid, friendLid] = transformer.toString((req as any).user, req.body.friendLid);

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

export const getFriendsList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("GET /api/v1/friends/friends-list - Getting friends list");

    const [userLid] = transformer.toString((req as any).user);

    const list = (await friendsService.getFriendsList(userLid));

    res
      .status(200)
      .json({
        friends: list
      });

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status.json({
      error: error.message || "Something went wrong",
    }))
  }
}

export const getInvitesSentList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("GET /api/v1/friends/invites-sent-list - Getting invites sent list");

    const userLid = (req as any).user;

    const list = (await friendsService.getInvitesSentList(userLid));

    res
      .status(200)
      .json({
        friends: list
      });

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status.json({
      error: error.message || "Something went wrong",
    }))
  }
}

export const getInvitesGotList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("GET /api/v1/friends/invites-got-list - Getting invites got list");

    const [userLid] = transformer.toString((req as any).user);

    const list = (await friendsService.getInvitesGotList(userLid));

    res
      .status(200)
      .json({
        friends: list
      });

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status.json({
      error: error.message || "Something went wrong",
    }))
  }
}
