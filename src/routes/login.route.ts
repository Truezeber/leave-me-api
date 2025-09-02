import { Router } from "express";
import * as loginController from "../controllers/login.controller";

const router = Router();

/**
 * @swagger
 *
 * /api/v1/auth/login:
 *   post:
 *     summary: Logs existing user in.
 *     tags: [Auth]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             leave_me_id:
 *               type: string
 *             password:
 *               type: string
 *             remember_me:
 *               type: boolean
 *     responses:
 *       200:
 *         description: User loged successfully
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/login", loginController.loginUser);

export default router;
