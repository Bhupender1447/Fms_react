import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HoursOfServiceReport from './HoursOfServiceReport';

test('route and HOS page does not offer hard-coded hours or calculated results', () => {
  render(<MemoryRouter><HoursOfServiceReport /></MemoryRouter>);

  expect(screen.getByRole('heading', { name: 'HOS calculations are disabled' })).toBeInTheDocument();
  expect(screen.getByText(/used hard-coded driver-hour inputs/i)).toBeInTheDocument();
  expect(screen.getByText(/No remaining-hours, arrival-feasibility, or dispatch-clearance result/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Review SIS Safety requirements' })).toHaveAttribute('href', '/sis/safety');
  expect(screen.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument();
});
