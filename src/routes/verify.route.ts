import { Router } from "express";
import * as verifyController from "../controllers/verify.controller";

const router = Router();

/**
 * @swagger
 *
 * /api/v1/auth/request-signup:
 *   post:
 *     summary: Sends confirmation e-mail.
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *     responses:
 *       200:
 *         description: User added successfully
 *       400:
 *         description: Invalid data or email provider problem
 *       409:
 *         description: E-mail taken
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/request-signup", verifyController.requestSignup);

export default router;
