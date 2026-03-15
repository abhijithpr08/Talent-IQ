import { useState } from "react";
import { PlusIcon, Trash2Icon, ShareIcon, CopyIcon, MessageCircleIcon } from "lucide-react";
import { PROBLEM_TEMPLATE } from "../data/problemTemplate";
import toast from "react-hot-toast";

function CreateProblemModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(PROBLEM_TEMPLATE)));

  if (!isOpen) return null;

  const resetForm = () => {
    setForm(JSON.parse(JSON.stringify(PROBLEM_TEMPLATE)));
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const shareViaWhatsApp = () => {
    const url = window.location.href;
    const text = `Check out this coding problem: ${form.title || 'New Problem'}\n${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const shareLink = async () => {
    const url = window.location.href;
    const title = `Check out this coding problem: ${form.title || 'New Problem'}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      copyLink();
    }
  };

  const update = (path, value) => {
    setForm((prev) => {
      const next = { ...prev };
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!obj[k] || typeof obj[k] !== "object") obj[k] = Array.isArray(obj) ? [] : {};
        obj = obj[k];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const addExample = () => {
    setForm((prev) => ({
      ...prev,
      examples: [...prev.examples, { input: "", output: "", explanation: "" }],
    }));
  };

  const removeExample = (idx) => {
    setForm((prev) => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== idx),
    }));
  };

  const updateExample = (idx, field, value) => {
    setForm((prev) => {
      const ex = [...prev.examples];
      ex[idx] = { ...ex[idx], [field]: value };
      return { ...prev, examples: ex };
    });
  };

  const addConstraint = () => {
    setForm((prev) => ({ ...prev, constraints: [...prev.constraints, ""] }));
  };

  const removeConstraint = (idx) => {
    setForm((prev) => ({
      ...prev,
      constraints: prev.constraints.filter((_, i) => i !== idx),
    }));
  };

  const updateConstraint = (idx, value) => {
    setForm((prev) => {
      const c = [...prev.constraints];
      c[idx] = value;
      return { ...prev, constraints: c };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title?.trim() || !form.description?.text?.trim()) return;

    const payload = {
      ...form,
      description: {
        text: form.description?.text?.trim() || "",
        notes: Array.isArray(form.description?.notes)
          ? form.description.notes
          : String(form.description?.notes || "")
              .split("\n")
              .map((n) => n.trim())
              .filter(Boolean),
      },
      examples: form.examples.filter((ex) => ex.input?.trim() || ex.output?.trim()),
      constraints: form.constraints.filter((c) => c?.trim()),
    };

    onCreated(payload);
    resetForm();
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 bg-base-100 px-6 pt-6 pb-4 border-b border-base-300">
          <h3 className="font-black text-xl">Create custom problem</h3>
          <p className="text-sm text-base-content/60 mt-1">
            This problem will expire when the session room is deleted.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-semibold">Title *</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="e.g. Two Sum"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text font-semibold">Difficulty</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={form.difficulty}
                onChange={(e) => update("difficulty", e.target.value)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Category</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="e.g. Array • Hash Table"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Description *</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full min-h-[100px]"
              placeholder="Describe the problem..."
              value={form.description?.text}
              onChange={(e) => update("description.text", e.target.value)}
              required
            />
            <label className="label mt-2">
              <span className="label-text-alt">Additional notes (one per line)</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full textarea-sm"
              placeholder="Note 1&#10;Note 2"
              value={
                Array.isArray(form.description?.notes)
                  ? form.description.notes.join("\n")
                  : ""
              }
              onChange={(e) =>
                update(
                  "description.notes",
                  e.target.value
                    .split("\n")
                    .map((n) => n.trim())
                    .filter(Boolean)
                )
              }
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label-text font-semibold">Examples</label>
              <button type="button" className="btn btn-ghost btn-xs gap-1" onClick={addExample}>
                <PlusIcon className="size-3" /> Add
              </button>
            </div>
            <div className="space-y-3">
              {form.examples.map((ex, idx) => (
                <div key={idx} className="bg-base-200 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Example {idx + 1}</span>
                    {form.examples.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs btn-circle text-error"
                        onClick={() => removeExample(idx)}
                      >
                        <Trash2Icon className="size-3" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    className="input input-sm input-bordered w-full"
                    placeholder="Input"
                    value={ex.input}
                    onChange={(e) => updateExample(idx, "input", e.target.value)}
                  />
                  <input
                    type="text"
                    className="input input-sm input-bordered w-full"
                    placeholder="Output"
                    value={ex.output}
                    onChange={(e) => updateExample(idx, "output", e.target.value)}
                  />
                  <input
                    type="text"
                    className="input input-sm input-bordered w-full"
                    placeholder="Explanation (optional)"
                    value={ex.explanation}
                    onChange={(e) => updateExample(idx, "explanation", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label-text font-semibold">Constraints</label>
              <button type="button" className="btn btn-ghost btn-xs gap-1" onClick={addConstraint}>
                <PlusIcon className="size-3" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {form.constraints.map((c, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    className="input input-sm input-bordered flex-1"
                    placeholder="e.g. 1 ≤ n ≤ 10⁵"
                    value={c}
                    onChange={(e) => updateConstraint(idx, e.target.value)}
                  />
                  {form.constraints.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm btn-square text-error"
                      onClick={() => removeConstraint(idx)}
                    >
                      <Trash2Icon className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="label-text font-semibold block mb-2">Starter code</label>
            <div className="space-y-3">
              {["javascript", "python", "java"].map((lang) => (
                <div key={lang}>
                  <span className="text-xs font-medium text-base-content/70 capitalize block mb-1">
                    {lang}
                  </span>
                  <textarea
                    className="textarea textarea-bordered w-full font-mono text-sm min-h-[80px]"
                    value={form.starterCode?.[lang] || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        starterCode: {
                          ...prev.starterCode,
                          [lang]: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-base-300">
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-outline btn-sm gap-2"
                onClick={shareViaWhatsApp}
                title="Share via WhatsApp"
              >
                <MessageCircleIcon className="w-4 h-4" />
                WhatsApp
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm gap-2"
                onClick={copyLink}
                title="Copy link"
              >
                <CopyIcon className="w-4 h-4" />
                Copy Link
              </button>
              {navigator.share && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm gap-2"
                  onClick={shareLink}
                  title="Share"
                >
                  <ShareIcon className="w-4 h-4" />
                  Share
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn btn-ghost" onClick={handleClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!form.title?.trim() || !form.description?.text?.trim()}
              >
                Use this problem
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
}

export default CreateProblemModal;
