import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * SkillRecommender component uses OpenAI API to return skill suggestions for a user-provided prompt.
 *
 * The OpenAI API key must be supplied via an environment variable at runtime:
 *   REACT_APP_OPENAI_API_KEY (in .env, never hardcoded).
 *   This key must NOT be exposed, committed, or bundled at build time for security.
 *   In client-side React, all REACT_APP_* variables are injected at build time; therefore,
 *   usage of such keys in production frontend code is discouraged. This component is for development/test scenarios only.
 *
 * If the API key is not available, a clear error message is shown in the UI.
 */
function SkillRecommender({ context = "skill", label = "Skill Suggestions" }) {
  const [userPrompt, setUserPrompt] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // The system prompt for OpenAI
  const basePrompt =
    "You are an expert in local community skill sharing. Suggest practical, in-demand skills for people to offer or request, based on the following request (reply as a short list):\n\n";

  // At runtime, check for presence of API key (works only for variables starting REACT_APP_)
  // Warn users in production that API keys here are visible in the client.
  // It is best practice NOT to request OpenAI directly from the frontend in production products!
  const apiKey = (() => {
    // At runtime, this is as good as we get — any REACT_APP_* variable is bundled by Create React App at build time
    if (
      typeof process === "undefined" ||
      !process.env ||
      typeof process.env.REACT_APP_OPENAI_API_KEY !== "string"
    ) {
      return "";
    }
    return process.env.REACT_APP_OPENAI_API_KEY;
  })();

  // PUBLIC_INTERFACE
  async function fetchSkillRecommendations() {
    setLoading(true);
    setError("");
    setSuggestions(null);

    if (!apiKey || !apiKey.trim()) {
      setError(
        "OpenAI API key is not configured. Please create a .env file in the local_link_hub/ directory with REACT_APP_OPENAI_API_KEY set. See README for details."
      );
      setLoading(false);
      return;
    }

    try {
      // Dynamically import OpenAI SDK on demand
      const { Configuration, OpenAIApi } = await import("openai");

      const configuration = new Configuration({
        apiKey,
      });
      const openai = new OpenAIApi(configuration);

      const completion = await openai.createChatCompletion({
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
      });

      setSuggestions(
        completion.data.choices[0]?.message?.content?.trim() ||
          "No suggestions found."
      );
    } catch (err) {
      let msg = "Failed to fetch suggestions. ";
      // If error is likely due to incorrect/missing key
      if (
        err.response &&
        err.response.data &&
        err.response.data.error &&
        err.response.data.error.message
      ) {
        msg += err.response.data.error.message;
      } else if (
        err.message &&
        /api[\s_-]?key|configuration|unauthorized|401|forbidden/i.test(
          err.message
        )
      ) {
        msg +=
          "API key error: Please verify your .env file is correct and restart the app.";
      } else if (err.message) {
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

  // If API key missing, proactively warn the user (even before form submission)
  const missingKey =
    !apiKey || !apiKey.trim()
      ? "❌ OpenAI API key is not set. Please configure REACT_APP_OPENAI_API_KEY in a .env file at project root. Restart the server after editing the file. The app cannot access OpenAI without this key."
      : null;

  return (
    <section className="llh-card" style={{ marginTop: 18, marginBottom: 8 }}>
      <h3>
        <span role="img" aria-label="bulb" style={{ marginRight: 7 }}>
          💡
        </span>
        {label}
      </h3>
      {missingKey && (
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
          {missingKey}
          <br />
          <span style={{ fontWeight: 400, fontSize: "0.93em" }}>
            <b>Frontend Only Demo Note:</b> For production, proxy API requests through a secure backend to avoid exposing your OpenAI key.
          </span>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
        aria-disabled={!!missingKey}
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
          disabled={!!missingKey || loading}
        />
        <button
          type="submit"
          className="llh-btn-accent"
          style={{ alignSelf: "flex-start", minWidth: 78, fontWeight: 650 }}
          disabled={!!missingKey || loading}
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
            <b>Warning:</b> API keys set in .env files are still visible in the build output. For real deployments, use a backend proxy to call OpenAI securely―never expose your key client-side.
          </div>
        )}
      </div>
    </section>
  );
}

export default SkillRecommender;
