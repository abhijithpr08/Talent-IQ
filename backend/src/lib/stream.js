import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js";

console.log("Stream: Initializing Stream clients");

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream: STREAM_API_KEY or STREAM_API_SECRET is missing");
}

console.log("Stream: Creating chat and video clients");
export const chatClient = StreamChat.getInstance(apiKey,apiSecret);
export const streamClient =new StreamClient(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  console.log("Stream: Upserting user:", userData.id);
  try {
    await chatClient.upsertUser(userData);
    console.log("Stream: User upserted successfully");
  } catch (error) {
    console.log("Stream: Error upserting user:", error.message);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("Stream user deleted successfully:", userId);
  } catch (error) {
    console.error("Error deleting the Stream user:", error);
  }
};
