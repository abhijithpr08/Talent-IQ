import { ENV } from "../lib/env.js";
import Session from "../models/Session.js";
import Problem from "../models/Problem.js";
import { chatClient, streamClient } from "../lib/stream.js";

export async function checkAdmin(req, res) {
  console.log("checkAdmin: Checking admin status for user:", req.user?.clerkId);
  try {
    const clerkId = (req.user?.clerkId || "").trim();
    const adminIds = (ENV.ADMIN_CLERK_IDS || []).map((id) => String(id).trim());
    const isAdmin = adminIds.length > 0 && clerkId && adminIds.includes(clerkId);
    console.log("checkAdmin: Is admin:", isAdmin);
    res.status(200).json({ isAdmin });
  } catch (error) {
    console.log("checkAdmin: Error occurred:", error.message);
    res.status(500).json({ isAdmin: false });
  }
}

export async function getAllSessions(req, res) {
  console.log("getAllSessions: Fetching all sessions for admin");
  try {
    const sessions = await Session.find()
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(100);
    console.log("getAllSessions: Found", sessions.length, "sessions");
    res.status(200).json({ sessions });
  } catch (error) {
    console.log("getAllSessions: Error occurred:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteSession(req, res) {
  console.log("deleteSession: Admin deleting session ID:", req.params.id);
  try {
    const { id } = req.params;
    const session = await Session.findById(id);
    if (!session) {
      console.log("deleteSession: Session not found");
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status === "active") {
      console.log("deleteSession: Deleting active session resources");
      try {
        const call = streamClient.video.call("default", session.callId);
        await call.delete({ hard: true });
        console.log("deleteSession: Stream call deleted");
      } catch (e) {
        console.log("deleteSession: Stream call delete error:", e.message);
      }
      try {
        const channel = chatClient.channel("messaging", session.callId);
        await channel.delete();
        console.log("deleteSession: Stream channel deleted");
      } catch (e) {
        console.log("deleteSession: Stream channel delete error:", e.message);
      }
    }

    if (session.problemId) {
      console.log("deleteSession: Deleting associated problem");
      await Problem.findByIdAndDelete(session.problemId);
    }

    await Session.findByIdAndDelete(id);
    console.log("deleteSession: Session deleted successfully");
    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    console.log("deleteSession: Error occurred:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
