import { Router } from "express";
import * as userController from "../controllers/user.controller";

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Gets all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 */
router.get("/", userController.getAllUsers);

export default router;