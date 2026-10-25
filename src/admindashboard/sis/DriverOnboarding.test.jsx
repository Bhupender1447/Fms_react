import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import DriverOnboarding from './DriverOnboarding';

function jsonResponse(body, ok = true, status = 200) {
  return Promise.resolve({ ok, status, json: () => Promise.resolve(body) });
}

test('driver onboarding stays unavailable when the migration is not installed', async () => {
  global.fetch = jest.fn((url) => {
    if (String(url).includes('/driver-onboarding/accounts')) {
      return jsonResponse({ status: 'success', accounts: [{ account_id: '1', name: 'Account A' }] });
    }
    if (String(url).includes('/csrf-token')) return jsonResponse({ status: 'success', token: 'a'.repeat(64) });
    return jsonResponse({
      status: 'error',
      reason: 'ONBOARDING_STORAGE_NOT_INSTALLED',
      message: 'SIS driver onboarding is unavailable until its reviewed storage is installed.',
    }, false, 503);
  });

  render(<DriverOnboarding />);
  expect(await screen.findByRole('alert')).toHaveTextContent('reviewed storage is installed');
  await waitFor(() => expect(screen.getByRole('button', { name: 'Submit for review' })).toBeDisabled());
  expect(screen.getByText(/does not create or modify IFM drivers/i)).toBeInTheDocument();
});

test('malformed success-shaped onboarding data fails closed with an actionable error', async () => {
  global.fetch = jest.fn((url) => {
    const requestUrl = String(url);
    if (requestUrl.includes('/driver-onboarding/accounts')) {
      return jsonResponse({ status: 'success', accounts: [{ account_id: '1', name: 'Account A' }] });
    }
    if (requestUrl.includes('/csrf-token')) return jsonResponse({ status: 'success', token: 'e'.repeat(64) });
    return jsonResponse({
      status: 'success',
      records: [{
        onboarding_id: '41',
        driver_id: '71',
        status: 'UNEXPECTED_APPROVAL',
        requested_by_user_id: '10',
        requested_at: '2026-10-24 00:00:00',
        ownership_evidence_reference: 'case-71',
        reviewed_by_user_id: null,
        reviewed_at: null,
        review_reference: null,
        version: '1',
        can_review: true,
      }],
      page: { limit: 50, offset: 0, after_id: null, next_cursor: null, has_more: false },
    });
  });

  render(<DriverOnboarding />);
  expect(await screen.findByRole('alert')).toHaveTextContent('invalid onboarding request page');
  expect(screen.getByRole('button', { name: 'Submit for review' })).toBeDisabled();
  expect(screen.queryByRole('button', { name: 'Approve unlinked' })).not.toBeInTheDocument();
});

test('manual onboarding submits evidence with session-bound CSRF and refreshes the pending record', async () => {
  let listCalls = 0;
  global.fetch = jest.fn((url, options = {}) => {
    const requestUrl = String(url);
    if (requestUrl.includes('/driver-onboarding/accounts')) {
      return jsonResponse({ status: 'success', accounts: [{ account_id: '1', name: 'Account A' }] });
    }
    if (requestUrl.includes('/csrf-token')) return jsonResponse({ status: 'success', token: 'b'.repeat(64) });
    if (requestUrl.includes('/driver-onboarding/request')) {
      return jsonResponse({ status: 'success', onboarding_id: '41', state: 'PENDING_REVIEW' });
    }
    if (requestUrl.includes('/driver-onboarding?')) {
      listCalls += 1;
      return jsonResponse({
        status: 'success',
        records: listCalls === 1 ? [] : [{
          onboarding_id: '41',
          driver_id: '71',
          status: 'PENDING_REVIEW',
          requested_by_user_id: '10',
          requested_at: '2026-10-24 00:00:00',
          ownership_evidence_reference: 'case-71',
          reviewed_by_user_id: null,
          reviewed_at: null,
          review_reference: null,
          version: '1',
          can_review: false,
        }],
        page: { limit: 50, offset: 0, after_id: null, next_cursor: null, has_more: false },
      });
    }
    throw new Error(`Unexpected request: ${requestUrl} ${options.method || 'GET'}`);
  });

  render(<DriverOnboarding />);
  fireEvent.change(await screen.findByLabelText('Internal driver ID'), { target: { value: '71' } });
  fireEvent.change(screen.getByLabelText('Ownership evidence reference'), { target: { value: 'case-71' } });
  await waitFor(() => expect(screen.getByRole('button', { name: 'Submit for review' })).toBeEnabled());
  fireEvent.click(screen.getByRole('button', { name: 'Submit for review' }));

  expect(await screen.findByText('Request submitted for a separate authorized review.')).toBeInTheDocument();
  expect(await screen.findByText('Requester cannot review their own request.')).toBeInTheDocument();
  const requestCall = global.fetch.mock.calls.find(([url, options]) => String(url).includes('/driver-onboarding/request') && options.method === 'POST');
  expect(requestCall).toBeDefined();
  expect(requestCall[1].headers['X-SIS-CSRF']).toBe('b'.repeat(64));
  expect(JSON.parse(requestCall[1].body)).toEqual({
    account_id: '1',
    driver_id: '71',
    ownership_evidence_reference: 'case-71',
  });
  await waitFor(() => expect(listCalls).toBe(2));
});

