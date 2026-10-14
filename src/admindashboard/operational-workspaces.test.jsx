import React from 'react';
import axios from 'axios';
import { act, render, screen, within, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Orders from './order/Orders';
import Triplist from './trips/Triplist';

jest.mock('axios');
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } }));
// Controlled test data only; these records are never shipped to the API.
const orders = [
  { id: 1, customer_orderno: 'Fixture CAD', company: 'Test customer', mode: 'BROKER', driver_id: 0, currency: 'CAD', pickup_address: 'Origin', delivery_address: 'Destination', pickup_date: '2026-10-11', deliver_date: '2026-10-12' },
  { id: 2, customer_orderno: 'Fixture USD', company: 'Second customer', mode: 'BROKER', driver_id: 4, currency: 'USD', pickup_address: 'Other origin', delivery_address: 'Other destination' },
];
beforeEach(() => { axios.get.mockReset(); axios.post.mockReset(); });
function show(Component) { return render(<MemoryRouter><Component /></MemoryRouter>); }
function mockOrders() { axios.get.mockImplementation((url) => Promise.resolve({ data: url.includes('loadboard') ? { data: [] } : orders })); }

test('order search and currency filters retain existing record semantics', async () => {
  mockOrders(); show(Orders);
  await screen.findByText('Fixture CAD');
  act(() => { userEvent.selectOptions(screen.getByLabelText('Currency'), 'USD'); });
  expect(screen.queryByText('Fixture CAD')).not.toBeInTheDocument();
  expect(screen.getByText('Fixture USD')).toBeInTheDocument();
  act(() => { userEvent.click(screen.getByRole('button', { name: 'Clear filters' })); });
  act(() => { userEvent.type(screen.getByLabelText('Search orders'), 'Origin'); });
  expect(screen.getByText('Fixture CAD')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Edit order 1' })).toHaveAttribute('href', '/update/1');
});

test('posting an eligible order keeps the loadboard endpoint and payload', async () => {
  mockOrders(); axios.post.mockResolvedValue({ data: {} }); show(Orders);
  const record = await screen.findByText('Fixture CAD');
  const row = record.closest('tr');
  await act(async () => { userEvent.click(within(row).getByRole('button', { name: /Post Load/ })); });
  expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('api/loadboard/loads'), { order_id: 1 }, { withCredentials: true });
  expect(within(row).getByRole('button', { name: /Load Posted/ })).toBeDisabled();
  const assignedRow = screen.getByText('Fixture USD').closest('tr');
  expect(within(assignedRow).getByRole('button', { name: /Post Load/ })).toBeDisabled();
});

test('a load failure displays unavailable state and retry instead of empty records', async () => {
  axios.get.mockRejectedValue(new Error('Offline')); show(Orders);
  expect(await screen.findByRole('alert')).toHaveTextContent('Orders unavailable');
  expect(screen.queryByText(/No orders match these filters/)).not.toBeInTheDocument();
  mockOrders();
  await act(async () => { userEvent.click(screen.getByRole('button', { name: 'Try again' })); });
  expect(await screen.findByText('Fixture CAD')).toBeInTheDocument();
});

test('trip status filtering and cancellation preserve the existing request contract', async () => {
  axios.get.mockResolvedValue({ data: [{ ...orders[0], status: 'ACTIVE' }, { ...orders[1], status: 'COMPLETED' }] });
  axios.post.mockResolvedValue({ data: { status: true } });
  const prompt = jest.spyOn(window, 'prompt').mockReturnValue('Test cancellation');
  show(Triplist);
  await screen.findByText('Fixture CAD');
  act(() => { userEvent.selectOptions(screen.getByLabelText('Trip status'), 'completed'); });
  expect(screen.queryByText('Fixture CAD')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Cancel/ })).not.toBeInTheDocument();
  act(() => { userEvent.click(screen.getByRole('button', { name: 'Clear filters' })); });
  await act(async () => { userEvent.click(within(screen.getByText('Fixture CAD').closest('tr')).getByRole('button', { name: /Cancel/ })); });
  expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('api/remove'), 'id=1&type=fms_trips&reason=Test+cancellation', expect.objectContaining({ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }));
  await waitFor(() => expect(screen.getByText('CANCELLED')).toBeInTheDocument());
  prompt.mockRestore();
});
