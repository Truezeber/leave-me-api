import { Router } from "express";
import * as logoutController from "../controllers/logout.controller";
import { handleAuth } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 *
 * /api/logout:
 *   post:
 *     summary: Logs out the user and clears JWT and refresh token cookies
 *     tags: [Users]
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
 *       500:
 *         description: Internal server error
 */

router.post("/", handleAuth, logoutController.logoutUser);

export default router;
