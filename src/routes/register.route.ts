import { Router } from "express";
import * as registerController from "../controllers/register.controller";

const router = Router();

/**
 * @swagger
 *
 * /api/register:
 *   post:
 *     summary: Registers new user.
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
 *             password:
 *               type: string
 *             nickname:
 *               type: string
 *             leave_me_id:
 *               type: string
 *             avatar_url:
 *               type: string
 *             tos_accepted:
 *               type: boolean
 *             pp_accepted:
 *               type: boolean
 *     responses:
 *       200:
 *         description: User added successfully
 *       400:
 *         description: Invalid data
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Database error
 */

router.post("/", registerController.postUser);

export default router;
