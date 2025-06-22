import { Request, Response, NextFunction } from "express";
import { auth } from "../utils/auth.utils";
import { logger } from "../utils/logger.utils";

export const handleAuth = (req: Request, res: Response, next: NextFunction) => {
  logger.info("Authenticating user");
  if (req.cookies.access_token) {
    logger.info("Access token found");
    const accessToken = req.cookies.access_token;
    const payload = auth.verifyJwt(accessToken);
    if (payload) {
      logger.info("Access token verified");
      (req as any).user = payload;
      next();
    } else {
      logger.info("Access token not verified");
      res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    logger.info("Access token not found");
    res.status(401).json({ error: "Unauthorized" });
  }
};
