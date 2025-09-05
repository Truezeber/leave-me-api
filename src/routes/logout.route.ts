import { Router } from "express";
import * as logoutController from "../controllers/logout.controller";
import { handleAuth } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 *
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logs out the user and clears JWT and refresh token cookies
 *     tags: [Auth]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: access_token=; Max-Age=0; HttpOnly; Secure; refresh_token=; Max-Age=0; HttpOnly; Secure
 *             description: Clears the JWT access_token and refresh_token cookies
 *       401:
 *         description: Unauthorized, invalid or missing access_token
 *       403:
 *         descritpion: Banned requester
 *       500:
 *         description: Internal server error
 */

router.post("/logout", handleAuth, logoutController.logoutUser);

export default router;
