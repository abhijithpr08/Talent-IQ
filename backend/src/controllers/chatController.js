import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  console.log("getStreamToken: Generating Stream token for user:", req.user.clerkId);
  try {
    // create a Stream token for the current authenticated user
    const token = chatClient.createToken(req.user.clerkId);
    console.log("getStreamToken: Token generated successfully");
    res.status(200).json({
      token,
      userId: req.user.clerkId,
      userName: req.user.name,
      userImage: req.user.profileImage,
    });
  } catch (error) {
    console.log("getStreamToken: Error occurred:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}