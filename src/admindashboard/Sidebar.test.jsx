import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

function CurrentPath() {
  return <output aria-label="Current route">{useLocation().pathname}</output>;
}

afterEach(() => localStorage.removeItem('logindetail'));

test('communications routes reveal Workspace and preserve direct Email navigation', () => {
  localStorage.setItem('logindetail', JSON.stringify({ role: 'admin' }));
  render(<MemoryRouter initialEntries={['/workspace/email/accounts']}><Sidebar /></MemoryRouter>);
  expect(screen.getByRole('button', { name: 'Workspace' })).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('link', { name: 'Email & Messaging' })).toHaveAttribute('href', '/workspace/email');
  expect(screen.getByRole('link', { name: 'Email & Messaging' })).toHaveAttribute('aria-current', 'page');
});

test('Driver sidebar entry opens the same command center as the control panel', () => {
  localStorage.setItem('logindetail', JSON.stringify({ role: 'admin' }));
  render(<MemoryRouter initialEntries={['/admin']}><Sidebar /><CurrentPath /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Fleet & Partners' }));
  expect(screen.getByRole('link', { name: 'Driver' })).toHaveAttribute('href', '/drivers');
  fireEvent.click(screen.getByRole('button', { name: 'Driver menu' }));
  expect(screen.getByRole('link', { name: 'Driver Command Center' })).toHaveAttribute('href', '/drivers');
  expect(screen.getByRole('link', { name: 'Driver Listing' })).toHaveAttribute('href', '/drivers/listing');
  fireEvent.click(screen.getByRole('button', { name: 'Documents & Customs' }));
  fireEvent.click(screen.getByRole('button', { name: 'eManifest Portal' }));
  expect(screen.getByRole('link', { name: 'Customs Manifest Review' })).toHaveAttribute('href', '/customs/review');
  fireEvent.click(screen.getByRole('button', { name: 'Fleet & Partners' }));
  fireEvent.click(screen.getByRole('link', { name: 'Driver' }));
  expect(screen.getByLabelText('Current route')).toHaveTextContent('/drivers');
});

test('sidebar follows the operational sequence with clearly labelled sections', () => {
  localStorage.setItem('logindetail', JSON.stringify({ role: 'admin' }));
  render(<MemoryRouter initialEntries={['/admin']}><Sidebar /></MemoryRouter>);
  expect(screen.getByRole('navigation', { name: 'IFM workspace navigation' })).toBeInTheDocument();
  expect(screen.getAllByRole('button').map(element => element.textContent)).toEqual([
    'Workspace', 'Dispatch & Operations', 'Fleet & Partners', 'Documents & Customs',
    'Finance & Reporting', 'Safety & Intelligence', 'Administration',
  ]);
  expect(screen.getAllByRole('link').at(-1)).toHaveTextContent('Logout');
});

test('disclosures use buttons, keep active routes visible and do not collapse on a submenu click', () => {
  localStorage.setItem('logindetail', JSON.stringify({ role: 'agent' }));
  render(<MemoryRouter initialEntries={['/orderlist']}><Sidebar /><CurrentPath /></MemoryRouter>);
  const orders = screen.getByRole('button', { name: 'Orders' });
  expect(orders).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('list', { name: 'Orders links' })).toHaveAttribute('id', orders.getAttribute('aria-controls'));
  fireEvent.click(screen.getByRole('link', { name: 'Create Orders' }));
  expect(screen.getByLabelText('Current route')).toHaveTextContent('/createorder');
  expect(orders).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('link', { name: 'Create Orders' })).toHaveAttribute('aria-current', 'page');
  fireEvent.click(orders);
  expect(orders).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('link', { name: 'Create Orders' })).not.toBeInTheDocument();
  orders.focus();
  expect(orders).toHaveFocus();
  fireEvent.click(orders);
  expect(orders).toHaveAttribute('aria-expanded', 'true');
  expect(screen.queryByRole('link', { name: 'Trips' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Trips' })).toHaveAttribute('type', 'button');
});

test('direct Driver and Invoices navigation stays separate from their menu toggles', () => {
  localStorage.setItem('logindetail', JSON.stringify({ role: 'admin' }));
  render(<MemoryRouter initialEntries={['/admin']}><Sidebar /><CurrentPath /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Finance & Reporting' }));
  fireEvent.click(screen.getByRole('button', { name: 'Invoices menu' }));
  expect(screen.getByLabelText('Current route')).toHaveTextContent('/admin');
  fireEvent.click(screen.getByRole('link', { name: 'Invoices' }));
  expect(screen.getByLabelText('Current route')).toHaveTextContent('/invoices');
  expect(screen.getByRole('link', { name: 'All Invoices' })).toHaveAttribute('aria-current', 'page');
});

test('keyboard Enter and Space operate menu buttons without navigating', async () => {
  localStorage.setItem('logindetail', JSON.stringify({ role: 'admin' }));
  render(<MemoryRouter initialEntries={['/admin']}><Sidebar /><CurrentPath /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Dispatch & Operations' }));
  const trips = screen.getByRole('button', { name: 'Trips' });
  trips.focus();
  // eslint-disable-next-line testing-library/no-unnecessary-act -- This installed keyboard helper does not wrap React updates.
  await act(async () => { await userEvent.keyboard('{Enter}'); });
  expect(trips).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('link', { name: 'Manage Trips' })).toBeVisible();
  // eslint-disable-next-line testing-library/no-unnecessary-act -- This installed keyboard helper does not wrap React updates.
  await act(async () => { await userEvent.keyboard(' '); });
  expect(trips).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('link', { name: 'Manage Trips' })).not.toBeInTheDocument();
  expect(screen.getByLabelText('Current route')).toHaveTextContent('/admin');
});

test('only one top-level category opens at a time and the active route opens its category', () => {
  localStorage.setItem('logindetail', JSON.stringify({ role: 'admin' }));
  render(<MemoryRouter initialEntries={['/admin']}><Sidebar /><CurrentPath /></MemoryRouter>);
  const workspace = screen.getByRole('button', { name: 'Workspace' });
  const fleet = screen.getByRole('button', { name: 'Fleet & Partners' });
  expect(workspace).toHaveAttribute('aria-expanded', 'true');
  expect(screen.queryByRole('link', { name: 'Driver' })).not.toBeInTheDocument();
  fireEvent.click(fleet);
  expect(workspace).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('link', { name: 'Control Panel' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: 'Driver' }));
  expect(fleet).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('link', { name: 'Driver Command Center' })).toHaveAttribute('aria-current', 'page');
  fireEvent.click(fleet);
  expect(fleet).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getAllByRole('link')).toHaveLength(1);
  expect(screen.getByRole('link', { name: 'Logout' })).toBeInTheDocument();
});

