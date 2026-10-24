import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import EntryFormGuide from './EntryFormGuide';

test('shows missing selections and keeps the review action available', () => {
  const review = jest.fn();
  const { rerender } = render(<EntryFormGuide kind="order" values={{}} onReview={review} />);
  expect(screen.getByText(/0 of 4 required selections entered/)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Pickup needed/ })).toHaveAttribute('href', '#order-route-details');
  fireEvent.click(screen.getByRole('button', { name: /Review & save/ }));
  expect(review).toHaveBeenCalledTimes(1);
  rerender(<EntryFormGuide kind="order" values={{ company: 'Example', customer_id: '7', pickup_from: '1', delivery: '2' }} onReview={review} />);
  expect(screen.getByText(/4 of 4 required selections entered/)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Customer entered/ })).toBeInTheDocument();
});
