// Central API base resolver.
// Priority: VITE_API_BASE env -> window.__API_BASE__ (if injected) -> '/api'
// When deployed on Netlify, '/api' is proxied (see netlify.toml) to the Render backend.

export const apiBase: string =
  (import.meta as any)?.env?.VITE_API_BASE?.trim() || '/api';

export function withApi(path: string) {
  if (!path.startsWith('/')) path = '/' + path;
  return apiBase.replace(/\/$/, '') + path;
}

// Example usage:
// axios.get(withApi('/products'))
// fetch(withApi('/auth/login'), { method: 'POST', body: JSON.stringify(data) })
