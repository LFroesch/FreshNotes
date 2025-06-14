import express from "express";
import { getMyProfile, updateProfile } from "../controllers/profileController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", protectRoute, getMyProfile);
router.put("/update", protectRoute, updateProfile);

export default router;