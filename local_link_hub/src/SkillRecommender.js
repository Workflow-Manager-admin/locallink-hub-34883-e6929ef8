import React, { useState } from "react";

// PUBLIC_INTERFACE
/**
 * SkillRecommender component uses OpenAI API to return skill suggestions for a user-provided prompt.
 * Recommendations are shown below the prompt input.
 * 
 * The OpenAI API key must be supplied via an environment variable:
 *   REACT_APP_OPENAI_API_KEY (in .env, never hardcoded).
 */
function SkillRecommender({ context = "skill", label = "Skill Suggestions" }) {
  const [userPrompt, setUserPrompt] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // You can further refine this system prompt template for your community's use-case.
  const basePrompt = `You are an expert in local community skill sharing. Suggest practical, in-demand skills for people to offer or request, based on the following request (reply as a short list):\n\n`;

  // PUBLIC_INTERFACE
  async function fetchSkillRecommendations() {
    setLoading(true);
    setError("");
    setSuggestions(null);
    try {
      // Dynamically import OpenAI SDK (tree shaking)
      const { Configuration, OpenAIApi } = await import("openai");
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      if (!apiKey) {
        setError(
          "OpenAI API key is not configured. Please set REACT_APP_OPENAI_API_KEY in your environment."
        );
        setLoading(false);
        return;
      }

      const configuration = new Configuration({
        apiKey,
      });
      const openai = new OpenAIApi(configuration);

      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: basePrompt },
          { role: "user", content: userPrompt || "Suggest useful local skills to share or request." },
        ],
        max_tokens: 120,
        temperature: 0.75,
        n: 1,
      });
      setSuggestions(completion.data.choices[0]?.message?.content?.trim() || "No suggestions found.");
    } catch (err) {
      let msg = "Failed to fetch suggestions.";
      if (err.response && err.response.data && err.response.data.error) {
        msg += " " + err.response.data.error.message;
      } else if (err.message) {
        msg += " " + err.message;
      }
      setError(msg);
    }
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  function handleSubmit(e) {
    e.preventDefault();
    if (!userPrompt.trim()) {
      setError("Please enter a brief description/request for skill suggestions.");
      return;
    }
    fetchSkillRecommendations();
  }

  return (
    <section className="llh-card" style={{ marginTop: 18, marginBottom: 8 }}>
      <h3>
        <span role="img" aria-label="bulb" style={{ marginRight: 7 }}>
          💡
        </span>
        {label}
      </h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label htmlFor="skill-suggest-input" style={{ fontWeight: 550, marginBottom: 4 }}>
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
        >
          {error}
        </div>
      )}
      {suggestions && (
        <div
          style={{
            marginTop: 13,
            background: "#f5faf7",
            border: "1px solid #e2e8e4",
            borderRadius: 8,
            padding: "14px 16px",
            color: "#2D6A4F",
            fontWeight: 515,
            whiteSpace: "pre-wrap"
          }}
        >
          {suggestions}
        </div>
      )}
    </section>
  );
}

export default SkillRecommender;
