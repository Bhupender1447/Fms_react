import { readAccountResponse, readSnapshotResponse } from './snapshotResponse';

const response = (body, status = 200) => ({ status, ok: status >= 200 && status < 300, json: async () => body });

test('account selector accepts only unique server-supplied account identities', async () => {
  await expect(readAccountResponse(response({ status: 'success', accounts: [{ account_id: '1', name: 'Account A' }] })))
    .resolves.toEqual([{ account_id: '1', name: 'Account A' }]);
  await expect(readAccountResponse(response({ status: 'success', accounts: [] }))).resolves.toEqual([]);
  for (const accounts of [
    [{ account_id: 1, name: 'Account A' }],
    [{ account_id: '1', name: 'Account A' }, { account_id: '1', name: 'Account B' }],
    [{ account_id: '1 OR 1=1', name: 'Account A' }],
    [{ account_id: '1', name: '' }],
  ]) await expect(readAccountResponse(response({ status: 'success', accounts }))).rejects.toThrow(/invalid|duplicate/);
});

test('wrong-account and unscoped snapshot responses are rejected before display', async () => {
  for (const account_id of ['2', undefined, 1]) {
    await expect(readSnapshotResponse(response({ status: 'success', world_model: { account_id, entities: [], relationships: [] } }), '1'))
      .rejects.toThrow(/does not match/);
  }
  await expect(readSnapshotResponse(response({ status: 'success', world_model: { account_id: '1', entities: [], relationships: [] } }), '1'))
    .resolves.toMatchObject({ account_id: '1' });
});

test('authorization and unavailable sources are errors rather than empty successful data', async () => {
  await expect(readAccountResponse(response({}, 401))).rejects.toThrow(/Sign in again/);
  await expect(readAccountResponse(response({}, 403))).rejects.toThrow(/permissions/);
  await expect(readAccountResponse(response({}, 503))).rejects.toThrow(/unavailable/);
  await expect(readSnapshotResponse(response({}, 403), '1')).rejects.toThrow(/membership/);
  await expect(readSnapshotResponse(response({}, 503), '1')).rejects.toThrow(/503/);
  await expect(readSnapshotResponse(response({ status: 'success', world_model: { account_id: '1' } }), '1')).rejects.toThrow(/collections/);
});
