import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";
import Problem from "../models/Problem.js";

export async function createSession(req, res) {
  console.log("createSession: Starting session creation");
  console.log("createSession: Request body:", req.body);
  console.log("createSession: User ID:", req.user._id, "Clerk ID:", req.user.clerkId);
  try {
    const { problems } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problems || !Array.isArray(problems) || problems.length === 0 || problems.length > 5) {
      return res.status(400).json({ message: "Problems array is required, must have 1-5 problems" });
    }

    const sessionProblems = [];

    // generate a unique call id for stream video
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    console.log("createSession: Generated call ID:", callId);

    // create session in db first (needed for custom problem sessionId)
    console.log("createSession: Creating session in database");
    const session = await Session.create({
      problems: [], // will populate after
      host: userId,
      callId,
    });
    console.log("createSession: Session created with ID:", session._id);

    for (const prob of problems) {
      const { problem, difficulty, customProblem } = prob;
      let problemTitle = problem;
      let problemId = null;

      if (customProblem) {
        console.log("createSession: Custom problem detected");
        if (!customProblem.title || !customProblem.description?.text) {
          console.log("createSession: Custom problem validation failed");
          return res.status(400).json({ message: "Custom problem requires title and description" });
        }
        problemTitle = customProblem.title;
      } else if (!problem || !difficulty) {
        console.log("createSession: Standard problem validation failed");
        return res.status(400).json({ message: "Problem and difficulty are required" });
      }

      const normalizedDifficulty = difficulty || customProblem?.difficulty || "Easy";
      const finalDifficulty = normalizedDifficulty.toLowerCase();
      console.log("createSession: Normalized difficulty:", finalDifficulty);

      if (customProblem) {
        console.log("createSession: Creating custom problem");
        const problemDoc = await Problem.create({
          title: customProblem.title,
          difficulty: customProblem.difficulty || "Easy",
          category: customProblem.category || "",
          description: {
            text: customProblem.description?.text || "",
            notes: customProblem.description?.notes || [],
          },
          examples: customProblem.examples || [],
          constraints: customProblem.constraints || [],
          starterCode: customProblem.starterCode || {
            javascript: "",
            python: "",
            java: "",
          },
          expectedOutput: customProblem.expectedOutput || {
            javascript: "",
            python: "",
            java: "",
          },
          sessionId: session._id,
        });
        problemId = problemDoc._id;
        console.log("createSession: Custom problem created with ID:", problemId);
      }

      sessionProblems.push({
        title: problemTitle,
        problemId,
        difficulty: finalDifficulty,
      });
    }

    session.problems = sessionProblems;
    await session.save();

    // Use the first problem for stream call name
    const firstProblem = sessionProblems[0];

    // create stream video call
    console.log("createSession: Creating Stream video call");
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: { problems: sessionProblems.map(p => p.title), sessionId: session._id.toString() },
      },
    });
    console.log("createSession: Stream video call created");

    // chat messaging
    console.log("createSession: Creating Stream chat channel");
    const channel = chatClient.channel("messaging", callId, {
      name: `${firstProblem.title} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();
    console.log("createSession: Stream chat channel created");

    console.log("createSession: Session creation successful, responding with session data");
    res.status(201).json({ session });
  } catch (error) {
    console.log("createSession: Error occurred:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getActiveSessions(req, res) {
  console.log("getActiveSessions: Fetching active sessions for user:", req.user._id);
  try {
    const userId = req.user._id;
    const sessions = await Session.find({ status: "active", host: userId })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);
    console.log("getActiveSessions: Found", sessions.length, "active sessions matching filter");
    res.status(200).json({ sessions });
  } catch (error) {
    console.log("getActiveSessions: Error occurred:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req, res) {
  console.log("getMyRecentSessions: Fetching recent sessions for user:", req.user._id);
  try {
    const userId = req.user._id;

    // get sessions where user is either host or participant
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);
    console.log("getMyRecentSessions: Found", sessions.length, "recent sessions");
    res.status(200).json({ sessions });
  } catch (error) {
    console.log("getMyRecentSessions: Error occurred:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  console.log("getSessionById: Fetching session by ID:", req.params.id);
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId")
      .populate("problems.problemId");

    if (!session) {
      console.log("getSessionById: Session not found");
      return res.status(404).json({ message: "Session not found" });
    }
    console.log("getSessionById: Session found");
    res.status(200).json({ session });
  } catch (error) {
    console.log("getSessionById: Error occurred:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  console.log("joinSession: User", req.user._id, "attempting to join session", req.params.id);
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if (!session) {
      console.log("joinSession: Session not found");
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "active") {
      console.log("joinSession: Session is not active");
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    if (session.host.toString() === userId.toString()) {
      console.log("joinSession: Host cannot join own session");
      return res.status(400).json({ message: "Host cannot join their own session as participant" });
    }

    // check if session is already full - has a participant
    if (session.participant) {
      console.log("joinSession: Session is full");
      return res.status(409).json({ message: "Session is full" });
    }

    session.participant = userId;
    await session.save();
    console.log("joinSession: User added as participant");

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);
    console.log("joinSession: User added to chat channel");

    console.log("joinSession: Join successful");
    res.status(200).json({ session });
  } catch (error) {
    console.log("joinSession: Error occurred:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function endSession(req, res) {
  console.log("endSession: User", req.user._id, "attempting to end session", req.params.id);
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) {
      console.log("endSession: Session not found");
      return res.status(404).json({ message: "Session not found" });
    }

    // check if user is the host
    if (session.host.toString() !== userId.toString()) {
      console.log("endSession: User is not the host");
      return res.status(403).json({ message: "Only the host can end the session" });
    }

    // check if session is already completed
    if (session.status === "completed") {
      console.log("endSession: Session already completed");
      return res.status(400).json({ message: "Session is already completed" });
    }

    // delete stream video call
    console.log("endSession: Deleting Stream video call");
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    // delete stream chat channel
    console.log("endSession: Deleting Stream chat channel");
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    // delete custom problem linked to this session (expires when room is deleted)
    if (session.problemId) {
      console.log("endSession: Deleting custom problem");
      await Problem.findByIdAndDelete(session.problemId);
    }

    session.status = "completed";
    await session.save();
    console.log("endSession: Session status updated to completed");

    console.log("endSession: Session ended successfully");
    res.status(200).json({ session, message: "Session ended successfully" });
  } catch (error) {
    console.log("endSession: Error occurred:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}