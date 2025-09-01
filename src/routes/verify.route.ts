import { Router } from "express";
import * as verifyController from "../controllers/verify.controller";

const router = Router();

/**
 * @swagger
 *
 * /api/v1/auth/request-signup:
 *   post:
 *     summary: Sends confirmation e-mail.
 *     tags: [Auth]
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

/**
 * @swagger
 *
 * /api/v1/auth/request-new-pin:
 *   post:
 *     summary: Sends new PIN e-mail.
 *     tags: [Auth]
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
 *    200:
 *         description: New PIN sent
 *       400:
 *         description: Invalid email or provider problem
 *       404:
 *         description: E-mail not registered yet
 *       409:
 *         description: E-mail already verified or old PIN still valid
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/request-new-pin", verifyController.requestNewPin);

/**
 * @swagger
 *
 * /api/v1/auth/request-verify:
 *   post:
 *     summary: Verify registration PIN.
 *     tags: [Auth]
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
 *             pin:
 *               type: string
 *     responses:
 *       200:
 *         description: E-mail verified
 *       400:
 *         description: Invalid email or provider problem
 *       404:
 *         description: E-mail not registered yet
 *       409:
 *         description: E-mail already verified or PIN invalid
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/request-verify", verifyController.confirmPin);
export default router;
