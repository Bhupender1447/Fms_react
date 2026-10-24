import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import WorldModel from './WorldModel';

const reply = (body, status = 200) => ({ status, ok: status >= 200 && status < 300, json: async () => body });
const choices = [{ account_id: '1', name: 'Account A' }, { account_id: '2', name: 'Account B' }];
const snapshot = (accountId, label = 'OWN-ORDER') => ({ status: 'success', world_model: {
  account_id: accountId, source_status: 'partial', generated_at: '2026-10-22T12:00:00Z',
  entities: [{ entity_key: 'ifm:order:1', entity_type: 'order', source: { system: 'ifm', record_id: '1', updated_at: null }, freshness: 'not_assessed', attributes: { order_number: label } }],
  relationships: [],
} });
let originalFetch;
beforeEach(() => { originalFetch = global.fetch; global.fetch = jest.fn(); });
afterEach(() => { global.fetch = originalFetch; });

test('no memberships does not issue a global World Model request or report zero operational records', async () => {
  global.fetch.mockResolvedValue(reply({ status: 'success', accounts: [] }));
  render(<WorldModel />);
  expect(await screen.findByText('No authorized accounts')).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch.mock.calls[0][0]).toMatch(/api\/sis\/accounts$/);
  expect(screen.queryByText('No entities match this page and filter.')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Refresh snapshot' })).toBeDisabled();
});

test('multiple memberships require selection, requests bind account and switching clears old data on denial', async () => {
  global.fetch.mockResolvedValueOnce(reply({ status: 'success', accounts: choices }))
    .mockResolvedValueOnce(reply(snapshot('1', 'ORDER-ONLY-A')))
    .mockResolvedValueOnce(reply({}, 403));
  render(<WorldModel />);
  await screen.findByText('Select an authorized account');
  expect(global.fetch).toHaveBeenCalledTimes(1);
  fireEvent.change(screen.getByLabelText('Authorized account'), { target: { value: '1' } });
  expect(await screen.findByText(/Order ORDER-ONLY-A/)).toBeInTheDocument();
  expect(global.fetch.mock.calls[1][0]).toContain('account_id=1');
  expect(global.fetch.mock.calls[1][1].credentials).toBe('include');
  expect(screen.getByText('Partial account coverage')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Authorized account'), { target: { value: '2' } });
  expect(screen.queryByText(/Order ORDER-ONLY-A/)).not.toBeInTheDocument();
  expect(await screen.findByText(/Verify your active membership/)).toBeInTheDocument();
  expect(global.fetch.mock.calls[2][0]).toContain('account_id=2');
});

test('single authorized account is preselected but a different account response is never shown', async () => {
  global.fetch.mockResolvedValueOnce(reply({ status: 'success', accounts: [choices[0]] }))
    .mockResolvedValueOnce(reply(snapshot('2', 'FOREIGN-ORDER')));
  render(<WorldModel />);
  expect(await screen.findByText(/snapshot account does not match/)).toBeInTheDocument();
  expect(screen.getByLabelText('Authorized account')).toHaveValue('1');
  expect(screen.queryByText(/Order FOREIGN-ORDER/)).not.toBeInTheDocument();
});

test('a late response from the previous account cannot overwrite the selected account', async () => {
  let resolveA;
  const pendingA = new Promise((resolve) => { resolveA = resolve; });
  global.fetch.mockResolvedValueOnce(reply({ status: 'success', accounts: choices }))
    .mockReturnValueOnce(pendingA)
    .mockResolvedValueOnce(reply(snapshot('2', 'CURRENT-B')));
  render(<WorldModel />);
  await screen.findByText('Select an authorized account');
  fireEvent.change(screen.getByLabelText('Authorized account'), { target: { value: '1' } });
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  fireEvent.change(screen.getByLabelText('Authorized account'), { target: { value: '2' } });
  expect(await screen.findByText(/Order CURRENT-B/)).toBeInTheDocument();
  await act(async () => { resolveA(reply(snapshot('1', 'STALE-A'))); });
  expect(screen.queryByText(/Order STALE-A/)).not.toBeInTheDocument();
  expect(screen.getByText(/Order CURRENT-B/)).toBeInTheDocument();
});

test('expired identity blocks account loading and permits an explicit safe retry', async () => {
  global.fetch.mockResolvedValueOnce(reply({}, 401))
    .mockResolvedValueOnce(reply({ status: 'success', accounts: [] }));
  render(<WorldModel />);
  expect(await screen.findByText(/Sign in again to establish/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Retry account access' }));
  expect(await screen.findByText('No authorized accounts')).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledTimes(2);
});
