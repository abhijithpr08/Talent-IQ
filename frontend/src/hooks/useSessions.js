import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sessionApi } from "../api/sessions";

export const useCreateSession = () => {
  console.log("useCreateSession: Hook initialized");
  const result = useMutation({
    mutationKey: ["createSession"],
    mutationFn: sessionApi.createSession,
    // Let the caller handle UI notifications to avoid duplicate toasts
    retry: 0,
    onSuccess: (data) => console.log("useCreateSession: Session created successfully"),
    onError: (error) => {
      console.log("useCreateSession: Error creating session:", error.message);
      toast.error(error.response?.data?.message || "Failed to create room");
    },
  });

  return result;
};

export const useActiveSessions = () => {
  console.log("useActiveSessions: Hook initialized");
  const result = useQuery({
    queryKey: ["activeSessions"],
    queryFn: sessionApi.getActiveSessions,
    onSuccess: (data) => console.log("useActiveSessions: Active sessions loaded:", data.sessions?.length),
    onError: (error) => console.log("useActiveSessions: Error loading active sessions:", error.message),
  });

  return result;
};

export const useMyRecentSessions = () => {
  console.log("useMyRecentSessions: Hook initialized");
  const result = useQuery({
    queryKey: ["myRecentSessions"],
    queryFn: sessionApi.getMyRecentSessions,
    onSuccess: (data) => console.log("useMyRecentSessions: Recent sessions loaded:", data.sessions?.length),
    onError: (error) => console.log("useMyRecentSessions: Error loading recent sessions:", error.message),
  });

  return result;
};

export const useSessionById = (id) => {
  console.log("useSessionById: Hook initialized for session:", id);
  const result = useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionApi.getSessionById(id),
    enabled: !!id,
    refetchInterval: 5000, // refetch every 5 seconds to detect session status changes
    onSuccess: (data) => console.log("useSessionById: Session data loaded"),
    onError: (error) => console.log("useSessionById: Error loading session:", error.message),
  });

  return result;
};

export const useJoinSession = () => {
  console.log("useJoinSession: Hook initialized");
  const result = useMutation({
    mutationKey: ["joinSession"],
    mutationFn: sessionApi.joinSession,
    onSuccess: () => {
      console.log("useJoinSession: Session joined successfully");
      toast.success("Joined session successfully!");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to join session"),
  });

  return result;
};

export const useEndSession = () => {
  console.log("useEndSession: Hook initialized");
  const result = useMutation({
    mutationKey: ["endSession"],
    mutationFn: sessionApi.endSession,
    onSuccess: () => {
      console.log("useEndSession: Session ended successfully");
      toast.success("Session ended successfully!");
    },
    onError: (error) => {
      console.log("useEndSession: Error ending session:", error.message);
      toast.error(error.response?.data?.message || "Failed to end session");
    },
  });

  return result;
};