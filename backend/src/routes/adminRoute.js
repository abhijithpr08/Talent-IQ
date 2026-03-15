import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { checkAdmin, getAllSessions, deleteSession } from "../controllers/adminController.js";

const router = express.Router();

// Middleware to log admin route requests
router.use((req, res, next) => {
  console.log(`Admin Route: ${req.method} ${req.originalUrl} - User: ${req.user?.clerkId || 'Unauthenticated'}`);
  next();
});

router.get("/me", protectRoute, checkAdmin);
router.get("/sessions", requireAdmin, getAllSessions);
router.delete("/sessions/:id", requireAdmin, deleteSession);

export default router;
