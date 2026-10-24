import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Safety from './Safety';
import Sidebar from '../Sidebar';

test('unconnected safety view never turns unknown evidence into clearance or makes operational requests', () => {
  const originalFetch = global.fetch;
  const fetchSpy = jest.fn();
  global.fetch = fetchSpy;
  try {
    render(<Safety />);
    expect(screen.getByRole('heading', { name: 'SIS Safety', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Live safety assessment is not connected.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Operational alerts unavailable' })).toBeInTheDocument();
    expect(screen.getByText(/not a report of zero risks/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Safety overview' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByRole('button', { name: /approve|dispatch|edit.*log/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /explore evidence requirements/i }));
    expect(screen.getByText(/required inputs, not completed checks/i)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  } finally {
    global.fetch = originalFetch;
  }
});

test('domain review and filtering keep unknown evidence visible without persisting completion', () => {
  const { unmount } = render(<Safety />);
  fireEvent.click(screen.getByRole('button', { name: 'Review Hours of service evidence' }));
  expect(screen.getByRole('button', { name: 'Evidence requirements' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByLabelText('Safety area')).toHaveValue('hos');
  const evidence = screen.getByRole('region', { name: 'Evidence requirements' });
  expect(within(evidence).getByText('Evidence unavailable')).toBeInTheDocument();
  expect(within(evidence).getByText(/complete duty history/i)).toBeInTheDocument();
  expect(within(evidence).queryByRole('heading', { name: /Vehicle inspections/ })).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Safety area'), { target: { value: 'vehicle' } });
  expect(within(evidence).getByRole('heading', { name: 'Vehicle inspections & maintenance' })).toBeInTheDocument();
  expect(within(evidence).getByText(/applicable driver inspection/i)).toBeInTheDocument();
  expect(within(evidence).queryByRole('checkbox')).not.toBeInTheDocument();
  unmount();
  render(<Safety />);
  expect(screen.getByRole('button', { name: 'Safety overview' })).toHaveAttribute('aria-pressed', 'true');
});

test('references point to federal primary sources and distinguish reference scope from approval', () => {
  render(<Safety />);
  fireEvent.click(screen.getByRole('button', { name: 'U.S. references' }));
  const references = screen.getByRole('region', { name: 'U.S. references' });
  expect(within(references).getByText(/References checked October 22, 2026/)).toBeInTheDocument();
  expect(screen.getByText(/not a complete USDOT compliance program/i)).toBeInTheDocument();
  expect(within(references).getByRole('link', { name: /49 CFR 395.3/ })).toBeInTheDocument();
  within(references).getAllByRole('link').forEach((link) => {
    const url = new URL(link.href);
    expect(url.protocol).toBe('https:');
    expect(['www.ecfr.gov', 'www.fmcsa.dot.gov', 'eld.fmcsa.dot.gov']).toContain(url.hostname);
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
  fireEvent.change(screen.getByLabelText('Safety area'), { target: { value: 'records' } });
  expect(within(references).getByText(/SIS does not edit official logs/)).toBeInTheDocument();
});

test('existing sidebar exposes the SIS Safety route beside World Model', () => {
  localStorage.setItem('logindetail', JSON.stringify({ role: 'admin' }));
  try {
    render(<MemoryRouter initialEntries={['/sis/safety']}><Sidebar /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'SIS Safety' })).toHaveAttribute('href', '/sis/safety');
    expect(screen.getByRole('link', { name: 'World Model' })).toHaveAttribute('href', '/sis/world-model');
    const activeItem = screen.getAllByRole('listitem').find((item) => within(item).queryByRole('link', { name: 'SIS Safety' }));
    expect(activeItem).toHaveClass('active');
  } finally {
    localStorage.removeItem('logindetail');
  }
});
