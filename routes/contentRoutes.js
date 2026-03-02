import express from "express";
import { getPremiumContent } from "../controllers/contentControllers.js";
import { userAuth, requirePremium } from "../middleware/auth.js";

const contentRoutes = express.Router();

contentRoutes.get("/premium", userAuth, requirePremium, getPremiumContent);

export default contentRoutes;
