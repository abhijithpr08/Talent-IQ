import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminApi } from "../api/admin";

export function useAdminSessions() {
  return useQuery({
    queryKey: ["adminSessions"],
    queryFn: adminApi.getAllSessions,
  });
}

export function useAdminDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["adminDeleteSession"],
    mutationFn: (id) => adminApi.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSessions"] });
      toast.success("Session deleted");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete session"),
  });
}
