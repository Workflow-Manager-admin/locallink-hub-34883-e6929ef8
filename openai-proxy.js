require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 4001;

// --- CORS settings: Add any frontend origins you want to allow here
const allowedOrigins = [
  "http://localhost:3000" // Default React dev server
  // Add production frontend URLs here, e.g., 'https://my-frontend.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // If no origin header, allow (for curl/local), else check explicit list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(
        new Error(
          "CORS Error: Origin not allowed. Add your frontend URL to allowedOrigins in openai-proxy.js."
        )
      );
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// --- Health check endpoint
app.get("/", (req, res) => {
  res.send("OpenAI Proxy backend running.");
});

// --- Main proxy endpoint
app.post("/api/openai", async (req, res) => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY || typeof OPENAI_API_KEY !== "string" || !OPENAI_API_KEY.startsWith("sk-")) {
    return res.status(500).json({
      error: "OpenAI API key not configured on server. Set OPENAI_API_KEY in .env or your server environment.",
    });
  }

  try {
    // Forward request to OpenAI
    const { model, messages, max_tokens, temperature, n, ...otherParams } = req.body;

    const openaiRes = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model,
        messages,
        max_tokens,
        temperature,
        n,
        ...otherParams,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    res.status(200).json(openaiRes.data);
  } catch (err) {
    if (err.response) {
      // Pass on OpenAI error details to frontend for diagnosis
      res.status(err.response.status).json({
        error: err.response.data?.error?.message || "OpenAI API error",
        data: err.response.data,
      });
    } else {
      res.status(500).json({
        error: "Internal server/proxy error: " + err.message,
      });
    }
  }
});

// --- Fallback for all other routes
app.use((req, res) => {
  res.status(404).json({ error: "Not Found (proxy only responds to /api/openai)" });
});

// --- Start server
app.listen(PORT, () => {
  console.log(`OpenAI Proxy listening on port ${PORT}`);
});

