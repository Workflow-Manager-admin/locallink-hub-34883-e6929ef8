import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * SkillRecommender component uses a backend OpenAI proxy endpoint to return skill suggestions for a user-provided prompt.
 *
 * Frontend POSTs to /api/openai (run locally, e.g., http://localhost:4001/api/openai).
 * The secure backend handles the OpenAI API key―no key is ever needed or accepted in the frontend now.
 *
 * Robust error handling, loading, and suggestion UI are implemented.
 */
function SkillRecommender({ context = "skill", label = "Skill Suggestions" }) {
  const [userPrompt, setUserPrompt] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // The system prompt for OpenAI
  const basePrompt =
    "You are an expert in local community skill sharing. Suggest practical, in-demand skills for people to offer or request, based on the following request (reply as a short list):\n\n";

  // --- Backend proxy details
  // Default base URL (in dev: 'http://localhost:4001'), but allow use of relative for deploys behind same domain/port
  const API_URL = process.env.REACT_APP_OPENAI_PROXY_URL || "http://localhost:4001/api/openai";

  // PUBLIC_INTERFACE
  async function fetchSkillRecommendations() {
    setLoading(true);
    setError("");
    setSuggestions(null);

    try {
      // Compose the payload as expected by openai-proxy backend
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // DO NOT send API key here!
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: basePrompt },
            {
              role: "user",
              content:
                userPrompt?.trim() ||
                "Suggest useful local skills to share or request."
            }
          ],
          max_tokens: 120,
          temperature: 0.75,
          n: 1,
        }),
      });

      // If connection error (e.g., ECONNREFUSED), try/catch will hit
      if (!response.ok) {
        let msg = "Failed to fetch suggestions. ";

        let errorData = "";
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }
        if (
          errorData &&
          typeof errorData === "object" &&
          errorData.error
        ) {
          msg += errorData.error;
        } else if (typeof errorData === "string" && errorData.length > 0) {
          msg += errorData;
        } else {
          msg += "Unknown server error.";
        }
        setError(msg);
        setLoading(false);
        return;
      }

      const data = await response.json();

      setSuggestions(
        data.choices && data.choices[0]?.message?.content?.trim()
          ? data.choices[0].message.content.trim()
          : "No suggestions found."
      );
    } catch (err) {
      let msg = "Failed to fetch suggestions. ";
      if (err && err.message) {
        msg += err.message;
      }
      setError(msg);
    }
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  function handleSubmit(e) {
    e.preventDefault();
    setSuggestions(null);
    setError("");
    if (!userPrompt.trim()) {
      setError(
        "Please enter a brief description/request for skill suggestions."
      );
      return;
    }
    fetchSkillRecommendations();
  }

  // UI warning if backend proxy is not configured
  const proxyAddrWarning =
    API_URL.startsWith("http://localhost:4001") &&
    window.location.hostname !== "localhost"
      ? "⚠️ OpenAI proxy endpoint is set to localhost. This app must call the backend proxy deployed and reachable from your browser. See README for deployment notes."
      : null;

  return (
    <section className="llh-card" style={{ marginTop: 18, marginBottom: 8 }}>
      <h3>
        <span role="img" aria-label="bulb" style={{ marginRight: 7 }}>
          💡
        </span>
        {label}
      </h3>
      {proxyAddrWarning && (
        <div
          style={{
            color: "#ab2323",
            marginBottom: 14,
            marginTop: 5,
            fontWeight: 650,
            borderRadius: 4,
            background: "#fff2f2",
            padding: "9px 12px",
          }}
          aria-live="polite"
          tabIndex={0}
        >
          {proxyAddrWarning}
          <br />
          <span style={{ fontWeight: 400, fontSize: "0.93em" }}>
            <b>Deployment Note:</b> Change the API endpoint if deploying frontend and backend on separate hosts.
          </span>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      >
        <label
          htmlFor="skill-suggest-input"
          style={{ fontWeight: 550, marginBottom: 4 }}
        >
          Describe what you want to offer/request, or your area of interest:
        </label>
        <input
          id="skill-suggest-input"
          type="text"
          placeholder="e.g. I can teach..., I want to learn..., Need a repair..., etc."
          value={userPrompt}
          onChange={e => setUserPrompt(e.target.value)}
          style={{
            fontSize: "1rem",
            padding: "9px 12px",
            borderRadius: 6,
            border: "1.2px solid #ddd",
            marginBottom: 3,
            outline: "none",
          }}
          autoComplete="off"
          disabled={loading}
        />
        <button
          type="submit"
          className="llh-btn-accent"
          style={{ alignSelf: "flex-start", minWidth: 78, fontWeight: 650 }}
          disabled={loading}
        >
          {loading ? "Generating..." : "Get Suggestions"}
        </button>
      </form>
      {error && (
        <div
          style={{
            color: "#ab2323",
            marginTop: 9,
            fontWeight: 650,
            borderRadius: 4,
            background: "#fff2f2",
            padding: "7px 12px",
          }}
          tabIndex={0}
        >
          {error}
        </div>
      )}
      {suggestions && !error && (
        <div
          style={{
            marginTop: 13,
            background: "#f5faf7",
            border: "1px solid #e2e8e4",
            borderRadius: 8,
            padding: "14px 16px",
            color: "#2D6A4F",
            fontWeight: 515,
            whiteSpace: "pre-wrap",
          }}
        >
          {suggestions}
        </div>
      )}
      <div
        style={{
          marginTop: 16,
          color: "#ab2323",
          fontSize: "0.96em",
          display: "block",
        }}
        aria-live="polite"
      >
        {process.env.NODE_ENV === "production" && (
          <div>
            <b>Security Note:</b> Your API key is protected. In production, always use this backend proxy―never expose OpenAI secrets in the frontend.
          </div>
        )}
      </div>
    </section>
  );
}

export default SkillRecommender;
