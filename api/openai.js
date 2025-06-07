const fetch = require('node-fetch');

/**
 * PUBLIC_INTERFACE
 * Secure serverless edge API proxy to OpenAI GPT endpoints.
 * - Accepts POST from frontend: model, messages, params.
 * - Reads OpenAI key from process.env.OPENAI_API_KEY ONLY (never in frontend).
 * - Forwards request to OpenAI; returns full response JSON to client.
 * - Handles CORS requirements robustly (suitable for serverless like Vercel/Netlify).
 * - Does not expose any secrets to frontend.
 * - Easy to deploy as /api/openai.js (Vercel/Next.js API route).
 */
module.exports = async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.status(204).end();
    return;
  }

  // Allow CORS for all origins (adjust here for stricter production security)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed: use POST' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || typeof apiKey !== "string" || !apiKey.startsWith("sk-")) {
    return res
      .status(500)
      .json({ error: "Server-side OpenAI API key not configured. Set OPENAI_API_KEY in environment." });
  }

  let payload;
  try {
    payload = req.body;
    // If deployed under Next.js/Express, body might be parsed
    if (typeof payload === "string") payload = JSON.parse(payload);
  } catch (e) {
    return res.status(400).json({ error: "Malformed JSON in request body." });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
    const result = await openaiRes.json();
    if (!openaiRes.ok) {
      return res.status(openaiRes.status).json({
        error: result?.error?.message || "Error from OpenAI",
        data: result,
      });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Upstream communication failure: " + err.message });
  }
};

/**
 * -- DEPLOYMENT NOTES --
 * 1. Place this file in your serverless app's /api/ directory (e.g., Vercel, Next.js).
 * 2. Set env var `OPENAI_API_KEY` in your deployment environment - do NOT commit this key anywhere!
 * 3. Accepts POST, CORS handled for all origins ('*' by default; restrict in production).
 * 4. Frontend POSTs to /api/openai with payload: {model, messages, ...}. No API key visible to client.
 * 5. Easily extensible: e.g., restrict origins, add auth, ratelimit, etc.
 */
