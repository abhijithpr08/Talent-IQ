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

// Public read endpoints: problems should be viewable by all users
router.get("/", getAllProblems);
router.get("/slug/:slug", getProblemBySlug);
router.get("/:id", getProblemById);

router.post("/", requireAdmin, createProblem);
router.put("/:id", requireAdmin, updateProblem);
router.delete("/:id", requireAdmin, deleteProblem);

export default router;
