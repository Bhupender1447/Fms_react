import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EvidenceReview from './EvidenceReview';

const choices = [{ account_id: '3', name: 'Samhil fixture' }, { account_id: '4', name: 'Other fixture' }];
const reply = (body, status = 200) => ({ ok: status === 200, status, json: async () => body });
export const reviewSnapshot = (account = '3', title = 'Source time fixture', offset = 0) => {
  const entity = { entity_key: 'ifm:order:10', entity_type: 'order', source: { system: 'ifm', record_id: '10', updated_at: null }, attributes: { status: 'OPEN' } };
  const finding = { finding_id: 'a'.repeat(64), code: 'SOURCE_TIME_UNVERIFIED', priority: 'review', title, detail: 'No verified source update time.', next_step: 'Review the original record.', entity_key: entity.entity_key, source: { system: 'ifm', record_id: '10' } };
  const page = { limit: 50, offset };
  const snapshot = { account_id: account, generated_at: '2026-10-25T23:00:00Z', page, entities: [entity], relationships: [] };
  snapshot.review = { schema_version: 'sis-review-1.0', account_id: account, generated_at: snapshot.generated_at, snapshot_digest: 'b'.repeat(64), page, findings: [finding], finding_count: 1, reviewed_entity_count: 1, status: 'INFORMATIONAL_ONLY', execution_enabled: false, dispatch_authorized: false, legal_feasibility_evaluated: false, persisted: false, page_only: true };
  return { status: 'success', world_model: snapshot };
};
let originalFetch;
beforeEach(() => { originalFetch = global.fetch; global.fetch = jest.fn(); });
afterEach(() => { global.fetch = originalFetch; });
const show = () => render(<MemoryRouter><EvidenceReview /></MemoryRouter>);

test('no account membership never requests global operational evidence', async () => {
  global.fetch.mockResolvedValue(reply({ status: 'success', accounts: [] })); show();
  expect(await screen.findByText('No authorized accounts')).toBeVisible();
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', { name: 'Refresh evidence' })).toBeDisabled();
});
test('authorized evidence renders source references and supports finding filters without executable controls', async () => {
  global.fetch.mockResolvedValueOnce(reply({ status: 'success', accounts: [choices[0]] })).mockResolvedValueOnce(reply(reviewSnapshot())); show();
  expect(await screen.findByRole('heading', { name: 'Source time fixture' })).toBeVisible();
  expect(global.fetch.mock.calls[1][0]).toContain('account_id=3');
  expect(global.fetch.mock.calls[1][1].credentials).toBe('include');
  expect(screen.getByText('ifm:order:10')).toBeVisible();
  fireEvent.change(screen.getByLabelText('Finding type'), { target: { value: 'information' } });
  expect(screen.getByText('No findings match these filters')).toBeVisible();
  expect(screen.queryByRole('button', { name: /approve|dispatch|execute/i })).not.toBeInTheDocument();
});
test('account switching removes old evidence and rejects foreign-account results', async () => {
  global.fetch.mockResolvedValueOnce(reply({ status: 'success', accounts: choices })).mockResolvedValueOnce(reply(reviewSnapshot())).mockResolvedValueOnce(reply(reviewSnapshot('3', 'FOREIGN'))); show();
  await screen.findByRole('option', { name: 'Other fixture' });
  fireEvent.change(screen.getByLabelText('Authorized account'), { target: { value: '3' } });
  await screen.findByRole('heading', { name: 'Source time fixture' });
  fireEvent.change(screen.getByLabelText('Authorized account'), { target: { value: '4' } });
  expect(screen.queryByRole('heading', { name: 'Source time fixture' })).not.toBeInTheDocument();
  expect(await screen.findByText(/snapshot account does not match/)).toBeVisible();
  expect(screen.queryByRole('heading', { name: 'FOREIGN' })).not.toBeInTheDocument();
});
test('a late previous-account request cannot overwrite current evidence', async () => {
  let resolveOld; const pending = new Promise(resolve => { resolveOld = resolve; });
  global.fetch.mockResolvedValueOnce(reply({ status: 'success', accounts: choices })).mockReturnValueOnce(pending).mockResolvedValueOnce(reply(reviewSnapshot('4', 'CURRENT'))); show();
  await screen.findByRole('option', { name: 'Other fixture' });
  fireEvent.change(screen.getByLabelText('Authorized account'), { target: { value: '3' } });
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  fireEvent.change(screen.getByLabelText('Authorized account'), { target: { value: '4' } });
  expect(await screen.findByRole('heading', { name: 'CURRENT' })).toBeVisible();
  await act(async () => { resolveOld(reply(reviewSnapshot('3', 'OLD'))); });
  expect(screen.queryByRole('heading', { name: 'OLD' })).not.toBeInTheDocument();
});
test.each(['execution_enabled', 'persisted', 'dispatch_authorized', 'legal_feasibility_evaluated'])('unexpected authority flag %s rejects the whole review', async flag => {
  const body = reviewSnapshot(); body.world_model.review[flag] = true;
  global.fetch.mockResolvedValueOnce(reply({ status: 'success', accounts: [choices[0]] })).mockResolvedValueOnce(reply(body)); show();
  expect(await screen.findByText(/review response could not be verified/)).toBeVisible();
  expect(screen.queryByRole('heading', { name: 'Source time fixture' })).not.toBeInTheDocument();
});
test('revoked membership produces no findings and safe account retry', async () => {
  global.fetch.mockResolvedValueOnce(reply({}, 403)).mockResolvedValueOnce(reply({ status: 'success', accounts: [] })); show();
  await screen.findByText(/Administrator access and account read permissions/);
  fireEvent.click(screen.getByRole('button', { name: 'Retry account access' }));
  expect(await screen.findByText('No authorized accounts')).toBeVisible();
});
