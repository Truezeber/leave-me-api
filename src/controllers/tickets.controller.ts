import { Request, Response } from "express";
import { logger } from "../utils/logger.utils";
import { ObjectId } from "mongodb";
import { transformer } from "../utils/transformers.utils";

import * as ticketsService from "../services/tickets.service";
import { TicketCategory } from "../models/tickets.model";

export const createTicket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/ticket/create - Creating a post");

    const [userLid, category, reportedUser, reportedPostString] = transformer.toString((req as any).user, req.body.category, req.body.reported_user, req.body.reportedPost);
    let reportedPostId: ObjectId | undefined;

    if (!["Report post", "Report user", "Delete account", "Unban request", "Data request", "Other"].includes(category)) {
      throw { message: "Invalid category", statusCode: 400 };
    }

    if (reportedPostString !== "") {
      if (reportedPostString.length === 24 && /^[a-f0-9]+$/i.test(reportedPostString)) {
        reportedPostId = new ObjectId(reportedPostString);
      } else {
        throw { message: "Reported post is not a valid ObjectId", statusCode: 400 };
      }
    }


    const response = await ticketsService.createTicket(userLid, category as TicketCategory, reportedUser, reportedPostId);

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

export const message = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/tickets/message - Messaging in ticket");

    const [userLid, ticketId, content] = transformer.toString((req as any).user, req.body.ticket_id, req.body.content);
    const [isComment] = transformer.toBoolean(req.body.is_comment);

    const response = await ticketsService.message(userLid, ticketId, content, isComment);

    res.status(200).json(response);
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message || "Something went wrong" })
  }
}

export const closeTicket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/tickets/close - Closing a ticket");

    const [userLid, ticketId] = transformer.toString((req as any).user, req.body.ticket_id);

    const response = await ticketsService.closeTicket(userLid, ticketId);

    res.status(200).json(response);
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message || "Something went wrong" })
  }
}

export const loadTicket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("GET /api/v1/tickets/load-ticket - Loading a ticket");

    const [userLid, ticketId] = transformer.toString((req as any).user, req.query.ticket_id);

    const response = await ticketsService.loadTicket(userLid, ticketId);

    res.status(200).json(response);
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message || "Something went wrong" })
  }
}

export const loadTickets = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("GET /api/v1/tickets/load-tickets - Loading tickets");

    const [userLid, sortBy] = transformer.toString((req as any).user, req.query.sort_by);
    const [amount] = transformer.toInt(req.body.amount);

    if (sortBy !== "newest" && sortBy !== "oldest") {
      throw { message: "Invalid sorting", statusCode: 400 };
    }

    if (amount <= 0) {
      throw { message: "Amount must be positive", statusCode: 400 };
    }

    const response = await ticketsService.loadTickets(userLid, amount, sortBy);

    res.status(200).json(response);
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message || "Something went wrong" })
  }
}
