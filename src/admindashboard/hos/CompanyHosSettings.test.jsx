import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CompanyHosSettings from './CompanyHosSettings';

function mount() { return render(<MemoryRouter><CompanyHosSettings /></MemoryRouter>); }
function enter(cycle = '60_7', schedule = 'not-every-day') {
  fireEvent.change(screen.getByLabelText('Carrier operating schedule'), { target: { value: schedule } });
  fireEvent.change(screen.getByLabelText('Cycle selection'), { target: { value: cycle } });
  fireEvent.change(screen.getByLabelText('Home-terminal timezone'), { target: { value: 'America/Toronto' } });
  fireEvent.change(screen.getByLabelText('Review reference'), { target: { value: 'synthetic-review' } });
}

test('no company or cycle is guessed and saving stays unavailable', () => {
  mount();
  expect(screen.getByLabelText('Authorized company')).toBeDisabled();
  expect(screen.getByLabelText('Carrier operating schedule')).toHaveValue('');
  expect(screen.getByLabelText('Cycle selection')).toHaveValue('');
  expect(screen.getByLabelText('Home-terminal timezone')).toHaveValue('');
  expect(screen.getByRole('button', { name: 'Save company settings' })).toBeDisabled();
  expect(screen.getByText(/Entries are lost on navigation or refresh/)).toBeInTheDocument();
});

test.each([['60_7', 'not-every-day', '60 hours / 7 days'], ['70_8', 'every-day', '70 hours / 8 days']])('company proposal accepts explicit applicable %s without saving', (cycle, schedule, label) => {
  mount(); enter(cycle, schedule);
  fireEvent.click(screen.getByRole('button', { name: 'Review local proposal' }));
  expect(screen.getByRole('region', { name: 'Local policy proposal' })).toHaveTextContent(label);
  expect(screen.getByRole('heading', { name: 'Unsaved proposal — not assigned to a company' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Save company settings' })).toBeDisabled();
});

test('required fields display accessible field-specific errors', () => {
  mount();
  fireEvent.click(screen.getByRole('button', { name: 'Review local proposal' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Correct the highlighted');
  for (const label of ['Carrier operating schedule', 'Cycle selection', 'Home-terminal timezone', 'Review reference']) {
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-invalid', 'true');
  }
});

test('cycle and carrier applicability cannot contradict each other', () => {
  mount(); enter('70_8', 'not-every-day');
  fireEvent.click(screen.getByRole('button', { name: 'Review local proposal' }));
  expect(screen.getByText('The cycle must match the selected carrier operating schedule.')).toBeInTheDocument();
  expect(screen.queryByRole('region', { name: 'Local policy proposal' })).not.toBeInTheDocument();
});

test.each(['not-a-zone', '+05:00', 'EST'])('rejects ambiguous or invalid timezone %s', zone => {
  mount(); enter();
  fireEvent.change(screen.getByLabelText('Home-terminal timezone'), { target: { value: zone } });
  fireEvent.click(screen.getByRole('button', { name: 'Review local proposal' }));
  expect(screen.getByLabelText('Home-terminal timezone')).toHaveAttribute('aria-invalid', 'true');
});

test('edits invalidate a reviewed proposal and Clear erases only local fields', () => {
  mount(); enter();
  fireEvent.click(screen.getByRole('button', { name: 'Review local proposal' }));
  fireEvent.change(screen.getByLabelText('Review reference'), { target: { value: 'changed-reference' } });
  expect(screen.queryByRole('region', { name: 'Local policy proposal' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Clear proposal' }));
  expect(screen.getByLabelText('Cycle selection')).toHaveValue('');
  expect(screen.getByLabelText('Review reference')).toHaveValue('');
});

test('UTF8 reference size and history continuity warnings are explicit', () => {
  mount(); enter();
  fireEvent.change(screen.getByLabelText('Review reference'), { target: { value: '\u00e9'.repeat(81) } });
  fireEvent.click(screen.getByRole('button', { name: 'Review local proposal' }));
  expect(screen.getByLabelText('Review reference')).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByText(/must never reset the driver's all-carrier duty history/)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Return to Driver/ })).toHaveAttribute('href', '/hos-fleet');
});
