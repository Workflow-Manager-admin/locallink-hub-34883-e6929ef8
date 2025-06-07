 run  # locallink-hub-34883-e6929ef8

## 🔒 Secure OpenAI Integration — Serverless API Endpoint Only

This project now uses a **Next.js/Vercel-style serverless API endpoint** (`api/openai.js`) to securely handle OpenAI requests.  
**You should never expose your OpenAI API key in any client-side (.env) file.**  
All requests from the React frontend must be routed through the new serverless endpoint. This approach prevents browser/user access to your OpenAI secret key and is required for production deployments.

---

### Using the OpenAI API (Serverless Endpoint)

- All frontend requests for skill suggestions or GPT features are POSTed to `/api/openai` (implemented in `api/openai.js`).
- The OpenAI API key is stored securely in your hosting environment (as `OPENAI_API_KEY`, **never** in the frontend).
- No Express backend or openai-proxy.js is used or required.
- Works perfectly for Vercel, Netlify, and serverless-compatible hosts.

**Example Frontend Request:**
```js
await fetch("/api/openai", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Skill suggestion context prompt" },
      { role: "user", content: "I want to learn plumbing." }
    ],
    max_tokens: 120,
    temperature: 0.7
  })
});
```

**API Key Environment Variable:**  
- Set `OPENAI_API_KEY` in your environment configuration (Vercel/Netlify/other host).
- Never put API keys in frontend `.env` or `REACT_APP_*` variables.

---

### Migration Notice: Proxy Removed

**The legacy backend proxy (openai-proxy.js) and related Express server setup have been removed.**  
If you were using the old backend proxy, migrate to `/api/openai.js` as described above.  
You can now deploy frontend and backend together with a unified serverless function, with no manual server maintenance.

---

### Local Development

For local dev, you can use the built-in `/api/openai.js` in your Next.js or similar development server:

1. Set your OpenAI API key in environment:  
   ```
   OPENAI_API_KEY=sk-...    # Do NOT put this in any frontend-accessible file.
   ```
2. Start your dev server (e.g. `npm run dev` or `npm start`).
3. Open your app and use skill suggestion features as normal.

**No separate Express process or openai-proxy.js is required.**

---

### Security Best Practices

- Never expose OpenAI keys to the browser, dev tools, or JS bundles.
- All OpenAI secrets should reside in the serverless environment config only.
- Do not commit or share your .env with secrets or API keys.
- If you see any reference to `openai-proxy.js` in your environment or scripts, remove it—it's deprecated.

---

### Troubleshooting

- **Error: "Server-side OpenAI API key not configured":**  
  Ensure you set the `OPENAI_API_KEY` variable in your environment.
- **404 or CORS error:**  
  - Check that your deployment platform auto-routes `/api/openai` correctly (Next.js/Netlify serverless functions).
  - Make sure you are not trying to use an old proxy URL.

---

### References

- [OpenAI API Reference](https://platform.openai.com/docs/api-reference/chat)
- [Serverless Functions with Vercel](https://vercel.com/docs/concepts/functions/serverless-functions)
- [CORS in Serverless APIs](https://vercel.com/docs/concepts/functions/serverless-functions#enabling-cors)

---

**Keep your secrets secret** — never share or upload API keys with any frontend, repository, or third party.
