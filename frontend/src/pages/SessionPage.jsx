import { useUser } from "@clerk/clerk-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { useAllProblems } from "../hooks/useAllProblems";

function normalizeProblemFromDb(p) {
  if (!p) return null;
  return {
    id: p._id,
    title: p.title,
    difficulty: p.difficulty,
    category: p.category || "",
    description: p.description || { text: "", notes: [] },
    examples: p.examples || [],
    constraints: p.constraints || [],
    starterCode: p.starterCode || { javascript: "", python: "", java: "" },
  };
}
import { executeCode } from "../lib/codeExecutor";
import Nav from "../components/Nav";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getDifficultyBadgeClass } from "../lib/utils";
import { Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant
  );

  const { allProblems } = useAllProblems();
  const problemData = useMemo(
    () =>
      session?.problemId
        ? normalizeProblemFromDb(session.problemId)
        : session?.problem
          ? allProblems.find((p) => p.title === session.problem)
          : null,
    [session?.problemId, session?.problem, allProblems]
  );

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");

  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;

    joinSessionMutation.mutate(id, { onSuccess: refetch });
  }, [session, user, loadingSession, isHost, isParticipant, id, joinSessionMutation, refetch]);

  useEffect(() => {
    if (!session || loadingSession) return;

    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    try {
      const result = await executeCode(selectedLanguage, code);
      setOutput(result);
    } catch (err) {
      setOutput({
        success: false,
        error: err?.message || "Failed to execute code",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session? All participants will be notified.")) {
      endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
    }
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Nav />

      <div className="flex-1">
        {/* Mobile layout - stack video and coding vertically */}
        <div className="h-full md:hidden">
          <PanelGroup direction="vertical">
            {/* VIDEO / CALL PANEL */}
            <Panel defaultSize={45} minSize={35}>
              <div className="h-full bg-base-200 p-3 overflow-auto">
                {isInitializingCall ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Loader2Icon className="w-10 h-10 mx-auto animate-spin text-primary mb-3" />
                      <p className="text-base">Connecting to video call...</p>
                    </div>
                  </div>
                ) : !streamClient || !call ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="card bg-base-100 shadow-xl max-w-md">
                      <div className="card-body items-center text-center">
                        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-3">
                          <PhoneOffIcon className="w-10 h-10 text-error" />
                        </div>
                        <h2 className="card-title text-xl">Connection Failed</h2>
                        <p className="text-base-content/70 text-sm">
                          Unable to connect to the video call
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full">
                    <StreamVideo client={streamClient}>
                      <StreamCall call={call}>
                        <VideoCallUI chatClient={chatClient} channel={channel} />
                      </StreamCall>
                    </StreamVideo>
                  </div>
                )}
              </div>
            </Panel>

            <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

            {/* PROBLEM + CODE PANEL */}
            <Panel defaultSize={55} minSize={45}>
              <PanelGroup direction="vertical">
                <Panel defaultSize={45} minSize={25}>
                  <div className="h-full overflow-y-auto bg-base-200">
                    {/* HEADER SECTION */}
                    <div className="p-4 bg-base-100 border-b border-base-300">
                      <div className="flex flex-col gap-3">
                        <div>
                          <h1 className="text-2xl font-bold text-base-content">
                            {session?.problem || "Loading..."}
                          </h1>
                          {problemData?.category && (
                            <p className="text-base-content/60 mt-1 text-sm">
                              {problemData.category}
                            </p>
                          )}
                          <p className="text-base-content/60 mt-2 text-sm">
                            Host: {session?.host?.name || "Loading..."} •{" "}
                            {session?.participant ? 2 : 1}/2 participants
                          </p>
                        </div>

                        <div className="flex items-center gap-2 justify-between">
                          <span
                            className={`badge badge-lg ${getDifficultyBadgeClass(
                              session?.difficulty
                            )}`}
                          >
                            {session?.difficulty.slice(0, 1).toUpperCase() +
                              session?.difficulty.slice(1) || "Easy"}
                          </span>
                          {isHost && session?.status === "active" && (
                            <button
                              onClick={handleEndSession}
                              disabled={endSessionMutation.isPending}
                              className="btn btn-error btn-xs sm:btn-sm gap-2"
                            >
                              {endSessionMutation.isPending ? (
                                <Loader2Icon className="w-4 h-4 animate-spin" />
                              ) : (
                                <LogOutIcon className="w-4 h-4" />
                              )}
                              End
                            </button>
                          )}
                          {session?.status === "completed" && (
                            <span className="badge badge-ghost badge-lg">Completed</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* problem desc */}
                      {problemData?.description && (
                        <div className="bg-base-100 rounded-xl shadow-sm p-4 border border-base-300">
                          <h2 className="text-lg font-bold mb-3 text-base-content">Description</h2>
                          <div className="space-y-2 text-sm leading-relaxed">
                            <p className="text-base-content/90">{problemData.description.text}</p>
                            {problemData.description.notes?.map((note, idx) => (
                              <p key={idx} className="text-base-content/90">
                                {note}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* examples section */}
                      {problemData?.examples && problemData.examples.length > 0 && (
                        <div className="bg-base-100 rounded-xl shadow-sm p-4 border border-base-300">
                          <h2 className="text-lg font-bold mb-3 text-base-content">Examples</h2>

                          <div className="space-y-3">
                            {problemData.examples.map((example, idx) => (
                              <div key={idx}>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="badge badge-sm">{idx + 1}</span>
                                  <p className="font-semibold text-base-content text-sm">
                                    Example {idx + 1}
                                  </p>
                                </div>
                                <div className="bg-base-200 rounded-lg p-3 font-mono text-xs space-y-1.5">
                                  <div className="flex gap-2">
                                    <span className="text-primary font-bold min-w-[60px]">
                                      Input:
                                    </span>
                                    <span>{example.input}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <span className="text-secondary font-bold min-w-[60px]">
                                      Output:
                                    </span>
                                    <span>{example.output}</span>
                                  </div>
                                  {example.explanation && (
                                    <div className="pt-2 border-t border-base-300 mt-2">
                                      <span className="text-base-content/60 font-sans text-[11px]">
                                        <span className="font-semibold">Explanation:</span>{" "}
                                        {example.explanation}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Constraints */}
                      {problemData?.constraints && problemData.constraints.length > 0 && (
                        <div className="bg-base-100 rounded-xl shadow-sm p-4 border border-base-300">
                          <h2 className="text-lg font-bold mb-3 text-base-content">Constraints</h2>
                          <ul className="space-y-1.5 text-base-content/90 text-sm">
                            {problemData.constraints.map((constraint, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span className="text-primary">•</span>
                                <code className="text-xs">{constraint}</code>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Panel>

                <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                <Panel defaultSize={55} minSize={35}>
                  <PanelGroup direction="vertical">
                    <Panel defaultSize={65} minSize={40}>
                      <CodeEditorPanel
                        selectedLanguage={selectedLanguage}
                        code={code}
                        isRunning={isRunning}
                        onLanguageChange={handleLanguageChange}
                        onCodeChange={(value) => setCode(value)}
                        onRunCode={handleRunCode}
                      />
                    </Panel>

                    <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                    <Panel defaultSize={35} minSize={25}>
                      <OutputPanel output={output} />
                    </Panel>
                  </PanelGroup>
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </div>

        {/* Desktop layout - side by side panels */}
        <div className="hidden h-full md:block">
          <PanelGroup direction="horizontal">
            {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
            <Panel defaultSize={50} minSize={30}>
              <PanelGroup direction="vertical">
                {/* PROBLEM DSC PANEL */}
                <Panel defaultSize={50} minSize={20}>
                  <div className="h-full overflow-y-auto bg-base-200">
                    {/* HEADER SECTION */}
                    <div className="p-6 bg-base-100 border-b border-base-300">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h1 className="text-3xl font-bold text-base-content">
                            {session?.problem || "Loading..."}
                          </h1>
                          {problemData?.category && (
                            <p className="text-base-content/60 mt-1">{problemData.category}</p>
                          )}
                          <p className="text-base-content/60 mt-2">
                            Host: {session?.host?.name || "Loading..."} •{" "}
                            {session?.participant ? 2 : 1}/2 participants
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`badge badge-lg ${getDifficultyBadgeClass(
                              session?.difficulty
                            )}`}
                          >
                            {session?.difficulty.slice(0, 1).toUpperCase() +
                              session?.difficulty.slice(1) || "Easy"}
                          </span>
                          {isHost && session?.status === "active" && (
                            <button
                              onClick={handleEndSession}
                              disabled={endSessionMutation.isPending}
                              className="btn btn-error btn-sm gap-2"
                            >
                              {endSessionMutation.isPending ? (
                                <Loader2Icon className="w-4 h-4 animate-spin" />
                              ) : (
                                <LogOutIcon className="w-4 h-4" />
                              )}
                              End Session
                            </button>
                          )}
                          {session?.status === "completed" && (
                            <span className="badge badge-ghost badge-lg">Completed</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* problem desc */}
                      {problemData?.description && (
                        <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                          <h2 className="text-xl font-bold mb-4 text-base-content">Description</h2>
                          <div className="space-y-3 text-base leading-relaxed">
                            <p className="text-base-content/90">{problemData.description.text}</p>
                            {problemData.description.notes?.map((note, idx) => (
                              <p key={idx} className="text-base-content/90">
                                {note}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* examples section */}
                      {problemData?.examples && problemData.examples.length > 0 && (
                        <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                          <h2 className="text-xl font-bold mb-4 text-base-content">Examples</h2>

                          <div className="space-y-4">
                            {problemData.examples.map((example, idx) => (
                              <div key={idx}>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="badge badge-sm">{idx + 1}</span>
                                  <p className="font-semibold text-base-content">
                                    Example {idx + 1}
                                  </p>
                                </div>
                                <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
                                  <div className="flex gap-2">
                                    <span className="text-primary font-bold min-w-[70px]">
                                      Input:
                                    </span>
                                    <span>{example.input}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <span className="text-secondary font-bold min-w-[70px]">
                                      Output:
                                    </span>
                                    <span>{example.output}</span>
                                  </div>
                                  {example.explanation && (
                                    <div className="pt-2 border-t border-base-300 mt-2">
                                      <span className="text-base-content/60 font-sans text-xs">
                                        <span className="font-semibold">Explanation:</span>{" "}
                                        {example.explanation}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Constraints */}
                      {problemData?.constraints && problemData.constraints.length > 0 && (
                        <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                          <h2 className="text-xl font-bold mb-4 text-base-content">Constraints</h2>
                          <ul className="space-y-2 text-base-content/90">
                            {problemData.constraints.map((constraint, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span className="text-primary">•</span>
                                <code className="text-sm">{constraint}</code>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Panel>

                <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                <Panel defaultSize={50} minSize={20}>
                  <PanelGroup direction="vertical">
                    <Panel defaultSize={70} minSize={30}>
                      <CodeEditorPanel
                        selectedLanguage={selectedLanguage}
                        code={code}
                        isRunning={isRunning}
                        onLanguageChange={handleLanguageChange}
                        onCodeChange={(value) => setCode(value)}
                        onRunCode={handleRunCode}
                      />
                    </Panel>

                    <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                    <Panel defaultSize={30} minSize={15}>
                      <OutputPanel output={output} />
                    </Panel>
                  </PanelGroup>
                </Panel>
              </PanelGroup>
            </Panel>

            <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

            {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
            <Panel defaultSize={50} minSize={30}>
              <div className="h-full bg-base-200 p-4 overflow-auto">
                {isInitializingCall ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                      <p className="text-lg">Connecting to video call...</p>
                    </div>
                  </div>
                ) : !streamClient || !call ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="card bg-base-100 shadow-xl max-w-md">
                      <div className="card-body items-center text-center">
                        <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-4">
                          <PhoneOffIcon className="w-12 h-12 text-error" />
                        </div>
                        <h2 className="card-title text-2xl">Connection Failed</h2>
                        <p className="text-base-content/70">Unable to connect to the video call</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full">
                    <StreamVideo client={streamClient}>
                      <StreamCall call={call}>
                        <VideoCallUI chatClient={chatClient} channel={channel} />
                      </StreamCall>
                    </StreamVideo>
                  </div>
                )}
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}

export default SessionPage;