test('review references stay with their request and approve/reject actions target the selected record', async () => {
  const records = [
    {
      onboarding_id: '41',
      driver_id: '71',
      status: 'PENDING_REVIEW',
      requested_by_user_id: '10',
      requested_at: '2026-10-24 00:00:00',
      ownership_evidence_reference: 'case-71',
      reviewed_by_user_id: null,
      reviewed_at: null,
      review_reference: null,
      version: '1',
      can_review: true,
    },
    {
      onboarding_id: '42',
      driver_id: '72',
      status: 'PENDING_REVIEW',
      requested_by_user_id: '11',
      requested_at: '2026-10-24 00:00:00',
      ownership_evidence_reference: 'case-72',
      reviewed_by_user_id: null,
      reviewed_at: null,
      review_reference: null,
      version: '1',
      can_review: true,
    },
  ];
  const reviewRequests = [];
  global.fetch = jest.fn((url, options = {}) => {
    const requestUrl = String(url);
    if (requestUrl.includes('/driver-onboarding/accounts')) {
      return jsonResponse({ status: 'success', accounts: [{ account_id: '1', name: 'Account A' }] });
    }
    if (requestUrl.includes('/csrf-token')) return jsonResponse({ status: 'success', token: 'c'.repeat(64) });
    if (requestUrl.includes('/driver-onboarding?')) {
      return jsonResponse({
        status: 'success',
        records: records.map((record) => ({ ...record })),
        page: { limit: 50, offset: 0, after_id: null, next_cursor: null, has_more: false },
      });
    }
    const match = requestUrl.match(/\/driver-onboarding\/(\d+)\/review$/);
    if (match && options.method === 'POST') {
      const body = JSON.parse(options.body);
      reviewRequests.push({ onboardingId: match[1], ...body });
      const record = records.find((candidate) => candidate.onboarding_id === match[1]);
      record.status = body.decision === 'approve' ? 'VERIFIED_UNLINKED' : 'REJECTED';
      record.review_reference = body.review_reference;
      record.reviewed_by_user_id = '20';
      record.reviewed_at = record.driver_id === '71' ? '2026-10-24 01:00:00' : '2026-10-24 02:00:00';
      return jsonResponse({ status: 'success', state: record.status });
    }
    throw new Error(`Unexpected request: ${requestUrl} ${options.method || 'GET'}`);
  });

  render(<DriverOnboarding />);
  const firstReference = await screen.findByLabelText('Decision reference for driver 71');
  expect(screen.getByText('Requested by user 10')).toBeInTheDocument();
  expect(screen.getAllByText('2026-10-24 00:00:00 UTC')).toHaveLength(2);
  expect(screen.getAllByText('Not reviewed')).toHaveLength(2);
  const secondReference = screen.getByLabelText('Decision reference for driver 72');
  fireEvent.change(firstReference, { target: { value: 'review-71' } });
  fireEvent.change(secondReference, { target: { value: 'review-72' } });

  const firstRow = screen.getByRole('row', { name: /71.*case-71/ });
  fireEvent.click(within(firstRow).getByRole('button', { name: 'Approve unlinked' }));
  expect(await screen.findByText(/Evidence review recorded/)).toBeInTheDocument();
  expect((await screen.findAllByText('Verified · unlinked')).length).toBeGreaterThan(0);
  expect(await screen.findByText('Reviewed by user 20')).toBeInTheDocument();
  expect(screen.getAllByText('2026-10-24 01:00:00 UTC')).toHaveLength(1);
  expect(screen.getByText('Reference: review-71')).toBeInTheDocument();
  expect(await screen.findByLabelText('Decision reference for driver 72')).toHaveValue('review-72');

  const secondRow = screen.getByRole('row', { name: /72.*case-72/ });
  fireEvent.click(within(secondRow).getByRole('button', { name: 'Reject' }));
  expect(await screen.findByText('Request rejected; no driver or provider records were changed.')).toBeInTheDocument();
  expect(await screen.findByText('REJECTED')).toBeInTheDocument();

  await waitFor(() => expect(reviewRequests).toEqual([
    {
      onboardingId: '41',
      account_id: '1',
      decision: 'approve',
      review_reference: 'review-71',
    },
    {
      onboardingId: '42',
      account_id: '1',
      decision: 'reject',
      review_reference: 'review-72',
    },
  ]));
  expect((await screen.findAllByText('Verified · unlinked')).length).toBeGreaterThan(0);
});

