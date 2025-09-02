import { Request, Response } from "express";
import { logger } from "../utils/logger.utils";

import * as postsService from "../services/posts.service";

export const sendPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/posts/send - Sending a post");

    const [userLid, origin, content] = [
      (req as any).user,
      req.body.origin,
      req.body.content
    ];

    const response = await postsService.createPost(userLid, origin, content);

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
