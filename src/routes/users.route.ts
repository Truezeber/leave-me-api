import { Router } from "express";
import * as usersController from "../controllers/users.controller";
import { handleAuthNoBan } from "../middlewares/auth.middleware";
const router = Router();

/**
 * @swagger
 *
 * /api/v1/users/get-user:
 *   get:
 *     summary: Loads user profile info.
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: target
 *         schema:
 *           type: string
 *         required: true
 *         description: Target leave me id
 *     responses:
 *       200:
 *         description: User loaded successfully
 *       400:
 *         description: Invalid request parameters
 *       403:
 *         descritpion: Banned requester
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.get("/get-user", handleAuthNoBan, usersController.getUser);

export default router;
