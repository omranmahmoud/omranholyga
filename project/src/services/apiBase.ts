// Central API base resolver.
// Priority:
// 1. VITE_API_BASE env (explicit override)
// 2. window.__API_BASE__ (if injected at runtime)
// 3. If running on Netlify domain AND no override, use the Render backend origin directly (bypass proxy)
// 4. Fallback '/api' (works locally via Vite dev proxy & Netlify redirect rule)

function detectNetlifyHost(host?: string) {
  if (!host) return false;
  return host.endsWith('.netlify.app');
}

function computeBase(): string {
  const envVal = (import.meta as any)?.env?.VITE_API_BASE?.trim();
  if (envVal) return envVal.replace(/\/$/, '');
  // Runtime injected global (optional pattern)
  if (typeof window !== 'undefined' && (window as any).__API_BASE__) {
    return String((window as any).__API_BASE__).replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    const { origin, host } = window.location;
    if (detectNetlifyHost(host)) {
      // Point directly to Render backend (provided by user)
      return 'https://omraneva.onrender.com/api';
    }
    return origin + '/api';
  }
  return '/api';
}

export const apiBase: string = computeBase();

export function withApi(path: string) {
  if (!path.startsWith('/')) path = '/' + path;
  return apiBase.replace(/\/$/, '') + path;
}

// Example usage:
// axios.get(withApi('/products'))
// fetch(withApi('/auth/login'), { method: 'POST', body: JSON.stringify(data) })
