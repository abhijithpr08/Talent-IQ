import axiosInstance from "../lib/axios";

export const adminApi = {
  checkAdmin: async () => {
    const response = await axiosInstance.get("/admin/me");
    return response.data;
  },

  getAllSessions: async () => {
    const response = await axiosInstance.get("/admin/sessions");
    return response.data;
  },

  deleteSession: async (id) => {
    const response = await axiosInstance.delete(`/admin/sessions/${id}`);
    return response.data;
  },
};
