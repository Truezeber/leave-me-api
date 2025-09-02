import { Router } from "express";
import * as postsController from "../controllers/posts.controller";
import { handleAuth } from "../middlewares/auth.middleware";
const router = Router();
/**
 * @swagger
 *
 * /api/v1/posts/create:
 *   post:
 *     summary: Creates a post.
 *     tags: [Posts]
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
 *             content:
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

router.post("/create", handleAuth, postsController.sendPost);

/**
 * @swagger
 *
 * /api/v1/posts/delete:
 *   post:
 *     summary: Deletes a post.
 *     tags: [Posts]
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

router.post("/delete", handleAuth, postsController.deletePost);

/**
 * @swagger
 *
 * /api/v1/posts/like:
 *   post:
 *     summary: Likes a post.
 *     tags: [Posts]
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

router.post("/like", handleAuth, postsController.likePost);

/**
 * @swagger
 *
 * /api/v1/posts/unlike:
 *   post:
 *     summary: Unlikes a post.
 *     tags: [Posts]
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

router.post("/unlike", handleAuth, postsController.unlikePost);


export default router;
