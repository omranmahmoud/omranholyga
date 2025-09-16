// Netlify Edge Function for mobile UA redirect to /m
// Deploy with Netlify. Applies to all paths; skip assets & existing /m requests.
export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname;
  // Quick skips
  if (path.startsWith('/api') || path.startsWith('/ws') || path.startsWith('/m')) {
    return context.next();
  }
  if (/\.[a-zA-Z0-9]+$/.test(path)) { // asset file
    return context.next();
  }
  const ua = (request.headers.get('user-agent') || '').toLowerCase();
  if (/(iphone|ipad|ipod|android|blackberry|bb10|opera mini|windows phone|mobile|silk)/.test(ua)) {
    url.pathname = '/m' + (path === '/' ? '' : path);
    return Response.redirect(url.toString(), 302);
  }
  return context.next();
};

export const config = { path: '/*' };
