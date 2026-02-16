import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAllProblems } from "../hooks/useAllProblems";
import { useProblemById, useProblemBySlug } from "../hooks/useProblems";
import Nav from "../components/Nav";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../lib/codeExecutor";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allProblems, isLoading } = useAllProblems();
  const isObjectId = id && /^[a-f0-9]{24}$/i.test(id);
  const { data: apiById } = useProblemById(isObjectId ? id : null);
  const { data: apiBySlug } = useProblemBySlug(!isObjectId && id ? id : null);

  const problemsMap = useMemo(() => {
    const m = {};
    allProblems.forEach((p) => {
      m[p.id] = p;
      if (p.slug) m[p.slug] = p;
      if (p._id) m[p._id] = p;
    });
    return m;
  }, [allProblems]);

  const currentProblem = problemsMap[id] || apiById?.problem || apiBySlug?.problem;
  const currentProblemId = currentProblem ? (currentProblem.id || currentProblem._id) : id || "two-sum";

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const p = problemsMap[id] || apiById?.problem || apiBySlug?.problem;
    if (p) {
      const starter = p.starterCode?.[selectedLanguage] || "";
      setCode(starter);
      setOutput(null);
    }
  }, [id, selectedLanguage, problemsMap, apiById, apiBySlug, currentProblem]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem?.starterCode?.[newLang] || "");
    setOutput(null);
  };

  const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (output) => {
    return output
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          .replace(/\s*,\s*/g, ",")
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);

    return normalizedActual == normalizedExpected;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);

    if (result.success) {
      const expectedOutput = currentProblem?.expectedOutput?.[selectedLanguage];
      if (expectedOutput != null) {
        const testsPassed = checkIfTestsPassed(result.output, expectedOutput);
        if (testsPassed) {
          triggerConfetti();
          toast.success("All tests passed! Great job!");
        } else {
          toast.error("Tests failed. Check your output!");
        }
      }
    } else {
      toast.error("Code execution failed!");
    }
  };

  if ((isLoading || !currentProblem) && !apiById?.problem && !apiBySlug?.problem) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-base-content/70">Problem not found</p>
      </div>
    );
  }

  const normalizedProblem = {
    id: currentProblem.id || currentProblem._id,
    title: currentProblem.title,
    difficulty: currentProblem.difficulty,
    category: currentProblem.category || "",
    description: currentProblem.description || { text: "", notes: [] },
    examples: currentProblem.examples || [],
    constraints: currentProblem.constraints || [],
    starterCode: currentProblem.starterCode || { javascript: "", python: "", java: "" },
    expectedOutput: currentProblem.expectedOutput || {},
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Nav />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* left panel- problem desc */}
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={normalizedProblem}
              currentProblemId={normalizedProblem.id}
              onProblemChange={handleProblemChange}
              allProblems={allProblems}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* right panel- code editor & output */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Top panel - Code editor */}
              <Panel defaultSize={70} minSize={30}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              {/* Bottom panel - Output Panel*/}

              <Panel defaultSize={30} minSize={30}>
                <OutputPanel output={output} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;