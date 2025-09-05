import { Router } from "express";
import * as ticketsController from "../controllers/tickets.controller";
import { handleAuthNoBan } from "../middlewares/auth.middleware";
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
 *       403:
 *         descritpion: Banned requester
 *       404:
 *         description: User or post not found
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/create", handleAuthNoBan, ticketsController.createTicket);

/**
 * @swagger
 *
 * /api/v1/tickets/message:
 *   post:
 *     summary: Messages in a ticket.
 *     tags: [Tickets]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             ticket_id:
 *               type: string
 *             content:
 *               type: string
 *             is_comment:
 *               type: string
 *     responses:
 *       200:
 *         description: Invite sent successfully
 *       403:
 *         description: Forbidden OR banned requester
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/message", handleAuthNoBan, ticketsController.message);

/**
 * @swagger
 *
 * /api/v1/tickets/close:
 *   post:
 *     summary: Close a ticket.
 *     tags: [Tickets]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             ticket_id:
 *               type: string
 *     responses:
 *       200:
 *         description: Invite sent successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/close", handleAuthNoBan, ticketsController.closeTicket);
/**
 * @swagger
 *
 * /api/v1/tickets/load-ticket:
 *   get:
 *     summary: Loads ticket content.
 *     tags: [Tickets]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: ticket_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the ticket
 *     responses:
 *       200:
 *         description: Ticket loaded successfully
 *       400:
 *         description: Invalid request parameters
 *       403:
 *         description: You can access only your tickets OR banned requester
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.get("/load-ticket", handleAuthNoBan, ticketsController.loadTicket);

/**
 * @swagger
 *
 * /api/v1/tickets/load-tickets:
 *   get:
 *     summary: Loads tickets list.
 *     tags: [Tickets]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: amount
 *         schema:
 *           type: number
 *         required: true
 *         description: Amount of tickets to load
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *         required: true
 *         description: newest or oldest
 *     responses:
 *       200:
 *         description: Tickets loaded successfully
 *       400:
 *         description: Invalid request parameters
 *       403:
 *         descritpion: Banned requester
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.get("/load-tickets", handleAuthNoBan, ticketsController.loadTickets);
export default router;
