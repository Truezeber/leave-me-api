import { Request, Response } from "express";
import { logger } from "../utils/logger.utils";
import { ObjectId } from "mongodb";

import * as postsService from "../services/posts.service";

export const sendPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/posts/send - Sending a post");

    let [userLid, origin, content] = [
      (req as any).user,
      req.body.origin,
      req.body.content
    ];

    if (typeof origin === "string" && origin.length === 24 && /^[a-f0-9]+$/i.test(origin)) {
      origin = new ObjectId(origin);
    }
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

export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/posts/delete - Deleting a post");

    let [userLid, origin] = [
      (req as any).user,
      req.body.origin,
    ];

    if (typeof origin === "string" && origin.length === 24 && /^[a-f0-9]+$/i.test(origin)) {
      origin = new ObjectId(origin);
    } else {
      throw { message: "Origin is not a valid ObjectId", statusCode: 400 }
    }

    const response = await postsService.deletePost(userLid, origin);

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

export const likePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/posts/like - Liking a post");

    let [userLid, origin] = [
      (req as any).user,
      req.body.origin,
    ];

    if (typeof origin === "string" && origin.length === 24 && /^[a-f0-9]+$/i.test(origin)) {
      origin = new ObjectId(origin);
    } else {
      throw { message: "Origin is not a valid ObjectId", statusCode: 400 }
    }

    const response = await postsService.likePost(userLid, origin);

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
