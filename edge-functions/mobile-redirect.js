// Netlify Edge Function for mobile UA redirect to /m
// Placed at repository root in edge-functions/ per Netlify conventions.
// Adds desktop preference cookie support and defensive guards.
export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // Skip if already mobile variant or API / assets / websocket
  if (path.startsWith('/m') || path.startsWith('/api') || path.startsWith('/ws')) {
    return context.next();
  }
  if (/\.[a-zA-Z0-9]+$/.test(path)) { // static asset
    return context.next();
  }

  const headers = request.headers;
  const ua = (headers.get('user-agent') || '').toLowerCase();
  const cookie = headers.get('cookie') || '';

  // Respect desktop preference cookie
  if (/preferDesktop=1/.test(cookie)) {
    return context.next();
  }

  // Basic mobile detection
  const isMobile = /(iphone|ipad|ipod|android|blackberry|bb10|opera mini|windows phone|mobile|silk)/.test(ua);
  if (!isMobile) return context.next();

  // Redirect preserving deep path
  url.pathname = '/m' + (path === '/' ? '' : path);
  return Response.redirect(url.toString(), 302);
};

export const config = { path: '/*' };
