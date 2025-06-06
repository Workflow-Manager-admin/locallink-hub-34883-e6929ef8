const express = require('express');
const axios = require('axios');

// PUBLIC_INTERFACE
// Express app that proxies OpenAI API requests, keeping the API key secure on the backend
const app = express();
const PORT = process.env.PORT || 4001; // Use a port that's unlikely to conflict with the frontend

/*
 * Use CORS so the React frontend can call this endpoint in development.
 * In production, you MUST restrict this to your deployed frontend domain (e.g., origin: "https://yourdomain.com").
 * For multi-environment support, you could read allowed origins from env or config.
 */
const allowedOrigins = [
  "http://localhost:3000", // local dev React
  "http://localhost:4001", // self-calls
  "http://127.0.0.1:3000", // support 127.0.0.1 for dev
  "http://127.0.0.1:4001", // support API call from 127.0.0.1
];

// Robust custom CORS middleware for both dev and prod
app.use((req, res, next) => {
  const origin = req.headers.origin;
  // If no origin header (e.g. curl), allow (but don't set CORS)
  if (!origin) return next();
  // Accept localhost:3000, 4001, and any localhost:*
  if (
    allowedOrigins.includes(origin) ||
    (/^http:\/\/localhost:\d{1,5}$/.test(origin))
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    return next();
  } else {
    // Block, but set CORS headers for browser clarity
    res.setHeader("Access-Control-Allow-Origin", "null");
    res.setHeader("Vary", "Origin");
    return res.status(403).json({
      error:
        "CORS policy: This backend only accepts requests from http://localhost:3000, other allowed origins, or your configured dev environment."
    });
  }
});

app.use(express.json());

/**
 * POST /api/openai
 * Accepts { model, messages, ...other OpenAI params } JSON and forwards to OpenAI Chat API.
 * Reads OpenAI API key from OPENAI_API_KEY (server-side env variable!) and NEVER exposes it to clients.
 * Responds with OpenAI's response data, or error (concise JSON).
 */
// PUBLIC_INTERFACE
app.post('/api/openai', async (req, res) => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured on server.' });
  }

  const { model = 'gpt-3.5-turbo', messages, ...rest } = req.body || {};

  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).json({ error: "Missing or invalid 'messages' array for OpenAI completion." });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model,
        messages,
        ...rest, // Pass through additional OpenAI API options (max_tokens, temperature, etc.)
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 12000 // 12s timeout for OpenAI
      }
    );

    // Forward just the OpenAI response payload
    res.status(200).json(response.data);
  } catch (err) {
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

app.get('/', (req, res) => {
  res.send('OpenAI Proxy running. Use POST /api/openai to proxy chat requests.');
});

// Start the backend server (standard Node.js listening)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`OpenAI Proxy listening on port ${PORT}`);
  });
}

module.exports = app;

