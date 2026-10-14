export const getLoadErrorMessage = (error, subject) => {
  const status = error?.response?.status;
  const payload = error?.response?.data;
  const serverMessage = payload && typeof payload === 'object' ? payload.message : '';

  if (typeof serverMessage === 'string' && serverMessage.trim()) return serverMessage;
  if (status >= 500) {
    return `${subject} are unavailable (API HTTP ${status}). Check the PHP backend and database connection.`;
  }
  if (status) return `${subject} could not be loaded (HTTP ${status}). Check your access and try again.`;
  return `${subject} could not be loaded. Check the API connection and try again.`;
};
