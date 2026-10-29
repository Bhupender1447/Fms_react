import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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
    fireEvent.click(screen.getByRole('button', { name: 'Safety & Intelligence' }));
    expect(screen.getByRole('link', { name: /SIS Connections/ })).toHaveAttribute('href', '/sis/connections');
  } finally {
    localStorage.removeItem('logindetail');
  }
});

test('five foundations show their actual delivery state and disclose readiness on demand', () => {
  render(<MemoryRouter><Connections /></MemoryRouter>);
  const section = screen.getByRole('region', { name: 'Five parts. One accountable flow.' });
  const details = section.querySelectorAll('details');
  expect(details).toHaveLength(5);
  ['World Model', 'Event Engine', 'Governance Engine', 'Decision Ledger', 'Supervisor'].forEach(name => expect(screen.getByRole('heading', { name, exact: true })).toBeVisible());
  expect(screen.getByText('Read-only prototype')).toBeVisible();
  expect(screen.getByText('Contract only')).toBeVisible();
  expect(screen.getAllByText('Planned')).toHaveLength(3);
  expect(details[0]).not.toHaveAttribute('open');
  details[0].setAttribute('open', '');
  expect(screen.getByRole('link', { name: 'Inspect account context' })).toHaveAttribute('href', '/sis/world-model');
  expect(screen.queryByRole('button', { name: /approve|execute|dispatch/i })).not.toBeInTheDocument();
});
