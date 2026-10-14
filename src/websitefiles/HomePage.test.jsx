import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './Home';

function renderHome() { return render(<HelmetProvider><MemoryRouter><Home /></MemoryRouter></HelmetProvider>); }

test('homepage shows six product showcases with explicit implementation limits', () => {
  renderHome();
  const section = screen.getByRole('region', { name: 'Built around the whole move.' });
  expect(within(section).getAllByRole('article')).toHaveLength(6);
  ['IFM', 'ILB', 'Driver App', 'Visibility', 'SIS', 'IRA'].forEach((name) => expect(within(section).getByRole('heading', { name, exact: true })).toBeInTheDocument());
  expect(within(section).getByText('Under development')).toBeVisible();
  expect(within(section).getByText('Planned concept')).toBeVisible();
  expect(within(section).getByText(/External publication, live load feeds, matching, and bidding are not connected/)).toBeVisible();
});

test('all five SIS foundations are described without claiming autonomous execution', () => {
  renderHome();
  const section = screen.getByRole('region', { name: /Intelligence with a clear foundation/ });
  ['World Model', 'Event Engine', 'Governance Engine', 'Decision Ledger', 'Supervisor'].forEach((name) => expect(within(section).getByRole('heading', { name })).toBeInTheDocument());
  expect(within(section).getByText('No autonomous execution implemented')).toBeVisible();
  expect(within(section).getAllByText('Planned')).toHaveLength(4);
});

test('calls to action use real destinations and illustrations disclose their source limits', () => {
  renderHome();
  expect(screen.getByRole('link', { name: /Open your workspace/ })).toHaveAttribute('href', '/alllogin');
  screen.getAllByRole('link', { name: /Request a walkthrough/ }).forEach((link) => expect(link.getAttribute('href')).toMatch(/^mailto:Isoviafreightmanagement@gmail.com/));
  expect(screen.getByText('Connected freight illustration. No live tracking data.')).toBeVisible();
  expect(screen.getByText(/No customer, location, revenue, or performance metrics/)).toBeVisible();
  expect(screen.getByRole('main')).toHaveAttribute('id', 'isovia-page-content');
  expect(document.getElementById('ifm-workflow')).toBeInTheDocument();
  expect(document.getElementById('products')).toBeInTheDocument();
  expect(document.getElementById('sis-foundations')).toBeInTheDocument();
});
