import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import LiveLocationMap from './LiveLocationMap';
jest.mock('../../mapConfig', () => ({ GOOGLE_MAPS_API_KEY: '' }));

beforeEach(() => {
  Object.defineProperty(navigator, 'geolocation', { configurable: true, value: {
    getCurrentPosition: jest.fn(success => success({ coords: { latitude: 43.7, longitude: -79.4 } })),
  } });
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ status: 'success' }) });
});
test('shares GPS without Google Maps configuration and shows separate map limitation', async () => {
  render(<LiveLocationMap />);
  fireEvent.click(screen.getByRole('button'));
  expect(await screen.findByText('Location shared with dispatch.')).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining('api/getliveLocation'),
    expect.objectContaining({ method: 'POST', credentials: 'include', body: 'lat=43.7&long=-79.4' }));
  expect(screen.getByRole('alert')).toHaveTextContent('GPS sharing does not require the map');
});
test('does not report successful sharing when storage rejects the sample', async () => {
  fetch.mockResolvedValue({ ok: false, json: async () => ({ message: 'Location could not be saved' }) });
  render(<LiveLocationMap />);
  fireEvent.click(screen.getByRole('button'));
  expect(await screen.findByText('Location could not be saved')).toBeInTheDocument();
  expect(screen.queryByText('Location shared with dispatch.')).not.toBeInTheDocument();
});
