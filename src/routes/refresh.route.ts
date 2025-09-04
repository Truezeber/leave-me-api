import { Router } from "express";
import * as refreshController from "../controllers/refresh.controller";

const router = Router();

/**
 * @swagger
 *
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh access token using refresh token.
 *     tags: [Auth]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 expires_at:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */

router.post("/refresh-token", refreshController.refreshToken);

export default router;
