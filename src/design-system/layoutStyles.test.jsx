import React, { StrictMode } from 'react';
import { render } from '@testing-library/react';
import { acquireStylesheets, useLayoutStyles } from './layoutStyles';
import WebsiteLayout from '../WebsiteLayout';
import AdminLayout from '../AdminLayout';

jest.mock('./layoutStyles', () => ({
  ...jest.requireActual('./layoutStyles'),
  // External scripts must not run in a stylesheet lifecycle test.
  loadLayoutScript: jest.fn(() => new Promise(() => {})),
}));
const PUBLIC = ['/test-public.css', '/test-shared.css'];
const ADMIN = ['/test-admin.css', '/test-shared.css'];
function Shell({ publicLayout }) { useLayoutStyles(publicLayout ? PUBLIC : ADMIN, publicLayout ? 'public' : 'operational'); return null; }

test('route styles are isolated through StrictMode transitions', () => {
  const { rerender, unmount } = render(<StrictMode><Shell publicLayout /></StrictMode>);
  expect(document.querySelectorAll('link[data-iso-layout-style]').length).toBe(2);
  rerender(<StrictMode><Shell publicLayout={false} /></StrictMode>);
  expect(document.querySelector('link[href$="test-public.css"]')).toBeNull();
  expect(document.querySelector('link[href$="test-admin.css"]')).toBeInTheDocument();
  expect(document.querySelectorAll('link[href$="test-shared.css"]').length).toBe(1);
  unmount(); expect(document.querySelectorAll('link[data-iso-layout-style]').length).toBe(0);
});

test('overlapping owners keep shared styles until both release', () => {
  const releasePublic = acquireStylesheets(PUBLIC, 'public');
  const releaseAdmin = acquireStylesheets(ADMIN, 'operational');
  releasePublic(); releasePublic();
  expect(document.querySelector('link[href$="test-shared.css"]')).toBeInTheDocument();
  releaseAdmin(); expect(document.querySelector('link[href$="test-shared.css"]')).toBeNull();
});

test('styles belonging to another owner are preserved', () => {
  const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = '/test-borrowed.css'; document.head.appendChild(link);
  acquireStylesheets(['/test-borrowed.css'], 'operational')();
  expect(link).toBeInTheDocument(); link.remove();
});

test('the actual public and admin layouts release their own legacy styles', () => {
  const { rerender, unmount } = render(<WebsiteLayout />);
  expect(document.querySelector('link[href$="websitecss/ISOVIA.CSS"]')).toBeInTheDocument();
  expect(document.querySelector('link[href$="admin-modern.css"]')).toBeNull();
  rerender(<AdminLayout />);
  expect(document.querySelector('link[href$="websitecss/ISOVIA.CSS"]')).toBeNull();
  expect(document.querySelector('link[href*="bootstrap@5.2.3"]')).toBeNull();
  expect(document.querySelector('link[href$="admin-modern.css"]')).toBeInTheDocument();
  expect(document.querySelector('link[href$="AdminLTE.min.css"]')).toBeInTheDocument();
  unmount();
  expect(document.querySelectorAll('link[data-iso-layout-style]').length).toBe(0);
});
