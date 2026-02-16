import { useMemo } from "react";
import { useProblems } from "./useProblems";

export function useAllProblems() {
  const { data: apiData, isLoading } = useProblems();
  const apiProblems = apiData?.problems || [];

  const allProblems = useMemo(() => {
    return apiProblems.map((p) => ({
      id: p.slug || p._id,
      _id: p._id,
      slug: p.slug,
      title: p.title,
      difficulty: p.difficulty,
      category: p.category || "",
      description: p.description || { text: "", notes: [] },
      examples: p.examples || [],
      constraints: p.constraints || [],
      starterCode: p.starterCode || { javascript: "", python: "", java: "" },
      expectedOutput: p.expectedOutput || { javascript: "", python: "", java: "" },
    }));
  }, [apiProblems]);

  return { allProblems, isLoading };
}
