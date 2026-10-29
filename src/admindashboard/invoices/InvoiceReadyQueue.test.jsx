import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import InvoiceReadyQueue from './InvoiceReadyQueue';

const item = {
  accountId: 'A', shipmentId: 'SHIP-1', billingState: 'unbilled',
  sources: [{ type: 'order', id: 'O-1', state: 'completed' }, { type: 'trip', id: 'T-1', state: 'in_progress' }, { type: 'route', id: 'R-1', state: 'completed' }],
};

test('queue shows all linked IDs once, truthful completion and locked review action', () => {
  render(<InvoiceReadyQueue shipments={[item]} accountId="A" />);
  expect(screen.getAllByRole('rowheader')).toHaveLength(1);
  for (const id of ['O-1', 'T-1', 'R-1']) expect(screen.getByRole('cell', { name: id })).toBeInTheDocument();
  expect(screen.getByText('trip T-1: in progress')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Review / Prepare draft' })).toBeDisabled();
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'R-1' } });
  expect(screen.getByRole('rowheader', { name: 'SHIP-1' })).toBeInTheDocument();
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'missing' } });
  expect(screen.getByText('No matching invoice-ready shipments')).toBeInTheDocument();
});

test('unconnected and unauthorized projections never show live-ready records', () => {
  const view = render(<InvoiceReadyQueue />);
  expect(screen.getByText('Completion queue not connected')).toBeInTheDocument();
  view.rerender(<InvoiceReadyQueue shipments={[item]} accountId="B" />);
  expect(screen.getByRole('alert')).toHaveTextContent('account');
  expect(screen.queryByRole('rowheader')).not.toBeInTheDocument();
});

test('queue pagination is bounded and search resets the page', () => {
  const shipments = Array.from({ length: 25 }, (_, index) => ({
    ...item, shipmentId: `SHIP-${index}`, sources: [{ type: 'order', id: `O-${index}`, state: 'completed' }],
  }));
  render(<InvoiceReadyQueue shipments={shipments} accountId="A" />);
  expect(screen.getAllByRole('rowheader')).toHaveLength(12);
  fireEvent.click(screen.getByRole('button', { name: 'Next ready page' }));
  expect(screen.getByText('Ready page 2 of 3')).toBeInTheDocument();
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'O-24' } });
  expect(screen.getAllByRole('rowheader')).toHaveLength(1);
  expect(screen.getByText('Ready page 1 of 1')).toBeInTheDocument();
});