test('onboarding records can be filtered and paged with bounded server requests', async () => {
  const queriedPages = [];
  global.fetch = jest.fn((url) => {
    const requestUrl = String(url);
    if (requestUrl.includes('/driver-onboarding/accounts')) {
      return jsonResponse({ status: 'success', accounts: [{ account_id: '1', name: 'Account A' }] });
    }
    if (requestUrl.includes('/csrf-token')) return jsonResponse({ status: 'success', token: 'd'.repeat(64) });
    if (requestUrl.includes('/driver-onboarding?')) {
      const query = new URL(requestUrl).searchParams;
      const status = query.get('status');
      const afterId = query.get('after_id');
      queriedPages.push({ afterId, status });
      if (status) {
        return jsonResponse({
          status: 'success',
          records: [{
            onboarding_id: '52',
            driver_id: '152',
            status,
            requested_by_user_id: '10',
            requested_at: '2026-10-24 00:00:00',
            ownership_evidence_reference: 'filtered-case',
            reviewed_by_user_id: null,
            reviewed_at: null,
            review_reference: null,
            version: '1',
            can_review: false,
          }],
          page: { limit: 50, offset: 0, after_id: afterId, next_cursor: null, has_more: false },
        });
      }
      return jsonResponse({
        status: 'success',
        records: !afterId
          ? Array.from({ length: 50 }, (_, index) => ({
            onboarding_id: String(100 - index),
            driver_id: String(101 + index),
            status: 'PENDING_REVIEW',
            requested_by_user_id: '10',
            requested_at: '2026-10-24 00:00:00',
            ownership_evidence_reference: `case-${index}`,
            reviewed_by_user_id: null,
            reviewed_at: null,
            review_reference: null,
            version: '1',
            can_review: false,
          }))
          : [{
            onboarding_id: '49',
            driver_id: '151',
            status: 'PENDING_REVIEW',
            requested_by_user_id: '10',
            requested_at: '2026-10-24 00:00:00',
            ownership_evidence_reference: 'case-50',
            reviewed_by_user_id: null,
            reviewed_at: null,
            review_reference: null,
            version: '1',
            can_review: false,
          }],
        page: {
          limit: 50,
          offset: 0,
          after_id: afterId,
          next_cursor: afterId ? null : '51',
          has_more: !afterId,
        },
      });
    }
    throw new Error(`Unexpected request: ${requestUrl}`);
  });

  render(<DriverOnboarding />);
  expect(await screen.findByText('Page 1 · 50 requests')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
  fireEvent.click(screen.getByRole('button', { name: 'Next' }));
  expect(await screen.findByText('Page 2 · 1 request')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
  fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
  expect(await screen.findByText('Page 1 · 50 requests')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Filter requests by status'), { target: { value: 'PENDING_REVIEW' } });
  expect(await screen.findByText('filtered-case')).toBeInTheDocument();
  expect(await screen.findByText('Page 1 · 1 request')).toBeInTheDocument();
  expect(queriedPages).toEqual([
    { afterId: null, status: null },
    { afterId: '51', status: null },
    { afterId: null, status: null },
    { afterId: null, status: 'PENDING_REVIEW' },
  ]);
});
