import axiosInstance from "../lib/axios";

export const problemsApi = {
  getAll: async () => {
    console.log("problemsApi: Fetching all problems");
    const response = await axiosInstance.get("/problems");
    console.log("problemsApi: Problems fetched:", response.data.problems?.length);
    return response.data;
  },

  getById: async (id) => {
    console.log("problemsApi: Fetching problem by ID:", id);
    const response = await axiosInstance.get(`/problems/${id}`);
    console.log("problemsApi: Problem fetched");
    return response.data;
  },

  getBySlug: async (slug) => {
    console.log("problemsApi: Fetching problem by slug:", slug);
    const response = await axiosInstance.get(`/problems/slug/${slug}`);
    console.log("problemsApi: Problem fetched");
    return response.data;
  },

  create: async (data) => {
    console.log("problemsApi: Creating problem:", data.title);
    const response = await axiosInstance.post("/problems", data);
    console.log("problemsApi: Problem created");
    return response.data;
  },

  update: async (id, data) => {
    console.log("problemsApi: Updating problem ID:", id);
    const response = await axiosInstance.put(`/problems/${id}`, data);
    console.log("problemsApi: Problem updated");
    return response.data;
  },

  delete: async (id) => {
    console.log("problemsApi: Deleting problem ID:", id);
    const response = await axiosInstance.delete(`/problems/${id}`);
    console.log("problemsApi: Problem deleted");
    return response.data;
  },
};