test('top-level category buttons support keyboard activation', async () => {
  localStorage.setItem('logindetail', JSON.stringify({ role: 'admin' }));
  render(<MemoryRouter initialEntries={['/admin']}><Sidebar /></MemoryRouter>);
  const safety = screen.getByRole('button', { name: 'Safety & Intelligence' });
  safety.focus();
  // eslint-disable-next-line testing-library/no-unnecessary-act -- This installed keyboard helper does not wrap React updates.
  await act(async () => { await userEvent.keyboard('{Enter}'); });
  expect(safety).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('link', { name: 'SIS Safety' })).toBeVisible();
  // eslint-disable-next-line testing-library/no-unnecessary-act -- This installed keyboard helper does not wrap React updates.
  await act(async () => { await userEvent.keyboard(' '); });
  expect(safety).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('link', { name: 'SIS Safety' })).not.toBeInTheDocument();
});

test('reorganization preserves every existing destination including hidden submenus', () => {
  localStorage.setItem('logindetail', JSON.stringify({ role: 'admin' }));
  render(<MemoryRouter initialEntries={['/admin']}><Sidebar /></MemoryRouter>);
  const destinations = [...new Set(screen.getAllByRole('link', { hidden: true }).map(link => link.getAttribute('href')))].sort();
  expect(destinations).toEqual([
    '/accounting', '/admin', '/workspace/email', '/loadboard', '/loadboard/ratex-index', '/sis/connections', '/sis/review', '/sis/native-eld', '/sis/world-model', '/sis/safety', '/sis/driver-onboarding',
    '/tripsmap', '/routes/create', '/routes/manage', '/createorder', '/orderlist', '/createtrips', '/triplist',
    '/drivers', '/drivers/listing', '/driverpaylist', '/driverbulkupload', '/truckbulk', '/truckfaults',
    '/truckcompliancechecklist', '/truckexpirychecklist', '/trailerbulk', '/trailerPerformance', '/addTrailerActivity',
    '/ownerfleetsummary', '/accountspayablereceivablelist', '/revenuerxpenseslist', '/agentpaylist',
    '/carriers', '/carriers/updateupload', '/carriers/autosuspend', '/custompage', '/customs/review',
    '/listcoversheet', '/borderconnect/acetripform', '/borderconnect/acitripform', '/gomotive/vehicletable',
    '/samsara/samsarausers', '/driverdutynotification', '/hos-fleet', '/hos/company-settings', '/invoices', '/invoices?status=draft',
    '/invoices?status=pending', '/invoices?status=overdue', '/invoices?status=paid', '/invoices?status=credit_notes',
    '/iftalist', '/ocrexpensestable', '/netincometable', '/financeManager', '/getOrderincome', '/ordertripIncome',
    '/getexpense', '/gettripIncome', '/orderhistory', '/users/setting', '/configurations', '/agentlist', '/alllogin',
  ].sort());
  expect(destinations).not.toContain('#');
});

