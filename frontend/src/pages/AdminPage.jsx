import { useState } from "react";
import { Navigate } from "react-router";
import Nav from "../components/Nav";
import AdminProblemModal from "../components/AdminProblemModal";
import {
  useProblems,
  useCreateProblem,
  useUpdateProblem,
  useDeleteProblem,
} from "../hooks/useProblems";
import { useAdminSessions, useAdminDeleteSession } from "../hooks/useAdminSessions";
import { useIsAdmin } from "../hooks/useAdmin";
import {
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  Loader2Icon,
  FolderIcon,
  CalendarIcon,
} from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

function AdminPage() {
  const { isAdmin, isLoading: loadingAdmin } = useIsAdmin();
  const { data: problemsData, isLoading: loadingProblems } = useProblems();
  const { data: sessionsData, isLoading: loadingSessions } = useAdminSessions();
  const createProblemMutation = useCreateProblem();
  const updateProblemMutation = useUpdateProblem();
  const deleteProblemMutation = useDeleteProblem();
  const deleteSessionMutation = useAdminDeleteSession();

  const [tab, setTab] = useState("problems");
  const [problemModal, setProblemModal] = useState({ open: false, problem: null });
  const [deletingId, setDeletingId] = useState(null);

  const problems = problemsData?.problems || [];
  const sessions = sessionsData?.sessions || [];

  if (loadingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2Icon className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const handleProblemSubmit = (payload) => {
    if (problemModal.problem?._id) {
      updateProblemMutation.mutate(
        { id: problemModal.problem._id, data: payload },
        { onSuccess: () => setProblemModal({ open: false, problem: null }) }
      );
    } else {
      createProblemMutation.mutate(payload, {
        onSuccess: () => setProblemModal({ open: false, problem: null }),
      });
    }
  };

  const handleDeleteProblem = (id) => {
    if (!confirm("Delete this problem?")) return;
    setDeletingId(id);
    deleteProblemMutation.mutate(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  const handleDeleteSession = (id) => {
    if (!confirm("Delete this session?")) return;
    setDeletingId(id);
    deleteSessionMutation.mutate(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  return (
    <div className="min-h-screen bg-base-300">
      <Nav />

      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black text-base-content">Admin</h1>
        </div>

        <div className="tabs tabs-boxed bg-base-200 p-1 rounded-xl mb-6">
          <button
            className={`tab gap-2 ${tab === "problems" ? "tab-active" : ""}`}
            onClick={() => setTab("problems")}
          >
            <FolderIcon className="size-4" />
            Problems ({problems.length})
          </button>
          <button
            className={`tab gap-2 ${tab === "sessions" ? "tab-active" : ""}`}
            onClick={() => setTab("sessions")}
          >
            <CalendarIcon className="size-4" />
            Sessions ({sessions.length})
          </button>
        </div>

        {tab === "problems" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                className="btn btn-primary gap-2"
                onClick={() => setProblemModal({ open: true, problem: null })}
              >
                <PlusIcon className="size-4" />
                Create problem
              </button>
            </div>

            {loadingProblems ? (
              <div className="flex justify-center py-12">
                <Loader2Icon className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : problems.length === 0 ? (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center py-12">
                  <p className="text-base-content/70">No problems yet. Create one to get started.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra bg-base-100">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Difficulty</th>
                      <th>Category</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problems.map((p) => (
                      <tr key={p._id}>
                        <td className="font-medium">{p.title}</td>
                        <td>
                          <span className={`badge ${getDifficultyBadgeClass(p.difficulty)}`}>
                            {p.difficulty}
                          </span>
                        </td>
                        <td className="text-base-content/70">{p.category || "—"}</td>
                        <td className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => setProblemModal({ open: true, problem: p })}
                            >
                              <PencilIcon className="size-4" />
                            </button>
                            <button
                              className="btn btn-ghost btn-sm text-error"
                              onClick={() => handleDeleteProblem(p._id)}
                              disabled={deletingId === p._id}
                            >
                              {deletingId === p._id ? (
                                <Loader2Icon className="size-4 animate-spin" />
                              ) : (
                                <Trash2Icon className="size-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "sessions" && (
          <div className="space-y-4">
            {loadingSessions ? (
              <div className="flex justify-center py-12">
                <Loader2Icon className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center py-12">
                  <p className="text-base-content/70">No sessions yet.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra bg-base-100">
                  <thead>
                    <tr>
                      <th>Problem</th>
                      <th>Host</th>
                      <th>Participant</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s) => (
                      <tr key={s._id}>
                        <td className="font-medium">{s.problem}</td>
                        <td>{s.host?.name || "—"}</td>
                        <td>{s.participant?.name || "—"}</td>
                        <td>
                          <span
                            className={`badge ${
                              s.status === "active" ? "badge-success" : "badge-ghost"
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="text-base-content/70 text-sm">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </td>
                        <td className="text-right">
                          <button
                            className="btn btn-ghost btn-sm text-error"
                            onClick={() => handleDeleteSession(s._id)}
                            disabled={deletingId === s._id}
                          >
                            {deletingId === s._id ? (
                              <Loader2Icon className="size-4 animate-spin" />
                            ) : (
                              <Trash2Icon className="size-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <AdminProblemModal
        isOpen={problemModal.open}
        onClose={() => setProblemModal({ open: false, problem: null })}
        onSubmit={handleProblemSubmit}
        initialData={problemModal.problem}
        isSubmitting={createProblemMutation.isPending || updateProblemMutation.isPending}
      />
    </div>
  );
}

export default AdminPage;
