import React from 'react';
import axios from 'axios';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RatexIndex from './RatexIndex';
jest.mock('axios');
function snapshot() {
  return { status: 'success', kind: 'national_price_indexes', lane_rates_available: false, retrieved_at: '2026-10-25T12:00:00Z', cached: true,
    sources: ['us', 'ca'].map(id => ({ id, status: 'available', provider: id === 'us' ? 'U.S. Bureau of Labor Statistics' : 'Statistics Canada',
      title: id === 'us' ? 'Long-distance truckload' : 'General freight (not truckload-only)', frequency: 'Monthly', units: 'Index points',
      latest: { period: '2026-06', value: 125, notes: 'Preliminary.' }, history: [{ period: '2026-06', value: 125 }],
      previous_month_change_pct: null, delayed: id === 'ca' })) };
}
function setup() { return render(<MemoryRouter><RatexIndex /></MemoryRouter>); }
beforeEach(() => jest.resetAllMocks());
test('loads official indexes with attribution and never labels them lane quotes', async () => {
  axios.get.mockResolvedValue({ data: snapshot() }); setup();
  expect(await screen.findByRole('region', { name: 'United States index' })).toBeInTheDocument();
  expect(screen.getByRole('region', { name: 'Canada index' })).toHaveTextContent('Reporting lag');
  expect(screen.getByText(/not CAD\/USD per mile/)).toBeInTheDocument();
  expect(screen.getByText('Lane rates: provider required')).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: 'Official series and methodology' })).toHaveLength(2);
  expect(screen.getByRole('link', { name: 'Back to Load Board' })).toHaveAttribute('href', '/loadboard');
  expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('api/loadboard/ratex-index'), expect.objectContaining({ withCredentials: true, signal: expect.anything() }));
  fireEvent.click(within(screen.getByRole('region', { name: 'Canada index' })).getByText('Monthly history'));
  expect(screen.getByRole('table', { name: 'Canada monthly index points' })).toBeInTheDocument();
});
test('shows loading and refresh status without duplicate fetch while disabled', async () => {
  let finish; axios.get.mockReturnValue(new Promise(resolve => { finish = resolve; })); setup();
  expect(screen.getByText('Loading official monthly indexes...')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Refresh indexes' })).toBeDisabled();
  finish({ data: snapshot() });
  expect(await screen.findByRole('region', { name: 'Canada index' })).toBeInTheDocument();
});
test('partial outage keeps only valid provider index', async () => {
  const data = snapshot(); data.status = 'partial'; data.sources[1] = { id: 'ca', status: 'unavailable', latest: null, history: [] };
  axios.get.mockResolvedValue({ data }); setup();
  expect(await screen.findByText('Partial source coverage')).toBeInTheDocument();
  const canada = screen.getByRole('region', { name: 'Canada index' });
  expect(canada).toHaveTextContent('Source unavailable');
  expect(within(canada).queryByText('125')).not.toBeInTheDocument();
});
test('provider/authentication failure is explicit and refresh retries', async () => {
  axios.get.mockRejectedValueOnce({ response: { data: { message: 'Authentication required' } } }).mockResolvedValueOnce({ data: snapshot() });
  setup();
  expect(await screen.findByRole('alert')).toHaveTextContent('Authentication required');
  fireEvent.click(screen.getByRole('button', { name: 'Refresh indexes' }));
  expect(await screen.findByRole('region', { name: 'Canada index' })).toBeInTheDocument();
  expect(axios.get).toHaveBeenCalledTimes(2);
});
test.each([
  {}, { ...snapshot(), lane_rates_available: true },
  { ...snapshot(), sources: [{ id: 'us', status: 'available', latest: { value: '125' } }] },
  { ...snapshot(), retrieved_at: 'bad' },
])('rejects malformed or incompatible responses %j', async data => {
  axios.get.mockResolvedValue({ data }); setup();
  expect(await screen.findByRole('alert')).toHaveTextContent('unavailable');
  expect(screen.queryByRole('region', { name: 'United States index' })).not.toBeInTheDocument();
});
test('cleanup aborts request; stale responses do not update unmounted page', async () => {
  let finish; axios.get.mockReturnValue(new Promise(resolve => { finish = resolve; }));
  const { unmount } = setup();
  const signal = axios.get.mock.calls[0][1].signal;
  unmount(); expect(signal.aborted).toBe(true);
  finish({ data: snapshot() });
});
