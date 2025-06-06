//
// openai-proxy.js - Secure Express Proxy Server for OpenAI API
//
// This proxy ensures your OpenAI API key is kept on the server-side ONLY.
// Never expose your API key to the frontend!
//
// ---
// .env SETUP (Create a .env file in your project root with the following lines):
//
//   OPENAI_API_KEY=sk-...        # Your OpenAI API key (required, never share!)
//   PORT=4001                    # Optional: Port for backend proxy (default 4001)
//
// ---
// Install server dependencies (run in project root):
//   npm install express axios cors dotenv
//
// Start the backend proxy server:
//   node openai-proxy.js
//
// The proxy will listen on http://localhost:4001 by default.
// POST requests to http://localhost:4001/api/openai will be forwarded to the OpenAI API securely.
//

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

// PUBLIC_INTERFACE
// Express app that proxies OpenAI API requests, keeping the API key secure on the backend
const app = express();
const PORT = process.env.PORT || 4001;

// --- CORS SETUP (Development + Production) ---
// Update allowedOrigins for your deployment scenario below.
const allowedOrigins = [
  "http://localhost:3000",    // local React dev
  "http://127.0.0.1:3000",
  "http://localhost:4001",    // self API call (e.g., tests)
  "http://127.0.0.1:4001"
  // Add your deployed frontend origin(s) here for production, e.g.:
  // "https://your-frontend-domain.com"
];

// Robust custom CORS middleware: allows all localhost, optionally restricts to allowedOrigins
app.use((req, res, next) => {
  const origin = req.headers.origin;
  // Allow requests with no Origin (CLI, e.g. curl)
  if (!origin) return next();
  if (
    allowedOrigins.includes(origin) ||
    /^http:\/\/localhost:\d{1,5}$/.test(origin) ||
    /^http:\/\/127\.0\.0\.1:\d{1,5}$/.test(origin)
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    return next();
  }
  // Forbidden origin (not in allowed list)
  res.setHeader("Access-Control-Allow-Origin", "null");
  res.setHeader("Vary", "Origin");
  return res.status(403).json({
    error:
      "CORS policy: Request origin not permitted. Edit openai-proxy.js allowedOrigins list for your frontend deployment."
  });
});

app.use(express.json());

/**
 * PUBLIC_INTERFACE
 * POST /api/openai
 * Proxies a request containing { model, messages, ...otherOpenAIParams }
 * OpenAI API key is loaded from process.env.OPENAI_API_KEY (NEVER exposed or returned).
 * Returns OpenAI response or JSON error.
 */
app.post('/api/openai', async (req, res) => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "OpenAI API key not configured on server." });
  }

  const { model = "gpt-3.5-turbo", messages, ...rest } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Missing or invalid 'messages' array for OpenAI completion." });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      { model, messages, ...rest },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 12000
      }
    );
    res.status(200).json(response.data);
  } catch (err) {
    // Structure-friendly JSON error for frontend consumers
    let errMsg = "OpenAI API proxy error.";
    let status = 500;
    if (err.response && err.response.data) {
      status = err.response.status || 502;
      errMsg = err.response.data?.error?.message || JSON.stringify(err.response.data);
    } else if (err.code === 'ECONNABORTED') {
      errMsg = "OpenAI API request timed out";
      status = 504;
    } else if (err.message) {
      errMsg = err.message;
    }
    res.status(status).json({ error: errMsg });
  }
});

// Health check/root
app.get('/', (req, res) => {
  res.send('OpenAI Proxy running. Use POST /api/openai to proxy chat requests.');
});

// Start the backend server (if run directly)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`OpenAI Proxy listening on port ${PORT}`);
  });
}

module.exports = app;
