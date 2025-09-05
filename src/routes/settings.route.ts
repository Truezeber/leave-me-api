import { Router } from "express";
import * as settingsController from "../controllers/settings.controller"
import { handleAuth } from "../middlewares/auth.middleware";
const router = Router();
/**
 * @swagger
 *
 * /api/v1/settings/change-avatar:
 *   post:
 *     summary: Changes avatar url.
 *     tags: [Settings]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             avatar_url:
 *               type: string
 *     responses:
 *       200:
 *         description: Avatar changed succesfully
 *       400:
 *         description: Invalid avatar URL
 *       401:
 *         description: Unauthorized
 *       403:
 *         descritpion: Banned requester
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/change-avatar", handleAuth, settingsController.changeAvatar);

/**
 * @swagger
 *
 * /api/v1/settings/change-background:
 *   post:
 *     summary: Changes background url.
 *     tags: [Settings]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             background_url:
 *               type: string
 *     responses:
 *       200:
 *         description: Background changed succesfully
 *       400:
 *         description: Invalid background URL
 *       401:
 *         description: Unauthorized
 *       403:
 *         descritpion: Banned requester
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/change-background", handleAuth, settingsController.changeBackground);


/**
 * @swagger
 *
 * /api/v1/settings/change-nickname:
 *   post:
 *     summary: Changes nickname.
 *     tags: [Settings]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             nickname:
 *               type: string
 *     responses:
 *       200:
 *         description: Nickname changed succesfully
 *       400:
 *         description: Invalid nickname
 *       401:
 *         description: Unauthorized
 *       403:
 *         descritpion: Banned requester
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/change-nickname", handleAuth, settingsController.changeNickname);

/**
 * @swagger
 *
 * /api/v1/settings/change-status:
 *   post:
 *     summary: Changes status.
 *     tags: [Settings]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *     responses:
 *       200:
 *         description: Status changed succesfully
 *       400:
 *         description: Status too long
 *       401:
 *         description: Unauthorized
 *       403:
 *         descritpion: Banned requester
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/change-status", handleAuth, settingsController.changeStatus);


/**
 * @swagger
 *
 * /api/v1/settings/change-password:
 *   post:
 *     summary: Changes password.
 *     tags: [Settings]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             password:
 *               type: string
 *             new_password:
 *               type: string
 *     responses:
 *       200:
 *         description: Password changed succesfully
 *       400:
 *         description: Invalid password
 *       401:
 *         description: Unauthorized or wrong credentials
 *       403:
 *         descritpion: Banned requester
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/change-password", handleAuth, settingsController.changePassword);


export default router;
