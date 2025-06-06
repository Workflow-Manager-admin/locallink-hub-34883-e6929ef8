# locallink-hub-34883-e6929ef8

## ℹ️ Using the OpenAI Secure Proxy Backend

For secure skill suggestions in production, don't expose your OpenAI API key in `.env`—instead use the backend proxy included in this project.

**How to use:**
1. Copy or move `openai-proxy.js` to the project root (or your server folder).
2. Run `npm install express axios cors` in your project root to install required dependencies.
3. Create a `.env` file (at the root, not in the frontend!) and add:
   ```
   OPENAI_API_KEY=sk-...
   ```
   Use your real OpenAI secret key.
4. Start the proxy server:
   ```
   node openai-proxy.js
   ```
   The proxy runs at http://localhost:4001 (or set PORT env).

**Frontend calls:**  
Send POST requests from your React app to `http://localhost:4001/api/openai` with the same payload as you'd send to OpenAI, and remove any direct calls to the OpenAI API or usage of `REACT_APP_OPENAI_API_KEY`.  

**This approach keeps your OpenAI key hidden from browsers and allows robust user-facing error messages.**