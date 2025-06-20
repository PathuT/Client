import React, { useState } from "react";
import jsPDF from "jspdf";

export default function SubmissionValidator() {
  const [submissionFile, setSubmissionFile] = useState(null);
  const [referenceFile, setReferenceFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setResult(null);

    if (!submissionFile && !textInput.trim()) {
      setError("🚫 Please provide a submission via file or text.");
      return;
    }

    const formData = new FormData();
    if (submissionFile) formData.append("submission_file", submissionFile);
    if (referenceFile) formData.append("reference_file", referenceFile);
    if (textInput.trim()) formData.append("text_input", textInput.trim());

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/validate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("API response:", data);

      if (!response.ok || data.error) {
        setError(data.error || "Unexpected error occurred.");
        return;
      }

      setResult({
        parsed: data.parsed || {},
        plagiarism: data.plagiarism || false,
        credential: data.credential || null,
      });
    } catch (err) {
      setError(err.message || "Something went wrong during validation.");
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    if (!result) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Agentic AI Submission Validation Result", 10, 10);

    doc.setFontSize(12);
    doc.text(
      `Plagiarism Status: ${result.plagiarism ? "🚫 Duplicate detected" : "✅ No plagiarism"}`,
      10,
      20
    );

    doc.text("Parsed Metadata:", 10, 30);
    doc.setFontSize(10);

    const parsedText = JSON.stringify(result.parsed, null, 2);
    doc.text(parsedText, 10, 40, { maxWidth: 180 });

    if (result.credential) {
      doc.setFontSize(12);
      doc.text("Credential Validation:", 10, 90);
      doc.setFontSize(10);

      // Split long text for matched snippet and gemini output to avoid overflow
      const splitMatched = doc.splitTextToSize(result.credential.matched, 180);
      doc.text("Matched Snippet:", 10, 100);
      doc.text(splitMatched, 10, 110);

      doc.text(`Score Label: ${result.credential.label}`, 10, 140);

      const geminiText = result.credential.gemini.replace(/```json|```/g, "").trim();
      const splitGemini = doc.splitTextToSize(geminiText, 180);
      doc.text("Gemini Output:", 10, 150);
      doc.text(splitGemini, 10, 160);
    }

    doc.save("validation-result.pdf");
  };

  const handleLogout = () => {
    // Add your logout logic here (e.g., clear auth tokens, redirect, etc.)
    alert("Logged out!");
  };

  const renderCredentialOutput = (geminiStr) => {
    try {
      const cleaned = geminiStr.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      return (
        <div style={styles.credentialBox}>
          <p>🧮 <strong>Authenticity Score:</strong> {parsed.authenticity_score}</p>
          <p>🚩 <strong>Flags:</strong> {parsed.flags?.length ? parsed.flags.join(", ") : "None"}</p>
          <p>📝 <strong>Explanation:</strong> {parsed.explanation}</p>
        </div>
      );
    } catch (err) {
      return (
        <div>
          ⚠️ Could not parse Gemini output.
          <pre style={styles.codeBlock}>{geminiStr}</pre>
        </div>
      );
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </div>

        <h1 style={styles.title}>🧠 Agentic AI-Submission Validator</h1>

        <div style={styles.uploadBlock}>
          <label style={styles.label}>📄 Upload Submission (PDF/Image)</label>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => setSubmissionFile(e.target.files[0])}
          />
        </div>

        <div style={styles.uploadBlock}>
          <label style={styles.label}>📎 Upload Trusted Certificate (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setReferenceFile(e.target.files[0])}
          />
        </div>

        <div style={styles.textBlock}>
          <label style={styles.label}>📝 Or Paste Submission Text Below</label>
          <textarea
            rows={8}
            placeholder="Paste your submission here..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            style={styles.textarea}
          />
        </div>

        <button
          style={loading ? { ...styles.button, opacity: 0.7 } : styles.button}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "⏳ Validating..." : "✅ Validate Submission"}
        </button>

        {loading && <p style={styles.loading}>🔍 Running AI agents...</p>}

        {error && (
          <div style={{ marginTop: "1.5rem", color: "red" }}>
            ❌ <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: "2rem", textAlign: "left" }}>
            <h2>🔍 Plagiarism Status</h2>
            <p style={{ color: result.plagiarism ? "red" : "green", fontWeight: "bold" }}>
              {result.plagiarism ? "🚫 Duplicate submission detected." : "✅ No plagiarism detected."}
            </p>

            <h2>📄 Parsed Metadata</h2>
            <pre style={styles.codeBlock}>{JSON.stringify(result.parsed, null, 2)}</pre>

            {result.credential && (
              <>
                <h2>📚 Credential Validation</h2>
                <p><strong>Matched Snippet:</strong></p>
                <pre style={styles.codeBlock}>{result.credential.matched}</pre>

                <p><strong>Score Label:</strong> <code>{result.credential.label}</code></p>

                {renderCredentialOutput(result.credential.gemini)}
              </>
            )}

            <button onClick={exportPDF} style={styles.exportButton}>📄 Export as PDF</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "linear-gradient(to right, #f0f4ff, #ffffff)",
    minHeight: "100vh",
    paddingTop: "3rem",
    paddingBottom: "3rem",
  },
  container: {
    maxWidth: "720px",
    margin: "auto",
    padding: "2rem",
    background: "#ffffff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    borderRadius: "16px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: "28px",
    color: "#1f2937",
  },
  uploadBlock: {
    marginBottom: "1.5rem",
  },
  textBlock: {
    marginBottom: "1.5rem",
  },
  label: {
    fontWeight: "bold",
    display: "block",
    marginBottom: "0.5rem",
    color: "#374151",
  },
  textarea: {
    width: "100%",
    padding: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    background: "#f9fafb",
    fontFamily: "inherit",
  },
  button: {
    width: "100%",
    padding: "0.85rem",
    background: "linear-gradient(to right, #6366f1, #4f46e5)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "opacity 0.3s",
  },
  loading: {
    marginTop: "1rem",
    color: "#6b7280",
    fontWeight: "bold",
  },
  codeBlock: {
    backgroundColor: "#f3f4f6",
    padding: "1rem",
    borderRadius: "8px",
    overflowX: "auto",
    whiteSpace: "pre-wrap",
    fontSize: "14px",
    lineHeight: "1.4",
    fontFamily: "monospace",
  },
  credentialBox: {
    backgroundColor: "#fdf6e3",
    padding: "1rem",
    marginTop: "1rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "0.25rem 0.7rem",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "13px",
    height: "28px",
  },
  exportButton: {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
};
