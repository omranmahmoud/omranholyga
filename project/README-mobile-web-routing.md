# Unified Web + Mobile (/m) Build & Routing

The project now uses a single Vite multi-page build that outputs:

```
dist/
  index.html          (desktop / root)
  m/index.html        (mobile variant)
  assets/...          (shared chunks)
```

`/m` serves mobile content; desktop stays at `/`. Mobile users are auto-redirected to `/m` via:
- Express middleware (if you run the Node server)
- Netlify Edge Function (if deploying static build on Netlify)

## Build
Just run:
```powershell
npm run build
```
Both entries are emitted in the same `dist` folder (configured in `vite.config.ts`).

## Entrypoints
- `index.html` loads `/src/main.tsx`
- `m/index.html` loads `/src/mobile-main.tsx`
  - Currently `mobile-main.tsx` renders the same `App` component; replace with a dedicated `MobileApp` when ready.

## Redirect Logic (Server)
In `server/index.js` we:
1. Serve `dist` statically at `/` and also mount it at `/m`.
2. On each GET request (excluding assets, `/api`, `/ws`, existing `/m` paths) detect mobile UA and `302` redirect to `/m`.
3. Provide SPA fallbacks:
   - `/m/*` -> `dist/m/index.html`
   - all other non-API routes -> `dist/index.html`

## Redirect Logic (Netlify Edge Function)
File: `netlify/edge-functions/mobile-redirect.js`
Runs at the edge, replicating the same UA detection before static file serving.

## Netlify Config
`netlify.toml` includes:
- `publish = "dist"`
- Redirect rule for `/m/*` -> `/m/index.html`
- SPA fallback for `/*` -> `/index.html`
- Edge function directory declaration.

## Local Development
```powershell
npm run dev   # Vite + Nodemon (no mobile HTML until you create m/index.html - already added)
# or
npm run build
npm run start # Serve built version with redirects
```
Open http://localhost:5000/ (desktop) and emulate mobile user-agent to confirm redirect.

## Customizing Mobile Variant
1. Create `src/MobileApp.tsx` (copy logic from `App.tsx`).
2. Import it inside `mobile-main.tsx` and render `<MobileApp />` instead of `<App />`.
3. Add mobile-only styles or bundle-splitting as needed.

## Bypassing Redirect
Add a query flag (example):
```js
if (url.searchParams.has('desktop') || localStorage.getItem('preferDesktop')==='1') skipRedirect = true;
```
You can adapt the middleware and edge function similarly.

## SEO Considerations
- Add `<link rel="alternate" media="(max-width: 768px)" href="https://yourdomain.com/m" />` in root HTML.
- Add `<link rel="canonical" href="https://yourdomain.com/" />` in `m/index.html` if content is equivalent.

## Single Domain Strategy (Desktop + Mobile)
You are serving both variants from the SAME domain. Key points:

1. Path Preservation: A desktop deep link like `/product/123` will redirect mobile to `/m/product/123` (server + edge updated to preserve path).
2. Internal Links: Desktop HTML should keep normal `/...` links. Mobile HTML (if using different component tree) can optionally render links without the `/m` prefix and rely on redirect (simpler) or explicitly include `/m` (faster first navigation on mobile). Either works.
3. Direct Mobile Sharing: A user sharing a `/m/...` link to a desktop device will load mobile HTML. You can optionally add a desktop-override script in `m/index.html` to bounce back:
   ```html
   <script>
     if (!/mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent)) {
       // Optional: detect explicit mobile preference via localStorage to keep user on /m
       if(!localStorage.getItem('forceMobile')) {
         const newPath = location.pathname.replace(/^\/m/, '') || '/';
         location.replace(newPath + location.search + location.hash);
       }
     }
   </script>
   ```
4. Preference Toggle: Add a footer link: "Desktop site" that stores `localStorage.setItem('preferDesktop','1')` and appends `?desktop=1` to skip redirect (update middleware + edge function to check these conditions).
5. Caching: Because both variants share assets pipeline, ensure no mobile-only global CSS overrides break desktop. Consider conditional class on `<body>` for mobile root mount.
6. Analytics: Send a dimension `variant=mobile|desktop` to distinguish flows. Decide variant server-side (on redirect) or client-side (UA sniff) and push to analytics queue.
7. Performance: If mobile tree is lighter, ensure large desktop-only bundles are dynamically imported so mobile variant does not download them unnecessarily (code splitting + route-level lazy imports).
8. Security: Keep auth flows identical; both variants rely on same origin cookies/localStorage.

To implement skip-redirect logic, modify both server middleware and `mobile-redirect.js` to short-circuit when:
```js
// Example condition snippet
const search = url.search || req.url.split('?')[1] || '';
if (search.includes('desktop=1') || (req?.cookies?.preferDesktop === '1')) return next();
```


## Service Worker (If Added Later)
Use a single scope or register separate service workers with different filenames (e.g. `sw-desktop.js`, `sw-mobile.js`).

## Analytics
Tag page views with a variant label (desktop/mobile) for A/B and behavior tracking.

## Troubleshooting
| Issue | Fix |
|-------|-----|
| Visiting /m shows desktop UI | Ensure `mobile-main.tsx` imports the correct component. |
| Redirect loop | Ensure edge function skips when `pathname` already starts with `/m`. |
| 404 on /m refresh | Confirm `m/index.html` exists in `dist` after build. |
| Assets 404 under /m | Vite output should use absolute paths; verify `base` not misconfigured. |

## Next Enhancements (Optional)
- Add a stored user preference toggle.
- Hydrate different data sets for mobile (lighter payloads).
- Use code-splitting for large desktop-only screens.

---
If you’d like help creating a dedicated `MobileApp` skeleton or optimizing bundle differences, just ask.
