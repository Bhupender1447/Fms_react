export const getOcrErrorMessage = (error, fallback = 'OCR could not process this document.') => {
  const response = error?.response;
  const payload = response?.data;
  if (response?.status === 401) {
    return 'Your session has expired or is missing. Sign in again using this app address, then retry OCR. Your selected document has not been processed.';
  }
  if (response?.status === 403) {
    return 'OCR access was denied. Confirm your account permissions and use the same app address you signed in with.';
  }

  if (payload && typeof payload === 'object') {
    const message = payload.error || payload.message;
    const details = Array.isArray(payload.details) ? payload.details.join(' ') : payload.details;
    if (message) return [message, details].filter(Boolean).join(' ');
  }

  if (typeof payload === 'string' && /<\s*(?:!doctype|html|div)\b/i.test(payload)) {
    return 'The OCR server returned a PHP error page. Check the backend and database configuration.';
  }

  if (response?.status === 413) return 'This document is too large for the server upload limit.';
  if (!response) return 'Could not reach the OCR server. Check the connection and try again.';
  return fallback;
};

export const getOcrResponseErrorMessage = (response, fallback = 'OCR could not process this document.') => {
  const payload = response?.data;
  if (!payload || typeof payload !== 'object') {
    if (typeof payload === 'string' && /<\s*(?:!doctype|html|div)\b/i.test(payload)) {
      return 'The OCR server returned a PHP error page. Check the backend and database configuration.';
    }
    return fallback;
  }
  if (payload.success !== false) return fallback;
  const message = payload.error || payload.message;
  const details = Array.isArray(payload.details) ? payload.details.join(' ') : payload.details;
  return [message, details].filter(Boolean).join(' ') || fallback;
};
