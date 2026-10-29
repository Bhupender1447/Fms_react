import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NativeEldPrototype from './NativeEldPrototype';
jest.mock('./NativeEldCaptures', () => () => null);

const show = () => render(<MemoryRouter><NativeEldPrototype /></MemoryRouter>);
test('lab begins empty and requires an explicit synthetic example or pasted batch', () => {
  show(); expect(screen.getByText('No prototype report yet')).toBeVisible();
  expect(screen.getByLabelText('Prototype event batch (JSON)')).toHaveValue('');
  expect(screen.getByRole('button', { name: 'Validate prototype session' })).toBeDisabled();
  expect(screen.queryByText('EXAMPLE-DRIVER')).not.toBeInTheDocument();
});
test('explicit example produces a prototype timeline, and edits immediately invalidate its result', () => {
  show(); fireEvent.click(screen.getByRole('button', { name: 'Load synthetic example' }));
  expect(screen.getByText(/Synthetic example loaded/)).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Validate prototype session' }));
  expect(screen.getByText(/Schema checks passed/)).toBeVisible();
  expect(screen.getByLabelText('Prototype duty timeline')).toBeVisible();
  expect(screen.getByText('EXAMPLE-DRIVER')).toBeVisible();
  expect(screen.queryByRole('button', { name: /certify|approve|dispatch|start recording/i })).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Prototype event batch (JSON)'), { target: { value: '{}' } });
  expect(screen.queryByLabelText('Prototype duty timeline')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Export prototype report' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Validate prototype session' }));
  expect(screen.getByLabelText('Prototype validation issues')).toBeVisible();
});
test('Clear removes input and derived report without storing a device or record', () => {
  show(); fireEvent.click(screen.getByRole('button', { name: 'Load synthetic example' })); fireEvent.click(screen.getByRole('button', { name: 'Validate prototype session' }));
  fireEvent.click(screen.getByRole('button', { name: 'Clear session' }));
  expect(screen.getByLabelText('Prototype event batch (JSON)')).toHaveValue(''); expect(screen.getByText('No prototype report yet')).toBeVisible();
});
test('export is an explicitly untrusted local prototype report', () => {
  jest.useFakeTimers();
  const create = URL.createObjectURL; const revoke = URL.revokeObjectURL;
  URL.createObjectURL = jest.fn(() => 'blob:prototype'); URL.revokeObjectURL = jest.fn();
  const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  try {
    show(); fireEvent.click(screen.getByRole('button', { name: 'Load synthetic example' })); fireEvent.click(screen.getByRole('button', { name: 'Validate prototype session' }));
    fireEvent.click(screen.getByRole('button', { name: 'Export prototype report' }));
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob)); expect(click).toHaveBeenCalledTimes(1);
    jest.runOnlyPendingTimers(); expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:prototype');
  } finally { jest.runOnlyPendingTimers(); jest.useRealTimers(); URL.createObjectURL = create; URL.revokeObjectURL = revoke; click.mockRestore(); }
});
