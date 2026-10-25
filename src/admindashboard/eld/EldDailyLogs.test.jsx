import React from 'react';
import axios from 'axios';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import EldDailyLogs from './EldDailyLogs';

jest.mock('axios');
jest.mock('react-chartjs-2', () => ({ Bar: () => null }));

test('Samsara logs are labeled unverified and use browser-managed session credentials', async () => {
  axios.get.mockResolvedValue({ data: [] });
  render(<EldDailyLogs />);

  expect(await screen.findByText(/not a SIS HOS assessment/i)).toBeInTheDocument();
  expect(screen.getByText(/not been verified for account scope, completeness, legal applicability/i)).toBeInTheDocument();
  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  expect(axios.get.mock.calls[0][1]).toEqual({ withCredentials: true });
  expect(axios.get.mock.calls[0][1].headers).toBeUndefined();
});

test('provider certification is identified as a claim not verified by SIS', async () => {
  axios.get
    .mockResolvedValueOnce({ data: [] })
    .mockResolvedValueOnce({
      data: {
        data: [
          {
            startTime: '2026-01-01T00:00:00Z',
            driver: {
              name: 'Test Driver',
              id: 'driver-1',
              timezone: 'UTC',
              eldSettings: { rulesets: [] },
            },
            logMetaData: {
              carrierName: 'Test Carrier',
              carrierFormattedAddress: 'Test Address',
              vehicles: [],
              trailerNames: [],
              isCertified: true,
            },
            dutyStatusDurations: {
              driveDurationMs: 0,
              activeDurationMs: 0,
              offDutyDurationMs: 0,
              onDutyDurationMs: 0,
              sleeperBerthDurationMs: 0,
            },
            distanceTraveled: { driveDistanceMeters: 0 },
          },
        ],
      },
    });

  render(<EldDailyLogs />);
  fireEvent.click(await screen.findByRole('button', { name: /fetch logs/i }));

  expect(
    await screen.findByText(/provider-reported certification \(not verified by SIS\)/i)
  ).toBeInTheDocument();
  expect(screen.getByText('Yes')).toBeInTheDocument();
});
