import React from 'react';
import { act, render, screen, within } from '@testing-library/react';
import L from 'leaflet';
import TripMap from './livemap';

jest.mock('leaflet', () => {
  const map = { setView: jest.fn().mockReturnThis(), remove: jest.fn(), fitBounds: jest.fn() };
  const layer = { addTo: jest.fn().mockReturnThis(), clearLayers: jest.fn() };
  const marker = { bindPopup: jest.fn().mockReturnThis(), addTo: jest.fn().mockReturnThis() };
  return { map: jest.fn(() => map), tileLayer: jest.fn(() => layer), layerGroup: jest.fn(() => layer),
    circleMarker: jest.fn(() => marker), latLngBounds: jest.fn(value => value) };
});
const now = Date.parse('2026-10-26T01:00:00Z');
const driver = (id, lastSeen, latitude = 43.7) => ({
  driver_id: id, fname: `Driver ${id}`, latitude, longitude: -79.4, last_seen: lastSeen, status: 'Live',
});
const reply = drivers => ({ ok: true, json: async () => ({
  status: 'success', drivers, trucks: [], eld_error: 'Not connected',
}) });
const flush = async () => act(async () => { await Promise.resolve(); await Promise.resolve(); });
beforeEach(() => {
  jest.useFakeTimers().setSystemTime(now);
  jest.clearAllMocks();
  const map = { setView: jest.fn().mockReturnThis(), remove: jest.fn(), fitBounds: jest.fn() };
  const layer = { addTo: jest.fn().mockReturnThis(), clearLayers: jest.fn() };
  const marker = { bindPopup: jest.fn().mockReturnThis(), addTo: jest.fn().mockReturnThis() };
  L.map.mockReturnValue(map);
  L.tileLayer.mockReturnValue(layer);
  L.layerGroup.mockReturnValue(layer);
  L.circleMarker.mockReturnValue(marker);
  L.latLngBounds.mockImplementation(value => value);
  global.fetch = jest.fn().mockResolvedValue(reply([driver('7', new Date(now - 10000).toISOString())]));
});
afterEach(() => jest.useRealTimers());

test('renders driver app position with source and UTC receipt time', async () => {
  render(<TripMap />); await flush();
  const table = screen.getByRole('table', { name: 'Fleet position updates' });
  expect(table).toHaveTextContent('Driver 7');
  expect(table).toHaveTextContent('Driver app GPS');
  expect(table).toHaveTextContent('Recent');
  expect(table).toHaveTextContent('43.70000, -79.40000');
  expect(table).toHaveTextContent('2026-10-26T00:59:50.000Z');
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining('api/liveFleetLocations'),
    expect.objectContaining({ credentials: 'include', cache: 'no-store' }));
  expect(L.circleMarker).toHaveBeenCalledWith([43.7, -79.4], expect.objectContaining({ fillOpacity: 1 }));
});
test('validates coordinates and never treats missing, future or old times as live', async () => {
  fetch.mockResolvedValue(reply([
    driver('1', new Date(now - 120000).toISOString()),
    driver('2', new Date(now - 120001).toISOString()),
    driver('3', ''), driver('4', new Date(now + 60000).toISOString()),
    driver('5', '', ''), driver('6', '', 91), driver('8', '', false),
  ]));
  render(<TripMap />); await flush();
  const table = screen.getByRole('table');
  expect(within(table).getAllByText('Recent')).toHaveLength(1);
  expect(within(table).getAllByText('Stale / unverified')).toHaveLength(3);
  expect(within(table).getAllByRole('row')).toHaveLength(5);
});
test('polls moved positions and aborts on unmount', async () => {
  const { unmount } = render(<TripMap />); await flush();
  const firstSignal = fetch.mock.calls[0][1].signal;
  fetch.mockResolvedValue(reply([driver('7', new Date(now).toISOString(), 45)]));
  act(() => jest.advanceTimersByTime(20000)); await flush();
  expect(screen.getByRole('table')).toHaveTextContent('45.00000');
  expect(fetch).toHaveBeenCalledTimes(2);
  const signal = fetch.mock.calls[1][1].signal;
  unmount();
  expect(signal.aborted).toBe(true);
  expect(firstSignal.aborted).toBe(false);
  act(() => jest.advanceTimersByTime(20000));
  expect(fetch).toHaveBeenCalledTimes(2);
});
test('failed polling keeps last known positions visibly unverified', async () => {
  const log = jest.spyOn(console, 'error').mockImplementation(() => {});
  render(<TripMap />); await flush();
  fetch.mockRejectedValue(new Error('offline'));
  act(() => jest.advanceTimersByTime(20000)); await flush();
  expect(screen.getByRole('table')).toHaveTextContent('Stale / unverified');
  expect(screen.getByText(/Unable to load live locations/)).toBeInTheDocument();
  log.mockRestore();
});
test('empty feed explains how driver sharing works without inventing a position', async () => {
  fetch.mockResolvedValue(reply([]));
  render(<TripMap />); await flush();
  expect(screen.getByText(/No driver or truck GPS locations/)).toBeInTheDocument();
  expect(screen.queryByRole('table')).not.toBeInTheDocument();
  expect(L.circleMarker).not.toHaveBeenCalled();
});
test('a stationary last known position ages into stale on subsequent polls', async () => {
  fetch.mockResolvedValue(reply([driver('7', new Date(now - 110000).toISOString())]));
  render(<TripMap />); await flush();
  expect(screen.getByRole('table')).toHaveTextContent('Recent');
  act(() => jest.advanceTimersByTime(20000)); await flush();
  expect(screen.getByRole('table')).toHaveTextContent('Stale / unverified');
});
