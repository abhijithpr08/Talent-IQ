import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { adminApi } from "../api/admin";

export function useIsAdmin() {
  const { isSignedIn } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["adminCheck"],
    queryFn: adminApi.checkAdmin,
    enabled: !!isSignedIn,
    retry: 1,
    staleTime: 60_000,
  });
  return { isAdmin: !!data?.isAdmin, isLoading };
}
