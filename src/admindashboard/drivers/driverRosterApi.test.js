import axios from 'axios';
import { loadDriverRoster } from './driverRosterApi';
jest.mock('axios');
const row = { id: '1', account_id: '900', fname: 'Alice', password: 'secret', image: '/private.png' };
const envelope = (drivers = [row], extra = {}) => ({ status: 'success', contract: 'driver-command-center.v1', account_id: '900', drivers, page: { total: drivers.length, returned: drivers.length, offset: 0, limit: 100 }, ...extra });
beforeEach(() => jest.resetAllMocks());
test('authorized roster projects contact fields and excludes private media and credentials', async () => {
  axios.get.mockResolvedValue({ data: envelope() });
  const result = await loadDriverRoster(new AbortController().signal);
  expect(result.accountId).toBe('900');
  expect(result.drivers[0].fname).toBe('Alice');
  expect(result.drivers[0]).not.toHaveProperty('password');
  expect(result.drivers[0]).not.toHaveProperty('image');
});
test.each([
  [row], envelope([{ ...row, account_id: '901' }]),
  envelope([row, row]), envelope([row], { page: { total: 2, returned: 1, offset: 1, limit: 100 } }),
])('rejects unscoped, foreign, duplicate, or malformed responses', async data => {
  axios.get.mockResolvedValue({ data });
  await expect(loadDriverRoster(new AbortController().signal)).rejects.toThrow('withheld');
});
test('account changes between pages never publish a combined roster', async () => {
  axios.get.mockResolvedValueOnce({ data: envelope([row], { page: { total: 2, returned: 1, offset: 0, limit: 100 } }) })
    .mockResolvedValueOnce({ data: envelope([{ ...row, id: '2', account_id: '901' }], { account_id: '901', page: { total: 2, returned: 1, offset: 100, limit: 100 } }) });
  await expect(loadDriverRoster(new AbortController().signal)).rejects.toThrow('withheld');
});
