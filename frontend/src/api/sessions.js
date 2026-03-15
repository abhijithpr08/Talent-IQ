import axiosInstance from "../lib/axios";

export const sessionApi = {
  createSession: async (data) => {
    console.log("sessionApi: Creating session with data:", data);
    const response = await axiosInstance.post("/sessions", data);
    console.log("sessionApi: Session created:", response.data);
    return response.data;
  },

  getActiveSessions: async () => {
    console.log("sessionApi: Fetching active sessions");
    const response = await axiosInstance.get("/sessions/active");
    console.log("sessionApi: Active sessions fetched:", response.data.sessions?.length);
    return response.data;
  },
  getMyRecentSessions: async () => {
    console.log("sessionApi: Fetching my recent sessions");
    const response = await axiosInstance.get("/sessions/my-recent");
    console.log("sessionApi: Recent sessions fetched:", response.data.sessions?.length);
    return response.data;
  },

  getSessionById: async (id) => {
    console.log("sessionApi: Fetching session by ID:", id);
    const response = await axiosInstance.get(`/sessions/${id}`);
    console.log("sessionApi: Session fetched");
    return response.data;
  },

  joinSession: async (id) => {
    console.log("sessionApi: Joining session:", id);
    const response = await axiosInstance.post(`/sessions/${id}/join`);
    console.log("sessionApi: Joined session successfully");
    return response.data;
  },
  endSession: async (id) => {
    console.log("sessionApi: Ending session:", id);
    const response = await axiosInstance.post(`/sessions/${id}/end`);
    console.log("sessionApi: Session ended successfully");
    return response.data;
  },
  getStreamToken: async () => {
    console.log("sessionApi: Fetching Stream token");
    const response = await axiosInstance.get(`/chat/token`);
    console.log("sessionApi: Stream token fetched");
    return response.data;
  },
};