test('sidebar navigation retains the existing unauthenticated login redirect', () => {
  localStorage.removeItem('logindetail');
  render(<MemoryRouter initialEntries={['/drivers']}><Sidebar /><CurrentPath /></MemoryRouter>);
  expect(screen.getByLabelText('Current route')).toHaveTextContent('/alllogin');
});

test('Ratex Index is a Loadboard subcategory and preserves direct board navigation', () => {
  localStorage.setItem('logindetail', JSON.stringify({ role: 'admin' }));
  render(<MemoryRouter initialEntries={['/loadboard/ratex-index']}><Sidebar /><CurrentPath /></MemoryRouter>);
  expect(screen.getByRole('button', { name: 'Dispatch & Operations' })).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('button', { name: 'Loadboard menu' })).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('link', { name: 'Ratex Index' })).toHaveAttribute('aria-current', 'page');
  fireEvent.click(screen.getByRole('link', { name: 'Loadboard', exact: true }));
  expect(screen.getByLabelText('Current route')).toHaveTextContent('/loadboard');
  expect(screen.getByRole('link', { name: 'Load Board' })).toHaveAttribute('aria-current', 'page');
  fireEvent.click(screen.getByRole('link', { name: 'Ratex Index' }));
  expect(screen.getByLabelText('Current route')).toHaveTextContent('/loadboard/ratex-index');
});

test('invoice sidebar opens distinct query views and marks only the selected view current', () => {
  localStorage.setItem('logindetail', JSON.stringify({ role: 'admin' }));
  render(<MemoryRouter initialEntries={['/invoices?status=paid']}><Sidebar /><CurrentPath /></MemoryRouter>);
  expect(screen.getByRole('link', { name: 'Invoices' })).toHaveAttribute('href', '/invoices');
  expect(screen.getByRole('link', { name: 'Paid Invoices' })).toHaveAttribute('href', '/invoices?status=paid');
  expect(screen.getByRole('link', { name: 'Paid Invoices' })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('link', { name: 'All Invoices' })).not.toHaveAttribute('aria-current');
  fireEvent.click(screen.getByRole('link', { name: 'Pending Invoices' }));
  expect(screen.getByRole('link', { name: 'Pending Invoices' })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('link', { name: 'Paid Invoices' })).not.toHaveAttribute('aria-current');
  expect(screen.getByRole('link', { name: 'Credit Notes' })).toHaveAttribute('href', '/invoices?status=credit_notes');
});
