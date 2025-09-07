import { Request, Response } from "express";
import { logger } from "../utils/logger.utils";
import { transformer } from "../utils/transformers.utils";

import * as blockService from "../services/block.service";

export const blockUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("POST /api/v1/block/block-user - Blocking user");

    const [userLid, secondUserLid] = transformer.toString((req as any).user, req.body.blockLid);

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
    logger.info("POST /api/v1/block/unblock-user - Unblocking user");

    const [userLid, secondUserLid] = transformer.toString((req as any).user, req.body.blockLid);

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
    logger.info("POST /api/v1/block/blocks - Getting blocks");

    const [userLid] = transformer.toString((req as any).user);

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
