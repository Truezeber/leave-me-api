import { Router } from "express";
import * as loginController from "../controllers/login.controller";

const router = Router();

/**
 * @swagger
 *
 * /api/login:
 *   post:
 *     summary: adds new user to database.
 *     tags: [Users]
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
 *         description: kod 200
 *       400:
 *         description: kod 400
 *       500:
 *         description: Internal server error
 */

router.post("/", loginController.loginUser);

export default router;
