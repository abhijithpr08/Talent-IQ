import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createSession, endSession, getActiveSessions, getMyRecentSessions, getSessionById, joinSession } from "../controllers/sessionControler.js";

const router = express.Router()

// Middleware to log session route requests
router.use((req, res, next) => {
  console.log(`Session Route: ${req.method} ${req.originalUrl} - User: ${req.user?.clerkId || 'Unauthenticated'}`);
  next();
});

router.post("/", protectRoute, createSession)
// Require authentication to list only the user's active rooms
router.get("/active", protectRoute, getActiveSessions)
router.get("/my-recent", protectRoute, getMyRecentSessions)

router.get("/:id", protectRoute, getSessionById)
router.post("/:id/join", protectRoute, joinSession)
router.post("/:id/end", protectRoute, endSession)

export default router