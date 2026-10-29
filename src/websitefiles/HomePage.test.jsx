import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
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
  expect(screen.getByText(/Concept animation, not live tracking/)).toBeVisible();
  expect(screen.getByText(/No customer, location, revenue, or performance metrics/)).toBeVisible();
  expect(screen.getByRole('main')).toHaveAttribute('id', 'isovia-page-content');
  expect(screen.getByRole('region', { name: 'Keep every handoff in view.' })).toHaveAttribute('id', 'ifm-workflow');
  expect(screen.getByRole('region', { name: 'Built around the whole move.' })).toHaveAttribute('id', 'products');
  expect(screen.getByRole('region', { name: /Intelligence with a clear foundation/ })).toHaveAttribute('id', 'sis-foundations');
});

test('workflow film is user-controlled, inline, and avoids preloading the large recording', () => {
  renderHome();
  const video = screen.getByLabelText('Dispatch and delivery cycle workflow film');
  expect(video).toHaveAttribute('controls');
  expect(video).toHaveAttribute('playsinline');
  expect(video).toHaveAttribute('preload', 'none');
  expect(video).not.toHaveAttribute('autoplay');
  expect(video).not.toHaveAttribute('loop');
  expect(video).toHaveAttribute('src', '/media/isovia-overview.mp4');
  expect(screen.getByRole('link', { name: /Explore the workflow/ })).toHaveAttribute('href', '#workflow-film');
  expect(screen.getByRole('navigation', { name: 'Explore the Isovia platform' })).toBeInTheDocument();
});

test('video failure presents a readable fallback and a direct file link', () => {
  renderHome();
  fireEvent.error(screen.getByLabelText('Dispatch and delivery cycle workflow film'));
  expect(screen.getByRole('alert')).toHaveTextContent('The workflow video could not be played.');
  expect(screen.getByRole('link', { name: /Open video file/ })).toHaveAttribute('href', '/media/isovia-overview.mp4');
});
