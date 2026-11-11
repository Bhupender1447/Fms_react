import axios from 'axios';
import { BASE_URL } from '../../config';

const profileFields = ['id', 'fname', 'lname', 'employeecode', 'phone', 'email', 'address1', 'address2', 'city', 'state', 'zip', 'country', 'hiredate', 'termdate', 'active', 'status', 'account_id', 'record_version', 'login_user_id'];
const withheld = () => new Error('Driver ownership is not verified. The roster is withheld because the server response could not be verified.');

// Load all bounded pages before publishing a roster; never combine accounts or
// expose a partial page as the fleet total. Sensitive fields/media stay absent.
export async function loadDriverRoster(signal, requestedAccountId) {
  const drivers = [];
  const seen = new Set();
  let accountId = requestedAccountId ? String(requestedAccountId) : undefined;
  let permissions;
  let accounts;
  let total;
  for (let offset = 0; offset < 10000; offset += 100) {
    const { data } = await axios.get(`${BASE_URL}api/driver-command/roster`, {
      params: { limit: 100, offset, ...(accountId ? { account_id: accountId } : {}) }, withCredentials: true, signal,
    });
    if (signal.aborted) throw new Error('Driver request cancelled.');
    if (data?.status !== 'success' || data.contract !== 'driver-command-center.v1' || !/^\d+$/.test(String(data.account_id || '')) || !Array.isArray(data.drivers)) throw withheld();
    if (accountId && accountId !== String(data.account_id)) throw withheld();
    accountId = String(data.account_id);
    permissions = { edit_profile: data.permissions?.edit_profile === true, view_compliance: false, view_licence_number: false };
    accounts = Array.isArray(data.authorized_accounts) ? data.authorized_accounts : [];
    const page = data.page;
    if (!page || !Number.isInteger(page.total) || page.total < 0 || page.total > 10000 || page.offset !== offset || page.limit !== 100 || page.returned !== data.drivers.length || data.drivers.length > 100 || (total !== undefined && total !== page.total)) throw withheld();
    total = page.total;
    for (const driver of data.drivers) {
      if (!driver || !/^\d+$/.test(String(driver.id)) || String(driver.account_id) !== accountId || seen.has(String(driver.id))) throw withheld();
      seen.add(String(driver.id));
      drivers.push(Object.fromEntries(profileFields.map(field => [field, driver[field]])));
    }
    if (drivers.length === total) return { accountId, drivers, permissions, accounts };
    if (!data.drivers.length || drivers.length > total) throw withheld();
  }
  throw withheld();
}

export async function driverProfileRequest(id, accountId, { signal, fields, version } = {}) {
  const config = { withCredentials: true, signal, params: { account_id: accountId } };
  const url = BASE_URL + 'api/driver-command/driver/' + encodeURIComponent(id);
  const { data } = fields ? await axios.post(url + '/update', { ...fields, expected_version: version }, config) : await axios.get(url, config);
  if (signal?.aborted || data?.status !== 'success' || data.contract !== 'driver-command-center.v1' || String(data.account_id) !== String(accountId) || String(data.driver?.account_id) !== String(accountId) || String(data.driver?.id) !== String(id)) throw withheld();
  return Object.fromEntries(profileFields.map(field => [field, data.driver[field]]));
}
