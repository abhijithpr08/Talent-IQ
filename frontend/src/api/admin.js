import axiosInstance from "../lib/axios";

export const adminApi = {
  checkAdmin: async () => {
    console.log("adminApi: Checking admin status");
    const response = await axiosInstance.get("/admin/me");
    console.log("adminApi: Admin check result:", response.data.isAdmin);
    return response.data;
  },

  getAllSessions: async () => {
    console.log("adminApi: Fetching all sessions for admin");
    const response = await axiosInstance.get("/admin/sessions");
    console.log("adminApi: Sessions fetched:", response.data.sessions?.length);
    return response.data;
  },

  deleteSession: async (id) => {
    console.log("adminApi: Deleting session ID:", id);
    const response = await axiosInstance.delete(`/admin/sessions/${id}`);
    console.log("adminApi: Session deleted");
    return response.data;
  },
};
