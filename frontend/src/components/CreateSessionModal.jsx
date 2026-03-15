import { useState } from "react";
import { Code2Icon, LoaderIcon, PlusIcon, PenSquareIcon } from "lucide-react";
import { useAllProblems } from "../hooks/useAllProblems";
import { getDifficultyBadgeClass } from "../lib/utils";
import CreateProblemModal from "./CreateProblemModal";

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
  const [showCreateProblem, setShowCreateProblem] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const { allProblems: problems } = useAllProblems();

  if (!isOpen) return null;

  const addProblem = () => {
    if (roomConfig.selectedProblems.length >= 5) return;
    setRoomConfig({
      ...roomConfig,
      selectedProblems: [...roomConfig.selectedProblems, { problem: "", difficulty: "", customProblem: null }],
    });
  };

  const removeProblem = (index) => {
    const newProblems = roomConfig.selectedProblems.filter((_, i) => i !== index);
    setRoomConfig({
      ...roomConfig,
      selectedProblems: newProblems,
    });
  };

  const updateProblem = (index, updates) => {
    const newProblems = [...roomConfig.selectedProblems];
    newProblems[index] = { ...newProblems[index], ...updates };
    setRoomConfig({
      ...roomConfig,
      selectedProblems: newProblems,
    });
  };

  const handleCustomProblemCreated = (customProblem) => {
    if (editingIndex !== null) {
      updateProblem(editingIndex, {
        problem: customProblem.title,
        difficulty: customProblem.difficulty?.toLowerCase() || "easy",
        customProblem,
      });
    } else {
      // Add new
      setRoomConfig({
        ...roomConfig,
        selectedProblems: [...roomConfig.selectedProblems, {
          problem: customProblem.title,
          difficulty: customProblem.difficulty?.toLowerCase() || "easy",
          customProblem,
        }],
      });
    }
    setShowCreateProblem(false);
    setEditingIndex(null);
  };

  const hasValidProblems = roomConfig.selectedProblems.length > 0 && roomConfig.selectedProblems.every(p => p.problem || p.customProblem);

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
          {/* PROBLEMS SELECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="label px-0">
                <span className="label-text font-semibold">Select problems ({roomConfig.selectedProblems.length}/5)</span>
                <span className="label-text-alt text-error text-xs">Required</span>
              </label>
              <button
                type="button"
                className="btn btn-outline btn-primary btn-sm gap-2"
                onClick={addProblem}
                disabled={roomConfig.selectedProblems.length >= 5}
              >
                <PlusIcon className="size-4" />
                Add Problem
              </button>
            </div>

            {roomConfig.selectedProblems.map((prob, index) => {
              const selectedProblem = prob.customProblem
                ? prob.customProblem
                : prob.problem && problems.find((p) => p.title === prob.problem);

              return (
                <div key={index} className="border border-base-300 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Problem {index + 1}</span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm text-error"
                      onClick={() => removeProblem(index)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <select
                      className="select flex-1"
                      value={prob.customProblem ? "__custom__" : prob.problem}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "__custom__") return;
                        const problemFromList = problems.find((p) => p.title === val);
                        updateProblem(index, {
                          difficulty: problemFromList?.difficulty?.toLowerCase(),
                          problem: val,
                          customProblem: null,
                        });
                      }}
                    >
                      <option value="" disabled>
                        Choose a coding problem...
                      </option>
                      {prob.customProblem && (
                        <option value="__custom__">{prob.customProblem.title} (Custom)</option>
                      )}
                      {problems.map((problem) => (
                        <option key={problem.id} value={problem.title}>
                          {problem.title} ({problem.difficulty})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-outline btn-primary shrink-0 gap-2"
                      onClick={() => {
                        setEditingIndex(index);
                        setShowCreateProblem(true);
                      }}
                      title="Create custom problem"
                    >
                      <PenSquareIcon className="size-4" />
                      Create
                    </button>
                  </div>

                  {selectedProblem && (
                    <div className="text-sm">
                      <p className="text-base-content/80">
                        Selected: <span className="font-medium">{prob.customProblem?.title || prob.problem}</span>
                        {prob.customProblem && <span className="badge badge-sm badge-info ml-2">Custom</span>}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.selectedProblems.length > 0 && (
            <div className="rounded-xl border border-base-300 bg-base-200/70 p-4">
              <p className="text-xs font-semibold tracking-wide text-base-content/60 uppercase mb-2">
                Session summary
              </p>
              <p className="font-medium text-base-content">
                Problems: <span className="font-semibold">{roomConfig.selectedProblems.length}</span>
              </p>
              <p className="text-base-content/80">
                Max participants: <span className="font-medium">2 (1-on-1 session)</span>
              </p>
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
            disabled={isCreating || !hasValidProblems}
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

      <CreateProblemModal
        isOpen={showCreateProblem}
        onClose={() => setShowCreateProblem(false)}
        onCreated={handleCustomProblemCreated}
      />
    </div>
  );
}
export default CreateSessionModal;