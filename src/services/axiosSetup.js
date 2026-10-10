import axios from 'axios';

/**
 * Global Axios Configuration & Duplicate Request Prevention
 * 
 * Prevents multiple identical mutating requests (POST, PUT, DELETE, PATCH)
 * from being dispatched within a 2.5-second cooldown window.
 * This directly prevents duplicate record creation in database tables
 * caused by rapid clicks, double-submitting forms, or React re-renders.
 */

const pendingMutations = new Map();
const DEDUPLICATION_WINDOW_MS = 2500;

function generatePayloadSignature(data) {
  if (!data) return '';
  
  if (data instanceof FormData) {
    const parts = [];
    data.forEach((val, key) => {
      if (val instanceof File) {
        parts.push(`${key}:file(${val.name},${val.size})`);
      } else {
        parts.push(`${key}:${String(val)}`);
      }
    });
    return parts.sort().join('|');
  }

  if (typeof data === 'string') {
    return data;
  }

  try {
    return JSON.stringify(data);
  } catch (e) {
    return String(data);
  }
}

// Request Interceptor
axios.interceptors.request.use(
  (config) => {
    const method = (config.method || 'get').toLowerCase();

    // Only apply deduplication to mutating actions
    if (['post', 'put', 'delete', 'patch'].includes(method)) {
      const url = config.url || '';
      const payloadSig = generatePayloadSignature(config.data);
      const requestKey = `${method}:${url}:${payloadSig}`;
      const now = Date.now();

      if (pendingMutations.has(requestKey)) {
        const lastTimestamp = pendingMutations.get(requestKey);
        if (now - lastTimestamp < DEDUPLICATION_WINDOW_MS) {
          console.warn(`[Axios Deduplication] Blocked duplicate ${method.toUpperCase()} to "${url}" within ${DEDUPLICATION_WINDOW_MS}ms.`);
          
          const controller = new AbortController();
          config.signal = controller.signal;
          controller.abort('DUPLICATE_SUBMISSION_PREVENTED');
          config._isDuplicateBlocked = true;
          return config;
        }
      }

      pendingMutations.set(requestKey, now);

      // Clean up cache entry after window expires
      setTimeout(() => {
        pendingMutations.delete(requestKey);
      }, DEDUPLICATION_WINDOW_MS + 500);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to gracefully handle blocked duplicates
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isCancel(error) ||
      error?.message === 'DUPLICATE_SUBMISSION_PREVENTED' ||
      error?.config?._isDuplicateBlocked
    ) {
      console.info('[Axios Deduplication] Duplicate submission request was safely cancelled.');
      // Return a simulated response with prevented flag so components don't crash or display false error alerts
      return Promise.resolve({
        data: {
          status: 'duplicate_prevented',
          message: 'Duplicate request was safely prevented.',
        },
        status: 200,
        statusText: 'OK (Duplicate Prevented)',
        headers: {},
        config: error.config,
      });
    }

    return Promise.reject(error);
  }
);

export default axios;
