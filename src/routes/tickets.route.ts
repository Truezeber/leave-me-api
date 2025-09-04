import { Router } from "express";
import * as ticketsController from "../controllers/tickets.controller";
import { handleAuth } from "../middlewares/auth.middleware";
const router = Router();
/**
 * @swagger
 *
 * /api/v1/tickets/create:
 *   post:
 *     summary: Creates a ticket.
 *     tags: [Tickets]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             category:
 *               type: string
 *             reported_user:
 *               type: string
 *             reported_post:
 *               type: string
 *     responses:
 *       200:
 *         description: Invite sent successfully
 *       400:
 *         description: Invalid post ID
 *       404:
 *         description: User or post not found
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/create", handleAuth, ticketsController.createTicket);


