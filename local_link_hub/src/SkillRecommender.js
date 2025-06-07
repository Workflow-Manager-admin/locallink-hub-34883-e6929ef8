import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * SkillRecommender component POSTs skill suggestion requests to the secure serverless endpoint /api/openai.
 *
 * - All requests are handled via /api/openai (serverless API function).
 * - The OpenAI API key is stored securely in the server environment ONLY; never exposed to frontend.
 * - No proxy, Express backend, or environment variable for backend URL is required or used.
 * - Works for Vercel, Netlify, local dev, and any platform supporting serverless API endpoints.
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

  // --- Serverless API endpoint (no backend proxy, always use relative path for universal deploy)
  // FRONTEND fetches from serverless route exposed at /api/openai (see root README for details)
  const API_URL = "/api/openai";

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

      // Special error detection sequence and user-friendly messaging:
      // 1. CORS error - not detectable here directly (JS fetch hides details)
      // 2. Network error/Backend down
      // 3. 404/Not Found (bad endpoint)
      // 4. Custom error returned from backend
      // 5. Fallback "Failed to fetch"

      if (!response.ok) {
        let msg = "Failed to fetch suggestions. ";

        let errorData = "";
        let gotJSON = false;
        try {
          errorData = await response.json();
          gotJSON = true;
        } catch {
          errorData = await response.text();
        }

        if (response.status === 404) {
          msg = "API endpoint not found (404). Please ensure the serverless function is deployed at /api/openai.";
        } else if (response.status === 0 || response.status === 502 || response.status === 503) {
          msg = "Serverless API endpoint is unavailable. If developing locally, ensure your dev server is running and the /api/openai handler is available.";
        } else if (response.status === 401 || response.status === 403) {
          msg = "Access denied to API endpoint. This may be a CORS or deployment configuration issue.";
        } else if (
          gotJSON &&
          errorData &&
          typeof errorData === "object" &&
          errorData.error
        ) {
          msg += errorData.error;
        } else if (typeof errorData === "string" && errorData.length > 0) {
          msg += errorData;
        } else if (response.type === "opaque") {
          // Fetch mode: 'no-cors' produces opaque responses (CORS denied)
          msg = "CORS error: Request blocked by browser. Ensure the serverless endpoint allows this frontend origin.";
        } else {
          msg += "Unknown or unclassified server error.";
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
      // The fetch API throws only on network errors, CORS denial (when NOT using no-cors), or if backend is down.
      let msg = "";
      if (err && typeof err === "object" && err.name === "TypeError") {
        // Check error message for patterns
        if (
          err.message &&
          (err.message.includes("Failed to fetch") ||
           err.message.includes("NetworkError"))
        ) {
          // Check for local dev: is backend running?
          if (
            API_URL.startsWith("http://localhost:4001") &&
            (
              window.location.hostname === "localhost" ||
              window.location.hostname === "127.0.0.1"
            )
          ) {
            msg = "Unable to connect to backend. Is OpenAI proxy running at http://localhost:4001?\nYou may need to run: node openai-proxy.js";
          } else {
            msg = "Network error: Failed to fetch from backend. This may be due to CORS, firewall, or network issues.";
          }
        } else if (
          err.message &&
          (err.message.includes("CORS") || err.message.includes("cross-origin"))
        ) {
          msg = "CORS error: Your browser blocked the request due to cross-origin restrictions. Backend must allow this frontend origin in CORS settings.";
        } else {
          msg = "Unexpected network error: " + err.message;
        }
      } else if (err && err.message) {
        msg = "Failed to fetch suggestions. " + err.message;
      } else {
        msg = "Failed to fetch suggestions due to an unknown error.";
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

  // No more backend proxy dev warning; always POST to /api/openai serverless API

  return (
    <section className="llh-card" style={{ marginTop: 18, marginBottom: 8 }}>
      <h3>
        <span role="img" aria-label="bulb" style={{ marginRight: 7 }}>
          💡
        </span>
        {label}
      </h3>
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
            <b>Security Note:</b> Your API key is protected. In production, always use a serverless API route—never expose OpenAI secrets in the frontend.
          </div>
        )}
      </div>
    </section>
  );
}

export default SkillRecommender;
