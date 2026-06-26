---
name: API Proxy Setup
description: Vite proxy config needed to route frontend /api calls to the Express api-server on port 8080
---

The `artifacts/web/vite.config.ts` must include a `server.proxy` block to forward API calls to the backend.

**Rule:** Add proxy for `${basePath}api` targeting `http://localhost:8080`, with a rewrite that strips the `basePath` prefix.

**Why:** Without the proxy, Vite serves the SPA HTML for any unmatched route including `/api/...`, causing all API calls to fail with HTML responses.

**How to apply:** In vite.config.ts `server` block:
```ts
proxy: {
  [`${basePath}api`]: {
    target: "http://localhost:8080",
    rewrite: (path) => path.replace(new RegExp(`^${basePath}`), "/"),
    changeOrigin: true,
  },
},
```
