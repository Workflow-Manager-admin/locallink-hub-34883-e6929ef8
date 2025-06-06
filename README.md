 run  # locallink-hub-34883-e6929ef8

## 🔒 Secure OpenAI Integration with Backend Proxy

This project now uses a backend Node/Express proxy server to securely handle OpenAI requests. **You should never expose your OpenAI API key in any client-side (.env) file.**  
All requests from the React frontend must be routed through the backend proxy. This approach fully prevents browser/user access to your OpenAI secret key, and is required for production deployments.

---

### Proxy Server Setup & Deployment

**Prerequisites:**
- Node.js >= 14
- NPM

**Installation & Running the Proxy:**
1. **Ensure `openai-proxy.js` is present at your project root** (or in your server directory).
2. **Install dependencies:**
   ```bash
   npm install express axios cors
   ```
3. **Create a backend `.env` file** in the project root (not inside `local_link_hub/`):
   ```
   OPENAI_API_KEY=sk-...      # <-- Your real OpenAI API key here (never share or commit!)
   PORT=4001                  # Optional: Change backend port if needed
   ```
4. **Start the proxy server:**
   ```bash
   node openai-proxy.js
   ```
   The proxy will run at http://localhost:4001 by default.

**Environment Variable:**  
- `OPENAI_API_KEY` _must_ be set in the server's environment (either via a `.env` file loaded with [dotenv](https://www.npmjs.com/package/dotenv), or set inline before starting the server).

---

### Usage from React Frontend

**How It Works:**  
- The React frontend sends POST requests to `/api/openai` on the proxy, _not_ directly to OpenAI.
- The OpenAI secret key is never sent to the frontend.

**Example Frontend Request:**
```js
await fetch("http://localhost:4001/api/openai", {
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

**Direct Curl Test (verify backend proxy from terminal):**
```bash
curl -X POST http://localhost:4001/api/openai \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      { "role": "system", "content": "Skill suggestion context prompt" },
      { "role": "user", "content": "I want to learn plumbing." }
    ],
    "max_tokens": 120,
    "temperature": 0.7
  }'
```
If you get a valid JSON response, the backend proxy is working correctly. If you see a CORS error, 403, or 500, check backend logs, .env, and proxy settings.

**Frontend Configuration:**
- By default, the frontend sends OpenAI requests to `http://localhost:4001/api/openai` (see `SkillRecommender.js`).
- If proxy/backend is deployed under a custom domain/route, set `REACT_APP_OPENAI_PROXY_URL` in your frontend `.env` to override.
- ⚠️ **If you deploy the frontend to a cloud provider (e.g., Netlify, Vercel), you CANNOT use a backend running on localhost. The cloud frontend cannot access your local machine.**  
  - You must also deploy the backend (proxy server) to a cloud-accessible provider (Heroku, Render, Railway, etc).
  - Set the `REACT_APP_OPENAI_PROXY_URL` in the cloud/frontend environment to point to your deployed proxy (e.g., `https://your-proxy-host/api/openai`).

**PRODUCTION RULE:**  
Always keep both backend and frontend in the same network scope:  
- For local development, run both locally (`localhost:3000`, `localhost:4001`).
- For production or cloud preview, both must be internet-accessible and CORS configured. Update both frontend `.env` and backend CORS to match.

---

### Security Notes

- **API keys are _never_ exposed to browsers, dev tools, or Javascript bundles.**
- The only place your OpenAI key exists is server-side (`OPENAI_API_KEY`).
- Never add the OpenAI key to any `REACT_APP_*` variable or any frontend-accessible locations.
- The proxy only accepts requests from allowed origins (see CORS restrictions in `openai-proxy.js`). Adjust for your environment.

---

### Production vs. Local Development

| Scenario         | Backend Proxy Deployment           | Frontend Change                                | Security           |
|------------------|------------------------------------|------------------------------------------------|--------------------|
| Development      | Run proxy locally (`node openai-proxy.js`) | Use `http://localhost:4001/api/openai` in frontend | Key private (server) |
| Production       | Deploy proxy on your own server/VPS | Set frontend API URL to your server/proxy domain | Key private (server) |
| SPA+API same host| Serve both from one domain         | Change proxy to relative path (e.g., `/api/openai`) | Key private (server) |

- **Change the CORS origin restriction** in `openai-proxy.js` for public deployments.
- If deploying both frontend and backend together (same domain), you may route frontend `/api/openai` calls directly to your proxy via `/api/openai`.

---

### Migration/Upgrade: Moving From Frontend API Key to Backend Proxy

If you previously configured your OpenAI key in the frontend `.env` using `REACT_APP_OPENAI_API_KEY`, **you must migrate to the new backend proxy approach:**

**Migration Steps:**
1. **Remove or ignore the API key from `local_link_hub/.env`.**
   - Delete the `REACT_APP_OPENAI_API_KEY` line (or the whole file, if it's only for OpenAI).
   - Never commit your OpenAI key to the repo or bundle it with the app.
2. **Follow the Backend Setup steps above.**
   - Place your OpenAI key in the server's `.env` or environment.
3. **Restart both the proxy and your frontend server.**
4. **Your Skill Suggestion feature and other OpenAI calls now work via the backend proxy.**

> **Note:**  
> Frontend `.env` variables prefixed with `REACT_APP_` are _always embedded into the built JS bundle_ and are accessible to users.  
> **It is not secure to ever expose OpenAI keys this way.**  
> If you have deployed this app with a frontend-embedded OpenAI key, rotate your secret immediately and migrate to server-side storage.

---

### Example: Local Development

```bash
# Terminal 1: Start backend proxy
export OPENAI_API_KEY=sk-...        # Or set in .env
node openai-proxy.js

# Terminal 2: Start React frontend
cd local_link_hub
npm install
npm start
```
- Open the app at `http://localhost:3000`
- Make sure the backend proxy is running and accessible at `http://localhost:4001/api/openai`

---

### Example: Production Deployment

1. Deploy `openai-proxy.js` and its dependencies on your backend/server.
2. Secure the server (`OPENAI_API_KEY` set using environment variables or a secret manager).
3. Deploy frontend (e.g., static build from `local_link_hub/build`) to your chosen host or CDN.
4. Update proxy URL in frontend as needed (`REACT_APP_OPENAI_PROXY_URL` or relative `/api/openai`).
5. Restrict CORS in `openai-proxy.js` to your domain only.

---

### Troubleshooting

- **Error: "OpenAI API key not configured on server"**:  
  Ensure `OPENAI_API_KEY` is set in your backend environment or `.env`.

- **404 or CORS error from frontend**  
  - Confirm the backend proxy is running and reachable from your frontend.
  - Adjust proxy URL or CORS origin as needed.

- **Warning about API key exposure:**  
  - If you see this, you are still using a frontend `.env` key. Remove and migrate as above.

---

### References and Further Reading

- [OpenAI API Reference](https://platform.openai.com/docs/api-reference/chat)
- [Express.js](https://expressjs.com/)
- [CORS Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Create React App: Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)

---

**Always keep your secrets secret** – never share or upload your OpenAI keys to any frontend, repository, code sandbox, or with anyone you do not fully trust.
