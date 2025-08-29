import { Router } from "express";
import * as blocksController from "../controllers/block.controller";
import { handleAuth } from "../middlewares/auth.middleware";
const router = Router();
/**
 * @swagger
 *
 * /api/block/block-user:
 *   post:
 *     summary: Blocks user.
 *     tags: [Blocks]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             blockLid:
 *               type: string
 *     responses:
 *       200:
 *         description: User blocked succesfully
 *       409:
 *         descritpion: User is either already blocked, invited to a friend, a friend or invited you to friends
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/block-user", handleAuth, blocksController.blockUser);

/**
 * @swagger
 *
 * /api/block/unblock-user:
 *   post:
 *     summary: Unblocks user.
 *     tags: [Blocks]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             blockLid:
 *               type: string
 *     responses:
 *       200:
 *         description: User unblocked successfully
 *       409:
 *         description: User is not blocked
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/accept", handleAuth, blocksController.unblockUser);

/**
 * @swagger
 *
 * /api/block/blocks:
 *   get:
 *     summary: Get blocks list.
 *     tags: [Blocks]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Blocks list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 friends:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.get("/blocks", handleAuth, blocksController.getBlocks);

export default router;
