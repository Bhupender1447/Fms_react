import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import EldSimulation, { readSimulation } from './EldSimulation';

jest.mock('axios');
const catalog = {
  status: true, contract_version: 'eld-simulation.v1', synthetic: true,
  accounts: [{ account_id: '900', account_name: 'Synthetic A' }],
  scenarios: [{ id: 'complete', name: 'Continuous coverage' }, { id: 'stale', name: 'Stale observation' }],
};
const simulation = {
  contract_version: 'eld-simulation.v1', synthetic: true, account_id: '900', provider: 'motive', scenario_id: 'complete',
  identity: { account_id: '900', driver_id: 'simulation-900-driver', vehicle_id: 'simulation-900-vehicle' },
  profile: { scope: 'SYNTHETIC', version: 'synthetic-motive-v1', production_verified: false },
  assessed_at: '2026-11-01T08:00:00Z', fixture_validation: 'PASSED', intervals: [], missing_data: [],
  retrieval: { cursor_complete: true, records_received: 0, requests: [], retry_delays_seconds: [], errors: [] },
  operational_eligible: false, ready_for_rules_engine: false, dispatch_authorized: false,
};
beforeEach(() => {
  jest.resetAllMocks();
  axios.get.mockResolvedValue({ data: catalog });
  axios.post.mockResolvedValue({ data: { status: true, simulation } });
});
async function open() {
  render(<EldSimulation />);
  await waitFor(() => expect(screen.getByRole('button', { name: 'Run simulation' })).toBeEnabled());
}
test('loads authorized choices and displays synthetic results after an explicit run', async () => {
  await open();
  expect(axios.post).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Run simulation' }));
  await screen.findByRole('heading', { name: 'Fixture checks passed' });
  expect(screen.getByText('Unavailable', { selector: 'dd' })).toBeInTheDocument();
  expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/preview'), { account_id: '900', provider: 'motive', scenario_id: 'complete' }, expect.objectContaining({ withCredentials: true }));
});
test('account switching clears results and aborts obsolete responses', async () => {
  axios.get.mockResolvedValue({ data: { ...catalog, accounts: [...catalog.accounts, { account_id: '901', account_name: 'Synthetic B' }] } });
  render(<EldSimulation />);
  await screen.findByRole('option', { name: 'Synthetic B' });
  expect(screen.getByRole('button', { name: 'Run simulation' })).toBeDisabled();
  fireEvent.change(screen.getByLabelText('Account workspace'), { target: { value: '900' } });
  let resolve;
  axios.post.mockImplementationOnce(() => new Promise(done => { resolve = done; }));
  fireEvent.click(screen.getByRole('button', { name: 'Run simulation' }));
  const signal = axios.post.mock.calls[0][2].signal;
  fireEvent.change(screen.getByLabelText('Account workspace'), { target: { value: '901' } });
  await act(async () => resolve({ data: { status: true, simulation } }));
  expect(signal.aborted).toBe(true);
  expect(screen.queryByRole('heading', { name: 'Fixture checks passed' })).not.toBeInTheDocument();
});
test('rejects foreign results and any operational readiness claim', () => {
  for (const changed of [{ account_id: '901' }, { synthetic: false }, { ready_for_rules_engine: true }, { dispatch_authorized: true }, { operational_eligible: true }]) {
    expect(() => readSimulation({ status: true, simulation: { ...simulation, ...changed } }, '900', 'motive', 'complete')).toThrow('could not be verified');
  }
});
test('clears obsolete evidence on scenario changes and surfaces missing data', async () => {
  await open();
  fireEvent.click(screen.getByRole('button', { name: 'Run simulation' }));
  await screen.findByRole('heading', { name: 'Fixture checks passed' });
  fireEvent.change(screen.getByLabelText('Scenario'), { target: { value: 'stale' } });
  expect(screen.queryByRole('heading', { name: 'Fixture checks passed' })).not.toBeInTheDocument();
  axios.post.mockResolvedValue({ data: { status: true, simulation: { ...simulation, scenario_id: 'stale', fixture_validation: 'UNKNOWN', missing_data: ['STALE_SOURCE'] } } });
  fireEvent.click(screen.getByRole('button', { name: 'Run simulation' }));
  await screen.findByText('Source observation is stale');
  expect(screen.getByRole('heading', { name: 'Evidence unknown' })).toBeInTheDocument();
});
test('revoked permissions clear account choices and suppress duplicate clicks', async () => {
  await open();
  let reject;
  axios.post.mockImplementationOnce(() => new Promise((resolve, fail) => { reject = fail; }));
  const run = screen.getByRole('button', { name: 'Run simulation' });
  fireEvent.click(run); fireEvent.click(run);
  expect(axios.post).toHaveBeenCalledTimes(1);
  await act(async () => reject({ response: { status: 403, data: { message: 'Membership revoked' } } }));
  expect(screen.getByRole('alert')).toHaveTextContent('Membership revoked');
  expect(screen.getByRole('button', { name: 'Run simulation' })).toBeDisabled();
});
