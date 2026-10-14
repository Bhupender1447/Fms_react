import React from 'react';
import axios from 'axios';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import WorldModel from './admindashboard/sis/WorldModel';

// Deliberate test fixtures, never shipped as operational records.
const driver = { entity_key: 'test_fixture:driver:1', entity_type: 'driver', source: { system: 'test_fixture', record_id: '1', updated_at: null }, freshness: 'not_assessed', attributes: { name: 'Fixture Driver' } };
const snapshot = { entities: [driver], relationships: [], source_status: 'connected', generated_at: '2026-10-11T12:00:00Z' };
function renderRoute() { return render(<MemoryRouter initialEntries={['/sis/world-model']}><Routes><Route path="/sis/world-model" element={<WorldModel />} /></Routes></MemoryRouter>); }
beforeEach(() => { global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ status: 'success', world_model: snapshot }) }); });
afterEach(() => { delete global.fetch; });

test('CRA loads Axios without the ESM parse failure', () => { expect(typeof axios.create).toBe('function'); });

test('World Model renders stored records and supports keyboard filters', async () => {
  renderRoute();
  expect((await screen.findAllByText('Fixture Driver')).length).toBeGreaterThan(0);
  expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('api/sis/world-model?limit=50&offset=0'), expect.objectContaining({ credentials: 'include' }));
  expect(screen.getByText('Freshness is not assessed.')).toBeVisible();
  userEvent.tab(); expect(screen.getByRole('button', { name: 'Refresh snapshot' })).toHaveFocus();
  userEvent.tab(); expect(screen.getByLabelText('Search current page')).toHaveFocus();
  act(() => { userEvent.type(screen.getByLabelText('Search current page'), 'unmatched'); });
  expect(screen.getByText('No entities match this page and filter.')).toBeVisible();
  act(() => { userEvent.clear(screen.getByLabelText('Search current page')); });
  act(() => { userEvent.selectOptions(screen.getByLabelText('Entity type'), 'truck'); });
  expect(screen.queryByText('Fixture Driver')).not.toBeInTheDocument();
});

test('denied API responses show an error and support retry', async () => {
  global.fetch.mockResolvedValueOnce({ ok: false, status: 403, json: async () => ({ status: 'error', message: 'Private server detail' }) });
  renderRoute();
  expect(await screen.findByRole('alert')).toHaveTextContent(/permission|administrator/i);
  expect(screen.queryByText('Private server detail')).not.toBeInTheDocument();
  expect(screen.queryByText('Fixture Driver')).not.toBeInTheDocument();
  await act(async () => { userEvent.click(screen.getByRole('button', { name: 'Retry' })); });
  expect((await screen.findAllByText('Fixture Driver')).length).toBeGreaterThan(0);
});

test('pagination preserves the bounded API contract', async () => {
  global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ status: 'success', world_model: { ...snapshot, entities: Array.from({ length: 50 }, (_, index) => ({ ...driver, entity_key: `test_fixture:driver:${index}`, source: { ...driver.source, record_id: String(index) } })) } }) });
  renderRoute();
  await waitFor(() => expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled());
  await act(async () => { userEvent.click(screen.getByRole('button', { name: 'Next' })); });
  await waitFor(() => expect(global.fetch).toHaveBeenLastCalledWith(expect.stringContaining('offset=50'), expect.any(Object)));
});
