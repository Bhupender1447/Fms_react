import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Connections from './Connections';
import Sidebar from '../Sidebar';

test('SIS connections hub links all requested workspaces without claiming operational readiness', () => {
  render(<MemoryRouter><Connections /></MemoryRouter>);

  expect(screen.getByRole('heading', { name: 'SIS connections' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Open driver onboarding/ })).toHaveAttribute('href', '/sis/driver-onboarding');
  expect(screen.getByRole('link', { name: /Open World Model/ })).toHaveAttribute('href', '/sis/world-model');
  expect(screen.getByRole('link', { name: /Open legacy Motive data/ })).toHaveAttribute('href', '/gomotive/vehicletable');
  expect(screen.getByRole('link', { name: /Open legacy Samsara data/ })).toHaveAttribute('href', '/samsara/samsarausers');
  expect(screen.getByRole('link', { name: /Open SIS Safety/ })).toHaveAttribute('href', '/sis/safety');
  expect(screen.getByRole('link', { name: /Open legacy HOS view/ })).toHaveAttribute('href', '/hos-fleet');
  expect(screen.getByText(/Navigation is connected; operational integrations are not certified/)).toBeInTheDocument();
  expect(screen.getByText(/NOT ASSESSED · calculations disabled/)).toBeInTheDocument();
  expect(screen.getByText(/not verified as SIS sources/i)).toBeInTheDocument();
});

test('sidebar exposes the SIS connections overview', () => {
  localStorage.setItem('logindetail', JSON.stringify({ role: 'admin' }));
  try {
    render(<MemoryRouter><Sidebar /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /SIS Connections/ })).toHaveAttribute('href', '/sis/connections');
  } finally {
    localStorage.removeItem('logindetail');
  }
});
