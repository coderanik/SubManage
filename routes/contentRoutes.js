import express from "express";
import { getPremiumContent } from "../controllers/contentControllers.js";
import { userAuth, requirePremium } from "../middleware/auth.js";

const contentRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Content
 *   description: Premium guarded access endpoints
 */

/**
 * @swagger
 * /content/premium:
 *   get:
 *     summary: Retrieve premium content (Requires Premium Role)
 *     tags: [Content]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       403:
 *         description: Not Premium User
 */
contentRoutes.get("/premium", userAuth, requirePremium, getPremiumContent);

export default contentRoutes;
