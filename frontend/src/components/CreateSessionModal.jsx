import { Code2Icon, LoaderIcon, PlusIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";
import { getDifficultyBadgeClass } from "../lib/utils";

function getEstimatedTime(difficulty) {
  const normalized = difficulty?.toLowerCase();
  if (normalized === "easy") return "15–20 minutes";
  if (normalized === "medium") return "30–45 minutes";
  if (normalized === "hard") return "60–75 minutes";
  return "Varies by candidate";
}

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);

  if (!isOpen) return null;

  const selectedProblem =
    roomConfig.problem && problems.find((p) => p.title === roomConfig.problem);

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-base-300 bg-base-100">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-base-content/60">
                New interview room
              </p>
              <h3 className="font-black text-2xl mt-1">Create session</h3>
            </div>

            <div className="p-2 rounded-xl bg-linear-to-br from-primary to-secondary">
              <Code2Icon className="size-5 text-white" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6 bg-base-100">
          {/* PROBLEM SELECTION */}
          <div className="space-y-2">
            <label className="label px-0">
              <span className="label-text font-semibold">Select problem</span>
              <span className="label-text-alt text-error text-xs">Required</span>
            </label>

            <select
              className="select w-full"
              value={roomConfig.problem}
              onChange={(e) => {
                const problemFromList = problems.find((p) => p.title === e.target.value);
                setRoomConfig({
                  difficulty: problemFromList?.difficulty,
                  problem: e.target.value,
                });
              }}
            >
              <option value="" disabled>
                Choose a coding problem...
              </option>

              {problems.map((problem) => (
                <option key={problem.id} value={problem.title}>
                  {problem.title} ({problem.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.problem && selectedProblem && (
            <div className="rounded-xl border border-base-300 bg-base-200/70 p-4 flex gap-4 items-start">
              <div className="mt-1 hidden sm:block">
                <span
                  className={`badge badge-sm ${getDifficultyBadgeClass(
                    selectedProblem.difficulty
                  )}`}
                >
                  {selectedProblem.difficulty}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-xs font-semibold tracking-wide text-base-content/60 uppercase">
                  Session summary
                </p>
                <p className="font-medium text-base-content">
                  Problem: <span className="font-semibold">{roomConfig.problem}</span>
                </p>
                <p className="text-base-content/80">
                  Difficulty:{" "}
                  <span className="font-medium">{selectedProblem.difficulty}</span>
                </p>
                <p className="text-base-content/80">
                  Max participants:{" "}
                  <span className="font-medium">2 (1-on-1 session)</span>
                </p>
                <p className="text-xs text-base-content/60">
                  Estimated interview time:{" "}
                  <span className="font-semibold">{getEstimatedTime(selectedProblem.difficulty)}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-base-300 bg-base-100 flex items-center justify-between">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary gap-2"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <PlusIcon className="size-5" />
            )}

            {isCreating ? "Creating..." : "Create session"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
export default CreateSessionModal;