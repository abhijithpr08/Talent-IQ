import express from 'express'
import { getStreamToken } from '../controllers/chatController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// Middleware to log chat route requests
router.use((req, res, next) => {
  console.log(`Chat Route: ${req.method} ${req.originalUrl} - User: ${req.user?.clerkId || 'Unauthenticated'}`);
  next();
});

router.get("/token",protectRoute,getStreamToken);

export default router