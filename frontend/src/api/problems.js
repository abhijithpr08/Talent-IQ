import axiosInstance from "../lib/axios";

export const problemsApi = {
  getAll: async () => {
    const response = await axiosInstance.get("/problems");
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/problems/${id}`);
    return response.data;
  },

  getBySlug: async (slug) => {
    const response = await axiosInstance.get(`/problems/slug/${slug}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post("/problems", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/problems/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/problems/${id}`);
    return response.data;
  },
};
