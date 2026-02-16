import { ENV } from "../lib/env.js";
import Session from "../models/Session.js";
import Problem from "../models/Problem.js";
import { chatClient, streamClient } from "../lib/stream.js";

export async function checkAdmin(req, res) {
  try {
    const clerkId = (req.user?.clerkId || "").trim();
    const adminIds = (ENV.ADMIN_CLERK_IDS || []).map((id) => String(id).trim());
    const isAdmin = adminIds.length > 0 && clerkId && adminIds.includes(clerkId);
    res.status(200).json({ isAdmin });
  } catch (error) {
    res.status(500).json({ isAdmin: false });
  }
}

export async function getAllSessions(req, res) {
  try {
    const sessions = await Session.find()
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error in getAllSessions:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteSession(req, res) {
  try {
    const { id } = req.params;
    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status === "active") {
      try {
        const call = streamClient.video.call("default", session.callId);
        await call.delete({ hard: true });
      } catch (e) {
        console.warn("Stream call delete:", e.message);
      }
      try {
        const channel = chatClient.channel("messaging", session.callId);
        await channel.delete();
      } catch (e) {
        console.warn("Stream channel delete:", e.message);
      }
    }

    if (session.problemId) {
      await Problem.findByIdAndDelete(session.problemId);
    }

    await Session.findByIdAndDelete(id);
    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Error in deleteSession:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
