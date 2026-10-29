import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import AutoLiveLocationSender from './AutoLiveLocationSender';

let locate;
const position = { coords: { latitude: 43.7, longitude: -79.4 } };
const flush = async () => act(async () => { await Promise.resolve(); await Promise.resolve(); });
beforeEach(() => {
  jest.useFakeTimers();
  localStorage.clear();
  localStorage.setItem('logindetail', JSON.stringify({ id: '7' }));
  locate = jest.fn(success => success(position));
  Object.defineProperty(navigator, 'geolocation', { configurable: true, value: { getCurrentPosition: locate } });
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ status: 'success' }) });
});
afterEach(() => { jest.useRealTimers(); });

test('is opt-in and ignores a previous driver/global sharing preference', () => {
  localStorage.setItem('driverLocationSharingEnabled', 'true');
  localStorage.setItem('driverLocationSharingEnabled:8', 'true');
  render(<AutoLiveLocationSender />);
  expect(fetch).not.toHaveBeenCalled();
  expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
});
test('uploads fresh stationary GPS every 20 seconds without a client driver ID', async () => {
  const { unmount } = render(<AutoLiveLocationSender />);
  fireEvent.click(screen.getByRole('button', { name: 'Share live location' }));
  await flush();
  expect(screen.getByText(/Location shared at/)).toBeInTheDocument();
  expect(locate).toHaveBeenCalledWith(expect.any(Function), expect.any(Function),
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining('api/getliveLocation'),
    expect.objectContaining({ credentials: 'include', method: 'POST' }));
  expect(fetch.mock.calls[0][1].body.toString()).toBe('lat=43.7&long=-79.4');
  act(() => jest.advanceTimersByTime(20000));
  await flush();
  expect(fetch).toHaveBeenCalledTimes(2);
  unmount();
  act(() => jest.advanceTimersByTime(20000));
  expect(fetch).toHaveBeenCalledTimes(2);
});
test('stopping sharing cancels pending GPS callbacks and uploads', async () => {
  let finish;
  locate.mockImplementation(success => { finish = success; });
  render(<AutoLiveLocationSender />);
  fireEvent.click(screen.getByRole('button'));
  fireEvent.click(screen.getByRole('button'));
  act(() => { finish(position); });
  await flush();
  expect(fetch).not.toHaveBeenCalled();
  expect(localStorage.getItem('driverLocationSharingEnabled:7')).toBe('false');
});
test('denied GPS permission is explicit and retried, never reported as shared', () => {
  locate.mockImplementation((success, failure) => failure({ message: 'Permission denied' }));
  render(<AutoLiveLocationSender />);
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByText(/Location unavailable: Permission denied/)).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
  act(() => jest.advanceTimersByTime(20000));
  expect(locate).toHaveBeenCalledTimes(2);
});
test('HTTP or success-shaped failure is shown and next sample retries', async () => {
  fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ status: 'error', message: 'Not saved' }) });
  render(<AutoLiveLocationSender />);
  fireEvent.click(screen.getByRole('button'));
  await flush();
  expect(screen.getByText('Not saved')).toBeInTheDocument();
  act(() => jest.advanceTimersByTime(20000));
  await flush();
  expect(screen.getByText(/Location shared at/)).toBeInTheDocument();
});
test('missing driver session is explicit', () => {
  localStorage.removeItem('logindetail');
  render(<AutoLiveLocationSender />);
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByText(/Sign in as a driver/)).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
});
test('unsupported GPS is explicit, without a false sharing confirmation', () => {
  Object.defineProperty(navigator, 'geolocation', { configurable: true, value: undefined });
  render(<AutoLiveLocationSender />);
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByText(/Location is not supported/)).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
});
test('a hung network upload times out and the next sample recovers', async () => {
  fetch.mockImplementationOnce((url, options) => new Promise((resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }));
  render(<AutoLiveLocationSender />);
  fireEvent.click(screen.getByRole('button'));
  act(() => jest.advanceTimersByTime(15000)); await flush();
  expect(screen.getByText(/Location update timed out/)).toBeInTheDocument();
  act(() => jest.advanceTimersByTime(5000)); await flush();
  expect(screen.getByText(/Location shared at/)).toBeInTheDocument();
});
