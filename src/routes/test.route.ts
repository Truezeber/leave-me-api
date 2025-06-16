import { Router } from "express";
import * as testController from "../controllers/test.controller";

const router = Router();

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Get test data
 *     description: Retrieve test data from the server
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Test data retrieved successfully
 *               data:
 *                 - id: 1
 *                   name: Test 1
 *                 - id: 2
 *                   name: Test 2
 */

router.get("/", testController.getTest);

export default router;