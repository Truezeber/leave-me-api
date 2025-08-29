import { Request, Response } from "express";
import { logger } from "../utils/logger.utils";

import * as blockService from "../services/block.service";

export const blockUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/block/block-user - Blocking user");

    const [userLid, secondUserLid] = [
      (req as any).user,
      req.body.blockLid
    ];

    await blockService.blockUser(userLid, secondUserLid);

    res
      .status(200)
      .json({
        message: "User blocked succesfully"
      });

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    })
  }
}

export const unblockUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/block/unblock-user - Unblocking user");

    const [userLid, secondUserLid] = [
      (req as any).user,
      req.body.blockLid
    ];

    await blockService.unblockUser(userLid, secondUserLid);

    res
      .status(200)
      .json({
        message: "User unblocked succesfully"
      });

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    })
  }
}

export const getBlocks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/block/blocks - Getting blocks");

    const userLid = (req as any).user;

    const list = (await blockService.getBlocks(userLid));

    res
      .status(200)
      .json({
        blocks: list
      });

  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
    })
  }
}
