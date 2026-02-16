function OutputPanel({ output }) {
  return (
    <div className="h-full min-h-0 bg-base-100 flex flex-col">
      <div className="px-4 py-2 bg-base-200 border-b border-base-300 font-semibold text-sm shrink-0">
        Output
      </div>
      <div className="flex-1 min-h-0 overflow-auto p-4">
        {output === null || output === undefined ? (
          <p className="text-base-content/50 text-sm">Click "Run Code" to see the output here...</p>
        ) : output.success ? (
          <pre className="text-sm font-mono text-success whitespace-pre-wrap">
            {output.output ?? "No output"}
          </pre>
        ) : (
          <div>
            {output.output && (
              <pre className="text-sm font-mono text-base-content whitespace-pre-wrap mb-2">
                {output.output}
              </pre>
            )}
            <pre className="text-sm font-mono text-error whitespace-pre-wrap">
              {output.error ?? "Unknown error"}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;