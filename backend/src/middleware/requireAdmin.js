import { ENV } from "../lib/env.js";
import { protectRoute } from "./protectRoute.js";

export const requireAdmin = [
  ...protectRoute,
  (req, res, next) => {
    console.log("requireAdmin: Checking admin privileges for user:", req.user?.clerkId);
    const clerkId = req.user?.clerkId;
    const adminIds = ENV.ADMIN_CLERK_IDS || [];
    if (!adminIds.length || !adminIds.includes(clerkId)) {
      console.log("requireAdmin: Access denied - not an admin");
      return res.status(403).json({ message: "Admin access required" });
    }
    console.log("requireAdmin: Admin access granted");
    next();
  },
];
