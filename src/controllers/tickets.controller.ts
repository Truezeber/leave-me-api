import { Request, Response } from "express";
import { logger } from "../utils/logger.utils";
import { ObjectId } from "mongodb";

import * as ticketsService from "../services/tickets.service";

export const createTicket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/ticket/create - Creating a post");

    let [userLid, category, reportedUser, reportedPost] = [
      (req as any).user,
      req.body.category,
      req.body.reported_user,
      req.body.reported_post
    ];

    if (!["Report post", "Report user", "Delete account", "Unban request", "Data request", "Other"].includes(category)) {
      throw { message: "Invalid category", statusCode: 400 };
    }


    if (reportedPost && typeof reportedPost === "string" && reportedPost.length === 24 && /^[a-f0-9]+$/i.test(reportedPost)) {
      reportedPost = new ObjectId(reportedPost);
    } else {
      throw { message: "Reported post is not a valid ObjectId", statusCode: 400 };
    }


    const response = await ticketsService.createTicket(userLid, category, reportedUser, reportedPost);

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


