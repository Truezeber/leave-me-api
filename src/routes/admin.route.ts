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

/**
 * @swagger
 *
 * /api/v1/admin/delete-post:
 *   post:
 *     summary: Deletes a post.
 *     tags: [Admin]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             origin:
 *               type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       400:
 *         description: Invalid origin
 *       403:
 *         description: No admin permissions
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/delete-post", handleAuth, adminController.deletePost);

/**
 * @swagger
 *
 * /api/v1/admin/grant-badge:
 *   post:
 *     summary: Grants a badge.
 *     tags: [Admin]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             user_lid:
 *               type: string
 *             badge:
 *               type: string
 *     responses:
 *       200:
 *         description: User banned successfully
 *       403:
 *         description: No admin permissions
 *       404:
 *         description: User not found
 *       409:
 *         descritpion: User already have this badge
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/grant-badge", handleAuth, adminController.grantBadge);


