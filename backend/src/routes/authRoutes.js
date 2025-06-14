// backend/src/routes/authRoutes.js
import express from 'express';
import { authCheck, login, logout, signup } from '../controllers/authController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get("/auth-check", protectRoute, authCheck);

export default router;