import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createSession, endSession, getActiveSessions, getMyRecentSessions, getSessionById, joinSession } from "../controllers/sessionControler.js";

const router = express.Router()

router.post("/", protectRoute, createSession)
// Allow public listing of active sessions so users can browse available rooms
router.get("/active", getActiveSessions)
router.get("/my-recent", protectRoute, getMyRecentSessions)

router.get("/:id", protectRoute, getSessionById)
router.post("/:id/join", protectRoute, joinSession)
router.post("/:id/end", protectRoute, endSession)

export default router