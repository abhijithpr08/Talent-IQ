import { Link } from "react-router";
import { useMemo, useState } from "react";
import { useAllProblems } from "../hooks/useAllProblems";
import { ChevronRightIcon, Code2Icon, SearchIcon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import Nav from "../components/Nav";

function ProblemsPage() {
  const { allProblems: problems, isLoading } = useAllProblems();

  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesDifficulty =
        difficultyFilter === "All" || problem.difficulty === difficultyFilter;

      if (!matchesDifficulty) return false;

      if (!search.trim()) return true;

      const haystack = (
        problem.title +
        " " +
        (problem.category || "") +
        " " +
        (problem.description?.text || "")
      ).toLowerCase();

      return haystack.includes(search.toLowerCase());
    });
  }, [problems, search, difficultyFilter]);

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Nav />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* HEADER */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary/80">
              Practice library
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
              Problems built for real interviews
            </h1>
            <p className="mt-2 text-base-content/70">
              Work through curated problems by difficulty, topic, and real company tags.
            </p>
          </div>

          {/* QUICK STATS */}
          <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
            <div className="rounded-xl bg-base-100 px-3 py-2 shadow-sm text-center">
              <div className="font-semibold text-base-content/60">Total</div>
              <div className="text-lg font-bold text-primary">{problems.length}</div>
            </div>
            <div className="rounded-xl bg-base-100 px-3 py-2 shadow-sm text-center">
              <div className="font-semibold text-base-content/60">Easy</div>
              <div className="text-lg font-bold text-success">{easyProblemsCount}</div>
            </div>
            <div className="rounded-xl bg-base-100 px-3 py-2 shadow-sm text-center">
              <div className="font-semibold text-base-content/60">Hard</div>
              <div className="text-lg font-bold text-error">{hardProblemsCount}</div>
            </div>
          </div>
        </header>

        {/* CONTROLS */}
        <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* search */}
          <div className="w-full sm:max-w-md">
            <label className="input input-bordered flex items-center gap-2 bg-base-100/80">
              <SearchIcon className="size-4 text-base-content/60" />
              <input
                type="text"
                className="grow"
                placeholder="Search problems by title, topic, or company"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>

          {/* difficulty filter */}
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
            {["All", "Easy", "Medium", "Hard"].map((diff) => {
              const active = difficultyFilter === diff;
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficultyFilter(diff)}
                  className={
                    "btn btn-xs sm:btn-sm border-base-300 " +
                    (active
                      ? "btn-primary text-primary-content"
                      : "btn-ghost text-base-content/80 hover:text-primary")
                  }
                >
                  {diff}
                </button>
              );
            })}
          </div>
        </section>

        {/* PROBLEMS LIST */}
        <section className="space-y-4">
          {filteredProblems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="card bg-base-100 hover:shadow-lg hover:-translate-y-[1px] transition-all duration-150"
            >
              <div className="card-body">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* LEFT SIDE */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="size-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Code2Icon className="size-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h2 className="text-base sm:text-lg font-semibold">
                            {problem.title}
                          </h2>
                          <span
                            className={`badge badge-sm sm:badge-md ${getDifficultyBadgeClass(
                              problem.difficulty
                            )}`}
                          >
                            {problem.difficulty}
                          </span>
                          {problem.category && (
                            <span className="badge badge-ghost badge-sm sm:badge-md">
                              {problem.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-base-content/60">
                          {problem.description.text}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-2 sm:gap-1 text-primary shrink-0">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-xs sm:text-sm font-medium">Open problem</span>
                      <ChevronRightIcon className="size-4 sm:size-5" />
                    </div>
                    {problem.timeLimit && (
                      <span className="text-[11px] sm:text-xs text-base-content/60">
                        {problem.timeLimit} min
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* STATS FOOTER */}
        <section className="mt-10">
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <div className="stats stats-vertical lg:stats-horizontal">
                <div className="stat">
                  <div className="stat-title">Total Problems</div>
                  <div className="stat-value text-primary">{problems.length}</div>
                </div>

                <div className="stat">
                  <div className="stat-title">Easy</div>
                  <div className="stat-value text-success">{easyProblemsCount}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Medium</div>
                  <div className="stat-value text-warning">{mediumProblemsCount}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Hard</div>
                  <div className="stat-value text-error">{hardProblemsCount}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProblemsPage;