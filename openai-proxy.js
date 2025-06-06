// =====================================================================
// openai-proxy.js - Secure Express Backend Proxy for OpenAI Chat API
// =====================================================================
// This backend keeps your OpenAI API key safe on the server side—never
// expose it to the frontend or any client browser!
//
// ---------------------------------------------------------------------
// .env SAMPLE: (create a file called `.env` in your project root)
// ---------------------------------------------------------------------
// OPENAI_API_KEY=sk-...      # (Required) Your OpenAI secret key here
// PORT=4001                  # (Optional) Backend port (default 4001)
//
// ---------------------------------------------------------------------
// Install dependencies (run in project root):
//   npm install express axios cors dotenv
//
// Start the backend server:
//   node openai-proxy.js
//
// Proxy will listen at http://localhost:4001 by default.
// POST requests to /api/openai will be securely forwarded to OpenAI Chat API.
//
// ---------------------------------------------------------------------
//
// For production: restrict allowedOrigins below to only your deployed frontend!
// Read the project README for migration and security guidance.
//
// =====================================================================

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4001;

// CORS SETUP (local dev + prod: edit as needed!)
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:4001',
  'http://127.0.0.1:4001',
  // Add your production frontend domain(s) here:
  // 'https://your-frontend-domain.com'
];

// Custom robust CORS: Always allows localhost; restricts others
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin) return next(); // Allow e.g. curl/no-origin calls

  if (
    allowedOrigins.includes(origin) ||
    /^http:\/\/localhost:\d{1,5}$/.test(origin) ||
    /^http:\/\/127\.0\.0\.1:\d{1,5}$/.test(origin)
  ) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    return next();
  }
  res.setHeader('Access-Control-Allow-Origin', 'null');
  res.setHeader('Vary', 'Origin');
  return res.status(403).json({
    error:
      "CORS policy: Request origin not permitted. Edit openai-proxy.js allowedOrigins list for your frontend deployment."
  });
});

app.use(express.json());

/**
 * PUBLIC_INTERFACE
 * POST /api/openai
 * Proxy endpoint for OpenAI chat completions API.
 * Reads the API key from process.env.OPENAI_API_KEY ONLY (never exposes).
 * Forwards body {model, messages, ...} to the OpenAI API.
 * Streams or returns all OpenAI responses; handles errors robustly.
 */
app.post('/api/openai', async (req, res) => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured on server.' });
  }

  const { model = "gpt-3.5-turbo", messages, ...rest } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Missing or invalid 'messages' array for OpenAI completion." });
  }

  // By default, do NOT stream responses (set stream: true to enable experimental SSE)
  const stream = !!rest.stream;

  try {
    if (stream) {
      // Stream OpenAI's SSE directly to client
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        { model, messages, ...rest, stream: true },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          responseType: 'stream',
        }
      );
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      response.data.pipe(res);
    } else {
      // Standard completion (JSON)
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        { model, messages, ...rest },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 12000
        }
      );
      res.status(200).json(response.data);
    }
  } catch (err) {
    // Structure-friendly JSON error for frontend
    let errMsg = 'OpenAI API proxy error.';
    let status = 500;
    if (err.response && err.response.data) {
      status = err.response.status || 502;
      errMsg = err.response.data?.error?.message || JSON.stringify(err.response.data);
    } else if (err.code === 'ECONNABORTED') {
      errMsg = 'OpenAI API request timed out';
      status = 504;
    } else if (err.message) {
      errMsg = err.message;
    }
    res.status(status).json({ error: errMsg });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('OpenAI Proxy running. Use POST /api/openai to proxy chat requests.');
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`OpenAI Proxy listening on port ${PORT}`);
  });
}

module.exports = app;
