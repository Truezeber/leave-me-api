import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { handleAuth } from "../middlewares/auth.middleware";
const router = Router();
/**
 * @swagger
 *
 * /api/v1/admin/ban-user:
 *   post:
 *     summary: Bans user.
 *     tags: [Admin]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             ban_lid:
 *               type: string
 *     responses:
 *       200:
 *         description: User banned successfully
 *       403:
 *         description: No admin permissions
 *       404:
 *         description: User not found
 *       409:
 *         descritpion: User is already banned
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/ban-user", handleAuth, adminController.banUser);

/**
 * @swagger
 *
 * /api/v1/admin/unban-user:
 *   post:
 *     summary: Unbans user.
 *     tags: [Admin]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             ban_lid:
 *               type: string
 *     responses:
 *       200:
 *         description: User unbanned successfully
 *       403:
 *         description: No admin permissions
 *       404:
 *         description: User not found
 *       409:
 *         descritpion: User is not banned
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/unban-user", handleAuth, adminController.unbanUser);


