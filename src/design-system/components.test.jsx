import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert, Badge, Button, Input, Select } from './components';

test('fields expose labels, help, and validation errors', () => {
  render(<><Input label="Order number" help="Customer reference" /><Input label="Pickup" error="Required address" /><Select label="Equipment"><option>Dry van</option></Select></>);
  expect(screen.getByLabelText('Order number')).toHaveAccessibleDescription('Customer reference');
  expect(screen.getByLabelText('Pickup')).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByLabelText('Pickup')).toHaveAccessibleDescription('Required address');
  expect(screen.getByRole('combobox', { name: 'Equipment' })).toBeInTheDocument();
});

test('keyboard activation works and disabled buttons are skipped', () => {
  const action = jest.fn();
  render(<><Button onClick={action}>Refresh</Button><Button disabled onClick={action}>Dispatch</Button><Input label="Search" /></>);
  userEvent.tab(); expect(screen.getByRole('button', { name: 'Refresh' })).toHaveFocus();
  userEvent.keyboard('{Enter}'); expect(action).toHaveBeenCalledTimes(1);
  userEvent.tab(); expect(screen.getByLabelText('Search')).toHaveFocus();
  userEvent.click(screen.getByRole('button', { name: 'Dispatch' })); expect(action).toHaveBeenCalledTimes(1);
});

test('alerts and badges communicate status without color alone', () => {
  render(<><Alert tone="danger" title="Unavailable">Retry</Alert><Alert title="Stored data">Not live</Alert><Badge tone="warning">Unverified</Badge></>);
  expect(screen.getByRole('alert')).toHaveTextContent('Unavailable');
  expect(screen.getByRole('status')).toHaveTextContent('Stored data');
  expect(screen.getByText('Unverified')).toBeVisible();
});
