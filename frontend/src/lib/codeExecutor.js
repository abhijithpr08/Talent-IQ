// Code execution using Piston API (free, no API key)
// Fallback: Judge0 CE - set VITE_CODE_EXECUTOR_API_URL to Judge0 URL if needed

const PISTON_URL = "https://emkc.org/api/v2/piston";
const JUDGE0_URL = import.meta.env.VITE_CODE_EXECUTOR_API_URL || "https://ce.judge0.com";

const PISTON_LANGUAGES = {
  javascript: "javascript",
  python: "python",
  java: "java",
};

const JUDGE0_LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
};

function parseJudge0Result(data) {
  const stdout = data.stdout ?? "";
  const stderr = data.stderr ?? "";
  const compileOutput = data.compile_output ?? "";
  const status = data.status ?? {};
  const isAccepted = status.id === 3 || status.description === "Accepted";

  if (!isAccepted) {
    const errorParts = [compileOutput, stderr, status.description]
      .map((s) => (s || "").trim())
      .filter(Boolean);
    if (errorParts.length > 0) {
      return { success: false, output: stdout.trim(), error: errorParts.join("\n") };
    }
  }
  return { success: true, output: (stdout || "").trim() || "(no output)" };
}

async function executeWithPiston(language, code) {
  const lang = PISTON_LANGUAGES[language];
  if (!lang) return null;

  const response = await fetch(`${PISTON_URL}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: lang,
      version: "*",
      files: [{ content: code }],
    }),
  });

  if (!response.ok) return null;

  const data = await response.json();
  const run = data.run;
  if (!run) return null;

  const stdout = (run.stdout || "").trim();
  const stderr = (run.stderr || "").trim();
  const code0 = run.code ?? 0;

  if (code0 !== 0 || stderr) {
    return {
      success: false,
      output: stdout,
      error: stderr || `Exit code: ${code0}`,
    };
  }
  return { success: true, output: stdout || "(no output)" };
}

async function executeWithJudge0(language, code) {
  const languageId = JUDGE0_LANGUAGE_IDS[language];
  if (!languageId) return null;

  const baseUrl = JUDGE0_URL.replace(/\/+$/, "");

  const createRes = await fetch(
    `${baseUrl}/submissions?base64_encoded=false&wait=true&fields=stdout,stderr,compile_output,status`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language_id: languageId, source_code: code, stdin: "" }),
    }
  );

  if (!createRes.ok) return null;

  const data = await createRes.json();

  if (data.error) {
    return { success: false, error: data.error };
  }

  if (data.token && data.stdout === undefined && data.status === undefined) {
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 500));
      const getRes = await fetch(
        `${baseUrl}/submissions/${data.token}?base64_encoded=false&fields=stdout,stderr,compile_output,status`
      );
      if (!getRes.ok) break;
      const poll = await getRes.json();
      if (poll.status && [1, 2].indexOf(poll.status.id) === -1) {
        return parseJudge0Result(poll);
      }
    }
    return { success: false, error: "Execution timed out" };
  }

  return parseJudge0Result(data);
}

/**
 * @param {string} language - "javascript" | "python" | "java"
 * @param {string} code - source code
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    let result = await executeWithPiston(language, code);
    if (result) return result;

    result = await executeWithJudge0(language, code);
    if (result) return result;

    return { success: false, error: "Code execution service unavailable. Please try again." };
  } catch (error) {
    return { success: false, error: `Failed to execute code: ${error.message}` };
  }
}

