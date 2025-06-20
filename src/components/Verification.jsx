import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Verification() {
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [raw, setRaw] = useState(null);

  useEffect(() => {
    const stateData = location.state;

    if (stateData?.result) {
      setResult(stateData.result);
      localStorage.setItem("validation_result", JSON.stringify(stateData.result));
    } else if (stateData?.error) {
      setError(stateData.error);
      setRaw(stateData.raw || null);
      localStorage.setItem("validation_error", JSON.stringify({ error: stateData.error, raw: stateData.raw }));
    } else {
      const storedResult = localStorage.getItem("validation_result");
      const storedError = localStorage.getItem("validation_error");

      if (storedResult) setResult(JSON.parse(storedResult));
      else if (storedError) {
        const parsed = JSON.parse(storedError);
        setError(parsed.error);
        setRaw(parsed.raw || null);
      } else {
        setError("No validation result found.");
      }
    }
  }, [location.state]);

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto", fontFamily: "Segoe UI, sans-serif" }}>
      <h2>🔍 Verification Results</h2>

      {error && (
        <div style={{ color: "red", marginTop: "1rem" }}>
          <strong>❌ Error:</strong>
          <p>{error}</p>
          {raw && <pre>{JSON.stringify(raw, null, 2)}</pre>}
        </div>
      )}

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <p style={{ color: result.plagiarism ? "red" : "green" }}>
            {result.plagiarism
              ? "🚫 Duplicate submission detected. Please submit original work."
              : "✅ Submission validated and stored for future comparison."}
          </p>

          {result.parsed && (
            <>
              <h3>🛠️ Submission Metadata</h3>
              <pre>{JSON.stringify(result.parsed, null, 2)}</pre>
            </>
          )}

          <h3>🔍 Plagiarism Status</h3>
          <p>{result.plagiarism ? "Plagiarism detected!" : "No plagiarism detected."}</p>

          {result.credential && (
            <>
              <h3>📚 Credential Validation</h3>
              <p><strong>🔹 Matched Snippet:</strong></p>
              <pre>{result.credential.matched}</pre>
              <p><strong>🔹 Score Label:</strong> <code>{result.credential.label}</code></p>
              <p><strong>🔹 Gemini Output:</strong></p>
              <pre>{result.credential.gemini}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}
