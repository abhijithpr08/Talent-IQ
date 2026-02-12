import { Lightbulb, ListChecks, TerminalSquare } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems }) {
  const totalExamples = problem.examples?.length || 0;
  const totalConstraints = problem.constraints?.length || 0;

  return (
    <div className="h-full overflow-y-auto bg-base-200/80">
      {/* HEADER SECTION */}
      <div className="bg-base-100 border-b border-base-300">
        <div className="max-w-5xl mx-auto px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-base-200 px-3 py-1 text-xs font-medium text-base-content/70">
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary/10">
                  <TerminalSquare className="size-3 text-primary" />
                </span>
                Problem details
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-base-content leading-tight">
                {problem.title}
              </h1>
              <p className="text-sm text-base-content/70">{problem.category}</p>
            </div>

            <span className={`badge badge-lg ${getDifficultyBadgeClass(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
          </div>

          {/* Quick stats + selector */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-2">
            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-base-200 px-3 py-1">
                <Lightbulb className="size-3 text-secondary" />
                <span className="font-medium">
                  {totalExamples} example{totalExamples === 1 ? "" : "s"}
                </span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-base-200 px-3 py-1">
                <ListChecks className="size-3 text-accent" />
                <span className="font-medium">
                  {totalConstraints} constraint{totalConstraints === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            {/* Problem selector */}
            <div className="w-full sm:w-64">
              <select
                className="select select-sm w-full"
                value={currentProblemId}
                onChange={(e) => onProblemChange(e.target.value)}
              >
                {allProblems.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} - {p.difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {/* PROBLEM DESC */}
        <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
          <h2 className="text-xl font-bold text-base-content">Description</h2>

          <div className="space-y-3 text-base leading-relaxed">
            <p className="text-base-content/90">{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p key={idx} className="text-base-content/90">
                {note}
              </p>
            ))}
          </div>
        </div>

        {/* EXAMPLES SECTION */}
        <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
          <h2 className="text-xl font-bold mb-4 text-base-content">Examples</h2>
          <div className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-sm">{idx + 1}</span>
                  <p className="font-semibold text-base-content">Example {idx + 1}</p>
                </div>
                <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
                  <div className="flex gap-2">
                    <span className="text-primary font-bold min-w-[70px]">Input:</span>
                    <span>{example.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-secondary font-bold min-w-[70px]">Output:</span>
                    <span>{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="pt-2 border-t border-base-300 mt-2">
                      <span className="text-base-content/60 font-sans text-xs">
                        <span className="font-semibold">Explanation:</span> {example.explanation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONSTRAINTS */}
        <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
          <h2 className="text-xl font-bold mb-4 text-base-content">Constraints</h2>
          <ul className="space-y-2 text-base-content/90">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-primary">•</span>
                <code className="text-sm">{constraint}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;