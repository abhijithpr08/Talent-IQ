import { useState, useEffect } from "react";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { PROBLEM_TEMPLATE } from "../data/problemTemplate";

function problemToForm(p) {
  if (!p) return JSON.parse(JSON.stringify(PROBLEM_TEMPLATE));
  return {
    title: p.title || "",
    difficulty: p.difficulty || "Easy",
    category: p.category || "",
    description: {
      text: p.description?.text || "",
      notes: Array.isArray(p.description?.notes) ? p.description.notes : [],
    },
    examples: Array.isArray(p.examples) && p.examples.length
      ? p.examples.map((e) => ({ input: e.input || "", output: e.output || "", explanation: e.explanation || "" }))
      : [{ input: "", output: "", explanation: "" }],
    constraints: Array.isArray(p.constraints) && p.constraints.length ? p.constraints : [""],
    starterCode: {
      javascript: p.starterCode?.javascript || "",
      python: p.starterCode?.python || "",
      java: p.starterCode?.java || "",
    },
    expectedOutput: {
      javascript: p.expectedOutput?.javascript || "",
      python: p.expectedOutput?.python || "",
      java: p.expectedOutput?.java || "",
    },
  };
}

function AdminProblemModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }) {
  const [form, setForm] = useState(() => problemToForm(initialData));

  useEffect(() => {
    if (isOpen) setForm(problemToForm(initialData));
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const update = (path, value) => {
    setForm((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
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
    setForm((prev) => ({ ...prev, examples: [...prev.examples, { input: "", output: "", explanation: "" }] }));
  };
  const removeExample = (idx) => {
    setForm((prev) => ({ ...prev, examples: prev.examples.filter((_, i) => i !== idx) }));
  };
  const updateExample = (idx, field, value) => {
    setForm((prev) => {
      const ex = [...prev.examples];
      ex[idx] = { ...ex[idx], [field]: value };
      return { ...prev, examples: ex };
    });
  };
  const addConstraint = () => setForm((prev) => ({ ...prev, constraints: [...prev.constraints, ""] }));
  const removeConstraint = (idx) => {
    setForm((prev) => ({ ...prev, constraints: prev.constraints.filter((_, i) => i !== idx) }));
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
    onSubmit(payload);
  };

  const isEdit = !!initialData?._id;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 bg-base-100 px-6 pt-6 pb-4 border-b border-base-300">
          <h3 className="font-black text-xl">{isEdit ? "Edit problem" : "Create problem"}</h3>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label"><span className="label-text font-semibold">Title *</span></label>
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
              <label className="label"><span className="label-text font-semibold">Difficulty</span></label>
              <select className="select select-bordered w-full" value={form.difficulty} onChange={(e) => update("difficulty", e.target.value)}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label"><span className="label-text font-semibold">Category</span></label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="e.g. Array • Hash Table"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            />
          </div>

          <div>
            <label className="label"><span className="label-text font-semibold">Description *</span></label>
            <textarea
              className="textarea textarea-bordered w-full min-h-[100px]"
              placeholder="Describe the problem..."
              value={form.description?.text}
              onChange={(e) => update("description.text", e.target.value)}
              required
            />
            <label className="label mt-2"><span className="label-text-alt">Additional notes (one per line)</span></label>
            <textarea
              className="textarea textarea-bordered w-full textarea-sm"
              placeholder="Note 1&#10;Note 2"
              value={Array.isArray(form.description?.notes) ? form.description.notes.join("\n") : ""}
              onChange={(e) => update("description.notes", e.target.value.split("\n").map((n) => n.trim()).filter(Boolean))}
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
                      <button type="button" className="btn btn-ghost btn-xs btn-circle text-error" onClick={() => removeExample(idx)}>
                        <Trash2Icon className="size-3" />
                      </button>
                    )}
                  </div>
                  <input type="text" className="input input-sm input-bordered w-full" placeholder="Input" value={ex.input} onChange={(e) => updateExample(idx, "input", e.target.value)} />
                  <input type="text" className="input input-sm input-bordered w-full" placeholder="Output" value={ex.output} onChange={(e) => updateExample(idx, "output", e.target.value)} />
                  <input type="text" className="input input-sm input-bordered w-full" placeholder="Explanation" value={ex.explanation} onChange={(e) => updateExample(idx, "explanation", e.target.value)} />
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
                  <input type="text" className="input input-sm input-bordered flex-1" placeholder="e.g. 1 ≤ n ≤ 10⁵" value={c} onChange={(e) => updateConstraint(idx, e.target.value)} />
                  {form.constraints.length > 1 && (
                    <button type="button" className="btn btn-ghost btn-sm btn-square text-error" onClick={() => removeConstraint(idx)}>
                      <Trash2Icon className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="label-text font-semibold block mb-2">Starter code</label>
            {["javascript", "python", "java"].map((lang) => (
              <div key={lang} className="mb-3">
                <span className="text-xs font-medium text-base-content/70 capitalize block mb-1">{lang}</span>
                <textarea
                  className="textarea textarea-bordered w-full font-mono text-sm min-h-[80px]"
                  value={form.starterCode?.[lang] || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, starterCode: { ...prev.starterCode, [lang]: e.target.value } }))}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-base-300">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!form.title?.trim() || !form.description?.text?.trim() || isSubmitting}>
              {isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}

export default AdminProblemModal;
