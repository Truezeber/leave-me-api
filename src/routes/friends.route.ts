import { Router } from "express";
import * as friendsController from "../controllers/friends.controller";
import { handleAuth } from "../middlewares/auth.middleware";
const router = Router();
/**
 * @swagger
 *
 * /api/v1/friends/invite:
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
 *         description: User is blocked or blocking the target user OR banned requester
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
 * /api/v1/friends/accept:
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
 *       403:
 *         descritpion: Banned requester
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
 * /api/v1/friends/reject:
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
 *       403:
 *         descritpion: Banned requester
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
 * /api/v1/friends/cancel:
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
 *       403:
 *         descritpion: Banned requester
 *       404:
 *         description: Invite not found
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/cancel", handleAuth, friendsController.cancelInvite);

/**
 * @swagger
 *
 * /api/v1/friends/delete:
 *   post:
 *     summary: Delete a friend.
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
 *         description: Friend deleted successfully
 *       403:
 *         descritpion: Banned requester
 *       404:
 *         description: Friend not found
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/delete", handleAuth, friendsController.deleteFriend);

/**
 * @swagger
 *
 * /api/v1/friends/friends-list:
 *   get:
 *     summary: Get friends list.
 *     tags: [Friends]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Friends list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 friends:
 *                   type: array
 *                   items:
 *                     type: string
 *       403:
 *         description: Banned requester
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.get("/friends-list", handleAuth, friendsController.getFriendsList);

/**
 * @swagger
 *
 * /api/v1/friends/invites-sent-list:
 *   get:
 *     summary: Get sent invites list.
 *     tags: [Friends]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Sent invites list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 friends:
 *                   type: array
 *                   items:
 *                     type: string
 *       403:
 *         description: Banned requester
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.get("/invites-sent-list", handleAuth, friendsController.getInvitesSentList);

/**
 * @swagger
 *
 * /api/v1/friends/invites-got-list:
 *   get:
 *     summary: Get got invites list.
 *     tags: [Friends]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Got invites list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 friends:
 *                   type: array
 *                   items:
 *                     type: string
 *       403:
 *         description: Banned requester
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.get("/invites-got-list", handleAuth, friendsController.getInvitesGotList);

export default router;
