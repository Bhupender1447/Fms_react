import React from 'react';
import axios from 'axios';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DriverHOS from './Hosview';

jest.mock('axios');

test('driver HOS details do not calculate remaining hours from trip duration', async () => {
  axios.get
    .mockResolvedValueOnce({
      data: {
        status: 'success',
        data: [{
          trip_id: 'trip-1',
          login_time: '2026-10-25T00:00:00Z',
          logout_time: null,
          status: 'on',
          pre_trip_inspection: 'yes',
          image_urls: [],
        }],
      },
    })
    .mockResolvedValueOnce({
      data: {
        status: 'success',
        assessment_status: 'NOT_ASSESSED',
        dispatch_authorized: false,
        freshness: 'current',
        driver: { id: 1, name: 'Test Driver' },
        duty_status: null,
        latest_hos: null,
        recent_hos: [],
        source: 'IFM duty status and HOS activity logs',
      },
    });

  const { unmount } = render(
    <MemoryRouter initialEntries={['/drivers/1/hos']}>
      <Routes>
        <Route path="/drivers/:id/hos" element={<DriverHOS />} />
      </Routes>
    </MemoryRouter>
  );

  expect(await screen.findByText(/No remaining-hours calculation or dispatch clearance is available/)).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('HOS assessment: Not assessed.');
  expect(screen.getByRole('heading', { name: 'Driver Trip Records · HOS Not Assessed' })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: 'HOS assessment' })).toBeInTheDocument();
  expect(screen.getAllByText('Not assessed').length).toBeGreaterThan(0);
  expect(screen.queryByRole('columnheader', { name: 'Remaining Hours' })).not.toBeInTheDocument();
  expect(screen.queryByText(/\d+\.\d{2} hrs/)).not.toBeInTheDocument();

  unmount();
});
