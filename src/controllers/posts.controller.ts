import { Request, Response } from "express";
import { logger } from "../utils/logger.utils";
import { ObjectId } from "mongodb";
import { transformer } from "../utils/transformers.utils";

import * as postsService from "../services/posts.service";

export const sendPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/posts/send - Sending a post");

    const [userLid, originString, content] = transformer.toString((req as any).user, req.body.origin, req.body.content);
    let origin: ObjectId | string;

    if (originString.length === 24 && /^[a-f0-9]+$/i.test(originString)) {
      origin = new ObjectId(originString);
    } else {
      origin = originString;
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

    const [userLid, originString] = transformer.toString((req as any).user, req.body.origin);
    let originId: ObjectId;

    if (originString.length === 24 && /^[a-f0-9]+$/i.test(originString)) {
      originId = new ObjectId(originString);
    } else {
      throw { message: "Origin is not a valid ObjectId", statusCode: 400 }
    }

    const response = await postsService.deletePost(userLid, originId);

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

    const [userLid, originString] = transformer.toString((req as any).user, req.body.origin);
    let originId: ObjectId;

    if (originString.length === 24 && /^[a-f0-9]+$/i.test(originString)) {
      originId = new ObjectId(originString);
    } else {
      throw { message: "Origin is not a valid ObjectId", statusCode: 400 }
    }

    const response = await postsService.likePost(userLid, originId);

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

export const unlikePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/posts/unlike - Unliking a post");

    const [userLid, originString] = transformer.toString((req as any).user, req.body.origin);
    let originId: ObjectId;

    if (originString.length === 24 && /^[a-f0-9]+$/i.test(originString)) {
      originId = new ObjectId(originString);
    } else {
      throw { message: "Origin is not a valid ObjectId", statusCode: 400 }
    }

    const response = await postsService.unlikePost(userLid, originId);

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

export const loadPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("GET /api/v1/posts/load - Loading posts");

    const [userLid, originString, sortByRaw] = transformer.toString((req as any).user, req.query.origin, req.query.sort_by);
    const [amount] = transformer.toInt(req.query.amount);
    let origin: ObjectId | string, sortBy: "date" | "likes";

    if (originString.length === 24 && /^[a-f0-9]+$/i.test(originString)) {
      origin = new ObjectId(originString);
    } else {
      origin = originString;
    }

    if (isNaN(amount) || amount <= 0) {
      throw { message: "Invalid amount", statusCode: 400 };
    }

    sortBy = sortByRaw === "likes" ? "likes" : "date";

    const response = await postsService.loadPosts(userLid, origin, amount, sortBy);

    res.status(200).json(response);
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    })
  }
}
