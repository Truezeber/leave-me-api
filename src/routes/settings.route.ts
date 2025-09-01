import { Router } from "express";
import * as settingsController from "../controllers/settings.controller"
import { handleAuth } from "../middlewares/auth.middleware";
const router = Router();
/**
 * @swagger
 *
 * /api/v1/settings/change-avatar:
 *   post:
 *     summary: Sends an invite to a friend.
 *     tags: [Settings]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             avatar_url:
 *               type: string
 *     responses:
 *       200:
 *         description: Avatar changed succesfully
 *       400:
 *         description: Invalid avatar URL
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/change-avatar", handleAuth, settingsController.changeAvatar);

export default router;
