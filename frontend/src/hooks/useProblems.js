import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { problemsApi } from "../api/problems";

export function useProblems() {
  return useQuery({
    queryKey: ["problems"],
    queryFn: problemsApi.getAll,
  });
}

export function useProblemById(id) {
  return useQuery({
    queryKey: ["problem", id],
    queryFn: () => problemsApi.getById(id),
    enabled: !!id,
  });
}

export function useProblemBySlug(slug) {
  return useQuery({
    queryKey: ["problem", "slug", slug],
    queryFn: () => problemsApi.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreateProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createProblem"],
    mutationFn: problemsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      toast.success("Problem created");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to create problem"),
  });
}

export function useUpdateProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateProblem"],
    mutationFn: ({ id, data }) => problemsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      toast.success("Problem updated");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update problem"),
  });
}

export function useDeleteProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteProblem"],
    mutationFn: problemsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      toast.success("Problem deleted");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete problem"),
  });
}
