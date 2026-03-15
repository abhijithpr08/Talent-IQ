import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  getAllProblems,
  getProblemById,
  getProblemBySlug,
  createProblem,
  updateProblem,
  deleteProblem,
} from "../controllers/problemController.js";

const router = express.Router();

// Middleware to log problem route requests
router.use((req, res, next) => {
  console.log(`Problem Route: ${req.method} ${req.originalUrl} - User: ${req.user?.clerkId || 'Unauthenticated'}`);
  next();
});

// Public read endpoints: problems should be viewable by all users
router.get("/", getAllProblems);
router.get("/slug/:slug", getProblemBySlug);
router.get("/:id", getProblemById);

router.post("/", requireAdmin, createProblem);
router.put("/:id", requireAdmin, updateProblem);
router.delete("/:id", requireAdmin, deleteProblem);

export default router;
