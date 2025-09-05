import { Request, Response } from "express";
import { logger } from "../utils/logger.utils";
import { ObjectId } from "mongodb";

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

export const unbanUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/admin/unban-user - Unbanning user");

    const [userLid, secondUserLid] = [
      (req as any).user,
      req.body.ban_lid
    ];

    await adminService.unbanUser(userLid, secondUserLid);

    res
      .status(200)
      .json({
        message: "User unbanned succesfully"
      });

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    })
  }
}

export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/admin/delete-post - Deleting a post");

    let [userLid, origin] = [
      (req as any).user,
      req.body.origin,
    ];

    if (typeof origin === "string" && origin.length === 24 && /^[a-f0-9]+$/i.test(origin)) {
      origin = new ObjectId(origin);
    } else {
      throw { message: "Origin is not a valid ObjectId", statusCode: 400 }
    }

    await adminService.deletePost(userLid, origin);

    res
      .status(200)
      .json({
        message: "Post deleted succesfully"
      });

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    })
  }
}

export const grantBadge = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/admin/grant-badge - Granting a badge to a user");

    const [userLid, secondUserLid, badge] = [
      (req as any).user,
      req.body.user_lid,
      req.body.badge
    ];

    await adminService.grantBadge(userLid, secondUserLid, badge);

    res
      .status(200)
      .json({
        message: "Badge granted succesfully"
      });

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    })
  }
}

export const revokeBadge = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/admin/revoke-badge - Revoking a badge to a user");

    const [userLid, secondUserLid, badge] = [
      (req as any).user,
      req.body.user_lid,
      req.body.badge
    ];

    await adminService.revokeBadge(userLid, secondUserLid, badge);

    res
      .status(200)
      .json({
        message: "Badge revoked succesfully"
      });

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    })
  }
}
