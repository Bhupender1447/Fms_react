const configuredApiUrl = process.env.REACT_APP_API_URL || "https://isovia.ca/fms_api/";
// Local cookie sessions must use the same hostname as the frontend.
// localhost and 127.0.0.1 are different cookie sites even on one computer.
const localHosts = ['localhost', '127.0.0.1'];
let apiUrl = configuredApiUrl;
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined'
    && localHosts.includes(window.location.hostname)) {
  try {
    const parsed = new URL(configuredApiUrl);
    if (localHosts.includes(parsed.hostname)) {
      parsed.hostname = window.location.hostname;
      apiUrl = parsed.toString();
    }
  } catch {
    // Preserve relative API URLs and existing configuration behavior.
  }
}
export const BASE_URL = apiUrl;
