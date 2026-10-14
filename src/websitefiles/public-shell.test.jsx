import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

test('navigation opens with an accurate state and Escape restores focus', () => {
  render(<MemoryRouter><Header /></MemoryRouter>);
  const menu = screen.getByRole('button', { name: 'Menu' });
  expect(menu).toHaveAttribute('aria-expanded', 'false');
  act(() => { userEvent.click(menu); });
  expect(menu).toHaveAttribute('aria-expanded', 'true');
  screen.getByRole('link', { name: 'IFM platform' }).focus();
  act(() => { userEvent.keyboard('{Escape}'); });
  expect(menu).toHaveAttribute('aria-expanded', 'false');
  expect(menu).toHaveFocus();
});

test('following a navigation link closes the menu without Bootstrap JavaScript', () => {
  render(<MemoryRouter><Header /></MemoryRouter>);
  const menu = screen.getByRole('button', { name: 'Menu' });
  act(() => { userEvent.click(menu); });
  act(() => { userEvent.click(screen.getByRole('link', { name: 'News' })); });
  expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('footer role links use existing login routes and preserve contact destinations', () => {
  render(<MemoryRouter><Footer /></MemoryRouter>);
  expect(screen.getByRole('link', { name: 'Admin access' })).toHaveAttribute('href', '/admin-login');
  expect(screen.getByRole('link', { name: 'Agent access' })).toHaveAttribute('href', '/agents-login');
  expect(screen.getByRole('link', { name: 'Driver access' })).toHaveAttribute('href', '/driver-login');
  expect(screen.getByRole('link', { name: '+1 647 241 5999' })).toHaveAttribute('href', 'tel:+16472415999');
});
