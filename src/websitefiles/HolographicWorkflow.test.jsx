import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import HolographicWorkflow from './HolographicWorkflow';

test('cycle advances only when playing, pauses on selection, and resets', () => {
  jest.useFakeTimers();
  const view = render(<HolographicWorkflow />);
  expect(screen.getByRole('button', { name: 'Stage 1: Load creation' })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Play cycle' }));
  act(() => jest.advanceTimersByTime(3000));
  expect(screen.getByRole('button', { name: 'Stage 2: Dispatch' })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Stage 5: Delivery' }));
  act(() => jest.advanceTimersByTime(6000));
  expect(screen.getByRole('button', { name: 'Stage 5: Delivery' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: 'Play cycle' })).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Restart workflow cycle' }));
  expect(screen.getByRole('button', { name: 'Stage 1: Load creation' })).toHaveAttribute('aria-pressed', 'true');
  view.unmount();
  expect(jest.getTimerCount()).toBe(0);
  jest.useRealTimers();
});
