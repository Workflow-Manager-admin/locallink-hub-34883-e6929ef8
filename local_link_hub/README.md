# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies for rapid prototyping and customization.

## Features

- **Lightweight**: No heavy UI frameworks—uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA branding
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

### OpenAI Integration Setup (`Skill Suggester`)

This app includes an AI-powered skill suggester, which requires you to supply an **OpenAI API key** at runtime.

**Steps to enable the Skill Suggester:**

1. **Create a `.env` file in the `local_link_hub` directory** (same place as `package.json`):

    ```
    REACT_APP_OPENAI_API_KEY=sk-...
    ```

    Replace `sk-...` with your actual OpenAI secret key.

2. **Important Security Note**  
   - This method exposes your OpenAI API key to the browser!  
   - **Do not use this in production or share your .env file.**  
   - In production, always use a backend proxy to keep your API key secret.

3. **Restart your dev server**  
   After saving or changing `.env`, stop and restart your local server:
    ```
    npm start
    ```
   This loads environment variables into the React build.

4. **Where is the .env file loaded from?**  
    `.env` must be placed in the `local_link_hub/` folder, alongside `package.json`.  
    Do **not** commit this file or your API key to version control.

5. **If you see an error about missing API key:**  
   - Ensure the variable is present and correctly named in `.env`.
   - Restart your dev server.  
   - If the Skill Suggester UI warns "OpenAI API key is not set...", refer to the example above.

**Warning:**  
React apps bundle all `REACT_APP_*` environment variables at build time, and they are visible to anyone using your site.  
**Do not use this integration for sensitive or production workloads.**  
If you need the AI feature in production, replace the direct frontend OpenAI call with an API route on your secure backend—never expose your OpenAI secrets in frontend configs.

---

## API Proxy Usage in Production

If using a backend OpenAI proxy:
- Set your API endpoint in `SkillRecommender.js` using the env variable `REACT_APP_OPENAI_PROXY_URL`
- **If deploying the frontend to Netlify, Vercel, or any cloud host, your backend/proxy cannot remain on localhost**.  
  - Deploy the server and set the API URL to your cloud/server origin.
  - Update backend CORS to allow the frontend’s domain.


## Local Development Steps

1. Clone this repository and navigate to `local_link_hub/`.
2. Run `npm install` to install dependencies.
3. Create your `.env` as described above **(if using the skill AI feature)**.
4. Start the app:
    ```
    npm start
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

- **`npm start`** — Runs the app in development mode.
- **`npm test`** — Launches the test runner in interactive watch mode.
- **`npm run build`** — Builds the app for production to the `build` folder.

## Customization

### Colors

The primary brand colors are defined as CSS variables in `src/App.css`:
```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components. See `src/App.css` for examples:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

## ⚠️ API Key Security Best Practices

- Never share or commit your API keys.
- Any `REACT_APP_*` variable *will be visible in your production JavaScript* and exposed to users.
- Use a backend service to handle sensitive API requests for real deployments.
- For more info, see [Environment Variables in Create React App](https://create-react-app.dev/docs/adding-custom-environment-variables/)

---

### Further Reading

[Code Splitting docs](https://facebook.github.io/create-react-app/docs/code-splitting)  
[Analyzing the Bundle Size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)
[Making a Progressive Web App](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)
[Advanced Configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)
[Deployment](https://facebook.github.io/create-react-app/docs/deployment)
[Troubleshooting: npm run build fails to minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
