import { Request, Response } from "express";
import { logger } from "../utils/logger.utils";
import { ObjectId } from "mongodb";

import * as notificationsService from "../services/notifications.service";


export const markAsSeen = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/notifications/mark-as-seen - Marking notification as seen");

    let [userLid, notificationId] = [
      (req as any).user,
      req.body.notification_id,
    ];

    if (typeof notificationId === "string" && notificationId.length === 24 && /^[a-f0-9]+$/i.test(notificationId)) {
      notificationId = new ObjectId(notificationId);
    } else {
      throw { message: "notification_id is not a valid ObjectId", statusCode: 400 }
    }

    const response = await notificationsService.markAsSeen(userLid, notificationId);

    res
      .status(200)
      .json(response);

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    })
  }
}

export const loadNotifications = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("GET /api/v1/notifications/load-notifications - Loading notifications");

    let [userLid, amountRaw] = [
      (req as any).user,
      req.query.amount as string,
    ];

    const amount = Number(amountRaw);
    if (isNaN(amount) || amount <= 0) {
      throw { message: "Invalid amount", statusCode: 400 };
    }

    const response = await notificationsService.loadNotifications(userLid, amount);

    res.status(200).json(response);
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    })
  }
}
