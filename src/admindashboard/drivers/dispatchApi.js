import axios from 'axios';
import { BASE_URL } from '../../config';

export const dispatchError = error => error.response?.data?.message || error.message || 'The request could not be completed.';
export async function dispatchRequest(path, { body, signal, accountId } = {}) {
  const config = { withCredentials: true, signal, params: accountId ? { account_id: accountId } : undefined };
  const response = body === undefined ? await axios.get(`${BASE_URL}api/dispatch/${path}`, config) : await axios.post(`${BASE_URL}api/dispatch/${path}`, body, config);
  if (signal?.aborted) throw new Error('Request cancelled.');
  if (response.data?.status !== true) throw new Error(response.data?.message || 'Invalid dispatch response.');
  if (accountId && response.data.account_id && String(response.data.account_id) !== String(accountId)) throw new Error('Account changed. Refresh the workspace.');
  return response.data;
}
