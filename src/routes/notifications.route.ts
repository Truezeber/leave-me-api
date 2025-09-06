import { Router } from "express";
import * as notificationsController from "../controllers/notifications.controller";
import { handleAuthNoBan } from "../middlewares/auth.middleware";
const router = Router();
/**
 * @swagger
 *
 * /api/v1/notifications/mark-as-seen:
 *   post:
 *     summary: Marks notification as seen.
 *     tags: [Notifications]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             notification_id:
 *               type: string
 *     responses:
 *       200:
 *         description: Notification marked successfully
 *       400:
 *         description: Invalid notification_id
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/mark-as-seen", handleAuthNoBan, notificationsController.markAsSeen);

/**
 * @swagger
 *
 * /api/v1/notifications/load-notifications:
 *   get:
 *     summary: Loads notifications.
 *     tags: [Notifications]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: amount
 *         schema:
 *           type: integer
 *         required: true
 *         description: Number of notifications to load
 *     responses:
 *       200:
 *         description: Notifications loaded successfully
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.get("/load-notifications", handleAuthNoBan, notificationsController.loadNotifications);

export default router;
