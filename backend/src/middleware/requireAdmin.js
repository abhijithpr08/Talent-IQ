import { ENV } from "../lib/env.js";
import { protectRoute } from "./protectRoute.js";

export const requireAdmin = [
  ...protectRoute,
  (req, res, next) => {
    const clerkId = req.user?.clerkId;
    const adminIds = ENV.ADMIN_CLERK_IDS || [];
    if (!adminIds.length || !adminIds.includes(clerkId)) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  },
];
