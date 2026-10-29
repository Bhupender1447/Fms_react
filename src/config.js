// Local development uses its local database/API unless explicitly overridden.
// Matching localhost/127.0.0.1 also keeps cookie sessions on the same site.
export function resolveApiUrl(configuredUrl, environment, hostname) {
  const localHosts = ['localhost', '127.0.0.1'];
  const local = environment === 'development' && localHosts.includes(hostname);
  const apiUrl = configuredUrl || (local ? `http://${hostname}:8080/` : 'https://isovia.ca/fms_api/');
  if (local) {
    try {
      const parsed = new URL(apiUrl);
      if (localHosts.includes(parsed.hostname)) { parsed.hostname = hostname; return parsed.toString(); }
    } catch { /* Relative URLs retain their existing behavior. */ }
  }
  return apiUrl;
}
export const BASE_URL = resolveApiUrl(process.env.REACT_APP_API_URL, process.env.NODE_ENV,
  typeof window !== 'undefined' ? window.location.hostname : undefined);
