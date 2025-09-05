
import { Request, Response, NextFunction, RequestHandler } from "express";
import { auth } from "../utils/auth.utils";
import { logger } from "../utils/logger.utils";
import { client, mainDb } from "../config/database.config";
import { User } from "../models/user.model";

interface AuthRequest extends Request {
  user?: string;
}


export const handleAuth: RequestHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Authenticating user");

    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      logger.info("Access token not found");
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const payload = auth.verifyJwt(accessToken);
    if (!payload) {
      logger.info("Access token not verified");
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (payload === "expired") {
      logger.info("Access token expired");
      res.status(401).json({ error: "Access token expired" });
      return;
    }

    logger.info("Access token verified");

    if (!client) {
      res.status(503).json({ error: "Database client is not available" });
      return;
    }

    const users = mainDb.collection<User>("users");
    const user = await users.findOne({ leave_me_id: payload.leave_me_id });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.is_banned) {
      res.status(403).json({ error: "You are banned" });
      return;
    }

    req.user = payload.leave_me_id;
    next();
  } catch (error: any) {
    logger.error("Error in authentication middleware:", error);
    res.status(error.statusCode || 500).json({ error: error.message || "Something went wrong" });
  }
};

export const handleAuthNoBan = (req: Request, res: Response, next: NextFunction) => {
  if (req.cookies.access_token) {
    const accessToken = req.cookies.access_token;
    const payload = auth.verifyJwt(accessToken);

    if (payload && payload !== "expired") {
      (req as any).user = payload.leave_me_id;
      next();
    } else if (payload === "expired") {
      res.status(401).json({ error: "Access token expired" });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};
