import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import TripStatusForm from './TripStatusForm';

jest.mock('axios');
const snapshot = {
  status: true, contract_version: 'trip-execution.v1', tmsTripId: 'SYNTHETIC', trip_status: 'ACTIVE',
  assignment_id: 12, dispatch_status: 'ACCEPTED', pretrip_passed: false,
  pickup_address: 'Synthetic pickup', delivery_address: 'Synthetic delivery',
  stops: [], inspections: [], documents: [], history: [],
};
beforeEach(() => {
  jest.resetAllMocks();
  Object.defineProperty(window, 'crypto', { configurable: true, value: { randomUUID: jest.fn(() => 'synthetic-request-id') } });
  axios.get.mockResolvedValue({ data: snapshot });
  axios.post.mockResolvedValue({ data: { status: true, message: 'Saved' } });
});
async function open(data = snapshot) {
  axios.get.mockResolvedValue({ data });
  render(<MemoryRouter initialEntries={['/tripstatus/SYNTHETIC']}><Routes><Route path="/tripstatus/:tripId" element={<TripStatusForm />} /></Routes></MemoryRouter>);
  await screen.findByRole('heading', { name: 'Not started' });
}

test('requires a passed inspection and refetches server state after saving', async () => {
  await open();
  expect(screen.getByRole('button', { name: 'Start trip' })).toBeDisabled();
  axios.get.mockResolvedValue({ data: { ...snapshot, pretrip_passed: true } });
  fireEvent.click(screen.getByRole('button', { name: 'Save pre-trip inspection' }));
  await waitFor(() => expect(screen.getByRole('button', { name: 'Start trip' })).toBeEnabled());
  expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/inspection'), expect.objectContaining({ tmsTripId: 'SYNTHETIC', request_id: 'execution_synthetic-request-id', result: 'PASS' }), expect.objectContaining({ withCredentials: true }));
});

test('keeps a request key for network retries and suppresses duplicate submissions', async () => {
  await open();
  let reject;
  axios.post.mockImplementationOnce(() => new Promise((resolve, fail) => { reject = fail; }));
  const save = screen.getByRole('button', { name: 'Save pre-trip inspection' });
  fireEvent.click(save); fireEvent.click(save);
  expect(axios.post).toHaveBeenCalledTimes(1);
  await act(async () => reject(new Error('Network unavailable')));
  expect(screen.getByRole('alert')).toHaveTextContent('Network unavailable');
  fireEvent.click(save);
  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
  expect(axios.post.mock.calls[0][1].request_id).toBe(axios.post.mock.calls[1][1].request_id);
  expect(window.crypto.randomUUID).toHaveBeenCalledTimes(1);
});

test('clears unauthorized trip data and rejects an unverifiable response', async () => {
  await open({ ...snapshot, pretrip_passed: true });
  axios.post.mockRejectedValue({ response: { status: 404, data: { message: 'Trip not found' } } });
  fireEvent.click(screen.getByRole('button', { name: 'Start trip' }));
  await screen.findByText('Trip not found');
  expect(screen.queryByText('Synthetic pickup')).not.toBeInTheDocument();
  axios.get.mockResolvedValue({ data: { ...snapshot, tmsTripId: 'FOREIGN' } });
  fireEvent.click(screen.getByRole('button', { name: 'Refresh trip' }));
  await screen.findByText('The trip response could not be verified. Refresh the trip.');
  expect(screen.queryByText('Synthetic pickup')).not.toBeInTheDocument();
});

test('enforces stop order and requires valid POD before completion', async () => {
  await open();
  axios.get.mockResolvedValue({ data: { ...snapshot, trip_status: 'IN_PROGRESS', stops: [
    { id: 1, location: 'First stop', execution_status: 'PENDING' },
    { id: 2, location: 'Second stop', execution_status: 'PENDING' },
  ] } });
  fireEvent.click(screen.getByRole('button', { name: 'Refresh trip' }));
  await screen.findByRole('heading', { name: 'In progress' });
  const arrivals = screen.getAllByRole('button', { name: 'Record arrival' });
  expect(arrivals[0]).toBeEnabled(); expect(arrivals[1]).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Complete trip' })).toBeDisabled();
  fireEvent.change(screen.getByLabelText(/POD file/), { target: { files: [new File(['bad'], 'bad.exe', { type: 'application/octet-stream' })] } });
  expect(screen.getByRole('alert')).toHaveTextContent('Choose a JPEG');
  expect(screen.getByRole('button', { name: 'Complete trip' })).toBeDisabled();
});

test('uploads POD as multipart and shows the persisted completed state', async () => {
  await open();
  axios.get.mockResolvedValue({ data: { ...snapshot, trip_status: 'IN_PROGRESS' } });
  fireEvent.click(screen.getByRole('button', { name: 'Refresh trip' }));
  await screen.findByRole('heading', { name: 'In progress' });
  fireEvent.change(screen.getByLabelText(/POD file/), { target: { files: [new File(['%PDF-synthetic'], 'proof.pdf', { type: 'application/pdf' })] } });
  axios.get.mockResolvedValue({ data: { ...snapshot, trip_status: 'COMPLETED' } });
  fireEvent.click(screen.getByRole('button', { name: 'Complete trip' }));
  await screen.findByRole('heading', { name: 'Completed' });
  const body = axios.post.mock.calls[0][1];
  expect(body).toBeInstanceOf(FormData);
  expect(body.get('status')).toBe('COMPLETED');
  expect(body.get('pod_image').name).toBe('proof.pdf');
  expect(screen.getByRole('button', { name: 'Save post-trip inspection' })).toBeInTheDocument();
});
