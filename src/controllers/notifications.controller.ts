import { Request, Response } from "express";
import { logger } from "../utils/logger.utils";
import { ObjectId } from "mongodb";
import { transformer } from "../utils/transformers.utils";

import * as notificationsService from "../services/notifications.service";


export const markAsSeen = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/notifications/mark-as-seen - Marking notification as seen");

    const [userLid, notificationString] = transformer.toString((req as any).user, req.body.notification_id);
    let notificationId: ObjectId;

    if (notificationString.length === 24 && /^[a-f0-9]+$/i.test(notificationString)) {
      notificationId = new ObjectId(notificationString);
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

    const [userLid] = transformer.toString((req as any).user);
    const [amount] = transformer.toInt(req.query.amount);

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
