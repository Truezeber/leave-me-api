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

/**
 * @swagger
 *
 * /api/v1/posts/load:
 *   get:
 *     summary: Loads posts for a given origin (user profile or post thread).
 *     tags: [Posts]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: origin
 *         schema:
 *           type: string
 *         required: true
 *         description: Origin user ID (leave_me_id) or post ObjectId
 *       - in: query
 *         name: amount
 *         schema:
 *           type: integer
 *         required: true
 *         description: Number of posts to load
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [date, likes]
 *         required: true
 *         description: Sorting method
 *     responses:
 *       200:
 *         description: Posts loaded successfully
 *       400:
 *         description: Invalid request parameters
 *       403:
 *         description: You can access only friends posts
 *       404:
 *         description: Origin not found
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.get("/load", handleAuth, postsController.loadPosts);

export default router;
