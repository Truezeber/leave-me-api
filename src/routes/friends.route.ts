import { Router } from "express";
import * as friendsController from "../controllers/friends.controller";
import { handleAuth } from "../middlewares/auth.middleware";
const router = Router();
/**
 * @swagger
 *
 * /api/friends/invite:
 *   post:
 *     summary: Sends an invite to a friend.
 *     tags: [Friends]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             friendLid:
 *               type: string
 *     responses:
 *       200:
 *         description: Invite sent successfully
 *       403:
 *         description: User is blocked or blocking the target user
 *       404:
 *         description: Target user not found
 *       409:
 *         descritpion: Already friends, invite already sent or recieved invite from this user
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/invite", handleAuth, friendsController.inviteFriend);

/**
 * @swagger
 *
 * /api/friends/accept:
 *   post:
 *     summary: Accept invite to a friend.
 *     tags: [Friends]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             friendLid:
 *               type: string
 *     responses:
 *       200:
 *         description: Invite accepted successfully
 *       404:
 *         description: Invite not found
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/accept", handleAuth, friendsController.acceptFriend);

/**
 * @swagger
 *
 * /api/friends/reject:
 *   post:
 *     summary: Reject invite to a friend.
 *     tags: [Friends]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             friendLid:
 *               type: string
 *     responses:
 *       200:
 *         description: Invite rejected successfully
 *       404:
 *         description: Invite not found
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/reject", handleAuth, friendsController.rejectFriend);

/**
 * @swagger
 *
 * /api/friends/cancel:
 *   post:
 *     summary: Cancel invite to a friend.
 *     tags: [Friends]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             friendLid:
 *               type: string
 *     responses:
 *       200:
 *         description: Invite canceled successfully
 *       404:
 *         description: Invite not found
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/cancel", handleAuth, friendsController.cancelInvite);


export default router;
