// Unified code execution helper using Judge0 (or compatible) API
// This replaces the previous Piston-based implementation.
// Uses a free Judge0 Community instance by default (no API key required).
// You can override the URL with VITE_CODE_EXECUTOR_API_URL if you self-host.

const DEFAULT_API_URL = import.meta.env.VITE_CODE_EXECUTOR_API_URL || "https://ce.judge0.com";

// Map app languages to Judge0 language IDs
// See: https://ce.judge0.com/ for full list if you self-host.
const LANGUAGE_IDS = {
  javascript: 63, // JavaScript (Node.js 18.x)
  python: 71, // Python (3.11.x)
  java: 62, // Java (OpenJDK 17.x)
};

/**
 * @param {string} language - programming language key (e.g. "javascript", "python", "java")
 * @param {string} code - source code to execute
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const languageId = LANGUAGE_IDS[language];

    if (!languageId) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    const url = `${DEFAULT_API_URL.replace(/\/+$/, "")}/submissions?base64_encoded=false&wait=true&fields=stdout,stderr,compile_output,status`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language_id: languageId,
        source_code: code,
        stdin: "",
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();

    const stdout = data.stdout || "";
    const stderr = data.stderr || "";
    const compileOutput = data.compile_output || "";
    const status = data.status || {};

    const isAccepted = status.id === 3 || status.description === "Accepted";

    // If not accepted, treat status/compile errors/stderr as an error
    if (!isAccepted) {
      const errorParts = [compileOutput, stderr, status.description]
        .map((s) => (s || "").trim())
        .filter(Boolean);

      if (errorParts.length > 0) {
        return {
          success: false,
          output: (stdout || "").trim(),
          error: errorParts.join("\n"),
        };
      }
    }

    // Accepted or no error info: treat as success
    return {
      success: true,
      output: (stdout || "").trim() || "No output",
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}

